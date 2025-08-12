const router = require("express").Router();

const { Blog, User, Session } = require("../models");
const { SECRET } = require("../util/config");
const jwt = require("jsonwebtoken");
const { Op , sequelize } = require("sequelize");


const blogFinder = async (req, res, next) => {
  try {
     req.blog = await Blog.findByPk(req.params.id); 
  } catch (error) {
    return res.status(400).json({ error });    
  }
  next();
};

router.get("/", async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { author: { [Op.iLike]: `%${req.query.search}%` } }
      ],
    };
  }
  console.log(where)
  const blogs = await Blog.findAll({
    include: {
      model: User,
    },
    where,
    order: [['likes','DESC']]
  });
  res.json(blogs);
});

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  console.log(authorization)
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      //req.decodedToken = jwt.verify(authorization.replace("Bearer ", ""),SECRET);
      const token = authorization.replace("Bearer ", "")
      const decoded = jwt.verify(token, SECRET);
      
      //if session expired
      const session = await Session.findOne({ where: { token } })
      if (!session) {
        return res.status(401).json({error:"session expired"})
      }

      const user = await User.findByPk(decoded.id);
      if (!user || user.disabled) {
        return res.status(401).json({ error: "user disabled" });        
      }

      req.decodedToken = decoded

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
  if(user.id!==req.blog.userId) throw new Error('Only Creator can delete blog')
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
