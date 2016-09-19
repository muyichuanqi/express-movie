var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var Comment = require('../app/controllers/comment');

var Beike = require('../app/controllers/beike');

//var Mynode = require('../app/controllers/mynode')

module.exports = function(app){
	//预处理查看是否存在session
	app.use(function(req,res,next){
		var _user = req.session.user;
		app.locals.user = _user;
		return next();
	})

	//index page
	app.get('/',Index.index)

	//通过中间件来判断用户是否登录 是否有权限
	//user
	app.post('/user/signup',User.signup)
	app.get('/signup',User.signupnew)
	app.post('/user/signin',User.signin)
	app.get('/signin',User.signinnew)
	app.get('/logout',User.logout)

	app.get('/admin/user/list',User.signinRequired,User.adminRequired,User.list)
	app.delete('/admin/user/list',User.del)

	// movie
	app.get('/movie/:id',Movie.detail)

	app.get('/admin',User.signinRequired,User.adminRequired,Movie.new)
	app.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired,Movie.update)
	app.post('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.savePoster,Movie.save)
	app.get('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.list)
	app.delete('/admin/movie/list',Movie.del)

	//Comment
	
	app.post('/user/comment',User.signinRequired,Comment.save)

	//category

	app.get('/admin/category',User.signinRequired,User.adminRequired,Movie.cat)
	app.post('/admin/category/new',User.signinRequired,User.adminRequired,Movie.catNew)


	//result
	app.get('/result',Index.result)
	app.get('/search',Index.result)


	//贝壳书社
	app.post('/beike',Beike.save);
	
	
}