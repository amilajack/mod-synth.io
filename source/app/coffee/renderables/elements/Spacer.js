class Spacer extends PIXI.Container {

    constructor(size) {
        super();

        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0xffffff, 0);
        this.graphics.drawRect(0, 0, size, AppData.ICON_SIZE_1);
        this.addChild(this.graphics);
    }
}
