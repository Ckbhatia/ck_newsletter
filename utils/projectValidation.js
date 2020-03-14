module.exports = projectValidation = (name, siteUrl) => {
  switch (true) {
    case !name:
      return (msg = "Please enter project name.");
    case !siteUrl:
      return (msg = "Please enter siteUrl.");
    case name && name.length < 5:
      return (msg = "Name length error");
    case siteUrl && siteUrl.length < 7:
      return (msg = "SiteUrl length error.");
    default:
      return null;
  }
};
