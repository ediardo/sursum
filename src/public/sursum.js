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

Array.prototype.quickSort = function(direction = "asc") {};

Array.prototype.mergeSort = function(direction = "asc") {};

/*
 * DATA STRUCTURES
 * 
 */

class Node {
  constructor(value = null) {
    this.value = value;
  }
}

class ListNode extends Node {
  constructor(value = null) {
    super(value);
    this.next = null;
  }
}

class VisualBSTNode extends Node {
  constructor({
    value,
    left = null,
    right = null,
    whiteboard,
    size = { w: 100, h: 50 },
    pos = { x: 0, y: 0 },
    level = 0,
    column = 16
  }) {
    super(value);
    this.left = left;
    this.right = right;
    this._whiteboard = whiteboard;
    this._size = size;
    this._pos = pos;
    this._level = level;
    this._column = column;
    this._drawNode();
  }

  insert(value, level = 0) {
    console.log(
      `Current node ${this.value} with left child ${
        this.left
      } and right child ${this.right}`
    );
    if (value > this.value) {
      if (this.right === null) {
        level++;
        let newColumn;
        if (level === 1) {
          newColumn = this._column + 8;
        } else if (level === 2) {
          newColumn = this._column + 4;
        } else if (level === 3) {
          newColumn = this._column + 2;
        } else if (level === 4) {
          newColumn = this._column + 1;
        }
        this.right = new VisualBSTNode({
          value,
          whiteboard: this._whiteboard,
          size: this._size,
          column: newColumn,
          level
        });
      } else {
        this.right.insert(value, level + 1);
      }
    } else if (value < this.value) {
      if (this.left === null) {
        level++;
        let newColumn;
        if (level === 1) {
          newColumn = this._column - 8;
        } else if (level === 2) {
          newColumn = this._column - 4;
        } else if (level === 3) {
          newColumn = this._column - 2;
        } else if (level === 4) {
          newColumn = this._column - 1;
        }
        this.left = new VisualBSTNode({
          value,
          whiteboard: this._whiteboard,
          size: this._size,
          column: newColumn,
          level
        });
      } else {
        this.left.insert(value, level + 1);
      }
    } else {
      return false;
    }
    return true;
  }

  contains(value, level) {
    if (value === this.value) {
      return true;
    } else if (value < this.value) {
      if (this.left === null) {
        return false;
      } else {
        return this.left.contains(value);
      }
    } else {
      if (this.right === null) {
        return false;
      } else {
        return this.right.contains(value);
      }
    }
  }

  getAncestors(rootNode, target) {
    let ancestors = [];
    if (rootNode === null) {
      return;
    }

    while (true) {
      while (rootNode !== null && rootNode.value !== target) {
        ancestors.push(rootNode);
        rootNode = rootNode.left;
      }

      if (rootNode !== null && rootNode.value === target) {
        break;
      }
    }
    /*
    if (target < rootNode.value) {
      let stack = [];
      let currentNode = rootNode.left;
      stack.push(currentNode);
      while (currentNode !== null) {
        stack.pop();
        
      }
    } else if (target > rootNode.value) {
    }
    */
    return ancestors
      .reverse()
      .map(a => a.value)
      .join(", ");
  }
  _getAncestors(rootNode, target, ancestors = []) {
    if (rootNode === null) {
      return false;
    }

    if (rootNode.value === target) {
      return true;
    }

    if (
      this._getAncestors(rootNode.left, target, ancestors) ||
      this.getAncestors(rootNode.right, target, ancestors)
    ) {
      ancestors.push(this.value);
      return ancestors;
    }
    return false;
  }

  _datumSVG(wrapper) {
    const { w, h } = this._size;
    let datum = wrapper.group();
    datum
      .circle(w)
      .attr({
        fill: "#FFF",
        stroke: "#333",
        "stroke-width": 2,
        "data-node-value": this.value.toString()
      })
      .addClass("tree-node");
    datum
      .text(this.value.toString())
      .font({
        family: "Patrick Hand",
        size: 30
      })
      .center(w / 2, w / 2);
  }
  _rightChildSVG(wrapper) {
    const { w, h } = this._size;
    let rightChild = wrapper.group();
    rightChild.rect(w * 0.15 + 1, h).attr({
      fill: "#FFF",
      stroke: "#333",
      "stroke-width": 1
    });
  }

  _leftChildSVG(wrapper) {
    const { w, h } = this._size;
    let leftChild = wrapper.group();
    leftChild
      .rect(w * 0.15 - 1, h)
      .attr({
        fill: "#FFF",
        stroke: "#333",
        "stroke-width": 1
      })
      .move(w * 0.85, 0);
  }

  _calculateColumnCoords(column, level) {
    let coords = {};
    const { w, h } = this._size;
    coords.x = (1200 / 32) * column;
    coords.y = (700 / 6) * level;

    return coords;
  }

  _calculateColumnOffset(column, level) {
    let offset = 0;
    switch (level) {
      case 1:
        offset = column < 32 / 2 ? 8 : -8;
        break;
      case 2:
        if (column === 4 || column === 20) {
          offset = 4;
        } else {
          offset = -4;
        }
        break;
      case 3:
        if (column === 2 || column === 10 || column === 18 || column === 26) {
          offset = 2;
        } else {
          offset = -2;
        }
        break;
      case 4:
        let levelColumns = [1, 5, 9, 13, 17, 21, 25, 29];
        if (levelColumns.includes(column)) {
          offset = 1;
        } else {
          offset = -1;
        }
        break;
      default:
        return;
    }
    return offset;
  }

  _edgeSVG(wrapper, column, level) {
    if (level === 0) {
      return;
    }
    let childCoords = this._calculateColumnCoords(column, level);
    let parentColumnOffset = this._calculateColumnOffset(column, level);

    let parentCoords = this._calculateColumnCoords(
      column + parentColumnOffset,
      level - 1
    );
    wrapper
      .line(
        childCoords.x,
        childCoords.y + this._size.w,
        parentCoords.x,
        parentCoords.y + this._size.w
      )
      .stroke({ width: 1 })
      .back()
      .addClass("tree-node-edge");
  }
  _drawNode() {
    const { w, h } = this._size;
    const { _level, _column } = this;
    let nodeFig = this._whiteboard.nested();
    // this._rightChildSVG(nodeFig);
    // this._leftChildSVG(nodeFig);
    this._edgeSVG(this._whiteboard, _column, _level);
    this._datumSVG(nodeFig);
    this._id = nodeFig.id();
    let coords = this._calculateColumnCoords(_column, _level);
    //nodeFig.attr({ ...coords, cx: 25, yx: 25 });
    nodeFig.center(coords.x - w / 2, coords.y + 25);
    //nodeFig.dx(-w);
  }
}

class VisualListNode extends ListNode {
  constructor(value, whiteboard, x, y, w = 100, h = 50) {
    super(value);
    this.h = h;
    this.w = w;
    this.x = x;
    this.y = y;
    this.whiteboard = whiteboard;

    this.drawNode();
  }

  datumSVG(wrapper) {
    const { w, h } = this;
    let datum = wrapper.group();
    datum.rect(w * 0.8, h).attr({
      fill: "#FFF",
      stroke: "#333",
      "stroke-width": 1
    });
    datum
      .text(this.value.toString())
      .attr({
        width: w,
        height: h
      })
      .font({});
  }

  nextSVG(wrapper) {
    const w = this.w * 0.2,
      h = this.h;
    const pointerAttr = {
      fill: "#FFF",
      stroke: "#333",
      "stroke-width": 1
    };
    const pointerCircleRadius = w / 3;
    const pointerCircleAttr = {
      fill: "#333"
    };
    let pointer = wrapper.group();
    pointer
      .rect(w, h)
      .attr(pointerAttr)
      .move(this.w * 0.8, 0);
    pointer
      .circle(pointerCircleRadius)
      .attr(pointerCircleAttr)
      .center(this.w - w / 2, this.h / 2);

    let linkPoints = [
      [this.w - w / 2, this.h / 2],
      [this.w - w / 2 + 25, this.h / 2],
      [this.w - w / 2 + 20, this.h / 2 - 5],
      [this.w - w / 2 + 25, this.h / 2],
      [this.w - w / 2 + 20, this.h / 2 + 5]
    ];
    pointer
      .polyline(linkPoints)
      .fill("none")
      .stroke({
        width: 2
      });
  }

  drawNode() {
    const { x, y, w, h } = this;
    let nodeFig = this.whiteboard.nested();
    nodeFig.attr({ x, y });
    this.datumSVG(nodeFig);
    this.nextSVG(nodeFig);
    this.id = nodeFig.id();
    console.log(x, y, w, h, this.id);
  }
}

class VisualLinkedLIst {
  constructor(whiteboard) {
    this.whiteboard = whiteboard;
    this.head = null;
    this.nodeSize = { w: 80, h: 50 };
    this.nodeOffset = this.nodeSize.w * 1.2;
    this.drawHead();
  }

  get length() {
    if (this.head === null) return 0;
    let length = 1;
    if (this.head.next === null) return length;
    let current = this.head;
    while (current.next !== null) {
      current = current.next;
      length++;
    }
    return length;
  }

  animateOffsetTail(tail, direction = "positive") {
    let current = tail;
    while (current !== null) {
      let node = SVG(current.id);
      if (direction === "positive") {
        node.animate("200").attr({ x: node.attr("x") + this.nodeOffset });
      } else {
        node.animate("200").attr({ x: node.attr("x") - this.nodeOffset });
      }
      current = current.next;
    }
  }

  animateDeleteNode(node) {
    let nodeElement = SVG(node.id);
    nodeElement.animate().opacity(0);
    nodeElement.remove();
  }

  // adds a node at the end of list
  append(value) {
    // if list is empty
    if (this.head === null) {
      this.head = new VisualListNode(
        value,
        this.whiteboard,
        0,
        100,
        this.nodeSize.w,
        this.nodeSize.h
      );
      return;
    }
    let current = this.head;
    let i = 1;
    // repeat while not at the end of the list
    while (current.next !== null) {
      // get to the next element
      current = current.next;
      i++;
    }
    current.next = new VisualListNode(
      value,
      this.whiteboard,
      this.nodeSize.w * 1.3 * i,
      100,
      this.nodeSize.w,
      this.nodeSize.h
    );
    console.log(this.toString());
  }

  drawHead() {
    this.whiteboard.text("head").font({
      family: "Ubuntu Mono",
      size: 24
    });
    let lineLength = 55;
    this.whiteboard.line(20, 40, 20, 40 + lineLength).stroke({ width: 1 });
  }

  // adds a node at the beggining of the list
  prepend(value) {
    let newHead = new VisualListNode(
      value,
      this.whiteboard,
      0,
      100,
      this.nodeSize.w,
      this.nodeSize.h
    );
    this.animateOffsetTail(this.head);
    newHead.next = this.head;
    this.head = newHead;
    this.toString();
  }

  insertAtPosition(value, pos = 1) {
    if (pos === 1) {
      this.prepend(value);
      return true;
    }
    let slow = this.head;
    let fast = slow.next;
    let i = 1;
    while (slow !== null) {
      if (pos === i + 1) {
        let newNode = new VisualListNode(
          value,
          this.whiteboard,
          i * this.nodeOffset,
          100,
          this.nodeSize.w,
          this.nodeSize.h
        );
        newNode.next = fast;
        this.animateOffsetTail(fast);
        slow.next = newNode;
        this.toString();
        return true;
      } else {
        i++;
        slow = slow.next;
        fast = fast.next;
      }
    }
    return false;
  }

  reverse() {
    let current = this.head;
    let prevNode = null;
    let nextNode = null;
    while (current !== null) {
      nextNode = current.next;
      current.next = prevNode;
      prevNode = current;
      current = nextNode;
    }
    this.head = prevNode;
    console.log(this.toString());
  }

  getSubList(start, end) {
    let current = this.head;
  }

  hasUniqueValues() {}

  // find the first
  findByValue(value) {
    if (this.head === null) return null;
    let current = this.head;
    while (current !== null) {
      if (current.value === value) {
        return current;
      } else {
        current = current.next;
      }
    }
    return null;
  }

  // finds a node at k position, returns null if not found
  findAtPosition(index) {
    if (this.head === null) return null;
    let current = this.head;
    let i = 1;
    while (current !== null) {
      if (index === i) {
        return current;
      } else {
        i++;
        current = current.next;
      }
    }
    return null;
  }

  // removes a node at k position and returns true, false if not found
  removeAtPosition(index) {
    if (this.head === null) return null;
    if (index === 1) {
      this.animateDeleteNode(this.head);
      this.head = this.head.next;
      this.animateOffsetTail(this.head, "negative");
      this.toString();
      return true;
    }
    let slow = this.head;
    let fast = slow.next;
    let i = 1;
    while (slow.next !== null) {
      if (i + 1 === index) {
        this.animateDeleteNode(slow.next);
        slow.next = fast.next;
        this.animateOffsetTail(fast.next, "negative");
        return true;
      } else {
        i++;
        slow = slow.next;
        fast = fast.next;
      }
    }
    return false;
  }

  removeByValue(value) {
    if (this.head === null) return null;
    if (this.head.value === value) {
      let newHead = this.head.next;
      this.head = newHead;
    }
    let slow = this.head;
    let fast = slow.next;
    while (slow.next !== null) {
      if (fast.value === value) {
        slow.next = fast.next;
        this.toString();
        return true;
      } else {
        slow = slow.next;
        fast = fast.next;
      }
    }
    return false;
  }

  toString() {
    if (this.head === null) return null;
    let current = this.head;
    let str = "";
    while (current !== null) {
      str += `[${current.value}]->`;
      if (current.next === null) {
        str += "null";
      }
      current = current.next;
    }
    return str;
  }
}

class Whiteboard {
  constructor(state) {
    this.setupListeners();
    this.whiteboard = SVG("whiteboard");
    this.width = this.whiteboard.width();
    this.height = this.whiteboard.height();
    this.nodeSize = { w: 70, h: 50 };
    this.drawEffects();
    this.drawOutputConsole();
    this.drawGuides();
  }

  setupListeners() {
    let dataStructures = document.querySelectorAll(".ops ul");
    let inputs = document.querySelectorAll("span.input");
    inputs.forEach(input => {
      input.addEventListener("keypress", this.handleOnKeyPressInput.bind(this));
    });
    dataStructures.forEach(ds => {
      let dsName = ds.dataset.structure;
      let ops = ds.querySelectorAll("li");
      ops.forEach(op => {
        op.addEventListener("click", this.handleOnClickOperation.bind(this));
      });
    });
  }

  handleOnClickOperation(evt) {
    let { target } = evt;
    if (target.tagName === "BUTTON") {
      let { structure, opName, hasInput } = target.parentElement.dataset;
      if (hasInput === "true") {
        let inputs = target.parentElement.querySelectorAll("span");
        var opParams = {};
        inputs.forEach(input => {
          opParams[input.dataset.paramName] = input.textContent;
          input.textContent = "";
        });
      }
      this.doOp(structure, opName, opParams);
    }
  }

  linkedListOps(op, params) {
    switch (op) {
      case "new":
        this.clearWhiteboard();
        this.visualLinkedList = new VisualLinkedLIst(this.whiteboard);
        break;
      case "append":
        this.visualLinkedList.append(params.val);
        break;
      case "prepend":
        this.visualLinkedList.prepend(params.val);
        break;
      case "insertAtPos":
        this.visualLinkedList.insertAtPosition(
          params.val,
          parseInt(params.pos)
        );
        break;
      case "removeAtPos":
        this.visualLinkedList.removeAtPosition(parseInt(params.pos));
        break;
      case "findByValue":
        this.visualLinkedList.removeAtPosition;
      default:
        console.log("Unknown operation");
    }
  }

  bstOps(op, params) {
    const { nodeSize: size, whiteboard } = this;
    switch (op) {
      case "new":
        // this.clearWhiteboard();
        const wrapper = this.whiteboard.group();
        // wrapper.before();
        this.visualBSTNode = new VisualBSTNode({
          value: parseInt(params.val),
          whiteboard: wrapper,
          size: { w: 50 }
        });
        break;
      case "insert":
        this.visualBSTNode.insert(parseInt(params.val));
        break;
      case "contains":
        this.visualBSTNode.contains(parseInt(params.val));
        break;
      case "getAncestors":
        let ancestors = this.visualBSTNode.getAncestors(
          this.visualBSTNode,
          parseInt(params.val)
        );
        this.appendToConsole(ancestors);
        break;
      default:
        console.log("Unknown operation");
    }
  }

  doOp(structure, opName, opParams) {
    switch (structure) {
      case "linkedList":
        this.linkedListOps(opName, opParams);
        break;
      case "bstNode":
        this.bstOps(opName, opParams);
        break;
      default:
        console.log("Incorrect Data Structure");
    }
  }

  handleOnKeyPressInput(evt) {
    let { key } = evt;
    if (key === "Enter") {
      evt.target.parentNode.querySelector("button").click();
      evt.preventDefault();
    } else if (evt.target.dataset.maxLength <= evt.target.textContent.length) {
      evt.preventDefault();
    }
  }

  drawLinkedList() {
    this.clearCanvas();
    let linkedList = new LinkedList();
    this.setState({
      LinkedList: linkedList
    });
    let visualLinkedList = new VisualLinkedLIst(
      this.canvas,
      this.state.LinkedList
    );
  }

  drawEffects() {
    const { width, height } = this;
    const nested = this.whiteboard.group();

    let radialGradient = nested
      .gradient("radial", stop => {
        stop.at({ offset: 0.1, color: "#fefefe", opacity: 1 });
        stop.at({ offset: 0.9, color: "#EAeaea", opacity: 1 });
      })
      .radius(0.9);
    /*
    let pattern = nested.pattern(20, 20, (add => {

    });
        */
    nested.rect(width, height).fill(radialGradient);
  }

  drawGuides() {
    const { width, height } = this;
    const nested = this.whiteboard.nested();
    const stroke = { color: "#DDD", width: 1 };
    // Vertical line
    nested.line(width / 2, 0, width / 2, height).stroke(stroke);
    // Horizontal line
    nested.line(0, height / 2, width, height / 2).stroke(stroke);
    nested.addClass("guides");
    nested.front();
  }

  drawOutputConsole() {
    const { width, height } = this;
    const outerConsoleWrapper = { w: width - 50, h: height * 0.15 };
    const innerConsoleWrapper = {
      w: outerConsoleWrapper.w - 50,
      h: outerConsoleWrapper.h - 35
    };
    const group = this.whiteboard.group();
    group
      .rect(outerConsoleWrapper.w, outerConsoleWrapper.h)
      .fill({ color: "#FFF", opacity: 0.6 })
      .radius(10)
      .move(0 + 25, height * 0.8);
    group
      .text("Output")
      .font({
        size: 18
      })
      .move(0 + 25, height * 0.8);
    group
      .nested()
      .width(innerConsoleWrapper.w)
      .height(innerConsoleWrapper.h)
      .attr({ id: "innerConsoleWrapper" })
      .move(0 + 25, height * 0.8 + 20);
  }

  appendToConsole(text) {
    this.clearConsole();
    const consoleWrapper = SVG.get("innerConsoleWrapper");
    console.log(text);
    consoleWrapper.text(text);
  }

  clearConsole() {
    const consoleWrapper = SVG.get("innerConsoleWrapper");
    const text = consoleWrapper.first();
    if (text) {
      text.clear();
    }
  }
  clearWhiteboard() {
    this.whiteboard.clear();
  }
}
