const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const matrialSchema = new Schema ({
  name: String,
  price: Number,
  numberOfMatrials:Number,
  description:String,
  createdAt: { type : Date , default : Date.now },
  updatedAt: { type : Date , default: Date.now}
});
const Matrial = mongoose.model("Matrial",matrialSchema);


module.exports = Matrial;