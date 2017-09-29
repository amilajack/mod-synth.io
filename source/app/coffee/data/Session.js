/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Session {
    static initClass() {
    
        this.BPM = 104;
    
        this.OCTAVE = 0;
    
        // default patch data
        this.default = {
            uid: null,
            name: null,
            author: null,
            author_name: null,
            date: null,
            preset: null,
            presets: {}
        };
    
        // current patch data
        this.patch = {
            uid: null,
            name: null,
            author: null,
            author_name: null,
            date: null,
            preset: null,
            presets: {}
        };
    
        this.patches = {};
    
        this.SETTINGS = {};
    
        // active midi inputs
        this.MIDI = {};
    }

    static ADD(component) {
        // component unique id
        const id = component.component_session_uid || Services.GENERATE_UID(16);

        // assigns component to session settings
        Session.SETTINGS[id] = component;

        // adds unique component session id
        Session.SETTINGS[id].component_session_uid = id;

        // adds connections object (which only has objects on audioCapable devices)
        Session.SETTINGS[id].connections = {};

        // read any saved settings from preset
        let settings = {};
        if (Session.patch.preset) {
            if (Session.patch.presets) {
                const components = Session.patch.presets[Session.patch.preset].components || {};
                settings = components[id] || {};
            }
        }

        // imports component settings if available
        component.settings = settings;
        Session.SETTINGS[id].settings = settings;

        // default X & Y
        Session.SETTINGS[id].x = component.x !== undefined ? component.x : 0;
        Session.SETTINGS[id].y = component.y !== undefined ? component.y : 0;

        if (component.type_uid === AppData.COMPONENTS.NSG) {
            Session.SETTINGS[id].audioCapable          = true;
            Session.SETTINGS[id].connections.ENV       = null;
            Session.SETTINGS[id].connections.PTG       = null;
            Session.SETTINGS[id].settings.solo         = component.settings.solo !== undefined ? component.settings.solo : false;
            Session.SETTINGS[id].settings.mute         = component.settings.mute !== undefined ? component.settings.mute : false;
            Session.SETTINGS[id].settings.volume       = component.settings.volume !== undefined ? component.settings.volume : -30;
            Session.SETTINGS[id].settings.noise_type   = component.settings.noise_type !== undefined ? component.settings.noise_type : AppData.NOISE_TYPE.WHITE;
        }

        if (component.type_uid === AppData.COMPONENTS.OSC) {
            Session.SETTINGS[id].audioCapable          = true;
            Session.SETTINGS[id].connections.ENV       = null;
            Session.SETTINGS[id].connections.PTG       = null;
            Session.SETTINGS[id].settings.solo         = component.settings.solo !== undefined ? component.settings.solo : false;
            Session.SETTINGS[id].settings.mute         = component.settings.mute !== undefined ? component.settings.mute : false;
            Session.SETTINGS[id].settings.poly         = component.settings.poly !== undefined ? component.settings.poly : true;
            Session.SETTINGS[id].settings.volume       = component.settings.volume !== undefined ? component.settings.volume : 0;
            Session.SETTINGS[id].settings.wave_type    = component.settings.wave_type !== undefined ? component.settings.wave_type : AppData.WAVE_TYPE.SINE;
            Session.SETTINGS[id].settings.octave       = component.settings.octave !== undefined ? component.settings.octave : AppData.OCTAVE_TYPE.EIGHT;
            Session.SETTINGS[id].settings.detune       = component.settings.detune !== undefined ? component.settings.detune : 0;
            Session.SETTINGS[id].settings.portamento   = component.settings.portamento !== undefined ? component.settings.portamento : 0;
        }

        if (component.type_uid === AppData.COMPONENTS.ENV) {
            Session.SETTINGS[id].settings.bypass       = component.settings.bypass !== undefined ? component.settings.bypass : false;
            Session.SETTINGS[id].settings.attack       = component.settings.attack !== undefined ? component.settings.attack : 0;
            Session.SETTINGS[id].settings.decay        = component.settings.decay !== undefined ? component.settings.decay : 0;
            Session.SETTINGS[id].settings.sustain      = component.settings.sustain !== undefined ? component.settings.sustain : 100;
            Session.SETTINGS[id].settings.release      = component.settings.release !== undefined ? component.settings.release : 500;
        }

        if (component.type_uid === AppData.COMPONENTS.FLT) {
            Session.SETTINGS[id].settings.bypass       = component.settings.bypass !== undefined ? component.settings.bypass : false;
            Session.SETTINGS[id].settings.frequency    = component.settings.frequency !== undefined ? component.settings.frequency : 350;
            Session.SETTINGS[id].settings.detune       = component.settings.detune !== undefined ? component.settings.detune : 0;
            Session.SETTINGS[id].settings.q            = component.settings.q !== undefined ? component.settings.q : 20;
            Session.SETTINGS[id].settings.filter_type  = component.settings.filter_type !== undefined ? component.settings.filter_type : AppData.FILTER_TYPE.LOWPASS;
        }

        if (component.type_uid === AppData.COMPONENTS.PTG) {
            Session.SETTINGS[id].settings.bypass       = component.settings.bypass !== undefined ? component.settings.bypass : false;
            Session.SETTINGS[id].settings.pattern      = component.settings.pattern !== undefined ? component.settings.pattern : [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, true];
        }

        if (component.type_uid === AppData.COMPONENTS.LFO) {
            Session.SETTINGS[id].settings.bypass       = component.settings.bypass !== undefined ? component.settings.bypass : false;
            Session.SETTINGS[id].settings.wave_type    = component.settings.wave_type !== undefined ? component.settings.wave_type : AppData.WAVE_TYPE.SINE;
            Session.SETTINGS[id].settings.frequency    = component.settings.frequency !== undefined ? component.settings.frequency : 8;
            Session.SETTINGS[id].settings.depth        = component.settings.depth !== undefined ? component.settings.depth : 60;
        }

        return Session.SETTINGS[id];
    }

    static GET(component_session_uid) {
        return Session.SETTINGS[component_session_uid];
    }

    static HANDLE_SOLO(component_session_uid) {
        const isSolo = !Session.SETTINGS[component_session_uid].settings.solo;

        for (let component in Session.SETTINGS) {
            const c = Session.SETTINGS[component];
            if ((c.type_uid === AppData.COMPONENTS.OSC) || (c.type_uid === AppData.COMPONENTS.NSG)) {
                if (c.component_session_uid === component_session_uid) {
                    c.settings.solo = !c.settings.solo;
                    c.settings.mute = false;
                } else {
                    c.settings.solo = false;
                    c.settings.mute = isSolo === true ? true : false;
                }
                App.SETTINGS_CHANGE.dispatch({ component: c.component_session_uid });
            }
        }
        return null;
    }

    static DUPLICATE_OBJECT(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    static debounce(func, threshold, execAsap) {
      let timeout = null;
      return function(...args) {
        const obj = this;
        const delayed = function() {
          if (!execAsap) { func.apply(obj, args); }
          return timeout = null;
      };
        if (timeout) {
          clearTimeout(timeout);
        } else if (execAsap) {
          func.apply(obj, args);
      }
        return timeout = setTimeout(delayed, threshold || 100);
    };
  }
}
Session.initClass();
