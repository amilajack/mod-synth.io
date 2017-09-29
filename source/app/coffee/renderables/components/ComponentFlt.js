/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.components.ComponentBase
class ComponentFlt extends ComponentBase {
  constructor(component_session_uid) {
    super(component_session_uid);

    // textures
    this.bg.texture = AppData.ASSETS.sprite.textures["comp-6-fill.png"];
    this.over.texture = AppData.ASSETS.sprite.textures["comp-6-ol.png"];
    this.icon.texture = AppData.ASSETS.sprite.textures["ic-comp-lpf-48.png"];

    // title
    const pos = AppData.ASSETS.sprite.data.frames["comp-6-fill.png"].sourceSize;
    this.label.anchor.x = 0.5;
    this.label.y = pos.h / -2 + 24 * AppData.RATIO;

    this.vertices = [
      { x: -1.05 * AppData.RATIO, y: -1.83 * AppData.RATIO },
      { x: 1.05 * AppData.RATIO, y: -1.83 * AppData.RATIO },
      { x: 2.12 * AppData.RATIO, y: 0.02 * AppData.RATIO },
      { x: 1.05 * AppData.RATIO, y: 1.83 * AppData.RATIO },
      { x: -1.05 * AppData.RATIO, y: 1.83 * AppData.RATIO },
      { x: -2.12 * AppData.RATIO, y: 0.02 * AppData.RATIO }
    ];
    this.change();
  }

  change() {
    if (Session.SETTINGS[this.component_session_uid].settings.bypass === true) {
      this.__color = 0x3c3c3c;
      this.__alpha = 0.2;
    } else if (
      Session.SETTINGS[this.component_session_uid].settings.bypass === false
    ) {
      this.__color = AppData.COLORS[AppData.COMPONENTS.FLT];
      this.__alpha = 1;
    }

    this.label.alpha = this.__alpha;
    this.bg.tint = this.__color;
    return null;
  }
}
