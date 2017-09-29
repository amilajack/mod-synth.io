/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Background extends PIXI.extras.TilingSprite {

    constructor() {
        super(AppData.ASSETS.sprite.textures['shadow.png']);
        this.alpha = 0.0;
        this.interactive = true;
        this.defaultCursor = "-webkit-grabbing";
    }

    update(position, zoom) {
        this.tileScale.x = zoom;
        this.tileScale.y = zoom;
        this.tilePosition.x = position.x - this.x;
        this.tilePosition.y = position.y - this.y;
        return null;
    }
}
