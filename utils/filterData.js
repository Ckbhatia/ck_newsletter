module.exports = filterData = (
  name,
  siteUrl,
  email,
  username,
  customTemplateData,
  isCustomTemplate,
  emailCredential,
  emailService
) => {
  let obj = {
    name,
    siteUrl,
    email,
    username,
    customTemplateData,
    isCustomTemplate,
    emailCredential,
    emailService
  };

  for (let key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
};
