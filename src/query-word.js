

// const fs = require("fs")
// const pt = require("path")
// const request = require('request')
// const crypto = require('crypto')
// const mkdirs = require("./misc/utils").mkdirs
const history = require("./history.js")

var $input = $(".word-input")

const oldYoudaoApi = "http://fanyi.youdao.com/openapi.do?keyfrom=neverland&key=969918857&type=data&doctype=json&version=1.2&q="
const youdaoApi = "http://openapi.youdao.com/api"
const appKey = "3ad8620cf27c920a"
const appPrivateKey = "6s85VjC26rLnANR3q1C5sJkU1iuTKvJj"

// const videoFolderRoot = __dirname + '/../data/videos'

exports.queryWordFromInput = function queryWordFromInput() {

    var word = $input.val()
    $input.data("query-word", word)

    var url = oldYoudaoApi + encodeURI(word)
    console.log(url)

    $(".query-loading").show()
    $(".message").hide()
    $(".word-detail").hide()

    $(".phonetic-lang .speaker").data("localUri", null)

    $.ajax({ 
        url: url,

        error: function (){
            $(".message").text("网络错误").show()
        } ,
        success: function(body){

            console.log(body)

            $(".query-loading").hide()

            try {
                if (body.errorCode) {
                    $(".message").text("查询错误，errorCode:" + body.errorCode).show()
                    return
                }
                if (!body.basic) {
                    $(".message").text("没有这个词的解释").show()
                    return
                }
            } catch (e) {
                console.error(e)
                console.log(body)
                $(".message").text("网络内容格式不正确").show()
                return
            }

            // 只记录英文单词
            if (word.match(/^[a-zA-z\s\-\.]+$/)) {
                var queryTimes = history.recordAndSave(word)
                $(".query-times").text(`[${queryTimes}]`).show()
            } else {
                $(".query-times").hide()
            }

            exports.showExplains(word, body)

            $(".word-speaker-uk source").attr('src', body.basic["uk-speech"]||"")
            $(".word-speaker-us source").attr('src', body.basic["us-speech"]||"")
            $(".word-speaker-std source").attr('src', body.basic["speech"]||"")


            $("img.speaker.uk").data('sound-src', body.basic["uk-speech"]||"")
            $("img.speaker.us").data('sound-src', body.basic["us-speech"]||"")

            // function downloadVideo(type, field) {
            //     $(`.${type} .speaker`)
            //         .attr("src", "assert/downloading.gif")
            //         .data('localUri', null)

            //     if (body.basic[field]) {
            //         exports.downloadVideo(body.basic[field], word, type, (error, localVideoUri) => {
            //             if (error) console.log(error)
            //             if (localVideoUri) {
            //                 $(`.${type} .speaker`)
            //                     .attr("src", "assert/speaker.png")
            //                     .data('localUri', localVideoUri)
            //                 console.log(localVideoUri)
            //             }
            //         })

            //         $(`.${type}`).show()
            //     } else {
            //         $(`.${type}`).hide()
            //     }
            // }
            // setTimeout(() => downloadVideo('stand', 'speech'), 100)
            // setTimeout(() => downloadVideo('uk', 'uk-speech'), 200)
            // setTimeout(() => downloadVideo('us', 'us-speech'), 300)
        }
    })
}

exports.showExplains = function showExplains(word, detail) {

    $(".word-detail").show()
    $expains = $(".expains").html("")

    $(".basic .word").text(word)
    if (detail.basic) {
        $(".basic .uk .phonetic").text(detail.basic["uk-phonetic"])
        $(".basic .us .phonetic").text(detail.basic["us-phonetic"])

        if (detail.basic.explains) {
            for (var exp of detail.basic.explains) {
                $(`<li class="no-drag">${exp}</li>`).appendTo($expains)
            }
        }
    }
}

exports.downloadVideo = function downloadVideo(url, word, type, cb) {return
    word = word.toLowerCase()

    var videoFolder = videoFolderRoot + "/" + word[0]

    if (!fs.existsSync(videoFolder)) {
        mkdirs(videoFolder)
    }
    if (!fs.existsSync(videoFolder)) {
        cb && cb("missing video folder:" + videoFolder)
        return
    }

    var localFilePath = videoFolder + "/" + word + "-" + type + ".mp3"
    var localFileUri = pt.relative(__dirname, localFilePath)

    if (fs.existsSync(localFilePath)) {
        var stat = fs.statSync(localFilePath)
        if (stat.size > 1024) {
            cb && cb(null, localFileUri)
            return
        }
    }

    console.log("download video", url)
    var pipe = request(url)
        .on('response', function(response) {
            console.log(response.statusCode) // 200
            console.log(response.headers['content-type']) // 'image/png'
        })
        .on('error', function(err) {
            console.errorlog(err)
            cb && cb(err)
        })
        .pipe(fs.createWriteStream(localFilePath))
        .on('error', (error) => {
            console.log("error")
            cb && cb(error)
        })
        .on('finish', function() {
            cb && cb(null, localFileUri)
        })
    pipe.uncork()

    console.log(pipe)
}
