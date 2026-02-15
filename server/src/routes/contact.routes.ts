import { Router } from 'express';
import { ContactController } from '@/controllers/contact.controller';
import { authenticate, optionalAuth } from '@/middlewares/auth.middleware';
import { validate, schemas } from '@/middlewares/validation.middleware';
import { contactRateLimiter } from '@/middlewares/security.middleware';

const router = Router();

// Public routes (optionalAuth links contact to user if logged in)
router.post('/', 
  contactRateLimiter,
  optionalAuth as any,
  validate(schemas.contactForm),
  ContactController.submitContact
);

// Protected routes (any authenticated user)
router.use(authenticate as any);

// Get all contacts with pagination and filtering
router.get('/',
  validate(schemas.pagination, 'query'),
  ContactController.getAllContacts
);

// Get contact statistics
router.get('/stats',
  ContactController.getContactStats
);

// Export contacts to CSV
router.get('/export',
  ContactController.exportContacts
);

// Get single contact by ID
router.get('/:id',
  validate(schemas.objectId, 'params'),
  ContactController.getContactById
);

// Update contact status
router.patch('/:id/status',
  validate(schemas.objectId, 'params'),
  validate(schemas.contactStatusUpdate),
  ContactController.updateContactStatus
);

// Delete contact
router.delete('/:id',
  validate(schemas.objectId, 'params'),
  ContactController.deleteContact
);

export default router;
