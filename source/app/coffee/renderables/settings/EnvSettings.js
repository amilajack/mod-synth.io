/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.elements.*
// import renderables.buttons.*
// import renderables.settings.SettingsBase
class EnvSettings extends SettingsBase {
  constructor(component_session_uid) {
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
    this.handleB = this.handleB.bind(this);
    this.component_session_uid = component_session_uid;
    super(this.component_session_uid);

    // bypass
    this.bypass = new Radio("B");
    this.bypass.buttonClick = this.handleB;
    this.add(this.bypass);

    // space
    this.add(new Spacer(AppData.ICON_SPACE2));

    // attack
    this.attack = new Attack(this.component_session_uid);
    this.attack.range.min = 0;
    this.attack.range.max = 2000;
    this.add(this.attack);

    this.add(new Spacer(AppData.ICON_SPACE3));

    // decay
    this.decay = new Decay(this.component_session_uid);
    this.decay.range.min = 0;
    this.decay.range.max = 2000;
    this.add(this.decay);

    this.add(new Spacer(AppData.ICON_SPACE3));

    // sustain
    this.sustain = new Sustain(this.component_session_uid);
    this.add(this.sustain);

    this.add(new Spacer(AppData.ICON_SPACE3));

    // release
    this.release = new Release(this.component_session_uid);
    this.release.range.min = 0;
    this.release.range.max = 2000;
    this.add(this.release);

    this.adjustPosition();
  }

  onSettingsChange(event) {
    if (event.component === this.component_session_uid) {
      this.bypass.setActive(
        Session.SETTINGS[this.component_session_uid].settings.bypass
      );
    }
    return null;
  }

  handleB() {
    Session.SETTINGS[this.component_session_uid].settings.bypass = !this.bypass
      .active;
    App.SETTINGS_CHANGE.dispatch({ component: this.component_session_uid });
    return null;
  }
}
