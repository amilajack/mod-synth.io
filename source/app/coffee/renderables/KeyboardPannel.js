/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.buttons.BlackKey
// import renderables.buttons.WhiteKey
// import renderables.buttons.OctaveUp
// import renderables.buttons.OctaveDown
class KeyboardPannel extends PIXI.Sprite {

    constructor() {
        {
          // Hack: trick Babel/TypeScript into allowing this before super.
          if (false) { super(); }
          let thisFn = (() => { this; }).toString();
          let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
          eval(`${thisName} = this;`);
        }
        this.onNoteOn = this.onNoteOn.bind(this);
        this.onNoteOff = this.onNoteOff.bind(this);
        super();

        App.NOTE_ON.add(this.onNoteOn);
        App.NOTE_OFF.add(this.onNoteOff);

        this.firstKeyCode = 48;
        this.keycode = this.firstKeyCode;

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        // keys
        this.keys = new PIXI.Container();
        this.keys.y = AppData.SETTINGS_PANNEL_HEIGHT;
        this.addChild(this.keys);

        this.hitArea = new PIXI.Rectangle(0, 100*AppData.RATIO, AppData.WIDTH, AppData.KEYBOARD_PANNEL_HEIGHT);
    }

    resize() {
        this.graphics.clear();
        this.graphics.beginFill(0x232323, 0.97);
        this.graphics.moveTo(0, AppData.SETTINGS_PANNEL_HEIGHT);
        this.graphics.lineTo(AppData.WIDTH, AppData.SETTINGS_PANNEL_HEIGHT);
        this.graphics.lineTo(AppData.WIDTH, AppData.SETTINGS_PANNEL_HEIGHT + AppData.KEYBOARD_PANNEL_HEIGHT);
        this.graphics.lineTo(0, AppData.SETTINGS_PANNEL_HEIGHT + AppData.KEYBOARD_PANNEL_HEIGHT);
        this.graphics.lineTo(0, 0);
        this.graphics.endFill();

        this.removeKeys();
        this.addKeys();
        return null;
    }

    removeKeys() {
        for (let i = 0, end = this.keys.children.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            const child = this.keys.children[0];
            child.disable();
            this.keys.removeChild(child);
        }
        return null;
    }

    addKeys() {
        this.kw = 72 * AppData.RATIO;
        this.kh = 170 * AppData.RATIO;
        this.kr = 72 * AppData.RATIO;
        this.p = 100 * AppData.RATIO;

        const availableWidth = AppData.WIDTH - (110*AppData.RATIO) - AppData.PADDING;
        const initialX = (110*AppData.RATIO);
        // random number added
        const total = Math.floor( availableWidth / (this.kw+(8*AppData.RATIO)) );

        const availableFluid = availableWidth - (this.kw*total);

        this.keycode = this.firstKeyCode;
        const fluid = availableFluid/total;
        for (let i = 0, end = total, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {

            if (((i%7) === 0) || (((i+4)%7) === 0)) {
                if (i !== 0) {
                    this.keycode--;
                }
            }

            const w = new WhiteKey();
            w.code = this.keycode;
            w.enable();
            w.x = initialX + ((this.kw+fluid) * i);
            w.y = AppData.KEYBOARD_PANNEL_HEIGHT - this.kh - AppData.PADDING;
            this.keys.addChild(w);

            this.keycode += 2;

            if (((i%7) === 0) || (((i+4)%7) === 0)) {
                continue;
            }

            const b = new BlackKey();
            b.code = this.keycode-3;
            b.enable();
            b.x = w.x - (this.kr/2);
            b.y = w.y - this.p;
            this.keys.addChild(b);
        }

        // octaves
        this.octaveUp = new OctaveUp();
        this.octaveUp.x = AppData.PADDING - ((this.octaveUp.width-AppData.ICON_SIZE_1)/2);
        this.octaveUp.y = AppData.KEYBOARD_PANNEL_HEIGHT - this.kh - AppData.PADDING - this.p;
        this.keys.addChild(this.octaveUp);

        this.octaveDown = new OctaveDown();
        this.octaveDown.x = AppData.PADDING - ((this.octaveUp.width-AppData.ICON_SIZE_1)/2);
        this.octaveDown.y = AppData.KEYBOARD_PANNEL_HEIGHT - this.kh - AppData.PADDING;
        this.keys.addChild(this.octaveDown);
        return null;
    }

    onNoteOn(data) {
        const key = this.findKey(data.note);
        if (key) {
            key.select();
        }
        return null;
    }

    onNoteOff(data) {
        const key = this.findKey(data.note);
        if (key) {
            key.unselect();
        }
        return null;
    }

    findKey(code) {
        for (let i = 0, end = this.keys.children.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            const key = this.keys.children[i];
            if (key.code === code) {
                return key;
            }
        }
        return null;
    }
}
