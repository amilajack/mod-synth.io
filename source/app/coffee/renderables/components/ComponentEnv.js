/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.components.ComponentBase
class ComponentEnv extends ComponentBase {
  constructor(component_session_uid) {
    super(component_session_uid);

    // textures
    this.bg.texture = AppData.ASSETS.sprite.textures["comp-5-fill.png"];
    this.over.texture = AppData.ASSETS.sprite.textures["comp-5-ol.png"];

    // title
    const pos = AppData.ASSETS.sprite.data.frames["comp-5-fill.png"].sourceSize;

    // label
    this.label.anchor.x = 0.5;
    this.label.y = pos.h / -2 + 24 * AppData.RATIO;

    const c = document.createElement("canvas");
    c.width = AppData.ICON_SIZE_2 * 2;
    c.height = AppData.ICON_SIZE_2 * 2;
    this.context = c.getContext("2d");

    this.vertices = [
      { x: -0.0 * AppData.RATIO, y: -1.9 * AppData.RATIO },
      { x: 2.04 * AppData.RATIO, y: -0.35 * AppData.RATIO },
      { x: 1.25 * AppData.RATIO, y: 1.95 * AppData.RATIO },
      { x: -1.25 * AppData.RATIO, y: 1.95 * AppData.RATIO },
      { x: -2.04 * AppData.RATIO, y: -0.35 * AppData.RATIO }
    ];
    this.change();
  }

  change() {
    let fillColor;
    if (Session.SETTINGS[this.component_session_uid].settings.bypass === true) {
      this.__color = 0x3c3c3c;
      this.__alpha = 0.2;
      fillColor = 0x636363;
    } else if (
      Session.SETTINGS[this.component_session_uid].settings.bypass === false
    ) {
      this.__color = AppData.COLORS[AppData.COMPONENTS.ENV];
      this.__alpha = 1;
      fillColor = 0xffffff;
    }

    this.icon.alpha = this.__alpha;
    this.label.alpha = this.__alpha;

    let availableSustain = AppData.ICON_SIZE_2;
    const step = AppData.ICON_SIZE_2 / 4;

    // ADSR graphic
    const x0 = 0;
    const y0 = AppData.ICON_SIZE_2;
    const x1 = MathUtils.map(
      Session.SETTINGS[this.component_session_uid].settings.attack,
      0,
      1000,
      0,
      step
    );
    const y1 = 0;
    availableSustain -= x1;
    const x2 = MathUtils.map(
      Session.SETTINGS[this.component_session_uid].settings.decay,
      0,
      1000,
      x1,
      x1 + step
    );
    const y2 = MathUtils.map(
      Session.SETTINGS[this.component_session_uid].settings.sustain,
      0,
      100,
      AppData.ICON_SIZE_2,
      0
    );
    availableSustain -=
      x2 -
      x1 +
      MathUtils.map(
        Session.SETTINGS[this.component_session_uid].settings.release,
        0,
        1000,
        0,
        step
      );
    const x3 = x2 + availableSustain;
    const y3 = y2;
    const x4 = MathUtils.map(
      Session.SETTINGS[this.component_session_uid].settings.release,
      0,
      1000,
      x3,
      x3 + step
    );
    const y4 = AppData.ICON_SIZE_2;

    // draw it to offscreen canvas
    const ix = AppData.ICON_SIZE_2 / 2;
    const iy = AppData.ICON_SIZE_2 / 2;

    this.context.clearRect(
      0,
      0,
      AppData.ICON_SIZE_2 * 2,
      AppData.ICON_SIZE_2 * 2
    );
    this.context.strokeStyle = "#ffffff";
    this.context.lineWidth = 1.5 * AppData.RATIO;
    this.context.beginPath();
    this.context.moveTo(ix + x0, iy + y0);
    this.context.lineTo(ix + x1, iy + y1);
    this.context.lineTo(ix + x2, iy + y2);
    this.context.lineTo(ix + x3, iy + y3);
    this.context.lineTo(ix + x4, iy + y4);
    this.context.stroke();

    this.icon.texture = PIXI.Texture.fromCanvas(this.context.canvas);
    this.icon.texture.update();
    this.bg.tint = this.__color;
    return null;
  }
}
