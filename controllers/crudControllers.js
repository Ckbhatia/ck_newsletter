const userValidation = require("../utils/userValidation");
const projectValidation = require("../utils/projectValidation");
const filterData = require("../utils/filterData");
const Auth = require("../utils/auth");
const user = require("../models/user");
const triggerMail = require("../utils/mailer");
const template = require("../utils/template");

const getOne = (model, reqType) => async (req, res) => {
  // Action for login
  if (reqType === "login") {
    console.log('in login');
    const { email, username, password } = req.body;
    // validate body data
    const errmsg = await userValidation(null, email, username, password);
    if (errmsg) {
      return res.status(400).json({ msg: errmsg, status: "failed" });
    }
  }
  // Get current user: return current user if user has valid token
  else if (reqType === "getCurrentUser") {
    return res
      .status(200)
      .json({ msg: "Got the user.", status: "success", user: req.user });
  }
  // Login:
  const { email, username, password } = req.body;

  try {
    const doc = await model
      .findOne({ $or: [{ email }, { username }, { _id: req.params.id }] })
      .lean()
      .exec();

    if (!doc) {
      return res.status(404).json({ msg: "Data not found.", status: "failed" });
    }

    // Action for login
    if (reqType === "login") {
      // Check if current input password and encrypted pass are not same
      if (!model.verifyPassword(password, doc.password)) {
        return res
          .status(401)
          .json({ msg: "Incorrect password.", status: "failed" });
      }
      // Generate token
      const token = await Auth.generateToken(doc._id);
      return res.status(200).json({ data: doc, token });
    }

    res.status(200).json({ data: doc });
  } catch (e) {
    res.status(400).json({ msg: "There's an error.", status: "failed" });
  }
};

const getMany = (model) => async (req, res) => {
  try {
    const docs = await model
      .find({ author: req.user.username })
      .lean()
      .exec();

    res.status(200).json({ msg: "Got data.", status: "success", data: docs });
  } catch (e) {
    res
      .status(400)
      .json({ msg: "There's an error.", status: "failed", error: e.errmsg });
  }
};

const createOne = (model, reqType) => async (req, res) => {
  const {
    name,
    siteUrl,
    isCustomTemplate,
    customTemplateData,
    email,
    username,
    password
  } = req.body;

  // Request body data validations
  if (reqType === "createProject") {
    const errmsg = await projectValidation(name, siteUrl);
    if (errmsg) {
      return res
        .status(400)
        .json({ msg: "There's an error.", status: "failed", error: errmsg });
    }
  } else if (reqType === "createUser") {
    const errmsg = await userValidation(name, email, username, password);
    if (errmsg) {
      return res
        .status(400)
        .json({ msg: "There's an error.", status: "failed", error: errmsg });
    }
  }
  try {
    if (reqType === "createProject") {
      // Get projects by current project input name
      const prjArr = await model.find({
        author: req.user.username,
        name: { $in: [name] }
      });

      // Checks if prj Arra has objects more than zero
      if (prjArr.length > 0) {
        return res.status(400).json({
          msg: "Please try another project name!",
          status: "failed",
          error: "Duplicate project name error."
        });
      }
    }

    // Generate unique api key
    const apiKey =
      Date.now() +
      Math.random()
        .toString(36)
        .substring(2, 15);

    const doc = await model.create({
      name,
      siteUrl,
      email,
      apiKey,
      username,
      password
    });

    // Create project: put author in project and push project Id to user
    if (reqType === "createProject") {
      // Check isCustomTemplate if true save customTemplateData
      if (isCustomTemplate) {
        doc.isCustomTemplate = isCustomTemplate;
        doc.customTemplateData = customTemplateData;
      }
      doc.author = req.user.username;
      await doc.save();

      await user.findOneAndUpdate(
        { username: req.user.username },
        { $push: { projects: doc._id } }
      );
    }

    res
      .status(201)
      .json({ msg: "Request is successful", status: "success", data: doc });
  } catch (e) {
    res.status(400).json({
      msg: "There's an error.",
      status: "failed",
      error: e.errmsg
    });
  }
};

const updateOne = (model, reqType) => async (req, res) => {
  let {
    name,
    siteUrl,
    email,
    username,
    password,
    customTemplateData,
    isCustomTemplate,
    apiKey,
    subscriber,
    slug,
    emailCredential,
    passCredential,
    emailService
  } = req.body;

  try {
    let updatedDoc, msg;

    switch (reqType) {
      case "subscribe":
        updatedDoc = await model.findOneAndUpdate({ apiKey }, { new: true });
        // 1. Checks if subscriber is already in the list
        // 2. Checks for subscriber type and length
        if (updatedDoc.subscribers.includes(subscriber)) {
          return res
            .status(409)
            .json({ msg: "Already subscribed.", status: "failed" });
        } else if (typeof subscriber !== "string" || subscriber.length < 12) {
          return res.status(401).json({
            msg: "Subscriber must be a string and length must be min 12.",
            status: "failed",
            error: "Type or length error."
          });
        }
        updatedDoc.subscribers.push(subscriber);
        updatedDoc.save();
        msg = "Subscribed successfully.";
        break;
      case "unSubscribe":
        updatedDoc = await model.findOneAndUpdate({ apiKey }, { new: true });
        updatedDoc.subscribers.pull(subscriber);
        updatedDoc.save();
        msg = "Unsubscribed successfully.";
        break;
      case "updateSlugs":
        updatedDoc = await model.findOneAndUpdate({ apiKey }, { new: true });
        // 1. Checks if slug is already in the list.
        // 2. Checks condition checks for length and type
        if (updatedDoc.slugs.includes(slug)) {
          return res.status(409).json({
            msg: "Already pushed the slug.",
            status: "failed",
            error: "Duplicate slug error."
          });
        } else if (typeof slug !== "string" || slug.length < 4) {
          return res.status(400).json({
            msg: "Slug must be a string and length must be min 4.",
            status: "failed",
            error: "Type or length error."
          });
        }
        updatedDoc.slugs.push(slug);
        await updatedDoc.save();
        msg = "Slug pushed successfully.";
        // Get the user to get email credentials
        const response = await user.findOne({ username: updatedDoc.author });
        // Ready the template and trigger a mail
        const html = await template(
          response.name,
          updatedDoc.siteUrl,
          slug,
          updatedDoc.name
        );
        await triggerMail(
          response.emailCredential,
          response.passCredential,
          response.emailService,
          response.email,
          null,
          updatedDoc.subscribers,
          "The latest article for you.",
          html
        );
        break;
      default:
        // Filter the objects with valid values
        const data = await filterData(
          name,
          siteUrl,
          email,
          username,
          customTemplateData,
          isCustomTemplate,
          emailCredential,
          emailService
        );

        updatedDoc = await model.findOneAndUpdate(
          { $or: [{ _id: req.user._id }, { _id: req.params.id }] },
          data,
          { new: true },
          async (e, updatedDoc) => {
            if (e)
              return res.status(400).json({
                msg: "There's an error.",
                status: "failed",
                error: e.errmsg
              });
            // Updates and hashes the password
            if (password) {
              updatedDoc.password = password;
              await updatedDoc.save();
            }
            // Hashes the password of credential
            if (passCredential) {
              updatedDoc.passCredential = passCredential;
              await updatedDoc.save();
            }
            return updatedDoc;
          }
        );
        msg = "Updated the data.";
    }

    if (!updatedDoc) {
      return res.status(404).json({
        msg: "Data not found.",
        status: "failed",
        error: "No data."
      });
    }

    res.status(200).json({
      msg,
      status: "success",
      data: updatedDoc
    });
  } catch (e) {
    res
      .status(400)
      .json({ msg: "There's an error.", status: "failed", error: e.errmsg });
  }
};

const removeOne = (model) => async (req, res) => {
  try {
    const removed = await model.findOneAndRemove({
      $or: [{ _id: req.user.id }, { _id: req.params.id }]
    });

    if (!removed) {
      return res.status(404).json({
        msg: "Data not found.",
        status: "failed",
        error: "No data."
      });
    }

    return res.status(200).json({
      msg: "Data has been deleted successfully",
      status: "success",
      data: removed
    });
  } catch (e) {
    res
      .status(400)
      .json({ msg: "There's an error.", status: "failed", error: e.errmsg });
  }
};

module.exports = crudControllers = (model, reqType) => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model, reqType),
  getMany: getMany(model),
  getOne: getOne(model, reqType),
  createOne: createOne(model, reqType)
});
