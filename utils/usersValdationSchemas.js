const Joi = require('joi');

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const registerSchema =  Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string()/* .pattern(emailRegexp) */.required(),
    // subscription: Joi.string().required(),
    // token: Joi.string().min(6).required(),
  });
  const loginSchema =  Joi.object({
    password: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
  });
  
  const emailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
  })
  const schemas = {
    registerSchema,
    loginSchema,
    emailSchema
  }

  module.exports = {
    schemas,
  }