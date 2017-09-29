/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Component {
  constructor(data) {
    this.component_session_uid = data.component_session_uid;
    this.type_uid = data.type_uid;

    this.output = Audio.CONTEXT.createGain();

    // check if is audioCapable
    this.aux = Audio.CONTEXT.createGain();
    this.aux.gain.value = 1.0;
    this.aux.connect(this.output);

    // used to change stuff
    this.pre = Audio.CONTEXT.createGain();
    this.pre.gain.value = 1.0;
    this.pre.connect(this.aux);

    if (data.audioCapable) {
      this.attack = 0.0;
      this.decay = 0.0;
      this.sustain = 100.0;
      this.release = 0.0;

      this.ENV = null;
      this.PTG = null;
      this.LFO = null;
      this.FLT = null;
    }

    // specific device params
    this.parameters = {};

    // active notes on components who can create audio
    this.active = [];
  }

  connect(input) {
    if (input instanceof GainNode || input instanceof AudioDestinationNode) {
      this.output.connect(input);
    } else {
      this.disconnect();
      console.log("You can only connect to GainNode or AudioDestinationNode.");
    }
    return null;
  }

  disconnect() {
    this.output.disconnect();
    return null;
  }

  destroy() {
    this.disconnect();
    return null;
  }

  setVolume(value, linear) {
    if (linear == null) {
      linear = false;
    }
    let volume = value;

    if (!linear) {
      volume = Math.pow(value / 1, 2);
    }

    if (this.output) {
      this.output.gain.value = volume;
    }
    return null;
  }

  // returns current ramp value
  // useful when you call cancelScheduledValues() which destroys any ramp.
  getRampValue(start, end, fromTime, toTime, at) {
    const difference = end - start;
    const time = toTime - fromTime;
    const truncateTime = at - fromTime;
    const phase = truncateTime / time;
    let v = start + phase * difference;

    if (v <= start) {
      v = start;
    }
    if (v >= end) {
      v = end;
    }

    return v;
  }

  checkAUX() {
    // check for ENV
    if (
      this.ENV !== null &&
      Session.SETTINGS[this.ENV.component_session_uid].settings.bypass !== true
    ) {
      this.attack = this.ENV.parameters.attack;
      this.decay = this.ENV.parameters.decay;
      this.sustain = this.ENV.parameters.sustain;
      this.release = this.ENV.parameters.release;
    } else {
      this.attack = 0;
      this.decay = 0;
      this.sustain = 100;
      this.release = 0;
    }

    // check for LFO
    if (
      this.LFO !== null &&
      Session.SETTINGS[this.LFO.component_session_uid].settings.bypass !== true
    ) {
      this.LFO.aux.connect(this.aux.gain);
    } else {
      if (this.LFO) {
        this.LFO.aux.disconnect();
      }
    }

    // check for LFO
    if (
      this.FLT !== null &&
      Session.SETTINGS[this.FLT.component_session_uid].settings.bypass !== true
    ) {
      this.pre.disconnect();

      this.FLT.component.connect(this.aux);
      this.pre.connect(this.FLT.component);
    } else {
      if (this.FLT) {
        this.FLT.disconnect();
      }
      this.pre.disconnect();
      this.pre.connect(this.aux);
    }

    // check for PTG
    if (
      this.PTG !== null &&
      Session.SETTINGS[this.PTG.component_session_uid].settings.bypass !== true
    ) {
      this.PTG.aux = this.aux;
    } else {
      if (this.PTG) {
        this.PTG.disconnect();
      }
    }
    return null;
  }
}
