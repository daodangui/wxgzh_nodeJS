const express = require('express')
var https = require('https')
const path = require('path')
const bodyParser = require('body-parser')
const apiRoute = require('./routes/api.js')
const jssdkapi = require('./controller/jssdkapi.js')
const request = require('request')
const fs = require('fs')


var options = {
  key: fs.readFileSync('./ssl/214090145620757.key'),
  cert: fs.readFileSync('./ssl/214090145620757.pem')
}

// jssdkapi.getAccessToken()

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/wxgzh/api', apiRoute)

https.createServer(options, app).listen(443, function(){
	console.log('wxgzh server runing on https://lijiahui.top')
});