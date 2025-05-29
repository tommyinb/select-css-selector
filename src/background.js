chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

let contentPorts = [];
let panelPorts = [];
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "PANEL") {
    panelPorts.push(port);

    for (const contentPort of contentPorts) {
      contentPort.postMessage({ type: "PANEL_OPEN" });
    }

    port.onMessage.addListener((message) => {
      for (const contentPort of contentPorts) {
        contentPort.postMessage(message);
      }
    });

    port.onDisconnect.addListener(() => {
      panelPorts = panelPorts.filter((p) => p !== port);

      if (panelPorts.length === 0) {
        for (const contentPort of contentPorts) {
          contentPort.postMessage({ type: "PANEL_CLOSE" });
        }
      }
    });
  } else if (port.name === "CONTENT") {
    contentPorts.push(port);

    if (panelPorts.length > 0) {
      port.postMessage({ type: "PANEL_OPEN" });
    }

    port.onMessage.addListener((message) => {
      for (const panelPort of panelPorts) {
        panelPort.postMessage(message);
      }
    });

    port.onDisconnect.addListener(() => {
      contentPorts = contentPorts.filter((p) => p !== port);
    });
  }
});
