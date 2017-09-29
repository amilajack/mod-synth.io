/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.components.ComponentBase
class ComponentPtg extends ComponentBase {

    constructor(component_session_uid) {
        super(component_session_uid);

        // textures
        this.bg.texture = AppData.ASSETS.sprite.textures['comp-7-fill.png'];
        this.over.texture = AppData.ASSETS.sprite.textures['comp-7-ol.png'];

        // title
        const pos = AppData.ASSETS.sprite.data.frames['comp-7-fill.png'].sourceSize;

        // label
        this.label.anchor.x = 0.5;
        this.label.y = (pos.h/-2) + (24*AppData.RATIO);

        this.graphics = new PIXI.Graphics();
        this.graphics.x = (AppData.ICON_SIZE_1/-2) + (4*AppData.RATIO);
        this.graphics.y = (AppData.ICON_SIZE_1/-2) + (4*AppData.RATIO);
        this.graphics.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
        this.front.addChild(this.graphics);

        this.vertices = [
            { x: 0 * AppData.RATIO, y: -2.0 * AppData.RATIO },
            { x: 1.63 * AppData.RATIO, y: -1.2 * AppData.RATIO },
            { x: 2.04 * AppData.RATIO, y: 0.6 * AppData.RATIO },
            { x: 0.9 * AppData.RATIO, y: 2.02 * AppData.RATIO },
            { x: -0.9 * AppData.RATIO, y: 2.02 * AppData.RATIO },
            { x: -2.04 * AppData.RATIO, y: 0.6 * AppData.RATIO },
            { x: -1.63 * AppData.RATIO, y: -1.2 * AppData.RATIO }
        ];
        this.change();
    }

    change() {
        if (Session.SETTINGS[this.component_session_uid].settings.bypass === true) {
            this.__color = 0x3C3C3C;
            this.__alpha = 0.2;
        } else if (Session.SETTINGS[this.component_session_uid].settings.bypass === false) {
            this.__color = AppData.COLORS[AppData.COMPONENTS.PTG];
            this.__alpha = 1;
        }

        this.label.alpha = this.__alpha;
        this.graphics.alpha = this.__alpha;

        this.bg.tint = this.__color;

        this.graphics.clear();
        let index = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this.graphics.beginFill(0xffffff, Session.SETTINGS[this.component_session_uid].settings.pattern[index] === true ? 1 : 0.5);
                this.graphics.drawCircle((12 * j) * AppData.RATIO, (12 * i) * AppData.RATIO, 2 * AppData.RATIO);
                this.graphics.endFill();
                index++;
            }
        }
        return null;
    }
}
