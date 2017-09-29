/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.elements.*
class SettingsBase extends PIXI.Container {
    static initClass() {
    
        this.prototype.component_session_uid = undefined;
    }

    constructor(component_session_uid) {
        {
          // Hack: trick Babel/TypeScript into allowing this before super.
          if (false) { super(); }
          let thisFn = (() => { this; }).toString();
          let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
          eval(`${thisName} = this;`);
        }
        this.onToggle = this.onToggle.bind(this);
        this.onResize = this.onResize.bind(this);
        this.removeComponent = this.removeComponent.bind(this);
        this.handleAutoSave = this.handleAutoSave.bind(this);
        this.onSettingsChange = this.onSettingsChange.bind(this);
        this.component_session_uid = component_session_uid;
        super();

        App.TOGGLE_KEYBOARD.add(this.onToggle);
        App.RESIZE.add(this.onResize);
        App.SETTINGS_CHANGE.add(this.onSettingsChange);
        App.SETTINGS_CHANGE.add(this.handleAutoSave);

        this.elements = [];
        this.initialX = 112 * AppData.RATIO;

        // component color
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(AppData.COLORS[Session.SETTINGS[this.component_session_uid].type_uid]);
        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(4 * AppData.RATIO, 0);
        this.graphics.lineTo(4 * AppData.RATIO, AppData.SETTINGS_PANNEL_HEIGHT);
        this.graphics.lineTo(0, AppData.SETTINGS_PANNEL_HEIGHT);
        this.graphics.lineTo(0, 0);
        this.graphics.endFill();
        this.addChild(this.graphics);

        // label
        this.label = new PIXI.Text(AppData.TITLE[Session.SETTINGS[this.component_session_uid].type_uid], AppData.TEXTFORMAT.SETTINGS_TITLE);
        this.label.scale.x = (this.label.scale.y = 0.5);
        this.label.anchor.y = 0.5;
        this.label.position.x = AppData.PADDING;
        this.label.position.y = AppData.SETTINGS_PANNEL_HEIGHT/2;
        this.label.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
        this.label.visible = AppData.SHOW_KEYBOARD_PANNEL;
        this.addChild(this.label);

        // remove
        this.remove = new ICButton(AppData.ASSETS.sprite.textures['ic-remove-32.png'], '');
        this.remove.x = AppData.WIDTH - AppData.ICON_SIZE_1 - AppData.PADDING;
        this.remove.y = AppData.PADDING;
        this.remove.buttonClick = this.removeComponent;
        this.addChild(this.remove);
    }

    onToggle(value) {
        this.label.visible = value;
        return null;
    }

    onResize() {
        this.remove.x = AppData.WIDTH - AppData.ICON_SIZE_1 - AppData.PADDING;
        return null;
    }

    removeComponent() {
        App.REMOVE.dispatch({ component_session_uid: this.component_session_uid });
        setTimeout(() => {

            App.AUTO_SAVE.dispatch({
                component_session_uid: this.component_session_uid
            });
            return (() => {
                const result = [];
                for (let id in Session.patch.presets) {
                    result.push(Services.api.presets.updateRemove(id, this.component_session_uid));
                }
                return result;
            })();
        }

        , 500);
        return null;
    }

    handleAutoSave() {
        App.AUTO_SAVE.dispatch({
            component_session_uid: this.component_session_uid
        });
        return null;
    }

    onSettingsChange() { return null; }

    add(element) {
        this.elements.push(element);
        return this.addChild(element);
    }

    adjustPosition() {
        for (let i = 0, end = this.elements.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            if (i === 0) {
                this.elements[i].x = this.initialX;
            } else {
                this.elements[i].x = this.elements[i-1].x + this.elements[i-1].width;
            }
            this.elements[i].y = Math.floor(AppData.SETTINGS_PANNEL_HEIGHT - AppData.ICON_SIZE_1) /2;
        }
        return null;
    }
}
SettingsBase.initClass();
