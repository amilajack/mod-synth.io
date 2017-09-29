/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.components.ComponentBase
class ComponentNsg extends ComponentBase {

    constructor(component_session_uid) {
        super(component_session_uid);

        // textures
        this.bg.texture = AppData.ASSETS.sprite.textures['comp-3-fill.png'];
        this.over.texture = AppData.ASSETS.sprite.textures['comp-3-ol.png'];
        this.icon.texture = AppData.ASSETS.sprite.textures['ic-noise-white-48.png'];

        // title
        const pos = AppData.ASSETS.sprite.data.frames['comp-3-fill.png'].sourceSize;
        this.label.anchor.x = 0.5;
        this.label.y = (pos.h/-2) + (60*AppData.RATIO);

        this.icon.y = 30*AppData.RATIO;

        this.vertices = [
            { x: 0 * AppData.RATIO, y: -1.85 * AppData.RATIO },
            { x: 2.15 * AppData.RATIO, y: 1.85 * AppData.RATIO },
            { x: -2.15 * AppData.RATIO, y: 1.85 * AppData.RATIO }
        ];
        this.change();
    }

    change() {
        if (Session.SETTINGS[this.component_session_uid].settings.mute === true) {
            this.__color = 0x3C3C3C;
            this.__alpha = 0.2;
        } else if (Session.SETTINGS[this.component_session_uid].settings.mute === false) {
            this.__color = AppData.COLORS[AppData.COMPONENTS.NSG];
            this.__alpha = 1;
        }

        this.label.alpha = this.__alpha;
        this.icon.alpha = this.__alpha;
        this.bg.tint = this.__color;
        this.over.tint = 0xffffff;

        switch (Session.SETTINGS[this.component_session_uid].settings.noise_type) {
            case AppData.NOISE_TYPE.WHITE: this.icon.texture = AppData.ASSETS.sprite.textures['ic-noise-white-48.png']; break;
            case AppData.NOISE_TYPE.PINK: this.icon.texture = AppData.ASSETS.sprite.textures['ic-noise-pink-48.png']; break;
            case AppData.NOISE_TYPE.BROWN: this.icon.texture = AppData.ASSETS.sprite.textures['ic-noise-brown-48.png']; break;
        }
        return null;
    }
}
