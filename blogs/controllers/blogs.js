const router = require("express").Router();

const { Blog } = require("../models");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  throw new Error('Blog not found')
  next();
};

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post("/", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
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

router.delete("/:id", blogFinder, async (req, res) => {
//  const blog = await Blog.findByPk(req.params.id);
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
