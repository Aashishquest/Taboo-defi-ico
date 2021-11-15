const bidServices=require('../services/bidServices');


const placeBid=async(req,res)=>{
    let wallet_address=req.query.address;
    let content_id=req.query.content_id;
    let bid_amount=req.query.bid_amount;
    try{
        let bidObj={content_id:content_id,
                    wallet_address:wallet_address,
                    bid_amount:bid_amount}
        let bid=await bidServices.saveBid(bidObj);

        res.send(bid);
    }catch(e){console.log(e)}
}
module.exports={placeBid}