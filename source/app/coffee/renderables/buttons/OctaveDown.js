/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.buttons.Button
class OctaveDown extends Button {

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
        super(AppData.ASSETS.sprite.textures['octave.png']);

        this.overAlpha = 0.11;
        this.outAlpha = 0.1;
        this.downAlpha = 1.0;

        this.texture.alpha = this.outAlpha;

        this.hint = new PIXI.Text('DOWN', AppData.TEXTFORMAT.HINT);
        this.hint.anchor.x = 0.5;
        this.hint.anchor.y = 1;
        this.hint.scale.x = (this.hint.scale.y = 0.5);
        this.hint.x = this.texture.width / 2;
        this.hint.y = this.texture.height - (10 * AppData.RATIO);
        this.hint.tint = 0x5A5A5A;
        this.hint.visible = AppData.SHOW_LABELS;
        this.addChild(this.hint);

        this.enable();
    }

    onHelp() {
        this.hint.visible = AppData.SHOW_LABELS;
        return null;
    }

    onDown() {
        Audio.OCTAVE_STEP--;
        if (Audio.OCTAVE_STEP < 0) {
            Audio.OCTAVE_STEP = 0;
        }
        this.select();
        return null;
    }

    onUp() {
        this.unselect();
        return null;
    }

    onOutside() {
        this.unselect();
        return null;
    }
}
