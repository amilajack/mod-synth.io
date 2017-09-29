class Soon extends PIXI.Sprite {
  constructor() {
    super();

    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    this.hint = new PIXI.Text(
      "Your device resolution is too small.",
      AppData.TEXTFORMAT.SOON
    );
    this.hint.anchor.x = 0.5;
    this.hint.anchor.y = 1;
    this.hint.scale.x = this.hint.scale.y = 0.5;
    this.hint.tint = 0xffffff;
    this.hint.y = 50 * AppData.RATIO;
    this.hint.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
    this.addChild(this.hint);

    this.hint2 = new PIXI.Text(
      "Please visit on your Desktop or Tablet.",
      AppData.TEXTFORMAT.SOON
    );
    this.hint2.anchor.x = 0.5;
    this.hint2.anchor.y = 1;
    this.hint2.scale.x = this.hint2.scale.y = 0.5;
    this.hint2.tint = 0xffffff;
    this.hint2.y = 70 * AppData.RATIO;
    this.hint2.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
    this.addChild(this.hint2);
  }
}
