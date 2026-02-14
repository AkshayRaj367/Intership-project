"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const Contact_model_1 = require("@/models/Contact.model");
const logger_1 = require("@/utils/logger");
const email_1 = require("@/config/email");
class ContactController {
    static async submitContact(req, res, next) {
        try {
            const { name, email, subject, message } = req.body;
            const contact = await Contact_model_1.Contact.create({
                name,
                email,
                subject,
                message,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });
            logger_1.logger.info(`New contact submitted: ${name} (${email})`);
            await email_1.emailService.sendContactConfirmation(name, email, message);
            await email_1.emailService.sendNewContactNotification(name, email, message, req.ip);
            res.status(201).json({
                success: true,
                data: contact,
                message: 'Contact form submitted successfully'
            });
        }
        catch (error) {
            logger_1.logger.error('Error submitting contact:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to submit contact form',
                    code: 'CONTACT_SUBMIT_ERROR'
                }
            });
        }
    }
    static async getAllContacts(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status;
            const search = req.query.search;
            const skip = (page - 1) * limit;
            const contacts = await Contact_model_1.Contact.find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId', 'name email avatar')
                .lean();
            const total = await Contact_model_1.Contact.countDocuments();
            const response = {
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
        }
        catch (error) {
            logger_1.logger.error('Error fetching contacts:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch contacts',
                    code: 'CONTACT_FETCH_ERROR'
                }
            });
        }
    }
    static async getContactById(req, res, next) {
        try {
            const { id } = req.params;
            const contact = await Contact_model_1.Contact.findById(id);
            if (!contact) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Contact not found',
                        code: 'CONTACT_NOT_FOUND'
                    }
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: contact,
                message: 'Contact retrieved successfully'
            });
        }
        catch (error) {
            logger_1.logger.error('Error fetching contact:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch contact',
                    code: 'CONTACT_FETCH_ERROR'
                }
            });
        }
    }
    static async updateContactStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const contact = await Contact_model_1.Contact.findByIdAndUpdate(id, { status }, { new: true });
            logger_1.logger.info(`Contact ${id} status updated to: ${status}`);
            res.status(200).json({
                success: true,
                data: contact,
                message: 'Contact status updated successfully'
            });
        }
        catch (error) {
            logger_1.logger.error('Error updating contact status:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to update contact status',
                    code: 'CONTACT_UPDATE_ERROR'
                }
            });
        }
    }
    static async deleteContact(req, res, next) {
        try {
            const { id } = req.params;
            const contact = await Contact_model_1.Contact.findByIdAndDelete(id);
            logger_1.logger.info(`Contact ${id} deleted`);
            res.status(200).json({
                success: true,
                message: 'Contact deleted successfully'
            });
        }
        catch (error) {
            logger_1.logger.error('Error deleting contact:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to delete contact',
                    code: 'CONTACT_DELETE_ERROR'
                }
            });
        }
    }
    static async getContactStats(req, res, next) {
        try {
            const stats = await Contact_model_1.Contact.aggregate([
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
            });
        }
        catch (error) {
            logger_1.logger.error('Error fetching contact stats:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch contact statistics',
                    code: 'CONTACT_STATS_ERROR'
                }
            });
        }
    }
    static async exportContacts(req, res, next) {
        try {
            const contactsData = await Contact_model_1.Contact.find({})
                .sort({ createdAt: -1 })
                .lean();
            const csvHeader = ['Name', 'Email', 'Subject', 'Message', 'Status', 'Created At'];
            const csvContent = contactsData.map((contact) => {
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
            logger_1.logger.info('Contacts exported to CSV');
        }
        catch (error) {
            logger_1.logger.error('Error exporting contacts:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to export contacts',
                    code: 'CONTACT_EXPORT_ERROR'
                }
            });
        }
    }
}
exports.ContactController = ContactController;
//# sourceMappingURL=contact.controller.js.map