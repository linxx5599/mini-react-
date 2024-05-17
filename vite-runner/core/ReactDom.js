import React from "./React.js"

export default {
  createRoot(container) {
    return {
      render(App) {
        React.render(App, container)
      }
    }
  }
}