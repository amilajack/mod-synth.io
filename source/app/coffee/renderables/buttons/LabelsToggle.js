/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class LabelsToggle extends PIXI.Container {
  constructor(selected) {
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
    if (selected == null) {
      selected = false;
    }
    this.selected = selected;
    super();

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0x00ffff, 0);
    this.graphics.drawRect(0, 0, AppData.MENU_PANNEL, AppData.ICON_SIZE_1);
    this.addChild(this.graphics);

    const img = new PIXI.Sprite(
      AppData.ASSETS.sprite.textures["help-toggle-bg.png"]
    );
    img.anchor.x = 0.5;
    img.anchor.y = 0;
    img.x = AppData.MENU_PANNEL / 2;
    this.addChild(img);

    this.selector = new PIXI.Sprite(
      AppData.ASSETS.sprite.textures["help-toggle-selector.png"]
    );
    this.selector.x = 32 * AppData.RATIO;
    this.selector.y = 3 * AppData.RATIO;
    this.selector.alpha = 0.5;
    this.addChild(this.selector);

    this.duration = 0.3;
    this.ease = Quad.easeInOut;
    this.enabled = false;
    this.overAlpha = 1.0;
    this.outAlpha = 0.65;

    this.label = new PIXI.Text("LABELS OFF", AppData.TEXTFORMAT.HINT);
    this.label.anchor.x = 0.5;
    this.label.anchor.y = 1;
    this.label.scale.x = this.label.scale.y = 0.5;
    this.label.position.x = AppData.MENU_PANNEL / 2;
    this.label.position.y = AppData.ICON_SIZE_1;
    this.addChild(this.label);

    this.hitArea = new PIXI.Rectangle(
      0,
      0,
      AppData.MENU_PANNEL,
      AppData.ICON_SIZE_1
    );

    this.alpha = this.outAlpha;

    this.enable();

    if (this.selected === true) {
      this.onOver();
    }
    this.swap();
  }

  onDown() {
    this.selected = !this.selected;
    this.swap();
    this.onOver();
    this.buttonClick();
    return null;
  }

  swap() {
    TweenMax.to(this.selector, 0.3, {
      x: (this.selected === true ? 49 : 32) * AppData.RATIO,
      alpha: this.selected === true ? 1 : 0.5,
      ease: Power2.easeInOut
    });
    this.label.text = `LABELS ${this.selected === true ? "ON" : "OFF"}`;
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
    if (this.selected) {
      return;
    }
    TweenMax.to(this, this.duration, { alpha: this.outAlpha, ease: this.ease });
    return null;
  }

  buttonClick() {
    // to be override
    return null;
  }

  select(value) {
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
