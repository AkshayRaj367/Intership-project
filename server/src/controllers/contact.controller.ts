import { Request, Response, NextFunction } from 'express';
import { Contact } from '@/models/Contact.model';
import { IApiResponse, IPaginationResponse, IContactFormData, AuthenticatedRequest } from '@/types';
import { logger } from '@/utils/logger';
import { emailService } from '@/config/email';
import { emitToDashboard, emitToUser } from '@/config/socket';

export class ContactController {
  /**
   * Submit contact form
   */
  static async submitContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, subject, message } = req.body as IContactFormData;
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?._id || null;

      // Create contact (linked to user if authenticated)
      const contact = await Contact.create({
        name,
        email,
        subject,
        message,
        userId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      logger.info(`New contact submitted: ${name} (${email})${userId ? ` by user ${userId}` : ''}`);

      // Emit real-time event to the specific user's dashboard
      if (userId) {
        emitToUser(userId.toString(), 'contact:created', {
          type: 'created',
          contact: contact.toObject(),
          timestamp: new Date().toISOString()
        });
      } else {
        // Fallback: broadcast to all dashboards for unlinked contacts
        emitToDashboard('contact:created', {
          type: 'created',
          contact: contact.toObject(),
          timestamp: new Date().toISOString()
        });
      }

      // Send confirmation email (non-blocking)
      emailService.sendContactConfirmation(name, email, message).catch((err: any) => {
        logger.error('Failed to send contact confirmation email:', err);
      });

      // Send notification to admin (non-blocking)
      emailService.sendNewContactNotification(name, email, message, req.ip).catch((err: any) => {
        logger.error('Failed to send admin notification email:', err);
      });

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
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?._id;

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const search = req.query.search as string;

      const skip = (page - 1) * limit;
      // Only return contacts belonging to the authenticated user
      const filter: any = { userId };
      const contacts = await Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email avatar')
        .lean();

      const total = await Contact.countDocuments(filter);

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

      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?._id;

      const contact = await Contact.findOne({ _id: id, userId });

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
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?._id;

      // Only update if the contact belongs to the authenticated user
      const contact = await Contact.findOneAndUpdate(
        { _id: id, userId },
        { status },
        { new: true }
      );

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

      logger.info(`Contact ${id} status updated to: ${status}`);

      // Emit real-time event to the specific user
      emitToUser(userId!.toString(), 'contact:updated', {
        type: 'updated',
        contact: contact.toObject(),
        timestamp: new Date().toISOString()
      });

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
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?._id;

      // Only delete if the contact belongs to the authenticated user
      const contact = await Contact.findOneAndDelete({ _id: id, userId });

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

      logger.info(`Contact ${id} deleted by user ${userId}`);

      // Emit real-time event to the specific user
      emitToUser(userId!.toString(), 'contact:deleted', {
        type: 'deleted',
        contactId: id,
        timestamp: new Date().toISOString()
      });

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
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?._id;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Import mongoose to convert userId string to ObjectId for aggregation
      const mongoose = require('mongoose');
      const userObjectId = new mongoose.Types.ObjectId(userId);

      const stats = await Contact.aggregate([
        // Filter by the authenticated user's contacts only
        { $match: { userId: userObjectId } },
        {
          $facet: {
            overall: [
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
            ],
            last30Days: [
              { $match: { createdAt: { $gte: thirtyDaysAgo } } },
              { $count: 'count' }
            ]
          }
        }
      ]);

      const overall = stats[0]?.overall[0] || { total: 0, new: 0, read: 0, replied: 0, archived: 0, unread: 0 };
      const last30Days = stats[0]?.last30Days[0]?.count || 0;

      res.status(200).json({
        success: true,
        data: { ...overall, last30Days, _id: undefined }
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
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?._id;

      // Only export the authenticated user's contacts
      const contactsData = await Contact.find({ userId })
        .sort({ createdAt: -1 })
        .lean();

      const csvHeader = ['Name', 'Email', 'Subject', 'Message', 'Status', 'Created At'];
      
      // Helper to escape CSV fields properly
      const escapeCsvField = (field: string): string => {
        if (!field) return '""';
        const str = String(field);
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const csvRows = contactsData.map((contact: any) => {
        return [
          escapeCsvField(contact.name),
          escapeCsvField(contact.email),
          escapeCsvField(contact.subject),
          escapeCsvField(contact.message),
          escapeCsvField(contact.status),
          escapeCsvField(contact.createdAt?.toISOString?.() || new Date(contact.createdAt).toISOString())
        ].join(',');
      });
      
      const csv = csvHeader.join(',') + '\n' + csvRows.join('\n');
      
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
