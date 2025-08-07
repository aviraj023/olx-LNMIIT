const Item=require("../models/Item")
const Category=require("../models/Categoty")
const User=require("../models/User")
const cloudinary=require("cloudinary").v2
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { populate } = require("dotenv");

async function getAllItems (req,res)
{
  try{

  

    const allItems= await Item.find({}).sort({createdAt:-1});

    if(!allItems)
    {
        res.status(403).json({
            msg:"Error while fetching Items"
        });
        return;
    }

    console.log("All Items sent");
    res.json({
        allItems
    });
  }
  catch(err)
  {
    res.status(403).json({
            msg:"Error while fetching Items"
        });
       return;

  }

    return;
    

}

async function addItem(req,res) 
{
  console.log(req);
    const {title,description,price,category,status}=req.body;
    //console.log("jojk");

    

    //add category checks

    var categoryId=category.trim();
   // categoryName = categoryName.toLowerCase();
    console.log("is valid response: "+mongoose.Types.ObjectId.isValid(categoryId));

    if(! (mongoose.Types.ObjectId.isValid(categoryId)))
    {
        res.status(400).json({
            success: false,
            msg:"Ivalid Category Id"
        });
        return;
    }

    try{
        var categoryData = await Category.findById(categoryId);
        console.log("Category data: "+categoryData);
    }

    catch(err)
    {
        console.log("failed")
        res.status(400).json({
            success: false,
            msg:"failed to fetch data"
        });
    }
    

    if(!categoryData)
    {
        return res.status(400).json({
            success: false,
            msg:"Did not find such category"
        });
        return;
    }

    

    try
    {
         var image = req.files?.image;
         var imagePath=image.tempFilePath;
        // console.log(image);
        console.log("req.files:", req.files);
//console.log("req.body:", req.body);
    }
    catch(e)
    {
        res.status(403).send("cant find imge");
        console.log("cant find image");
    }

    const compressedImagePath = path.join(__dirname,"../tmpstorage",`compressed_${Date.now()}.jpg`);

    const sharpInstance = sharp(imagePath);
    sharpInstance.jpeg({quality:70});
    await sharpInstance.toFile(compressedImagePath);
    
try{
    var uploadedImage = await cloudinary.uploader.upload(compressedImagePath,{
        folder:"items"});
   fs.unlink(compressedImagePath,(err)=>{
    console.log("got error");
   });

}
catch(err)
{
    console.log(err);
        res.send("error while uploading to cloud");
    return;
}
    
  
    const newItem = await Item.create({

        title,
        description,
        price,
        status,
        category:categoryId,
        image:uploadedImage.secure_url||"",
        owner:req.user.id
    });


    //updating category and owner lists

    await Category.findByIdAndUpdate(categoryId,{ $push:{ items: newItem._id} });

    await User.findByIdAndUpdate(req.user.id,{ $push:{ itemsToSell: newItem._id} });




    console.log("Item added succefully");
    res.json({
        msg:"item added succefully"
    });


  
}

async function updateItem (req,res)
{
    const {itemId}=req.body;

    const userId=req.user.id;

    const item=await Item.findById(itemId);

    if(!item)
    {
        res.status(400).json({
            msg:"No such Item found"
        });
    }

    if(item.owner != userId)
    {
        res.status(400).json({
            msg:"Not authorised to update the Item"
        });
        return;
    }

    const updates=req.body;
    

    if(req.files)
    {
      console.log("HII")
        try{
            var image = req.files?.image;
            var imagePath=image.tempFilePath;
        }
        catch(err)
        {
            res.status(403).send("cant find imge");
            console.log("cant find image");
        }

        const compressedImagePath = path.join(__dirname,"../tmpstorage",`compressed_${Date.now()}.jpg`);
        const sharpInstance = sharp(imagePath);
        sharpInstance.jpeg({quality:70});
        await sharpInstance.toFile(compressedImagePath);

        try
        {
            var uploadedImage = await cloudinary.uploader.upload(compressedImagePath,{folder:"items"});
        }
        catch(err)
        {
            console.log(err);
            res.send("error while uploading to cloud");
            return;
        }

        item.image=uploadedImage.secure_url;
    }
    console.log(updates);

    for(key in updates)
        {
            if(key!=="image" && Object.prototype.hasOwnProperty.call(updates,key))
            {
                item[key]=updates[key];
            }
        }

        await item.save();

        // return the details after update;
        console.log("Item is updated successfully");
        await getItemDetails(req,res);

    
}

async function getCategories(req,res) 
{
    try{
        const categories = await Category.find({});

        res.json({
        categories:categories,
        msg:"All categoties returned",

    });

    }
    catch(err)
    {
        res.status(403).send("error while returning categories")
    }

    

    
}

async function createCategory(req,res)
{
    console.log("called createcat");
    const {name,description}=req.body;

    if(!name)
    {
        res.status(403).json({
            success:false,
            msg:"Name of the category required"
        });
    }

    await Category.create({name,description});

    res.json({
        msg:"Category created successfully"
    });
    
}

async function getOwnersItems(req,res) 
{

    try{
        const ownerId=req.user.id;
        console.log("Owner Id: "+ownerId)
        const ownersItems = await Item.find({owner:ownerId}).sort({createdAt: -1});

        console.log("Items of owner sent succefully")
        return res.json({
            success:true,
            items:ownersItems
        });

    }
    catch(err)
    {
        res.status(403).json({
            msg:"Failed to retrive the items"
        });
    
    }    
}

async function getItemDetails(req, res) {
  try {
    const { itemId } = req.body;

    const itemsdetails = await Item.findById(itemId)
      .populate({
        path: "owner",
        populate: {
          path: "itemsToSell"
        }
      })
      .populate({
        path: "category"
      });

    const detailsToSend = {
      id: itemsdetails._id,
      title: itemsdetails.title,
      description: itemsdetails.description,
      price: itemsdetails.price,
      image: itemsdetails.image,
      status: itemsdetails.status,
      views: itemsdetails.views,
      createdAt: itemsdetails.createdAt,
      owner: {
        id: itemsdetails.owner._id,
        firstName: itemsdetails.owner.firstName,
        lastName: itemsdetails.owner.lastName,
        email: itemsdetails.owner.email,
        itemsToSell: itemsdetails.owner.itemsToSell
      },
      category: itemsdetails.category
    };

    console.log("fetched details successfully" + detailsToSend);

    res.json({
      itemDetails:detailsToSend
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: err.message
    });
  }
}


async function deleteItem(req, res) {
  try {
    const { itemId } = req.body;
    const userId = req.user.id;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(400).json({
        msg: "No such Item found"
      });
    }

    if (item.owner != userId) {
      return res.status(400).json({
        msg: "Not authorised to delete the Item"
      });
    }

    const categoryId = item.category;

    // Delete from Category and User lists
    await Category.findByIdAndUpdate(categoryId, {
      $pull: { items: itemId }
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { itemsToSell: itemId }
    });

    // Delete the item
    await Item.findByIdAndDelete(itemId);

    res.json({
      msg: "Item deleted successfully"
    });

  } catch (err) {
    res.status(403).json({
      msg: "Error while deleting item: " + err.message
    });
  }
}

async function updateStatus(req,res)
{
    const {itemId,itemStatus}=req.body;
    const userId=req.user.id;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(400).json({
        msg: "No such Item found"
      });
    }

    if (item.owner != userId) {
      return res.status(400).json({
        msg: "Not authorised to update the status"
      });
    }

    item.status=itemStatus;

    await item.save();

    // return updated Details
    await getItemDetails(req,res); 
}

async function incrementViews(req,res) 
{

    try
    {
        const {itemId}=req.body;
        const item= await Item.findById(itemId);

        if(!item)
        {
            res.status(403).json({
                msg:"Cant find the item"
            });
            return;
        }

        item.views++;
        await item.save();

        res.json({
            msg:"Views incremented"
        });
    
    }
    catch(err)
    {
        res.status(403).json({
            msg:"Error incrementing views "+err.message
        })
    }

}


async function getSearchResult(req,res) 
{
  try {
    const { keyword } = req.body;

    // If no keyword provided or invalid, return all items
    if (!keyword || typeof keyword !== "string" || keyword.trim() === "") {
      const allItems = await Item.find({}).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        items: allItems,
      });
    }

    const searchRegex = new RegExp(keyword.trim(), "i"); // case-insensitive

    // 1. Match items where title or description includes keyword
    const titleDescMatches = await Item.find({
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ],
    });

    // 2. Match category names and get their _ids
    const matchedCategories = await Category.find({
      name: { $regex: searchRegex },
    });
    const categoryIds = matchedCategories.map((cat) => cat._id);

    // 3. Find items where category matches any matched category ID
    const categoryMatches = categoryIds.length
      ? await Item.find({ category: { $in: categoryIds } })
      : [];

    // 4. Merge results without duplicates
    const mergedMap = new Map();
    [...titleDescMatches, ...categoryMatches].forEach((item) =>
      mergedMap.set(item._id.toString(), item)
    );
    const mergedItems = Array.from(mergedMap.values());

    return res.status(200).json({
      success: true,
      items: mergedItems, // may be empty if no match
    });
  } catch (error) {
    console.error("Error in simpleSearch:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error during search",
      error: error.message,
    });
  }
};



module.exports = {getAllItems,addItem,updateItem,getCategories,createCategory,getOwnersItems,getItemDetails,deleteItem,updateStatus,incrementViews,getSearchResult};