/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class ICButton extends PIXI.Container {

    constructor(texture, hint) {
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
        this.onOver = this.onOver.bind(this);
        this.onOut = this.onOut.bind(this);
        if (hint == null) { hint = ''; }
        super(texture);

        App.HELP.add(this.onHelp);

        this.hitArea = new PIXI.Rectangle(0, 0, AppData.ICON_SIZE_1, AppData.ICON_SIZE_1);

        this.duration = 0.3;
        this.ease = Quad.easeInOut;
        this.enabled = false;
        this.selected = false;
        this.overAlpha = 1.0;
        this.outAlpha = 0.65;
        this.alpha = this.outAlpha;

        this.img = new PIXI.Sprite(texture);
        this.img.anchor.x = 0.5;
        this.img.anchor.y = 0.5;
        this.img.x = AppData.ICON_SIZE_1/2;
        this.img.y = AppData.ICON_SIZE_1/2;
        this.addChild(this.img);

        this.hint = new PIXI.Text(hint.toUpperCase(), AppData.TEXTFORMAT.HINT);
        this.hint.anchor.x = 0.5;
        this.hint.anchor.y = 0;
        this.hint.scale.x = (this.hint.scale.y = 0.5);
        this.hint.position.x = AppData.ICON_SIZE_1/2;
        this.hint.position.y = AppData.ICON_SIZE_1;
        this.hint.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
        this.hint.visible = AppData.SHOW_LABELS;
        this.addChild(this.hint);

        this.enable();
    }

    onHelp(value) {
        this.hint.visible = value;
        return null;
    }

    select(value) {
        this.selected = value;
        TweenMax.to(this, 0, { alpha: (this.selected === false ? this.outAlpha : this.overAlpha), ease: this.ease });
        return null;
    }

    onDown() {
        this.buttonClick();
        return null;
    }

    onUp() {
        this.onOut();
        return null;
    }

    onOver() {
        if (!this.enabled) { return; }
        if (this.selected) { return; }
        TweenMax.to(this, 0, { alpha: this.overAlpha, ease: this.ease });
        return null;
    }

    onOut() {
        if (!this.enabled) { return; }
        if (this.selected) { return; }
        TweenMax.to(this, this.duration, { alpha: this.outAlpha, ease: this.ease });
        return null;
    }

    buttonClick() {
        // to be override
        return null;
    }

    hide(duration, delay) {
        TweenMax.to(this, duration, { alpha: 0, delay, onComplete: () => {
            return this.visible = false;
        }
        });
        this.onOut();
        return null;
    }

    show(duration, delay) {
        this.visible = true;
        this.alpha = 0;
        TweenMax.to(this, duration, { alpha: 1, delay, onComplete: () => {
            this.onOut();
            return null;
        }
        });
        return null;
    }

    enable() {
        this.interactive = (this.buttonMode = (this.enabled = true));
        if (Modernizr.touch) {
            this.on('touchstart', this.onDown);
            this.on('touchend', this.onUp);
            this.on('touchendoutside', this.onOut);
        } else {
            this.on('mousedown', this.onDown);
            this.on('mouseup', this.onUp);
            this.on('mouseout', this.onOut);
            this.on('mouseover', this.onOver);
            this.on('mouseupoutside', this.onOut);
        }
        return null;
    }

    disable() {
        this.interactive = (this.buttonMode = (this.enabled = false));
        if (Modernizr.touch) {
            this.off('touchstart', this.onDown);
            this.off('touchend', this.onUp);
            this.off('touchendoutside', this.onOut);
        } else {
            this.off('mousedown', this.onDown);
            this.off('mouseup', this.onUp);
            this.off('mouseout', this.onOut);
            this.off('mouseover', this.onOver);
            this.off('mouseupoutside', this.onOut);
        }
        return null;
    }
}
