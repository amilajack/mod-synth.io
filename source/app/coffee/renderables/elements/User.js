/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class User extends PIXI.Container {

    constructor(user) {
        super();

        const graphics = new PIXI.Graphics();
        graphics.beginFill(0x00ffff, 0);
        graphics.drawRect(0, 0, AppData.MENU_PANNEL, AppData.MENU_PANNEL);
        this.addChild(graphics);

        graphics.beginFill(0, 0);
        graphics.lineStyle(1*AppData.RATIO, 0x111111);
        graphics.moveTo(0, AppData.MENU_PANNEL);
        graphics.lineTo(AppData.MENU_PANNEL, AppData.MENU_PANNEL);
        graphics.endFill();

        const circleMask = new PIXI.Graphics();
        circleMask.beginFill(0x00ffff);
        circleMask.drawCircle(AppData.MENU_PANNEL / 2, AppData.MENU_PANNEL / 2, 24 * AppData.RATIO);
        circleMask.endFill();
        this.addChild(circleMask);

        console.log('here', user);
        const picture = new PIXI.Sprite(PIXI.Texture.fromImage(user.twitter.photoURL, true));
        picture.anchor.x = (picture.anchor.y = 0.5);
        picture.scale.x = (picture.scale.y = AppData.RATIO);
        picture.x = AppData.MENU_PANNEL / 2;
        picture.y = AppData.MENU_PANNEL / 2;
        picture.mask = circleMask;
        this.addChild(picture);
    }

    select() {
        return null;
    }

    buttonClick() {
        return null;
    }
}
