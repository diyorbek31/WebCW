import { UnprocessableException } from "../errors/unprocessable.exception.js";
import Joi from 'joi';

export const ValidationMiddleware = schema => {
    return (req, _, next) => {
        const validationSchema = Joi.object({
            title: Joi.string().trim().min(1).pattern(/^[a-zA-Z0-9 ]*$/).required().messages({
                'string.empty': 'Title cannot be empty',
                'any.required': 'Title is required',
                'string.pattern.base': 'Title can only contain letters, numbers, and spaces'
            }),
            author: Joi.string().trim().min(1).pattern(/^[a-zA-Z ]*$/).required().messages({
                'string.empty': 'Author cannot be empty',
                'any.required': 'Author is required',
                'string.pattern.base': 'Author can only contain letters and spaces'
            }),
            genre: Joi.string().trim().min(1).pattern(/^[a-zA-Z ]*$/).required().messages({
                'string.empty': 'Genre cannot be empty',
                'any.required': 'Genre is required',
                'string.pattern.base': 'Genre can only contain letters and spaces'
            })
        });

        const { error, value } = validationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            throw new UnprocessableException({
                message: "Validation failed",
                details: error.details.map(err => err.message)
            });
        }

        req.body = value;
        next();
    }
};
