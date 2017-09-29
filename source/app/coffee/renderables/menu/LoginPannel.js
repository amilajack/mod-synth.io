/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.menu.Pannel
class LoginPannel extends Pannel {

    constructor(initial_label) {
        {
          // Hack: trick Babel/TypeScript into allowing this before super.
          if (false) { super(); }
          let thisFn = (() => { this; }).toString();
          let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
          eval(`${thisName} = this;`);
        }
        this.build = this.build.bind(this);
        this.handleTwitter = this.handleTwitter.bind(this);
        this.handleFacebook = this.handleFacebook.bind(this);
        this.handleGithub = this.handleGithub.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.initial_label = initial_label;
        super(this.initial_label);

        App.AUTH.add(this.build);

        this.build();
    }

    clear() {
        for (let i = 0, end = this.children.length-1, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            this.removeChild(this.children[1]);
        }
        this.elements = [];
        return null;
    }

    build() {
        this.clear();

        if (Services.REFERENCE.auth().currentUser) {
            const data = Services.REFERENCE.auth().currentUser.providerData[0];

            // picture
            const img = new PIXI.Sprite.fromImage(data.photoURL);
            img.anchor.x = 0.5;
            img.anchor.y = 0.5;
            img.width = AppData.ICON_SIZE_2;
            img.height = AppData.ICON_SIZE_2;
            img.x = AppData.PADDING + (AppData.ICON_SIZE_2/2);
            img.y = AppData.MENU_PANNEL / 2;
            this.addChild(img);

            // title (username/name)
            switch (data.providerId) {
                case 'twitter':
                    this.label.text = `@${data.username.toUpperCase()}`;
                    break;
                default:
                    this.label.text = data.displayName.toUpperCase();
            }
            this.label.position.x = img.x + AppData.ICON_SIZE_2;

            this.title = new PIXI.Text(`LOGGED VIA ${data.providerId.toUpperCase()}`, AppData.TEXTFORMAT.MENU_SUBTITLE);
            this.title.tint = 0x646464;
            this.title.scale.x = (this.title.scale.y = 0.5);
            this.title.position.x = AppData.PADDING;
            this.title.position.y = AppData.MENU_PANNEL;
            this.addChild(this.title);

            // logout
            const logout = new SubmenuButton('Logout');
            logout.buttonClick = this.handleLogout;
            this.addChild(logout);
            this.elements.push(logout);

        } else {
            this.label.text = this.initial_label.toUpperCase();
            this.label.position.x = AppData.PADDING;

            const twitter = new SubmenuButton('twitter', AppData.ASSETS.sprite.textures['ic-twitter.png']);
            twitter.buttonClick = this.handleTwitter;
            this.addChild(twitter);
            this.elements.push(twitter);

            const facebook = new SubmenuButton('facebook', AppData.ASSETS.sprite.textures['ic-facebook.png']);
            facebook.buttonClick = this.handleFacebook;
            this.addChild(facebook);
            this.elements.push(facebook);

            const github = new SubmenuButton('github', AppData.ASSETS.sprite.textures['ic-github.png']);
            github.buttonClick = this.handleGithub;
            this.addChild(github);
            this.elements.push(github);
        }

        this.align();
        return null;
    }

    align() {
        const data = Services.REFERENCE.auth().currentUser;
        for (let i = 0, end = this.elements.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            if (i === 0) {
                this.elements[i].y = data ? this.title.y + this.title.height + (AppData.PADDING/2) : AppData.MENU_PANNEL;
            } else {
                this.elements[i].y = this.elements[i-1].y + this.elements[i-1].height;
            }
        }
        return null;
    }

    handleTwitter() {
        Services.api.login.twitter(this.handleLogin);
        return null;
    }

    handleFacebook() {
        Services.api.login.facebook(this.handleLogin);
        return null;
    }

    handleGithub() {
        Services.api.login.github(this.handleLogin);
        return null;
    }

    handleLogout() {
        App.PROMPT.dispatch({
            question: 'Are you sure you want to logout?',
            onConfirm: () => {
                Services.api.login.logout(this.handleLogin);
                return null;
            }
        });
        return null;
    }

    handleLogin(data) {
        App.AUTH.dispatch();
        return null;
    }
}
