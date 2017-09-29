/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class MenuButton extends PIXI.Container {
  constructor(texture, hint) {
    {
      // Hack: trick Babel/TypeScript into allowing this before super.
      if (false) {
        super();
      }
      let thisFn = (() => {
        this;
      }).toString();
      let thisName = thisFn
        .slice(thisFn.indexOf("{") + 1, thisFn.indexOf(";"))
        .trim();
      eval(`${thisName} = this;`);
    }
    this.onHelp = this.onHelp.bind(this);
    this.onDown = this.onDown.bind(this);
    this.onUp = this.onUp.bind(this);
    this.onOver = this.onOver.bind(this);
    this.onOut = this.onOut.bind(this);
    if (hint == null) {
      hint = "";
    }
    super();

    App.HELP.add(this.onHelp);

    this.selected = false;

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0x00ffff, 0);
    this.graphics.drawRect(0, 0, AppData.MENU_PANNEL, AppData.MENU_PANNEL);

    this.graphics.beginFill(0, 0);
    this.graphics.lineStyle(1 * AppData.RATIO, 0x111111);
    this.graphics.moveTo(0, AppData.MENU_PANNEL);
    this.graphics.lineTo(AppData.MENU_PANNEL, AppData.MENU_PANNEL);
    this.graphics.endFill();
    this.addChild(this.graphics);

    this.duration = 0.3;
    this.ease = Quad.easeInOut;
    this.enabled = false;
    this.overAlpha = 1.0;
    this.outAlpha = 0.65;

    this.img = new PIXI.Sprite(texture);
    this.img.anchor.x = 0.5;
    this.img.anchor.y = 0.5;
    this.img.x = AppData.MENU_PANNEL / 2;
    this.img.y = AppData.MENU_PANNEL / 2;
    this.addChild(this.img);

    this.count = new PIXI.Text("0", AppData.TEXTFORMAT.MENU_DESCRIPTION);
    this.count.tint = 0x646464;
    this.count.scale.x = this.count.scale.y = 0.5;
    this.count.anchor.x = 1;
    this.count.anchor.y = 0;
    this.count.position.x = AppData.MENU_PANNEL - 10 * AppData.RATIO;
    this.count.position.y = 10 * AppData.RATIO;
    this.count.visible = false;
    this.addChild(this.count);

    this.hint = new PIXI.Text(hint.toUpperCase(), AppData.TEXTFORMAT.HINT);
    this.hint.anchor.x = 0.5;
    this.hint.anchor.y = 1;
    this.hint.scale.x = this.hint.scale.y = 0.5;
    this.hint.position.x = AppData.MENU_PANNEL / 2;
    this.hint.position.y = AppData.MENU_PANNEL - 20 * AppData.RATIO;
    this.hint.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
    this.addChild(this.hint);

    this.alpha = this.outAlpha;

    this.hitArea = new PIXI.Rectangle(
      0,
      0,
      AppData.MENU_PANNEL,
      AppData.MENU_PANNEL
    );
    this.onHelp(AppData.SHOW_LABELS);
    this.enable();
  }

  onHelp(value) {
    this.hint.visible = value;
    if (value === true) {
      TweenMax.to(this.img, 0.2, {
        y: AppData.MENU_PANNEL / 2 - 10 * AppData.RATIO
      });
      TweenMax.to(this.hint, 0.3, { alpha: 1, ease: this.ease });
    } else {
      TweenMax.to(this.img, 0.2, { y: AppData.MENU_PANNEL / 2 });
      TweenMax.to(this.hint, 0.3, { alpha: 0, ease: this.ease });
    }
    return null;
  }

  onDown() {
    if (this.selected === true) {
      return;
    }
    this.buttonClick();
    return null;
  }

  onUp() {
    if (!this.enabled || this.selected === true) {
      return;
    }
    this.onOut();
    return null;
  }

  onOver() {
    if (!this.enabled || this.selected === true) {
      return;
    }
    TweenMax.to(this, 0, { alpha: this.overAlpha, ease: this.ease });
    return null;
  }

  onOut() {
    if (!this.enabled || this.selected === true) {
      return;
    }
    TweenMax.to(this, this.duration, { alpha: this.outAlpha, ease: this.ease });
    return null;
  }

  select(value) {
    this.selected = value;
    TweenMax.to(this, 0, {
      alpha: this.selected === false ? this.outAlpha : this.overAlpha,
      ease: this.ease
    });
    return null;
  }

  buttonClick() {
    // to be override
    return null;
  }

  enable() {
    this.interactive = this.buttonMode = this.enabled = true;
    if (Modernizr.touch) {
      this.on("touchstart", this.onDown);
      this.on("touchend", this.onUp);
      this.on("touchendoutside", this.onOut);
    } else {
      this.on("mousedown", this.onDown);
      this.on("mouseup", this.onUp);
      this.on("mouseout", this.onOut);
      this.on("mouseover", this.onOver);
      this.on("mouseupoutside", this.onOut);
    }
    return null;
  }

  disable() {
    this.interactive = this.buttonMode = this.enabled = false;
    if (Modernizr.touch) {
      this.off("touchstart", this.onDown);
      this.off("touchend", this.onUp);
      this.off("touchendoutside", this.onOut);
    } else {
      this.off("mousedown", this.onDown);
      this.off("mouseup", this.onUp);
      this.off("mouseout", this.onOut);
      this.off("mouseover", this.onOver);
      this.off("mouseupoutside", this.onOut);
    }
    return null;
  }
}
