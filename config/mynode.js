var wechat = require('wechat');
var config = {
  token: 'weixin',
  appid: 'wxdea876b4803acd4a'
};

module.exports = function(app){
    app.use('/mynode', wechat(config, function (req, res, next) {
        var message = req.weixin;
        if(message.Content){
            res.reply([
		      {
		        title: '【设计网站】',
		        description: '业最权威的交互设计指南，邀请著名设计师进行整理经典案例，打造一个交流的平台。',
		        picurl: 'http://www.36zhen.com/static/image/team/20160325/1458888212241.jpg',
		        url: 'http://www.36zhen.com/my?id=201'
		      },
		      {
		        title: '【交互设计】',
		        description: '行业最权威的交互设计指南，邀请著名设计师进行整理经典案例，打造一个交流的平台。',
		        picurl: 'http://www.36zhen.com/static/image/team/20160307/1457315141727.jpg',
		        url: 'http://www.36zhen.com/my?id=898'
		      }
		    ]);
        }
    }))
}