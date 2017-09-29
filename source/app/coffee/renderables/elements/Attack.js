/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.buttons.Slider
class Attack extends Slider {
  constructor(component_session_uid) {
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

    this.range = {
      min: 0,
      max: 100
    };

    this.percentage = MathUtils.map(
      Session.SETTINGS[this.component_session_uid].settings.attack,
      this.range.min,
      this.range.max,
      0,
      100,
      true
    );

    this.title = new PIXI.Text("ATTACK", AppData.TEXTFORMAT.SETTINGS_LABEL);
    this.title.scale.x = this.title.scale.y = 0.5;
    this.title.anchor.x = 0.5;
    this.title.x = AppData.ICON_SIZE_1 / 2;
    this.title.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
    this.title.tint = 0x646464;
    this.addChild(this.title);

    this.value = new PIXI.Text("", AppData.TEXTFORMAT.SETTINGS_NUMBER);
    this.value.scale.x = this.value.scale.y = 0.5;
    this.value.anchor.x = 0.5;
    this.value.anchor.y = 1;
    this.value.x = AppData.ICON_SIZE_1 / 2;
    this.value.y = AppData.ICON_SIZE_1 + 6 * AppData.RATIO;
    this.addChild(this.value);

    this.unit = new PIXI.Text(
      "ms",
      AppData.TEXTFORMAT.SETTINGS_NUMBER_POSTSCRIPT
    );
    this.unit.scale.x = this.unit.scale.y = 0.5;
    this.unit.y = 17 * AppData.RATIO;
    this.unit.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
    this.addChild(this.unit);
  }

  onEnd(e) {
    super.onEnd(e);
    if (this.lastValue === this.percentage) {
      const value = 100 / (this.range.max - this.range.min);
      this.percentage += value;
      if (this.percentage >= value * (this.range.max - this.range.min)) {
        this.percentage = 0;
      }
      this.onUpdate();
    }
    return null;
  }

  onSettingsChange(event) {
    if (event.component === this.component_session_uid) {
      this.value.text =
        Session.SETTINGS[this.component_session_uid].settings.attack;
      this.unit.x = this.value.x + this.value.width / 2;
    }
    return null;
  }

  onUpdate() {
    Session.SETTINGS[
      this.component_session_uid
    ].settings.attack = MathUtils.map(
      this.percentage,
      0,
      100,
      this.range.min,
      this.range.max,
      true
    );
    App.SETTINGS_CHANGE.dispatch({ component: this.component_session_uid });
    return null;
  }
}
