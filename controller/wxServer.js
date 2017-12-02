const crypto = require('crypto')
const xml2js = require('xml2js')

const getMessage = function(req, res){
	var data = ''
	req.setEncoding('utf-8')
	req.on('data', function(chunk){
		data += chunk
	})
	req.on('end', function(){
		if(req.query.echostr){
			const { signature, timestamp, nonce, echostr } = req.query
			var token = 'weixin'
			var arr = [token, timestamp, nonce].sort()
			var str = arr.join('')
			var shasum = crypto.createHash('sha1')
			shasum.update(str)
			var shaRes = shasum.digest('hex')
			if(shaRes == signature){
				res.end(echostr)
			}else{
				res.end('false')
			}
		}else{
			xml2js.parseString(data, function(err, json){
				req.body = json
				var fromUsername = req.body.xml.FromUserName[0]
				var toUsername = req.body.xml.ToUserName[0]
				var contentRes = '基于nodeJS的消息回复\n\n'+'<a href="https://lijiahui.top/entry.html">欢迎访问：我的订阅号</a>' 
				var textTpl = `
					<xml>
	                    <ToUserName><![CDATA[${fromUsername}]]></ToUserName>
	                    <FromUserName><![CDATA[${toUsername}]]></FromUserName>
	                    <CreateTime>${parseInt(Date.now())/1000}</CreateTime>
	                    <MsgType><![CDATA[text]]></MsgType>
	                    <Content><![CDATA[${contentRes}]]></Content>
	                    <FuncFlag>0</FuncFlag>
	                    </xml>
				`
				res.end(textTpl)
			})
		}
		
	})
	
}



module.exports = {
	getMessage
}