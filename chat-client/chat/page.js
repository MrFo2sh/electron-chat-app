window.addEventListener("DOMContentLoaded", () => {
  var username;
  var socket;

  window.electron.receiveLoginData((event, data) => {
    console.log("Received data from main:", event, data);
    username = data.username;
    localStorage.setItem("username", data.username);
    connect();
  });

  function sendMessage() {
    const text = document.getElementById("message-input").value;
    document.getElementById("message-input").value = "";

    const msg = `
        <div class="message outgoing">
            <span class="sender">You:</span> ${text}
          </div>
    `;
    document.getElementById("messages-list").innerHTML += msg;

    socket.send(JSON.stringify({ msg: { text } }));
  }

  document.getElementById("send-btn").addEventListener("click", sendMessage);

  function connect() {
    socket = new WebSocket("ws://localhost:8080");
    // Connection opened
    socket.addEventListener("open", (event) => {
      console.log("event: ", event);
      const data = { username };
      socket.send(JSON.stringify(data));
    });

    // Listen for messages
    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);

      console.log("data received: ", data);
      if (!data.text) return;
      const msg = !data.isSystem
        ? `
        <div class="message incoming">
            <span class="sender">${data.username}:</span> ${data.text}
            <p>${dateFormat(data.date)}</p>
            </div>
    `
        : `<div class="message incoming">
            ${data.text}
            <p>${dateFormat(data.date)}</p>
        </div>`;

      document.getElementById("messages-list").innerHTML += msg;
    });
  }

  function dateFormat(date) {
    return new Date(date).toLocaleTimeString();
  }
});
