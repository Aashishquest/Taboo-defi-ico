const {CategoryInfo}=require('../models/Category');

const createCategory=async(categoryObj)=>{

    try{
        let category=new CategoryInfo(categoryObj);
        await category.save();
        return category;
    }catch(err){
        console.log(err);
    }

}

const findAllCategory=async()=>{
    try{
          let allcat=  await CategoryInfo.find().sort({_id:-1});
         console.log('allcat===',allcat)
          return allcat
    }catch(err){
        console.log(err);
    }

}

const findCategory=async(id)=>{
    try{
          return await CategoryInfo.findOne({_id:id});
    }catch(err){
        console.log(err);
    }

}

const findCategoryByName=async(name)=>{
    try{
          return await CategoryInfo.findOne({name:name});
    }catch(err){
        console.log(err);
    }

}

const updateCategory=async(id,category_name,image)=>{
      try{
          let category=await CategoryInfo.updateOne({_id:id},{$set:{name:category_name,image:image}});
           return category;
        }catch(err){
            console.log(err);
        }
}

const DeleteCategory=async(id)=>{
    try{

        let res= await  CategoryInfo.deleteOne({'_id':id});
        if(res){
              console.log("Painting Deleted Successfully!");
          }
      }catch(error){
        console.log(error);
      }
}
module.exports={
    createCategory,
    findAllCategory,
    findCategory,
    updateCategory,
    DeleteCategory,
    findCategoryByName
}