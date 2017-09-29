/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.Soon
class LoadingScreen extends PIXI.Sprite {

    constructor(callback) {
        {
          // Hack: trick Babel/TypeScript into allowing this before super.
          if (false) { super(); }
          let thisFn = (() => { this; }).toString();
          let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
          eval(`${thisName} = this;`);
        }
        this.preloadLoadingAssetsComplete = this.preloadLoadingAssetsComplete.bind(this);
        this.preloadAssets = this.preloadAssets.bind(this);
        this.preloadAssetsComplete = this.preloadAssetsComplete.bind(this);
        this.onResize = this.onResize.bind(this);
        this.callback = callback;
        super();

        this.holder = new PIXI.Sprite();
        this.holder.alpha = 0;
        this.holder.scale.x = (this.holder.scale.y = 0.5);
        this.holder.anchor.x = 0.5;
        this.holder.anchor.y = 0.5;
        this.addChild(this.holder);

        this.icon1 = new PIXI.Sprite();
        this.icon1.anchor.x = 0.5;
        this.icon1.anchor.y = 0.5;
        this.icon1.alpha = 0;
        this.holder.addChild(this.icon1);

        this.icon2 = new PIXI.Sprite();
        this.icon2.x = 6;
        this.icon2.anchor.x = 0.5;
        this.icon2.anchor.y = 0.5;
        this.holder.addChild(this.icon2);

        this.icon3 = new PIXI.Sprite();
        this.icon3.anchor.x = 0.5;
        this.icon3.anchor.y = 0.5;
        this.icon3.alpha = 0;
        this.holder.addChild(this.icon3);

        App.RESIZE.add(this.onResize);
        App.RESIZE.dispatch();

        this.pos1 = -81*AppData.RATIO;
        this.pos2 = 86*AppData.RATIO;

        this.preloadLoadingAssets();
    }

    preloadLoadingAssets() {

        this.isLoading = true;
        if (AppData.RATIO === 1) {
            PIXI.loader.add('preloader', '/sprites/preload1x.json');
        } else {
            PIXI.loader.add('preloader', '/sprites/preload2x.json');
        }

        PIXI.loader.once('complete', this.preloadLoadingAssetsComplete);
        PIXI.loader.load();
        return null;
    }

    preloadLoadingAssetsComplete(loader, resources) {

        this.icon1.texture = resources.preloader.textures['preload1.png'];
        this.icon2.texture = resources.preloader.textures['preload2.png'];
        this.icon3.texture = resources.preloader.textures['preload3.png'];

        // create masks
        this.mask1 = new PIXI.Graphics();
        this.mask1.beginFill(0x00ffff, 0.5);
        this.mask1.drawRect(this.icon1.texture.width / -2, this.icon1.texture.height / -2, this.icon1.texture.width, this.icon1.texture.height);
        this.mask1.x = this.pos1;
        this.holder.addChild(this.mask1);

        this.mask2 = new PIXI.Graphics();
        this.mask2.beginFill(0x00ffff, 0.5);
        this.mask2.drawRect(this.icon3.texture.width / -2, this.icon3.texture.height / -2, this.icon3.texture.width, this.icon3.texture.height);
        this.mask2.x = this.pos2;
        this.holder.addChild(this.mask2);

        // set masks
        this.icon1.mask = this.mask1;
        this.icon3.mask = this.mask2;

        loader.reset();
        this.start();
        return null;
    }

    preloadAssets() {

        if (AppData.RATIO === 1) {
            PIXI.loader.add('sprite', '/sprites/sprite1x.json');
        } else {
            PIXI.loader.add('sprite', '/sprites/sprite2x.json');
        }

        PIXI.loader.once('complete', this.preloadAssetsComplete);
        PIXI.loader.load();
        return null;
    }

    preloadAssetsComplete(loader, resources) {
        // all textures are loaded
        AppData.ASSETS = resources;

        loader.reset();

        // reads cookies
        const tour = Cookies.getCookie('tour') || 'show';
        const menu = Cookies.getCookie('menu') || 'hide';
        const keyboard = Cookies.getCookie('keyboard') || 'show';
        const labels = Cookies.getCookie('labels') || 'hide';

        AppData.SHOW_TOUR = tour === 'show' ? true : false;

        // if we're seeing the tour for the first time, we close all pannels
        if (AppData.SHOW_TOUR === true) {
            AppData.SHOW_MENU_PANNEL = false;
            AppData.SHOW_KEYBOARD_PANNEL = true;
            AppData.SHOW_LABELS = false;
        } else {
            // otherwise we read the cookie
            AppData.SHOW_MENU_PANNEL = menu === 'show' ? true : false;
            AppData.SHOW_KEYBOARD_PANNEL = keyboard === 'show' ? true : false;
            AppData.SHOW_LABELS = labels === 'show' ? true : false;
        }

        // saves default patch and presets so its public not locked to a user
        Services.api.patches.load('default', snapshot => {
            const data = snapshot.val();

            Session.default.uid = 'default';
            Session.default.author = data.author;
            Session.default.author_name = data.author_name;
            Session.default.components = data.components;
            Session.default.date = data.date;
            Session.default.name = data.name;
            Session.default.preset = data.preset;

            return Services.api.presets.loadAll('default', snapshot => {
                Session.default.preset = 'default';
                Session.default.presets = snapshot.val();
                return this.end();
            });
        });
        return null;
    }

    start() {
        // fades in elements
        TweenMax.to(this.holder, 1.0, { alpha: 1, ease: Power2.easeInOut, onComplete: this.preloadAssets });
        TweenMax.to(this.icon1, 1, { x: this.pos1, alpha: 1, ease: Power4.easeInOut });
        TweenMax.to(this.icon3, 1, { x: this.pos2, alpha: 1, ease: Power4.easeInOut, delay: 0.1 });
        return null;
    }

    end() {
        // check if we're on iPad
        // iOS = /iPad|iPhone|iPod/.test navigator.userAgent

        // min width: 800
        // min height: 600
        // if iOS
        // console.log 'resolution', window.screen.availWidth, window.screen.availHeight
        if ((window.screen.availWidth < 800) || (window.screen.availHeight < 600)) {
            this.soon = new Soon();
            this.soon.x = AppData.WIDTH / 2;
            this.soon.y = AppData.HEIGHT / 2;
            this.addChild(this.soon);
            return;
        }

        // does end animation, and in the end call the callback
        TweenMax.to(this.holder, 1.0, { alpha: 0, delay: 0.5, ease: Power2.easeInOut, onComplete: this.callback });
        return null;
    }

    onResize() {
        this.holder.x = AppData.WIDTH / 2;
        this.holder.y = AppData.HEIGHT / 2;

        if (!this.soon) { return; }
        this.soon.x = AppData.WIDTH / 2;
        this.soon.y = AppData.HEIGHT / 2;
        return null;
    }
}
