import './style.css'

document.querySelector('#app').innerHTML = `
  <h1>Text Recognition</h1>
  <video width="400" height="300"></video>
  <p>press <kbd>space</kbd> to take a picture</p>
  <pre id="result"></pre>
`

const video = document.querySelector('video')
const result = document.querySelector('#result')

import { createWorker } from 'tesseract.js'
const worker = createWorker({ logger: m => console.log(m) })
  (async () => {
    await worker.load()
    await worker.loadLanguage('eng')
    await worker.initialize('eng')

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, muted: true })
    video.srcObject = stream
    video.play()

    window.addEventListener('keydown', async (e) => {
      if (e.key == 32) {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        const { data: { text } } = await worker.recognize(canvas)
        console.log(text)
        result.textContent = text
      }
    })

  })
