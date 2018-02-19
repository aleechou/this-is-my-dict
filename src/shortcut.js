const windowPos = require("./window-pos.js")
    // const objProxy = require("./misc/ObjectIpcProxy")
const queryWord = require("./query-word.js")
const speaker = require("./speaker.js")

var $input = $(".word-input")

// 全局快捷键
// let shortcut = objProxy.fromMainProcess("shortcut")
// let clipboard = objProxy.fromMainProcess("clipboard")
// let self = objProxy.fromMainProcess("quick-window")


function registGlobalShutcut(keys, cb, cbSuc) {
    // shortcut.on(keys, function() {
    //     cb && cb(keys)
    // }, (suc) => {
    //     cbSuc && cbSuc(suc)
    // })
}

// 显示窗口
qt.onLoaded(async() => {

    shiftspace = await qt.createObject("QHotkey")
    shiftspace.setShortcut("alt+space")
    shiftspace.setRegistered(true)

    shiftspace.on('activated', async function() {

        console.log("...")

        $window.setVisible(true)
        $input.focus()

        // 全选
        $input[0].selectionStart = 0
        $input[0].selectionEnd = $input.val().length

        // 自动从剪切板中取英文单词
        var text = await qt.clipboard.text()
        if (!text) return
        if (!text.match(/^[a-zA-Z ]+$/)) return
        $input
            .val(text)
            .data("from-paste-board", true)
            .addClass("word-from-clipboard")

        // 全选
        $input[0].selectionStart = 0
        $input[0].selectionEnd = $input.val().length

    })
})

// enter 所有
var lastSpeakTime = 0
var successiveSpeaking = false
$(document).keypress(function(event) {
    if (event.keyCode != 13) return

    // 第一次按 enter: 查词
    if ($input.data("query-word") != $input.val()) {
        queryWord.queryWordFromInput()
        $input
            .data("from-paste-board", false)
            .removeClass("word-from-clipboard")
    }
    // 多次按 enter: 读音
    else {

        if (event.shiftKey)
            var lang = 'uk'
        else
            var lang = 'us'

        // 连读多次
        var now = Date.now()
        if ((now - lastSpeakTime) < 300) {
            successiveSpeaking = true
            speaker.speakWordSeveralTimes(lang, 5, () => {
                successiveSpeaking = false
            })
        } else
            speaker.speakWord(lang)

        lastSpeakTime = now
    }
})

// Esc 关闭或取消
$(document).keydown(function(event) {
    if (event.keyCode != 27) return

    // 取消从剪切板取来的词，还原原来输入的词
    if ($input.data("from-paste-board") && $input.val() != $input.data('query-word')) {
        $input
            .data("from-paste-board", false)
            .val($input.data('query-word'))
            .removeClass("word-from-clipboard")

    } else if (successiveSpeaking)
    // 取消连读
        speaker.abord()
        // 关闭 quick 窗口
    else
        $window.setVisible(false)

})