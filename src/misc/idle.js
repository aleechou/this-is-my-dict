module.exports = function(callback, msec) {

    var timerid = null
    if (msec == undefined)
        msec = 500


    return function() {
        if (timerid != null) {
            clearTimeout(timerid)
        }
        timerid = setTimeout(() => {
            timerid = null
            callback()
        }, msec)
    }
}