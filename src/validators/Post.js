const { Joi } = require("express-validation");

module.exports = {
  body: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }),
};
