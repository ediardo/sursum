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
    descendantType = "root"
  }) {
    super(value);
    console.log(value, left, right, size, pos, level);
    this.left = left;
    this.right = right;
    this.whiteboard = whiteboard;
    this.size = size;
    this.pos = pos;
    this.level = level;
    this.descendantType = descendantType;
    this._drawNode();
  }

  insert(value, level = 0) {
    if (value > this.value) {
      if (this.right === null) {
        level++;
        this.right = new VisualBSTNode({
          value,
          whiteboard: this.whiteboard,
          size: this.size,
          descendantType: "rChild",
          level
        });
      } else {
        console.log(level);
        this.right.insert(value, level + 1);
      }
    } else {
      if (this.left === null) {
        this.left = new VisualBSTNode(value);
      } else {
        this.left.insert(value);
      }
    }
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

  _datumSVG(wrapper) {
    const { w, h } = this.size;
    let datum = wrapper.group();
    datum
      .rect(w * 0.7, h)
      .attr({
        fill: "#FFF",
        stroke: "#333",
        "stroke-width": 1
      })
      .move(w * 0.15, 0);
    datum.text(this.value).center(w / 2, h / 2);
  }

  _rightChildSVG(wrapper) {
    const { w, h } = this.size;
    let rightChild = wrapper.group();
    rightChild.rect(w * 0.15 + 1, h).attr({
      fill: "#FFF",
      stroke: "#333",
      "stroke-width": 1
    });
  }

  _leftChildSVG(wrapper) {
    const { w, h } = this.size;
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

  _drawNode() {
    const { w, h } = this.size;
    const { level } = this;
    let nodeFig = this.whiteboard.nested();
    this._rightChildSVG(nodeFig);
    this._leftChildSVG(nodeFig);
    this._datumSVG(nodeFig);
    if (this.descendantType === "rChild") {
      const newX = nodeFig.attr({
        x: `${50 + (50 * 1) / (level + 1)}%`,
        y: `${level * h}%`
      });
    } else if (this.descendantType === "lChild") {
    } else {
      nodeFig.attr({ x: "50%", y: "0%" });
    }
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
    datum.text(this.value).attr({
      width: w,
      height: h
    });
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
    this.nodeSize = { w: 100, h: 50 };
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
    const { whiteboard } = this;
    const { nodeSize: size } = this.nodeSize;
    switch (op) {
      case "new":
        this.clearWhiteboard();
        this.visualBSTNode = new VisualBSTNode({
          value: params.val,
          whiteboard,
          size
        });
        break;
      case "insert":
        this.visualBSTNode.insert(params.val);
        break;
      case "contains":
        this.visualBSTNode.VisualBSTNode(params.val);
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

  clearWhiteboard() {
    this.whiteboard.clear();
  }
}
