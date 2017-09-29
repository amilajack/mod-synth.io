/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class AppData {
  static initClass() {
    // cookies
    this.SHOW_TOUR = undefined;
    this.SHOW_KEYBOARD_PANNEL = undefined;
    this.SHOW_MENU_PANNEL = undefined;
    this.SHOW_LABELS = undefined;

    // TOUR_MODE (necessary to avoid defaulting to Default patch in PatchesPannel)
    this.TOUR_MODE = false;

    // pixi
    this.PIXI = {
      renderer: null,
      stage: null
    };

    // preloaded assets
    this.ASSETS = null;

    // device pixel ratio
    this.RATIO = window.devicePixelRatio >= 2 ? 2 : 1;

    // canvas dimentions
    this.WIDTH = 320 * this.RATIO;
    this.HEIGHT = 240 * this.RATIO;

    // icon sizes
    this.ICON_SIZE_1 = 48 * this.RATIO;
    this.ICON_SIZE_2 = 32 * this.RATIO;
    this.ICON_SIZE_3 = 72 * this.RATIO;

    this.ICON_SPACE1 = 15 * this.RATIO;
    this.ICON_SPACE2 = 50 * this.RATIO;
    this.ICON_SPACE3 = 40 * this.RATIO;

    // padding
    this.PADDING = 26 * this.RATIO;

    // minimap itens
    this.MINIMAP = 4 * this.RATIO;

    // pannel sizes
    this.SETTINGS_PANNEL_HEIGHT = 100 * this.RATIO;
    this.KEYBOARD_PANNEL_HEIGHT = 326 * this.RATIO;
    this.MENU_PANNEL = this.ICON_SIZE_1 + this.PADDING * 2;
    this.MENU_PANNEL_BORDER = 4 * this.RATIO;
    this.SUBMENU_PANNEL = 300 * this.RATIO;

    this.KEYPRESS_ALLOWED = true;

    // background color
    this.BG = 0x191919;

    // line color
    this.LINE_COLOR = 0xffffff;
    this.LINE_ALPHA = 0.3;

    this.COMPONENTS = {
      NSG: 0, // noise generator
      OSC: 1, // oscillator
      ENV: 2, // ADSR envelope
      FLT: 3, // filter
      PTG: 4, // pattern gate
      LFO: 5 // low frequency oscillator
    };

    this.TITLE = [];
    this.TITLE[this.COMPONENTS.NSG] = "NSG";
    this.TITLE[this.COMPONENTS.OSC] = "OSC";
    this.TITLE[this.COMPONENTS.ENV] = "ENV";
    this.TITLE[this.COMPONENTS.FLT] = "FLT";
    this.TITLE[this.COMPONENTS.PTG] = "PTG";
    this.TITLE[this.COMPONENTS.LFO] = "LFO";

    this.COLORS = [];
    this.COLORS[this.COMPONENTS.NSG] = 0x00d8c7;
    this.COLORS[this.COMPONENTS.OSC] = 0x4a00ff;
    this.COLORS[this.COMPONENTS.ENV] = 0xd43557;
    this.COLORS[this.COMPONENTS.FLT] = 0x0bd7e3;
    this.COLORS[this.COMPONENTS.PTG] = 0x26e2a7;
    this.COLORS[this.COMPONENTS.LFO] = 0xf21141;

    this.WAVE_TYPE = {
      SINE: 0,
      TRIANGLE: 1,
      SQUARE: 2,
      SAWTOOTH: 3
    };

    this.NOISE_TYPE = {
      WHITE: 0,
      PINK: 1,
      BROWN: 2
    };

    this.OCTAVE_TYPE = {
      THIRTY_TWO: 0,
      SIXTEEN: 1,
      EIGHT: 2,
      FOUR: 3
    };

    this.FILTER_TYPE = {
      LOWPASS: 0,
      HIGHPASS: 1,
      BANDPASS: 2,
      LOWSHELF: 3,
      HIGHSHELF: 4,
      PEAKING: 5,
      NOTCH: 6,
      ALLPASS: 7
    };

    this.TEXTFORMAT = {
      TEST_FONT_1: {
        font: "20px sofia_prolight",
        fill: "white",
        align: "left"
      },

      TEST_FONT_2: {
        font: "20px letter_gothic_fsregular",
        fill: "white",
        align: "left"
      },

      // 2X
      HINT: {
        font: 20 * this.RATIO + "px sofia_prolight",
        fill: "white",
        align: "left"
      },

      // 2X
      MENU: {
        font: 24 * this.RATIO + "px sofia_prolight",
        fill: "white",
        align: "left"
      },

      // 2X
      MENU_SMALL: {
        font: 24 * this.RATIO + "px sofia_prolight",
        fill: "white",
        align: "center"
      },

      // 2X
      PANNEL_TITLE: {
        font: 40 * this.RATIO + "px sofia_prolight",
        fill: "white",
        align: "left"
      },

      // 2X
      MENU_SUBTITLE: {
        font: 28 * this.RATIO + "px sofia_prolight",
        fill: "white",
        align: "left"
      },

      // 2X
      MENU_DESCRIPTION: {
        font: 32 * this.RATIO + "px sofia_prolight",
        fill: "white",
        align: "left",
        wordWrap: true,
        wordWrapWidth: this.SUBMENU_PANNEL + this.MENU_PANNEL + this.PADDING
      },

      // 2X
      SETTINGS_TITLE: {
        font: 40 * this.RATIO + "px sofia_prolight",
        fill: "white",
        align: "left"
      },

      // 2X
      SETTINGS_SMB: {
        font: 32 * this.RATIO + "px sofia_prolight",
        fill: "white",
        align: "left"
      },

      // 2X
      SETTINGS_LABEL: {
        font: 24 * this.RATIO + "px sofia_prolight",
        fill: "white",
        align: "left"
      },

      // 2X
      SETTINGS_PAD: {
        font: 28 * this.RATIO + "px sofia_prolight",
        fill: "white",
        align: "left"
      },

      // 2X
      SETTINGS_NUMBER: {
        font: 64 * this.RATIO + "px letter_gothic_fsregular",
        fill: "white",
        align: "left"
      },

      // 2X
      SETTINGS_NUMBER_POSTSCRIPT: {
        font: 24 * this.RATIO + "px letter_gothic_fsregular",
        fill: "white",
        align: "left"
      },

      // 2X
      PICKER: {
        font: 44 * this.RATIO + "px letter_gothic_fsregular",
        fill: "white",
        align: "left"
      },

      // 2X
      SOON: {
        font: 30 * this.RATIO + "px sofia_prolight",
        fill: "white",
        align: "left"
      }
    };
  }
}
AppData.initClass();
