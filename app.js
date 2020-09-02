// *** global variables ***

// global array of DOM audio element key values (QWERTY playback)
let midiConvertedValues = [65, 83, 68, 70, 71, 72, 74, 75, 76];

// global MIDI vars set later
let midiInputValues;
let tempMIDIDevice;

// *** code for QWERTY playback & click handlers ***

// defines "keyboard" for QWERTY playback
const keys = Array.from(document.querySelectorAll(".key"));
keys.forEach((key) => key.addEventListener("transitionend", removeTransition));
window.addEventListener("keydown", playSound);

// click handler to determine/select active drum kit
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
  // setup/logger to confirm active drum kit change
  let activeKit = document.querySelector(".active");
  console.log(`${activeKit.innerHTML} successfully loaded.`);
}

// *** code for MIDI playback and device config ***

// boilerplate MIDI setup
navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

// defines MIDI I/O
function onMIDISuccess(midiAccess) {
  let inputs = midiAccess.inputs;
  let outputs = midiAccess.outputs;
}

// if MIDI connectivity is unsuccessful
function onMIDIFailure() {
  console.log("Could not access your MIDI device.");
}

// grabs messages from device on successful MIDI connection
function onMIDISuccess(midiAccess) {
  for (let input of midiAccess.inputs.values())
    input.onmidimessage = getMIDIMessage;
}

// MIDI event listener for noteOn/noteOff events
function getMIDIMessage(message) {
  let deviceName = message.currentTarget.name;
  let command = message.data[0];
  let note = message.data[1];
  let velocity = message.data.length > 2 ? message.data[2] : 0; // a velocity value might not be included with a noteOff command
  switch (command) {
    case 144: // noteOn
    case 153: // noteOn for MPK drum pads
      if (velocity > 0) {
        noteOn(note, velocity, deviceName);
      } else {
        noteOff(note);
      }
      break;
    case 128: // noteOff
    case 137: // noteOff for MPK drum pads
      noteOff(note);
      break;
  }
}

// function to set MIDI device & load corresponding input values (unique to each device tested)
function setMIDIDevice(deviceName) {
  switch (deviceName) {
    case "Launchkey Mini MK3":
    case "Launchkey Mini":
    case "Keystation 49es":
      midiInputValues = [48, 50, 52, 53, 55, 57, 59, 60, 62];
      break;
    case "MPK mini 3":
      midiInputValues = [36, 37, 38, 39, 40, 41, 42, 43];
      break;
    case "Arturia BeatStep":
      midiInputValues = [36, 37, 38, 39, 40, 41, 42, 43, 44];
      break;
    case "KOMPLETE KONTROL M32 MIDI":
      midiInputValues = [41, 43, 45, 47, 48, 50, 52, 53, 55];
      break;
    case "Maschine MK3 Ctrl MIDI":
      midiInputValues = [12, 13, 14, 15, 16, 17, 18, 19, 20];
      break;
    default:
      console.log("No MIDI map found for your device!");
  }
  console.log(`MIDI DEVICE SET: ${deviceName}`);
}

// triggers audio element on MIDI message
function noteOn(note, velocity, deviceName) {
  const t0 = performance.now();
  console.log(`Note: ${note} | Velocity: ${velocity}`);
  // check if MIDI device is currently set; if not, set it
  if (tempMIDIDevice != deviceName) {
    tempMIDIDevice = deviceName;
    setMIDIDevice(deviceName);
  }
  // convert input note, set props & play audio via MIDI
  let newNote = convertNote(note, midiInputValues);
  let temp = "data-key-";
  let newString = temp.concat(newNote);
  let audio = document.getElementById(newString);
  let key = document.getElementById(newNote);
  // check to see if key/pad played is out of MIDI input range
  if (key === null) {
    console.log("No sample found for that key/pad");
  } else {
    setVelocity(velocity, audio);
    key.classList.add("playing");
    audio.currentTime = 0;
    audio.play();
    const t1 = performance.now();
    console.log(`Latency: ${(t1 - t0).toFixed(2)} ms`);
    return;
  }
}

function setVelocity(velocity, audio) {
  console.log(`SET VELOCITY START: ${velocity}`)
  if (velocity < 50) {
    audio.volume = 0.1;
    console.log("WORKED")
  } else {
    audio.volume = 1.0;
  }
}

function noteOff(note) {
  // console.log("Note off");
}

// converts MIDI note value to data-key value
function convertNote(note) {
  for (i = 0; i < midiInputValues.length; i++) {
    for (j = 0; j < midiConvertedValues.length; j++)
      if (note === midiInputValues[i]) {
        note = midiConvertedValues[i];
        console.log(`Converted Note: ${note}`);
      }
  }
  return note;
}

// dynamically update "pad" names on kit load (future UI)
// dynamically update "pad" assignments based on device connected (future UI)
//
// add LED meters to playback (future UI)
//  a) use git repo found and customize:
//    1) meter div
//    2) trigger LED function on keydown (QWERTY) or message (MIDI)
//  b) single-side, reskin overall UI (MPC/Maschine look?)
//
//  add velocity sensitivity to sample playback (future logic integration)
//    1) set playback volume relative to velocity input
//    2) scale velocity & playback values, use loops to match as done with MIDI input?
