import { useState } from 'react'
import './App.css'
import axios from 'axios'
import Register from './pages/register'

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true

function App() {
  const [value, setValue] = useState('')

  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    axios.get('')
  }

  return (
    <>
      <h1>Test</h1>\
      <Register />
      {/* <form onSubmit={send}>
        <input type="text" placeholder="Type something..." onChange = {(e) => { setValue(e.target.value) }}/>
        <button type="submit">Submit</button>
      </form> */}
    </>
  )
}

export default App
