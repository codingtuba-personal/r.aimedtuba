const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const secure = require('tuba-secure');

let database=new MongoClient(secure.main.mongodb.url);
database.connect()

app.listen(2000)

app.get('*',async (req,res)=>{
    let found=await await database.db("main").collection("redirects").findOne({from:req.path.replace("/","")})
    if(found){
        if(found.options.limit){
            if(found.options.limit>1){
                redirect()
                await database.db("main").collection("redirects").updateOne({from:req.path.replace("/","")},{$inc:{"options.limit":-1}})
            }else{
                redirect()
                await database.db("main").collection("redirects").deleteOne({from:found.from})
            }
        }else{
            redirect()
        }
        if(found.options.count){
            await database.db("main").collection("redirects").updateOne({from:found.from},{$inc:{"options.count":1}})
        }
        function redirect(){
            if(found.options.consent){
                res.send(
                    `<button onclick="location.replace('${found.to.replace(/'/g,"\\'")}')">go to ${found.to}</button>`
                )
            }else{res.redirect(found.to)}
        }
    }else{res.send(`<button onclick="window.close()">url doesn't exist, sorry (close)</button>`)}
})