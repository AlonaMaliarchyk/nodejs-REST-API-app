const {Contact} = require("../models/contact");
const {ctrlWrapper} = require("../utils");
const {HttpError} = require("../helpers");


const getAllContacts = async (req, res) => {
    const {_id: owner} = req.user;
    const {favorite, page = 1, limit = 10} = req.query
    const filter = (favorite === undefined) ? {owner} : {owner, favorite};
    const skip = (page - 1) * limit;

    const allContacts = await Contact.find(filter)
        .skip(skip)
        .limit(limit)
        .populate("owner", "name email");
    res.json(allContacts);
};

const getContactId = async (req, res) => {
        const {contactId} = req.params;
        const contact = await Contact.findOne({_id: contactId});
        if (!contact) {
            throw HttpError(404, `Book with ${contactId} not found`);
        }
        res.status(200).json(contact);
};

const postContact= async (req, res) => {

    const {_id: owner} = req.user;
    const newContact = await Contact.create({...req.body, owner});
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