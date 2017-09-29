/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.elements.Logo
// import renderables.buttons.ICButton
// import core.View
class Controls extends View {
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
    this.onResize = this.onResize.bind(this);
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.toggleKeyboard = this.toggleKeyboard.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    super();

    App.TOGGLE_MENU.add(this.onToggleMenu);

    this.logo = new Logo();
    this.addChild(this.logo);

    this.keyboard = new ICButton(
      AppData.ASSETS.sprite.textures["ic-keyboard-48.png"],
      "KEYBOARD"
    );
    this.keyboard.buttonClick = this.toggleKeyboard;
    this.keyboard.select(AppData.SHOW_KEYBOARD_PANNEL);
    this.addChild(this.keyboard);

    this.toggle = new ICButton(
      AppData.ASSETS.sprite.textures["ic-menu.png"],
      "MENU"
    );
    this.toggle.buttonClick = this.toggleMenu;
    this.toggle.select(AppData.SHOW_MENU_PANNEL);
    this.addChild(this.toggle);
  }

  onResize() {
    this.logo.x = AppData.PADDING;
    this.logo.y = AppData.PADDING;

    this.keyboard.x = AppData.PADDING;
    this.keyboard.y = AppData.HEIGHT - AppData.ICON_SIZE_1 - AppData.PADDING;

    this.toggle.x = AppData.WIDTH - AppData.ICON_SIZE_1 - AppData.PADDING;
    this.toggle.y = AppData.PADDING;
    return null;
  }

  onToggleMenu() {
    this.toggle.select(AppData.SHOW_MENU_PANNEL);
    return null;
  }

  toggleKeyboard() {
    AppData.SHOW_KEYBOARD_PANNEL = !AppData.SHOW_KEYBOARD_PANNEL;
    this.keyboard.select(AppData.SHOW_KEYBOARD_PANNEL);
    App.TOGGLE_KEYBOARD.dispatch(AppData.SHOW_KEYBOARD_PANNEL);
    return null;
  }

  toggleMenu() {
    AppData.SHOW_MENU_PANNEL = !AppData.SHOW_MENU_PANNEL;
    let w = AppData.MENU_PANNEL + AppData.MENU_PANNEL_BORDER;
    if (AppData.SHOW_MENU_PANNEL === false) {
      w = 0;
    }
    App.TOGGLE_MENU.dispatch({ width: w });
    return null;
  }
}
