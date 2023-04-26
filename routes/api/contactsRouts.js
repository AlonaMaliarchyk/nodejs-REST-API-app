const express = require('express');
const ctrl = require("../../controllers/contactsController");
const { isValidId, authenticate } = require("../../middlewares");
const { validateBody } = require("../../utils");
const {schemas} = require("../../utils/contactValidationSchemas");
const router = express.Router();

router.get('/', authenticate, ctrl.getAllContacts )

router.get('/:contactId', isValidId, ctrl.getContactId)

router.post('/', authenticate, validateBody(schemas.addSchema), ctrl.postContact)

router.delete('/:contactId', authenticate, isValidId, ctrl.deleteContact)

router.put('/:contactId', authenticate, isValidId, validateBody(schemas.addSchema), ctrl.updateContactById)

router.patch("/:contactId/favorite", authenticate, isValidId, validateBody(schemas.updateFavoriteSchema), ctrl.updateFavoriteById);

module.exports = router;