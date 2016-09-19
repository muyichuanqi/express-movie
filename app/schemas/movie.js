var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var MovieSchema = new Schema({
	douban:String,
	doctor:String,
	title:String,
	language:String,
	country:String,
	summary:String,
	flash:String,
	poster:String,
	year:Number,
	pv:{
		type:Number,
		default:0
	},
	category:[{
		type:ObjectId,
		ref:'Category'
	}],
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
//每次存储数据之前都要调用这个方法
MovieSchema.pre('save',function(next){
	if(this.isNew){//判断数据是否为新加的
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else{
		this.meta.updateAt = Date.now()
	}

	next();
})

MovieSchema.statics = {
	fetch:function(cb){
		return this
			.find({})//查找所有数据
			.sort('meta.updateAt')
			.exec(cb)
	},
	fetchById:function(id,cb){
		return this
			.findOne({_id:id})//查找单个数据
			.exec(cb)
	}
}

module.exports = MovieSchema