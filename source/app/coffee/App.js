/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import core.PixiBase
// import renderables.layers.*
// import renderables.Menu
// import renderables.LoadingScreen
// import controllers.Controllers
// import audio.Instrument
class App extends PixiBase {
  static initClass() {
    // help
    this.HELP = new signals.Signal();

    // prompt window
    this.PROMPT = new signals.Signal();

    this.LOAD_PATCH = new signals.Signal();
    this.LOAD_PRESET = new signals.Signal();
    this.PATCH_CHANGED = new signals.Signal();
    this.PRESET_CHANGED = new signals.Signal();

    // add/remove components
    this.ADD = new signals.Signal();
    this.REMOVE = new signals.Signal();

    this.TOGGLE_KEYBOARD = new signals.Signal();
    this.TOGGLE_SETTINGS_PANNEL_HEIGHT = new signals.Signal();
    this.TOGGLE_MENU = new signals.Signal();

    this.NOTE_ON = new signals.Signal();
    this.NOTE_OFF = new signals.Signal();

    this.PATTERN_GATE = new signals.Signal();
    this.SETTINGS_CHANGE = new signals.Signal();

    this.PICKER_SHOW = new signals.Signal();
    this.PICKER_HIDE = new signals.Signal();
    this.PICKER_VALUE = new signals.Signal();

    // used for menu
    this.AUTH = new signals.Signal();
    this.MIDI = new signals.Signal();

    this.AUTO_SAVE = new signals.Signal();

    this.prototype.onAutoSave = Session.debounce(function(data) {
      if (AppData.TOUR_MODE === true) {
        return;
      }
      if (Session.patch.uid === "default") {
        return;
      }

      if (data.x) {
        Session.SETTINGS[data.component_session_uid].x = data.x;
      }
      if (data.y) {
        Session.SETTINGS[data.component_session_uid].y = data.y;
      }
      Services.api.patches.update();

      if (!Services.REFERENCE.auth().currentUser) {
        return;
      }
      return Services.api.presets.update(Session.patch.preset);
    }, 500);
  }

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
    this.loadComplete = this.loadComplete.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onPrompt = this.onPrompt.bind(this);
    this.onLoadPatch = this.onLoadPatch.bind(this);
    this.onLoadPreset = this.onLoadPreset.bind(this);
    this.clearPatch = this.clearPatch.bind(this);
    this.loadPatch = this.loadPatch.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onHelp = this.onHelp.bind(this);
    this.checkUserAuth = this.checkUserAuth.bind(this);
    super();

    this.loading = new LoadingScreen(this.loadComplete);
    AppData.PIXI.stage.addChild(this.loading);

    App.RESIZE.add(this.onResize);
    App.TOGGLE_MENU.add(this.onToggleMenu);
    App.PROMPT.add(this.onPrompt);
    App.LOAD_PATCH.add(this.onLoadPatch);
    App.LOAD_PRESET.add(this.onLoadPreset);
    App.AUTO_SAVE.add(this.onAutoSave);

    App.AUTH.add(this.checkUserAuth);

    App.TOGGLE_KEYBOARD.add(this.onToggle);
    App.HELP.add(this.onHelp);
  }

  loadComplete() {
    AppData.PIXI.stage.removeChild(this.loading);

    // creates 2 pixi texts to force font rendering
    const t1 = new PIXI.Text("mod-synth", AppData.TEXTFORMAT.TEST_FONT_1);
    t1.position.x = 0;
    t1.position.y = -100;
    AppData.PIXI.stage.addChild(t1);

    const t2 = new PIXI.Text("mod-synth", AppData.TEXTFORMAT.TEST_FONT_2);
    t2.position.x = 400;
    t2.position.y = -100;
    AppData.PIXI.stage.addChild(t2);

    this.prompt = new Prompt();
    this.tour = new Tour();

    // audio engine
    this.instrument = new Instrument();

    // all controls (keyboard, midi)
    this.controllers = new Controllers();

    // dashboard where all the components are (draggable)
    this.dashboard = new Dashboard();
    this.dashboard.alpha = 0;
    AppData.PIXI.stage.addChild(this.dashboard);

    // background of menus
    this.menuBg = new PIXI.Graphics();
    AppData.PIXI.stage.addChild(this.menuBg);

    // menu
    this.menu = new Menu();
    AppData.PIXI.stage.addChild(this.menu);

    // midi keyboard + settings
    this.bottom = new Bottom();
    this.bottom.alpha = 0;
    AppData.PIXI.stage.addChild(this.bottom);

    // overlay of buttons
    this.controls = new Controls();
    this.controls.alpha = 0;
    AppData.PIXI.stage.addChild(this.controls);

    if (AppData.SHOW_TOUR) {
      this.tour.start();
    } else {
      const patch = Cookies.getCookie("patch") || "default";
      this.loadPatch(patch);
    }

    if (AppData.SHOW_MENU_PANNEL) {
      this.onToggleMenu(
        { width: AppData.MENU_PANNEL + AppData.MENU_PANNEL_BORDER },
        0
      );
    }

    // forces a resize
    App.RESIZE.dispatch();

    TweenMax.to([this.controls, this.bottom, this.dashboard], 0.5, {
      alpha: 1
    });
    return null;
  }

  initialAdd(delay, componentData) {
    setTimeout(() => {
      const data = Session.ADD(componentData);
      App.ADD.dispatch(data);
      return App.SETTINGS_CHANGE.dispatch({
        component: data.component_session_uid
      });
    }, delay * 1000.0);
    return null;
  }

  onResize() {
    if (!this.menu) {
      return;
    }
    this.menu.x =
      AppData.SHOW_MENU_PANNEL === true
        ? AppData.WIDTH - AppData.MENU_PANNEL - AppData.MENU_PANNEL_BORDER
        : AppData.WIDTH;
    this.menu.resize();

    this.menuBg.x =
      AppData.SHOW_MENU_PANNEL === true
        ? AppData.WIDTH + this.dashboard.x
        : AppData.WIDTH;

    this.menuBg.beginFill(AppData.BG);
    this.menuBg.lineStyle(0, 0);
    this.menuBg.moveTo(0, 0);
    this.menuBg.lineTo(AppData.SUBMENU_PANNEL, 0);
    this.menuBg.lineTo(AppData.SUBMENU_PANNEL, AppData.HEIGHT);
    this.menuBg.lineTo(0, AppData.HEIGHT);
    this.menuBg.lineTo(0, 0);
    this.menuBg.endFill();
    return null;
  }

  onToggleMenu(data, duration) {
    if (duration == null) {
      duration = 0.3;
    }
    TweenMax.to(
      [this.dashboard, this.bottom, this.controls, this.addLayer],
      duration,
      {
        x: AppData.SHOW_MENU_PANNEL === true ? -data.width : 0,
        ease: Quad.easeInOut
      }
    );
    TweenMax.to(this.menu, duration, {
      x:
        AppData.SHOW_MENU_PANNEL === true
          ? AppData.WIDTH - AppData.MENU_PANNEL - AppData.MENU_PANNEL_BORDER
          : AppData.WIDTH,
      ease: Quad.easeInOut
    });
    TweenMax.to(this.menuBg, duration, {
      x: AppData.WIDTH - data.width,
      ease: Quad.easeInOut
    });
    if (AppData.SHOW_MENU_PANNEL === true) {
      this.menu.open(data.width, duration);
      Analytics.event("menu", "open");
    } else {
      this.menu.close(duration);
      Analytics.event("menu", "close");
    }

    Cookies.setCookie(
      "menu",
      AppData.SHOW_MENU_PANNEL === true ? "show" : "hide"
    );
    return null;
  }

  onPrompt(data) {
    if (data) {
      this.prompt.show(data);
      Analytics.event("prompt", "open");
    } else {
      this.prompt.hide();
      Analytics.event("prompt", "open");
    }
    return null;
  }

  onLoadPatch(data) {
    if (data.confirm === undefined) {
      data.confirm = true;
    }

    if (data.confirm) {
      // confirmation
      App.PROMPT.dispatch({
        question: `Load "${data.label}" patch?`,
        onConfirm: () => {
          // remove all components,
          this.clearPatch(() => {
            this.loadPatch(data.uid);
            return null;
          });
          return null;
        }
      });
    } else {
      // no confirmation
      this.clearPatch(() => {
        this.loadPatch(data.uid);
        return null;
      });
    }
    return null;
  }

  onLoadPreset(data) {
    // changes selected preset
    Session.patch.preset = data.uid;

    // loops all components
    const preset = Session.patch.presets[Session.patch.preset];
    // loops through all components in preset
    for (let component in preset.components) {
      const settings = Session.DUPLICATE_OBJECT(
        Session.SETTINGS[component].settings
      );
      if (settings) {
        for (let p in preset.components[component]) {
          settings[p] = preset.components[component][p];
        }
        Session.SETTINGS[component].settings = settings;
        App.SETTINGS_CHANGE.dispatch({ component });
      }
    }

    // let app know all is updated
    App.PRESET_CHANGED.dispatch();
    return null;
  }

  clearPatch(callback) {
    for (let component in Session.SETTINGS) {
      App.REMOVE.dispatch(Session.SETTINGS[component]);
    }

    setTimeout(function() {
      callback();
      return null;
    }, 1000);
    return null;
  }

  loadPatch(patch_uid) {
    // Loads PATCH and all PRESETS
    Services.api.patches.load(patch_uid, snapshot => {
      const data = snapshot.val();

      // if user tries to load inexistent patch
      if (data === null) {
        this.loadPatch("default");
        return;
      }

      Session.patch.uid = patch_uid;
      Session.patch.author = data.author;
      Session.patch.author_name = data.author_name;
      Session.patch.components = data.components;
      Session.patch.date = data.date;
      Session.patch.name = data.name;
      Session.patch.preset = data.preset;

      // save cookie with latest patch
      Cookies.setCookie("patch", patch_uid);

      // loads all presets
      Services.api.presets.loadAll(patch_uid, snapshot => {
        Session.patch.presets = snapshot.val();

        App.PATCH_CHANGED.dispatch();
        App.PRESET_CHANGED.dispatch();

        let i = 0;
        for (let component in Session.patch.components) {
          this.initialAdd(0.123 * i++, Session.patch.components[component]);
        }
        return null;
      });
      return null;
    });
    return null;
  }

  onToggle(value) {
    Cookies.setCookie("keyboard", value === true ? "show" : "hide");
    return null;
  }

  onHelp(value) {
    Cookies.setCookie("labels", value === true ? "show" : "hide");
    return null;
  }

  checkUserAuth() {
    if (!Services.REFERENCE.auth().currentUser) {
      this.clearPatch(() => {
        return this.loadPatch("default");
      });
    }
    return null;
  }
}
App.initClass();
