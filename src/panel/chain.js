import { refresh } from "./filter.js";

export function render(input) {
  const output = document.createElement("div");
  output.className = "select-css-selector-chain";

  input.forEach((item, i) => {
    const line = document.createElement("div");
    line.className = "line";
    output.appendChild(line);

    const tagName = document.createElement("div");
    tagName.className = "tag";
    tagName.textContent = item.tagName.toLowerCase();
    addToggle(tagName);
    line.appendChild(tagName);

    if (i >= input.length - 1) {
      tagName.classList.add("active");
    }

    const list = document.createElement("div");
    list.className = "list";
    line.appendChild(list);

    if (item.id) {
      const id = document.createElement("div");
      id.className = "id";
      id.textContent = `#${item.id}`;
      addToggle(id);
      list.appendChild(id);
    }

    for (const inputClass of item.classList) {
      const outputClass = document.createElement("div");
      outputClass.className = "class";
      outputClass.textContent = `.${inputClass}`;
      addToggle(outputClass);
      list.appendChild(outputClass);
    }

    const index = document.createElement("div");
    index.className = "index";
    index.textContent = `:nth-child(${item.index + 1})`;
    addToggle(index);
    list.appendChild(index);

    const text = document.createElement("div");
    text.className = "text";
    text.textContent = item.innerText;
    line.appendChild(text);
  });

  return output;
}

function addToggle(element) {
  element.addEventListener("click", () => {
    element.classList.toggle("active");

    refresh();
  });
}
