/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class ComponentBase extends PIXI.Container {

    constructor(component_session_uid) {
        {
          // Hack: trick Babel/TypeScript into allowing this before super.
          if (false) { super(); }
          let thisFn = (() => { this; }).toString();
          let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
          eval(`${thisName} = this;`);
        }
        this.onToggle = this.onToggle.bind(this);
        this.onSettingsChange = this.onSettingsChange.bind(this);
        super();

        App.TOGGLE_SETTINGS_PANNEL_HEIGHT.add(this.onToggle);
        App.SETTINGS_CHANGE.add(this.onSettingsChange);

        this.component_session_uid = component_session_uid;

        this.__color = AppData.COLORS[Session.SETTINGS[this.component_session_uid].type_uid];
        this.__alpha = 1;

        this.highlight = false;

        this.bg = new PIXI.Sprite();
        this.bg.anchor.x = 0.5;
        this.bg.anchor.y = 0.5;
        this.bg.scale.x = 0;
        this.bg.scale.y = 0;
        this.addChild(this.bg);

        this.over = new PIXI.Sprite();
        this.over.anchor.x = 0.5;
        this.over.anchor.y = 0.5;
        this.over.alpha = 0;
        this.addChild(this.over);

        this.front = new PIXI.Container();
        this.front.alpha = 0;
        this.addChild(this.front);

        this.label = new PIXI.Text(AppData.TITLE[Session.SETTINGS[this.component_session_uid].type_uid], AppData.TEXTFORMAT.SETTINGS_TITLE);
        this.label.scale.x = (this.label.scale.y = 0.5);
        this.front.addChild(this.label);

        this.icon = new PIXI.Sprite();
        this.icon.anchor.x = 0.5;
        this.icon.anchor.y = 0.5;
        this.front.addChild(this.icon);

        this.interactive = false;
        this.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
    }

    onToggle(value) {
        this.highlight = false;
        // highlight just the selected component
        if (value.component_session_uid === this.component_session_uid) {
            this.highlight = value.type;
        }
        this.over.alpha = this.highlight === true ? 1 : 0;
        return null;
    }

    onAdd(onComplete) {
        this.bg.rotation = (360*Math.PI)/360;

        TweenMax.to(this.bg,        0.5, { rotation: 0, ease: Power2.easeInOut });
        TweenMax.to(this.bg.scale,  0.5, { x: 1, y: 1, ease: Power4.easeInOut, onComplete: () => {
            TweenMax.to(this.front, 0.6, { alpha: 1, onComplete });
            return null;
        }
        });
        return null;
    }

    onRemove(onComplete) {
        App.TOGGLE_SETTINGS_PANNEL_HEIGHT.remove(this.onToggle);
        App.SETTINGS_CHANGE.remove(this.onSettingsChange);

        TweenMax.to(this.front,         0.3, { alpha: 0, onComplete: () => {
            TweenMax.to(this.bg,        0.3, { rotation: (360*Math.PI)/360, ease: Power2.easeInOut });
            TweenMax.to(this.bg.scale,  0.3, { x: 0, y: 0, ease: Power4.easeInOut, onComplete });
            return null;
        }
        });
        return null;
    }

    onSettingsChange(event) {
        if (event.component === !this.component_session_uid) { return; }
        this.change();
        return null;
    }

    change() {
        // to be overriden
        return null;
    }
}
