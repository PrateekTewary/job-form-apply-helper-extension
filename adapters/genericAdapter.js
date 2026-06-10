import { FIELD_MAPPINGS } from "../config/fieldMappings.js";
import { getFieldText } from "../core/fieldText.js";
import { findMatchingProfileKey } from "../core/matcher.js";
import { setInputValue, shouldSkipInput } from "../core/inputUtils.js";

export const genericAdapter = {
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