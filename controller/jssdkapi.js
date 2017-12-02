const fs = require('fs')
const request = require('request')
const crypto = require('crypto')

//获取access_token
const getAccessToken = function(resolve){
	request.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx3be609f9a89a7a4a&secret=1debabae87ccee8879fb0a120ab19334', function(err, httpResponse, body){
		fs.writeFile('./oAuth/access_token.json', body, 'utf8',(err) => {resolve()});
	})
}

const getJsApiTicket = function(resolve){
	var access_token = JSON.parse(fs.readFileSync('./oAuth/access_token.json', 'utf8')).access_token
	request.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`,function(err, httpResponse, body){
		fs.writeFile('./oAuth/jsapi_ticket.json', body, 'utf8',(err) => {resolve()});
	})
}

const createNonceStr = function(){
	var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	var str = ''
	for(var i=0; i<16; i++){
		str += chars[Math.floor(Math.random()*62)]
	}
	return str
}

const getSig = (function(){
	var setSig = function(){
		new Promise(getAccessToken)
			.then(function(){
				return new Promise(getJsApiTicket)
			})
			.then(function(){
				var params = {
					noncestr : createNonceStr(),
					jsapi_ticket : JSON.parse(fs.readFileSync('./oAuth/jsapi_ticket.json', 'utf8')).ticket,
					timestamp : parseInt(Date.now()/1000),
					url : 'https://lijiahui.top/entry.html'
				}
				
				var arr = ['noncestr','jsapi_ticket','timestamp','url'].sort()
				var arr = arr.map(function(value){
					return value+'='+params[value]
				})
				var str = arr.join('&')
				var shasum = crypto.createHash('sha1')
				shasum.update(str)
				var signature = shasum.digest('hex')
				var obj = {
					noncestr: params.noncestr,
					timestamp: params.timestamp,
					signature
				}
				fs.writeFile('./oAuth/signature.json', JSON.stringify(obj), 'utf8',(err) => {});
			})
	}
	setSig()
	setInterval(function(){
		setSig()
	}, 7000*1000)
	
})()

const getSignature = function(req, res){
	var signature = fs.readFileSync('./oAuth/signature.json', 'utf8')
	res.end(signature)
}

module.exports = {
	getSignature
}