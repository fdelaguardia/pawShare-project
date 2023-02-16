const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    pet: { type: Schema.Types.ObjectId, ref: "Pet" },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    comment: { type: String, maxlength: 200 }
  });

module.exports = model('Comment', commentSchema);