const { Router } = require("express");
const { validate } = require("express-validation");
const handle = require("express-async-handler");

const validators = require("./validators");

const UserController = require("./controllers/UserController");
const PostController = require("./controllers/PostController");
const SessionController = require("./controllers/SessionController");

const authMiddleware = require("./middlewares/auth");

const routes = Router();

routes.post("/users", validate(validators.User), handle(UserController.store));
routes.post(
  "/session",
  validate(validators.Session),
  handle(SessionController.store)
);

routes.use(authMiddleware);

//Users
routes.get("/users", handle(UserController.index));
routes.get("/users/:id", handle(UserController.show));
routes.put("/users/:id", handle(UserController.update));
routes.delete("/users/:id", handle(UserController.delete));

//Posts
routes.get("/posts", handle(PostController.index));
routes.post("/posts", validate(validators.Post), handle(PostController.store));
routes.get("/posts/:id", handle(PostController.show));
routes.put("/posts/:id", handle(PostController.update));
routes.delete("/posts/:id", handle(PostController.delete));

module.exports = routes;
