/**
 * Fetches the JSON data from a file.
 * @param {string} filename - The name of the file to fetch data from.
 * @returns {Object} - The parsed JSON object.
 */
const version = jsonFromFile("version");

/**
 * Creates and sets attributes for a specified element type.
 * @param {string} elementType - The type of element to create.
 * @param {Object} attributes - The attributes to set on the element.
 * @returns {HTMLElement} - The created element with set attributes.
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
 * Appends padding to the parent div if needed based on the component's padding property.
 * @param {HTMLElement} parentDiv - The parent div to append padding to.
 * @param {number} count - The current count of appended child elements.
 * @param {Object} item - The item containing padding information.
 */
function appendPaddingIfNeeded(parentDiv, count, item) {
    if ((count > 0 && item.padding !== false) || item.padding === true) {
        const paddingDiv = document.createElement("div");
        paddingDiv.classList.add("tinypadding2");
        parentDiv.appendChild(paddingDiv);
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
        const title = createAndSetAttributes("h2", { id: item.id });
        title.style.color = "orange";
        title.innerHTML = item.title;
        div.appendChild(title);
        count++;
    }

    item.components.forEach(component => {
        const commonAttributes = { style: component.style, class: component.class, id: component.id };
        let element;

        switch (component.type) {
            case "text":
                element = createAndSetAttributes("p", commonAttributes);
                element.innerHTML = component.text || "";
                if (component.color) {
                    element.style.color = component.color;
                }
                break;

            case "image":
                element = createAndSetAttributes("img", commonAttributes);
                element.src = component.link || "";
                if (component.padding) {
                    const paddingDiv = document.createElement("div");
                    paddingDiv.style.paddingBottom = "50px";
                    paddingDiv.appendChild(element);
                    div.appendChild(paddingDiv);
                } else {
                    div.appendChild(element);
                }
                break;

            case "button":
                element = createAndSetAttributes("a", commonAttributes);
                element.classList.add("button");
                element.innerHTML = component.text || "";
                element.href = component.link || "#";
                element.target = component.target || "";
                break;

            case "table":
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
                parseItems(component, div);
                break;
        }

        if (element) {
            div.appendChild(element);
            count++;
        }

        if (component.br) {
            const br = document.createElement("br");
            div.appendChild(br);
        }
    });

    if (item.br) {
        const br = document.createElement("br");
        div.appendChild(br);
    }

    appendPaddingIfNeeded(div, count, item);
}

/**
 * Parses and appends the title and description to the parent div.
 * @param {Object} item - The item containing the title and description.
 * @param {HTMLElement} parentDiv - The parent div to append title and description to.
 * @param {Object} object - The object containing title information.
 */
function parseTitle(item, parentDiv, object) {
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
 * @returns {Object} - The object containing link and item information.
 */
function checkIfNews(window) {
    const object = { link: "index.json", item: { title: false, date: false } };

    if (window.location.pathname === "/news/" || window.location.pathname === "/maidkouciana/news/") {
        const urlParam = new URLSearchParams(window.location.search).get('date');
        jsonFromFile("news").forEach(item => {
            if (item.date === urlParam) {
                object.item = item;
                return;
            }
        });

        if (!object.item.date) {
            window.location.href = `../#news`;
        } else {
            const dateParts = object.item.date.split(".");
            const itemDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
            if (itemDate > Date.now()) {
                window.location.href = `../#news`;
            } else {
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
