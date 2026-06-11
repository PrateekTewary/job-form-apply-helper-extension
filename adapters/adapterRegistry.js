function getAdapter(url) {
  if (url.includes("databricks.com")) return dataBricksAdapter;
//   if (url.includes("lever.co")) return leverAdapter;
//   if (url.includes("myworkdayjobs.com")) return workdayAdapter;

  return genericAdapter;
}