#!/usr/bin/env node
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Express server works");
});

app.listen(3005, () => {
  console.log("Listening on 3005");
});
