import Joi from "joi";



const registerSchema = Joi.object({
    username:  Joi.string().min(3).max(30).required().messages({
        'string.base': 'Username should be a type of text',
        'string.empty': 'Username cannot be empty field',
        'string.min': 'Username should have a minimum length of {#limit}',
        'string.max': 'Username should have a maximum length of {#limit}',
        'any.required': 'Username is requried',
    }),
    email: Joi.string().email({tlds:{allow:false}}).required().messages({
       'string.base': 'Email should be a type of text',
       'string.empty': 'Email cannot be an empty field',
       'string.email': 'Please provide a valid email address',
       'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
       'string.base': 'Password should be a type of text',
       'string.empty': 'Password cannot be an empty field',
       'string.min': 'Password should have a minimum length fo {#limit}',
       'any.required': 'Password is required',
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().email({tlds:{allow:false}}).required().messages({
       'string.base': 'Email should be a type of text',
       'string.empty': 'Email cannot be an empty field',
       'string.email': 'Please provide a valid email address',
       'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
       'string.base': 'Password should be a type of text',
       'string.empty': 'Password cannot be an empty field',
       'any.required': 'Password is required',
    }),
});



export {registerSchema,loginSchema};