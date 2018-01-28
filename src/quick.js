// const $ = require("./lib/jquery")
// const request = require("request")
// const objProxy = require("./misc/ObjectIpcProxy")


require("./window-pos.js")
require("./shortcut")
require("./query-word")
const speaker = require("./speaker.js")
const history = require("./history.js")



// let data = require("./savedata")
// let self = objProxy.fromMainProcess("quick-window")


$(() => {
    $(".word-input").focus()
})


$(".phonetic-lang").each(function() {

    $lang = $(this)

    if ($lang.hasClass('uk')) {
        var language = 'uk'
    } else if ($lang.hasClass('us')) {
        var language = 'us'
    } else {
        throw new Error("unknow languge", $lang)
        return
    }

    // $lang.find("img.speaker").click(function() {
    //     speaker.speakWord(language)
    // })
})


$("img.speaker").click(function() {
    var sound = $(this).data("sound-src")
    $window.emit('play-sound', sound)
})