const express =require("express");
const router=express.Router();
const {addItem, getAllItems, updateItem, getCategories,createCategory,getOwnersItems,getItemDetails,deleteItem,updateStatus,incrementViews,getSearchResult}=require("../controllers/Item");
const {authenticateToken}=require("../controllers/Auth");


router.post("/addItem",authenticateToken,addItem);
router.post("/updateItem",authenticateToken,updateItem);
router.post("/updateStatus",authenticateToken,updateStatus);

router.get("/getAllItems",getAllItems);
router.get("/getCategories",getCategories);

router.post("/getSearchResult",getSearchResult);

router.post("/createCategory",createCategory);
router.get("/getOwnersItems",authenticateToken,getOwnersItems);

router.post("/getItemDetails",getItemDetails);
router.post("/deleteItem",authenticateToken,deleteItem);

router.post("/incrementViews",incrementViews);





   









module.exports=router;