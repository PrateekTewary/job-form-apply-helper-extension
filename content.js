const FIELD_MAPPINGS = {
	firstName: ["first name", "first_name", "given-name"],
	lastName: ["last name", "last_name", "family-name"],
	fullName: [
    "full name",
    "fullname",
    "name",
    "candidate name",
    "applicant name"
  ],
  email: [
    "email",
    "email address",
    "e-mail"
  ],
  phone: [
    "phone",
    "mobile",
    "contact number",
    "phone number"
  ],
  linkedin: [
    "linkedin",
    "linkedin url",
    "linkedin profile"
  ],
  github: [
    "github",
    "github url",
    "github profile"
  ],
  portfolio: [
    "portfolio",
    "website",
    "personal website",
    "portfolio url"
  ],
  summary: [
    "summary",
    "cover letter",
    "about you",
    "brief introduction"
  ]
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "AUTOFILL_JOB_FORM") {
    autofillJobForm();
  }
});

async function autofillJobForm() {

	console.log("Autofill script running in:", window.location.href);
  console.log("First name field:", document.querySelector("#first_name"));
  const profile = await chrome.storage.local.get(Object.keys(FIELD_MAPPINGS));

  const inputs = document.querySelectorAll("input, textarea");

  inputs.forEach((input) => {
    const fieldText = getFieldText(input);

    if (!fieldText) return;

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
  if (input.getAttribute("aria-label")) {
    parts.push(input.getAttribute("aria-label"));
  }

  const label = findLabel(input);
  if (label) parts.push(label.innerText);

  return parts.join(" ").toLowerCase();
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