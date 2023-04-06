const BaseJoi =require ('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.uncSchema = Joi.object({
    roster: Joi.object({
        name: Joi.string().required().escapeHTML(),
        title: Joi.string().required().escapeHTML(),
        height: Joi.string().required().escapeHTML(),
        class: Joi.string().required().escapeHTML(),
        hometown: Joi.string().required().escapeHTML(),
        weight: Joi.number().required(),
        // image: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.takeSchema = Joi.object({
    take: Joi.object({
        body: Joi.string().required().escapeHTML()
    }).required()

})

module.exports.prospectSchema = Joi.object({
    prospect: Joi.object({
        name: Joi.string().required().escapeHTML(),
        title: Joi.string().required().escapeHTML(),
        height: Joi.string().required().escapeHTML(),
        year: Joi.string().required().escapeHTML(),
        hometown: Joi.string().required().escapeHTML(),
        weight: Joi.number().required()
        // image: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});
