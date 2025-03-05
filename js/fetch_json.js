// Get JSON file and parse
function jsonFromFile() {
     var request = new XMLHttpRequest();
     request.open("GET", `news.json`, false);
     request.send(null)
     return JSON.parse(request.responseText);
}

jsonFromFile().forEach((item) => parseNews(item));