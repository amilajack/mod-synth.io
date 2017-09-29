/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import renderables.menu.Pannel
class PatchesPannel extends Pannel {

    constructor(label) {
        {
          // Hack: trick Babel/TypeScript into allowing this before super.
          if (false) { super(); }
          let thisFn = (() => { this; }).toString();
          let thisName = thisFn.slice(thisFn.indexOf('{') + 1, thisFn.indexOf(';')).trim();
          eval(`${thisName} = this;`);
        }
        this.build = this.build.bind(this);
        this.createPatch = this.createPatch.bind(this);
        this.resetToDefault = this.resetToDefault.bind(this);
        this.checkUserAuth = this.checkUserAuth.bind(this);
        this.checkUserPatches = this.checkUserPatches.bind(this);
        this.rebuildUserPatches = this.rebuildUserPatches.bind(this);
        this.attachButtonClick = this.attachButtonClick.bind(this);
        this.onPatchLoaded = this.onPatchLoaded.bind(this);
        super(label);

        this.elements = [];

        App.AUTH.add(this.checkUserAuth);
        App.PATCH_CHANGED.add(this.onPatchLoaded);

        this.checkUserAuth();
    }

    clear() {
        for (let i = 0, end = this.children.length-1, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            this.removeChild(this.children[1]);
        }
        this.elements = [];
        return null;
    }

    build(data) {
        this.clear();

        const isLoggedIn = Services.REFERENCE.auth().currentUser || false;

        this.button_NEW = new SubmenuButton('save to new patch', AppData.ASSETS.sprite.textures['ic-add-32.png']);
        this.button_NEW.buttonClick = this.createPatch;
        this.button_NEW.y = AppData.MENU_PANNEL;
        this.button_NEW.visible = isLoggedIn;
        this.addChild(this.button_NEW);

        this.description = new PIXI.Text('You need to login in order to save or load patches.', AppData.TEXTFORMAT.MENU_DESCRIPTION);
        this.description.scale.x = (this.description.scale.y = 0.5);
        this.description.position.x = AppData.PADDING;
        this.description.position.y = this.button_NEW.y;
        this.description.visible = !isLoggedIn;
        this.addChild(this.description);

        this.saved = new PIXI.Text('AVAILABLE PATCHES', AppData.TEXTFORMAT.MENU_SUBTITLE);
        this.saved.tint = 0x646464;
        this.saved.scale.x = (this.saved.scale.y = 0.5);
        this.saved.position.x = AppData.PADDING;
        this.saved.position.y = this.button_NEW.y + this.button_NEW.height + AppData.PADDING;
        this.addChild(this.saved);

        let bt = new SubmenuButtonPatch(Session.default.uid, new Date(parseInt(Session.default.date)).toLocaleDateString(), false);
        bt.setCurrent(Session.default.uid === Session.patch.uid);
        this.attachButtonClick(bt, Session.default.uid);
        this.addChild(bt);
        this.elements.push(bt);

        if (isLoggedIn) {
            // data is null, check is current session is same as default
            if (data === null) {
                if (Session.patch.uid) {
                    if (Session.default.uid !== Session.patch.uid) {
                        this.resetToDefault();
                        this.align();
                        return;
                    }
                }
            } else {
                // sorting by creation date.
                const order = [];
                for (let component in data) {
                    const obj = data[component];
                    obj.key = component;
                    order.push(obj);
                }

                order.sort((a,b) => a.date-b.date);

                for (let i = 0, end = order.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
                    bt = new SubmenuButtonPatch(order[i].name, new Date(parseInt(order[i].date)).toLocaleDateString(), true);
                    bt.setCurrent(Session.patch.uid === order[i].uid);
                    this.attachButtonClick(bt, order[i].key);
                    this.addChild(bt);
                    this.elements.push(bt);
                }
            }
        }

        App.PATCH_CHANGED.dispatch();
        this.align();
        return null;
    }

    align() {
        for (let i = 0, end = this.elements.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            if (i === 0) {
                this.elements[i].y = this.saved.y + this.saved.height + (AppData.PADDING/2);
            } else {
                this.elements[i].y = this.elements[i-1].y + this.elements[i-1].height;
            }
        }
        return null;
    }

    createPatch() {
        App.PROMPT.dispatch({
            question: 'Choose a patch name:',
            input: true,
            onConfirm: data => {

                // to remove all components uncomment this
                // and on Services.api.patches.save change to Session.patch.components = {}
                // for component of Session.SETTINGS
                //     App.REMOVE.dispatch Session.SETTINGS[component]

                // saves new patch
                Services.api.patches.save(data, snapshot => {
                    // stores cookie
                    Cookies.setCookie('patch', Session.patch.uid);
                    // saves new default preset
                    Services.api.presets.save(Session.patch.uid, 'default', 'default', snapshot => {
                        Session.patch.preset = 'default';
                        Session.patch.presets = snapshot.val();

                        App.PATCH_CHANGED.dispatch();
                        App.PRESET_CHANGED.dispatch();
                        App.AUTO_SAVE.dispatch({});

                        for (let id in Session.patch.presets) {
                            Services.api.presets.update(id);
                        }
                        this.checkUserPatches();
                        return null;
                    });
                    return null;
                });
                return null;
            }
        });
        return null;
    }

    resetToDefault() {
        App.LOAD_PATCH.dispatch({
            label: Session.default.uid,
            uid: Session.default.uid,
            confirm: false
        });
        return null;
    }

    checkUserAuth() {
        if (Services.REFERENCE.auth().currentUser) {
            this.checkUserPatches();
        } else {
            Session.patches = {};
            this.build();
        }
        return null;
    }

    checkUserPatches() {
        Services.api.patches.getAll(this.rebuildUserPatches);
        return null;
    }

    rebuildUserPatches(snapshot) {
        Session.patches = snapshot.val() || {};
        this.build(Session.patches);
        return null;
    }

    attachButtonClick(bt, uid) {
        bt.buttonClick = () => {
            if (uid === Session.patch.uid) { return; }
            App.LOAD_PATCH.dispatch({
                uid,
                label: bt.label.text
            });
            this.checkUserPatches();
            return null;
        };

        if (bt.extraButton) {
            // remove patch
            bt.remove.buttonClick = () => {
                App.PROMPT.dispatch({
                    question: `Are you sure you want to delete "${bt.label.text}"?`,
                    onConfirm: () => {
                        Services.api.patches.remove(uid, snapshot => {
                            App.LOAD_PATCH.dispatch({
                                uid: 'default',
                                label: bt.label.text,
                                confirm: false
                            });
                            return this.checkUserPatches();
                        });
                        return null;
                    }
                });
                return null;
            };
        }
        return null;
    }

    onPatchLoaded() {
        for (let i = 0, end = this.elements.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            if (!Session.patch.name) { return; }
            this.elements[i].setCurrent(Session.patch.name.toUpperCase() === this.elements[i].label.text);
        }
        return null;
    }
}
