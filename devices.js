// function to set MIDI device & load corresponding input values (unique to most devices)
export function setMIDIDevice(deviceName) {
    switch (deviceName) {
      case "Keystation 49es":
        midiInputValues = [48, 50, 52, 53, 55, 57, 59, 60, 62];
        break;
      case "LKMK3 MIDI": // Launchkey MK3
      case "Launchkey Mini MK3":
        midiInputValues = [36, 37, 38, 39, 44, 45, 46, 47, 40];
        break;
      case "MPK mini 3": // Akai MPK Mini Mk3
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
    // logger to confirm MIDI device set
    console.log(`MIDI DEVICE SET: ${deviceName}`);
  }