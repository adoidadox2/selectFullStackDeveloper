require("dotenv").config();
const express = require("express");
const cors = require("cors");

const routes = require("./routes");
require("./database");
const Youch = require("youch");
const { ValidationError } = require("express-validation");

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.exception();
  }
  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
  }
  routes() {
    this.server.use(routes);
  }
  exception() {
    this.server.use(async (err, req, res, next) => {
      if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err);
      }

      if (process.env.NODE_ENV !== "production") {
        const youch = new Youch(err, req);

        return res.json(await youch.toJSON());
      }

      return res
        .status(err.status || 500)
        .json({ error: "Internal Server Error" });
    });
  }
}

module.exports = new App().server;
