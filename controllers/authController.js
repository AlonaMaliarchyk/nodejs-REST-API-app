const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { HttpError } = require("../helpers");
const {Users} = require("../models/users");
const {ctrlWrapper} = require("../utils");
const {SECRET_KEY} = process.env;

const register = async(req, res)=>{
    const {email, password} = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await Users.findOne({email});
        if(user){
            throw HttpError(409, "Email in use");
        }
    const result = await Users.create({...req.body, password: hashPassword});
    res.status(201).json({
        name: result.name,
        email: result.email,
    }) 
}

const login = async(req, res) => {
    const {password, email} = req.body;
    const user = await Users.findOne({email});
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
    await Users.findByIdAndUpdate(user._id, {token});
    res.json({
        token,
    })
}
    const getCurrent = async(req, res)=>{
        const {email, name} = req.user;
        res.json({
            name,
            email,
        })
    }

    const logout = async(req, res)=>{
        const {_id} = req.user;
         await Users.findByIdAndUpdate(_id, {token: ""});
        res.json({
            message: "Logout success"
        })
    }

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout)

}