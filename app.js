// click handler to determine active drum kit
$(document).ready(function() {
    $('button').on('click', function() {
      $('button').removeClass('active');
      $(this).addClass('active');
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
    
  }

  const keys = Array.from(document.querySelectorAll(".key"));
  keys.forEach((key) =>
    key.addEventListener("transitionend", removeTransition)
  );
  window.addEventListener("keydown", playSound);