const { Model, DataTypes } = require("sequelize");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authConfig = require("../config/auth");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        username: DataTypes.STRING,
        password: DataTypes.VIRTUAL,
        password_hash: DataTypes.STRING,
      },
      {
        hooks: {
          beforeSave: async (user) => {
            if (user.password) {
              user.password_hash = await bcrypt.hash(user.password, 8);
            }
          },
        },
        sequelize,
        paranoid: true,
      }
    );

    User.prototype.checkPassword = function (password) {
      return bcrypt.compare(password, this.password_hash);
    };

    User.prototype.generateToken = function () {
      return jwt.sign({ id: this.id }, authConfig.secret, {
        expiresIn: authConfig.ttl,
      });
    };
  }
  static associate(models) {
    this.hasMany(models.Post, { foreignKey: "user_id", as: "posts" });
  }
}

module.exports = User;
