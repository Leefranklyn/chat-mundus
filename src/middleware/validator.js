import Joi from "joi";

export const validateUserSignup = (req, res, next) => {
    const schema = Joi.object({
        fullName: Joi.string().required().min(1).max(255).trim(),
        email: Joi.string().email().required().lowercase(),
        password: Joi.string().required().min(6),
        gender: Joi.string()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        console.log(error);
        return res.status(400).json({
            message: "An Error Occured",
            error: error.details[0].message
        });
    };
    next()
};

export const validateUserLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required().lowercase(),
        password: Joi.string().required().min(6),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        console.log(error);
        return res.status(400).json({
            message: "An Error Occured",
            error: error.details[0].message
        });
    };
    next()
};

