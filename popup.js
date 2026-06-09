const fields = [
  "firstName",
  "lastName",
  "fullName",
  "email",
  "countryCode",
  "phone",
  "country",
  "city",
  "address1",
  "address2",
  "pinCode",
  "linkedin",
  "github",
  "portfolio",
  "summary",
  "gender",
  "veteranStatus",
  "disabilityStatus",
  "workAuthorization",
  "needsSponsorship",
  "workedAtCompanyBefore"
];

document.addEventListener("DOMContentLoaded", async () => {
  const savedData = await chrome.storage.local.get(fields);

  fields.forEach((field) => {
    document.getElementById(field).value = savedData[field] || "";
  });
});

document.getElementById("saveBtn").addEventListener("click", async () => {
  const profile = {};

  fields.forEach((field) => {
    profile[field] = document.getElementById(field).value.trim();
  });

  await chrome.storage.local.set(profile);

  document.getElementById("status").innerText = "Saved!";
});

document.getElementById("fillBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  chrome.tabs.sendMessage(tab.id, {
    type: "AUTOFILL_JOB_FORM"
  });

  document.getElementById("status").innerText = "Autofill triggered!";
});