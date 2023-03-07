const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

const projectSchema = new Schema(
  {
    creator: { type: mongoose.ObjectId, ref: "User" },
    project_name: { type: String, required: true, text: true },
    description: [{ type: String, required: true, text: true }],
    location: { type: String, required: true },
    start_date: { type: String, default: "Open" },
    categories: [{ type: String, required: true }],
    tech_stack: [{ type: String }],
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.ObjectId, ref: "User", default: [] }],
    coordinates: [{ type: Number }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
