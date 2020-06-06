const Post = require("../models/Post");

class PostController {
  async index(req, res) {
    const posts = await Post.findAll();

    return res.json(posts);
  }
  async store(req, res) {
    const { title, content } = req.body;

    if (await Post.findOne({ where: { title } })) {
      return res.status(400).json({ error: "Title already exists" });
    }

    const post = await Post.create({ title, content, user_id: req.userId });

    return res.json(post);
  }
  async update(req, res) {
    const id = req.params.id;
    const { title, content } = req.body;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }

    if (post.user_id != req.userId) {
      return res.status(401).json({ error: "This post isn't yours" });
    }

    post.title = title;
    post.content = content;

    await post.save();

    return res.json(post);
  }
  async delete(req, res) {
    const id = req.params.id;

    const post = await Post.findOne({ where: { id } });

    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }

    if (post.user_id != req.userId) {
      return res.status(401).json({ error: "This post isn't yours" });
    }

    await Post.destroy({
      where: {
        id: post.id,
      },
    });

    return res.json();
  }
  async show(req, res) {
    const id = req.params.id;

    const post = await Post.findByPk(id, {
      include: { association: "user" },
    });

    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }

    return res.json(post);
  }
}

module.exports = new PostController();
