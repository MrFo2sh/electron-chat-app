window.addEventListener("DOMContentLoaded", () => {
  function joinChat(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Get the username input value
    const username = document.querySelector('input[name="username"]').value;

    // Check if the username is valid
    if (!username) {
      alert("Please enter a username.");
      return;
    }

    // Logic for handling the chat join
    // Example: Sending username to the main process or redirecting to another view
    console.log(`User "${username}" is attempting to join the chat.`);
    alert(`Welcome, ${username}!`);

    window.electron.joinChat(username);

    // You can load a new Electron view here, or handle chat logic.
  }

  // Attach the `joinChat` function to the form
  const form = document.getElementById("login-form");
  form.addEventListener("submit", joinChat);
});
