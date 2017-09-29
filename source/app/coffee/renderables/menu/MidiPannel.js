/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.menu.Pannel
class MidiPannel extends Pannel {

    constructor(label) {
        {
          // Hack: trick Babel/TypeScript into allowing this before super.
          if (false) { super(); }
          let thisFn = (() => { this; }).toString();
          let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
          eval(`${thisName} = this;`);
        }
        this.onMidiStateChange = this.onMidiStateChange.bind(this);
        this.toggleMidiDevice = this.toggleMidiDevice.bind(this);
        super(label);

        this.DEFAULT_MESSAGE = 'NO MIDI DEVICES CONNECTED';

        this.controllers = [];

        App.MIDI.add(this.onMidiStateChange);

        this.title = new PIXI.Text(this.DEFAULT_MESSAGE, AppData.TEXTFORMAT.MENU_SUBTITLE);
        this.title.tint = 0x646464;
        this.title.scale.x = (this.title.scale.y = 0.5);
        this.title.position.x = AppData.PADDING;
        this.title.position.y = AppData.MENU_PANNEL;
        this.addChild(this.title);

        this.description = new PIXI.Text('You need to connect your MIDI enabled device in order to control the synthesizer', AppData.TEXTFORMAT.MENU_DESCRIPTION);
        this.description.scale.x = (this.description.scale.y = 0.5);
        this.description.position.x = AppData.PADDING;
        this.description.position.y = this.title.y + this.title.height + AppData.PADDING;
        this.addChild(this.description);
    }

    onMidiStateChange(e) {
        // add/remove from controllers objects
        if ((e.state === 'disconnected') && (e.connection === 'closed')) {
            delete this.controllers[e.name];
        } else if (e.state === 'connected') {
            this.controllers[e.name] = e;
        }

        // remove all buttons
        for (let i = 0, end = this.elements.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            this.removeChild(this.elements[i]);
        }
        this.elements = [];

        // add based on controllers object
        for (let controller in this.controllers) {
            const bt = new SubmenuButtonMidi(controller, AppData.ASSETS.sprite.textures['ic-selection-inactive.png']);
            bt.active = false;
            this.addChild(bt);
            this.elements.push(bt);
            this.controllers[controller].button = bt;

            this.assign(bt, controller);
            this.toggleMidiDevice(controller);
        }

        if (Object.keys(this.controllers).length > 0) {
            this.title.text = 'CHOOSE MIDI INPUT';
            this.description.visible = false;
        } else {
            this.title.text = this.DEFAULT_MESSAGE;
            this.description.visible = true;
        }
        this.align();
        return null;
    }

    align() {
        for (let i = 0, end = this.elements.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            if (i === 0) {
                this.elements[i].y = this.title.y + this.title.height + (AppData.PADDING/2);
            } else {
                this.elements[i].y = this.elements[i-1].y + this.elements[i-1].height;
            }
        }
        return null;
    }

    assign(bt, controller) {
        bt.buttonClick = () => {
            return this.toggleMidiDevice(controller);
        };
        return null;
    }

    toggleMidiDevice(controller) {
        const { button } = this.controllers[controller];
        button.active = !button.active;

        if (button.active === false) {
            button.img.texture = AppData.ASSETS.sprite.textures['ic-selection-inactive.png'];
            button.img.alpha = 0.15;
            delete Session.MIDI[controller];
        } else {
            button.img.texture = AppData.ASSETS.sprite.textures['ic-selection-active.png'];
            button.img.alpha = 1;
            Session.MIDI[controller] = controller;
        }
        return null;
    }
}
