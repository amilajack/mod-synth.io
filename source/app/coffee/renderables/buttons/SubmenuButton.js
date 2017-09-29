/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class SubmenuButton extends PIXI.Container {
  constructor(label, opt_texture) {
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
    this.onDown = this.onDown.bind(this);
    this.onUp = this.onUp.bind(this);
    this.onOver = this.onOver.bind(this);
    this.onOut = this.onOut.bind(this);
    super();

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0x00ffff, 0);
    this.graphics.drawRect(0, 0, AppData.SUBMENU_PANNEL, AppData.ICON_SIZE_1);
    this.addChild(this.graphics);

    this.duration = 0.3;
    this.ease = Quad.easeInOut;
    this.enabled = false;
    this.overAlpha = 1.0;
    this.outAlpha = 0.65;

    this.img = new PIXI.Sprite(opt_texture);
    this.img.anchor.x = 0.5;
    this.img.anchor.y = 0.5;
    this.img.x = AppData.PADDING + AppData.ICON_SIZE_2 / 2;
    this.img.y = AppData.ICON_SIZE_1 / 2;
    if (opt_texture) {
      this.addChild(this.img);
      this.graphics.beginFill(0x00ffff, 0);
      this.graphics.drawRect(
        AppData.PADDING,
        0,
        AppData.ICON_SIZE_2,
        AppData.ICON_SIZE_1
      );
    }

    this.label = new PIXI.Text(label.toUpperCase(), AppData.TEXTFORMAT.MENU);
    this.label.anchor.y = 0.5;
    this.label.scale.x = this.label.scale.y = 0.5;
    this.label.position.x = opt_texture
      ? AppData.ICON_SIZE_2 + 40 * AppData.RATIO
      : AppData.PADDING;
    this.label.position.y = AppData.ICON_SIZE_1 / 2;
    this.addChild(this.label);

    this.hitArea = new PIXI.Rectangle(
      0,
      0,
      AppData.SUBMENU_PANNEL,
      AppData.ICON_SIZE_1
    );

    this.alpha = this.outAlpha;
    this.enable();
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
    if (!this.enabled) {
      return;
    }
    TweenMax.to(this, 0, { alpha: this.overAlpha, ease: this.ease });
    return null;
  }

  onOut() {
    if (!this.enabled) {
      return;
    }
    TweenMax.to(this, this.duration, { alpha: this.outAlpha, ease: this.ease });
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
