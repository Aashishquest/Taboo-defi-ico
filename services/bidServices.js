const {BidInfo}=require('../models/Bid');


const saveBid=async(bidData)=>{
    try{
        let  bidObj=new BidInfo(bidData);
        await bidObj.save();
        return bidObj;
    }
    catch(e)
    {
        console.log(e)
    }
}
module.exports={saveBid}