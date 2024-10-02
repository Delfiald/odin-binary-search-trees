class Node{
  constructor(value = null){
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array)
  }

  buildTree(array){
    const sortedArray = [...new Set(array)].sort((a, b) => a - b)

    const buildBalancedTree = (array, start, end) => {
      if (start > end) return null;
  
      const mid = Math.floor((start + end) / 2);
      const node = new Node(array[mid]);
  
      node.left = buildBalancedTree(array, start, mid - 1);
      node.right = buildBalancedTree(array, mid + 1, end);
  
      return node;
    }

    const root = buildBalancedTree(sortedArray, 0, sortedArray.length - 1)

    return root;
  }

  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

  insert(value) {
    let currentNode = this.root;
    
    if(!this.root) {
      this.root = new Node(value);
      return;
    }

    while(true) {
      if(value < currentNode.value){
        if(!currentNode.left) {
          currentNode.left = new Node(value);
          return;
        }
        currentNode = currentNode.left
      }else if(value > currentNode.value) {
        if(!currentNode.right) {
          currentNode.right = new Node(value);
          return;
        }
        currentNode = currentNode.right
      }else {
        return;
      }
    }
  }

  deleteItem(value) {
    let currentNode = this.root
    let previousNode = null;
    let left = false

    if(!currentNode) {
      return;
    }

    while(currentNode) {
      if(value < currentNode.value){
        previousNode = currentNode
        currentNode = currentNode.left
        left = true
      }else if(value > currentNode.value){
        previousNode = currentNode
        currentNode = currentNode.right
        left = false
      }else {
        if(!currentNode.left && !currentNode.right) {
          if(!previousNode) {
            this.root = null
          }else if(left) {
            previousNode.left = null;
          }else {
            previousNode.right = null;
          }
        } else if(!currentNode.left || !currentNode.right) {
          let child = currentNode.left || currentNode.right;
          if(!previousNode) {
            this.root = child;
          } else if (left) {
            previousNode.left = child;
          } else {
            previousNode.right = child;
          }
        } else {
          let successorParent = currentNode;
          let successor = currentNode.right;

          while(successor.left) {
            successorParent = successor;
            successor = successor.left
          }

          currentNode.value = successor.value;

          if(successorParent !== currentNode) {
            successorParent.left = successor.right
          }else {
            currentNode.right = successor.right
          }
        }

        return;
      }
    }
  }

  find(value) {
    let currentNode = this.root

    while(currentNode) {
      if(value < currentNode.value) {
        currentNode = currentNode.left
      }else if(value > currentNode.value) {
        currentNode = currentNode.right
      }else {
        return currentNode;
      }
    }
    return null;
  }

  levelOrder(callback) {
    if(!callback) {
      throw new Error("Callback is required");
    }

    const queue = [];
    queue.push(this.root);

    while(queue.length) {
      const currentNode = queue.shift();

      if(currentNode) {
        callback(currentNode);

        if(currentNode.left){
          queue.push(currentNode.left)
        }

        if(currentNode.right){
          queue.push(currentNode.right)
        }
      }
    }
  }

  inOrder(callback) {
    if(!callback) {
      throw new Error("Callback is required");
    }

    const stack = [];
    let currentNode = this.root;

    while(stack.length || currentNode) {

      while(currentNode) {
        stack.push(currentNode)
        currentNode = currentNode.left
      }
      currentNode = stack.pop();        
      callback(currentNode);

      currentNode = currentNode.right
    }
  }

  preOrder(callback) {
    if(!callback) {
      throw new Error("Callback is required");
    }

    const stack = [];
    let currentNode = this.root;

    while(stack.length || currentNode) {
      if(currentNode) {
        callback(currentNode)
        stack.push(currentNode)
        currentNode = currentNode.left
      }else {
        currentNode = stack.pop()
        currentNode = currentNode.right
      }
    }
  }

  postOrder(callback) {
    if(!callback) {
      throw new Error("Callback is required");
    }

    const stack = [];
    const output = [];
    let currentNode = this.root;

    while(stack.length || currentNode) {
      if(currentNode) {
        stack.push(currentNode)
        output.push(currentNode)
        currentNode = currentNode.right
      }else {
        currentNode = stack.pop()
        currentNode = currentNode.left
      }
    }

    while(output.length) {
      callback(output.pop())
    }
  }

  height(node) {
    if(!node) {
      return -1;
    }

    const leftHeight = this.height(node.left)
    const rightHeight = this.height(node.right)

    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(node) {
    let currentNode = this.root;
    let depth = 0;

    while(currentNode){
      if(node.value < currentNode.value){
        currentNode = currentNode.left
        depth++;
      }else if(node.value > currentNode.value) {
        currentNode = currentNode.right
        depth++;
      }else{
        return depth
      }
    }

    return -1;
  }

  isBalanced() {
    const checkBalance = (node) => {
      if (!node) {
          return 0;
      }

      const leftHeight = checkBalance(node.left);
      if (leftHeight === -1) return -1;

      const rightHeight = checkBalance(node.right);
      if (rightHeight === -1) return -1;

      if (Math.abs(leftHeight - rightHeight) > 1) {
          return -1;
      }

      return Math.max(leftHeight, rightHeight) + 1; 
  }

  return checkBalance(this.root) !== -1;
  }

  rebalanced() {
    const value = [];
    this.inOrder(node => {
      value.push(node.value)
    })

    this.root = this.buildTree(value)
  }
}

function generateRandomNumbers(size) {
  const numbers = [];
  for (let i = 0; i < size; i++) {
      numbers.push(Math.floor(Math.random() * 100));
  }
  return numbers;
}

const randomNumbers = generateRandomNumbers(10);
const bst = new Tree(randomNumbers);

console.log("Random Numbers:", randomNumbers);
console.log("Initial Tree (Level Order):");
bst.prettyPrint();

console.log("Is the tree balanced?", bst.isBalanced());

console.log("Level Order:");
bst.levelOrder(node => console.log(node.value));

console.log("Pre Order:");
bst.preOrder(node => console.log(node.value));

console.log("Post Order:");
bst.postOrder(node => console.log(node.value));

console.log("In Order:");
bst.inOrder(node => console.log(node.value));

const unbalancedNumbers = [101, 102, 103, 104, 105];
unbalancedNumbers.forEach(num => bst.insert(num));

console.log("Tree after adding numbers > 100 (Level Order):");
bst.prettyPrint();

console.log("Is the tree balanced after adding numbers > 100?", bst.isBalanced());

bst.rebalanced();
console.log("Tree after rebalancing (Level Order):");
bst.prettyPrint();

console.log("Is the tree balanced after rebalancing?", bst.isBalanced());

console.log("Level Order after rebalancing:");
bst.levelOrder(node => console.log(node.value));

console.log("Pre Order after rebalancing:");
bst.preOrder(node => console.log(node.value));

console.log("Post Order after rebalancing:");
bst.postOrder(node => console.log(node.value));

console.log("In Order after rebalancing:");
bst.inOrder(node => console.log(node.value));