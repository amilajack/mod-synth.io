/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import audio.components.Component
class Oscillator extends Component {
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
        for (
          let i = 0, end = this.activeOscillators.length, asc = 0 <= end;
          asc ? i < end : i > end;
          asc ? i++ : i--
        ) {
          this.activeOscillators[i].type = this.parameters.type;
        }
        return this.parameters.type;
      }
    });

    this.property("detune", {
      get() {
        return this.parameters.detune;
      },
      set(value) {
        if (this.parameters.detune === value) {
          return this.parameters.detune;
        }
        this.parameters.detune = value;
        for (
          let i = 0, end = this.activeOscillators.length, asc = 0 <= end;
          asc ? i < end : i > end;
          asc ? i++ : i--
        ) {
          this.activeOscillators[i].detune.setValueAtTime(
            this.parameters.detune,
            0
          );
        }
        return this.parameters.detune;
      }
    });

    this.property("octave", {
      get() {
        return this.parameters.octave;
      },
      set(value) {
        if (this.parameters.octave === value) {
          return this.parameters.octave;
        }
        this.parameters.octave = value;

        // loop through all oscillators and update value
        for (
          let i = 0, end = this.activeOscillators.length, asc = 0 <= end;
          asc ? i < end : i > end;
          asc ? i++ : i--
        ) {
          const osc = this.activeOscillators[i];
          osc.frequency.setValueAtTime(
            osc.originalFrequency * this.parameters.octave,
            0
          );
        }

        return this.parameters.octave;
      }
    });

    this.property("portamento", {
      get() {
        return this.parameters.portamento;
      },
      set(value) {
        if (this.parameters.portamento === value) {
          return this.parameters.portamento;
        }
        this.parameters.portamento = value;
        return this.parameters.portamento;
      }
    });

    this.property("poly", {
      get() {
        return this.parameters.poly;
      },
      set(value) {
        if (this.parameters.poly === value) {
          return this.parameters.poly;
        }
        this.parameters.poly = value;
        this.destroy();
        return this.parameters.poly;
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

    this.parameters.type = Audio.WAVE_TYPE[data.settings.wave_type];
    this.parameters.detune = data.settings.detune;
    this.parameters.octave = data.settings.octave;
    this.parameters.portamento = data.settings.portamento;
    this.parameters.poly = data.settings.poly;

    this.activeOscillators = [];

    App.SETTINGS_CHANGE.add(this.onSettingsChange);
  }

  destroy() {
    for (
      let i = 0, end = this.activeOscillators.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      this.activeOscillators[0].stop(0);
      this.activeOscillators.splice(0, 1);
    }
    this.active = [];
    return null;
  }

  create(frequency) {
    const now = Audio.CONTEXT.currentTime;
    const envAttackEnd = now + this.attack / 1000.0;

    // create note on off gain
    const nofg = Audio.CONTEXT.createGain();
    nofg.connect(this.pre);
    nofg.gain.value = 0.0;

    const oscillator = Audio.CONTEXT.createOscillator();
    oscillator.type = this.parameters.type;
    oscillator.originalFrequency = frequency;
    oscillator.nofg = nofg;
    oscillator.frequency.cancelScheduledValues(now);
    oscillator.frequency.setTargetAtTime(
      frequency * this.parameters.octave * Audio.CUR_OCTAVE[Audio.OCTAVE_STEP],
      0,
      this.parameters.portamento / 1000.0 || 0.001
    );
    oscillator.detune.setValueAtTime(this.parameters.detune, 0);
    oscillator.connect(nofg);
    oscillator.start(now);

    nofg.attackStart = now;
    nofg.attackEnd = envAttackEnd;
    nofg.gain.cancelScheduledValues(now);
    nofg.gain.setValueAtTime(0.0, now);
    if (Session.SETTINGS[this.component_session_uid].settings.mute === false) {
      nofg.gain.linearRampToValueAtTime(1.0, envAttackEnd);
      nofg.gain.setTargetAtTime(
        this.sustain * 1.0 / 100.0,
        envAttackEnd,
        this.decay / 1000.0 + 0.001
      );
    }

    return oscillator;
  }

  onSettingsChange(event) {
    if (event.component === this.component_session_uid) {
      this.poly = Session.SETTINGS[this.component_session_uid].settings.poly;
      this.type =
        Audio.WAVE_TYPE[
          Session.SETTINGS[this.component_session_uid].settings.wave_type
        ];
      this.detune =
        Session.SETTINGS[this.component_session_uid].settings.detune;
      this.octave =
        Audio.OCTAVE[
          Session.SETTINGS[this.component_session_uid].settings.octave
        ];
      this.portamento =
        Session.SETTINGS[this.component_session_uid].settings.portamento;
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

    // if there is a settings change of a component in AUX
    if (this.ENV || this.FLT || this.PTG || this.LFO) {
      if (this.LFO && event.component === this.LFO.component_session_uid) {
        this.checkAUX();
      }
    }
    return null;
  }

  start(frequency) {
    // return if Session.SETTINGS[@component_session_uid].settings.mute is true
    this.checkAUX();

    const now = Audio.CONTEXT.currentTime;

    this.active.push(frequency);
    if (this.parameters.poly || this.activeOscillators.length === 0) {
      this.activeOscillators.push(this.create(frequency));
    } else {
      // frequency
      this.activeOscillators[0].frequency.cancelScheduledValues(now);
      this.activeOscillators[0].frequency.setTargetAtTime(
        frequency *
          this.parameters.octave *
          Audio.CUR_OCTAVE[Audio.OCTAVE_STEP],
        0,
        this.parameters.portamento / 1000.0 || 0.001
      );
    }
    return null;
  }

  stop(frequency) {
    const index = this.active.indexOf(frequency);
    if (index !== -1) {
      this.checkAUX();

      const now = Audio.CONTEXT.currentTime;
      const release = now + this.release / 1000.0;

      this.active.splice(index, 1);

      if (this.parameters.poly === true || this.active.length === 0) {
        let rampValue = this.getRampValue(
          0,
          1,
          this.activeOscillators[index].nofg.attackStart,
          this.activeOscillators[index].nofg.attackEnd,
          now
        );
        if (
          Session.SETTINGS[this.component_session_uid].settings.mute === true
        ) {
          rampValue = 0;
        }
        this.activeOscillators[index].nofg.gain.cancelScheduledValues(now);
        this.activeOscillators[index].nofg.gain.setValueAtTime(rampValue, now);
        this.activeOscillators[index].nofg.gain.linearRampToValueAtTime(
          0,
          release
        );

        this.activeOscillators[index].stop(release);
        this.activeOscillators.splice(index, 1);
      } else {
        this.activeOscillators[0].frequency.cancelScheduledValues(now);
        this.activeOscillators[0].frequency.setTargetAtTime(
          this.active[this.active.length - 1] * this.parameters.octave,
          0,
          this.parameters.portamento / 1000.0 || 0.001
        );
      }
    }
    return null;
  }
}
Oscillator.initClass();
