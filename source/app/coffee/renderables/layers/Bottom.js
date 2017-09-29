/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import core.View
// import renderables.SettingsPannel
// import renderables.KeyboardPannel
// import renderables.Picker
class Bottom extends View {

    constructor() {
        {
          // Hack: trick Babel/TypeScript into allowing this before super.
          if (false) { super(); }
          let thisFn = (() => { this; }).toString();
          let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
          eval(`${thisName} = this;`);
        }
        this.onResize = this.onResize.bind(this);
        this.onToggle = this.onToggle.bind(this);
        super();

        App.TOGGLE_KEYBOARD.add(this.onToggle);

        this.bottom = new KeyboardPannel();
        this.addChild(this.bottom);

        this.top = new SettingsPannel();
        this.addChild(this.top);

        this.picker = new Picker();
        this.addChild(this.picker);
    }

    onResize() {
        this.top.resize();
        this.bottom.resize();

        if (AppData.SHOW_KEYBOARD_PANNEL) {
            this.y = AppData.HEIGHT - ( AppData.SETTINGS_PANNEL_HEIGHT + AppData.KEYBOARD_PANNEL_HEIGHT );
        } else {
            this.y = AppData.HEIGHT - AppData.SETTINGS_PANNEL_HEIGHT;
        }
        return null;
    }

    onToggle(value) {
        if (value) {
            this.open();
        } else {
            this.close();
        }
        return null;
    }

    open() {
        AppData.SHOW_KEYBOARD_PANNEL = true;
        const y = AppData.HEIGHT - ( AppData.SETTINGS_PANNEL_HEIGHT + AppData.KEYBOARD_PANNEL_HEIGHT );
        TweenMax.to(this, 0.2, { y });
        return null;
    }

    close() {
        AppData.SHOW_KEYBOARD_PANNEL = false;
        const y = AppData.HEIGHT - AppData.SETTINGS_PANNEL_HEIGHT;
        TweenMax.to(this, 0.2, { y });
        return null;
    }
}
