import './style.css'

document.querySelector('#app').innerHTML = `
  <h1>Text Recognition</h1>
  <video width="400" height="300"></video>
  <p>click on window to take picture</p> 
  <button>Switch Camera</button>
  <pre id="result"></pre>
`

const video = document.querySelector('video')
const result = document.querySelector('#result')


import { createWorker } from 'tesseract.js'
const worker = createWorker()
async function setup() {
  await worker.load()
  await worker.loadLanguage('eng')
  await worker.initialize('eng')

  //check if the browser has the camera
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, muted: true })
    video.srcObject = stream
    video.play()

    // take a picture on any click event
    window.addEventListener('click', async (e) => {
      console.log(e)
      if (e.key == 32) {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        const { data: { text } } = await worker.recognize(canvas)
        console.log(text)
        result.textContent = text

        // Read the text from the image
        let utterance = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' '))
        // Set the voice
        utterance.voice = speechSynthesis.getVoices().filter(voice => voice.name === 'Google UK English(Enhanced)')[0]
        // Set pitch and rate
        utterance.rate = 0.7
        // Set volume
        utterance.volume = 2
        // Queue this utterance
        speechSynthesis.speak(utterance)

      }
    })

  } catch (err) {
    alert('No camera detected')
  }
}
setup()
