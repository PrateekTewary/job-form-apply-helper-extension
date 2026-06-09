import { getProfile } from "../core/storage.js";
import { getAdapter } from "../adapters/adapterRegistry.js";

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "AUTOFILL_JOB_FORM") {
    runAutofill();
  }
});

async function runAutofill() {
  const profile = await chrome.storage.local.get([...Object.keys(FIELD_MAPPINGS)]);
  const adapter = getAdapter(window.location.href);

  console.log("Using adapter:", adapter.name);

  adapter.fill(profile);
}

/*
async function autofillJobForm() {

	console.log("Autofill script running in:", window.location.href);
  console.log("First name field:", document.querySelector("#first_name"));
  const profile = await chrome.storage.local.get([
		...Object.keys(FIELD_MAPPINGS),
		"workAuthorization",
    "needsSponsorship",
    "workedAtCompanyBefore"
	]);

  const inputs = document.querySelectorAll("input, textarea");

  inputs.forEach((input) => {
		if (shouldSkipInput(input)) return;

    const fieldText = getFieldText(input);
    if (!fieldText) return;

    console.log("Detected field:", fieldText);

    // checkboxes/radios handled separately
    if (input.type === "checkbox" || input.type === "radio") {
      handleCheckboxOrRadio(input, fieldText, profile);
      return;
    }

		if (input.classList.contains("select__input")) {
			const matchedProfileKey = findMatchingProfileKey(fieldText);

			if (matchedProfileKey && profile[matchedProfileKey]) {
				setReactSelectValue(input, profile[matchedProfileKey]);
			}

			return;
		}

    const matchedProfileKey = findMatchingProfileKey(fieldText);

    if (matchedProfileKey && profile[matchedProfileKey]) {
      setInputValue(input, profile[matchedProfileKey]);
    }
  });
}

function getFieldText(input) {
  const parts = [];

  if (input.name) parts.push(input.name);
  if (input.id) parts.push(input.id);
  if (input.placeholder) parts.push(input.placeholder);
  if (input.autocomplete) parts.push(input.autocomplete);

  const ariaLabel = input.getAttribute("aria-label");
  if (ariaLabel) parts.push(ariaLabel);

  const label = findLabel(input);
  if (label) parts.push(label.innerText);

  const containerText = input.closest("div, fieldset, label")?.innerText;
  if (containerText) parts.push(containerText);

  return parts.join(" ").replace(/\s+/g, " ").toLowerCase();
}

function findLabel(input) {
  if (input.id) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) return label;
  }

  return input.closest("label");
}

function findMatchingProfileKey(fieldText) {
  for (const [profileKey, keywords] of Object.entries(FIELD_MAPPINGS)) {
    for (const keyword of keywords) {
      if (fieldText.includes(keyword)) {
        return profileKey;
      }
    }
  }

  return null;
}

function setInputValue(input, value) {
  input.focus();

  const nativeInputValueSetter =
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;

  const nativeTextAreaValueSetter =
    Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;

  if (input.tagName.toLowerCase() === "textarea") {
    nativeTextAreaValueSetter.call(input, value);
  } else {
    nativeInputValueSetter.call(input, value);
  }

  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));

  input.blur();
}

function shouldSkipInput(input) {
  if (input.type === "hidden") return true;
  if (input.type === "file") return true;
  if (input.id?.includes("g-recaptcha")) return true;
  if (input.name?.includes("g-recaptcha")) return true;
  if (input.id?.includes("__search-input")) return true;
  if (input.classList.contains("visually-hidden")) return true;
  if (input.offsetParent === null && input.type !== "checkbox" && input.type !== "radio") return true;

  return false;
}

function setReactSelectValue(input, value) {
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

function handleCheckboxOrRadio(input, fieldText, profile) {
  const text = fieldText.toLowerCase();

  if (text.includes("none of the above")) {
    clickInput(input);
  }

  if (text.includes("not applicable")) {
    clickInput(input);
  }
}

function clickInput(input) {
  if (!input.checked) {
    input.click();
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }
}
  */