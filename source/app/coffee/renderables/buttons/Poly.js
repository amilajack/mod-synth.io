/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Poly extends PIXI.Container {
  constructor() {
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
    super();

    this.img = new PIXI.Sprite(
      AppData.ASSETS.sprite.textures["poly-capsule.png"]
    );
    this.addChild(this.img);

    this.title = new PIXI.Text("POLY", AppData.TEXTFORMAT.SETTINGS_SMB);
    this.title.scale.x = this.title.scale.y = 0.5;
    this.title.anchor.x = 0.5;
    this.title.anchor.y = 0.5;
    this.title.x = this.img.width / 2;
    this.title.y = this.img.height / 2;
    this.title.tint = 0x5a5a5a;
    this.addChild(this.title);

    this.active = false;
    this.interactive = this.buttonMode = true;
    if (Modernizr.touch) {
      this.on("touchstart", this.onDown);
    } else {
      this.on("mousedown", this.onDown);
    }
  }

  onDown() {
    this.buttonClick();
    return null;
  }

  select() {
    this.img.texture = AppData.ASSETS.sprite.textures["poly-capsule-fill.png"];
    this.img.tint = 0xffffff;

    TweenMax.to(this.img, 0, { alpha: 1.0, ease: Quad.easeInOut });
    return null;
  }

  unselect() {
    TweenMax.to(this.img, 0, { alpha: 0.2, ease: Quad.easeInOut });
    this.img.texture = AppData.ASSETS.sprite.textures["poly-capsule.png"];
    this.img.tint = 0x5a5a5a;
    return null;
  }

  buttonClick() {
    return null;
  }

  setActive(value) {
    this.active = value;
    if (this.active) {
      this.select();
    } else {
      this.unselect();
    }
    return null;
  }
}
