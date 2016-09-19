var User = require('../models/user');
var Comment = require('../models/comment');
//signup
exports.signup = function(req,res){
	var _user = req.body.user;
	//var _user = req.param('user');  对body params query 深度封装
	var users = new User({
		name:_user.name,
		password:_user.password
	});
	//也可以直接使用find进行查询
	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err)
		}
		if(user){//如果数据库里面有这个值了
			console.log("账号已有");
			return res.redirect('/signin')//
		}else{
			users.save(function(err,user){
				if(err){
					console.log(err)
				}
				req.session.user = user;
				return res.redirect('/admin/user/list') //重定向到列表
			})
		}
	})
}
exports.signupnew = function(req,res){
	res.render('signup',{
		title:'注册'
	})
}
	// user list page
exports.list = function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err);
		}
   		res.render('userlist',{
			title:'imooc 用户列表',
			users: users
   		})
	})
}
	//delete user
exports.del = function(req,res){
	var id = req.query.id;
	if(id){
		User.remove({_id:id},function(err,user){
			Comment.remove({from:id},function(err,comments){
				if(err){
					console.log(err)
				}else{
					//delete req.session.user;
					//delete app.locals.user;
					res.json({success:1});
				}
			})
		})
	}
}
	//sign in 登录
exports.signin = function(req,res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;

	User.findOne({'name':name},function(err,user){//user 为查询后返回的匹配结果
		if(err){console.log(err)}
		if(!user){
			console.log("用户不存在");
			return res.redirect('/signup');
		}

		//比较数据库  user 为返回匹配的结果的实例 扩展实例方法
		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err)
			}
			if(isMatch){
				req.session.user = user;//把当前的user值存入session中
				return res.redirect('/');
			}else{
				return res.redirect('/signin');
				console.log("password is not matched");
			}
		})
	})
}
exports.signinnew = function(req,res){
	var adminId = req.query.adminId
	var title = (adminId)? '管理员登录':'普通登录'
	res.render('signin',{
		title:title
	})
}
	//logout 退出
exports.logout = function(req,res){
	delete req.session.user;
//	delete app.locals.user;
	res.redirect('/');
}

//用户登录验证
exports.signinRequired = function(req,res,next){
	var user = req.session.user;
	if(!user){
		return res.redirect('/signin?adminId=51')
	}
	next();
}
//用户是否有管理员权限
exports.adminRequired = function(req,res,next){
	var role = req.session.user.role;
	if(role<=10){
		return res.redirect('/signin?adminId=51')
	}
	next();
}