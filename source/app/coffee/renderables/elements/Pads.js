/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.buttons.Pad
class Pads extends PIXI.Container {
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
    this.resize = this.resize.bind(this);
    this.handlePad = this.handlePad.bind(this);
    this.onSettingsChange = this.onSettingsChange.bind(this);
    this.onPadChange = this.onPadChange.bind(this);
    this.component_session_uid = component_session_uid;
    super();

    App.SETTINGS_CHANGE.add(this.onSettingsChange);
    App.PATTERN_GATE.add(this.onPadChange);
    this.total = 16;
  }

  resize() {
    this.availableArea =
      AppData.WIDTH -
      AppData.PADDING -
      AppData.ICON_SIZE_1 -
      AppData.PADDING -
      this.x;
    this.itemArea = this.availableArea / this.total;

    this.removePads();
    this.addPads();
    return null;
  }

  removePads() {
    for (
      let i = 0, end = this.children.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      const child = this.children[0];
      this.removeChild(child);
    }
    return null;
  }

  addPads() {
    for (
      let i = 0, end = this.total, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      const pad = new Pad(i, this.itemArea);
      pad.x = this.itemArea * i;
      pad.setActive(
        Session.SETTINGS[this.component_session_uid].settings.pattern[i]
      );
      pad.buttonClick = this.handlePad;
      this.addChild(pad);
    }
    return null;
  }

  handlePad(index) {
    Session.SETTINGS[this.component_session_uid].settings.pattern[index] = !this
      .children[index].active;
    App.SETTINGS_CHANGE.dispatch({ component: this.component_session_uid });
    return null;
  }

  onSettingsChange(event) {
    if (event.component === this.component_session_uid) {
      for (
        let i = 0,
          end =
            Session.SETTINGS[this.component_session_uid].settings.pattern
              .length,
          asc = 0 <= end;
        asc ? i < end : i > end;
        asc ? i++ : i--
      ) {
        this.children[i].setActive(
          Session.SETTINGS[this.component_session_uid].settings.pattern[i]
        );
      }
    }
    return null;
  }

  onPadChange(pad) {
    const tick = pad;
    let untick = pad - 1;
    if (pad === 0) {
      untick = 15;
    }

    this.children[tick].tick();
    this.children[untick].untick();
    return null;
  }
}
