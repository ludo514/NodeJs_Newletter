const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const app = express()

dotenv.config()
app.use('/assets', express.static('assets'))
app.use(bodyParser.urlencoded({ extended: true })) 

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html")
})

app.post("/", function(req, res){
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const email = req.body.email


    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: first_name,
                    LNAME: last_name
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)
    const url = `https://us18.api.mailchimp.com/3.0/lists/${process.env.list_id}`
    const options = {
        method: "POST",
        auth: `ludo:${process.env.Api_key}`
    }
    const request = https.request(url, options, function(response){
        if(response.statusCode == 200){
            res.sendFile(__dirname + "/sucess.html")
        }else{
            res.sendFile(__dirname + "/fail.html")
        }
        response.on("data", function(data){
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData)
    request.end()
})

app.post("/fail", function(req,res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started")
}) 

//API key
//7f3de2bf953e118465ae331080dbb588-us18

//list id
//e4acbcf8b1