import Joi from "joi";
import mongoose from "mongoose";


const validateObjectId = (value:string,helpers: Joi.CustomHelpers) => {
   if(!mongoose.Types.ObjectId.isValid(value)){
    return helpers.error("any.invalid")
   } 
   return value;
};
const contentImageSchema = Joi.object({
    url: Joi.string().uri().required().messages({
        'string.base': 'Image URL must be a string',
        'string.uri': 'Image URL must be a valid URL',
        'any.required': 'Image URL is required'
    }),
    publicId: Joi.string().required().messages({
        'string.base': 'Image public ID must be a string',
        'any.required': 'Image public ID is required'
    }),
    alt: Joi.string().optional().messages({
        'string.base': 'Image alt text must be a string'
    }),
    width: Joi.number().integer().positive().optional().messages({
        'number.base': 'Image width must be a number',
        'number.integer': 'Image width must be an integer',
        'number.positive': 'Image width must be positive'
    }),
    height: Joi.number().integer().positive().optional().messages({
        'number.base': 'Image height must be a number',
        'number.integer': 'Image height must be an integer',
        'number.positive': 'Image height must be positive'
    })
});


export const createPostSchema = Joi.object({
    title: Joi.string().required().messages({
       'string.base': 'Title must be a string',
       'any.required': 'Title is required'
    }),
    content: Joi.string().required().messages({
        'string.base': 'Content must be a string',
        'any.required': 'Content is required'
    }),
    author: Joi.string().custom(validateObjectId,'ObjectId validation').required().messages({
        'any.invalid': 'Author must be a valid ObjectId',
        'any.required': 'Author is required'
    }),
    thumbnail: Joi.string().uri().optional().messages({
       'string.base': 'Thumbnail must be a string',
       'string.uri' : 'Thumbnail must be a valid URL',
    }), 
    thumbnailPublicId: Joi.string().optional().messages({
       'string.base': 'Thumbnail Public ID must be a string',
    }),
    tags: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string(),
    ).optional().messages({
        'alternatives.match': 'Tags must be an array of strings or a JSON string'
    }),
    contentImages: Joi.array().items(contentImageSchema).optional().messages({
        'array.base': 'Content images must be an array'
    }),
    likes: Joi.number().min(0).optional().messages({
        'number.base': 'Likes must be a number',
        'number.min': 'Likes cannot be negative'
    }),
    likedBy: Joi.array().items(Joi.string().custom(validateObjectId).messages({
        'any.invalid': 'Invalid user ID in likedBy',
    })).optional(),
});

export const updatedPostSchema = Joi.object({
    title: Joi.string().optional().messages({
        'string.base': 'Title must be a string'
    }),
    content: Joi.string().optional().messages({
        'string.base': 'Content must be a string'
    }),
    thumbnail: Joi.string().uri().optional().messages({
        'string.base': 'Thumbnail must be a string',
        'string.uri': 'Thumbnail must be a valid URL'
    }),
    thumbnailPublicId: Joi.string().optional().messages({
        'string.base': 'Thumbnail Public ID must be a string'
    }),
    author: Joi.string().custom(validateObjectId, 'ObjectId validation').optional().messages({
        'any.invalid': 'Author must be a valid ObjectId'
    }),
    tags: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string(),
    ).optional().messages({
        'alternatives.match': 'Tags must be an array of strings or a JSON string'
    }),
    contentImages: Joi.array().items(contentImageSchema).optional().messages({
        'array.base': 'Content images must be an array'
    })
}).min(1).messages({
    'object.min': 'At least one field (title, content, author, thumbnail, thumbnailPublicId, or tags) must be provided'
});

export const deletePostSchema = Joi.object({
    id: Joi.string().custom(validateObjectId, 'ObjectId validation').required().messages({
        'any.invalid': 'Post ID must be a valid ObjectId',
        'any.required': 'Post ID is required',
        'string.base': 'Post ID must be a string'
    })
});