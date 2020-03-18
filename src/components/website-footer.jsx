import React from 'react'
import pkg from '../../package.json'

export default function WebsiteFooter () {
  return (
    <div className="website-footer">
      <p className="copyright">
        <span>Make by <a href="https://github.com/mengdu" target="_blank" rel="noopener noreferrer">Lanyue</a> &copy; 2020</span>，
        <span><a href="https://github.com/mengdu/ToDoList">Github</a></span>，
        <span>v{pkg.version}</span>
      </p>
      <p align="center">
        <img src="/logo.png" alt="logo" width="32" height="32" title="Todo Manager"/>
      </p>
    </div>
  )
}
