module.exports = filterData = (
  name,
  siteUrl,
  email,
  username,
  customTemplateData,
  isCustomTemplate,
  emailCredential
) => {
  let obj = {
    name,
    siteUrl,
    email,
    username,
    customTemplateData,
    isCustomTemplate,
    emailCredential
  };

  for (let key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
};
