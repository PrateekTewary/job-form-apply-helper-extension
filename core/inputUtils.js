//handles - input text, textarea, select, checkbox, radio, number, email, tel, etc.
function setInputValue(element, value) {
  if (!element || value === undefined || value === null) return false;

  const tag = element.tagName.toLowerCase();
  const type = element.type?.toLowerCase();

  element.focus();

  if (tag === "textarea") {
    setNativeValue(element, value, window.HTMLTextAreaElement.prototype);
  }

  else if (tag === "select") {
    setSelectValue(element, value);
  }

  else if (tag === "input") {
    if (type === "checkbox") {
      setCheckboxValue(element, value);
    } 
    else if (type === "radio") {
      setRadioValue(element, value);
    } 
    else if (type === "file") {
      console.warn("(core/inputUtils/setInputValue()) - File inputs cannot be filled programmatically for security reasons.", element, value);
      return false;
    } 
    else {
      setNativeValue(element, value, window.HTMLInputElement.prototype);
    }
  }

  else {
    console.warn("(core/inputUtils/setInputValue()) - Unsupported element:", element, value);
    return false;
  }

  triggerEvents(element);
  element.blur();

  return true;
}

function setNativeValue(element, value, prototype) {
  const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;

  if (setter) {
    setter.call(element, value);
  } else {
    element.value = value;
  }
}

function setSelectValue(select, value) {
  const normalizedValue = String(value).toLowerCase().trim();

  const matchingOption = [...select.options].find(option => {
    return (
      option.value.toLowerCase().contains(normalizedValue) ||
      option.text.toLowerCase().contains(normalizedValue)
    );
  });

  if (matchingOption) {
    select.value = matchingOption.value;
  } else {
    select.value = value;
  }
}

function setCheckboxValue(checkbox, value) {
  if (typeof value === "boolean") {
    checkbox.checked = value;
    return;
  }

  const normalizedValue = String(value).toLowerCase().trim();

  checkbox.checked = ["true", "yes", "checked", "1"].includes(normalizedValue);
}

function setRadioValue(radio, value) {
  const normalizedValue = String(value).toLowerCase().trim();

  const radioGroup = document.querySelectorAll(
    `input[type="radio"][name="${CSS.escape(radio.name)}"]`
  );

  const matchingRadio = [...radioGroup].find(r => {
    return (
      r.value.toLowerCase().trim() === normalizedValue ||
      getTextNearElement(r).includes(normalizedValue)
    );
  });

  if (matchingRadio) {
    matchingRadio.checked = true;
    triggerEvents(matchingRadio);
  }
}

function triggerEvents(element) {
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
  element.dispatchEvent(new Event("blur", { bubbles: true }));
}

function getTextNearElement(element) {
  const labelByFor = element.id
    ? document.querySelector(`label[for="${CSS.escape(element.id)}"]`)
    : null;

  const labelText = labelByFor?.innerText || element.closest("label")?.innerText || "";

  return labelText.toLowerCase().trim();
}

function shouldSkipInput(input) {
  if (!input) return true;
  if (input.type === "hidden") return true;
  if (input.type === "file") return true;
  if (input.id?.includes("g-recaptcha")) return true;
  if (input.name?.includes("g-recaptcha")) return true;
  if (input.id?.includes("__search-input")) return true;
  if (input.classList.contains("visually-hidden")) return true;

  return false;
}

function setReactSelectValue(input, value) {
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