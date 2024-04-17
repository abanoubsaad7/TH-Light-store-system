const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historyOfFinalProductSchema = new Schema ({
  date: { type: Date, required: true , default:Date.now },
  soldFinalProducts:[
    {
      name: String,
      numberOfProducts: Number,
    }
  ],
  existingFinalProductAdded:{
    name:String,
    numberOfProducts:Number,
    materialsUsed:Array
  }
});
const HistoryOfFinalProduct = mongoose.model("HistoryOfFinalProduct",historyOfFinalProductSchema);


module.exports = HistoryOfFinalProduct;