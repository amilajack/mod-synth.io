/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.elements.*
class Pannel extends PIXI.Container {
  constructor(label) {
    super();

    this.label = new PIXI.Text(
      label.toUpperCase(),
      AppData.TEXTFORMAT.PANNEL_TITLE
    );
    this.label.scale.x = this.label.scale.y = 0.5;
    this.label.anchor.x = 0;
    this.label.anchor.y = 0.5;
    this.label.position.x = AppData.PADDING;
    this.label.position.y = AppData.MENU_PANNEL / 2;
    this.addChild(this.label);

    this.elements = [];
  }

  align() {
    for (
      let i = 0, end = this.elements.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      if (i === 0) {
        this.elements[i].y = AppData.MENU_PANNEL;
      } else {
        this.elements[i].y =
          this.elements[i - 1].y + this.elements[i - 1].height;
      }
    }
    return null;
  }
}
