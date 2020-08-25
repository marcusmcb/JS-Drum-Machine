// defines "keyboard" for QWERTY playback
const keys = Array.from(document.querySelectorAll(".key"));
keys.forEach((key) => key.addEventListener("transitionend", removeTransition));
window.addEventListener("keydown", playSound);

// click handler to determine active drum kit
$(document).ready(function () {
  $(".kit").on("click", function () {
    $(".kit").removeClass("active");
    $(this).addClass("active");
    changeKit();
    loadKit();
  });
});

// css function for transition element
function removeTransition(e) {
  if (e.propertyName !== "transform") return;
  e.target.classList.remove("playing");
}

// function to trigger individual sounds via QWERTY
function playSound(e) {
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
  if (!audio) return;
  key.classList.add("playing");
  audio.currentTime = 0;
  audio.play();
}

// function to swap kits on button click
function changeKit() {
  let activeKit = document.querySelector(".active").id;
  let regex = /kit_\w/gi;
  let audioElements = document.querySelectorAll("source");
  for (i = 0; i < audioElements.length; i++) {
    // console.log(audioElements[i])
    let currentSourcePath = audioElements[i].src;
    let newSourcePath = currentSourcePath.replace(regex, activeKit);
    audioElements[i].src = newSourcePath;
    audioElements[i].src = audioElements[i].src.split("-Machine/")[1];
  }
}

// function to load currently selected kit
function loadKit() {
  let kit = document.querySelectorAll("audio");
  for (i = 0; i < kit.length; i++) {
    kit[i].load();
  }
  let activeKit = document.querySelector(".active");
  console.log(`${activeKit.innerHTML} successfully loaded.`);
}

// boilerplate MIDI setup
navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

// defines MIDI I/O
function onMIDISuccess(midiAccess) {
  var inputs = midiAccess.inputs;
  var outputs = midiAccess.outputs;
}

// if MIDI connectivity is unsuccessful
function onMIDIFailure() {
  console.log("Could not access your MIDI device.");
}

// grabs messages from device on successful MIDI connection
function onMIDISuccess(midiAccess) {
  for (var input of midiAccess.inputs.values())
    input.onmidimessage = getMIDIMessage;
}

// MIDI event listener for noteOn/noteOff events
function getMIDIMessage(message) {
  // logger to show MIDI device name
  console.log(message.currentTarget.name);
  var deviceName = message.currentTarget.name;
  var command = message.data[0];
  var note = message.data[1];
  var velocity = message.data.length > 2 ? message.data[2] : 0; // a velocity value might not be included with a noteOff command
  switch (command) {
    case 144: // noteOn
      if (velocity > 0) {
        // set global control device here?
        // setControlDevice(deviceName);
        noteOn(note, velocity);
      } else {
        noteOff(note);
      }
      break;
    case 128: // noteOff
      noteOff(note);
      break;
  }
}

// function setControlDevice(deviceName) {
//   switch (deviceName) {
//     case "Arturia Beatstep":
//       const beatStepValues = [36, 37, 38, 39, 40, 41, 42, 43, 44];
//       const convertedBeatStepValues = [65, 83, 68, 70, 71, 72, 74, 75, 76];
//       return beatStepValues, convertedBeatStepValues;
//       break;
//   }
// }

// triggers audio element on MIDI message
function noteOn(note, velocity) {
  // console.log(`Note: ${note} | Velocity: ${velocity}`);
  let newNote = convertNote(note);
  let temp = "data-key-";
  let newString = temp.concat(newNote);
  let audio = document.getElementById(newString);
  let key = document.getElementById(newNote);
  if (!audio) return;
  key.classList.add("playing");
  audio.currentTime = 0;
  audio.play();
  return;
}

function noteOff(note) {
  console.log("Note off");
}

// converts MIDI note value to data-key value
function convertNote(note) {
  const beatStepValues = [36, 37, 38, 39, 40, 41, 42, 43, 44];
  const convertedBeatStepValues = [65, 83, 68, 70, 71, 72, 74, 75, 76];
  for (i = 0; i < beatStepValues.length; i++) {
    for (j = 0; j < convertedBeatStepValues.length; j++)
      if (note === beatStepValues[i]) {
        note = convertedBeatStepValues[i];
        console.log(`Converted Note: ${note}`);
      }
  }
  return note;
}

// set convertedMIDIValues array as global variable since each device will trigger the same DOM elements
//
// set MIDI device in getMIDIMessage function
//  a) do a null check to trigger remaining code and load assets if so
//  b) if not, bypass unnecessary code (reloading assets, etc)
//  c) do a check to see if device has changed, proceed as necessary thereafter
//  
// set MIDI device as primary, add code to ignore message from any other connected MIDI devices
//
// check for set device at the start of noteOn function
//
// from that, return the MIDI values array for that device to noteOn function
//
// compare note received to MIDI values array
//  a) if matched, loop through array and trigger corresponding DOM element
//  b) if not, display error (future UI task)
// 
