const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const Jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const { HttpError, sendEmail } = require("../helpers");
const {Users} = require("../models/users");
const {ctrlWrapper} = require("../utils");
const {SECRET_KEY, BASE_URL} = process.env;
const { nanoid } = require ('nanoid');

const avatarDir = path.join("__direname", "../", "pablic", "avatars");

const register = async(req, res)=>{
    const {email, password} = req.body;
    console.log(email)
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword)
    const user = await Users.findOne({email});
    console.log(user)
    if(user){
        throw HttpError(409, "Email in use");
    }

    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();
    const result = await Users.create({...req.body, password: hashPassword, avatarURL, verificationToken});
       
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`
    };
    console.log("verifyEmail", verifyEmail)
    await sendEmail(verifyEmail);
    res.status(201).json({
        name: result.name,
        email: result.email,
    })
}

const verify = async(req, res)=> {
    const {verificationToken} = req.params;
    const user = await Users.findOne({verificationToken});
    if(!user) {
        throw HttpError(404, "Email not found");
    }

    await Users.findByIdAndUpdate(user._id, {verify: true, verificationToken: ""});

    res.json({
        message: "Email verify success"
    })
}
console.log("verify", verify)
const resendVerifyEmail = async(req, res)=> {
    const {email} = req.body;
    const user = await Users.findOne({email});
    if(!email){
        throw HttpError(400, "Missing required field email");
    }
    if(!user){
        throw HttpError(404, "Email not found");
    }
    if(user.verify){
        throw HttpError(400, "Email already verify");
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`
    };
console.log( "verifyEmail" ,verifyEmail)
    await sendEmail(verifyEmail);

    res.json({
        message: "Email resend success"
    })
}


    const login = async(req, res) => {
    const {password, email} = req.body;
    const user = await Users.findOne({email});
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    if(!user.verify) {
        throw HttpError(401, "Email not verify");
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
        message: "Email verify success"
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
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
    
}