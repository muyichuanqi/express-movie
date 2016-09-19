var _ = require('underscore'); //新字段替换已有字段
var Beike = require('../models/beike');

//admin post movie
exports.save = function(req,res){
	var body = req.body;
	res.json(body);
}
