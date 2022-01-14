global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const secure = require('tuba-secure');

let database=new MongoClient(secure.main.mongodb.url);
database.connect().then(()=>app.listen(2000))

app.get('*',async (req,res)=>{
    try{
        let found=await database.db("main").collection("redirect").findOne({from:req.path.replace("/","")})
        if(found){
            if(found.options.left||found.options.left==0){
                if(found.options.left>1){
                    redirect()
                    await database.db("main").collection("redirect").updateOne({from:req.path.replace("/","")},{$inc:{"options.limit":-1}})
                }else{
                    redirect()
                    await database.db("main").collection("redirect").deleteOne({from:req.path.replace("/","")})
                }
            }else{
                redirect()
            }
            if(found.options.count||found.options.count==0){
                await database.db("main").collection("redirect").updateOne({from:req.path.replace("/","")},{$inc:{"options.count":1}})
            }
            function redirect(){
                if(found.options.consent){
                    res.send(
                        `<button onclick="location.replace('${found.to.replace(/'/g,"\\'")}')">go to ${found.to}</button>`
                    )
                }else{res.redirect(found.to)}
            }
        }else{res.send(`<button>url doesn't exist, sorry</button>`)}
    }catch(e){res.send(`<button>hello hacker man</button>`)}
})