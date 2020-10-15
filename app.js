import { setVelocity } from './modules/velocities.js'

// global array of DOM audio element key values (QWERTY playback)
let midiConvertedValues = [65, 83, 68, 70, 71, 72, 74, 75, 76]

// global MIDI vars (set later)
let midiInputValues
let tempMIDIDevice
let kitBPaths = []

// async function fetchItem() {
//   // fetch requests
//   let response = await fetch(
//     'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/boom.wav'
//   )
//   let response1 = await fetch(
//     'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/clap.wav'
//   )
//   let response2 = await fetch(
//     'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/snare.wav'
//   )

//   console.log(response.statusText)
//   if (response.status === 200) {
//     // dummy array
//     let array = []
//     // push urls to array
//     array.push(response.url, response1.url, response2.url)
//     // loop array and match to audio element in html
//     //
//     console.log(`PATH ARRAY: ${array}`)
//     console.log(response)
//     let url = response.url
//     printURL(url)
//   } else {
//     console.log(response.status)
//   }
// }

// function printURL(url) {
//   let newSound = document.getElementById('testAudio')
//   newSound.src = url
//   // console.log(`New sound: ${newSound.src}`)
//   playAudio(newSound)
// }

// function playAudio(newSound) {
//   newSound.currentTime = 0
//   newSound.play()
// }

// fetchItem()

// *** click handlers ***

// click handler to select drum kit
$(document).ready(function () {
  $('.kit').on('click', function () {
    $('.kit').removeClass('active')
    $(this).addClass('active')
    changeKit()
    loadKit()
  })
})

// click handler to toggle velocity sensitivity
$(document).ready(function () {
  $('.velocity').on('click', function () {
    if ($(this).text() == 'Velocity On') {
      $(this).text('Velocity Off')
      $('.velocity').removeClass('active')
      console.log('Velocity OFF')
    } else {
      $(this).text('Velocity On')
      $('.velocity').addClass('active')
      console.log('Velocity ON')
    }
  })
})

// click handler for mouse playback
$(document).ready(function () {
  $('.key').on('click', function () {
    playSound(this.id)
  })
})

$(document).ready(function () {
  $('.key').on('touchstart', function () {
    playSound(this.id)
  })
})

// *** code for QWERTY playback ***

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
  console.log(activeKit)
  let regex = /kit_\w/gi
  let audioElements = document.querySelectorAll('source')

  // code to pull current pad name values from DOM
  // let audioTags = document.querySelectorAll('.sound')
  // for (let i = 0; i < audioTags.length; i++) {
  //   console.log(audioTags[i].innerHTML)
  // }
  if (activeKit === 'kit_b') {
    const urls = [
      'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/kick.wav',
      'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/hihat.wav',
      'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/clap.wav',
      'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/openhat.wav',
      'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/boom.wav',
      'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/ride.wav',
      'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/snare.wav',
      'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/tom.wav',
      'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/tink.wav',
    ]

    for (let i = 0; i < audioElements.length; i++) {
      for (let j = 0; j < urls.length; j++) {
        if (audioElements[i].src != urls[j]) {
          audioElements[i].src = urls[i]
          console.log(audioElements[i].src)
        }       
      }
    }

    // Promise.all(
    //   urls.map((url) =>
    //     fetch(url, { mode: 'cors' })
    //       .then((response) => response)
    //       .then((data) => {
    //         // console.log(data.url)
    //         // kitBPaths.push(data.url)
    //         console.log(urls[1])            
    //         for (let i = 0; i < audioElements.length; i++) {              
    //           console.log(audioElements[i].src)
    //           for (let j = 0; j < urls.length; j++) {                
    //             audioElements[i].src = urls[j]
    //           }              
    //         }
    //       })
    //   )
    // )

    // need function or logic check to update DOM ***after*** kit_b is used to set source paths
    // will NOT need this function if all kits are hosted via S3
    // only needed during testing when kits are not all stored in the same place
    
    // console.log(kitBPaths)
    // updateKitB(audioElements, kitBPaths)    
  } else {
    for (let i = 0; i < audioElements.length; i++) {
      let currentSourcePath = audioElements[i].src
      // console.log(`CSP - ${currentSourcePath}`)
      let newSourcePath = currentSourcePath.replace(regex, activeKit)
      audioElements[i].src = newSourcePath

      // logger to pull pad name from source path for dynamic update (future UI)
      // console.log(newSourcePath.split(`${activeKit}/`)[1].split('.')[0])
      // audioElements[i].src = audioElements[i].src.split("-Machine/")[1];
    }
  }
}

function updateKitB(audioElements, kitBPaths) {
  console.log("WORKED")
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

// *** code for MIDI playback and device config ***

// boilerplate MIDI setup
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
  let deviceName = message.currentTarget.name
  let command = message.data[0]
  let note = message.data[1]
  // check to see if velocity value is present in message (it may not be for certain devices)
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
    case 'Arturia BeatStep':
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
  if (velocityStatus.classList[1] === 'active') {
    // init audio playback volume to 0, run function to set volume based on input velocity
    audio.volume = 0
    setVelocity(velocity, audio)
  } else {
    // init audio playback to full volume if velocity setting is off
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
