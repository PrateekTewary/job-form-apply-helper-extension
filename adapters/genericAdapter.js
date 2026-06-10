const genericAdapter = {
  name: "Generic",

  fill(profile) {
    const inputs = document.querySelectorAll("input, textarea");

    inputs.forEach((input) => {
      if (shouldSkipInput(input)) return;

      const fieldText = getFieldText(input);
      const profileKey = findMatchingProfileKey(fieldText, FIELD_MAPPINGS);

      if (profileKey && profile[profileKey]) {
        setInputValue(input, profile[profileKey]);
      }
    });
  }
};