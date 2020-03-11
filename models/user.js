const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define a schema
const Schema = mongoose.Schema;

// Validate email function
var validateEmail = function(email) {
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
    password: { type: String, required: true, min: 6 },
    emailCredential: String,
    passCredential: String,
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }]
  },
  { timestamps: true }
);

// Hash the password
userSchema.pre("save", async function(next) {
  if (this.password) {
    var salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
  next();
});

/**
 * Verifies the passwords
 * @param {string}
 * @return {Boolean}
 */
userSchema.methods.verifyPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// Export the User model
module.exports = mongoose.model("User", userSchema);
