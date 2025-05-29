const port = chrome.runtime.connect({ name: "PANEL" });

port.onMessage.addListener((message) => {
  switch (message.type) {
    case "CHAIN":
      setChain(message.chain);
      break;
  }
});

function setChain(chain) {
  const div = document.createElement("div");
  div.textContent = JSON.stringify(chain, null, 2);
  document.body.appendChild(div);
}
