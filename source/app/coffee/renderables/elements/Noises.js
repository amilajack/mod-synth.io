/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.buttons.Slider
class Noises extends Slider {
  constructor(component_session_uid) {
    let index;
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
    this.onEnd = this.onEnd.bind(this);
    this.onSettingsChange = this.onSettingsChange.bind(this);
    this.component_session_uid = component_session_uid;
    super();

    App.SETTINGS_CHANGE.add(this.onSettingsChange);

    this.possibleValues = [
      AppData.NOISE_TYPE.WHITE,
      AppData.NOISE_TYPE.PINK,
      AppData.NOISE_TYPE.BROWN
    ];

    this.steps = this.possibleValues.length;
    this.snap = true;

    this.elements = [
      AppData.ASSETS.sprite.textures["ic-noise-white-32.png"],
      AppData.ASSETS.sprite.textures["ic-noise-pink-32.png"],
      AppData.ASSETS.sprite.textures["ic-noise-brown-32.png"]
    ];

    for (
      let i = 0, end = this.possibleValues.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      if (
        Session.SETTINGS[this.component_session_uid].settings.noise_type ===
        this.possibleValues[i]
      ) {
        index = i;
        continue;
      }
    }
    this.percentage = MathUtils.map(
      index,
      0,
      this.possibleValues.length,
      0,
      100,
      true
    );

    this.title = new PIXI.Text("NOISE", AppData.TEXTFORMAT.SETTINGS_LABEL);
    this.title.scale.x = this.title.scale.y = 0.5;
    this.title.anchor.x = 0.5;
    this.title.x = AppData.ICON_SIZE_1 / 2;
    this.title.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
    this.title.tint = 0x646464;
    this.addChild(this.title);

    this.texture = new PIXI.Sprite();
    this.texture.anchor.x = 0.5;
    this.texture.anchor.y = 1;
    this.texture.x = AppData.ICON_SIZE_1 / 2;
    this.texture.y = AppData.ICON_SIZE_1;
    this.texture.tint = 0xffffff;
    this.addChild(this.texture);
  }

  onEnd(e) {
    super.onEnd(e);
    if (this.lastValue === this.percentage) {
      let next =
        Session.SETTINGS[this.component_session_uid].settings.noise_type + 1;
      next %= this.possibleValues.length;
      this.percentage = MathUtils.map(
        next,
        0,
        this.possibleValues.length - 1,
        0,
        100
      );
      this.onUpdate();
    }
    return null;
  }

  onSettingsChange(event) {
    if (event.component === this.component_session_uid) {
      this.texture.texture = this.elements[
        Session.SETTINGS[this.component_session_uid].settings.noise_type
      ];
    }
    return null;
  }

  onUpdate() {
    Session.SETTINGS[
      this.component_session_uid
    ].settings.noise_type = MathUtils.map(
      this.percentage,
      0,
      100,
      0,
      this.possibleValues.length - 1,
      true
    );
    App.SETTINGS_CHANGE.dispatch({ component: this.component_session_uid });
    return null;
  }
}
