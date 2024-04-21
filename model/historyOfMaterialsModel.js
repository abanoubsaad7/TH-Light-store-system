const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historyOfMaterialsSchema = new Schema ({
  date: { type: Date , default:Date.now , required: true },
  finalProductName: String,
  materialsUsed:[
    {
      name: String,
      numberOfMatrials: Number,
    }
  ],
  materialsAdded:{
    name:String,
    numberOfMatrials:Number,
  }
});
const HistoryOfMaterials = mongoose.model("HistoryOfMaterials",historyOfMaterialsSchema);


module.exports = HistoryOfMaterials;