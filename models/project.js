const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = Schema(
  {
    name: { type: String, required: true },
    siteUrl: { type: String, required: true, unique: true },
    apiKey: {
      type: String,
      required: true,
      unique: true,
      default:
        Date.now() +
        Math.random()
          .toString(36)
          .substring(2, 15)
    },
    slugs: [String],
    subscribers: [String],
    isCustomTemplate: { type: String, required: true, default: false },
    customTemplateData: { type: String },
    author: { type: Schema.Types.String, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
