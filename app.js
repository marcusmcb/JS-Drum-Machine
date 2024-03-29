// function to scale MIDI velocity values to playback volume
import { setVelocity } from './modules/velocities.js'

// global array of DOM audio element key values (QWERTY playback)
let midiConvertedValues = [65, 83, 68, 70, 71, 72, 74, 75, 76]

// global MIDI vars (set later)
let midiInputValues
let tempMIDIDevice

// handler to select drum kit
export function setActiveKit(e) {
  if (e.target.className === 'kits') {
    return
  } else {
    let getKits = document.querySelectorAll('.active')
    getKits.forEach((kit) => {
      kit.classList.remove('active')
    })
    e.target.className += ' active'
  }
  changeKit()
  loadKit()
}

// handler to toggle velocity on/off
export function toggleVelocity() {  
  if (this.innerHTML != 'velocity on') {
    this.classList.toggle('velo-active')
    this.innerHTML = 'velocity on'
  } else {
    this.classList.toggle('velo-active')
    this.innerHTML = 'velocity off'
  }
}

// global event listener for click playback
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('key')) {
      playSound(e.target.id)
    } else if (e.target.tagName === 'KBD') {
      playSound(e.target.parentNode.id)      
    } else {
      return
    }
  })
})

// global event listener for touch/tap playback
// future dev - rewrite as pure JS
$(document).ready(function () {
  $('.key').on('touchstart', function () {    
    playSound(this.id)
  })
})

// **************************************
// ****** code for QWERTY playback ******
// **************************************

// defines "keyboard" for QWERTY playback
const keys = Array.from(document.querySelectorAll('.key'))
keys.forEach((key) => key.addEventListener('transitionend', removeTransition))
window.addEventListener('keydown', playSound)

// css function for transition element
function removeTransition(e) {
  if (e.propertyName !== 'transform') return
  e.target.classList.remove('playing')
}

// function to trigger individual sounds via QWERTY
function playSound(e) {
  let audio, key
  // determines input type (key or click) and assigns values to DOM elements accordingly
  // needs additional code to prevent spamming of individual keys but preserves playback polyphony
  if (e.type === 'keydown') {
    audio = document.querySelector(`audio[data-key="${e.keyCode}"]`)
    key = document.querySelector(`div[data-key="${e.keyCode}"]`)
  } else {
    audio = document.querySelector(`audio[data-key="${e}"]`)
    key = document.querySelector(`div[data-key="${e}"]`)
  }
  if (!audio) return
  key.classList.add('playing')
  audio.volume = 1
  audio.currentTime = 0
  audio.play()
}

// function to swap kits on button click
function changeKit() {
  let activeKit = document.querySelector('.active').id
  let regex = /kit_\w/gi
  let audioElements = document.querySelectorAll('source')
  for (let i = 0; i < audioElements.length; i++) {
    let currentSourcePath = audioElements[i].src
    let newSourcePath = currentSourcePath.replace(regex, activeKit)
    audioElements[i].src = newSourcePath
  }
}

// function to load currently selected kit
function loadKit() {
  let kit = document.querySelectorAll('audio')
  for (let i = 0; i < kit.length; i++) {
    kit[i].load()
  }
  // logger to confirm drum kit change
  console.log(
    `${document.querySelector('.active').innerHTML} successfully loaded.`
  )
}

// ******************************************************
// ****** code for MIDI playback and device config ******
// ******************************************************

// boilerplate MIDI setup
// requires HTTPS to access properly, will disable MIDI playback otherwise
navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure)

// defines MIDI I/O
function onMIDISuccess(midiAccess) {
  let inputs = midiAccess.inputs
  let outputs = midiAccess.outputs
  for (let input of midiAccess.inputs.values())
    input.onmidimessage = getMIDIMessage
}

// if MIDI connectivity is unsuccessful
function onMIDIFailure(message) {
  console.log('Could not access your MIDI device.')
  console.log('----------------------------------')
  console.log(`Error: ${message}`)
}

// MIDI event listener for noteOn/noteOff events
function getMIDIMessage(message) {
  console.log('MIDI Message: ', message)  
  let deviceName = message.currentTarget.name
  let command = message.data[0]
  let note = message.data[1]  
  let velocity = message.data.length > 2 ? message.data[2] : 0 
  switch (command) {
    case 144: // noteOn (general use)
    case 153: // noteOn for MPK drum pads
      if (velocity > 0) {
        noteOn(note, velocity, deviceName)
      } else {
        noteOff(note)
      }
      break
    case 128: // noteOff (general use)
    case 137: // noteOff for MPK drum pads
      noteOff(note)
      break
  }
}

// function to set MIDI device & load corresponding input values (unique to most devices)
// future dev - move to export module as additional device keymaps are added
function setMIDIDevice(deviceName) {
  switch (deviceName) {
    case 'Keystation 49es':
      midiInputValues = [48, 50, 52, 53, 55, 57, 59, 60, 62]
      break
    case 'LKMK3 MIDI': // Launchkey MK3
    case 'Launchkey Mini MK3':
      midiInputValues = [36, 37, 38, 39, 44, 45, 46, 47, 40]
      break
    case 'MPK mini 3': // Akai MPK Mini Mk3
      midiInputValues = [36, 37, 38, 39, 40, 41, 42, 43]
      break
    case 'Arturia BeatStep ':
      midiInputValues = [36, 37, 38, 39, 40, 41, 42, 43, 44]
      break
    case 'KOMPLETE KONTROL M32 MIDI':
      midiInputValues = [41, 43, 45, 47, 48, 50, 52, 53, 55]
      break
    case 'Maschine MK3 Ctrl MIDI':
      midiInputValues = [12, 13, 14, 15, 16, 17, 18, 19, 20]
      break
    default:
      console.log('No MIDI map found for your device!')
      break
  }
  // logger to confirm MIDI device set
  console.log(`MIDI DEVICE SET: ${deviceName}`)
}

// triggers audio element on MIDI note message/event
function noteOn(note, velocity, deviceName) {
  // performance code is here to measure playback latency on devices
  const t0 = performance.now()
  console.log('-------------------------------------')
  console.log(`NOTE: ${note}`)
  
  // check if MIDI device is currently set; if not, set it
  if (tempMIDIDevice != deviceName) {
    tempMIDIDevice = deviceName
    setMIDIDevice(deviceName)
  }

  // convert input note, set props & play audio via MIDI
  let newNote = convertNote(note, midiInputValues)

  // set vars to pass return values to audio elements in DOM
  let temp = 'data-key-'
  let newString = temp.concat(newNote)
  let audio = document.getElementById(newString)
  let key = document.getElementById(newNote)
  let velocityStatus = document.getElementById('velocity-btn')

  // check to see if key/pad played is out of MIDI input range for device
  if (key === null) {
    console.log('No sample found for that key/pad')
    return
  }

  // check current velocity setting & adjust playback volume accordingly
  if (velocityStatus.classList[1] === 'velo-active') {    
    audio.volume = 0
    setVelocity(velocity, audio)
  } else {    
    audio.volume = 1
  }

  key.classList.add('playing')
  audio.currentTime = 0
  audio.play()
  const t1 = performance.now()
  console.log(`Latency: ${(t1 - t0).toFixed(2)} ms`)
  return
}

function noteOff(note) {
  // console.log("Note off");
}

// converts MIDI note value to data-key value
function convertNote(note) {
  for (let i = 0; i < midiInputValues.length; i++) {
    for (let j = 0; j < midiConvertedValues.length; j++)
      if (note === midiInputValues[i]) {
        note = midiConvertedValues[i]
        console.log(`Converted Note Value: ${note}`)
      }
  }
  return note
}
