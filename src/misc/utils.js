const path = require("path")
const fs = require("fs")


// 创建所有目录
var mkdirs = module.exports.mkdirs = function(dirpath, mode, callback) {
    fs.exists(dirpath, function(exists) {
        if (exists) {
            callback && callback(dirpath);
        } else {
            //尝试创建父目录，然后再创建当前目录
            mkdirs(path.dirname(dirpath), mode, function() {
                fs.mkdir(dirpath, mode, callback);
            });
        }
    });
};