# JSP-1 | Javascript Sample Player

This is a sample player/drum machine app built with Javascript. 

It was developed using the base concept from one of the JavaScript30 tutorials on YouTube.

Differences from the original code include:

* HTML/CSS changes (to customize the look and layout of the app)
* MIDI input with selected devices
* additional JavaScript functionality for the user to change sound kits
* added JavaScript module to enable MIDI velocity sensitivity

### Link to the app:

https://marcusmcb.github.io/JS-Drum-Machine/

### Using the sampler (QWERTY):

Simply press the letters on your keyboard to trigger the corresponding sounds.

Use the kit buttons below the key row to swap kits that will change the playable drum sounds.

### Using the sampler (MIDI):

Connect your MIDI device to your laptop/desktop and then refresh the app in your browser.

<u>Supported devices:</u>

* Maschine MK3: use pads 1-9 to trigger sounds (press Shift + Channel to set the device to MIDI mode after boot up)
* Novation Launchkey MK3 (Mini & Full-Size): use launch pads 1-9 (lower row + upper row, far left) to trigger sounds
* Native Instruments M32: use the first nine white keys starting from the left to play sounds (using the default MIDI mode on boot up)
* Arturia BeatStep: use the front pad row to play sounds (no other set up needed!)
* M-Audio Keystation 49es: use C2-D3 (white keys) to play sounds
* Akai MPK Mini Mk3: use BANK A on the pads to play sounds (9th sample unavailable at the moment)

### Velocity Sensitivity

Velocity is enabled by default after the page loads when using JSP-1 with a MIDI control device (unless the device does not send velocity data).  Use the button to toggle velocity sensitivity on/off.

Velocity values were calculated simply by splitting the volume range for each audio element (0-1) into increments for each possible velocity within the MIDI specs (1-127). 

### Browser Compatibility:

All features/functions and MIDI devices tested are verified as working in Chrome and Firefox.  CSS animations do not display w/MIDI control in Firefox at the moment (working properly for QWERTY playback).

### Touchscreen Compatibility:

There's none at the moment (browser-only) but it's something that I'm actively looking into.  


Enjoy!


favicon credit --> <a href="https://thenounproject.com/term/sampler/342625/" target="_blank">The Noun Project</a>

base concept --> <a href="https://www.youtube.com/watch?v=VuN8qwZoego" target="_blank">JavaScript30</a>
