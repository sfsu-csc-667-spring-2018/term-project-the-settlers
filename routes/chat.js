const express = require("express");
const router = express.Router();
const authenticate = require("../authentication/authenticated");

router.use(authenticate);

router.post("/:namespace", function(req, res, next) {
  const { namespace } = req.params;
  const { message } = req.body;
  const io = req.app.get("io");

  io
    .of(namespace)
    // TODO: Change this to be generic for all chat namespaces
    .emit("lobby receive message", { msg: message, user: req.user.username });

  res.sendStatus(200);
});

module.exports = router;
