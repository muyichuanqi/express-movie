var _ = require('underscore'); //新字段替换已有字段
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var fs = require('fs') //读写系统文件的模块
var path = require('path')//路径模块
// detail page
exports.detail = function(req,res){
	var id = req.params.id;
	Movie.update({_id:id},{$inc:{pv:1}},function(err){
		if(err){
			console.log(err)
		}
	})
	Movie
		.findById(id)
		.populate("category","name")
		.exec(function(err,movie){
			Comment
				.find({movie:id})
				.populate("from","name")
				.populate("reply.from reply.to","name")
				.exec(function(err,comments){
					res.render('detail',{
							title:movie.title,
							movie:movie,
							comments:comments
						})
				})
		})
}
// admin page
exports.new = function(req,res){
	Category.fetch(function(err,categories){
		if(err){
			console.log(err)
		}
		res.render('admin',{
			title:'imooc 后台录入页',
			 movie: {
	            doctor: '',
	            country: '',
	            title: '',
	            year: '',
	            poster: '',
	            language: '',
	            flash: '',
	            summary: ''
	        },
	        categories:categories
		})
	})
}
	// admin update movie
exports.update = function(req,res){
	var id = req.params.id;
	console.log(id)
	if(id){
		Movie.findById(id,function(err,movie){
			Category.find({},function(err,categories){
				res.render('admin',{
					title:'imooc 后台更新页',
					movie:movie,
				//	user:req.session.user,
					categories:categories
				})
			})
			
		})
	}
}
//savePoster 海报地址存储
exports.savePoster = function(req,res,next){
	console.log(req.files)
	var postData = req.files.uploadPoster//req.files依赖connect-multiparty中间键
	var filePath = postData.path //文件路径
	var originalFilename = postData.originalFilename //文件名字

	if(originalFilename){
		fs.readFile(filePath,function(err,data){
			var timestamp = Date.now();//设定一个时间戳
			var type = postData.type.split('/')[1]//获得文件类型
			var poster = timestamp + '.' + type//重新拼接后的名字
			var newPath = path.join(__dirname,'../../','public/upload/' + poster)

			fs.writeFile(newPath,data,function(err){
				req.poster = poster
				next()
			})
		})
	}else{
		next()
	}
}
//admin post movie
exports.save = function(req,res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var categoryId = movieObj.category;
	var _movie

	if(req.poster){
		movieObj.poster = req.poster;
	}
	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			Category.update({_id:movie.category},{$pullAll:{movies:[id]}},function(err,category){//pullAll删除数组中的一个或多个元素
				if(err){
					console.log(err)
				}

				_movie = _.extend(movie,movieObj) //新字段替换旧字段
				_movie.save(function(err,movie){
					if(err){
						console.log(err)
					}
					Category.update({_id:categoryId},{$addToSet:{movies:id}},function(err,category){
						res.redirect('/movie/'+ movie._id) //重定向到详情页
					})
					
				})

			})
		})
	}
	else{
		_movie = new Movie(movieObj)
		var categoryId = _movie.category
		_movie.save(function(err,movie){

			if(err){console.log(err)}

			Category.findById(categoryId,function(err,category){
				category.movies.push(movie._id)
				category.save(function(err,category){
					res.redirect('/movie/'+ movie._id) //重定向到详情页
				})
			})
			
		})
	 }
}
	// list page
exports.list = function(req,res){
	Movie
		.find({})
		.populate("category","name")
		.exec(function(err,movies){
			if(err){
				console.log(err);
			}
			res.render('list',{
				title:'imooc 列表',
				movies: movies
   			})
		})
}

	//delete movie
exports.del = function(req,res){
	var id = req.query.id;
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err);
			}else{
				res.json({success:1});
			}
		})
	}
}

//category
exports.cat = function(req,res){
	res.render('category',{
		title:'imooc 分类录入页',
		category:{
			name:''
		}
	})
}
exports.catNew = function(req,res){
	var _category = req.body.category;
	var name = _category.name;

	Category.findOne({'name':name},function(err,category){
		if(err){
			console.log(err)
		}
		if(category){
			console.log("分类已存在");
			return res.redirect('/admin/category')
		}else{
			var category = new Category(_category)
			category.save(function(err,category){
				if(err){
					console.log(err)
				}
				res.redirect('/admin')
			})
		}
	})
		
}