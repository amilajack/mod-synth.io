/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.menu.Pannel
class AddPannel extends Pannel {
  constructor(label) {
    super(label);

    this.nsg = new SubmenuButtonAdd(
      "Noise Generator",
      AppData.ASSETS.sprite.textures["comp-3-fill.png"],
      AppData.COLORS[AppData.COMPONENTS.NSG]
    );
    this.nsg.buttonClick = () => {
      this.addComponent(0);
      return null;
    };
    this.addChild(this.nsg);
    this.elements.push(this.nsg);

    this.osc = new SubmenuButtonAdd(
      "Oscillator",
      AppData.ASSETS.sprite.textures["comp-4-fill.png"],
      AppData.COLORS[AppData.COMPONENTS.OSC]
    );
    this.osc.buttonClick = () => {
      this.addComponent(1);
      return null;
    };
    this.addChild(this.osc);
    this.elements.push(this.osc);

    this.env = new SubmenuButtonAdd(
      "Envelope",
      AppData.ASSETS.sprite.textures["comp-5-fill.png"],
      AppData.COLORS[AppData.COMPONENTS.ENV]
    );
    this.env.buttonClick = () => {
      this.addComponent(2);
      return null;
    };
    this.addChild(this.env);
    this.elements.push(this.env);

    this.flt = new SubmenuButtonAdd(
      "Filter",
      AppData.ASSETS.sprite.textures["comp-6-fill.png"],
      AppData.COLORS[AppData.COMPONENTS.FLT]
    );
    this.flt.buttonClick = () => {
      this.addComponent(3);
      return null;
    };
    this.addChild(this.flt);
    this.elements.push(this.flt);

    this.ptg = new SubmenuButtonAdd(
      "Pattern Gate",
      AppData.ASSETS.sprite.textures["comp-7-fill.png"],
      AppData.COLORS[AppData.COMPONENTS.PTG]
    );
    this.ptg.buttonClick = () => {
      this.addComponent(4);
      return null;
    };
    this.addChild(this.ptg);
    this.elements.push(this.ptg);

    this.lfo = new SubmenuButtonAdd(
      "Low Frequency Oscillator",
      AppData.ASSETS.sprite.textures["comp-10-fill.png"],
      AppData.COLORS[AppData.COMPONENTS.LFO]
    );
    this.lfo.buttonClick = () => {
      this.addComponent(5);
      return null;
    };
    this.addChild(this.lfo);
    this.elements.push(this.lfo);

    this.align();
  }

  align() {
    let c = 0;
    for (
      let i = 0, end = this.elements.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      if (i % 2 === 0) {
        this.elements[i].x = 0;
      } else {
        this.elements[i].x = AppData.SUBMENU_PANNEL / 2;
      }

      if (i % 2 === 0) {
        c++;
      }

      this.elements[i].y =
        AppData.MENU_PANNEL +
        AppData.SUBMENU_PANNEL / 2 * c -
        AppData.SUBMENU_PANNEL / 2;
    }
    return null;
  }

  addComponent(type_uid) {
    // adds new component
    const component = {
      type_uid: type_uid
    };
    const data = Session.ADD(component);

    App.ADD.dispatch(data);
    App.SETTINGS_CHANGE.dispatch({ component: data.component_session_uid });

    App.AUTO_SAVE.dispatch({
      component_session_uid: data.component_session_uid
    });

    for (let id in Session.patch.presets) {
      Services.api.presets.updateAdd(id, data);
    }
    return null;
  }
}
