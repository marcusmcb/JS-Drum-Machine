// click handler to determine active drum kit
$(document).ready(function() {
    $('button').on('click', function() {
      $('button').removeClass('active');
      $(this).addClass('active');

      // trigger corresponding kit change
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

  // tentative function to change drum kits
  function changeKit() {
    let soundkit = []
    let audioElement = document.querySelectorAll("audio");    
    for (i = 0; i < audioElement.length; i++) {
      console.log(audioElement)        
    };
    
    // possibly use a for-each statement instead
    //
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
    // }
    //  
  }

  const keys = Array.from(document.querySelectorAll(".key"));
  keys.forEach((key) =>
    key.addEventListener("transitionend", removeTransition)
  );
  window.addEventListener("keydown", playSound);