const express = require('express');
const ctrl = require("../../controllers/contactsController");
const { validateBody } = require("../../utils");
const {schemas} = require("../../models/contact");
const router = express.Router();

router.get('/', ctrl.getAllContacts )

router.get('/:contactId', ctrl.getContactId)

router.post('/', validateBody(schemas.addSchema), ctrl.postContact)

router.delete('/:contactId', ctrl.deleteContact)

router.put('/:contactId', validateBody(schemas.addSchema), ctrl.updateContactById)

router.patch("/:id/favorite", validateBody(schemas.updateFavoriteSchema), ctrl.updateFavoriteById);

module.exports = router;