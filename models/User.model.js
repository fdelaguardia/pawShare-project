const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    email: {
        type: String,
        unique: true,
      },
    password: String,
    firstName: String,
    lastName: String,
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);