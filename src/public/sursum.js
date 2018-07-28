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

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
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

  // adds a node at the end of list
  append(value) {
    // if list is empty
    if (this.head === null) {
      this.head = new ListNode(value);
      return;
    }
    let current = this.head;
    // repeat while not at the end of the list
    while (current.next !== null) {
      // get to the next element
      current = current.next;
    }
    current.next = new ListNode(value);
    console.log(this.toString());
  }

  // adds a node at the beggining of the list
  prepend(value) {
    let newHead = new ListNode(value);
    newHead.next = this.head;
    this.head = newHead;
    this.toString();
  }

  insertAtPosition(value, pos = 1) {
    if (pos === 1) {
      let newHead = new ListNode(value);
      newHead.next = this.head;
      this.head = newHead;
      this.toString();
      return true;
    }
    let slow = this.head;
    let fast = slow.next;
    let i = 1;
    while (slow !== null) {
      if (pos === i + 1) {
        let newNode = new ListNode(value);
        newNode.next = fast;
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
      this.head = this.head.next;
      this.toString();
      return true;
    }
    let slow = this.head;
    let fast = slow.next;
    let i = 1;
    while (slow.next !== null) {
      if (i + 1 === index) {
        slow.next = fast.next;
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

  removeDuplicates() {}

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

class VisualBinaryTreeNode extends Node {
  constructor(value, left = null, right = null) {
    super(value);
    this.left = left;
    this.right = right;
  }

  insert(value) {
    if (value > this.value) {
      if (this.right === null) {
        this.right = new BinaryTreeNode(value);
      } else {
        this.right.insert(value);
      }
    } else {
      if (this.left === null) {
        this.left = new BinaryTreeNode(value);
      } else {
        this.left.insert(value);
      }
    }
  }

  contains(value) {
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
}

class VisualListNode extends ListNode {
  constructor(whiteboard, value, x = 0, y = 100, w = 80, h = 50) {
    super(value);
    this.next = null;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.whiteboard = whiteboard;
    this.drawNode();
  }

  drawNode() {
    const { x, y, w, h } = this;
    let nodeFig = this.whiteboard.nested();
    nodeFig.attr({ x, y });
    let valueLength = this.value.length * 10;
    let pointerPos = { x: w * 0.75, y: 0 };
    let pointerSize = { w: w * 0.25, h };
    let pointerCenterPos = {
      x: pointerSize.w / 2 + pointerPos.x,
      y: pointerSize.h / 2 + pointerPos.y
    };
    let textPos = { x: (w * 0.75) / 2 - valueLength / 2, y: 0 + 20 };
    // Node box
    nodeFig.rect(w * 0.75, h).attr({
      fill: "#FFF",
      stroke: "#333",
      "stroke-width": 1
    });

    // Pointer box
    nodeFig
      .rect(pointerSize.w, pointerSize.h)
      .attr({
        fill: "#FFF",
        stroke: "#333",
        "stroke-width": 1
      })
      .move(pointerPos.x, pointerPos.y);
    nodeFig
      .circle(pointerSize.w * 0.33)
      .attr({
        fill: "#333"
      })
      .center(pointerCenterPos.x, pointerCenterPos.y);
    nodeFig
      .line(
        pointerCenterPos.x,
        pointerCenterPos.y,
        pointerCenterPos.x + 25,
        pointerCenterPos.y
      )
      .stroke({
        width: 1
      });
    nodeFig.text(this.value).move(textPos.x, textPos.y);
    this.id = nodeFig.id();
    console.log(x, y, w, h, this.id);
  }
}

class VisualLinkedLIst {
  constructor(whiteboard) {
    this.whiteboard = whiteboard;
    this.head = null;
    this.size = 0;
    this.clearWhiteboard();
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

  // adds a node at the end of list
  append(value) {
    // if list is empty
    if (this.head === null) {
      this.head = new VisualListNode(this.whiteboard, value, 0, 100);
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
    current.next = new VisualListNode(this.whiteboard, value, i * 100, 100);
    console.log(this.toString());
  }

  clearWhiteboard() {
    this.whiteboard.clear();
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
    let newHead = new VisualListNode(this.whiteboard, value);
    this.animateOffsetTail(this.head);
    newHead.next = this.head;
    this.head = newHead;
    this.toString();
  }

  animateOffsetTail(tail, direction = "positive") {
    let current = tail;
    while (current !== null) {
      let node = SVG(current.id);
      if (direction === "positive") {
        node.animate("200").attr({ x: node.attr("x") + 100 });
      } else {
        node.animate("200").attr({ x: node.attr("x") - 100 });
      }
      current = current.next;
    }
  }

  animateDeleteNode(node) {
    let nodeElement = SVG(node.id);
    nodeElement.animate().opacity(0);
    nodeElement.remove();
  }
  insertAtPosition(value, pos = 1) {
    console.log(value, pos);
    if (pos === 1) {
      this.prepend(value);
      return true;
    }
    let slow = this.head;
    let fast = slow.next;
    let i = 1;
    while (slow !== null) {
      if (pos === i + 1) {
        let newNode = new VisualListNode(this.whiteboard, value, i * 100);
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
      default:
        console.log("Unknown operation");
    }
  }

  bstOps(op, params) {}

  doOp(structure, opName, opParams) {
    switch (structure) {
      case "linkedList":
        this.linkedListOps(opName, opParams);
        break;
      case "bst":
        console.log("future");
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

  drawBST() {
    this.clearCanvas();
    let bst = new BST();
  }

  clearCanvas() {
    let ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
