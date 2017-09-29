/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import audio.components.Component
class Envelope extends Component {
    static initClass() {
    
        this.property('attack', {
            get() {
                return this.parameters.attack;
            },
            set(value) {
                if (this.parameters.attack === value) { return this.parameters.attack; }
                this.parameters.attack = value;
                return this.parameters.attack;
            }
        }
        );
    
        this.property('decay', {
            get() {
                return this.parameters.decay;
            },
            set(value) {
                if (this.parameters.decay === value) { return this.parameters.decay; }
                this.parameters.decay = value;
                return this.parameters.decay;
            }
        }
        );
    
        this.property('sustain', {
            get() {
                return this.parameters.sustain;
            },
            set(value) {
                if (this.parameters.sustain === value) { return this.parameters.sustain; }
                this.parameters.sustain = value;
                return this.parameters.sustain;
            }
        }
        );
    
        this.property('release', {
            get() {
                return this.parameters.release;
            },
            set(value) {
                if (this.parameters.release === value) { return this.parameters.release; }
                this.parameters.release = value;
                return this.parameters.release;
            }
        }
        );
    }

    constructor(data) {
        {
          // Hack: trick Babel/TypeScript into allowing this before super.
          if (false) { super(); }
          let thisFn = (() => { this; }).toString();
          let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
          eval(`${thisName} = this;`);
        }
        this.onSettingsChange = this.onSettingsChange.bind(this);
        super(data);

        this.parameters.attack = data.settings.attack;
        this.parameters.decay =  data.settings.decay;
        this.parameters.sustain =  data.settings.sustain;
        this.parameters.release = data.settings.release;

        App.SETTINGS_CHANGE.add(this.onSettingsChange);
    }

    onSettingsChange(event) {
        if (event.component === this.component_session_uid) {
            this.attack = Session.SETTINGS[this.component_session_uid].settings.attack;
            this.decay = Session.SETTINGS[this.component_session_uid].settings.decay;
            this.sustain = Session.SETTINGS[this.component_session_uid].settings.sustain;
            this.release = Session.SETTINGS[this.component_session_uid].settings.release;
        }
        return null;
    }
}
Envelope.initClass();
