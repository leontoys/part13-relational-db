const router = require("express").Router();

const { Blog, User } = require("../models");
const { SECRET } = require("../util/config");
const jwt = require("jsonwebtoken");


const blogFinder = async (req, res, next) => {
  try {
     req.blog = await Blog.findByPk(req.params.id); 
  } catch (error) {
    return res.status(400).json({ error });    
  }
  next();
};

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  console.log(authorization)
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      console.log(SECRET, authorization);
      req.decodedToken = jwt.verify(authorization.replace("Bearer ", ""),SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

router.post("/", tokenExtractor, async (req, res) => {
  try {
    //const user = await User.findOne()
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId : user.id,date: new Date() });
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/:id", blogFinder, async (req, res) => {
//  const blog = await Blog.findByPk(req.params.id);
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", tokenExtractor, blogFinder, async (req, res) => {
  //  const blog = await Blog.findByPk(req.params.id);
  const user = await User.findByPk(req.decodedToken.id);
  if(user!==req.blog.userId) throw new Error('Only Creator can delete blog')
  if (req.blog) {
    await req.blog.destroy();
  }
  res.status(204).end();
});

router.put("/:id", blogFinder, async (req, res) => {
//  const blog = await Blog.findByPk(req.params.id);
    if (req.blog) {
      console.log(req.blog,req.likes)
        req.blog.likes = req.body.likes;
        console.log(req.blog.likes)
    await req.blog.save();
    res.json(req.blog);
    } else {
    res.status(404).end();
  }
});

module.exports = router;
