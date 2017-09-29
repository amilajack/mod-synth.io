/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.elements.*
// import renderables.settings.SettingsBase
class FltSettings extends SettingsBase {
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

    // # detune
    // @detune = new Detune @component_session_uid
    // @add @detune

    // @add new Spacer(AppData.ICON_SPACE3)

    // Q
    this.q = new Q(this.component_session_uid);
    this.add(this.q);

    this.add(new Spacer(AppData.ICON_SPACE3));

    // for now just a low pass filter
    // @filterTypes = new Filters @component_session_uid
    // @add @filterTypes
    //
    // @add new Spacer(AppData.ICON_SPACE3)

    // frequency
    this.frequency = new Frequency(this.component_session_uid);
    this.frequency.range.min = 0;
    this.frequency.range.max = 5000;
    this.add(this.frequency);

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
