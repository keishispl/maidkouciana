/**
 * Fetches the JSON data from a file.
 * @param {string} filename - The name of the file to fetch data from.
 * @returns {Object} The parsed JSON object.
 */
const version = jsonFromFile("version");

/**
 * Creates and sets attributes for a specified element type.
 * @param {string} elementType - The type of element to create.
 * @param {Object} attributes - The attributes to set on the element.
 * @returns {HTMLElement} The created element with set attributes.
 */
function createAndSetAttributes(elementType, attributes) {
    const element = document.createElement(elementType);
    Object.keys(attributes).forEach(attr => {
        if (attributes[attr]) {
            element.setAttribute(attr, attributes[attr]);
        }
    });
    return element;
}

/**
 * Appends padding/line break to the item if needed based on the component's padding property.
 * @param {string} type - Only "padding" or "br" is allowed.
 * @param {HTMLElement} parent - The item to append padding/line break to.
 * @param {Object} item - The item containing padding/line break information.
 * @param {number} count - The current count of appended child elements.
 */
function appendIfNeeded(type, parent, item, count) {
    if (type === "br") {
        if (item.br) {
            const br = document.createElement("br");
            br.style.userSelect = "none";
            parent.appendChild(br);
        }
    } else if (type === "padding") {
        if ((count > 0 && item.padding !== false) || item.padding === true) {
            const padding = document.createElement("div");
            padding.classList.add("tinypadding2");
            parent.appendChild(padding);
        }
    }
}

/**
 * Parses and appends items to the parent div.
 * @param {Object} item - The item to parse.
 * @param {HTMLElement} parentDiv - The parent div to append items to.
 */
function parseItems(item, parentDiv) {
    const div = createAndSetAttributes("div", { style: item.style, class: item.class, id: item.id });
    parentDiv.appendChild(div);

    let count = 0;

    if (item.title) {
        /**
         * Creates a title element and appends it to the parent div.
         * @type {HTMLElement}
         */
        const title = createAndSetAttributes("h2", { id: item.id });
        title.style.color = "orange";
        title.innerHTML = item.title;
        div.appendChild(title);
        count++;
    }

    // Loop through each component in the item and parse it.
    item.components.forEach(component => {
        const commonAttributes = { style: component.style, class: component.class, id: component.id };
        let element;

        // Determine which type of component this is.
        switch (component.type) {
            case "text":
                // Create a text element and append it to the parent div.
                element = createAndSetAttributes("p", commonAttributes);
                element.innerHTML = component.text || "";
                if (component.color) {
                    element.style.color = component.color;
                }
                break;

            case "image":
                // Create an image element and append it to the parent div.
                element = createAndSetAttributes("img", commonAttributes);
                element.src = component.link || "";
                if (component.padding) {
                    // Add padding to the image if requested.
                    const paddingDiv = document.createElement("div");
                    paddingDiv.style.paddingBottom = "50px";
                    paddingDiv.appendChild(element);
                    div.appendChild(paddingDiv);
                } else {
                    // No padding requested, so append the image as is.
                    div.appendChild(element);
                }
                break;

            case "button":
                // Create a button element and append it to the parent div.
                element = createAndSetAttributes("a", commonAttributes);
                element.classList.add("button");
                element.innerHTML = component.text || "";
                element.href = component.link || "#";
                element.target = component.target || "";
                break;

            case "table":
                // Create a table element and append it to the parent div.
                element = createAndSetAttributes("table", commonAttributes);
                const headerRow = createAndSetAttributes("tr", {});
                component.name.forEach(name => {
                    const headerCell = createAndSetAttributes("th", {});
                    headerCell.innerHTML = name;
                    headerRow.appendChild(headerCell);
                });
                element.appendChild(headerRow);

                component.group.forEach(group => {
                    const row = createAndSetAttributes("tr", {});
                    group.forEach(text => {
                        const cell = createAndSetAttributes("td", {});
                        cell.innerHTML = text;
                        row.appendChild(cell);
                    });
                    element.appendChild(row);
                });
                break;

            case "div":
                // Recursively call parseItems on the component.
                parseItems(component, div);
                break;
        }

        // Append the element to the parent div.
        if (element) {
            div.appendChild(element);
            count++;
        }

        // Add a line break if requested.
        appendIfNeeded("br", div, component);
    });

    // Add a line break if requested.
    appendIfNeeded("br", div, item);

    // Add padding to the parent div if requested.
    appendIfNeeded("padding", div, item, count);
}

/**
 * Parses and appends the title and description to the parent div.
 * @param {Object} item - The item containing the title and description.
 * @param {HTMLElement} parentDiv - The parent div to append title and description to.
 * @param {Object} object - The object containing title information.
 */
function parseTitle(item, parentDiv, object) {
    // Create a title and description and append them to the parent div.
    const title = createAndSetAttributes("h1", {});
    title.style.color = "white";
    title.style.fontWeight = "bold";
    title.innerHTML = object.title === false ? item.title : object.title;
    title.innerHTML = title.innerHTML === "" ? `MaidKouciana v${version} Wiki` : title.innerHTML;
    document.title = `${title.innerHTML} - MaidKouciana v${version} ${object.title === false ? "Wiki" : "News"}`;
    document.title = document.title === `${title.innerHTML} - ${title.innerHTML}` ? title.innerHTML : document.title;
    parentDiv.appendChild(title);

    const description = createAndSetAttributes("p", { style: "margin-top: -20px; color: rgb(220, 220, 220); padding-bottom: 20px;" });
    if (object.date === false) {
        description.innerHTML = item.description === false ? `MaidKouciana v${version} Wiki` : item.description || "&nbsp;";
    } else {
        description.innerHTML = object.date;
    }
    parentDiv.appendChild(description);

    // Recursively call parseItems on the components.
    item.components.forEach(component => {
        parseItems(component, parentDiv);
    });
}

// Set main div styling and padding
const mainDiv = document.getElementById("content");
mainDiv.style.paddingTop = "100px";

/**
 * Checks if the current page is a news page and returns the relevant object.
 * @param {Window} window - The window object to check the location.
 * @returns {Object} The object containing link and item information.
 */
function checkIfNews(window) {
    /**
     * Checks if the current page is a news page and returns the relevant object.
     * @returns {Object} - The object containing link and item information.
     */
    const object = { link: "index.json", item: { title: false, date: false } };

    // Check if page is a news page
    if (window.location.pathname === "/news/" || window.location.pathname === "/maidkouciana/news/") {
        // Get the date parameter from the URL
        const urlParam = new URLSearchParams(window.location.search).get('date');

        // Loop through the news items and find the one that matches the date parameter
        jsonFromFile("news").forEach(item => {
            if (item.date === urlParam) {
                object.item = item;
                return;
            }
        });

        // If the date parameter is invalid, redirect to the news page
        if (!object.item.date) {
            window.location.href = `../#news`;
        } else {
            const dateParts = object.item.date.split(".");
            const itemDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));

            // If the news item is in the future, redirect to the news page
            if (itemDate > Date.now()) {
                window.location.href = `../#news`;
            } else {
                // Update the link to the JSON file with the correct date
                object.link = `${dateParts[0]}_${dateParts[1]}_${dateParts[2]}.json`;
            }
        }
    }
    return object;
}

// Fetch and parse the JSON data for the title and content
const request = new XMLHttpRequest();
const object = checkIfNews(window);
request.open("GET", object.link, false);
request.send(null);

parseTitle(JSON.parse(request.responseText), mainDiv, object.item);
