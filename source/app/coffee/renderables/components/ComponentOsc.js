/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.components.ComponentBase
class ComponentOsc extends ComponentBase {

    constructor(component_session_uid) {
        super(component_session_uid);

        // textures
        this.bg.texture = AppData.ASSETS.sprite.textures['comp-4-fill.png'];
        this.over.texture = AppData.ASSETS.sprite.textures['comp-4-ol.png'];
        this.icon.texture = AppData.ASSETS.sprite.textures['ic-wave-sine-48.png'];

        // title
        const pos = AppData.ASSETS.sprite.data.frames['comp-4-fill.png'].sourceSize;
        this.label.x = (pos.w/-2) + (24*AppData.RATIO);
        this.label.y = (pos.h/-2) + (24*AppData.RATIO);

        this.vertices = [
            { x: -1.8 * AppData.RATIO, y: -1.8 * AppData.RATIO },
            { x: 1.8 * AppData.RATIO, y: -1.8 * AppData.RATIO },
            { x: 1.8 * AppData.RATIO, y: 1.8 * AppData.RATIO },
            { x: -1.8 * AppData.RATIO, y: 1.8 * AppData.RATIO }
        ];
        this.change();
    }

    change() {
        if (Session.SETTINGS[this.component_session_uid].settings.mute === true) {
            this.__color = 0x3C3C3C;
            this.__alpha = 0.2;
        } else if (Session.SETTINGS[this.component_session_uid].settings.mute === false) {
            this.__color = AppData.COLORS[AppData.COMPONENTS.OSC];
            this.__alpha = 1;
        }

        this.label.alpha = this.__alpha;
        this.icon.alpha = this.__alpha;
        this.bg.tint = this.__color;
        this.over.tint = 0xffffff;

        switch (Session.SETTINGS[this.component_session_uid].settings.wave_type) {
            case AppData.WAVE_TYPE.SINE: this.icon.texture = AppData.ASSETS.sprite.textures['ic-wave-sine-48.png']; break;
            case AppData.WAVE_TYPE.TRIANGLE: this.icon.texture = AppData.ASSETS.sprite.textures['ic-wave-tri-48.png']; break;
            case AppData.WAVE_TYPE.SQUARE: this.icon.texture = AppData.ASSETS.sprite.textures['ic-wave-sq-48.png']; break;
            case AppData.WAVE_TYPE.SAWTOOTH: this.icon.texture = AppData.ASSETS.sprite.textures['ic-wave-saw-48.png']; break;
        }
        return null;
    }
}
