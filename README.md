#电影网站
 使用node express mongodb搭建
 使用grunt自动化
 项目下载后，根据package.json获取相应的组件

##有问题可以在项目留言或者加入qq群181619774交流

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

##全局变量 用于获取环境中的变量
var bodyParser = require('body-parser');
//var port = process.env.PORT || 4000 //process 全局变量 用于获取环境中的变量
var port = 4000;
var app = express();
var dbUrl = 'mongodb://localhost/imooc';
mongoose.connect(dbUrl);
##file 文件上传组件
var multipart = require('connect-multiparty')//file 文件上传组件
app.use(multipart());
app.set('views','./app/views/pages'); //设置根目录
app.set('view engine','jade');//设置模板引擎
app.use(bodyParser.urlencoded({extended: true}))//数据格式化 获取文档数据
  
##cookieParser
var cookieParser = require('cookie-parser');//express4 以后版本需要自主安装
var session = require('express-session');//express4 以后版本需要自主安装
var mongoStore = require('connect-mongo')(session);//来保持session的长连接  https://www.npmjs.com/package/connect-mongo
app.use(cookieParser())//中间键 session 依赖于
app.use(session({
 secret:'imooc',
 store:new mongoStore({
   url:dbUrl,
   collection:'sessions'//数据库存储session的名字
 })
}))
##测试模式
var logger = require('morgan');//
if('development' === app.get('env')){
  app.set('showStackError',true)
  app.use(logger(':method :url :status'))
  //app.locals.pretty = true //文档不压缩
  mongoose.set('debug',true)
}
//app.use(express.query());
require('./config/routes')(app);//路由
##微信自动回复功能
require('./config/mynode')(app);
##静态资源请求目录
app.use(express.static(path.join(__dirname,'public')))
app.locals.moment = require('moment')//格式化时间
app.listen(port);
##
console.log('imooc started om port ' + port);
