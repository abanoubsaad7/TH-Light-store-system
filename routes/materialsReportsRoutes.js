const express = require("express");
const router = express.Router();

//============== models =======================
const HistoryOfMaterials = require("../model/historyOfMaterialsModel");
const Matrial = require("../model/matrialModel");


//=================== daily report ================================================
router.get("/daily", (req, res) => {
  const { selectedDate } = req.query; // Get the date from the query parameter
  const startOfDay = new Date(selectedDate);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  HistoryOfMaterials.find({
    date: { $gte: startOfDay, $lt: endOfDay },
  }).then((resultOfExistingMatrials) => {
    Matrial.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    }).then((resultOfNewMatrials) => {
      res.json({
        numberOfReportsOfExistingMatrials: resultOfExistingMatrials.length,
        reportsOfExistingMatrials: resultOfExistingMatrials,
        numberOfReportsOfNewMatrials: resultOfNewMatrials.length,
        reportsOfNewMatrials: resultOfNewMatrials,
      });
    });
  });
});

//========================= monthly report =================================================
router.get("/monthly", (req, res) => {
  const { selectedDate } = req.query;
  const date = new Date(selectedDate);

  // Extract month and year from selectedDate
  const selectedMonth = date.getMonth() + 1; // Months are 0-indexed, so we add 1
  const selectedYear = date.getFullYear();

  // Set start and end dates of the month
  const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1); // Months are 0-indexed, so we subtract 1
  const endOfMonth = new Date(selectedYear, selectedMonth, 0); // Setting day to 0 gives the last day of the previous month

  HistoryOfMaterials.find({
    date: { $gte: startOfMonth, $lt: endOfMonth },
  })
    .then((resultOfExistingMatrials) => {
      Matrial.find({
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      }).then((resultOfNewMatrials) => {
        res.json({
          numberOfReportsOfExistingMatrials: resultOfExistingMatrials.length,
          reportsOfExistingMatrials: resultOfExistingMatrials,
          numberOfReportsOfNewMatrials: resultOfNewMatrials.length,
          reportsOfNewMatrials: resultOfNewMatrials,
        });
      });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
