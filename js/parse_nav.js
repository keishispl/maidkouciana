/**
 * Parse a single navigation item and append it to the given navDiv
 * @param {Object} component - The object containing the link name and path
 * @param {HTMLDivElement} navDiv - The div containing the navigation links
 */
function parseNav(component, navDiv) {

     // Get elements and create new elements
     const li = document.createElement("li");
     const a = document.createElement("a");

     if (component.disabled) {
          // Disabled links
          a.innerHTML = `<s>${component.name}</s>`;
          a.classList.add("selectdisabled");

     } else {
          let pathname = window.location.pathname;
          if (component.path.startsWith("/news/?date=") && component.path.lastIndexOf("/") === component.path.length - 1) {
               component.path = component.path.slice(0, -1);

               pathname = window.location.pathname+"?date="+new URLSearchParams(window.location.search).get('date');
          }

          if (pathname === component.path || pathname === "/maidkouciana" + component.path) {
               // Check if link is current page
               a.innerHTML = component.name;
               a.classList.add("selected");

          } else {
               // Add normal link
               a.innerHTML = component.name;
               if (window.location.pathname.startsWith("/maidkouciana")) {
                    a.href = window.location.origin + "/maidkouciana" + component.path;
               } else {
                    a.href = window.location.origin + component.path;
               };
               a.classList.add("select");
          };
     }

     a.draggable = false;

     // Add elements to HTML page
     navDiv.appendChild(li);
     li.appendChild(a);
};

const container = document.getElementsByClassName("navigation-container")[0];
const navDiv = document.createElement("ul");
navDiv.setAttribute("id", "navdiv");
container.appendChild(navDiv);

jsonFromFile("nav").forEach((item) => parseNav(item, navDiv));
