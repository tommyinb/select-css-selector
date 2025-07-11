const port = chrome.runtime.connect({ name: "CONTENT" });

setInterval(() => port.postMessage({ type: "PING" }), 1000);

port.onMessage.addListener((message) => {
  switch (message.type) {
    case "SELECT_ON":
      tryStart();
      break;

    case "SELECT_OFF":
      tryStop();
      break;

    case "FILTER":
      applyFilter(message.text);
      break;
  }
});

const state = {
  started: false,

  mousingElement: null,
  mousedElement: null,
  mouseListener: null,

  clickListener: null,
  keyListener: null,
};

function tryStart() {
  if (state.started) {
    return;
  }

  state.started = true;

  state.mousingElement = document.createElement("div");
  state.mousingElement.className = "select-css-selector-mouse";

  document.body.appendChild(state.mousingElement);

  state.mouseListener = (event) => {
    const x = event.clientX;
    const y = event.clientY;
    state.mousedElement = document.elementFromPoint(x, y);

    if (!state.mousedElement) {
      return;
    }

    const rect = state.mousedElement.getBoundingClientRect();
    state.mousingElement.style.left = `${rect.left}px`;
    state.mousingElement.style.top = `${rect.top}px`;
    state.mousingElement.style.width = `${rect.width}px`;
    state.mousingElement.style.height = `${rect.height}px`;
    state.mousingElement.style.background = "rgba(0,0,255,0.5)";

    tryPost("PREVIEW");
  };
  document.addEventListener("mousemove", state.mouseListener);

  state.clickListener = (event) => {
    if (event.button !== 0) {
      return;
    }

    tryPost("SELECT");
  };
  document.addEventListener("click", state.clickListener);

  state.keyListener = (event) => {
    if (!["a", "A", "q", "Q", "Escape"].includes(event.key)) {
      return;
    }

    tryPost("SELECT");
  };
  document.addEventListener("keydown", state.keyListener);

  function tryPost(type) {
    if (!state.mousedElement) {
      return;
    }

    const chain = [];
    let currentElement = state.mousedElement;
    while (currentElement) {
      chain.unshift({
        tagName: currentElement.tagName,
        id: currentElement.id,
        classList: Array.from(currentElement.classList),
        attributes: Array.from(currentElement.attributes)
          .filter(
            (attribute) =>
              attribute.name !== "id" &&
              attribute.name !== "class" &&
              attribute.name !== "style"
          )
          .map((attribute) => ({
            name: attribute.name,
            value: attribute.value,
          })),
        index: [...(currentElement.parentNode?.childNodes ?? [])].indexOf(
          currentElement
        ),
        innerText: currentElement.innerText,
      });

      currentElement = currentElement.parentElement;
    }

    port.postMessage({ type, chain });
  }
}

function tryStop() {
  if (!state.started) {
    return;
  }

  state.started = false;

  document.body.removeChild(state.mousingElement);
  state.mousingElement = null;

  state.mousedElement = null;

  document.removeEventListener("mousemove", state.mouseListener);
  state.mouseListener = null;

  document.removeEventListener("keydown", state.keyListener);
  state.keyListener = null;
}

function applyFilter(text) {
  if (document.visibilityState !== "visible") {
    return;
  }

  let selected;
  try {
    selected = [...document.querySelectorAll(text)];
  } catch (error) {
    return;
  }

  const queried = selected.map((element) => ({
    tagName: element.tagName,
    innerText: element.innerText,
  }));

  port.postMessage({ type: "RESULT", queried });
}
