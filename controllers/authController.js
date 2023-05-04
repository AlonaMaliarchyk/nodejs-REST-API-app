const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const Jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const { HttpError } = require("../helpers");
const {Users} = require("../models/users");
const {ctrlWrapper} = require("../utils");
const {SECRET_KEY} = process.env;

const avatarDir = path.join("__direname", "../", "pablic", "avatars");

    const register = async(req, res)=>{
    const {email, password} = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await Users.findOne({email});
        if(user){
            throw HttpError(409, "Email in use");
        }
    const avatarURL = gravatar.url(email);
    
    const result = await Users.create({...req.body, password: hashPassword, avatarURL});

    
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

    const updateAvatar = async(req, res)=>{
        const {_id} = req.user;
        const { path: tempUploud, filename} = req.file;
        const avatarName = `${_id}_${filename}`
        const resultUploud = path.join(avatarDir, avatarName);
        await fs.rename(tempUploud, resultUploud);
        const avatarURL = path.join("pablic","avatars", avatarName); 
        await Users.findByIdAndUpdate(_id, {avatarURL})
        Jimp.read(avatarURL)
    .then((image) => {
      image.resize(250, 250) // resize
      .write(resultUploud); // save
    })
    .catch((err) => {
        console.error(err);
    });
        res.json({avatarURL})
    }

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar)

}