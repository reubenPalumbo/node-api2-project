const express = require("express");
const postRouter = require("./postRouter");

const server = express();

server.use(express.json());
server.use(postRouter);

server.get("/", (req, res) => {
  res.send(`<h2>WORKING</h>`);
});

module.exports = server;
