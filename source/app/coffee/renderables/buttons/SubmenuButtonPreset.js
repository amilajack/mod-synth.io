/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class SubmenuButtonPreset extends PIXI.Container {
  constructor(label, date, extraButton) {
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
    if (extraButton == null) {
      extraButton = false;
    }
    this.extraButton = extraButton;
    super();

    this.data = {
      label,
      date
    };

    const limit = AppData.ICON_SIZE_1 * 2;
    const iconSize = 8 * AppData.RATIO;

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0x00ffff, 0);
    this.graphics.drawRect(
      0,
      0,
      AppData.SUBMENU_PANNEL - limit,
      AppData.ICON_SIZE_1
    );
    this.addChild(this.graphics);

    this.duration = 0.3;
    this.ease = Quad.easeInOut;
    this.enabled = false;
    this.selected = false;
    this.overAlpha = 1.0;
    this.outAlpha = 0.65;

    this.label = new PIXI.Text(label.toUpperCase(), AppData.TEXTFORMAT.MENU);
    this.label.anchor.y = 1;
    this.label.scale.x = this.label.scale.y = 0.5;
    this.label.position.x = AppData.PADDING;
    this.label.position.y = AppData.ICON_SIZE_1 / 2;
    this.addChild(this.label);

    this.date = new PIXI.Text(date, AppData.TEXTFORMAT.MENU);
    this.date.tint = 0x646464;
    this.date.anchor.y = 0;
    this.date.scale.x = this.date.scale.y = 0.5;
    this.date.position.x = AppData.PADDING * 2;
    this.date.position.y = AppData.ICON_SIZE_1 / 2;
    this.addChild(this.date);

    this.img = new PIXI.Sprite(
      AppData.ASSETS.sprite.textures["ic-selection-active.png"]
    );
    this.img.tint = 0xff0000;
    this.img.anchor.x = 0;
    this.img.anchor.y = 0.5;
    this.img.scale.x = this.img.scale.y = 0.5;
    this.img.x = AppData.PADDING;
    this.img.y = AppData.ICON_SIZE_1 / 2 + iconSize;
    this.addChild(this.img);

    if (this.extraButton) {
      this.remove = new ICButton(
        AppData.ASSETS.sprite.textures["ic-remove-32.png"],
        ""
      );
      this.remove.x = AppData.SUBMENU_PANNEL - limit / 2 - 10 * AppData.RATIO;
      this.remove.y = 0;
      this.addChild(this.remove);
    }

    this.hitArea = new PIXI.Rectangle(
      0,
      0,
      AppData.SUBMENU_PANNEL - limit,
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
    if (this.selected) {
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

  setCurrent(value) {
    this.selected = value;

    if (value === true) {
      this.img.visible = true;
      this.date.x = this.img.x + this.img.width + AppData.PADDING / 4;
      if (Session.patch.uid !== "default") {
        this.date.text = "Currently editing";
        this.img.tint = 0x00ff00;
      } else {
        this.date.text = "Currently selected";
        this.img.tint = 0xff0000;
      }

      TweenMax.to(this, 0, { alpha: this.overAlpha, ease: this.ease });
    } else {
      this.img.visible = false;
      this.date.x = AppData.PADDING;
      this.date.text = this.data.date;
      TweenMax.to(this, this.duration, {
        alpha: this.outAlpha,
        ease: this.ease
      });
    }
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
