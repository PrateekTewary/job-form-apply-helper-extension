export function setInputValue(input, value) {
  if (!input || !value) return;

  input.focus();

  const tag = input.tagName.toLowerCase();

  const setter =
    tag === "textarea"
      ? Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set
      : Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;

  setter.call(input, value);

  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));

  input.blur();
}

export function shouldSkipInput(input) {
  if (!input) return true;
  if (input.type === "hidden") return true;
  if (input.type === "file") return true;
  if (input.id?.includes("g-recaptcha")) return true;
  if (input.name?.includes("g-recaptcha")) return true;
  if (input.id?.includes("__search-input")) return true;
  if (input.classList.contains("visually-hidden")) return true;

  return false;
}

export function setReactSelectValue(input, value) {
  if (!input || !value) return;

  input.focus();
  input.click();

  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));

  setTimeout(() => {
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        bubbles: true
      })
    );
  }, 300);
}