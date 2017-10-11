var css_list = [
    'display', 'width', 'height',
    'flex',
]
var css_alias = {}


$ = require("./lib/jquery")

oriDocumentCreateElement = document.createElement
document.createElement = function() {
    return oriDocumentCreateElement.apply(this, arguments)
}

function processElement($ele) {}

for ($ele of $("*")) {
    processElement($ele)
}