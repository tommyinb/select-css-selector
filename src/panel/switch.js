import { addMessageListener, postMessage } from "./port.js";

const state = {
  selecting: true,
};

postMessage({ type: "SELECT_ON" });

addMessageListener("CONTENT_OPEN", () => {
  if (state.selecting) {
    postMessage({ type: "SELECT_ON" });
  }
});

const button = document.getElementById("switch");
button.addEventListener("click", () => {
  if (state.selecting) {
    switchOff();
  } else {
    switchOn();
  }
});

function switchOn() {
  state.selecting = true;
  postMessage({ type: "SELECT_ON" });
  button.textContent = "Selecting: ON";
}

function switchOff() {
  state.selecting = false;
  postMessage({ type: "SELECT_OFF" });
  button.textContent = "Selecting: OFF";
}

addMessageListener("SELECT", () => {
  if (!state.selecting) {
    return;
  }

  switchOff();
});
