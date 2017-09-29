/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.menu.Pannel
class PresetsPannel extends Pannel {
  constructor(label) {
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
    this.build = this.build.bind(this);
    this.createPreset = this.createPreset.bind(this);
    this.attachButtonClick = this.attachButtonClick.bind(this);
    this.onPresetChanged = this.onPresetChanged.bind(this);
    super(label);

    this.elements = [];

    App.PATCH_CHANGED.add(this.build);
    App.PRESET_CHANGED.add(this.onPresetChanged);
    this.build();
  }

  clear() {
    for (
      let i = 0, end = this.children.length - 1, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      this.removeChild(this.children[1]);
    }
    this.elements = [];
    return null;
  }

  build() {
    this.clear();

    let isLoggedIn = Services.REFERENCE.auth().currentUser || false;
    if (Session.patch.uid === "default") {
      isLoggedIn = false;
    }

    this.button_NEW = new SubmenuButton(
      "Create new preset",
      AppData.ASSETS.sprite.textures["ic-add-32.png"]
    );
    this.button_NEW.buttonClick = this.createPreset;
    this.button_NEW.y = AppData.MENU_PANNEL;
    this.button_NEW.visible = isLoggedIn;
    this.addChild(this.button_NEW);

    this.description = new PIXI.Text(
      "You can't add presets to the default patch.",
      AppData.TEXTFORMAT.MENU_DESCRIPTION
    );
    this.description.scale.x = this.description.scale.y = 0.5;
    this.description.position.x = AppData.PADDING;
    this.description.position.y = this.button_NEW.y;
    this.description.visible = !isLoggedIn;
    this.addChild(this.description);

    this.saved = new PIXI.Text(
      "AVAILABLE PRESETS",
      AppData.TEXTFORMAT.MENU_SUBTITLE
    );
    this.saved.tint = 0x646464;
    this.saved.scale.x = this.saved.scale.y = 0.5;
    this.saved.position.x = AppData.PADDING;
    this.saved.position.y =
      this.button_NEW.y + this.button_NEW.height + AppData.PADDING;
    this.addChild(this.saved);

    // sorting by creation date.
    const order = [];
    for (let preset in Session.patch.presets) {
      const obj = Session.patch.presets[preset];
      obj.key = preset;
      order.push(obj);
    }

    order.sort((a, b) => a.date - b.date);

    for (
      let i = 0, end = order.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      // if the patch is the default, you can't edit anything.
      let allowDelete = Session.patch.uid === "default" ? false : true;
      // if its not, you can delete everything but the default
      if (allowDelete === true) {
        allowDelete = order[i].key === "default" ? false : true;
      }

      const bt = new SubmenuButtonPreset(
        order[i].name,
        new Date(parseInt(order[i].date)).toLocaleDateString(),
        allowDelete
      );
      bt.setCurrent(Session.patch.preset === order[i].key);
      this.attachButtonClick(bt, order[i].key);
      this.addChild(bt);
      this.elements.push(bt);
    }
    this.align();
    return null;
  }

  align() {
    for (
      let i = 0, end = this.elements.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      if (i === 0) {
        this.elements[i].y =
          this.saved.y + this.saved.height + AppData.PADDING / 2;
      } else {
        this.elements[i].y =
          this.elements[i - 1].y + this.elements[i - 1].height;
      }
    }
    return null;
  }

  createPreset() {
    App.PROMPT.dispatch({
      question: "Choose a preset name:",
      input: true,
      onConfirm: data => {
        const preset_id = Services.GENERATE_UID(16);
        return Services.api.presets.save(
          Session.patch.uid,
          preset_id,
          data,
          snapshot => {
            // patch_id, preset_id, preset_name
            Session.patch.preset = preset_id;
            Session.patch.presets = snapshot.val();

            App.PATCH_CHANGED.dispatch();
            App.PRESET_CHANGED.dispatch();
            App.AUTO_SAVE.dispatch({});

            Services.api.presets.update(preset_id);
            return null;
          }
        );
      }
    });
    return null;
  }

  attachButtonClick(bt, uid) {
    bt.buttonClick = () => {
      if (uid === Session.patch.preset) {
        return;
      }
      App.LOAD_PRESET.dispatch({
        uid,
        label: bt.label.text
      });
      return null;
    };

    if (bt.extraButton) {
      // remove patch
      bt.remove.buttonClick = () => {
        App.PROMPT.dispatch({
          question: `Are you sure you want to delete "${bt.label.text}"?`,
          onConfirm: () => {
            Services.api.presets.remove(uid, snapshot => {
              App.PATCH_CHANGED.dispatch();
              App.PRESET_CHANGED.dispatch();
              App.AUTO_SAVE.dispatch({});
              return null;
            });
            return null;
          }
        });
        return null;
      };
    }
    return null;
  }

  onPresetChanged() {
    // enable current preset only
    for (
      let i = 0, end = this.elements.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      this.elements[i].setCurrent(
        Session.patch.presets[Session.patch.preset].name.toUpperCase() ===
          this.elements[i].label.text
      );
    }
    return null;
  }
}
