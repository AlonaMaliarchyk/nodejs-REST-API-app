const {Schema, model} = require("mongoose");
const {handleMongooseError} = require("../utils")

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      favorite: {
        type: Boolean,
        default: false,
      }, 
}, {versionKey: false});
const Contact = model("contact", contactSchema);
contactSchema.post("save", handleMongooseError);



module.exports = {
    Contact,
}