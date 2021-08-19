const express = require("express");
const db = require("./db");
const socket = require("./socket");
const router = require("./routes");

const app = express();
const PORT = process.env.PORT || 3005;

db();

app.use(express.static(process.cwd() + "/client"));

app.use(router);

const server = app.listen(PORT, () =>
  console.log("Servidor corriendo en el puerto: " + PORT)
);

socket(server);
