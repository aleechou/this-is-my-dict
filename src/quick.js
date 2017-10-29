const $ = require("./lib/jquery")
const request = require("request")
const objProxy = require("./misc/ObjectIpcProxy")
require("./window-pos")
require("./shortcut")
require("./query-word")
const speaker = require("./speaker")
const history = require("./history")



let data = require("./savedata")
let self = objProxy.fromMainProcess("quick-window")


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

    $lang.find("img.speaker").click(function() {
        speaker.speakWord(language)
    })
})