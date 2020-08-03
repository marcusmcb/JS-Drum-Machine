// click handler to determine active drum kit
// NOTE: this will apply to all future buttons added even if they're not kit selectors

$(document).ready(function () {
  $("button").on("click", function () {
    $("button").removeClass("active");
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

function changeKit() {
  let activeKit = document.querySelector(".active").id;  
  let regex = /kit_\w/gi;
  let audioElements = document.querySelectorAll("source");
  for (i = 0; i < audioElements.length; i++) {    
    let currentSourcePath = audioElements[i].src;
    let newSourcePath = currentSourcePath.replace(regex, activeKit);
    audioElements[i].src = newSourcePath;
    audioElements[i].src = audioElements[i].src.split("-Machine/")[1]    
    console.log(newSourcePath, audioElements[i]);
  }
}

function loadKit() {
  let kit = document.querySelectorAll("audio");
    for (i = 0; i < kit.length; i++) {      
      kit[i].load()
    }
}