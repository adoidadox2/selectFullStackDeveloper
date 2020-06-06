const User = require("../models/User");

class SessionController {
  async store(req, res) {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!(await user.checkPassword(password))) {
      return res.json({ error: "Invalid Password" });
    }

    return res.json({ user, token: user.generateToken(user) });
  }
}

module.exports = new SessionController();
