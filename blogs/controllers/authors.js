const router = require("express").Router();

const { Blog, User } = require("../models");
const { SECRET } = require("../util/config");
const jwt = require("jsonwebtoken");
const { Op , Sequelize } = require("sequelize");

router.get("/", async (req, res) => {

  const blogs = await Blog.findAll({
    attributes: [
      "author",
      [Sequelize.fn("COUNT", Sequelize.col("author")), "articles"],
      [Sequelize.fn("SUM", Sequelize.col("likes")), "likes"],
    ],
    group: ["author"],
  });
  res.json(blogs);
});

module.exports = router;
