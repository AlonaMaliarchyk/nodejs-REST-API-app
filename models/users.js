const {Schema, model} = require("mongoose");
const {handleMongooseError} = require("../utils")

const emailRegexp = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const usersSchema = new Schema({
  name: {
    type: String,
    minlenghth: 6,
    required: [true, 'Name for user'],
  },
    password: {
      type: String,
      minlenghth: 6,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: emailRegexp,
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: {
        type: String,
        default: ""
    },
    avatarURL:{
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
}, {versionKey: false});

usersSchema.post("save", handleMongooseError);
const Users = model("user", usersSchema);


module.exports = {
    Users,
}