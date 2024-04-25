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


//============ get  final products by id =======================
router.get("/:id", (req, res) => {
  FinalProduct.findById(req.params.id)
    .then((finalProduct) => {
      console.log("allFinalProducts :>> ", finalProduct);
      res.json({
        finalProduct: finalProduct,
      });
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
});

//======== add new final product ==========================
router.post("/add-new-final-product", async (req, res) => {
  try {
    const {name,price,numberOfProducts,namesOfMaterialsUsed,numbersOfMatrialsUsed} = req.body;
    
    if (!Array.isArray(namesOfMaterialsUsed)) {
      namesOfMaterialsUsed = [namesOfMaterialsUsed];
    }
    if (!Array.isArray(numbersOfMatrialsUsed)) {
      numbersOfMatrialsUsed = [numbersOfMatrialsUsed];
    }

     // Ensure namesOfMaterialsUsed and numbersOfMatrialsUsed are arrays
     if (!Array.isArray(namesOfMaterialsUsed) || !Array.isArray(numbersOfMatrialsUsed)) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    // Construct MatrialsUsed array
    const MatrialsUsed = namesOfMaterialsUsed.map((nameOfMaterial, index) => ({
      nameOfMatrial: nameOfMaterial,
      numberOfMatrials: parseInt(numbersOfMatrialsUsed[index])
    }));
    const finalProduct = new FinalProduct({
      name: name ,
      price: price ,
      numberOfProducts: numberOfProducts ,
      matrialsUsed: MatrialsUsed,
    });
    console.log('finalProduct :>> ', finalProduct);
    const result = await finalProduct.save();

    console.log("Added a new final product");
    console.log("Result.matrialsUsed:", result.matrialsUsed);

    // Create a new MaterialsDailyReport document
    const materialsUsedd = new HistoryOfMaterials({
      date: new Date(), // Use the current date
      finalProductName: result.name, // Store the ID of the final product
      materialsUsed: result.matrialsUsed, // Store the materials used in the final product
      materialsAdded: null
    });

    // Save the MaterialsDailyReport document
    const  materialsUsedResult = await materialsUsedd.save();

    res.json({ msg: "Final product added", addedFinalProduct: result , materialsUsedResult: materialsUsedResult  });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to add final product" });
  }
});

//======== add existing final product number ========================
router.post("/add-existing-final-product", async (req, res) => {
  try {
    const {name,numberOfProducts,namesOfMaterialsUsed,numbersOfMatrialsUsed} = req.body.existingFinalProductAdded;
    
    if (!Array.isArray(namesOfMaterialsUsed)) {
      namesOfMaterialsUsed = [namesOfMaterialsUsed];
    }
    if (!Array.isArray(numbersOfMatrialsUsed)) {
      numbersOfMatrialsUsed = [numbersOfMatrialsUsed];
    }
     // Ensure namesOfMaterialsUsed and numbersOfMatrialsUsed are arrays
     if (!Array.isArray(namesOfMaterialsUsed) || !Array.isArray(numbersOfMatrialsUsed)) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    // Construct MatrialsUsed array
    const MatrialsUsed = namesOfMaterialsUsed.map((nameOfMaterial, index) => ({
      nameOfMatrial: nameOfMaterial,
      numberOfMatrials: parseInt(numbersOfMatrialsUsed[index])
    }));
    let existingfinalProduct = new HistoryOfFinalProduct({
      existingFinalProductAdded:{
        nameOfProduct: name,
        numberOfProducts: numberOfProducts,
        materialsUsed: MatrialsUsed
      }
    });
    const resultOfExistingfinalProduct = await existingfinalProduct.save();


    console.log("Added a existing final product to store");


    res.json({ msg: "Final product added", addedFinalProduct: resultOfExistingfinalProduct  });
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
