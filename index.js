const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const secure = require('tuba-secure');

let database=new MongoClient(secure.main.mongodb.url);
database.connect()

app.listen(2000)

app.get('*',async (req,res)=>{
    let found=await (await database).db("main").collection("redirects").findOne({from:req.path.replace("/","")})
    if(found){
        res.redirect(found.to)
    }else{res.send(`<button onclick="window.close()">url doesn't exist, sorry (close)</button>`)}
})