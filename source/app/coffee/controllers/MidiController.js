/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class MidiController {

    constructor() {
        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
        this.onMIDIMessage = this.onMIDIMessage.bind(this);
        this.midi = null;

        if (!!window.navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess()
                .then(this.onSuccess)
                .catch(this.onError);
        }
    }
        // else
        //    'Your browser doesn\'t support the Web MIDI API

    onSuccess(midi) {
        // 'Web MIDI API connected. inputs', midi.inputs.size, 'outputs', midi.outputs.size
        this.midi = midi;
        this.midi.onstatechange = this.onStateChange;

        const inputs = this.midi.inputs.values();

        let input = inputs.next();
        while (input && !input.done) {
            input.value.onmidimessage = this.onMIDIMessage;
            input = inputs.next();
        }
        return null;
    }

    onError(error) {
        console.error(error);
        return null;
    }

    onStateChange(device) {
        // 'state change', device.port.name, device.port.connection, device.port.state
        App.MIDI.dispatch({ originalEvent: device, name: device.port.name, connection: device.port.connection, state: device.port.state });
        return null;
    }

    onMIDIMessage(e) {
        const cmd = e.data[0] >> 4;
        const channel = e.data[0] & 0xf;
        const note = e.data[1];
        const velocity = e.data[2];
        const controller = Session.MIDI[e.target.name];

        if (channel === 9) {
            return;
        }

        if ((cmd === 8) || ((cmd === 9) && (velocity === 0))) {
            this.noteOff(note);
        } else if (cmd === 9) {
            if (controller === undefined) { return; }
            this.noteOn(note, velocity/127.0);
        } else if (cmd === 11) {
            // make a mapping controller where user can device what button controls what
            if (controller === undefined) { return; }
            // 'controller', note, velocity/127.0
        } else if (cmd === 14) {
            if (controller === undefined) { return; }
            // 'pitch wheel', ((velocity * 128.0 + note)-8192)/8192.0
        } else if (cmd === 10) {
            if (controller === undefined) { return; }
            // 'poly aftertouch', note, velocity/127.0
        } else {
            if (controller === undefined) { return; }
        }
            // e.data[0], e.data[1], e.data[2]
        return null;
    }

    noteOn(value, velocity) {
        App.NOTE_ON.dispatch({ note: value, velocity });
        return null;
    }

    noteOff(value) {
        App.NOTE_OFF.dispatch({ note: value });
        return null;
    }
}
