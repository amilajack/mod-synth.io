/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import core.Base
class PixiBase extends Base {
    static initClass() {
    
        this.RESIZE = new signals.Signal();
    }

    constructor() {

        {
          // Hack: trick Babel/TypeScript into allowing this before super.
          if (false) { super(); }
          let thisFn = (() => { this; }).toString();
          let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
          eval(`${thisName} = this;`);
        }
        this.handleContext = this.handleContext.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.update = this.update.bind(this);
        super();

        // setup pixi
        PIXI.utils._saidHello = true;
        AppData.PIXI.renderer = new PIXI.autoDetectRenderer(1, 1, { antialias: false, backgroundColor: 0x1A1A1A, resolution: 1 });
        document.body.appendChild(AppData.PIXI.renderer.view);

        AppData.PIXI.stage = new PIXI.Container();
        AppData.PIXI.stage.interactive = true;

        // add events
        window.addEventListener('resize', this.handleResize, false);
        AppData.PIXI.renderer.view.addEventListener('contextmenu', this.handleContext, false);

        this.handleResize();
        this.update();
    }

    handleContext(e) {
        // e.preventDefault()
        return null;
    }

    handleResize() {
        AppData.WIDTH = window.innerWidth * AppData.RATIO;
        AppData.HEIGHT = window.innerHeight * AppData.RATIO;
        AppData.PIXI.renderer.resize(AppData.WIDTH, AppData.HEIGHT);
        AppData.PIXI.renderer.view.style.width = (AppData.WIDTH/AppData.RATIO) + 'px';
        AppData.PIXI.renderer.view.style.height = (AppData.HEIGHT/AppData.RATIO) + 'px';
        App.RESIZE.dispatch();
        return null;
    }

    update() {
        requestAnimationFrame(this.update);
        AppData.PIXI.renderer.render(AppData.PIXI.stage);

        for (let renderable in AppData.PIXI.stage.children) {
            if (AppData.PIXI.stage.children[renderable].update) {
                AppData.PIXI.stage.children[renderable].update();
            }
        }
        return null;
    }
}
PixiBase.initClass();
