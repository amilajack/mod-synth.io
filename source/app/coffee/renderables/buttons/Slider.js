/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Slider extends PIXI.Container {

    constructor() {
        {
          // Hack: trick Babel/TypeScript into allowing this before super.
          if (false) { super(); }
          let thisFn = (() => { this; }).toString();
          let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
          eval(`${thisName} = this;`);
        }
        this.onDown = this.onDown.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
        super();

        // components override this variables. they are needed for the PICKER object
        this.steps = 0;
        this.snap = 0;
        this.elements = [];

        this.lastValue = 0;
        this.percentage = 0;

        this.dwnPosition = new Vec2();
        this.curPosition = new Vec2();
        this.isDragging = false;

        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0xffffff, 0);
        this.graphics.drawRect(0, 0, AppData.ICON_SIZE_1, AppData.ICON_SIZE_1);
        this.addChild(this.graphics);

        this.interactive = (this.buttonMode = true);
        if (Modernizr.touch) {
            this.on('touchstart', this.onDown);
            this.on('touchmove', this.onMove);
            this.on('touchend', this.onEnd);
            this.on('touchendoutside', this.onEnd);
        } else {
            this.on('mousedown', this.onDown);
            this.on('mousemove', this.onMove);
            this.on('mouseup', this.onEnd);
            this.on('mouseupoutside', this.onEnd);
        }
    }

    onDown(e) {
        this.lastValue = this.percentage;
        this.isDragging = true;

        this.dwnPosition.set(e.data.global.x, e.data.global.y);
        this.defaultCursor = "-webkit-grabbing";
        this.identifier = e.data.identifier;

        App.PICKER_SHOW.dispatch({ x: this.x + (AppData.ICON_SIZE_1/2), y: this.y + (AppData.ICON_SIZE_1/2), steps: this.steps, snap: this.snap, elements: this.elements });
        App.PICKER_VALUE.dispatch({ percentage: this.percentage });
        return null;
    }

    onMove(e) {
        if (e.data.identifier !== this.identifier) { return; }
        if (this.isDragging) {
            this.curPosition = new Vec2(e.data.global.x, e.data.global.y);
            this.curPosition.subtract(this.dwnPosition);
            this.curPosition.scale(0.5);

            this.percentage = Math.round(this.lastValue + this.curPosition.x);
            this.constrain();
            App.PICKER_VALUE.dispatch({ percentage: this.percentage });
            this.onUpdate();
        }
        return null;
    }

    onEnd(e) {
        if (e.data.identifier !== this.identifier) { return; }

        this.isDragging = false;

        this.defaultCursor = "-webkit-grab";
        this.identifier = null;
        App.PICKER_HIDE.dispatch();
        return null;
    }

    constrain() {
        if (this.percentage < 0) {
            this.percentage = 0;
        }
        if (this.percentage > 100) {
            this.percentage = 100;
        }
        return this.percentage;
    }

    onUpdate() {}
}
        // to be overriden
