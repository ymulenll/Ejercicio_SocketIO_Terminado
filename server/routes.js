const express = require("express");
const Message = require("./models/message.model");
const router = express.Router();

router.get("/messages", async (req, res) => {
  const messages = await Message.find().populate("user", "username");

  res.json(messages);
});

module.exports = router;
