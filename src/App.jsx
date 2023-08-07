import { useState } from 'react'
import './App.css'

const App = () => {
  const FIREBASE_URL = `https://us-central1-music-downloader-982f7.cloudfunctions.net`
  const [youtubeLink, setYoutubeLink] = useState("")
  const buttonLabel = "Downloading file"
  const runScript = () => {
    console.log(youtubeLink)
    fetch(`https://us-central1-music-downloader-982f7.cloudfunctions.net/musicDownload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ youtubeLink }),
    })
      .then(response => response.text())
      .then(data => {
        console.log('Script execution response:', data)
        // Handle the response data as needed
      })
      .catch(error => {
        console.error('Error executing script:', error)
        // Handle the error condition
      })
  }
  return (
    <div className='container'>
      <h1>Youtube Music Downloader</h1>
      <p className="read-the-docs">
        copy the youtube music link here
      </p>
      <input
        className="input-label"
        placeholder={"Insert Youtube Music Url"}
        type="text"
        name='value'
        value={youtubeLink}
        onChange={(e) => {
          setYoutubeLink(e.target.value)
        }}
      />
      <div
        className="standard-button"
        onClick={runScript}>
        <div className="label">{buttonLabel}</div>
      </div>
    </div>
  )
}

export default App
