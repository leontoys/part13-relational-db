const router = require("express").Router();
const { Op, sequelize } = require("sequelize");
const { User, Blog, Readinglist } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog
    }
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/:id", async (req, res) => {

  let read = {
    [Op.in]: [true, false]
  }
  if (req.query.read) 
  {
    read = req.query.read === "true"
  }


  const user = await User.findByPk(req.params.id, {
    include: {
      model: Blog,
      as: 'readings',
      through: {
        attributes: ['id', 'read'],
        where: {
          read
        }
      }
    },
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put("/:username", async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (user) {
    user.username = req.body.username
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});


module.exports = router;
