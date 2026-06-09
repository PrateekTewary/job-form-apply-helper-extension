import { setInputValue, setReactSelectValue, clickCheckboxByText } from "../core/inputUtils.js";

export const dataBricksAdapter = {
  name: "dataBricks",

  fill(profile) {
    setInputValue(document.querySelector("#first_name"), profile.firstName);
    setInputValue(document.querySelector("#last_name"), profile.lastName);
    setInputValue(document.querySelector("#email"), profile.email);
    setInputValue(document.querySelector("#phone"), profile.phone);

    setInputValue(
      document.querySelector('input[aria-label="LinkedIn Profile"]'),
      profile.linkedin
    );

    setInputValue(
      document.querySelector('input[aria-label="Website"]'),
      profile.portfolio
    );

    setReactSelectValue(
      document.querySelector("#country"),
      profile.country
    );

    setReactSelectValue(
      document.querySelector("#candidate-location"),
      profile.location
    );

    // site-specific legal questions
    fillQuestionByText("legally authorized", profile.workAuthorization);
    fillQuestionByText("future need sponsorship", profile.needsSponsorship);
    fillQuestionByText("previously worked", profile.workedAtCompanyBefore);

    clickCheckboxByText("None of the above");
    clickCheckboxByText("Not applicable");
  }
};