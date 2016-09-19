var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');//数据加密
var SAlt_WORK_FACTOR = 10;

var UserSchema =new mongoose.Schema({
	name:{
		unique:true,//设为唯一
		type:String
	},
	password:String,
	role:{
		type:Number,
		default:0
	},
	// 0: nomal user
	// 1: verified user
	// 2 : professonal user
	// >10 admin
	// >50 super admin
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})

UserSchema.pre('save',function(next){
	var user = this
	if(user.isNew){//判断数据是否为新加的
		user.meta.createAt = user.meta.updateAt = Date.now()
	}
	else{
		user.meta.updateAt = Date.now()
	}

	bcrypt.genSalt(SAlt_WORK_FACTOR,function(err,salt){//密码加密
		if(err) return next(err)

			bcrypt.hash(user.password,salt,function(err,hash){//hash 为加盐后返回的结果
				if(err) return next(err)
				user.password = hash
				next()
			})
	})
})
UserSchema.methods = {//扩展实例方法
	comparePassword:function(_password,cb){
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if(err){
				return cb(err);
			}
			cb(null,isMatch);
		})
	}
}

UserSchema.statics = {
	fetch:function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	fetchById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}


module.exports = UserSchema
