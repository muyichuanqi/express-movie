var mongoose = require('mongoose')
var BeikeSchema = require('../schemas/beike')
var Beike = mongoose.model('Beike',BeikeSchema)

module.exports = Beike