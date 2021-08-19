const mongoose = require("mongoose");
const DB_CONNECTION_STRING =
  process.env.DB_CONNECTION_STRING || "mongodb://localhost/clase9";

module.exports = () => {
  mongoose.connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  mongoose.connection
    .once("open", () => console.log("Conexión establecida satisfactoriamente"))
    .on("error", (error) => console.error("Error en la conexión", error));
};
