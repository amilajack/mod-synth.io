/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.buttons.Slider
class Filters extends Slider {

    constructor(component_session_uid) {
        let index;
        {
          // Hack: trick Babel/TypeScript into allowing this before super.
          if (false) { super(); }
          let thisFn = (() => { this; }).toString();
          let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
          eval(`${thisName} = this;`);
        }
        this.onEnd = this.onEnd.bind(this);
        this.onSettingsChange = this.onSettingsChange.bind(this);
        this.component_session_uid = component_session_uid;
        super();

        App.SETTINGS_CHANGE.add(this.onSettingsChange);

        this.possibleValues = [AppData.FILTER_TYPE.LOWPASS, AppData.FILTER_TYPE.HIGHPASS, AppData.FILTER_TYPE.BANDPASS, AppData.FILTER_TYPE.LOWSHELF, AppData.FILTER_TYPE.HIGHSHELF, AppData.FILTER_TYPE.PEAKING, AppData.FILTER_TYPE.NOTCH, AppData.FILTER_TYPE.ALLPASS];

        this.steps = this.possibleValues.length;
        this.snap = true;
        this.elements = [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
        ];

        for (let i = 0, end = this.possibleValues.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            if (Session.SETTINGS[this.component_session_uid].settings.filter_type === this.possibleValues[i]) {
                index = i;
                continue;
            }
        }
        this.percentage = MathUtils.map(index, 0, this.possibleValues.length, 0, 100, true);

        this.title = new PIXI.Text('FILTER', AppData.TEXTFORMAT.SETTINGS_LABEL);
        this.title.scale.x = (this.title.scale.y = 0.5);
        this.title.anchor.x = 0.5;
        this.title.x = AppData.ICON_SIZE_1 / 2;
        this.title.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
        this.title.tint = 0x646464;
        this.addChild(this.title);

        this.value = new PIXI.Text('', AppData.TEXTFORMAT.SETTINGS_NUMBER);
        this.value.scale.x = (this.value.scale.y = 0.5);
        this.value.anchor.x = 0.5;
        this.value.anchor.y = 1;
        this.value.x = AppData.ICON_SIZE_1 / 2;
        this.value.y = AppData.ICON_SIZE_1 + (6 * AppData.RATIO);
        this.addChild(this.value);
    }

    onEnd(e) {
        super.onEnd(e);
        if (this.lastValue === this.percentage) {
            let next = Session.SETTINGS[this.component_session_uid].settings.filter_type+1;
            next %= this.possibleValues.length;
            this.percentage = MathUtils.map(next, 0, this.possibleValues.length-1, 0, 100);
            this.onUpdate();
        }
        return null;
    }

    onSettingsChange(event) {
        if (event.component === this.component_session_uid) {
            this.value.text = this.elements[Session.SETTINGS[this.component_session_uid].settings.filter_type];
        }
        return null;
    }

    onUpdate() {
        Session.SETTINGS[this.component_session_uid].settings.filter_type = MathUtils.map(this.percentage, 0, 100, 0, this.possibleValues.length-1, true);
        App.SETTINGS_CHANGE.dispatch({ component: this.component_session_uid });
        return null;
    }
}
