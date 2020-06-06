const { Joi } = require("express-validation");

module.exports = {
  body: Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required().min(6),
  }),
};
