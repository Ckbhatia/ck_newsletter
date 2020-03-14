module.exports = filterData = (
  name,
  siteUrl,
  email,
  username,
  customTemplateData,
  isCustomTemplate,
  subscribe,
  slug
) => {
  let obj = {
    name,
    siteUrl,
    email,
    username,
    customTemplateData,
    isCustomTemplate,
    subscribe,
    slug
  };

  for (let key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
};
