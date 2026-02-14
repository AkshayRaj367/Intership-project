"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("@/controllers/contact.controller");
const auth_middleware_1 = require("@/middlewares/auth.middleware");
const validation_middleware_1 = require("@/middlewares/validation.middleware");
const router = (0, express_1.Router)();
router.post('/', contactRateLimiter, (0, validation_middleware_1.validate)(validation_middleware_1.schemas.contactForm), contact_controller_1.ContactController.submitContact);
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.authorize)('admin'));
router.get('/', (0, validation_middleware_1.validate)(validation_middleware_1.schemas.pagination, 'query'), contact_controller_1.ContactController.getAllContacts);
router.get('/stats', contact_controller_1.ContactController.getContactStats);
router.get('/export', contact_controller_1.ContactController.exportContacts);
router.get('/:id', (0, validation_middleware_1.validate)(validation_middleware_1.schemas.objectId, 'params'), contact_controller_1.ContactController.getContactById);
router.patch('/:id/status', (0, validation_middleware_1.validate)(validation_middleware_1.schemas.objectId, 'params'), (0, validation_middleware_1.validate)(validation_middleware_1.schemas.contactStatusUpdate), contact_controller_1.ContactController.updateContactStatus);
router.delete('/:id', (0, validation_middleware_1.validate)(validation_middleware_1.schemas.objectId, 'params'), contact_controller_1.ContactController.deleteContact);
exports.default = router;
//# sourceMappingURL=contact.routes.js.map