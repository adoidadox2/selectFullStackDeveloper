const User = require("../models/User");

class UserController {
  async index(req, res) {
    const users = await User.findAll();

    return res.json(users);
  }
  async store(req, res) {
    const { name, username, password } = req.body;

    if (await User.findOne({ where: { username } })) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await User.create({ name, username, password });

    return res.json(user);
  }
  async update(req, res) {
    const id = req.params.id;
    const { name, username, password } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.id != req.userId) {
      return res.status(401).json({ error: "This account isn't yours" });
    }

    user.name = name;
    user.username = username;
    user.password = password;

    await user.save();

    return res.json(user);
  }
  async delete(req, res) {
    const id = req.params.id;

    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.id != req.userId) {
      return res.status(401).json({ error: "This account isn't yours" });
    }

    await User.destroy({
      where: {
        id: user.id,
      },
    });

    return res.json();
  }
  async show(req, res) {
    const id = req.params.id;

    const user = await User.findByPk(id, {
      include: { association: "posts" },
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    return res.json(user);
  }
}
module.exports = new UserController();
