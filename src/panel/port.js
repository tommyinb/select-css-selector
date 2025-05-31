const port = chrome.runtime.connect({ name: "PANEL" });

setInterval(() => {
  postMessage({ type: "PING" });
}, 1000);

export function addMessageListener(type, callback) {
  port.onMessage.addListener((message) => {
    if (message.type === type) {
      callback(message);
    }
  });
}

export function postMessage(message) {
  port.postMessage(message);
}
