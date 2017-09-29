/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import audio.components.Component
class Lfo extends Component {
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
        this.component.type = this.parameters.type;
        return this.parameters.type;
      }
    });

    this.property("frequency", {
      get() {
        return this.parameters.frequency;
      },
      set(value) {
        if (this.parameters.frequency === value) {
          return this.parameters.frequency;
        }
        this.parameters.frequency = value;
        this.component.frequency.value = this.parameters.frequency;
        return this.parameters.frequency;
      }
    });

    this.property("depth", {
      get() {
        return this.parameters.depth;
      },
      set(value) {
        if (this.parameters.depth === value) {
          return this.parameters.depth;
        }
        this.parameters.depth = value;
        this.aux.gain.value = this.parameters.depth;
        return this.parameters.depth;
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

    this.parameters.bypass = data.settings.bypass;
    this.parameters.type = Audio.WAVE_TYPE[data.settings.wave_type];
    this.parameters.frequency = data.settings.frequency;

    App.SETTINGS_CHANGE.add(this.onSettingsChange);

    this.component = Audio.CONTEXT.createOscillator();
    this.component.type = this.type;
    this.component.frequency.value = this.frequency;
    this.component.connect(this.aux);
    this.component.start();
  }

  destroy() {
    this.component.stop();
    return null;
  }

  onSettingsChange(event) {
    if (event.component === this.component_session_uid) {
      this.type =
        Audio.WAVE_TYPE[
          Session.SETTINGS[this.component_session_uid].settings.wave_type
        ];
      this.frequency =
        Session.SETTINGS[this.component_session_uid].settings.frequency;
      this.depth = MathUtils.map(
        Session.SETTINGS[this.component_session_uid].settings.depth,
        0,
        100,
        0,
        1
      );
    }
    return null;
  }
}
Lfo.initClass();
