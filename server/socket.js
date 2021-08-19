const socketIO = require("socket.io");
const User = require("./models/user.model");
const Message = require("./models/message.model");

module.exports = (server) => {
  const io = socketIO(server);

  io.on("connection", (socket) => {
    console.log("Usuario conectado mediante socket con id: " + socket.id);

    socket.on("disconnect", () => {
      console.log("Se desconectó el usuario: " + socket.id);
      io.emit("usuario-desconectado", socket.username);
    });

    socket.on("set-username", async (username) => {
      try {
        // upsert = update + insert
        const user = await User.findOneAndUpdate(
          { username: username },
          { username: username },
          { upsert: true, new: true }
        );

        socket.username = username;

        socket.emit("set-username-ok", user);
      } catch (error) {
        socket.emit("set-username-error", error);
      }
    });

    socket.on("mensaje", async (payload) => {
      console.log("Mensaje: " + payload);

      // crear mensaje
      const message = await Message.create({ text: payload });

      // añadirle el mensaje al usuario actual
      const user = await User.findOneAndUpdate(
        { username: socket.username },
        { $push: { messages: message.id } },
        { new: true, upsert: true }
      );

      message.user = user.id;
      await message.save();

      const datos = {
        username: user.username,
        message: message.text,
        createdAt: message.createdAt,
      };
      io.emit("mensaje-roger", datos);
    });
  });
};
