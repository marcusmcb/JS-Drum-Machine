// click handler to determine active drum kit
$(document).ready(function() {
    $('button').on('click', function() {
      $('button').removeClass('active');
      $(this).addClass('active');
      // code for kit change goes here?
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
  function changeKit(e) {
    // let clap = document.getElementById('clap')
    //  ^ one for each element in the kit
    //
    //  check to see which kit is marked active
    //
    // if kit a = active
    //    clap.src='sounds/kit_a/clap.wav'
    //    clap.load()
    //
    //  could possibly use a for loop to add the sound folder dynamically via string interpolation
  }

  const keys = Array.from(document.querySelectorAll(".key"));
  keys.forEach((key) =>
    key.addEventListener("transitionend", removeTransition)
  );
  window.addEventListener("keydown", playSound);