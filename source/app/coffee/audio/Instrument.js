/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import audio.core.Audio
// import audio.core.*
// import audio.components.*
class Instrument {
  constructor() {
    // master channel
    this.onAdd = this.onAdd.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onNoteOn = this.onNoteOn.bind(this);
    this.onNoteOff = this.onNoteOff.bind(this);
    this.master = new ChannelStrip();
    this.master.connect(Audio.CONTEXT.destination);

    // channels
    this.channels = [];

    // components
    this.components = [];

    // add / remove signal
    App.ADD.add(this.onAdd);
    App.REMOVE.add(this.onRemove);

    // note on / off signal
    App.NOTE_ON.add(this.onNoteOn);
    App.NOTE_OFF.add(this.onNoteOff);
  }

  onAdd(data) {
    Analytics.event("component", "add", data.type_uid);
    this.add(data);
    return null;
  }

  onRemove(data) {
    Analytics.event(
      "component",
      "remove",
      Session.SETTINGS[data.component_session_uid].type_uid
    );
    this.remove(data);
    return null;
  }

  createChannelStrip() {
    const fader = new ChannelStrip();
    fader.connect(this.master.input);
    return fader;
  }

  getNextAvailableChannelStrip() {
    // returns next available channel strip
    let available;
    if (this.channels.length === 0) {
      // if its the first channel in the array, add it
      available = this.channels[0] = this.createChannelStrip();
    } else {
      // check if there is any empty channel strip in between 0 and length
      for (
        let i = 0, end = this.channels.length, asc = 0 <= end;
        asc ? i < end : i > end;
        asc ? i++ : i--
      ) {
        const channel = this.channels[i];
        if (!channel) {
          available = this.channels[i] = this.createChannelStrip();
          break;
        }
      }

      // if there is, adds a new one
      if (!available) {
        available = this.channels[
          this.channels.length
        ] = this.createChannelStrip();
      }
    }

    return available;
  }

  onNoteOn(data) {
    const frequency = Audio.noteToFrequency(data.note);
    for (
      let i = 0, end = this.components.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      const component = this.components[i];
      switch (component.type_uid) {
        case AppData.COMPONENTS.OSC:
        case AppData.COMPONENTS.NSG:
          component.start(frequency);
          break;
      }
    }
    return null;
  }

  onNoteOff(data) {
    const frequency = Audio.noteToFrequency(data.note);
    for (
      let i = 0, end = this.components.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      const component = this.components[i];
      switch (component.type_uid) {
        case AppData.COMPONENTS.OSC:
        case AppData.COMPONENTS.NSG:
          component.stop(frequency);
          break;
      }
    }
    return null;
  }

  add(data) {
    let component;
    switch (data.type_uid) {
      case AppData.COMPONENTS.NSG:
        component = new NoiseGenerator(data);
        break;
      case AppData.COMPONENTS.OSC:
        component = new Oscillator(data);
        break;
      case AppData.COMPONENTS.ENV:
        component = new Envelope(data);
        break;
      case AppData.COMPONENTS.FLT:
        component = new Flt(data);
        break;
      case AppData.COMPONENTS.PTG:
        component = new PatternGate(data);
        break;
      case AppData.COMPONENTS.LFO:
        component = new Lfo(data);
        break;
    }

    if (component) {
      if (data.audioCapable) {
        component.connect(this.getNextAvailableChannelStrip().input);
      }

      this.attachToAUX(component);
      this.components.push(component);
    }
    return null;
  }

  remove(data) {
    App.TOGGLE_SETTINGS_PANNEL_HEIGHT.dispatch({ type: false });
    for (
      let i = 0, end = this.components.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      const component = this.components[i];

      if (component.component_session_uid === data.component_session_uid) {
        component.destroy();
        delete Session.SETTINGS[data.component_session_uid];

        this.detachFromAUX(component);

        this.components.splice(i, 1);
        this.channels.splice(i, 1);
        break;
      }
    }
    return null;
  }

  detachFromAUX(component) {
    const type = component.type_uid;
    const uid = component.component_session_uid;

    for (
      let i = 0, end = this.components.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      const cur_type = this.components[i].type_uid;
      if (type === AppData.COMPONENTS.ENV) {
        if (
          cur_type === AppData.COMPONENTS.OSC ||
          cur_type === AppData.COMPONENTS.NSG
        ) {
          this.components[i].ENV = null;
          Session.SETTINGS[
            this.components[i].component_session_uid
          ].connections.ENV = null;
        }
      }
      if (type === AppData.COMPONENTS.PTG) {
        if (
          cur_type === AppData.COMPONENTS.OSC ||
          cur_type === AppData.COMPONENTS.NSG
        ) {
          this.components[i].PTG = null;
          Session.SETTINGS[
            this.components[i].component_session_uid
          ].connections.PTG = null;
        }
      }
      if (type === AppData.COMPONENTS.LFO) {
        if (
          cur_type === AppData.COMPONENTS.OSC ||
          cur_type === AppData.COMPONENTS.NSG
        ) {
          this.components[i].LFO = null;
          Session.SETTINGS[
            this.components[i].component_session_uid
          ].connections.LFO = null;
        }
      }
      if (type === AppData.COMPONENTS.FLT) {
        if (
          cur_type === AppData.COMPONENTS.OSC ||
          cur_type === AppData.COMPONENTS.NSG
        ) {
          this.components[i].FLT = null;
          Session.SETTINGS[
            this.components[i].component_session_uid
          ].connections.FLT = null;
        }
      }
    }
    return null;
  }

  attachToAUX(component) {
    const type = component.type_uid;
    const uid = component.component_session_uid;

    for (
      let i = 0, end = this.components.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      const cur_type = this.components[i].type_uid;
      // ENV is added, checks for OSC and NSG
      if (type === AppData.COMPONENTS.ENV) {
        if (
          cur_type === AppData.COMPONENTS.OSC ||
          cur_type === AppData.COMPONENTS.NSG
        ) {
          // if there's already an envelope disconnect the old one
          if (this.components[i].ENV) {
            this.components[i].ENV.disconnect();
          }
          // 'you are adding a ENV and there\'s already a OSC'
          this.components[i].ENV = component;
          // adds reference to Session
          Session.SETTINGS[
            this.components[i].component_session_uid
          ].connections.ENV =
            component.component_session_uid;
        }
      }

      // PTG is added, checks for OSC and NSG
      if (type === AppData.COMPONENTS.PTG) {
        if (
          cur_type === AppData.COMPONENTS.OSC ||
          cur_type === AppData.COMPONENTS.NSG
        ) {
          if (this.components[i].PTG) {
            this.components[i].PTG.disconnect();
          }
          // 'you are adding a PTG and there\'s already a OSC'
          this.components[i].PTG = component;
          Session.SETTINGS[
            this.components[i].component_session_uid
          ].connections.PTG =
            component.component_session_uid;
        }
      }

      // LFO is added, checks for OSC and NSG
      if (type === AppData.COMPONENTS.LFO) {
        if (
          cur_type === AppData.COMPONENTS.OSC ||
          cur_type === AppData.COMPONENTS.NSG
        ) {
          if (this.components[i].LFO) {
            this.components[i].LFO.disconnect();
          }
          // 'you are adding a LFO and there\'s already a OSC'
          this.components[i].LFO = component;
          Session.SETTINGS[
            this.components[i].component_session_uid
          ].connections.LFO =
            component.component_session_uid;
        }
      }

      // FLT is added, checks for OSC and NSG
      if (type === AppData.COMPONENTS.FLT) {
        if (
          cur_type === AppData.COMPONENTS.OSC ||
          cur_type === AppData.COMPONENTS.NSG
        ) {
          if (this.components[i].FLT) {
            this.components[i].FLT.disconnect();
          }
          // 'you are adding a FLT and there\'s already a OSC'
          this.components[i].FLT = component;
          Session.SETTINGS[
            this.components[i].component_session_uid
          ].connections.FLT =
            component.component_session_uid;
        }
      }

      // OSC or NSG is added, checks for ENV
      if (type === AppData.COMPONENTS.OSC || type === AppData.COMPONENTS.NSG) {
        if (cur_type === AppData.COMPONENTS.ENV) {
          if (component.ENV) {
            component.ENV.disconnect();
          }
          // 'you are adding a OSC and there\'s already a ENV'
          component.ENV = this.components[i];
          Session.SETTINGS[
            component.component_session_uid
          ].connections.ENV = this.components[i].component_session_uid;
        }
      }

      // OSC or NSG is added, checks for PTG
      if (type === AppData.COMPONENTS.OSC || type === AppData.COMPONENTS.NSG) {
        if (cur_type === AppData.COMPONENTS.PTG) {
          if (component.PTG) {
            component.PTG.disconnect();
          }
          // 'you are adding a OSC and there\'s already a PTG'
          component.PTG = this.components[i];
          Session.SETTINGS[
            component.component_session_uid
          ].connections.PTG = this.components[i].component_session_uid;
        }
      }

      // OSC or NSG is added, checks for LFO
      if (type === AppData.COMPONENTS.OSC || type === AppData.COMPONENTS.NSG) {
        if (cur_type === AppData.COMPONENTS.LFO) {
          if (component.LFO) {
            component.LFO.disconnect();
          }
          // 'you are adding a OSC and there\'s already a LFO'
          component.LFO = this.components[i];
          Session.SETTINGS[
            component.component_session_uid
          ].connections.LFO = this.components[i].component_session_uid;
        }
      }

      // OSC or NSG is added, checks for FLT
      if (type === AppData.COMPONENTS.OSC || type === AppData.COMPONENTS.NSG) {
        if (cur_type === AppData.COMPONENTS.FLT) {
          if (component.FLT) {
            component.FLT.disconnect();
          }
          // 'you are adding a OSC and there\'s already a FLT'
          component.FLT = this.components[i];
          Session.SETTINGS[
            component.component_session_uid
          ].connections.FLT = this.components[i].component_session_uid;
        }
      }
    }
    return null;
  }
}
