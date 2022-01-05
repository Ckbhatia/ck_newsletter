<p align="center">
  <h1> 
   <img src="https://i.ibb.co/C5zTRC8/logo-via-logohub.png" alt="ck newsletter" width="20%">
   - A newsletter service 
  </h1>
</p>

[![Github](https://img.shields.io/github/stars/ckbhatia/ck_newsletter?style=social)]

This service aims to aid small and mid-sized bloggers to automate the process of delivering newsletters to subscribers. Blogger needs to hook two requests to their blog code and focus on writing amazing blogs. Your subscribers are going to receive the newsletters when you publish a new.

## Table of contents:

- How to create an account?
- How to create a project?
- How to activate newsletter service?
- Set-up the subscribe.
- Set-up the push newsletters.

### How to create an account?

1. Open the cknewsletter.herokuapp.com
2. Sign up with your email account.

### How to create a project?

1. Sign In with your account credentials.
2. Click on new to create a new project.

   <img src="http://imgur.com/CZNPiDtl.png" width="20%"/>

3. Fill details about your project.

   <img src="http://imgur.com/Wz1Is2Ul.png" width="40%"/>

   - Optionally, you can set-up your custom ( HTML ) newsletter template.

4. Submit it.

### How to activate newsletter service?

<small>These email credentials will be used to send newsletters to your subscribers.</small>

1. You need to go to the profile page.
2. Put your email and password credential to the relative input fields.
3. Select your email service.

   <img src="http://imgur.com/2wXn83ul.png" width="40%" />

4. Save it.

### Set-up the subscribe!

1. Create a fetch request with <code>PATCH</code> method.
2. Need to put two properties into the payload ( body ).
```
  {
   "subscriber": "*******@gmail.com",
   "apiKey": "15870449476249g9uo****"
  }
```

   - The <code>subscriber</code> should be dynamic. It should be your subscriber's email.
   - The <code>apiKey</code> should be your project's API Key.

3. Now you can make a patch request with these data on this endpoint: https://cknewsletter.herokuapp.com/api/v1/projects/subscribe
4. Your subscribers will be stored in this project's data.
5. Place this code in your blog's code where it will be invoked whenever your user submit the subscribe form.

### Set-up the push newsletters!

1. Create a fetch request with <code>PATCH</code> method.
2. Need to put two properties into the payload ( body ).

```
  {
    "slug": "vue",
    "apiKey": "15870449476249g9uo\*\*\*\*"
  }
```

   - Replace the apiKey with your project's API key.
   - Slug should be dynamic. Your article slug or id should be the value of slug key.

3. Notice that your slug will be used to create the link to your article. For Ex: "https://myblog.com/blog/vue"
4. Now you can make a patch request with these data on this endpoint: https://cknewsletter.herokuapp.com/api/v1/projects/slug
5. Place this patch request code to your blog code where it makes this request every time whenever you publish a new article.
6. It will push the newsletter to your subscribers of particular project.

**Voila, You are done now. Now write the best and keep your subscribers in sync with your latest articles.**

## Support

Feel free to reach out to me on chetansain86@gmail.com

# License

This project is **MIT licensed** unless otherwise specified.
