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

const on = button.querySelector(".on");
const off = button.querySelector(".off");

function switchOn() {
  state.selecting = true;

  postMessage({ type: "SELECT_ON" });

  on.classList.add("active");
  off.classList.remove("active");
}

function switchOff() {
  state.selecting = false;

  postMessage({ type: "SELECT_OFF" });

  on.classList.remove("active");
  off.classList.add("active");
}

addMessageListener("SELECT", () => {
  if (!state.selecting) {
    return;
  }

  switchOff();
});
