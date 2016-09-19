
var wechat = require('wechat');
var config = {
  token: 'weixin',
  appid: 'wxdea876b4803acd4a'
};


module.exports = function(app){
    app.use('/mynode', wechat(config, function (req, res, next) {
        var message = req.weixin;
        if(message.Content){
            res.reply('欢迎关注36镇');
        }
    }))
}