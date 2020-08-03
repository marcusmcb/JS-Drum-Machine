// click handler to determine active drum kit
// NOTE: this will apply to all future buttons added even if they're not kit selectors

$(document).ready(function () {
  $("button").on("click", function () {
    $("button").removeClass("active");
    $(this).addClass("active");

    // trigger corresponding kit change?
    changeKit();
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

// tentative function to change drum kits
function changeKit() {
  // grab "active" kit to use as var in string substitution
  let activeKit = document.querySelector(".active").id;
  console.log(activeKit);

  // regex to aid w/drum kit swap
  let regex = /kit_\w/gi;

  // find all source tags to update
  let audioElements = document.querySelectorAll("source");
  for (i = 0; i < audioElements.length; i++) {
    let currentSourcePath = audioElements[i].src;
    let newSourcePath = currentSourcePath.replace(regex, activeKit);
    console.log(newSourcePath)    
  }
}