import { dataBricksAdapter } from "./databricks.js";
// import { leverAdapter } from "./leverAdapter.js";
// import { workdayAdapter } from "./workdayAdapter.js";
import { genericAdapter } from "./genericAdapter.js";

export function getAdapter(url) {
  if (url.includes("databricks.com")) return dataBricksAdapter;
//   if (url.includes("lever.co")) return leverAdapter;
//   if (url.includes("myworkdayjobs.com")) return workdayAdapter;

  return genericAdapter;
}