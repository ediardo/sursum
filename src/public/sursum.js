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

      // If no right sub trees, then go UP
      if (ancestors[ancestors.length - 1].right === null) {
        rootNode = ancestors.pop();
        // if no right sub trees in right sub tree, then go UP again
        while (
          ancestors.length > 0 &&
          ancestors[ancestors.length - 1].right === rootNode
        ) {
          rootNode = ancestors.pop();
        }
      }
      // Visit node to the right
      rootNode =
        ancestors.length === 0 ? null : ancestors[ancestors.length - 1].right;
    }
    // Simulate stack structure by reversing array
    return ancestors
      .reverse()
      .map(a => a.value)
      .join(", ");
  }

  static preorderTraversal(rootNode) {
    let nodes = [];
    nodes.push(rootNode.value);
    while (nodes.length > 0) {
      nodes.pop();
    }
  }

  static inorderTraversal(rootNode) {}

  static postorderTraversal(rootNode) {}
  _highlightNode(nodeId) {
    let node = SVG.get(nodeId);
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
        "data-node-value": this.value.toString()
      })
      .addClass("tree-node-datum");
    datum
      .text(this.value.toString())
      .addClass("tree-node-value")
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
    nodeFig.addClass("tree-node");
    //nodeFig.dx(-w);
  }
}

class VisualListNode extends ListNode {
  constructor({
    value,
    whiteboard,
    size = { w: 100, h: 50 },
    pos = { x: 0, y: 0 }
  }) {
    super(value);
    this._size = size;
    this._pos = pos;
    this._whiteboard = whiteboard;
    this._drawNode();
  }

  _datumSVG(wrapper) {
    const { w, h } = this._size;
    let datum = wrapper.group();
    datum.rect(w * 0.8, h).addClass("list-node-datum");
    datum
      .text(this.value.toString())
      .center((w * 0.8) / 2, h / 2)
      .addClass("list-node-value");
  }

  _nextSVG(wrapper) {
    const w = this._size.w * 0.2,
      h = this._size.h;
    const pointerCircleRadius = w / 3;
    let pointer = wrapper.group();
    pointer
      .rect(w, h)
      .addClass("list-node-next")
      .move(this._size.w * 0.8, 0);
    pointer
      .circle(pointerCircleRadius)
      .addClass("list-node-link")
      .center(this._size.w - w / 2, this._size.h / 2);

    let linkPoints = [
      [this._size.w * 0.9, this._size.h / 2],
      [this._size.w * 0.9 + 25, this._size.h / 2],
      [this._size.w * 0.9 + 15, this._size.h / 2 - 5],
      [this._size.w * 0.9 + 25, this._size.h / 2],
      [this._size.w * 0.9 + 15, this._size.h / 2 + 5],
      [this._size.w * 0.9 + 25, this._size.h / 2]
    ];
    pointer.polyline(linkPoints).addClass("list-node-link");
  }

  _drawNode() {
    const { h, w } = this._size,
      { x, y } = this._pos;
    let nodeFig = this._whiteboard.nested();
    this._datumSVG(nodeFig);
    this._nextSVG(nodeFig);
    nodeFig.attr({ x, y });
    nodeFig.addClass("list-node");
    this._id = nodeFig.id();
  }
}

class VisualLinkedLIst {
  constructor(whiteboard) {
    this._whiteboard = whiteboard;
    this.head = null;
    this._nodeSize = { w: 100, h: 40 };
    this._nodeOffset = this._nodeSize.w * 0.2;
    this._animationDuration = 250;
    this._drawHead();
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

  _animateOffsetTail(tail, direction = "positive") {
    let current = tail;
    // because we want to move the old head to 2nd position
    let i = 1;
    while (current !== null) {
      let node = SVG(current._id);
      if (direction === "positive") {
        node
          .animate(this._animationDuration)
          .attr({ x: node.attr("x") + this._calculateOffset() });
      } else {
        node
          .animate(this._animationDuration)
          .attr({ x: node.attr("x") - this._calculateOffset(i) });
      }
      i++;
      current = current.next;
    }
  }

  _animateDeleteNode(node) {
    let nodeElement = SVG(node._id);
    nodeElement
      .animate(this._animationDuration)
      .attr({ y: nodeElement.attr("y") + 50, opacity: 0 });
    window.setTimeout(() => {
      nodeElement.remove();
    }, this._animationDuration);
  }

  // adds a node at the end of list
  append(value) {
    let i = 1;
    // if list is empty
    if (this.head === null) {
      let coords = this._calculateCoords(i);
      this.head = new VisualListNode({
        value,
        whiteboard: this._whiteboard,
        pos: coords,
        size: this._nodeSize
      });
      return;
    }
    let current = this.head;
    // repeat while not at the end of the list
    while (current.next !== null) {
      // get to the next element
      current = current.next;
      i++;
    }
    let coords = this._calculateCoords(i + 1);
    current.next = new VisualListNode({
      value,
      whiteboard: this._whiteboard,
      pos: coords,
      size: this._nodeSize
    });
    console.log(this.toString());
  }

  _drawHead(pos = 1) {
    let head = SVG.get("linked-list-head");
    let [x, y] = Object.values(this._calculateCoords(pos));
    if (head !== null) {
      head.center(x, y);
    } else {
      let head = this._whiteboard.nested();
      head.text("head").addClass("head");
      head.line(x + 5, 25, x + 5, 90).addClass("list-node-link");
      head.attr({ id: "linked-list-head" });
      head.center(x / 2, y - 90);
    }
  }

  _calculateOffset() {
    return this._nodeSize.w + this._nodeOffset;
  }

  _calculateCoords(pos = 1) {
    let { _nodeOffset, _nodeSize } = this;
    if (pos > 1) {
      _nodeOffset = _nodeOffset * pos;
    }
    const coords = {
      x: (pos - 1) * _nodeSize.w + _nodeOffset,
      y: this._whiteboard.height() / 3
    };
    console.log(coords);
    return coords;
  }

  // adds a node at the beggining of the list
  prepend(value) {
    let newHead = new VisualListNode({
      value,
      whiteboard: this._whiteboard,
      size: this._nodeSize,
      pos: this._calculateCoords(1)
    });
    this._animateOffsetTail(this.head);
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
    let i = 2;
    while (slow !== null) {
      if (pos === i) {
        let newNode = new VisualListNode({
          value,
          whiteboard: this._whiteboard,
          pos: this._calculateCoords(pos),
          size: this._nodeSize
        });
        newNode.next = fast;
        this._animateOffsetTail(fast);
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
      this._animateDeleteNode(this.head);
      this.head = this.head.next;
      this._animateOffsetTail(this.head, "negative");
      this.toString();
      return true;
    }
    let slow = this.head;
    let fast = slow.next;
    let i = 1;
    while (slow.next !== null) {
      if (i + 1 === index) {
        this._animateDeleteNode(slow.next);
        slow.next = fast.next;
        this._animateOffsetTail(fast.next, "negative");
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

class Console {
  constructor(wrapper) {
    this.wrapper = document.getElementById(wrapper);
    this.count = 0;
    this.setup();
  }

  setup() {
    let browserConsole = console.log;
    let wrapper = this.wrapper;
    console.log = function(message) {
      let entry = document.createElement("div");
      let entryNumber = document.createElement("span");
      entryNumber.className = "console-entry-number";
      let entryMsg = document.createElement("span");
      entryMsg.textContent = message;
      entry.append(entryNumber, entryMsg);
      wrapper.append(entry);
      wrapper.scrollTop = wrapper.scrollHeight;
      browserConsole(message);
    };
  }

  clear() {
    this.wrapper.innerHTML = "";
    this.count = 0;
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
    this.setupConsole();
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
        //this.clearWhiteboard();
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
        let contains = this.visualBSTNode.contains(parseInt(params.val));
        if (contains) {
          console.log(`The BST does contain the node ${params.val}`);
        } else {
          console.log(`The BST does NOT contain the node ${params.val}`);
        }
        break;
      case "getAncestors":
        let ancestors = this.visualBSTNode.getAncestors(
          this.visualBSTNode,
          parseInt(params.val)
        );
        console.log(`The ancestors of ${params.val} are ${ancestors}`);
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

  setupConsole() {
    const { width, height } = this;
    const consoleSize = { w: width - 40, h: height * 0.15 };
    let consoleWrapper = this.whiteboard
      .foreignObject(consoleSize.w, consoleSize.h)
      .move(0 + 20, height * 0.85 - 20);
    consoleWrapper.appendChild("div", { id: "whiteboardConsole" });
    this.console = new Console("whiteboardConsole");
  }

  appendToConsole(text) {}

  clearConsole() {
    this.console.clear();
  }
  clearWhiteboard() {
    this.whiteboard.clear();
  }
}
