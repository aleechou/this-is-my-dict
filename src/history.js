// const request = require("request")
// const saveFolder = __dirname + '/../data/'
// const saveFile = saveFolder + 'query-history.json'

// const mkdirs = require("./misc/utils").mkdirs
// const fs = require("fs")


// try {
//     mkdirs(saveFolder)
//     exports.queryHistory = require(saveFile)

//     exports.syncToServer()

// } catch (e) {
//     exports.queryHistory = {}
// }

exports.recordAndSave = function(word) {return
    word = word.toLowerCase()

    if (!exports.queryHistory[word]) {
        exports.queryHistory[word] = {
            total: 0,
            log: []
        }
    }
    exports.queryHistory[word].total++;
    exports.queryHistory[word].log.push(Date.now())

    // 同步到服务器
    exports.syncToServer()

    exports.save()

    return exports.queryHistory[word].total
}

exports.save = function() {return
    fs.writeFile(saveFile, JSON.stringify(exports.queryHistory), console.log)
}

exports.syncToServer = function(){
    request({
        url: "http://127.0.0.1:3000/sycn-query-history"
        , method: "POST"
        , json: exports.queryHistory
    }, function(err, rspn, body){
        console.log(arguments)
        if(err) {
            return console.error(err)
        }

        if(typeof body=='object')
            exports.queryHistory = body
    })
}
