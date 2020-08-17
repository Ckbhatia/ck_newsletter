const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define a schema
const Schema = mongoose.Schema;

// Validate email function
var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
        "Please fill a valid email address"
      ]
    },
    password: { type: String, required: false, min: 6 },
    emailCredential: {
      type: String,
      trim: true,
      lowercase: true,
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
        "Please fill a valid email address"
      ]
    },
    passCredential: String,
    emailService: {
      type: String,
      enum: [
        "gmail",
        "mailgun",
        "sendgrid",
        "zoho",
        "hotmail",
        "godaddy",
        "godaddyasia",
        "godaddyeurope",
        "fastmail",
        "icloud",
        "mailjet",
        "aol"
      ]
    },
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }]
  },
  { timestamps: true }
);

// Hash the password
userSchema.pre("save", async function (next) {
  if (this.password) {
    var salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
  // TODO: temprory stopped the hashing
  // if (this.passCredential) {
  //   var salt = bcrypt.genSaltSync(10);
  //   this.passCredential = bcrypt.hashSync(this.passCredential, salt);
  // }
  next();
});

/**
 * Verifies the passwords
 * @param {string}
 * @return {Boolean}
 */
userSchema.statics.verifyPassword = (password, encryptPass) => {
  return bcrypt.compareSync(password, encryptPass);
};

userSchema.statics.verifyPassCredential = (passCredential, encrypassCred) => {
  return bcrypt.compareSync(passCredential, encrypassCred);
};

// Export the User model
module.exports = mongoose.model("User", userSchema);
