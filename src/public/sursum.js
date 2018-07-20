/*
       Utils
      */
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.substr(1);
};

Array.prototype.toInt = function() {
  return this.map(n => parseInt(n));
};

Array.prototype.generate = function(n, sorted = false) {
  let arr = new Array();
  if (sorted) {
    for (let i = 1; i <= n; i++) {
      arr.push(i);
    }
  } else {
    for (let i = 1; i <= n; i++) {
      arr.push(Math.floor(Math.random() * n));
    }
  }
  console.log(arr);
  return arr;
};

Array.prototype.swap = function(a, b) {
  if (a === b) return this;
  if (a >= this.length || b >= this.length) return -1;
  let tmp = this[b];
  this[b] = this[a];
  this[a] = tmp;
  return this;
};

Array.prototype.bubbleSort = function(direction = "asc") {
  for (let i = 0; i < this.length - 1; i++) {
    for (let j = 0; j < this.length - i - 1; j++) {
      if (this[j] > this[j + 1]) {
        this.swap(j, j + 1);
      }
    }
  }
  console.log(this);
  return this;
};

Array.prototype.insertionSort = function(direction = "asc") {};

/*
class MyArray extends HTMLElement {
  constructor() {
    super();
    this.container = document.createElement("div");
    this.container.style.width = "100%";
    this.container.style.height = "50px";
    this.style.display = "block";
  }

  // called when the element is added to the DOM
  connectedCallback() {
    this.appendChild(this.container);
  }

  // called when the element is removed from the DOM
  disconnectedCallback() {}

  // called when one of your `observedAttributes` changes
  attributeChangedCallback(attr, oldValue, newValue) {}
}

window.customElements.define("my-array", MyArray);
*/

/*
 * DATA STRUCTURES
 * 
 */

class Node {
  constructor(value) {
    this.value = value;
  }
}

class ListNode extends Node {
  constructor(value) {
    super(value);
    this.next = null;
  }
}

class LinkList {
  constructor() {
    this.head = this.count = 0;
  }
}

class ArrayTheme {
  constructor(theme, problem) {
    let themeSection = document.getElementById(theme);
    this.theme = themeSection;
    this.problem = problem;
    this.interval = 500;
    this.manualControl = themeSection.querySelector(".manual > input");
    this.autoControl = themeSection.querySelector(".auto > button");
    this.execute = themeSection.querySelector(".execute");
    this.setupListeners();
  }

  get array() {
    return this.a;
  }

  set array(array) {
    this.a = array;
    this.clearArray();
    this.drawArray();
  }

  setupListeners() {
    this.manualControl.addEventListener("keypress", this.parseArray.bind(this));
    this.autoControl.addEventListener(
      "click",
      this.generateRandomArray.bind(this)
    );
    this.execute.addEventListener("click", this.solveProblem.bind(this));
  }

  parseArray(evt) {
    const keyEnter = 13;
    const key = evt.keyCode;
    if (key === keyEnter) {
      let inputValue = this.manualControl.value;
      this.array = inputValue.split(",").toInt();
    }
  }

  generateRandomArray(evt) {
    this.array = Array.prototype.generate(10, false);
  }

  clearArray() {
    let arrayContainer = this.theme.querySelector(".array");
    while (arrayContainer.firstChild) {
      arrayContainer.removeChild(arrayContainer.firstChild);
    }
  }

  drawArray() {
    let arrayContainer = this.theme.querySelector(".array");
    let fragment = document.createDocumentFragment();
    this.array.forEach((item, idx) => {
      let itemContainer = document.createElement("span");
      itemContainer.className = `item item-${idx}`;
      itemContainer.textContent = item;
      fragment.appendChild(itemContainer);
    });
    arrayContainer.appendChild(fragment);
  }

  solveProblem() {
    switch (this.problem) {
      case "bubbleSort":
        console.log("hjere");
        this.array = this.array.bubbleSort();
        break;
      default:
        return;
    }
  }
}

class Theme {
  constructor(name, problems) {
    this.name = name;
    this.problems = problems;
  }

  createTitle() {
    let title = document.createElement("h2");
    title.textContent = this.name.capitalize();
    return title;
  }

  createContainer() {
    let container = document.createElement("div");
    let title = this.createTitle();
    container.className = `theme-${this.name}`;
    container.id = this.name;
    container.appendChild(title);
    return container;
  }
}

class Controllers {
  constructor(type) {
    this.type = type;
    let fragment = document.createDocumentFragment();
  }

  setupListeners() {}

  generateRandom() {}

  generateCustom() {}

  parse() {}
}

class DumpViewer {
  constructor(title, vars) {
    let fragment = document.createDocumentFragment();
    let container = this.createContainer();
    fragment.appendChild(container);
  }

  createContainer() {
    let container = document.createElement("div");
    container.classList = ["card", "border-light"];
    return container;
  }
}

class Input {
  constructor() {}

  createContainer() {}
}

class Info {
  constructor(text) {
    let infoContainer = document.createElement("div");
    infoContainer.className = "alert alert-secondary";
    infoContainer.textContent = text;
    return infoContainer;
  }
}

class Canvas {
  constructor(name) {
    this.name = name;
    let fragment = document.createDocumentFragment();
    fragment.appendChild(this.createContainer());
    return fragment;
  }

  createContainer() {
    let container = document.createElement("div");
    let title = this.createTitle();
    container.appendChild(title);
    return container;
  }

  createTitle() {
    let title = document.createElement("h3");
    title.textContent = this.name;
    return title;
  }
}

class ListTheme extends Theme {
  constructor() {
    let problems = ["insert", "delete", "search"];
    super("lists", problems);
    let fragment = document.createDocumentFragment();
    let themeContainer = super.createContainer();
    let infoContainer = this.createInfoContainer();

    let canvasContainer = this.createCanvasContainer();
    fragment.appendChild(themeContainer);
    fragment.appendChild(infoContainer);
    fragment.appendChild(canvasContainer);
    return fragment;
  }

  createCanvasContainer() {
    let canvasContainer = new Canvas("List viewer");
    return canvasContainer;
  }

  createInfoContainer() {
    let infoContainer = new Info(
      "A single linked list contains nodes and each node element in the list has a link (a pointer or reference) to the element that follows it in the list"
    );
    return infoContainer;
  }
}

class GraphTheme extends Theme {
  constructor() {
    let problems = [];
    super("graphs", problems);
  }
}
