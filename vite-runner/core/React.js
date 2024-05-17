// const el = {
//   type: "div",
//   props: {
//     id: "app",
//     children: []
//   }
// }
const TEXT_ELEMENT = "TEXT_ELEMENT"

function createTextNode(text) {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return ['number', "string"].includes(typeof child) ? createTextNode(child) : child
      })
    }
  }
}

let root = null
let nextFiber = null


function render(el, container) {
  nextFiber = {
    dom: container,
    props: {
      children: [el]
    }
  }

  root = nextFiber
}

function commitRoot() {
  commitFiber(root.child)
  root = null
}

function commitFiber(fiber) {
  if (!fiber) return

  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }

  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom)
  }
  commitFiber(fiber.child)
  commitFiber(fiber.sibling)
}


function workLoop(deadLine) {
  let shouldYield = false
  while (!shouldYield && nextFiber) {
    nextFiber = performFiber(nextFiber)
    shouldYield = deadLine.timeRemaining() < 1
  }

  if (!nextFiber && root) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

function createDom(type) {
  return type === TEXT_ELEMENT ?
    document.createTextNode("") :
    document.createElement(type)
}

function updateProps(dom, props) {
  Object.keys(props).forEach(key => {
    dom[key] = props[key]
  })
}

let prevFiber = null
function initFiber(fiber, children) {
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevFiber.sibling = newFiber
    }
    prevFiber = newFiber
  })
}

function performFiber(fiber) {
  const { children, ...props } = fiber.props;
  const isFunComp = typeof fiber.type === 'function'
  if (!isFunComp) {
    if (!fiber.dom) {
      //create dom 
      const dom = (fiber.dom = createDom(fiber.type))
      updateProps(dom, props)
    }
  }

  initFiber(fiber, isFunComp ? [fiber.type(fiber.props)] : fiber.props.children)

  if (fiber.child) {
    return fiber.child
  }
 
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return fiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

const React = {
  createElement,
  createTextNode,
  render
}
export default React