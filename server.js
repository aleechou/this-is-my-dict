const express = require("express")
const bodyParser = require('body-parser')
const fs = require('fs')

const saveFolder = __dirname + '/data/'
const saveFile = saveFolder + 'server-query-history.json'

const mkdirs = require("./src/misc/utils").mkdirs


var queryHistoryDB = {}

try {

    mkdirs(saveFolder)
    queryHistoryDB = require(saveFile)
    
} catch (e) {
    queryHistoryDB = {}
}




var app = express()
app.use(bodyParser.json())
app.use(function (req, res, next) {

    if(req.url!='/sycn-query-history')
        return next()

    var changed = false ;

    for(word in req.body) {
        word = word.toLowerCase()
        var queryinfo = req.body[word]

        if(!queryHistoryDB[word]) {
            queryHistoryDB[word] = {total:0, log: []}
            console.log("new word from client:", word)
            changed = true
        }

        if(queryinfo.log) {
            for(qtime of queryinfo.log) {
                if( !queryHistoryDB[word].log.includes(qtime) ) {
                    queryHistoryDB[word].log.push(qtime)
                    console.log("new word query log from client:",word, new Date(qtime).toString())
                    changed = true
                }
            }
            queryHistoryDB[word].total = queryHistoryDB[word].log.length
        }
    }

    var json = JSON.stringify(queryHistoryDB,null,4)
    res.end( json )
    
    if(changed)
        fs.writeFile(saveFile,json, console.log)
})
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})



