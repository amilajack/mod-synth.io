/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import audio.components.Component
class NoiseGenerator extends Component {
  static initClass() {
    this.property("type", {
      get() {
        return this.parameters.type;
      },
      set(value) {
        if (this.parameters.type === value) {
          return this.parameters.type;
        }

        this.parameters.type = value;

        switch (this.parameters.type) {
          case Audio.NOISE_TYPE[AppData.NOISE_TYPE.PINK]:
            this.buffer = this.getPink();
            break;
          case Audio.NOISE_TYPE[AppData.NOISE_TYPE.BROWN]:
            this.buffer = this.getBrown();
            break;
          default:
            this.buffer = this.getWhite();
        }

        this.destroy();
        this.create();
        return this.parameters.type;
      }
    });
  }

  constructor(data) {
    {
      // Hack: trick Babel/TypeScript into allowing this before super.
      if (false) {
        super();
      }
      let thisFn = (() => {
        this;
      }).toString();
      let thisName = thisFn
        .slice(thisFn.indexOf("{") + 1, thisFn.indexOf(";"))
        .trim();
      eval(`${thisName} = this;`);
    }
    this.onSettingsChange = this.onSettingsChange.bind(this);
    super(data);

    this.parameters.type = Audio.NOISE_TYPE[data.settings.noise_type];

    this.envelope = Audio.CONTEXT.createGain();
    this.envelope.gain.value = 0.0;
    this.envelope.connect(this.pre);

    this.buffer = this.getWhite();
    this.create();

    App.SETTINGS_CHANGE.add(this.onSettingsChange);
  }

  destroy() {
    this.generator.stop(0);
    this.output.gain.value = 0.0;
    this.generator = null;
    return null;
  }

  create() {
    this.generator = Audio.CONTEXT.createBufferSource();
    this.generator.buffer = this.buffer;
    this.generator.loop = true;
    this.generator.start(0);
    this.generator.connect(this.envelope);
    return null;
  }

  onSettingsChange(event) {
    if (event.component === this.component_session_uid) {
      this.type =
        Audio.NOISE_TYPE[
          Session.SETTINGS[this.component_session_uid].settings.noise_type
        ];
      this.setVolume(
        MathUtils.map(
          Session.SETTINGS[this.component_session_uid].settings.volume,
          -60,
          0,
          0,
          1
        )
      );
    }
    return null;
  }

  start(frequency) {
    this.checkAUX();

    const now = Audio.CONTEXT.currentTime;
    const envAttackEnd = now + this.attack / 1000.0;

    this.active.push(frequency);

    this.envelope.attackStart = now;
    this.envelope.attackEnd = envAttackEnd;
    this.envelope.gain.cancelScheduledValues(now);
    this.envelope.gain.setValueAtTime(0.0, now);
    if (Session.SETTINGS[this.component_session_uid].settings.mute === false) {
      this.envelope.gain.linearRampToValueAtTime(1.0, envAttackEnd);
      this.envelope.gain.setTargetAtTime(
        this.sustain * 1.0 / 100.0,
        envAttackEnd,
        this.decay / 1000.0 + 0.001
      );
    }
    return null;
  }

  stop(frequency) {
    const index = this.active.indexOf(frequency);

    if (index !== -1) {
      this.checkAUX();
      this.active.splice(index, 1);

      const now = Audio.CONTEXT.currentTime;
      const release = now + this.release / 1000.0;

      if (this.active.length === 0) {
        let rampValue = this.getRampValue(
          0,
          1,
          this.envelope.attackStart,
          this.envelope.attackEnd,
          now
        );
        if (
          Session.SETTINGS[this.component_session_uid].settings.mute === true
        ) {
          rampValue = 0;
        }
        this.envelope.gain.cancelScheduledValues(now);
        this.envelope.gain.setValueAtTime(rampValue, now);
        this.envelope.gain.linearRampToValueAtTime(0, release);
      }
    }
    return null;
  }

  getWhite() {
    const bufferSize = 2 * Audio.CONTEXT.sampleRate;
    const buffer = Audio.CONTEXT.createBuffer(
      1,
      bufferSize,
      Audio.CONTEXT.sampleRate
    );
    const output = buffer.getChannelData(0);
    for (
      let i = 0, end = bufferSize, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      const white = Math.random() * 2 - 1;
      output[i] = white;
    }
    return buffer;
  }

  getPink() {
    let b1, b2, b3, b4, b5, b6;
    let b0 = (b1 = b2 = b3 = b4 = b5 = b6 = 0.0);
    const bufferSize = 2 * Audio.CONTEXT.sampleRate;
    const buffer = Audio.CONTEXT.createBuffer(
      1,
      bufferSize,
      Audio.CONTEXT.sampleRate
    );
    const output = buffer.getChannelData(0);
    for (
      let i = 0, end = bufferSize, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      const white = Math.random() * 1 - 0.5;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;

      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  getBrown() {
    let lastOut = 0.0;
    const bufferSize = 2 * Audio.CONTEXT.sampleRate;
    const buffer = Audio.CONTEXT.createBuffer(
      1,
      bufferSize,
      Audio.CONTEXT.sampleRate
    );
    const output = buffer.getChannelData(0);
    for (
      let i = 0, end = bufferSize, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      const white = Math.random() * 1 - 0.5;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }
    return buffer;
  }
}
NoiseGenerator.initClass();
