/*
       Utils
      
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

*/
/*
 * DATA STRUCTURES
 * 
 */
class Node {
  constructor(value = null) {
    this.value = value;
  }
}

class LinkedListNode extends Node {
  constructor(value = null) {
    super(value);
    this.next = null;
    console.log(this);
  }
}

class DoublyLinkedListNode extends Node {
  constructor(value = null) {
    super(value);
    this.prev = null;
    this.next = null;
  }
}

class SinglyLinkedList {
  constructor(head = null) {
    this.head = head;
  }

  // adds a node at the end of list
  static append(head, value) {
    console.info(head);

    let i = 1;
    // if list is empty
    if (head === null) {
      return new LinkedListNode(value);
    }
    let current = head;
    // repeat while not at the end of the list
    while (current.next !== null) {
      // get to the next element
      current = current.next;
      i += 1;
    }

    current.next = new LinkedListNode(value);
    // return new head
    return head;
  }

  static prepend(head, value) {
    const newHead = new LinkedListNode(value);
    newHead.next = head;
    return newHead;
  }

  // removes a node at k position and returns true, false if not found
  static removeAtPosition(head, index) {
    if (head === null) return null;
    if (index === 1) {
      const newHead = head.next;
      return newHead;
    }
    let slow = head;
    let fast = slow.next;
    let i = 1;
    while (slow.next !== null) {
      if (i + 1 === index) {
        slow.next = fast.next;
        return true;
      }
      i += 1;
      slow = slow.next;
      fast = fast.next;
    }
    return false;
  }

  static insertAtPosition(head, value, pos = 1) {
    if (pos === 1) {
      return SinglyLinkedList.prepend(head, value);
    }
    let slow = head;
    let fast = slow.next;
    let i = 2;
    while (slow !== null) {
      if (pos === i) {
        const newNode = new LinkedListNode(value);
        newNode.next = fast;
        slow.next = newNode;
        return head;
      }
      i += 1;
      slow = slow.next;
      fast = fast.next;
    }
    return false;
  }

  toString() {
    if (this.head === null) return null;
    let current = this.head;
    let str = '';
    while (current !== null) {
      str += `[${current.value}]->`;
      if (current.next === null) {
        str += 'null';
      }
      current = current.next;
    }
    return str;
  }

  // find the first node with value
  static findByValue(head, value) {
    if (head === null) return null;
    let current = head;
    while (current !== null) {
      if (current.value === value) {
        return current;
      }
      current = current.next;
    }
    return null;
  }
}

class DataStructureSVG {
  constructor(svgId = 'whiteboard') {
    this.whiteboard = SVG.get(svgId);
  }

  get whiteboardWidth() {
    return this.whiteboard.width();
  }

  get whiteboardHeight() {
    return this.whiteboard.height();
  }
}

class QueueSVG extends DataStructureSVG {
  constructor(svgId = 'whiteboard') {
    super(svgId);
    this.containerSize = {
      w: this.whiteboardWidth * 0.9,
      h: this.whiteboardHeight * 0.25,
    };
    this.drawContainer();
  }

  drawContainer() {
    const { containerSize, whiteboardHeight, whiteboardWidth } = this;
    console.info({ containerSize, whiteboardHeight, whiteboardWidth });
    const containerWrapper = this.whiteboard.nested();
    containerWrapper.line(
      whiteboardWidth - containerSize.w,
      whiteboardHeight / 2 - containerSize.h / 2,
      Math.abs(whiteboardWidth - containerSize.w + containerSize.w),
      whiteboardHeight / 2 - containerSize.h / 2,
    );
    containerWrapper.line(
      whiteboardWidth - containerSize.w,
      whiteboardHeight / 2 + containerSize.h / 2,
      Math.abs(containerSize.w - whiteboardWidth),
      whiteboardHeight / 2 + containerSize.h / 2,
    );
    containerWrapper.addClass('queue-container');
  }
  drawDatum(nodeWrapper, value) {
    nodeWrapper.rect(100, 100);
    nodeWrapper.text(value.toString());
  }

  drawNode(value) {
    const nodeWrapper = this.whiteboard.nested();
    this.drawDatum(nodeWrapper, value);
  }

  calculateNodeCoords(pos) {
    console.info('i');
  }
}

class Queue {
  constructor(svgHandler = null) {
    this.list = new SinglyLinkedList();
    this.svgHandler = new svgHandler();
  }

  enqueue(value) {
    this.list.head = SinglyLinkedList.append(this.list.head, value);
    if (this.svgHandler) {
      this.svgHandler.drawNode(value);
    }
  }

  dequeue() {
    if (this.list === null) {
      return null;
    }
    const removedHead = this.list.head.value;
    this.list.head = SinglyLinkedList.removeAtPosition(this.list.head, 1);
    return removedHead;
  }

  get front() {
    if (this.list.head === null) {
      return null;
    }
    return this.list.head.value;
  }

  get back() {
    if (this.list.head === null) {
      return null;
    }
    let currentNode = this.list.head;
    while (currentNode.next !== null) {
      currentNode = currentNode.next;
    }
    return currentNode.value;
  }

  isEmpty() {
    return this.list.head === null;
  }

  toString() {
    const nodeValues = [];
    let currentNode = this.list.head;
    while (currentNode.next !== null) {
      nodeValues.unshift(currentNode.value);
      currentNode = currentNode.next;
    }
    let str = '';
    for (let i = 0; i < nodeValues.length; i++) {
      str += `[${nodeValues[i]}]`;
      if (i !== nodeValues.length - 1) {
        str += '->';
      }
    }
    return str;
  }
}

class Stack {}
class BinaryTreeNode extends Node {
  constructor(value, left, right) {
    super(value);
    this.left = left;
    this.right = right;
  }

  static insert() {
    console.log('Implement this');
  }

  static getAncestors() {
    console.log('Implement this');
  }

  static getLowestCommonAncestor() {
    console.log('Implement this');
  }

  static preorderTraversal() {
    console.log('Implement this');
  }

  static inorderTraversal() {
    console.log('Implement this');
  }

  static postorderTraversal() {
    console.log('Implement this');
  }

  static rotateRight() {
    console.log('Implement this');
  }

  static rotateLeft() {
    console.log('Implement this');
  }
}
/*
 *
 * Visual List node
 *  
 */

class VisualSinglyLinkedListNode extends LinkedListNode {
  constructor({
    value,
    whiteboard,
    size = { w: 100, h: 50 },
    pos = { x: 0, y: 0 },
  }) {
    super(value);
    this.next = null;
    this._size = size;
    this._pos = pos;
    this._whiteboard = whiteboard;
    this._drawNode();
  }

  _datumSVG(wrapper) {
    const { w, h } = this._size;
    const datum = wrapper.group();
    datum.rect(w * 0.8, h).addClass('list-node-datum');
    datum
      .text(this.value.toString())
      .center((w * 0.8) / 2, h / 2)
      .addClass('list-node-value');
  }

  _nextSVG(wrapper) {
    const { w } = this._size.w * 0.2;
    const { h } = this._size.h;
    const pointerCircleRadius = w / 3;
    const pointer = wrapper.group();
    pointer
      .rect(w, h)
      .addClass('list-node-next')
      .move(this._size.w * 0.8, 0);
    pointer
      .circle(pointerCircleRadius)
      .addClass('list-node-link')
      .center(this._size.w - w / 2, this._size.h / 2);
    const linkPoints = [
      [this._size.w * 0.9, this._size.h / 2],
      [this._size.w * 0.9 + 25, this._size.h / 2],
      [this._size.w * 0.9 + 15, this._size.h / 2 - 5],
      [this._size.w * 0.9 + 25, this._size.h / 2],
      [this._size.w * 0.9 + 15, this._size.h / 2 + 5],
      [this._size.w * 0.9 + 25, this._size.h / 2],
    ];
    pointer.polyline(linkPoints).addClass('list-node-link');
  }

  _drawNode() {
    const { x, y } = this._pos;
    const nodeFig = this._whiteboard.nested();
    this._datumSVG(nodeFig);
    this._nextSVG(nodeFig);
    nodeFig.attr({ x, y });
    nodeFig.addClass('list-node');
    this._id = nodeFig.id();
  }
}

/*
 *
 * Visual Linked List
 *
 */
class VisualSinglyLinkedList extends SinglyLinkedList {
  constructor(whiteboard) {
    super(null);
    this._whiteboard = whiteboard;
    this._nodeSize = { w: 100, h: 40 };
    this._nodeOffset = this._nodeSize.w * 0.2;
    this._animationDuration = 250;
    this._drawHead();
  }

  static length(head) {
    if (head === null) return 0;
    let length = 1;
    if (head.next === null) return length;
    let current = head;
    while (current.next !== null) {
      current = current.next;
      length += 1;
    }
    return length;
  }

  // adds a node at the end of list
  static append(list, value) {
    let i = 1;
    // if list is empty
    if (list.head === null) {
      const coords = this._calculateCoords(i);
      return new VisualSinglyLinkedListNode({
        value,
        whiteboard: list._whiteboard,
        pos: coords,
        size: list._nodeSize,
      });
    }
    let current = list.head;
    // repeat while not at the end of the list
    while (current.next !== null) {
      // get to the next element
      current = current.next;
      i += 1;
    }
    const coords = this._calculateCoords(i + 1);
    current.next = new VisualSinglyLinkedListNode({
      value,
      whiteboard: list._whiteboard,
      pos: coords,
      size: list._nodeSize,
    });
    // return new head
    return list;
  }

  // finds a node at k position, returns null if not found
  static findAtPosition(head, index) {
    if (head === null) return null;
    let current = head;
    let i = 1;
    while (current !== null) {
      if (index === i) {
        return current;
      }
      i += 1;
      current = current.next;
    }
    return null;
  }

  // find the first
  static findByValue(head, value) {
    if (head === null) return null;
    let current = head;
    while (current !== null) {
      if (current.value === value) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  static insertAtPosition(head, value, pos = 1) {
    if (pos === 1) {
      return VisualSinglyLinkedList.prepend(head, value);
    }
    let slow = head;
    let fast = slow.next;
    let i = 2;
    while (slow !== null) {
      if (pos === i) {
        const newNode = new VisualSinglyLinkedListNode({
          value,
          whiteboard: head._whiteboard,
          pos: this._calculateCoords(pos),
          size: head._nodeSize,
        });
        newNode.next = fast;
        this._animateOffsetTail(fast);
        slow.next = newNode;
        return head;
      }
      i += 1;
      slow = slow.next;
      fast = fast.next;
    }
    return false;
  }

  // adds a node at the beggining of the list
  static prepend(head, value) {
    const newHead = new VisualSinglyLinkedListNode({
      value,
      whiteboard: this._whiteboard,
      size: this._nodeSize,
      pos: this._calculateCoords(1),
    });
    this._animateOffsetTail(this.head);
    newHead.next = head;
    return newHead;
  }

  // removes a node at k position and returns true, false if not found
  static removeAtPosition(head, index) {
    if (head === null) return null;
    if (index === 1) {
      this._animateDeleteNode(head);
      const newHead = head.next;
      this._animateOffsetTail(head, 'negative');
      return newHead;
    }
    let slow = this.head;
    let fast = slow.next;
    let i = 1;
    while (slow.next !== null) {
      if (i + 1 === index) {
        this._animateDeleteNode(slow.next);
        slow.next = fast.next;
        this._animateOffsetTail(fast.next, 'negative');
        return true;
      }
      i += 1;
      slow = slow.next;
      fast = fast.next;
    }
    return false;
  }

  static removeByValue(head, value) {
    if (head === null) return null;
    if (head.value === value) {
      const newHead = head.next;
      return newHead;
    }
    let slow = this.head;
    let fast = slow.next;
    while (slow.next !== null) {
      if (fast.value === value) {
        slow.next = fast.next;
        this.toString();
        return true;
      }
      slow = slow.next;
      fast = fast.next;
    }
    return false;
  }

  // reverses a linked list
  static reverse(head) {
    let current = head;
    let prevNode = null;
    let nextNode = null;
    while (current !== null) {
      nextNode = current.next;
      current.next = prevNode;
      prevNode = current;
      current = nextNode;
    }
    return prevNode;
  }

  toString() {
    if (this.head === null) return null;
    let current = this.head;
    let str = '';
    while (current !== null) {
      str += `[${current.value}]->`;
      if (current.next === null) {
        str += 'null';
      }
      current = current.next;
    }
    return str;
  }

  _animateOffsetTail(tail, direction = 'positive') {
    let current = tail;
    // because we want to move the old head to 2nd position
    let i = 1;
    while (current !== null) {
      const node = SVG(current._id);
      if (direction === 'positive') {
        node
          .animate(this._animationDuration)
          .attr({ x: node.attr('x') + this._calculateOffset() });
      } else {
        node
          .animate(this._animationDuration)
          .attr({ x: node.attr('x') - this._calculateOffset(i) });
      }
      i += 1;
      current = current.next;
    }
  }

  _animateDeleteNode(node) {
    const nodeElement = SVG(node._id);
    nodeElement
      .animate(this._animationDuration)
      .attr({ y: nodeElement.attr('y') + 50, opacity: 0 });
    setTimeout(() => {
      nodeElement.remove();
    }, this._animationDuration);
  }

  _drawHead(pos = 1) {
    let head = SVG.get('linked-list-head');
    const [x, y] = Object.values(this._calculateCoords(pos));
    if (head !== null) {
      head.center(x, y);
    } else {
      head = this._whiteboard.nested();
      head.text('head').addClass('head');
      head.line(x + 5, 25, x + 5, 90).addClass('list-node-link');
      head.attr({ id: 'linked-list-head' });
      head.center(x / 2, y - 90);
    }
  }

  _calculateOffset() {
    return this._nodeSize.w + this._nodeOffset;
  }

  static _calculateCoords(pos = 1) {
    const { _nodeSize } = this;
    let { _nodeOffset } = this;
    if (pos > 1) {
      _nodeOffset *= pos;
    }
    const coords = {
      x: (pos - 1) * _nodeSize.w + _nodeOffset,
      y: this._whiteboard.height() / 3,
    };
    return coords;
  }
}

class VisualBinaryTreeNode extends BinaryTreeNode {
  constructor({
    value,
    left = null,
    right = null,
    whiteboard,
    size = { w: 100, h: 50 },
    pos = { x: 0, y: 0 },
    level = 0,
    column = 16,
  }) {
    super(value, left, right);
    this._whiteboard = whiteboard;
    this._size = size;
    this._pos = pos;
    this._level = level;
    this._column = column;
    console.log(`Inserted new node ${value} at level ${level}`);
    this._drawNode();
  }

  static insert(rootNode, value, level = 0) {
    if (value > rootNode.value) {
      if (rootNode.right === null) {
        level += 1;
        let newColumn;
        if (level === 1) {
          newColumn = rootNode._column + 8;
        } else if (level === 2) {
          newColumn = rootNode._column + 4;
        } else if (level === 3) {
          newColumn = rootNode._column + 2;
        } else if (level === 4) {
          newColumn = rootNode._column + 1;
        }
        const newNode = new VisualBinaryTreeNode({
          value,
          whiteboard: rootNode._whiteboard,
          size: rootNode._size,
          column: newColumn,
          level,
        });
        rootNode.right = newNode;
      } else {
        VisualBinaryTreeNode.insert(rootNode.right, value, level + 1);
      }
    } else if (value < rootNode.value) {
      if (rootNode.left === null) {
        level += 1;
        let newColumn;
        if (level === 1) {
          newColumn = rootNode._column - 8;
        } else if (level === 2) {
          newColumn = rootNode._column - 4;
        } else if (level === 3) {
          newColumn = rootNode._column - 2;
        } else if (level === 4) {
          newColumn = rootNode._column - 1;
        }
        const newNode = new VisualBinaryTreeNode({
          value,
          whiteboard: rootNode._whiteboard,
          size: rootNode._size,
          column: newColumn,
          level,
        });
        rootNode.left = newNode;
      } else {
        VisualBinaryTreeNode.insert(rootNode.left, value, level + 1);
      }
    } else {
      return false;
    }
    return rootNode;
  }

  static contains(rootNode, value) {
    if (value === rootNode.value) {
      return true;
    }
    if (value < rootNode.value) {
      if (rootNode.left === null) {
        return false;
      }
      return rootNode.left.contains(value);
    }
    if (rootNode.right === null) {
      return false;
    }
    return rootNode.right.contains(value);
  }

  static getAncestors(rootNode, target) {
    const ancestors = [];
    if (rootNode === null) {
      return;
    }
    let currentNode = rootNode;
    while (true) {
      while (currentNode !== null && currentNode.value !== target) {
        ancestors.push(currentNode);
        currentNode = currentNode.left;
      }

      if (currentNode !== null && currentNode.value === target) {
        break;
      }

      // If no right sub trees, then go UP
      if (ancestors[ancestors.length - 1].right === null) {
        currentNode = ancestors.pop();
        // if no right sub trees in right sub tree, then go UP again
        while (
          ancestors.length > 0 &&
          ancestors[ancestors.length - 1].right === currentNode
        ) {
          currentNode = ancestors.pop();
        }
      }
      // Visit node to the right
      currentNode =
        ancestors.length === 0 ? null : ancestors[ancestors.length - 1].right;
    }
    // Simulate stack structure by reversing array
    return ancestors
      .reverse()
      .map(a => a.value)
      .join(', ');
  }

  // NLR
  static preorderTraversal(rootNode) {
    if (rootNode === null) {
      return;
    }
    const stack = [];
    stack.push(rootNode);
    return new Promise(resolve => {
      let previousNode = null;
      const traversal = [];
      const intervalId = setInterval(() => {
        if (stack.length === 0) {
          clearInterval(intervalId);
          VisualBinaryTreeNode._unvisitNodeSVG(previousNode);
          resolve(traversal);
        } else {
          const currentNode = stack.pop();
          if (previousNode !== null) {
            VisualBinaryTreeNode._unvisitNodeSVG(previousNode);
          }
          previousNode = currentNode;
          VisualBinaryTreeNode._visitNodeSVG(currentNode);
          traversal.push(currentNode.value);
          if (currentNode.right !== null) {
            stack.push(currentNode.right);
          }
          if (currentNode.left !== null) {
            stack.push(currentNode.left);
          }
        }
      }, 350);
    });
  }

  // LNR
  static inorderTraversal(rootNode) {
    if (rootNode === null) {
      return;
    }

    return new Promise(resolve => {
      const stack = [];
      let currentNode = rootNode;
      let previousNode = null;
      const traversal = [];
      const intervalId = setInterval(() => {
        if (currentNode === null && stack.length === 0) {
          clearInterval(intervalId);
          VisualBinaryTreeNode._unvisitNodeSVG(previousNode);
          resolve(traversal);
        } else {
          // Go as far as possible to the left
          while (currentNode !== null) {
            stack.push(currentNode);
            currentNode = currentNode.left;
          }
          currentNode = stack.pop();
          VisualBinaryTreeNode._visitNodeSVG(currentNode);
          if (previousNode !== null) {
            VisualBinaryTreeNode._unvisitNodeSVG(previousNode);
          }
          previousNode = currentNode;
          traversal.push(currentNode.value);
          currentNode = currentNode.right;
        }
      }, 350);
    });
  }

  static postorderTraversal(rootNode) {}

  static levelorderTraversal(rootNode) {
    if (rootNode === null) {
      return;
    }
    return new Promise(resolve => {
      const queue = [];
      let currentNode = rootNode;
      let previousNode = null;
      const traversal = [];
      const intervalId = setInterval(() => {
        if (currentNode === null) {
          clearInterval(intervalId);
          VisualBinaryTreeNode._unvisitNodeSVG(previousNode);
          resolve(traversal);
        } else {
          traversal.push(currentNode.value);
          VisualBinaryTreeNode._visitNodeSVG(currentNode);
          if (previousNode !== null) {
            VisualBinaryTreeNode._unvisitNodeSVG(previousNode);
          }
          if (currentNode.left !== null) {
            queue.unshift(currentNode.left);
          }
          if (currentNode.right !== null) {
            queue.unshift(currentNode.right);
          }
          previousNode = currentNode;
          currentNode = queue.pop() || null; // pop returns undefined if no more items in array
        }
      }, 350);
    });
  }

  static _visitNodeSVG(node) {
    const nodeElement = document.querySelector(`#${node._id} circle`);
    nodeElement.classList.add('current');
  }

  static _unvisitNodeSVG(node) {
    const nodeElement = document.querySelector(`#${node._id} circle`);
    nodeElement.classList.remove('current');
  }

  _datumSVG(wrapper) {
    const { w, h } = this._size;
    const datum = wrapper.group();
    datum
      .circle(w)
      .attr({
        'data-node-value': this.value.toString(),
      })
      .addClass('tree-node-datum');
    datum
      .text(this.value.toString())
      .addClass('tree-node-value')
      .center(w / 2, w / 2);
  }

  _rightChildSVG(wrapper) {
    const { w, h } = this._size;
    let rightChild = wrapper.group();
    rightChild.rect(w * 0.15 + 1, h).attr({
      fill: '#FFF',
      stroke: '#333',
      'stroke-width': 1,
    });
  }

  _leftChildSVG(wrapper) {
    const { w, h } = this._size;
    let leftChild = wrapper.group();
    leftChild
      .rect(w * 0.15 - 1, h)
      .attr({
        fill: '#FFF',
        stroke: '#333',
        'stroke-width': 1,
      })
      .move(w * 0.85, 0);
  }

  static _calculateColumnCoords(column, level) {
    return {
      x: (1200 / 32) * column,
      y: (700 / 6) * level,
    };
  }

  static _calculateColumnOffset(column, level) {
    let offset = 0;
    switch (level) {
      case 1: {
        offset = column < 32 / 2 ? 8 : -8;
        break;
      }
      case 2: {
        if (column === 4 || column === 20) {
          offset = 4;
        } else {
          offset = -4;
        }
        break;
      }
      case 3: {
        if (column === 2 || column === 10 || column === 18 || column === 26) {
          offset = 2;
        } else {
          offset = -2;
        }
        break;
      }
      case 4: {
        const levelColumns = [1, 5, 9, 13, 17, 21, 25, 29];
        if (levelColumns.includes(column)) {
          offset = 1;
        } else {
          offset = -1;
        }
        break;
      }
      default:
        return;
    }
    return offset;
  }

  _edgeSVG(wrapper, column, level) {
    if (level === 0) {
      return;
    }
    const childCoords = VisualBinaryTreeNode._calculateColumnCoords(
      column,
      level,
    );
    const parentColumnOffset = VisualBinaryTreeNode._calculateColumnOffset(
      column,
      level,
    );
    const parentCoords = VisualBinaryTreeNode._calculateColumnCoords(
      column + parentColumnOffset,
      level - 1,
    );
    wrapper
      .line(
        childCoords.x,
        childCoords.y + this._size.w,
        parentCoords.x,
        parentCoords.y + this._size.w,
      )
      .back()
      .addClass('tree-node-edge');
  }

  _drawNode() {
    const { w } = this._size;
    const { _level, _column } = this;
    const nodeFig = this._whiteboard.nested();
    this._edgeSVG(this._whiteboard, _column, _level);
    this._datumSVG(nodeFig);
    this._id = nodeFig.id();
    const coords = VisualBinaryTreeNode._calculateColumnCoords(_column, _level);
    // nodeFig.attr({ ...coords, cx: 25, yx: 25 });
    nodeFig.center(coords.x - w / 2, coords.y + 25);
    nodeFig.addClass('tree-node');
    // nodeFig.dx(-w);
  }
}

// export { VisualBinaryTreeNode, VisualSinglyLinkedList };

// import { VisualBinaryTreeNode, VisualSinglyLinkedList } from './dataStructures';

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
      let entry = document.createElement('div');
      let entryNumber = document.createElement('span');
      entryNumber.className = 'console-entry-number';
      let entryMsg = document.createElement('span');
      entryMsg.textContent = message;
      entry.append(entryNumber, entryMsg);
      wrapper.append(entry);
      wrapper.scrollTop = wrapper.scrollHeight;
      browserConsole(message);
    };
  }

  clear() {
    this.wrapper.innerHTML = '';
    this.count = 0;
  }
}

class Whiteboard {
  constructor(state) {
    this.setupListeners();
    this.whiteboard = SVG('whiteboard');
    this.width = this.whiteboard.width();
    this.height = this.whiteboard.height();
    this.nodeSize = { w: 70, h: 50 };
    this.setupConsole();
    this.drawGuides();
  }

  setupListeners() {
    let dataStructures = document.querySelectorAll('.ops ul');
    let inputs = document.querySelectorAll('span.input');
    inputs.forEach(input => {
      input.addEventListener('keypress', this.handleOnKeyPressInput.bind(this));
    });
    dataStructures.forEach(ds => {
      let dsName = ds.dataset.structure;
      let ops = ds.querySelectorAll('li');
      ops.forEach(op => {
        op.addEventListener('click', this.handleOnClickOperation.bind(this));
      });
    });
  }

  handleOnClickOperation(evt) {
    let { target } = evt;
    if (target.tagName === 'BUTTON') {
      let { structure, opName, hasInput } = target.parentElement.dataset;
      if (hasInput === 'true') {
        let inputs = target.parentElement.querySelectorAll('span');
        var opParams = {};
        inputs.forEach(input => {
          opParams[input.dataset.paramName] = input.textContent;
          input.textContent = '';
        });
      }
      this.doOp(structure, opName, opParams);
    }
  }

  linkedListOps(op, params) {
    switch (op) {
      case 'new':
        this.visualLinkedList = new VisualSinglyLinkedList(this.whiteboard);
        break;
      case 'append':
        this.visualLinkedList = VisualSinglyLinkedList.append(
          this.visualLinkedList,
          params.val,
        );
        break;
      case 'prepend':
        this.visualLinkedList = VisualSinglyLinkedList.prepend(
          this.visualLinkedList,
          params.val,
        );
        break;
      case 'insertAtPos':
        this.visualLinkedList = VisualSinglyLinkedList.insertAtPosition(
          this.visualLinkedList,
          params.val,
          parseInt(params.pos),
        );
        break;
      case 'removeAtPos':
        this.visualLinkedList = VisualSinglyLinkedList.removeAtPosition(
          this.visualLinkedList,
          parseInt(params.pos),
        );
        break;
      case 'findByValue':
        //this.visualLinkedList.removeAtPosition;
        console.log('future');
        break;
      default:
        console.log('Unknown operation');
    }
  }

  async bstOps(op, params) {
    const { nodeSize: size, whiteboard } = this;
    switch (op) {
      case 'new': {
        const wrapper = this.whiteboard.group();
        // wrapper.before();
        this.visualBSTNode = new VisualBinaryTreeNode({
          value: parseInt(params.val),
          whiteboard: wrapper,
          size: { w: 50 },
        });
        break;
      }
      case 'insert': {
        this.visualBSTNode = VisualBinaryTreeNode.insert(
          this.visualBSTNode,
          parseInt(params.val),
        );
        break;
      }
      case 'contains': {
        let contains = VisualBinaryTreeNode.contains(
          this.visualBSTNode,
          parseInt(params.val),
        );
        if (contains) {
          console.log(`The BST does contain the node ${params.val}`);
        } else {
          console.log(`The BST does NOT contain the node ${params.val}`);
        }
        break;
      }
      case 'getAncestors': {
        const ancestors = VisualBinaryTreeNode.getAncestors(
          this.visualBSTNode,
          parseInt(params.val),
        );
        console.log(`The ancestors of ${params.val} are ${ancestors}`);
        break;
      }
      case 'preorderTraversal': {
        const preorderTraversal = await VisualBinaryTreeNode.preorderTraversal(
          this.visualBSTNode,
        );
        console.log(`The preorder traversal (NLR) is: ${preorderTraversal}`);
        break;
      }
      case 'inorderTraversal': {
        const inorderTraversal = await VisualBinaryTreeNode.inorderTraversal(
          this.visualBSTNode,
        );
        console.log(`The inorder traversal (LNR) is: ${inorderTraversal}`);
        break;
      }
      case 'postorderTraversal': {
        const postorderTraversal = await VisualBinaryTreeNode.inorderTraversal(
          this.visualBSTNode,
        );
        console.log(`The postorder traversal (LRN) is: ${postorderTraversal}`);
        break;
      }
      case 'levelorderTraversal': {
        const levelorderTraversal = await VisualBinaryTreeNode.levelorderTraversal(
          this.visualBSTNode,
        );
        console.log(`The levelorder traversal is: ${levelorderTraversal}`);
        break;
      }
      default:
        console.log('Unknown operation');
    }
  }

  doOp(structure, opName, opParams) {
    switch (structure) {
      case 'linkedList':
        this.linkedListOps(opName, opParams);
        break;
      case 'bstNode':
        this.bstOps(opName, opParams);
        break;
      default:
        console.log('Incorrect Data Structure');
    }
  }

  handleOnKeyPressInput(evt) {
    let { key } = evt;
    if (key === 'Enter') {
      evt.target.parentNode.querySelector('button').click();
      evt.preventDefault();
    } else if (evt.target.dataset.maxLength <= evt.target.textContent.length) {
      evt.preventDefault();
    }
  }

  drawGuides() {
    const { width, height } = this;
    const nested = this.whiteboard.nested();
    const stroke = { color: '#DDD', width: 1 };
    // Vertical line
    nested.line(width / 2, 0, width / 2, height).stroke(stroke);
    // Horizontal line
    nested.line(0, height / 2, width, height / 2).stroke(stroke);
    nested.addClass('guides');
    nested.front();
  }

  setupConsole() {
    this.console = new Console('whiteboardConsole');
  }

  clearConsole() {
    this.console.clear();
  }
  clearWhiteboard() {
    this.whiteboard.clear();
  }
}
