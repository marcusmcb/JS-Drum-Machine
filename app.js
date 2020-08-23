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
  var command = message.data[0];
  var note = message.data[1];
  var velocity = message.data.length > 2 ? message.data[2] : 0; // a velocity value might not be included with a noteOff command
  switch (command) {
    case 144: // noteOn
      if (velocity > 0) {
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

// triggers audio element on MIDI message
function noteOn(note, velocity) {
  console.log(`Note: ${note} | Velocity: ${velocity}`);  
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

// dummy noteOff function
function noteOff(note) {
  console.log("Note off")
}

// TO-DO:
//
// * this will all need to go in a function or two
// * possible separate folder/file for controller value arrays
//
// a) create arrays from the range of possible MIDI input values for each controller

// 1) determine MIDI input device
// 2) load array for corresponding device
// 3) compare MIDI note value to array
// 4) trigger audio element sound on match

// converts MIDI note value to data-key value
function convertNote(note) {
  // input MIDI note values 36-51 for Arturia Beatstep  
  if (note === 36) {
    let note = 65;
    console.log(`Converted Note: ${note}`);
    return note;
  } else if (note === 37) {
    let note = 83;
    console.log(`Converted Note: ${note}`);
    return note;
  } else if (note === 38) {
    let note = 68;
    console.log(`Converted Note: ${note}`);
    return note;
  } else if (note === 39) {
    let note = 70;
    console.log(`Converted Note: ${note}`);
    return note;
  } else if (note === 40) {
    let note = 71;
    console.log(`Converted Note: ${note}`);
    return note;
  } else if (note === 41) {
    let note = 72;
    console.log(`Converted Note: ${note}`);
    return note;
  } else if (note === 42) {
    let note = 74;
    console.log(`Converted Note: ${note}`);
    return note;
  } else if (note === 43) {
    let note = 75;
    console.log(`Converted Note: ${note}`);
    return note;
  } else if (note === 44) {
    let note = 76;
    console.log(`Converted Note: ${note}`);
    return note;
  } else {
    console.log("Sorry, no sample for that note!")
    return;
  }
}