const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { SECRET } = require("../util/config");
const User = require("../models/user");
const Session = require("../models/session")

router.delete("/", async (req, res) => {

  const authorization = req.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      const token = authorization.replace("Bearer ", "")
      await Session.destroy({ where: { token } })
      return res.status(204).end()
    } catch (error) {
      return res.status(401).json({error:"token invalid"})
    }
  }
  else {
    return res.status(401).json({error:"token missing"})
  }

});

module.exports = router;
