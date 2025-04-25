function parseNav(component) {

     // Get elements and create new elements
     const navDiv = document.getElementById("navdiv");
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

jsonFromFile("nav").forEach((item) => parseNav(item));