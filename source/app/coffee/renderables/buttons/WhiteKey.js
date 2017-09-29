/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.buttons.Button
class WhiteKey extends Button {

    constructor() {
        {
          // Hack: trick Babel/TypeScript into allowing this before super.
          if (false) { super(); }
          let thisFn = (() => { this; }).toString();
          let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
          eval(`${thisName} = this;`);
        }
        this.onHelp = this.onHelp.bind(this);
        this.onDown = this.onDown.bind(this);
        this.onUp = this.onUp.bind(this);
        this.onOutside = this.onOutside.bind(this);
        super(AppData.ASSETS.sprite.textures['white-note.png']);

        this.hint = new PIXI.Text('W', AppData.TEXTFORMAT.HINT);
        this.hint.anchor.x = 0.5;
        this.hint.anchor.y = 1;
        this.hint.scale.x = (this.hint.scale.y = 0.5);
        this.hint.position.x = this.texture.width/2;
        this.hint.position.y = this.texture.height - (10 * AppData.RATIO);
        this.hint.tint = 0x232323;
        this.hint.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
        this.hint.visible = AppData.SHOW_LABELS;
        this.addChild(this.hint);
    }

    onHelp() {
        this.hint.visible = AppData.SHOW_LABELS;
        return null;
    }

    onDown() {
        App.NOTE_ON.dispatch({ note: this.code, velocity: 127.0 });
        return null;
    }

    onUp() {
        App.NOTE_OFF.dispatch({ note: this.code });
        return null;
    }

    onOutside() {
        App.NOTE_OFF.dispatch({ note: this.code });
        return null;
    }

    enable() {
        super.enable();

        let label = '';
        for (let i = 0, end = KeyboardController.map.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            if (this.code === KeyboardController.map[i].midi) {
                ({ label } = KeyboardController.map[i]);
                break;
            }
        }
        this.hint.text = label;
        return null;
    }
}
