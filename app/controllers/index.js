var Movie = require('../models/movie');
var Category = require('../models/category')
//index page
exports.index = function(req,res){
	/*console.log("user in session:");
		console.log(req.session.user);
	*/
	Category
		.find({})
		.populate({path:'movies',options:{limit:2}})
		.exec(function(err,categories){
			if(err){
				console.log(err);
			}
			res.render('index',{
				title:'电影天堂',
				categories: categories
	   		})
		})
}
// result page
exports.result = function(req,res){
	var catId = req.query.catId;
	var page = parseInt(req.query.p);
	var count = 4;//每页取出数据的常量
	var index = page*count;

	var q = req.query.q
	if(q){
		Movie
			.find({"title":new RegExp(q+".*","i")})
			.exec(function(err,movies){
				res.render('result',{
					title:q,
					movies:movies
				})
			})
	}else{
		Movie.find({"category":catId},function(err,movies){
			req.totalPage = Math.ceil(movies.length/count);
		})
		Movie
			.find({"category":catId})
			.skip(index)
			.limit(count)
			.exec(function(err,movies){
				Category.find({_id:catId},function(err,category){
						res.render('result',{
							title:category[0].name,
							currentPage:(page + 1),
							totalPage:req.totalPage,
							movies:movies
					})
				})
				
			})
	}
	
	
}

// result page
exports.searchOne = function(req,res){
	var catId = req.query.catId;
	var page = req.query.p;
	var index = page*2

	Category
		.find({_id:catId})
		.populate({
			path:'movies',
			select:'title poster summary',
			options:{limit:2,skip:index}//skip取出数据的索引 有兼容问题
		})
		.exec(function(err,categories){
			if(err){
				console.log(err);
			}
			var category = categories[0] || {}
			res.render('result',{
				title:'电影天堂',
				keyword:category.name,
				categories: categories

	   		})
		})
}
//自己实现数据截取
exports.search = function(req,res){
	var catId = req.query.catId;
	var page = req.query.p;
	var index = page*2;
	var count = 2

	Category
		.find({_id:catId})
		.populate({
			path:'movies',
			select:'title poster summary'
		})
		.exec(function(err,categories){
			if(err){
				console.log(err);
			}
			var category = categories[0] || {}
			var movies = category.movies || []

			var results = movies.slice(index,index+count)

			res.render('result',{
				title:'电影天堂',
				keyword:category.name,
				currentPage:(page + 1),
				totalPage:Math.ceil(movies.length/2),
				movies: results
	   		})
	   	})
}