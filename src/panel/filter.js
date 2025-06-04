import { postMessage } from "./port.js";

const input = document.getElementById("filter");

export function refresh() {
  const chain = document.querySelector(".select-css-selector-chain");
  if (!chain) {
    return;
  }

  const text = [...chain.childNodes]
    .map((line) =>
      [...line.childNodes]
        .flatMap((node) => [node, ...node.childNodes])
        .filter((node) => node.classList)
        .filter((node) => node.classList.contains("active"))
        .map((node) => node.textContent)
        .join("")
    )
    .filter((item) => item)
    .join(" ");

  input.value = text.trim();

  postFilter();
}

input.addEventListener("input", postFilter);

function postFilter() {
  const text = input.value.trim();
  if (!text) {
    return;
  }

  postMessage({ type: "FILTER", text });
}
