const pageServices=require('../services/pageServices');




const cretaePage=async(req,res)=>{
    let user_id = req.session.re_us_id;
    let title=req.body.title;
    let description=req.body.editor1;
    let page_name=req.body.page_name;
   
      let checkPage=await pageServices.findPageByName(page_name);
      if(checkPage)
      {
          let page=await pageServices.updatePage(checkPage._id,title,description);
      }else{

        let pageData={
            user_id:user_id,
            name:page_name,
            title:title,
            description:description
          }
         console.log('before',pageData) 
        let page =await pageServices.savePage(pageData); 
        console.log("page created",page)
      }   
     if(page_name=="terms"){ 
             res.redirect('/users/terms-conditions');
      }else{
        res.redirect('/users/privacy-policy');

      }
}

module.exports={
    cretaePage
}