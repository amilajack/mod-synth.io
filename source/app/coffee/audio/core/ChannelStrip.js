/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// TODO: http://stackoverflow.com/questions/20287890/audiocontext-panning-audio-of-playing-media
class ChannelStrip {
  constructor() {
    // channel strip output
    this.output = Audio.CONTEXT.createGain();
    this.output.gain.value = 0.4;

    // channel strip input
    this.input = Audio.CONTEXT.createGain();
    this.input.connect(this.output);
  }
  // @setVolume 0.8

  setVolume(value, linear) {
    if (linear == null) {
      linear = false;
    }
    let volume = value;

    if (!linear) {
      volume = Math.pow(volume / 1, 2);
    }

    if (this.input) {
      this.input.gain.value = volume;
    }
    return null;
  }

  connect(otherDeviceInput) {
    this.output.connect(otherDeviceInput);
    return null;
  }

  disconnect() {
    this.output.disconnect();
    return null;
  }
}
