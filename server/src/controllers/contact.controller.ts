import { Request, Response, NextFunction } from 'express';
import { Contact } from '@/models/Contact.model';
import { IApiResponse, IPaginationResponse, IContactFormData } from '@/types';
import { logger } from '@/utils/logger';
import { emailService } from '@/config/email';

export class ContactController {
  /**
   * Submit contact form
   */
  static async submitContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, subject, message } = req.body as IContactFormData;

      // Create contact
      const contact = await Contact.create({
        name,
        email,
        subject,
        message,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      logger.info(`New contact submitted: ${name} (${email})`);

      // Send confirmation email
      await emailService.sendContactConfirmation(name, email, message);

      // Send notification to admin
      await emailService.sendNewContactNotification(name, email, message, req.ip);

      res.status(201).json({
        success: true,
        data: contact,
        message: 'Contact form submitted successfully'
      } as IApiResponse);

    } catch (error) {
      logger.error('Error submitting contact:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to submit contact form',
          code: 'CONTACT_SUBMIT_ERROR'
        }
      } as IApiResponse);
    }
  }

  /**
   * Get all contacts with pagination
   */
  static async getAllContacts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const search = req.query.search as string;

      const skip = (page - 1) * limit;
      const contacts = await Contact.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email avatar')
        .lean();

      const total = await Contact.countDocuments();

      const response: IPaginationResponse<any> = {
        success: true,
        data: contacts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };

      res.status(200).json(response);

    } catch (error) {
      logger.error('Error fetching contacts:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch contacts',
          code: 'CONTACT_FETCH_ERROR'
        }
      } as IApiResponse);
    }
  }

  /**
   * Get contact by ID
   */
  static async getContactById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const contact = await Contact.findById(id);

      if (!contact) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Contact not found',
            code: 'CONTACT_NOT_FOUND'
          }
        } as IApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: contact,
        message: 'Contact retrieved successfully'
      } as IApiResponse);

    } catch (error) {
      logger.error('Error fetching contact:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch contact',
          code: 'CONTACT_FETCH_ERROR'
        }
      } as IApiResponse);
    }
  }

  /**
   * Update contact status
   */
  static async updateContactStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const contact = await Contact.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      logger.info(`Contact ${id} status updated to: ${status}`);

      res.status(200).json({
        success: true,
        data: contact,
        message: 'Contact status updated successfully'
      } as IApiResponse);

    } catch (error) {
      logger.error('Error updating contact status:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to update contact status',
          code: 'CONTACT_UPDATE_ERROR'
        }
      } as IApiResponse);
    }
  }

  /**
   * Delete contact
   */
  static async deleteContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const contact = await Contact.findByIdAndDelete(id);

      logger.info(`Contact ${id} deleted`);

      res.status(200).json({
        success: true,
        message: 'Contact deleted successfully'
      } as IApiResponse);

    } catch (error) {
      logger.error('Error deleting contact:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to delete contact',
          code: 'CONTACT_DELETE_ERROR'
        }
      } as IApiResponse);
    }
  }

  /**
   * Get contact statistics
   */
  static async getContactStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await Contact.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
            read: { $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] } },
            replied: { $sum: { $cond: [{ $eq: ['$status', 'replied'] }, 1, 0] } },
            archived: { $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] } },
            unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: stats
      } as IApiResponse);

    } catch (error) {
      logger.error('Error fetching contact stats:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch contact statistics',
          code: 'CONTACT_STATS_ERROR'
        }
      } as IApiResponse);
    }
  }

  /**
   * Export contacts to CSV
   */
  static async exportContacts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const contactsData = await Contact.find({})
        .sort({ createdAt: -1 })
        .lean();

      const csvHeader = ['Name', 'Email', 'Subject', 'Message', 'Status', 'Created At'];
      const csvContent = contactsData.map((contact: any) => {
        return [
          contact.name,
          contact.email,
          contact.subject,
          contact.message,
          contact.status,
          contact.createdAt.toISOString()
        ];
      }).join('\n');
      
      const csv = csvHeader.join(',') + '\n' + csvContent;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
      res.send(csv);

      logger.info('Contacts exported to CSV');

    } catch (error) {
      logger.error('Error exporting contacts:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to export contacts',
          code: 'CONTACT_EXPORT_ERROR'
        }
      } as IApiResponse);
    }
  }
}
