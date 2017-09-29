/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Pad extends PIXI.Container {
  constructor(index, size) {
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
    this.index = index;
    this.size = size;
    super();

    this.__alpha = this.last = 0.2;

    this.title = new PIXI.Text(this.index + 1, AppData.TEXTFORMAT.SETTINGS_PAD);
    this.title.scale.x = this.title.scale.y = 0.5;
    this.title.anchor.x = 0.5;
    this.title.anchor.y = 0;
    this.title.x = this.size / 2;
    this.title.y = 32 * AppData.RATIO;
    this.title.tint = 0xffffff;
    this.title.alpha = this.__alpha;
    this.addChild(this.title);

    this.icon = new PIXI.Graphics();
    this.addChild(this.icon);

    this._selected = 1;
    this._tick = 0.5;
    this._unselected = 0.2;

    this.active = false;
    this.interactive = this.buttonMode = true;
    this.draw();
    if (Modernizr.touch) {
      this.on("touchstart", this.onDown);
    } else {
      this.on("mousedown", this.onDown);
    }
  }

  draw() {
    this.icon.clear();
    this.icon.beginFill(0x00ffff, 0);
    this.icon.drawRect(0, 0, this.size, AppData.ICON_SIZE_1);
    this.icon.endFill();

    this.icon.drawRect(0, 0, this.size, AppData.ICON_SIZE_1);
    this.icon.beginFill(0xffffff, this.__alpha);
    this.icon.drawRect(4 * AppData.RATIO, 0, this.size - 8 * AppData.RATIO, 4);
    this.icon.endFill();
    return null;
  }

  onDown() {
    this.buttonClick(this.index);
    return null;
  }

  select() {
    this.__alpha = this._selected;
    this.draw();
    return null;
  }

  unselect() {
    this.__alpha = this._unselected;
    this.draw();
    return null;
  }

  tick() {
    this.__alpha = this._tick;
    this.draw();
    return null;
  }

  untick() {
    this.__alpha = this.active === true ? this._selected : this._unselected;
    this.draw();
    return null;
  }

  buttonClick(id) {
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
