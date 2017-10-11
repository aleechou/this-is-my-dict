const saveFolder = __dirname + '/../data/'
const saveFile = saveFolder + 'query-history.json'

const mkdirs = require("./misc/utils").mkdirs
const fs = require("fs")

try {
    mkdirs(saveFolder)
    exports.queryHistory = require(saveFile)
} catch (e) {
    exports.queryHistory = {}
}

exports.recordAndSave = function(word) {
    word = word.toLowerCase()

    if (!exports.queryHistory[word]) {
        exports.queryHistory[word] = {
            total: 0,
            log: []
        }
    }
    exports.queryHistory[word].total++;
    exports.queryHistory[word].log.push(Date.now())

    exports.save()

    return exports.queryHistory[word].total
}

exports.save = function() {
    fs.writeFile(saveFile, JSON.stringify(exports.queryHistory), console.log)
}