const $ = require("./lib/jquery")



// var soundQueue = []

// var nextSoundWaitTimer = null
// const nextSoundWaitMSec = 500

$speaker = $(".word-speaker")


// $speaker[0].onended = function() {
//     if (!soundQueue.length) {
//         return
//     }
//     nextSoundWaitTimer = setTimeout(() => {
//         playNextSound()
//         if (nextSoundWaitTimer != null) {
//             nextSoundWaitTimer = null
//         }
//     }, nextSoundWaitMSec)
// }

// function playNextSound() {
//     var sound = soundQueue.shift()
//     if (!sound) return
//     exports.speakUri(sound)
// }


var speakCallback = null

exports.abord = function() {
    // if (nextSoundWaitTimer != null) {
    //     clearTimeout(nextSoundWaitTimer)
    //     nextSoundWaitTimer = null
    // }
    // soundQueue = []
    // $speaker[0].stop()
    if (speakCallback) {
        ((speakCallback) => {
            speakCallback(null, true)
        })(speakCallback)
        speakCallback = null
    }
}


exports.speakWord = function(lang, cb) {
    console.log(lang)
    var $speaker = $(".phonetic-lang.us .speaker")
    var localUri = $speaker.data("localUri")
    if (!localUri) {
        console.log("video file not loaded yet")
        return
    }
    console.log(localUri)
    exports.speakUri(localUri)
}

exports.speakUri = function(uri, cb) {
    exports.abord()

    speakCallback = cb

    $speaker.attr('src', uri)
    $speaker[0].play()
}

$speaker[0].onended = function() {
    if (speakCallback) {
        ((speakCallback) => {
            speakCallback(null, false)
        })(speakCallback)
        speakCallback = null
    }
}