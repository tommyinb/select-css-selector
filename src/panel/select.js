import { render } from "./chain.js";
import { refresh } from "./filter.js";
import { addMessageListener } from "./port.js";

const container = document.getElementById("select");

addMessageListener("PREVIEW", (message) => {
  renderChain(message.chain);
});

addMessageListener("SELECT", (message) => {
  renderChain(message.chain);
});

function renderChain(chain) {
  const output = render(chain);

  container.innerHTML = "";
  container.appendChild(output);

  refresh();
}
