/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.elements.User
// import renderables.menu.*
class Menu extends PIXI.Container {

    constructor() {
        {
          // Hack: trick Babel/TypeScript into allowing this before super.
          if (false) { super(); }
          let thisFn = (() => { this; }).toString();
          let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
          eval(`${thisName} = this;`);
        }
        this.highlightMenu = this.highlightMenu.bind(this);
        this.openSubmenu = this.openSubmenu.bind(this);
        this.onPatchChanged = this.onPatchChanged.bind(this);
        this.onPresetChanged = this.onPresetChanged.bind(this);
        super();

        this.buttons = [];
        this.tabs = [];
        this.selectIndex = null;

        this.sidepannel = new PIXI.Container();
        this.addChild(this.sidepannel);

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        this.graphics2 = new PIXI.Graphics();
        this.sidepannel.addChild(this.graphics2);

        this.select = new PIXI.Graphics();
        this.select.beginFill(0x4E4E4E);
        this.select.lineStyle(0, 0);
        this.select.moveTo(0, 0);
        this.select.lineTo(4 * AppData.RATIO, 0);
        this.select.lineTo(4 * AppData.RATIO, AppData.SETTINGS_PANNEL_HEIGHT);
        this.select.lineTo(0, AppData.SETTINGS_PANNEL_HEIGHT);
        this.select.lineTo(0, 0);
        this.select.endFill();
        this.select.y = AppData.SETTINGS_PANNEL_HEIGHT * -1;
        this.select.alpha = 0;
        this.addChild(this.select);

        App.PATCH_CHANGED.add(this.onPatchChanged);
        App.PRESET_CHANGED.add(this.onPresetChanged);

        this.build();
    }

    build() {
        this.login = new MenuButton(AppData.ASSETS.sprite.textures['ic-login-48.png'], 'login');
        this.login.buttonClick = () => {
            this.openSubmenu(0);
            return null;
        };
        this.buttons.push(this.login);
        this.addChild(this.login);

        this.add = new MenuButton(AppData.ASSETS.sprite.textures['ic-add-48.png'], 'add');
        this.add.buttonClick = () => {
            this.openSubmenu(1);
            return null;
        };
        this.buttons.push(this.add);
        this.addChild(this.add);

        this.patches = new MenuButton(AppData.ASSETS.sprite.textures['ic-patches-48.png'], 'patches');
        this.patches.buttonClick = () => {
            this.openSubmenu(2);
            return null;
        };
        this.buttons.push(this.patches);
        this.addChild(this.patches);

        this.presets = new MenuButton(AppData.ASSETS.sprite.textures['ic-presets-48.png'], 'presets');
        this.presets.buttonClick = () => {
            this.openSubmenu(3);
            return null;
        };
        this.buttons.push(this.presets);
        this.addChild(this.presets);

        this.midi = new MenuButton(AppData.ASSETS.sprite.textures['ic-midi.png'], 'midi');
        this.midi.buttonClick = () => {
            this.openSubmenu(4);
            return null;
        };
        this.buttons.push(this.midi);
        this.addChild(this.midi);

        this.help = new LabelsToggle(AppData.SHOW_LABELS);
        this.help.buttonClick = () => {
            AppData.SHOW_LABELS = !AppData.SHOW_LABELS;
            App.HELP.dispatch(AppData.SHOW_LABELS);
            return null;
        };
        this.addChild(this.help);

        this.tabs.push(new LoginPannel('login'));
        this.tabs.push(new AddPannel('add component'));
        this.tabs.push(new PatchesPannel('patches'));
        this.tabs.push(new PresetsPannel('presets'));
        this.tabs.push(new MidiPannel('midi devices'));

        for (let i = 0, end = this.tabs.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            this.tabs[i].visible = false;
            this.sidepannel.addChild(this.tabs[i]);
        }

        this.adjustPosition();
        return null;
    }

    resize() {
        this.graphics.clear();
        this.graphics2.clear();

        this.graphics.beginFill(AppData.BG);
        this.graphics.lineStyle(0, 0);
        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(AppData.SUBMENU_PANNEL, 0);
        this.graphics.lineTo(AppData.SUBMENU_PANNEL, AppData.HEIGHT);
        this.graphics.lineTo(0, AppData.HEIGHT);
        this.graphics.lineTo(0, 0);
        this.graphics.endFill();

        this.graphics.beginFill(0x0D0D0D);
        this.graphics.lineStyle(0, 0);
        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(AppData.MENU_PANNEL_BORDER, 0);
        this.graphics.lineTo(AppData.MENU_PANNEL_BORDER, AppData.HEIGHT);
        this.graphics.lineTo(0, AppData.HEIGHT);
        this.graphics.lineTo(0, 0);
        this.graphics.endFill();

        this.graphics2.beginFill(0x0D0D0D);
        this.graphics2.lineStyle(0, 0);
        this.graphics2.moveTo(0, 0);
        this.graphics2.lineTo(AppData.MENU_PANNEL_BORDER, 0);
        this.graphics2.lineTo(AppData.MENU_PANNEL_BORDER, AppData.HEIGHT);
        this.graphics2.lineTo(0, AppData.HEIGHT);
        this.graphics2.lineTo(0, 0);
        this.graphics2.endFill();

        this.help.x = 4 * AppData.RATIO;
        this.help.y = AppData.HEIGHT - this.help.height - AppData.PADDING;

        this.adjustPosition();
        return null;
    }

    adjustPosition() {
        for (let i = 0, end = this.buttons.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            this.buttons[i].x = 4 * AppData.RATIO;
            if (i === 0) {
                this.buttons[i].y = 0;
            } else {
                this.buttons[i].y = this.buttons[i-1].y + this.buttons[i-1].height;
            }
        }
        return null;
    }

    open(width, duration) {
        // change select icon and remove highlight
        if (width <= (AppData.MENU_PANNEL+AppData.MENU_PANNEL_BORDER)) {
            this.selectIndex = null;
            TweenMax.to(this.select, duration, { y: AppData.MENU_PANNEL * -1, alpha: 0, ease: Quad.easeInOut });
        } else {
            TweenMax.to(this.select, duration, { alpha: 1, ease: Quad.easeInOut });
        }

        // slide all pannels
        const xx = width === (AppData.MENU_PANNEL+AppData.MENU_PANNEL_BORDER) ? 0 : -AppData.SUBMENU_PANNEL;
        TweenMax.to(this.sidepannel, duration, { x: xx, ease: Quad.easeInOut });
        if (this.selectIndex === null) {
            this.highlightMenu();
        }
        return null;
    }

    close(duration){
        this.selectIndex = null;
        TweenMax.to(this.sidepannel, duration, { x: 0, ease: Quad.easeInOut, onComplete: this.highlightMenu });
        TweenMax.to(this.select, duration, { y: AppData.MENU_PANNEL * -1, alpha: 0, ease: Quad.easeInOut });
        return null;
    }

    highlightMenu() {
        // unselect
        for (let i = 0, end = this.buttons.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            this.buttons[i].select(false);
        }

        // select if anything
        if (this.selectIndex !== null) {
            this.buttons[this.selectIndex].select(true);
        }
        return null;
    }

    openSubmenu(index) {
        this.selectIndex = index;
        this.highlightMenu();

        // hide all tabs and show only the current
        for (let i = 0, end = this.tabs.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            this.tabs[i].visible = false;
        }
        this.tabs[this.selectIndex].visible = true;

        // select current
        TweenMax.to(this.select, 0.3, { y: this.buttons[index].y, height: this.buttons[index].height, ease: Quad.easeInOut });

        // change to new size
        App.TOGGLE_MENU.dispatch({ width: AppData.SUBMENU_PANNEL + AppData.MENU_PANNEL + AppData.MENU_PANNEL_BORDER });
        return null;
    }

    onPatchChanged() {
        const total = Object.keys(Session.patches).length + 1;

        if (total > 0) {
            this.patches.count.visible = true;
            this.patches.count.text = total;
        } else {
            this.patches.count.visible = false;
        }
        return null;
    }

    onPresetChanged() {
        const total = Object.keys(Session.patch.presets).length;
        if (total > 0) {
            this.presets.count.visible = true;
            this.presets.count.text = total;
        } else {
            this.presets.count.visible = false;
        }
        return null;
    }
}
