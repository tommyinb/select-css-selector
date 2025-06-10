import { refresh } from "./filter.js";

export function render(input) {
  const output = document.createElement("div");
  output.className = "select-css-selector-chain";

  input.forEach((item, i) => {
    const line = document.createElement("div");
    line.className = "line";
    output.appendChild(line);

    const arrow = document.createElement("div");
    arrow.className = "arrow";
    arrow.textContent = "> ";
    line.appendChild(arrow);

    if (i > 0) {
      addToggle(arrow);
    }

    const list = document.createElement("div");
    list.className = "list";
    line.appendChild(list);

    const tagName = document.createElement("div");
    tagName.className = "tag";
    tagName.textContent = item.tagName.toLowerCase();
    addToggle(tagName);
    list.appendChild(tagName);

    if (i >= input.length - 1) {
      tagName.classList.add("active");
    }

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

    for (const attribute of item.attributes) {
      const outputAttribute = document.createElement("div");
      outputAttribute.className = "attribute";
      outputAttribute.textContent = `[${attribute.name}${
        attribute.value ? `="${attribute.value}"` : ""
      }]`;
      addToggle(outputAttribute);
      list.appendChild(outputAttribute);
    }

    const index = document.createElement("div");
    index.className = "index";
    index.textContent = `:nth-child(${item.index + 1})`;
    addToggle(index);
    list.appendChild(index);

    const text = document.createElement("div");
    text.className = "text";
    line.appendChild(text);

    const content = document.createElement("div");
    content.className = "content";
    content.textContent = item.innerText;
    text.appendChild(content);
  });

  return output;
}

function addToggle(element) {
  element.addEventListener("click", () => {
    element.classList.toggle("active");

    refresh();
  });
}
