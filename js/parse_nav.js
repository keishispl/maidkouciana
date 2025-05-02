/**
 * Parse a single navigation item and append it to the given navDiv
 * @param {Object} component - The object containing the link name and path
 * @param {HTMLDivElement} navDiv - The div containing the navigation links
 */
function parseNav(component, navDiv) {

     // Get elements and create new elements
     const li = document.createElement("li");
     const a = document.createElement("a");

     // Disabled links
     if (component.disabled) {
          a.innerHTML = `<s>${component.name}</s>`;
          a.classList.add("selectdisabled");

     // Check if link is current page
     } else if (window.location.pathname === component.path || window.location.pathname === "/maidkouciana" + component.path) {
          a.innerHTML = component.name;
          a.classList.add("selected");

     // Add normal link
     } else {
          a.innerHTML = component.name;
          if (window.location.pathname.startsWith("/maidkouciana")) {
               a.href = window.location.origin + "/maidkouciana" + component.path;
          } else {
               a.href = window.location.origin + component.path;
          };
          a.classList.add("select");
     };

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
