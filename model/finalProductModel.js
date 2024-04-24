const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const finalProductSchema = new Schema({
  name: String,
  price: Number,
  numberOfProducts: Number,
  description: String,
  matrialsUsed: [
    {
      nameOfMatrial: String,
      numberOfMatrials: Number,
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const FinalProduct = mongoose.model("FinalProduct", finalProductSchema);

module.exports = FinalProduct;
