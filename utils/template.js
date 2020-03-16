const style = `color:rgb(0,0,0);font-family:Verdana, Arial, Helvetica, sans-serif;font-size:13.3333px;font-style:normal;font-weight:normal;letter-spacing:normal;orphans:2;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;background-color:rgb(255,255,255);`;

const template = (author, siteUrl, slug, siteName) => {
  return `<div>
      <div>
        <div>
          Hi,
          <br><br>I have published the new article. Here's: <a href="${siteUrl}/${slug}" target="_blank">${siteName}</a>
        </div>
        <div><br></div>
      </div>
      <div>It is an amazing article for you. I have explained the thing very well. I wish you would like it.
      </div>
      <div>
      </div>
      <div><br></div>
      <div>
        Cheers,<br>
      </div>
      <div>
       ${author}<br>
      </div>
    </div>
    `;
};

module.exports = template;
