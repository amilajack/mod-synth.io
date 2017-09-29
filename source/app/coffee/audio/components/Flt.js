/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import audio.components.Component
class Flt extends Component {
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
        this.component.type.value = this.parameters.type;
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

    this.property("detune", {
      get() {
        return this.parameters.detune;
      },
      set(value) {
        if (this.parameters.detune === value) {
          return this.parameters.detune;
        }
        this.parameters.detune = value;
        this.component.detune.value = this.parameters.detune;
        return this.parameters.detune;
      }
    });

    this.property("q", {
      get() {
        return this.parameters.q;
      },
      set(value) {
        if (this.parameters.q === value) {
          return this.parameters.q;
        }
        this.parameters.q = value;
        this.component.Q.value = this.parameters.q;
        return this.parameters.q;
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
    this.parameters.type = Audio.FILTER_TYPE[data.settings.filter_type];
    this.parameters.frequency = data.settings.frequency;
    this.parameters.detune = data.settings.detune;
    this.parameters.q = data.settings.q;

    App.SETTINGS_CHANGE.add(this.onSettingsChange);

    this.component = Audio.CONTEXT.createBiquadFilter();
    this.component.type = this.type;
    this.component.frequency.value = this.frequency;
    this.component.detune.value = this.detune;
    this.component.Q.value = this.q;
  }

  //     @update()
  //
  // update: =>
  //     requestAnimationFrame @update
  //     @frequency = (0.5 + 0.5 * Math.sin(Date.now() / 500)) * 1000;
  //     @q = (0.5 + 0.5 * Math.sin(Date.now() / 500)) * 20;
  //     null

  destroy() {
    this.component.disconnect();
    return null;
  }

  onSettingsChange(event) {
    if (event.component === this.component_session_uid) {
      this.type =
        Audio.FILTER_TYPE[
          Session.SETTINGS[this.component_session_uid].settings.filter_type
        ];
      this.frequency =
        Session.SETTINGS[this.component_session_uid].settings.frequency;
      this.detune =
        Session.SETTINGS[this.component_session_uid].settings.detune;
      this.q = Session.SETTINGS[this.component_session_uid].settings.q;
    }
    return null;
  }
}
Flt.initClass();
