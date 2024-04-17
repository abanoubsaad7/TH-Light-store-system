const express = require("express");
const router = express.Router();

//====== models =======
const Matrial = require('../model/matrialModel')
const HistoryOfMaterials = require('../model/historyOfMaterialsModel')


//=========== get all matrials  =======================
router.get("/", (req, res) => {
  Matrial.find()
    .then((allMatrials)=>{
      console.log(allMatrials);
      res.json({numberOfResults: allMatrials.length ,allMatrials:allMatrials})
    })
    .catch((err)=>res.status(400).json("Error :"+ err))
})

//======== add new matrial ==========================
router.post('/add-new-material', (req,res)=> {
  let matrial = new Matrial(req.body)
  matrial.save()
    .then((result)=>{
      console.log('added a new matrial');
      res.json({msg: 'Matrial added', addedMatrial: result});
    })
    .catch((err)=>{
      console.log('err :>> ', err);
    })
})

//========== add existing matrial number ==============================
router.post('/add-existing-material', (req,res)=> {
  let {name , numberOfMatrials} = req.body.materialsAdded;
  let existingMatrial = new HistoryOfMaterials({
    date:  new Date(),
    materialsAdded:{
      name: name,
      numberOfMatrials: numberOfMatrials
    }
  })
  existingMatrial.save()
    .then((result)=>{
      console.log('added a new matrial');

      res.json({msg: 'Matrial added', addedMatrial: result});
    })
    .catch((err)=>{
      console.log('err :>> ', err);
    })
})

//============ delete  matrial by id ======================
router.delete('/:id', (req,res)=>{
  const id = req.params.id;
  Matrial.findByIdAndDelete(id)
    .then((result)=>{
      console.log('matrial deleted successfully');
      res.json({msg:'matrial deleted successfully'});
    })
})




module.exports = router;
