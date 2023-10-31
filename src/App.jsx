import { useState } from 'react'
import './App.css'

const App = () => {
  const [youtubeLink, setYoutubeLink] = useState('')
  const [userName, setUserName] = useState('')
  const buttonLabel = 'Download Audio'

  const runScript = async () => {
    const requestData = { youtubeLink, user: userName }

    try {
      const response = await fetch('http://localhost:5000/download-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error('Failed to download audio')
      }

      await response.json()
      // Handle the response data as needed
    } catch (error) {
      console.error('Error executing script:', error)
      // Handle the error condition
    }
  }

  return (
    <div className='container'>
      <h1>Youtube Music Downloader</h1>
      <p className='read-the-docs'>Copy the YouTube Music link here</p>
      <input
        className='input-label'
        placeholder='Insert YouTube Music Url'
        type='text'
        name='value'
        value={youtubeLink}
        onChange={(e) => setYoutubeLink(e.target.value)}
      />
      <input
        className='input-label'
        placeholder='Your Name'
        type='text'
        name='userName'
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <div className='standard-button' onClick={runScript}>
        <div className='label'>{buttonLabel}</div>
      </div>
    </div>
  )
}

export default App
