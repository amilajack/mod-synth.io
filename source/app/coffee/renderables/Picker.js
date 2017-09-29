/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Picker extends PIXI.Container {

    constructor() {
        {
          // Hack: trick Babel/TypeScript into allowing this before super.
          if (false) { super(); }
          let thisFn = (() => { this; }).toString();
          let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
          eval(`${thisName} = this;`);
        }
        this.onPickerShow = this.onPickerShow.bind(this);
        this.onPickerHide = this.onPickerHide.bind(this);
        this.onPickerValue = this.onPickerValue.bind(this);
        super();

        App.PICKER_SHOW.add(this.onPickerShow);
        App.PICKER_HIDE.add(this.onPickerHide);
        App.PICKER_VALUE.add(this.onPickerValue);

        this.visible = false;

        this.initialAngle = 20;
        this.finalAngle = 160;
        this.innerCircle = 120 * AppData.RATIO;
        this.outterCIrcle = 260 * AppData.RATIO;
        this.borderRadius = 8 * AppData.RATIO;

        this.steps = 0;
        this.snap = false;

        this.value = 0;

        // if snap is true snap to X steps

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.outterCIrcle * 2;
        this.canvas.height = this.outterCIrcle * 2;
        this.canvas.style.width = (this.outterCIrcle / 2) + 'px';
        this.canvas.style.height = (this.outterCIrcle / 2) + 'px';

        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingEnabled = true;

        this.bg = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.canvas));
        this.bg.scale.x = (this.bg.scale.y = 0.5);
        this.bg.anchor.x = 0.5;
        this.bg.anchor.y = 0;
        this.bg.y = - this.bg.height / 2;
        this.addChild(this.bg);

        this.background = this.getSlide(this.initialAngle, this.finalAngle, this.innerCircle, this.outterCIrcle);
        this.slide = [];
        this.border = [];

        this.elements = new PIXI.Container();
        this.addChild(this.elements);
    }

    getSlide(initial, final, sizeA, sizeB) {
        const p = [];
        let i = initial;
        while (i <= final) {
            p.push({
                x: sizeA * Math.cos(((180 + i) * Math.PI) / 180),
                y: sizeA * Math.sin(((180 + i) * Math.PI) / 180)
            });
            i++;
        }
        i = final;
        while (i >= initial) {
            p.push({
                x: sizeB * Math.cos(((180 + i) * Math.PI) / 180),
                y: sizeB * Math.sin(((180 + i) * Math.PI) / 180)
            });
            i--;
        }
        return p;
    }

    getCenter(i, f, sizeA, sizeB) {
        const angle = i + ((f - i) / 2);
        const size = (sizeB / 2) - (((sizeB / 2) - (sizeA / 2)) / 2); //(sizeB/2 + (sizeB/2 - sizeA/2) / 2)

        return {
            x: (size * Math.cos(((180 + angle) * Math.PI) / 180)),
            y: (size * Math.sin(((180 + angle) * Math.PI) / 180))
        };
    }

    onPickerShow(e) {
        this.steps = e.steps;
        this.snap = e.snap;

        this.x = e.x;
        this.y = e.y;

        this.removeElements();
        if (e.elements) {
            const angleStep = (this.finalAngle - this.initialAngle) / this.steps;
            for (let i = 0, end = e.elements.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
                const pos = this.getCenter(Math.floor(this.initialAngle + (angleStep * i)), Math.ceil(this.initialAngle + (angleStep * (i + 1))), this.innerCircle, this.outterCIrcle);
                this.addElement(e.elements[i], pos);
            }
        }

        this.visible = true;
        return null;
    }

    onPickerHide(e) {
        this.visible = false;
        return null;
    }

    onPickerValue(e) {
        this.value = e.percentage;

        // clear all
        this.context.clearRect(0, 0, this.outterCIrcle*2, this.outterCIrcle*2);

        // draw base
        this.context.beginPath();
        this.context.fillStyle = 'rgba(0, 0, 0, 0.3)';
        for (let i = 0, end = this.background.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            if (i === 0) {
                this.context.moveTo(this.outterCIrcle + this.background[i].x, this.outterCIrcle + this.background[i].y);
            } else if (i === (this.background.length-1)) {
                this.context.lineTo(this.outterCIrcle + this.background[0].x, this.outterCIrcle + this.background[0].y);
            } else {
                this.context.lineTo(this.outterCIrcle + this.background[i].x, this.outterCIrcle + this.background[i].y);
            }
        }
        this.context.fill();

        this.draw();

        this.bg.texture.update();
        return null;
    }

    addElement(element, pos) {
        let s;
        if (element instanceof PIXI.Texture) {
            s = new PIXI.Sprite(element);
        } else if (typeof element === 'string') {
            s = new PIXI.Text(element.toUpperCase(), AppData.TEXTFORMAT.PICKER);
            s.scale.x = (s.scale.y = 0.5);
        }

        s.anchor.x = (s.anchor.y = 0.5);
        s.position.x = pos.x;
        s.position.y = pos.y;
        this.elements.addChild(s);
        return null;
    }

    removeElements() {
        for (let i = 0, end = this.elements.children.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            const child = this.elements.children[0];
            this.elements.removeChild(child);
        }
        return null;
    }

    draw() {
        let i;
        let asc, end;
        let asc1, end1;
        if (!this.snap) {
            const curAngle = MathUtils.map(this.value, 0, 100, this.initialAngle, this.finalAngle, true);
            this.slide = this.getSlide(this.initialAngle, curAngle, this.innerCircle, this.outterCIrcle);
            this.border = this.getSlide(this.initialAngle, curAngle, this.innerCircle, this.innerCircle + this.borderRadius);
        } else {
            const step = MathUtils.map(this.value, 0, 100, 0, this.steps-1, true);
            const angleStep = (this.finalAngle - this.initialAngle) / this.steps;
            this.slide = this.getSlide(Math.floor(this.initialAngle + (angleStep * step)), Math.ceil(this.initialAngle + (angleStep * (step + 1))), this.innerCircle, this.outterCIrcle);
            this.border = this.getSlide(Math.floor(this.initialAngle + (angleStep * step)), Math.ceil(this.initialAngle + (angleStep * (step + 1))), this.innerCircle, this.innerCircle + this.borderRadius);
        }

        // draw selected
        this.context.beginPath();
        this.context.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (i = 0, end = this.slide.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            if (i === 0) {
                this.context.moveTo(this.outterCIrcle + this.slide[i].x, this.outterCIrcle + this.slide[i].y);
            } else if (i === (this.slide.length-1)) {
                this.context.lineTo(this.outterCIrcle + this.slide[0].x, this.outterCIrcle + this.slide[0].y);
            } else {
                this.context.lineTo(this.outterCIrcle + this.slide[i].x, this.outterCIrcle + this.slide[i].y);
            }
        }
        this.context.fill();

        // draw border
        this.context.beginPath();
        this.context.fillStyle = 'rgba(255, 255, 255, 1)';
        for (i = 0, end1 = this.border.length, asc1 = 0 <= end1; asc1 ? i < end1 : i > end1; asc1 ? i++ : i--) {
            if (i === 0) {
                this.context.moveTo(this.outterCIrcle + this.border[i].x, this.outterCIrcle + this.border[i].y);
            } else if (i === (this.border.length-1)) {
                this.context.lineTo(this.outterCIrcle + this.border[0].x, this.outterCIrcle + this.border[0].y);
            } else {
                this.context.lineTo(this.outterCIrcle + this.border[i].x, this.outterCIrcle + this.border[i].y);
            }
        }
        this.context.fill();
        return null;
    }
}
