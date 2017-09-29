/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.buttons.Slider
class Octave extends Slider {

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

        this.possibleValues = [AppData.OCTAVE_TYPE.THIRTY_TWO, AppData.OCTAVE_TYPE.SIXTEEN, AppData.OCTAVE_TYPE.EIGHT, AppData.OCTAVE_TYPE.FOUR];

        this.steps = this.possibleValues.length;
        this.snap = true;
        this.elements = [
            '32',
            '16',
            '8',
            '4',
        ];

        for (let i = 0, end = this.possibleValues.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            if (Session.SETTINGS[this.component_session_uid].settings.octave === this.possibleValues[i]) {
                index = i;
                continue;
            }
        }
        this.percentage = MathUtils.map(index, 0, this.possibleValues.length-1, 0, 100, true);

        this.title = new PIXI.Text('OCTAVE', AppData.TEXTFORMAT.SETTINGS_LABEL);
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

        this.unit = new PIXI.Text("’", AppData.TEXTFORMAT.SETTINGS_NUMBER_POSTSCRIPT);
        this.unit.scale.x = (this.unit.scale.y = 0.5);
        this.unit.y = 17 * AppData.RATIO;
        this.unit.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
        this.addChild(this.unit);
    }

    onEnd(e) {
        super.onEnd(e);
        if (this.lastValue === this.percentage) {
            let next = Session.SETTINGS[this.component_session_uid].settings.octave+1;
            next %= this.possibleValues.length;
            this.percentage = MathUtils.map(next, 0, this.possibleValues.length-1, 0, 100);
            this.onUpdate();
        }
        return null;
    }

    onSettingsChange(event) {
        if (event.component === this.component_session_uid) {
            this.value.text = this.elements[Session.SETTINGS[this.component_session_uid].settings.octave];
            this.unit.x = this.value.x + (this.value.width / 2);
        }
        return null;
    }

    onUpdate() {
        Session.SETTINGS[this.component_session_uid].settings.octave = MathUtils.map(this.percentage, 0, 100, 0, this.possibleValues.length-1, true);
        App.SETTINGS_CHANGE.dispatch({ component: this.component_session_uid });
        return null;
    }
}
