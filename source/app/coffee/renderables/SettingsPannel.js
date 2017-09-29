/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.buttons.Radio
// import renderables.settings.*
class SettingsPannel extends PIXI.Sprite {
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
    this.onToggle = this.onToggle.bind(this);
    super();

    this.pannelShow = false;

    App.TOGGLE_SETTINGS_PANNEL_HEIGHT.add(this.onToggle);

    this.theMask = new PIXI.Graphics();
    this.addChild(this.theMask);

    this.holder = new PIXI.Container();
    this.holder.mask = this.theMask;
    this.addChild(this.holder);

    this.graphics = new PIXI.Graphics();
    this.holder.addChild(this.graphics);

    this.settingsHolder = new PIXI.Container();
    this.holder.addChild(this.settingsHolder);
  }

  resize() {
    this.theMask.clear();
    this.theMask.beginFill(0xff00ff);
    this.theMask.moveTo(0, 0);
    this.theMask.lineTo(AppData.WIDTH, 0);
    this.theMask.lineTo(AppData.WIDTH, AppData.SETTINGS_PANNEL_HEIGHT + 1);
    this.theMask.lineTo(0, AppData.SETTINGS_PANNEL_HEIGHT + 1);
    this.theMask.lineTo(0, 0);
    this.theMask.endFill();

    this.graphics.clear();

    this.graphics.beginFill(0x232323, 0.97);
    this.graphics.lineStyle(1, 0x000000, 0.2);
    this.graphics.moveTo(0, 0);
    this.graphics.lineTo(AppData.WIDTH + 1, 0);
    this.graphics.lineTo(AppData.WIDTH + 1, AppData.SETTINGS_PANNEL_HEIGHT);
    this.graphics.lineTo(0, AppData.SETTINGS_PANNEL_HEIGHT);
    this.graphics.lineTo(0, 0);
    this.graphics.endFill();

    if (this.pannelShow) {
      this.theMask.y = 0;
    } else {
      this.theMask.y = AppData.SETTINGS_PANNEL_HEIGHT;
    }
    return null;
  }

  onToggle(value) {
    if (value.type) {
      let s;
      this.removeAllFromSettings();

      switch (Session.GET(value.component_session_uid).type_uid) {
        case AppData.COMPONENTS.NSG:
          s = new NsgSettings(value.component_session_uid);
          break;
        case AppData.COMPONENTS.OSC:
          s = new OscSettings(value.component_session_uid);
          break;
        case AppData.COMPONENTS.ENV:
          s = new EnvSettings(value.component_session_uid);
          break;
        case AppData.COMPONENTS.FLT:
          s = new FltSettings(value.component_session_uid);
          break;
        case AppData.COMPONENTS.PTG:
          s = new PtgSettings(value.component_session_uid);
          break;
        case AppData.COMPONENTS.LFO:
          s = new LfoSettings(value.component_session_uid);
          break;
        default:
          return;
      }

      this.settingsHolder.addChild(s);
      App.SETTINGS_CHANGE.dispatch({ component: value.component_session_uid });
      this.open();
    } else {
      this.close();
    }
    return null;
  }

  removeAllFromSettings() {
    for (
      let i = 0, end = this.settingsHolder.children.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      const child = this.settingsHolder.children[0];
      this.settingsHolder.removeChild(child);
    }
    return null;
  }

  open() {
    this.pannelShow = true;
    this.settingsHolder.visible = true;
    TweenMax.to(this.theMask, 0.1, { y: 0 });
    this.hitArea = new PIXI.Rectangle(
      0,
      0,
      AppData.WIDTH,
      AppData.SETTINGS_PANNEL_HEIGHT
    );
    return null;
  }

  close() {
    this.pannelShow = false;
    TweenMax.to(this.theMask, 0.1, {
      y: AppData.SETTINGS_PANNEL_HEIGHT,
      onComplete: () => {
        this.settingsHolder.visible = false;
        return null;
      }
    });
    this.hitArea = new PIXI.Rectangle(0, 0, AppData.WIDTH, 0);
    return null;
  }
}
