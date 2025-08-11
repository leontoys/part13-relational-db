const router = require("express").Router();

const { Readinglist, User } = require("../models");
const { SECRET } = require("../util/config");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    console.log(req.body)
    const readinglist = await Readinglist.create(req.body);
    res.json(readinglist);
  } catch (error) {
    return res.status(400).json({ error });
  }

});

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  console.log(authorization);
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      console.log(SECRET, authorization);
      req.decodedToken = jwt.verify(
        authorization.replace("Bearer ", ""),
        SECRET
      );
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

const listFinder = async (req, res, next) => {
  try {
    console.log("id",req.params.id)
    req.list = await Readinglist.findByPk(req.params.id);
    console.log("list",req.list)
  } catch (error) {
    return res.status(400).json({ error });
  }
  next();
};

router.put("/:id", tokenExtractor,listFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (user.id !== req.list.userId)
    throw new Error("Only Creator can delete blog");
  if (req.list) {
    req.list.read = req.body.read
    console.log("read",req.list.read)
    await req.list.save()
    res.json(req.list)
  }
  res.status(204).end();
});

module.exports = router;
