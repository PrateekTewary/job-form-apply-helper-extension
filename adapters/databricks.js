const dataBricksAdapter = {
  name: "dataBricks",

  fill(profile) {
    autofillJobForm();
    console.log("Autofill script running in:", window.location.href);
    console.log("First name field:", document.querySelector("#first_name"));
    console.log("#first_name - ", document.querySelector("#first_name"), profile.firstName);
    console.log("#last_name - ", document.querySelector("#last_name"), profile.lastName);
    console.log("#email - ", document.querySelector("#email"), profile.email);
    console.log("#phone - ", document.querySelector("#phone"), profile.phone);

    console.log(
      document.querySelector('input[aria-label="LinkedIn Profile"]'),
      profile.linkedin
    );

    console.log(
      document.querySelector('input[aria-label="Website"]'),
      profile.portfolio
    );

    console.log(
      document.querySelector("#country"),
      profile.country
    );

    console.log(
      document.querySelector("#candidate-location"),
      profile.location
    );

    // site-specific legal questions
    // fillQuestionByText("legally authorized", profile.workAuthorization);
    // fillQuestionByText("future need sponsorship", profile.needsSponsorship);
    // fillQuestionByText("previously worked", profile.workedAtCompanyBefore);

    // clickCheckboxByText("None of the above");
    // clickCheckboxByText("Not applicable");
  }
};

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

function handleCheckboxOrRadio(input, fieldText, profile) {
  const text = fieldText.toLowerCase();

  if (text.includes("none of the above")) {
    clickInput(input);
  }

  if (text.includes("not applicable")) {
    clickInput(input);
  }
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