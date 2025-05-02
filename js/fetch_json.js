/**
 * Fetches the JSON data from a file.
 * @param {string} path - The name of the file to fetch data from.
 * @returns {Object} - The parsed JSON object.
 */
function jsonFromFile(path) {
     var request = new XMLHttpRequest();
     var starterPath = window.location.pathname.startsWith("/maidkouciana") ? "/maidkouciana/data" : "/data";
     request.open("GET", `${starterPath}/${path}.json`, false);
     request.send(null);
     return JSON.parse(request.responseText);
};
