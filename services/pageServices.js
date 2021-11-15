const {PageInfo}=require('../models/Page');


const savePage=async(page)=>{
    try{
        let pageObj=new PageInfo(page);
        await pageObj.save();
        console.log(pageObj);
        return pageObj;
    }catch(err){
        console.log(err);
    }
}
const findPage=async(id)=>{
    try{

        return await PageInfo.findOne({_id:id});
    }catch(e){
        console.log(e);
    }
}

const findPageByName=async(name)=>{
    try{

        return await PageInfo.findOne({name:name});
    }catch(e){
        console.log(e);
    }
}
const updatePage=async(id,title,desc)=>{
    try{
       let page=PageInfo.updateOne({_id:id},{$set:{title:title,description:desc}});
        return page;
    }catch(err){
        console.log(err);
    }
}

module.exports={savePage,
                findPage,updatePage,
                findPageByName
               }
