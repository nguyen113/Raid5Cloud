// //'use strict';
 
// // require thư viện tương tác với mongo
 
// var mongoose = require('mongoose');
 
// // tạo cấu trúc bảng posts dùng hàm Schema&amp;nbsp;
 
// var schema = mongoose.Schema({
//  Name:        {type: 'String', required: true},
//  Size:  {type: 'String', required: true},
//  Type:      {type: 'String', required: true},
//  ModifiedDate: {type: 'String', required: true}
 
// });
 
// // export vào app với tên model là Post
 
// module.exports = mongoose.model('File', schema);
// 
// 
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FileSchema   = new Schema({
	owner: {type: String, required: true, default: "testUser"},
    name: String,
    size: String,
    type: String,
    date: {type: Date, default: Date.now},
    path: {type: String, default: "/"},
    part0: {
    fileId: String,
    title:  String,
    size: String,
    modifiedDate: Date
  	},
  	part1: {
    fileId: String,
    title:  String,
    size: String,
    modifiedDate: Date
  	},
  	part2: {
    fileId: String,
    title:  String,
    size: String,
    modifiedDate: Date
  	},
  	part3: {
    fileId: String,
    title:  String,
    size: String,
    modifiedDate: Date
  	}
});

module.exports = mongoose.model('file', FileSchema);