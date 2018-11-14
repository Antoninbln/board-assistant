const express = require("express");

const app = express();

app.use(express.static("dist"));

app.get("/", (req, res) => res.send("TEST REACINE"));

app.get("/api", (req, res) =>
  res.send({ "Vous êtes bien loggé" : "en effet" })
);

app.listen(8888, () => console.log("Listening on port 8888 !"));
