const IPFS=require('ipfs-mini',1,1,5);

const ipfs=new IPFS({host:'ipfs.infura.io',port:5001,protocol:'https'});
const addIPFS=async(data)=>{
   // console.log(data.image);
    ipfs.add(data.tokenUrl,(err,hash)=>{
    if(err){
        return console.log(err);
      }
      else
      {
         return console.log('https://ipfs.infura.io/ipfs/'+hash);
      }
   });
}

module.exports={addIPFS}