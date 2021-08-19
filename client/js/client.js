const socket = io();

const form = document.getElementById("form");
const mensajeInput = document.getElementById("mensaje");
const listadoMensajes = document.getElementById("listadoMensajes");
const bienvenida = document.getElementById("bienvenida");

const username = prompt("Entre su nombre de usuario: ");

socket.emit("set-username", username);
bienvenida.innerHTML = `Hola <strong>${username}</strong> 👋`;

// actualizar mensajes anteriores
fetch("/messages").then(async (response) => {
  const messages = await response.json();

  for (message of messages) {
    addMessage({
      username: message.user.username,
      message: message.text,
      createdAt: message.createdAt,
    });
  }
});

socket.on("set-username-ok", (user) => console.log(user));
socket.on("set-username-error", (error) => console.error(error));

socket.on("usuario-desconectado", (username) => {
  listadoMensajes.insertAdjacentHTML(
    "beforeend",
    `<p>Se desconectó: ${username}</p>`
  );
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = mensajeInput.value;
  socket.emit("mensaje", text);

  mensajeInput.value = "";
});

socket.on("mensaje-roger", (payload) => {
  addMessage(payload);
});

function addMessage(payload) {
  const { username, message, createdAt } = payload;

  appendMessage(username, message, createdAt);
}

function appendMessage(name, text, date) {
  const side = name === username ? "right" : "left";
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name || "Invitado"}</div>
          <div class="msg-info-time" datetime="${date}"></div>
        </div>
        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  listadoMensajes.insertAdjacentHTML("beforeend", msgHTML);
  listadoMensajes.scrollTop += 500;

  const msgerTime = document.querySelectorAll(".msg-info-time");
  timeago.render(msgerTime, "es");
}
