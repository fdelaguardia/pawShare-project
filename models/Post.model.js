const { Schema, model } = require('mongoose');

const postSchema = new Schema(
  {
    description: String,
    postImage: String,
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    pet: { type: Schema.Types.ObjectId, ref: "Pet" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true
  }
);

module.exports = model('Post', postSchema);