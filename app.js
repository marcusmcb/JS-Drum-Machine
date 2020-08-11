// test code to pull text value from span element
// let testvar = document.querySelector("span.sound").innerHTML
// console.log(testvar)

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

// function to trigger individual sounds
function playSound(e) {
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
  if (!audio) return;
  key.classList.add("playing");
  audio.currentTime = 0;
  audio.play();
}

const keys = Array.from(document.querySelectorAll(".key"));
keys.forEach((key) => key.addEventListener("transitionend", removeTransition));
window.addEventListener("keydown", playSound);

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

// code for potential MIDI capability

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
  console.log(midiAccess);
  var inputs = midiAccess.inputs;
  var outputs = midiAccess.outputs;
}

function onMIDIFailure() {
  console.log("Could not access your MIDI device.");
}

function onMIDISuccess(midiAccess) {
  for (var input of midiAccess.inputs.values())
    input.onmidimessage = getMIDIMessage;
}

function noteOn(note, velocity) {
  console.log(`Note: ${note} | Velocity: ${velocity}`);
  let newNote = convertNote(note);
  console.log(`Return Value: ${newNote}`);
  let temp = "data-key-";
  let newString = temp.concat(newNote);
  console.log(newString);
  let audio = document.getElementById(newString);
  let key = document.getElementById(newNote);
  console.log(audio);
  console.log(key);
  if (!audio) return;
  key.classList.add("playing");
  audio.currentTime = 0;
  audio.play();
  return;
}

function noteOff(note) {}

function convertNote(note) {
  // note = noteFromMIDI;
  if (note === 36) {
    let note = 65;
    console.log(`ConvertNote: ${note}`);
    return note;
  } else if (note === 37) {
    let note = 83;
    console.log(`ConvertNote: ${note}`);
    return note;
  } else if (note === 38) {
    let note = 68;
    return note;
  } else {
    return;
  }
}

function getMIDIMessage(message) {
  console.log(message.data);
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
  // playMIDINote(note, velocity);
  // input MIDI note values 36-51 for Arturia Beatstep
}

// function playMIDINote(note, velocity) {
//   console.log(`Note: ${note} | Velocity: ${velocity}`)
//   if (note === 36) {
//     note = 65
//     let audio = document.getElementById("data-key-65")
//     let key = document.getElementById("65")
//     console.log(audio)
//     console.log(key)
//     if (!audio) return;
//     key.classList.add("playing")
//     audio.currentTime = 0;
//     audio.play();
//   } else {
//     return;
//   }
// figure out how to compare the MIDI note & the audio/key value dynamically

// create an array of key values for audio elements to check MIDI note against

// what's above will work but will need to be implemented for each key/note value pair, leading to duplicate/unnecessary code
