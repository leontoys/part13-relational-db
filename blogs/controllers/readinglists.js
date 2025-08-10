const router = require("express").Router();

const Readinglist = require("../models/readinglist");

router.post("/", async (req, res) => {
  try {
    console.log(req.body)
    const readinglist = await Readinglist.create(req.body);
    res.json(readinglist);
  } catch (error) {
    return res.status(400).json({ error });
  }

});

module.exports = router;
