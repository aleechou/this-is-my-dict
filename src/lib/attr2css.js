var css_list = [
    'display', 'width', 'height',
    'flex',
]
var css_alias = {}

oriDocumentCreateElement = document.createElement
document.createElement = function() {
    return oriDocumentCreateElement.apply(this, arguments)
}

function processElement($ele) {}

for ($ele of $("*")) {
    processElement($ele)
}