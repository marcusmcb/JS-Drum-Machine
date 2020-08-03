// click handler to determine active drum kit
// NOTE: this will apply to all future buttons added even if they're not kit selectors

$(document).ready(function() {
    $('button').on('click', function() {
      $('button').removeClass('active');
      $(this).addClass('active');

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
  keys.forEach((key) =>
    key.addEventListener("transitionend", removeTransition)
  );
  window.addEventListener("keydown", playSound);

  // tentative function to change drum kits
  function changeKit() {
    
    let activeKit = document.querySelector(".active")
    activeKit = activeKit.id
    console.log(activeKit)

    let soundkit = []
    let audioElements = document.querySelectorAll("source");    
    for (i = 0; i < audioElements.length; i++) {
      console.log(audioElements[i].src)
      soundkit.push(audioElements[i].src)        
    };
    console.log(soundkit)
    }



    // let clap = document.getElementById('clap')
    //  ^ one for each element in the kit
    //
    //  check to see which kit is marked active
    //
    // if kit a = active
    //    clap.src='sounds/kit_a/clap.wav'
    //    clap.load()
    //
    //  
    //  let soundkit = document.querySelectorAll("audio");
    //  for (i = 0; i < soundkit.length; i++) {
    //    console.log(soundkit.src)
    //
    //    check for active kit & change srcs in audio elements via string interpolation
    //  use on-click trigger function for each kit in HTML?
    //  
  