const express = require("express");
const router = express.Router();

router.use("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
    // res.send("/public/index.html");
});

module.exports = router;
