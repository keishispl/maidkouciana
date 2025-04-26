const version = jsonFromFile("version");

function parseItems(item, bigDiv) {
     const div = document.createElement("div");
     if (item.style) { div.setAttribute("style", item.style) };
     if (item.class) { div.setAttribute("class", item.class) };
     if (item.id) { div.setAttribute("id", item.id) };

     bigDiv.appendChild(div);

     var count = 0;

     if (item.title) {
          const title = document.createElement("h2");
          if (item.id) { item.setAttribute("id", item.id) }

          title.style.color = "orange";
          title.innerHTML = item.title;

          div.appendChild(title);
          count++;
     };

     item.components.forEach((component) => {
          if (component.type === "text") {
               const obj = document.createElement("p");
               if (component.style) { obj.setAttribute("style", component.style) };
               if (component.class) { obj.setAttribute("class", component.class) };
               if (component.id) { obj.setAttribute("id", component.id) };

               if (component.text) { obj.innerHTML = component.text };
               if (component.color) { obj.style.color = component.color };

               div.appendChild(obj);
               count++;
          };
          if (component.type === "image") {
               const obj = document.createElement("img");
               if (component.style) { obj.setAttribute("style", component.style) };
               if (component.class) { obj.setAttribute("class", component.class) };
               if (component.id) { obj.setAttribute("id", component.id) };

               if (component.link) { obj.src = component.link };

               if (component.padding === true) {
                    const padding = document.createElement("div");
                    padding.style.paddingBottom = "50px";
                    div.appendChild(padding);
                    padding.appendChild(obj);
               } else {
                    div.appendChild(obj);
               };
               count++;
          };
          if (component.type === "button") {
               const obj = document.createElement("a");
               if (component.style) { obj.setAttribute("style", component.style) };
               if (component.class) { obj.setAttribute("class", component.class) };
               if (component.id) { obj.setAttribute("id", component.id) };

               obj.classList.add("button");
               if (component.text) { obj.innerHTML = component.text };
               if (component.link) { obj.href = component.link };
               if (component.target) { obj.target = component.target };

               div.appendChild(obj);
               count++;
          };
          if (component.type === "div") {
               parseItemsNews(component, div);
               count++;
          };

          if (component.br) {
               const br = document.createElement("br");
               div.appendChild(br);
          };
     });


     if (item.br) {
          const br = document.createElement("br");
          div.appendChild(br);
     };
     if (count > 0 && item.padding !== false) {
          const padding = document.createElement("div");
          padding.classList.add("tinypadding2");
          div.appendChild(padding);
     };
};

function parseTitle(item, object, bigDiv) {
     const title = document.createElement("h1");
     title.style.color = "white";
     title.style.fontWeight = "bold";

     title.innerHTML = object.title;
     bigDiv.appendChild(title);


     const description = document.createElement("p");
     description.setAttribute("style", "margin-top: -20px; color: rgb(220, 220, 220); padding-bottom: 20px;");

     description.innerHTML = object.date;
     bigDiv.appendChild(description);

     item.components.forEach((component) => {
          parseItems(component, bigDiv)
     });
};

const urlParam = new URLSearchParams(window.location.search).get('date');

var object = [];

// Get JSON file and parse
jsonFromFile("news").forEach((item) => {
     if (item.date === urlParam) {
          object = item;
          return;
     };
});

if (object.length === 0) {
     window.location.href = `../#news`;
};

document.title = object.title + ` - MaidKouciana v${version} News`;
var date = object.date.split(".");

var request = new XMLHttpRequest();
request.open("GET", `${date[0]}_${date[1]}_${date[2]}.json`, false);
request.send(null);
const items = JSON.parse(request.responseText);
const mainDiv = document.getElementById("content");
mainDiv.style.paddingTop = "100px";
parseTitle(items, object, mainDiv);