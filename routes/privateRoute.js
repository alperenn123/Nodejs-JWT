const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/private", verify, (req, res) => {
  res.json({
    posts: {
      title: "Secret Post",
      description: "Restricted data",
    },
  });
});

module.exports = {
  router,
};
