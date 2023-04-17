const {Contact} = require("../models/contact");
const {ctrlWrapper} = require("../utils");
const {HttpError} = require("../helpers");
const { ObjectId } = require("mongodb");


const getAllContacts = async (req, res) => {
        const allContacts = await Contact.find();
        res.json(allContacts);
    
};

const getContactId = async (req, res) => {
        const {_id} = req.params;
        const oneContact = await Contact.findOne({contactId: ObjectId});
        if (!oneContact) {
            throw HttpError(404, `Book with ${_id} not found`);
        }
        res.status(200).json(oneContact);
};

const postContact= async (req, res) => {
        const newContact = await Contact.create(req.body);
        res.status(201).json(newContact)
};

const updateContactById = async (req, res) => {
        const {contactId} = req.params;
        const updateContact = await Contact.findOneAndUpdate(contactId, req.body, {new: true});
            if (!updateContact) {
                throw HttpError(404, `Book with ${contactId} not found`);
            }
        res.status(200).json(updateContact)
};

const deleteContact = async (req, res) => {
        const {contactId} = req.params;
        const deleteById = await Contact.findOneAndRemove(contactId);
        if (!deleteById) {
            throw HttpError(404, `Book with ${contactId} not found`);
        }
        res.json({message: "Contact deleted"})
};

const updateFavoriteById = async (req, res) => {
    const {contactId} = req.params;
    if (!req.body.favorite) {
        throw HttpError(400, `Missing field favorite`);
    }
    const updateContact = await Contact.findOneAndUpdate(contactId, req.body, {new: true});
    if (!updateContact) {
        throw HttpError(404, `Not found`);
    }

    res.status(200).json(updateContact);
};
module.exports = {
    getAllContacts: ctrlWrapper(getAllContacts),
    getContactId: ctrlWrapper(getContactId),
    postContact: ctrlWrapper(postContact),
    updateContactById: ctrlWrapper(updateContactById),
    deleteContact: ctrlWrapper(deleteContact),
    updateFavoriteById: ctrlWrapper(updateFavoriteById),
}