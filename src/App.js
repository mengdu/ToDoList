import React from 'react'
import ToDo from './components/ToDo'
import { LocalStore } from './components/ToDo/store'
import WebsiteFooter from './components/website-footer'

const store = new LocalStore()

function App() {
  return (
    <div className="App main-container">
      <div className="todo-box">
        <h1 className="app-title">Task ToDo</h1>
        <ToDo store={store}/>
      </div>

      <WebsiteFooter />
    </div>
  )
}

export default App
