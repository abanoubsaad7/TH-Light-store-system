const express = require("express");
const router = express.Router();

//=============== models ====================================
const FinalProduct = require("../model/finalProductModel");
const Matrial = require("../model/matrialModel");
const HistoryOfMaterials = require("../model/historyOfMaterialsModel");
const HistoryOfFinalProduct = require( "../model/historyOfFinalProductModel")

//============ get all final products =======================
router.get("/", (req, res) => {
  FinalProduct.find()
    .then((allFinalProducts) => {
      console.log("allFinalProducts :>> ", allFinalProducts);
      res.json({
        numberOfResults: allFinalProducts.length,
        allFinalProducts: allFinalProducts,
      });
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
});

//======== add new final product ==========================
router.post("/add-new-final-product", async (req, res) => {
  try {
    let finalProduct = new FinalProduct(req.body);
    const result = await finalProduct.save();

    console.log("Added a new final product");
    console.log("Result.matrialsUsed:", result.matrialsUsed);

    // Create a new MaterialsDailyReport document
    const materialsUsed = new HistoryOfMaterials({
      date: new Date(), // Use the current date
      finalProductID: result._id, // Store the ID of the final product
      materialsUsed: result.matrialsUsed, // Store the materials used in the final product
      materialsAdded: null
    });

    // Save the MaterialsDailyReport document
    const  materialsUsedResult = await materialsUsed.save();

    res.json({ msg: "Final product added", addedFinalProduct: result , materialsUsedResult: materialsUsedResult  });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to add final product" });
  }
});

//======== add existing final product number ========================
router.post("/add-existing-final-product", async (req, res) => {
  try {
    let existingfinalProduct = new HistoryOfFinalProduct(req.body);
    const resultOfExistingfinalProduct = await existingfinalProduct.save();


    console.log("Added a existing final product to store");

    // Create a new MaterialsDailyReport document
    const materialsUsed = new HistoryOfMaterials({
      date: new Date(), // Use the current date
      finalProductID: resultOfExistingfinalProduct._id, // Store the ID of the final product
      materialsUsed: resultOfExistingfinalProduct.existingFinalProductAdded.materialsUsed, // Store the materials used in the final product
      materialsAdded: null
    });

    // Save the MaterialsDailyReport document
    const  materialsUsedResult = await materialsUsed.save();

    res.json({ msg: "Final product added", addedFinalProduct: resultOfExistingfinalProduct , materialsUsedResult: materialsUsedResult  });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to add final product" });
  }
});

//============ delete  final product by id ======================
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  FinalProduct.findByIdAndDelete(id).then((result) => {
    console.log("final product deleted successfully");
    res.json({ msg: "final product deleted successfully" });
  });
});

module.exports = router;
