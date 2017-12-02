const express = require('express')
const router = express.Router()

const wxServerController = require('../controller/wxServer.js')
const jssdkapiController = require('../controller/jssdkapi.js')

//定义验证微信服务器接口
router.all('/getMessage', wxServerController.getMessage)
router.all('/getSignature', jssdkapiController.getSignature)

module.exports = router
