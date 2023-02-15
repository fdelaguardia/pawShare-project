const { Schema, model } = require('mongoose');

const postSchema = new Schema(
  {
    description: String,
    postImage: String,
    pet: { type: Schema.Types.ObjectId, ref: "Pet" },
    petOwner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true
  }
);

module.exports = model('Post', postSchema);