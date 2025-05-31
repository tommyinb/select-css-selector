import { addMessageListener } from "./port.js";

const container = document.getElementById("result");

addMessageListener("RESULT", (message) => {
  container.innerHTML = "";

  const count = document.createElement("div");
  count.className = "count";
  count.textContent = `Found ${message.queried.length} ${
    message.queried.length > 1 ? "elements" : "element"
  } in page`;
  container.appendChild(count);

  message.queried.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    container.appendChild(div);

    const tag = document.createElement("div");
    tag.className = "tag";
    tag.textContent = item.tagName;
    div.appendChild(tag);

    const text = document.createElement("div");
    text.className = "text";
    text.textContent = item.innerText;
    div.appendChild(text);
  });
});
