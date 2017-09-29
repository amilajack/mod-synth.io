/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Button extends PIXI.Container {

    constructor(texture) {
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
        this.onOutside = this.onOutside.bind(this);
        super();

        App.HELP.add(this.onHelp);

        this.texture = new PIXI.Sprite(texture);
        this.addChild(this.texture);

        this.duration = 0.1;
        this.ease = Quad.easeInOut;

        this.overAlpha = 0.22;
        this.outAlpha = 0.2;
        this.downAlpha = 1.0;

        this.selected = false;

        this.texture.alpha = this.outAlpha;
        this.code = 0;
    }

    onHelp(value) {}
        // to be overriden

    onDown() {
        this.buttonClick();
        this.select();
        return null;
    }

    onUp() {
        this.selected = false;
        this.onOut();
        return null;
    }

    onOver() {
        if (this.selected) { return; }
        TweenMax.to(this.texture, 0, { alpha: this.overAlpha, ease: this.ease });
        return null;
    }

    onOut() {
        if (this.selected) { return; }
        this.unselect();
        return null;
    }

    onOutside() {
        if (this.selected) { return; }
        this.unselect();
        return null;
    }

    select() {
        this.selected = true;
        TweenMax.to(this.texture, 0, { alpha: this.downAlpha, ease: this.ease });
        return null;
    }

    unselect() {
        this.selected = false;
        TweenMax.to(this.texture, this.duration, { alpha: this.outAlpha, ease: this.ease });
        return null;
    }

    buttonClick() {
        return null;
    }

    enable() {
        this.interactive = (this.buttonMode = true);
        if (Modernizr.touch) {
            this.on('touchstart', this.onDown);
            this.on('touchend', this.onUp);
            this.on('touchendoutside', this.onUp);
        } else {
            this.on('mousedown', this.onDown);
            this.on('mouseup', this.onUp);
            this.on('mouseover', this.onOver);
            this.on('mouseout', this.onOut);
            this.on('mouseupoutside', this.onOutside);
        }
        return null;
    }

    disable() {
        this.interactive = (this.buttonMode = false);
        if (Modernizr.touch) {
            this.off('touchstart', this.onDown);
            this.off('touchend', this.onUp);
            this.off('touchendoutside', this.onOut);
        } else {
            this.off('mousedown', this.onDown);
            this.off('mouseup', this.onUp);
            this.off('mouseover', this.onOver);
            this.off('mouseout', this.onOut);
            this.off('mouseupoutside', this.onOutside);
        }
        return null;
    }
}
