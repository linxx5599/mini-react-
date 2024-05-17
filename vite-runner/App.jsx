import React from "./core/React.js"
import Comp from "./Comp.jsx"
function App() {
  return <div id="app">
    child2
    <Comp a={122} />
    <Comp a={222} />
  </div>
}
export default App