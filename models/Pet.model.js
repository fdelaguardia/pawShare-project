const { Schema, model } = require('mongoose');

const petSchema = new Schema(
  {
    name: String,
    breed: String,
    gender: String,
    age: String,
    iconImage: String,
    petBio: String,
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true
  }
);

module.exports = model('Pet', petSchema);