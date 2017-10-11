const fs = require("fs")

var defaultdata = {
    "quick-display-id": -1
}
var datapath = __dirname + "/../data.json"

try {
    exports = module.exports = require(datapath)
} catch (e) {}

exports.__proto__ = defaultdata

exports.save = function() {
    fs.writeFile(datapath, JSON.stringify(exports, null, 4), () => {})
}