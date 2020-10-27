const express = require("express");
const db = require("./data/db");

const router = express.Router();

router.get("/api/hubs", (req, res) => {
  db.find(req.query)
    .then((data) => {
      res.status(200).json(hubs);
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the hubs",
      });
    });
});

module.exports = router;
