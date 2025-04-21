// Get JSON file and parse
function jsonFromFile(path) {
     var request = new XMLHttpRequest();
     if (window.location.pathname.startsWith("/maidkouciana")) {
          request.open("GET", `${window.location.origin}/maidkouciana/${path}.json`, false);
     } else {
          request.open("GET", `${window.location.origin}/${path}.json`, false);
     }
     request.send(null)
     return JSON.parse(request.responseText);
}