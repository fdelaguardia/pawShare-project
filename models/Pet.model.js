const { Schema, model } = require('mongoose');

const petSchema = new Schema(
  {
    name: String,
    breed: String,
    sex: String,
    age: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true
  }
);

module.exports = model('Pet', petSchema);