/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class SubmenuButtonAdd extends PIXI.Container {
  constructor(label, texture, color) {
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
    super();

    App.HELP.add(this.onHelp);

    this.duration = 0.3;
    this.ease = Quad.easeInOut;
    this.enabled = false;
    this.scaleFactor = 0.45;

    const width = Math.round(texture.width * this.scaleFactor);
    const height = Math.round(texture.height * this.scaleFactor);

    this.img = new PIXI.Sprite(texture);
    this.img.anchor.x = 0.5;
    this.img.anchor.y = 1;
    this.img.scale.x = this.img.scale.y = this.scaleFactor;
    this.img.position.x = AppData.SUBMENU_PANNEL / 4;
    this.img.position.y = AppData.SUBMENU_PANNEL / 2 - AppData.PADDING;
    this.img.tint = color;
    this.addChild(this.img);

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0x00ffff, 0);
    this.graphics.drawRect(
      0,
      0,
      AppData.SUBMENU_PANNEL / 2,
      AppData.SUBMENU_PANNEL / 2
    );
    this.addChild(this.graphics);

    const textFormat = Session.DUPLICATE_OBJECT(
      AppData.TEXTFORMAT.MENU_SUBTITLE
    );
    textFormat.align = "center";
    textFormat.wordWrap = true;
    textFormat.wordWrapWidth = 300 * AppData.RATIO;

    this.hint = new PIXI.Text(label, textFormat);
    this.hint.anchor.x = 0.5;
    this.hint.anchor.y = 0;
    this.hint.tint = 0x646464;
    this.hint.scale.x = this.hint.scale.y = 0.5;
    this.hint.position.x = AppData.SUBMENU_PANNEL / 4;
    this.hint.position.y = AppData.SUBMENU_PANNEL / 2 - AppData.PADDING / 2;
    // @hint.visible = AppData.SHOW_LABELS
    this.addChild(this.hint);

    this.hitArea = new PIXI.Rectangle(
      0,
      0,
      AppData.SUBMENU_PANNEL / 2,
      AppData.SUBMENU_PANNEL / 2
    );

    this.enable();
  }

  onHelp(value) {
    // @hint.visible = value
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
    if (!this.enabled) {
      return;
    }
    TweenMax.to(this.hint, 0, { tint: 0xffffff, ease: this.ease });
    return null;
  }

  onOut() {
    if (!this.enabled) {
      return;
    }
    TweenMax.to(this.hint, 0, { tint: 0x646464, ease: this.ease });
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
