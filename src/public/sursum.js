/*
 * DATA STRUCTURES
 * 
 */
class DSNode {
  constructor(value = null) {
    this.value = value;
  }
}

class LinkedListNode extends DSNode {
  constructor({ value = null, next = null, _id }) {
    super(value);
    this.next = next;
    this._id = _id;
  }
}

class SinglyLinkedList {
  constructor(args = { head: null, svgHandler: null }) {
    const { head, svgHandler } = args;
    this.head = head || null;
    switch (svgHandler) {
      case 'lists': {
        this.svgHandler = new SinglyLinkedListSVG();
        break;
      }
      case 'stack': {
        this.svgHandler = new StackSVG();
        break;
      }
      case 'queue': {
        this.svgHandler = new QueueSVG();
        break;
      }
      default: {
        this.svgHandler = null;
      }
    }
  }

  // return length of the list
  get length() {
    let length = 0;
    let current = this.head;
    while (current !== null) {
      current = current.next;
      length += 1;
    }
    return length;
  }

  get tail() {
    if (this.head === null) return null;
    let current = this.head;
    while (current.next !== null) {
      current = current.next;
    }
    return current;
  }

  // adds a node at the end of list
  async appendSVG(value) {
    // if list is empty
    if (this.head === null) {
      let _id;
      if (this.svgHandler) {
        _id = this.svgHandler.drawNode({ value });
      }
      const newHead = new LinkedListNode({ value, _id });
      this.head = newHead;
      return true;
    }
    let current = this.head;
    if (this.svgHandler) {
      this.svgHandler.drawPointer({
        name: 'current',
        pos: 1,
        direction: 'bottom',
        label: 'current',
      });
    }
    // repeat while not at the end of the list
    const loop = () =>
      new Promise(resolve => {
        let previousNode = current;
        if (this.svgHandler) {
          this.svgHandler.visitNode({ node: current });
        }
        let pos = 2;
        const intervalId = setInterval(() => {
          if (current.next !== null) {
            previousNode = current;
            current = current.next;
            if (this.svgHandler) {
              this.svgHandler.visitNode({ node: current });
              this.svgHandler.movePointer({ name: 'current', pos });
              if (previousNode !== null) {
                this.svgHandler.unvisitNode({ node: previousNode });
              }
            }
            pos += 1;
          } else {
            let _id;
            if (this.svgHandler) {
              if (previousNode !== null) {
                this.svgHandler.unvisitNode({ node: previousNode });
              }
              this.svgHandler.unvisitNode({ node: current });
              _id = this.svgHandler.drawNode({ value, pos });
              this.svgHandler.destroyPointer({ name: 'current' });
            }
            current.next = new LinkedListNode({ value, _id });
            clearInterval(intervalId);
            resolve(true);
          }
        }, this.svgHandler ? 350 : 0);
      });
    return loop();
  }

  append(value) {
    if (this.svgHandler !== null) return this.appendSVG(value);
    // if list is empty
    if (this.head === null) {
      this.head = new LinkedListNode({ value });
      return true;
    }
    let current = this.head;
    // repeat while not at the end of the list
    while (current.next !== null) {
      // get to the next element
      current = current.next;
    }
    current.next = new LinkedListNode({ value });
    return true;
  }

  async prependSVG(value) {
    let _id;
    if (this.svgHandler) {
      _id = this.svgHandler.drawNode({ value, pos: 0 });
    }
    const newHead = new LinkedListNode({ value, _id });
    newHead.next = this.head;
    this.svgHandler.moveNode({ node: newHead, pos: 1 });
    this.head = newHead;
    return true;
  }

  prepend(value) {
    if (this.svgHandler !== null) return this.prependSVG(value);

    const newHead = new LinkedListNode({ value });
    newHead.next = this.head;
    this.head = newHead;
    return true;
  }

  async removeByValueSVG(value, callback = undefined) {
    if (this.head === null) return null;
    let pos = 1;
    const loop = () =>
      new Promise(resolve => {
        if (
          (callback && callback(this.head.value)) ||
          this.head.value === value
        ) {
          this.svgHandler.drawPointer({
            name: 'current',
            direction: 'bottom',
            label: 'current',
            pos,
          });
          this.svgHandler.visitNode({ node: this.head });
          this.svgHandler.destroyPointer({ name: 'current' });
          this.svgHandler.removeNode({
            node: this.head,
            pos,
            moveTail: true,
          });
          this.head = this.head.next;
          return resolve(true);
        }

        // this is my pacer
        let slow = this.head;
        this.svgHandler.drawPointer({
          name: 'slow',
          direction: 'bottom',
          label: 'slow',
          pos,
        });

        // this has a link to what would become the new tail
        let fast = slow.next;
        this.svgHandler.drawPointer({
          name: 'fast',
          direction: 'bottom',
          label: 'fast',
          pos: pos + 1,
        });
        this.svgHandler.visitNode({ node: slow.next });
        const intervalId = setInterval(() => {
          if (fast !== null) {
            pos += 1;
            this.svgHandler.unvisitNode({ node: slow.next });
            if (
              (callback && callback(slow.next.value)) ||
              slow.next.value === value
            ) {
              this.svgHandler.removeNode({
                node: slow.next,
                pos,
                moveTail: true,
              });
              slow.next = fast.next;
              this.svgHandler.destroyPointer({ name: 'slow' });
              this.svgHandler.destroyPointer({ name: 'fast' });
              clearInterval(intervalId);
              return resolve(true);
            }
            slow = slow.next;
            this.svgHandler.movePointer({ name: 'slow', pos });
            fast = fast.next;
            this.svgHandler.movePointer({ name: 'fast', pos: pos + 1 });
            if (fast !== null) {
              this.svgHandler.visitNode({ node: fast });
            }
          } else {
            this.svgHandler.destroyPointer({ name: 'slow' });
            this.svgHandler.destroyPointer({ name: 'fast' });
            clearInterval(intervalId);
            return resolve(false);
          }
        }, 1000);
      });

    return loop();
  }

  removeByValue(value, callback = undefined) {
    if (this.svgHandler !== null) return this.removeByValueSVG(value);

    if (this.head === null) return null;
    if ((callback && callback(this.head.value)) || this.head.value === value) {
      this.head = this.head.next;
      return true;
    }
    // this is my pacer
    let slow = this.head;
    // this has a link to what would become the new tail
    let fast = slow.next;
    while (slow.next !== null) {
      if (
        (callback && callback(slow.next.value)) ||
        slow.next.value === value
      ) {
        slow.next = fast.next;
        return true;
      }
      slow = slow.next;
      if (slow !== null) {
        fast = fast.next;
      }
    }
    return false;
  }

  // removes a node at k position and returns true, false if not found
  async removeAtPositionSVG(index) {
    if (this.head === null) return null;

    let pos = 1;
    const loop = () =>
      new Promise(resolve => {
        if (index === pos) {
          this.svgHandler.drawPointer({
            name: 'current',
            direction: 'bottom',
            label: 'current',
            pos,
          });
          this.svgHandler.visitNode({ node: this.head });
          this.svgHandler.destroyPointer({ name: 'current' });
          this.svgHandler.removeNode({
            node: this.head,
            pos,
            moveTail: true,
          });
          this.head = this.head.next;
          return resolve(true);
        }

        // this is my pacer
        let slow = this.head;
        this.svgHandler.drawPointer({
          name: 'slow',
          direction: 'bottom',
          label: 'slow',
          pos,
        });

        // this has a link to what would become the new tail
        let fast = slow.next;
        this.svgHandler.drawPointer({
          name: 'fast',
          direction: 'bottom',
          label: 'fast',
          pos: pos + 1,
        });
        this.svgHandler.visitNode({ node: slow.next });
        const intervalId = setInterval(() => {
          if (fast !== null) {
            pos += 1;
            this.svgHandler.unvisitNode({ node: slow.next });
            if (index === pos) {
              this.svgHandler.removeNode({
                node: slow.next,
                pos,
                moveTail: true,
              });
              slow.next = fast.next;
              this.svgHandler.destroyPointer({ name: 'slow' });
              this.svgHandler.destroyPointer({ name: 'fast' });
              clearInterval(intervalId);
              return resolve(true);
            }
            slow = slow.next;
            this.svgHandler.movePointer({ name: 'slow', pos });
            fast = fast.next;
            this.svgHandler.movePointer({ name: 'fast', pos: pos + 1 });
            if (fast !== null) {
              this.svgHandler.visitNode({ node: fast });
            }
          } else {
            this.svgHandler.destroyPointer({ name: 'slow' });
            this.svgHandler.destroyPointer({ name: 'fast' });
            clearInterval(intervalId);
            return resolve(false);
          }
        }, 1000);
      });

    return loop();
  }

  removeAtPosition(index) {
    if (this.svgHandler !== null) return this.removeAtPositionSVG(index);

    if (index === 1) {
      this.head = this.head.next;
      return true;
    }
    let slow = this.head;
    let fast = slow.next;
    let i = 1;
    while (slow.next !== null) {
      if (i + 1 === index) {
        slow.next = fast.next;
        return true;
      }
      i += 1;
      slow = slow.next;
      if (slow !== null) {
        fast = fast.next;
      }
    }
    return false;
  }

  async insertAtPositionSVG(value, index = 1) {
    if (this.head === null) return null;

    let pos = 1;
    const loop = () =>
      new Promise(resolve => {
        if (index === pos) {
          this.prependSVG(value);
          return resolve(true);
        }

        // this is my pacer
        let slow = this.head;
        this.svgHandler.drawPointer({
          name: 'slow',
          direction: 'bottom',
          label: 'slow',
          pos,
        });

        // this has a link to what would become the new tail
        let fast = slow.next;
        this.svgHandler.drawPointer({
          name: 'fast',
          direction: 'bottom',
          label: 'fast',
          pos: pos + 1,
        });

        this.svgHandler.visitNode({ node: slow.next });
        const intervalId = setInterval(() => {
          if (fast !== null) {
            pos += 1;
            this.svgHandler.unvisitNode({ node: slow.next });
            if (index === pos) {
              const _id = this.svgHandler.drawNode({ value, pos });
              const newNode = new LinkedListNode({ value, _id });
              newNode.next = fast;
              slow.next = newNode;
              this.svgHandler.destroyPointer({ name: 'slow' });
              this.svgHandler.destroyPointer({ name: 'fast' });
              clearInterval(intervalId);
              return resolve(true);
            }
            slow = slow.next;
            this.svgHandler.movePointer({ name: 'slow', pos });
            fast = fast.next;
            this.svgHandler.movePointer({ name: 'fast', pos: pos + 1 });
            if (fast !== null) {
              this.svgHandler.visitNode({ node: fast });
            }
          } else {
            this.svgHandler.destroyPointer({ name: 'slow' });
            this.svgHandler.destroyPointer({ name: 'fast' });
            clearInterval(intervalId);
            return resolve(false);
          }
        }, 1000);
      });

    return loop();
  }

  insertAtPosition(value, pos = 1) {
    if (this.svgHandler !== null) return this.insertAtPosition(value, pos);

    if (pos === 1) {
      this.prepend(value);
      return true;
    }
    let slow = this.head;
    let fast = slow.next;
    // start from position two
    let i = 2;
    // loop until there are no more nodes
    while (slow !== null) {
      if (pos === i) {
        const newNode = new LinkedListNode(value);
        newNode.next = fast;
        slow.next = newNode;
        return true;
      }
      i += 1;
      // move to the next node
      slow = slow.next;
      // move to the next node
      if (slow !== null) {
        fast = fast.next;
      }
    }
    return false;
  }

  // print a string representing the linked list
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
  findByValue(value, callback = undefined) {
    if (this.head === null) return null;
    let current = this.head;
    // lopp until there are no more nodes
    while (current !== null) {
      // If search by callback
      if (callback) {
        if (callback(current.value)) {
          return current;
        }
      } else if (current.value === value) {
        // if we found the first node with the value
        // then return the node
        return current;
      }

      current = current.next;
    }
    return null;
  }

  // find a node at position i
  findAtPosition(pos = 1) {
    if (this.head === null) return null;
    let current = this.head;
    let i = 1;
    while (current !== null) {
      if (pos === i) {
        return current;
      }
      current = current.next;
      i += 1;
    }
    return null;
  }
}

class DataStructureSVG {
  constructor(args = { svgId: 'whiteboard', visitClass: 'current' }) {
    const { svgId, visitClass } = args;
    this.whiteboard = SVG.get(svgId);
    this.visitClass = visitClass;
    this.pointers = {};
  }

  get whiteboardWidth() {
    const { width } = this.whiteboard.viewbox();
    return width;
  }

  get whiteboardHeight() {
    const { height } = this.whiteboard.viewbox();
    return height;
  }

  destroyPointer({ name }) {
    const { id } = this.pointers[name];
    const pointerFig = SVG.get(id);
    pointerFig.remove();
  }

  drawPointer({
    name,
    coords = { x: 0, y: 0 },
    direction = 'top',
    label,
    length = 100,
    offset,
  }) {
    const linePoints = new Array(4).fill(null);
    let labelCoords = { x: 0, y: 0 };
    switch (direction) {
      case 'top': {
        linePoints[0] = 0;
        linePoints[1] = 0;
        linePoints[2] = 0;
        linePoints[3] = length;
        coords.y -= length;
        break;
      }
      case 'bottom': {
        linePoints[0] = 0;
        linePoints[1] = length;
        linePoints[2] = 0;
        linePoints[3] = 0;
        labelCoords.y = length;
        break;
      }
      case 'left': {
        linePoints[0] = 0;
        linePoints[1] = 0;
        linePoints[2] = length;
        linePoints[3] = 0;
        break;
      }
      case 'right': {
        linePoints[0] = length;
        linePoints[1] = 0;
        linePoints[2] = 0;
        linePoints[3] = 0;
        break;
      }
      default: {
      }
    }

    const pointerFig = this.whiteboard.nested();
    pointerFig.line(...linePoints);
    pointerFig.move(coords.x, coords.y + offset);
    pointerFig.addClass(`pointer pointer-${name}`);
    pointerFig
      .text(label.toString())
      .addClass('pointer-label')
      .move(labelCoords.x, labelCoords.y);
    this.pointers[name] = { id: pointerFig.id(), direction };
  }

  movePointer({ name, pos }) {
    const { id } = this.pointers[name];
    const { x, y } = this.calculatePos(pos);
    const pointerFig = SVG.get(id);
    pointerFig.cx(x);
  }

  unvisitNode({ node }) {
    const { visitClass } = this;
    const nodeFig = SVG.get(node._id);
    nodeFig.removeClass(visitClass);
  }

  visitNode({ node }) {
    console.log(node);
    const { visitClass } = this;
    const nodeFig = SVG.get(node._id);
    nodeFig.addClass(visitClass);
  }
}

class SinglyLinkedListSVG extends DataStructureSVG {
  constructor(
    args = { svgId: 'whiteboard', size: { w: 50, h: 40 }, id: undefined },
  ) {
    const { svgId, size, id } = args;
    super({ svgId, visitClass: 'current' });
    this.size = size;
    this.margin = 25;
    this.nodeDistance = 25;
    this.nextBoxWidth = 25;
    this.pointers = {};
    this.drawPointer({
      name: 'head',
      pos: 1,
      direction: 'top',
      label: 'head',
      offset: this.size.h,
    });
  }

  calculatePos(pos = 1) {
    const { w, h } = this.size;
    const { whiteboardWidth, whiteboardHeight } = this;
    const { nodeDistance } = this;
    const x = (w + 25 + nodeDistance) * pos + this.margin;
    const y = whiteboardHeight / 2 - h / 2;
    return { x, y };
  }

  datumSVG(wrapper, value) {
    const { w, h } = this.size;
    const datum = wrapper.group();
    datum.rect(w, h).addClass('list-node-datum');
    datum
      .text(value.toString())
      .center((w * 0.8) / 2, h / 2)
      .addClass('list-node-value');
  }

  nextSVG(wrapper) {
    const w = this.nextBoxWidth;
    const { h } = this.size;
    const next = wrapper.group();
    next
      .rect(w, h)
      .addClass('list-node-next')
      .move(this.size.w, 0);
    /*
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
    */
  }

  destroyPointer({ name }) {
    super.destroyPointer({ name });
  }

  drawPointer({ name, pos = 1, direction = 'top', label, length = 100 }) {
    let offset = 0;
    if (direction === 'bottom') {
      offset = this.size.h;
    }
    const coords = this.calculatePos(pos);
    console.log(coords);
    super.drawPointer({
      name,
      coords,
      direction,
      label,
      length,
      offset,
    });
  }

  drawNode({ value, pos = 1 }) {
    const nodeFig = this.whiteboard.nested();
    const { x, y } = this.calculatePos(pos);
    this.datumSVG(nodeFig, value);
    this.nextSVG(nodeFig);
    nodeFig.center(x, y);
    nodeFig.addClass('list-node');
    console.log(nodeFig.id());
    return nodeFig.id();
  }

  drawNull({ pos }) {}

  movePointer({ name, pos = 1 }) {
    super.movePointer({ name, pos });
  }

  moveNode({ node, pos = 1 }) {
    let current = node;
    let currentPos = pos;
    while (current !== null) {
      const { _id } = current;
      const nodeSVG = SVG.get(_id);
      const { x, y } = this.calculatePos(currentPos);
      nodeSVG.animate(200).center(x, y);
      current = current.next;
      currentPos += 1;
    }
  }

  moveNull({ pos = 1 }) {
    console.log('will implement');
  }

  removeNode({ node, pos = 1, moveTail = true }) {
    let current = node;
    let currentPos = pos;
    const dirtyNode = SVG.get(current._id);
    dirtyNode.remove();
    current = current.next;
    this.moveNode({ node: current, pos: currentPos });
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

  drawNode({ value, pos }) {
    console.info('drawing');
    const nodeWrapper = this.whiteboard.nested();
    this.drawDatum(nodeWrapper, value);
  }
}

// Last In, First Out (LIFO)
class Stack {
  constructor() {
    this.stack = new SinglyLinkedList();
  }

  pop() {
    const element = this.stack.findAtPosition(this.stack.length);
    if (element === null) {
      return null;
    }
    this.stack.removeAtPosition(this.stack.length);
    return element.value;
  }

  push(value) {
    return this.stack.append(value);
  }

  get top() {
    return this.stack.findAtPosition(this.stack.length).value;
  }

  get length() {
    return this.stack.length;
  }

  toString() {
    let i = this.length;
    let str = '\n';
    let maxValueLength = 1;
    // find the longest value length
    while (i > 0) {
      // can be improved
      const { value } = this.stack.findAtPosition(i);
      const valueLength = value.toString().length;
      if (maxValueLength < valueLength) {
        maxValueLength = valueLength;
      }
      i -= 1;
    }
    i = this.length;
    while (i > 0) {
      const { value } = this.stack.findAtPosition(i);
      str += `| ${value.toString().padEnd(maxValueLength, ' ')} |\n`;
      if (i === 1) {
        str += `+${'-'.repeat(maxValueLength + 2)}+\n`;
      }
      i -= 1;
    }
    return str;
  }
}

// First in, First Out (FIFO)
class Queue {
  constructor(args = { svgHandler: null }) {
    this.list = new SinglyLinkedList();
  }

  enqueue(value) {
    return this.list.append(value);
  }

  dequeue() {
    if (this.list.head === null) {
      return null;
    }
    const removedHead = this.list.head.value;
    this.list.removeAtPosition(1);
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
    return this.list.tail.value;
  }

  get length() {
    return this.list.length;
  }

  isEmpty() {
    return this.list.head === null;
  }

  async toString() {
    const nodeStack = new Stack();
    let currentNode = this.list.head;
    const pushPromises = [];
    while (currentNode !== null) {
      pushPromises.push(nodeStack.push(currentNode.value));
      currentNode = currentNode.next;
    }
    return Promise.all(pushPromises).then(() => {
      let str = '\n';
      let i = nodeStack.length;
      while (i > 0) {
        const value = nodeStack.pop();
        str += `[${value}]`;
        if (i > 1) {
          str += '->';
        }
        i -= 1;
      }
      return str;
    });
  }
}

class HashTable {
  constructor(size = 32) {
    this.buckets = new Array(size).fill(null).map(() => new SinglyLinkedList());
    this.keys = {};
  }

  hash(key) {
    const hash = Array.from(key).reduce(
      (hashAccumulator, keySymbol) => hashAccumulator + keySymbol.charCodeAt(0),
      0,
    );
    return hash % this.buckets.length;
  }

  set(key, value) {
    // generate a hash from a key
    const keyHash = this.hash(key);
    this.keys[key] = keyHash;
    // get linkedList at bucket position
    const bucketLinkedList = this.buckets[keyHash];
    // find the node inside the linked list with the key
    const node = bucketLinkedList.findByValue(undefined, v => v.key === key);

    // if there is a node then update its value
    // else add a new node to the list
    if (node) {
      node.value.value = value;
    } else {
      return bucketLinkedList.append({ key, value });
    }
    return true;
  }

  delete(key) {
    // get hash for current key
    const keyHash = this.hash(key);
    // get linkedlist inside of the bucket
    const bucketLinkedList = this.buckets[keyHash];

    const node = bucketLinkedList.findByValue(
      undefined,
      value => value.key === key,
    );

    return node ? bucketLinkedList.removeByValue(node.value) : undefined;
  }

  get(key) {
    const bucketLinkedList = this.buckets[this.hash(key)];
    const node = bucketLinkedList.findByValue(
      undefined,
      value => value.key === key,
    );
    return node ? node.value.value : undefined;
  }

  has(key) {
    return Object.hasOwnProperty.call(this.keys, key);
  }

  getKeys() {
    return Object.keys(this.keys);
  }
}

class BSTNodeSVG extends DataStructureSVG {
  constructor(
    args = { svgId: 'whiteboard', size: { w: 50, h: 50 }, id: undefined },
  ) {
    const { svgId, size, id } = args;
    super({ svgId, visitClass: 'current' });
    this.size = size;
  }
}

class BTNode extends DSNode {
  constructor({ value = null, left = null, right = null }) {
    super(value);
    this.left = left;
    this.right = right;
  }

  // NLR
  preorderTraversal() {
    console.log(this.value);
    if (this.left) {
      this.left.preorderTraversal();
    }
    if (this.right) {
      this.right.preorderTraversal();
    }
  }
}

class BSTNode extends BTNode {
  constructor(args = { value: null, left: null, right: null }) {
    const { value, left, right } = args;
    console.log(args);
    super({ value, left, right });
    this.svgHandler = null;
  }

  async insertSVG(value) {
    console.log('here');
  }

  insert(value) {
    if (this.value === null) {
      this.value = value;
    }

    // go left
    if (value < this.value) {
      if (this.left) {
        return this.left.insert(value);
      }

      const newNode = new BSTNode({ value });
      this.left = newNode;
    }
    // go right
    if (value > this.value) {
      if (this.right) {
        return this.right.insert(value);
      }

      const newNode = new BSTNode({ value });
      this.right = newNode;
    }
    return this;
  }

  async findSVG(value) {}

  find(value) {
    if (this.value === value) {
      return this;
    }

    if (value < this.value && this.left) {
      this.left.find(value);
    }

    if (value > this.value && this.right) {
      this.right.find(value);
    }

    return null;
  }

  async containsSVG(value) {}

  contains(value) {
    return !!this.find(value);
  }

  async removeSVG(value) {}

  remove(value) {}
}

class BST {
  constructor() {
    this.root = new BSTNode();
  }

  insert(value) {
    return this.root.insert(value);
  }

  contains(value) {
    return this.root.contains(value);
  }

  remove(value) {
    return this.root.remove(value);
  }

  preorderTraversal() {
    return this.root.preorderTraversal();
  }

  toString() {
    return this.root.toString();
  }
}

class VisualBinaryTreeNode extends BSTNode {
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
/*
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
*/

class Whiteboard {
  constructor(state) {
    this.setupListeners();
    this.whiteboard = SVG('whiteboard');
    let viewbox = this.whiteboard.viewbox();
    this.width = viewbox.width;
    this.height = viewbox.height;
    console.log(this.height);

    this.nodeSize = { w: 70, h: 50 };
    // this.setupConsole();
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
