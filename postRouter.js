const express = require("express");
const db = require("./data/db");

const router = express.Router();

router.get("/api/posts", (req, res) => {
  db.find()
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(500).json({
        error: "The posts information could not be retrieved.",
      });
    });
});

router.get("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  if (db.findById(id) === id) {
    res.status(404).json({
      message: "The post with the specified ID does not exist.",
    });
  } else {
    db.findById(id)
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((error) => {
        res.status(500).json({
          error: "The post information could not be retrieved.",
        });
      });
  }
});

router.get("/api/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  if (db.findById(id) === id) {
    res.status(404).json({
      message: "The post with the specified ID does not exist.",
    });
  } else {
    db.findPostComments(id)
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((error) => {
        res.status(500).json({
          error: "The comments information could not be retrieved.",
        });
      });
  }
});

router.post("/api/posts", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    db.insert(req.body)
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((error) => {
        res.status(500).json({
          error: "There was an error while saving the post to the database",
        });
      });
  }
});

router.post("/api/posts/:id/comments", (req, res) => {
  const message = { post_id: req.params.id, ...req.body };
  if (!message.text) {
    res.status(400).json({
      errorMessage: "Please provide text for the comment.",
    });
  } else {
    db.findById(message.post_id)
      .then((post) => {
        db.insertComment(message)
          .then((post) => {
            res.status(201).json(post);
          })
          .catch((error) => {
            res.status(500).json({
              error:
                "There was an error while saving the comment to the database",
            });
          });
      })
      .catch((error) => {
        res.status(404).json({
          message: "The post with the specified ID does not exist.",
        });
      });
  }
});

router.delete("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  if (db.findById(id) === id) {
    res.status(404).json({
      message: "The post with the specified ID does not exist.",
    });
  } else {
    db.findById(id).then((removed) => {
      db.remove(id)
        .then((post) => {
          res.status(200).json(removed);
        })
        .catch((error) => {
          res.status(500).json({
            error: "The post could not be removed",
          });
        });
    });
  }
});

router.put("/api/posts/:id", (req, res) => {
  const changes = req.body;

  const { id } = req.params;
  if (db.findById(id) === id) {
    res.status(404).json({
      message: "The post with the specified ID does not exist.",
    });
  } else {
    if (!changes.title || !changes.contents) {
      res.status(400).json({
        errorMessage: "Please provide title and contents for the post.",
      });
    } else {
      db.update(id, changes)
        .then((post) => {
          db.findById(id).then((post) => {
            res.status(200).json(post);
          });
        })
        .catch((error) => {
          console.log(error);
          res
            .status(500)
            .json({ error: "The post information could not be modified." });
        });
    }
  }
});

module.exports = router;
