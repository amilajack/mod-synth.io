/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.elements.*
// import renderables.buttons.*
// import renderables.settings.SettingsBase
class OscSettings extends SettingsBase {

    constructor(component_session_uid) {
        {
          // Hack: trick Babel/TypeScript into allowing this before super.
          if (false) { super(); }
          let thisFn = (() => { this; }).toString();
          let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
          eval(`${thisName} = this;`);
        }
        this.onSettingsChange = this.onSettingsChange.bind(this);
        this.handleS = this.handleS.bind(this);
        this.handleM = this.handleM.bind(this);
        this.handleP = this.handleP.bind(this);
        this.component_session_uid = component_session_uid;
        super(this.component_session_uid);

        // solo
        this.solo = new Radio('S');
        this.solo.buttonClick = this.handleS;
        this.add(this.solo);

        this.add(new Spacer(AppData.ICON_SPACE1));

        // mute
        this.mute = new Radio('M');
        this.mute.buttonClick = this.handleM;
        this.add(this.mute);

        this.add(new Spacer(AppData.ICON_SPACE1));

        // polyphonic
        this.poly = new Poly();
        this.poly.buttonClick = this.handleP;
        this.add(this.poly);

        // space
        this.add(new Spacer(AppData.ICON_SPACE2));

        // wave type
        this.type = new Waves(this.component_session_uid);
        this.add(this.type);

        this.add(new Spacer(AppData.ICON_SPACE3));

        // octave
        this.octave = new Octave(this.component_session_uid);
        this.add(this.octave);

        this.add(new Spacer(AppData.ICON_SPACE3));

        // portamento
        this.portamento = new Portamento(this.component_session_uid);
        this.add(this.portamento);

        this.add(new Spacer(AppData.ICON_SPACE3));

        // detune
        this.detune = new Detune(this.component_session_uid);
        this.add(this.detune);

        this.add(new Spacer(AppData.ICON_SPACE3));

        // volume
        this.volume = new Volume(this.component_session_uid);
        this.add(this.volume);

        this.adjustPosition();
    }

    onSettingsChange(event) {
        if (event.component === this.component_session_uid) {
            this.solo.setActive(Session.SETTINGS[this.component_session_uid].settings.solo);
            this.mute.setActive(Session.SETTINGS[this.component_session_uid].settings.mute);
            this.poly.setActive(Session.SETTINGS[this.component_session_uid].settings.poly);
        }
        return null;
    }

    handleS() {
        Session.HANDLE_SOLO(this.component_session_uid);
        return null;
    }

    handleM() {
        if (Session.SETTINGS[this.component_session_uid].settings.solo === true) { return; }
        Session.SETTINGS[this.component_session_uid].settings.mute = !this.mute.active;
        App.SETTINGS_CHANGE.dispatch({ component: this.component_session_uid });
        return null;
    }

    handleP() {
        Session.SETTINGS[this.component_session_uid].settings.poly = !this.poly.active;
        App.SETTINGS_CHANGE.dispatch({ component: this.component_session_uid });
        return null;
    }
}
