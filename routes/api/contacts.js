const express = require('express');
const Joi = require('joi');
const contacts = require("../../models/contacts");
const router = express.Router();
const {HttpError} = require("../../helpers");

const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
});

router.get('/', async (req, res, next) => {
    try {
        const allContacts = await contacts.listContacts();
        res.json(allContacts);
    } catch (error) {
        next(error);
    }
})

router.get('/:contactId', async (req, res, next) => {
    try {
        const {contactId} = req.params;
        const oneContact = await contacts.getContactById(contactId);
        if (!oneContact) {
            throw HttpError(404, `Book with ${contactId} not found`);
        }
        res.status(200).json(oneContact);
    } catch (error) {
        next(error);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const {name, email, phone} = req.body;
        const {error} = addSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const newContact = await contacts.addContact({name, email, phone});
        res.status(201).json(newContact)
    } catch (error) {
        next(error);
    }
})

router.delete('/:contactId', async (req, res, next) => {
    try {
        const {contactId} = req.params;
        const deleteById = await contacts.removeContact(contactId);
        if (!deleteById) {
            throw HttpError(404, `Book with ${contactId} not found`);
        }
        res.json({message: "Contact deleted"})
    } catch (error) {
        next(error);
    }
})

router.put('/:contactId', async (req, res, next) => {
    try {
        const {contactId} = req.params;
        const {error} = addSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const updateContact = await contacts.updateContact(contactId, req.body);
        if (!updateContact) {
            throw HttpError(404, `Book with ${contactId} not found`);
        }
        res.status(200).json(updateContact)
    } catch (error) {
        next(error);
    }
})

module.exports = router
