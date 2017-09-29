/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// http://jsfiddle.net/firebase/a221m6pb/
// https://jsfiddle.net/andrevenancio/07j0p9ub/

const config = {
    apiKey: "AIzaSyBcFB1TdT_ZLULA0PHSqKg4NHUZRFosJ4g",
    authDomain: "mod-synth.firebaseapp.com",
    databaseURL: "https://mod-synth.firebaseio.com",
    storageBucket: "",
};
firebase.initializeApp(config);

class Services {
    static initClass() {
    
        this.REFERENCE = firebase;
    
        this.PATCHES = firebase.database().ref('patches');
    
        this.PRESETS = firebase.database().ref('presets');
    
        this.api = {
    
            login: {
                twitter(callback) {
                    const provider = new firebase.auth.TwitterAuthProvider();
    
                    firebase.auth()
                        .signInWithPopup(provider)
                        .then(result => callback(result)).catch(error => console.error(error));
                    return null;
                },
    
                facebook(callback) {
                    const provider = new firebase.auth.FacebookAuthProvider();
                    provider.addScope('email');
    
                    firebase.auth()
                        .signInWithPopup(provider)
                        .then(result => callback(result)).catch(error => console.error(error));
                    return null;
                },
    
                github(callback) {
                    const provider = new firebase.auth.GithubAuthProvider();
    
                    firebase.auth()
                        .signInWithPopup(provider)
                        .then(result => callback(result)).catch(error => console.error(error));
                    return null;
                },
    
                logout(callback) {
                    firebase.auth().signOut();
                    if (callback) {
                        callback();
                    }
                    return null;
                }
            },
    
            patches: {
    
                getAll(callback) {
                    if (Services.REFERENCE.auth().currentUser) {
                        // console.log('%cpatches', 'background-color: black; color: green', 'getAll');
                        Services.PATCHES.orderByChild('author').equalTo(Services.REFERENCE.auth().currentUser.providerData[0].uid).once('value', callback);
                    }
                    return null;
                },
    
                load(patch_id, callback) {
                    // console.log('%cpatches', 'background-color: black; color: green', 'load');
                    const patch = Services.PATCHES.child(patch_id);
                    patch.once('value', callback);
                    return null;
                },
    
                save(patch_name, callback) {
                    if (Services.REFERENCE.auth().currentUser) {
                        // console.log('%cpatches', 'background-color: black; color: green', 'save');
                        const providerData = Services.REFERENCE.auth().currentUser.providerData[0];
    
                        // adds data
                        Session.patch.uid = Services.GENERATE_UID(16);
                        Session.patch.author = providerData.uid;
                        Session.patch.author_name = providerData.displayName;
                        Session.patch.components = Session.SETTINGS;
                        Session.patch.date = String(Date.now());
                        Session.patch.name = patch_name;
                        Session.patch.preset = 'default';
                        Session.patch.presets = {};
    
                        // saves patch with current settings data
                        const patch = Services.PATCHES.child(Session.patch.uid);
                        patch.set({
                            uid: Session.patch.uid,
                            author: Session.patch.author,
                            author_name: Session.patch.author_name,
                            components: Session.patch.components,
                            date: Session.patch.date,
                            name: Session.patch.name,
                            preset: Session.patch.preset
                        });
                        patch.once('value', callback);
                    }
                    return null;
                },
    
                remove(patch_id, callback) {
                    if (Services.REFERENCE.auth().currentUser) {
                        // console.log('%cpatches', 'background-color: black; color: green', 'remove');
                        const patch = Services.PATCHES.child(patch_id);
                        patch.remove(snapshot => {
                            Services.api.presets.removeAll(patch_id, callback);
                            return null;
                        });
                    }
                    return null;
                },
    
                update(callback) {
                    if (Session.patch.uid === 'default') { return; }
    
                    if (Services.REFERENCE.auth().currentUser) {
                        // console.log('%cpatches', 'background-color: black; color: green', 'update');
    
                        const patch = Services.PATCHES.child(Session.patch.uid);
                        const component = patch.child('components');
                        component.remove(() => {
    
                            const components = Session.DUPLICATE_OBJECT(Session.SETTINGS);
                            for (let comp in components) {
                                delete components[comp].settings;
                            }
    
                            component.update(components);
                            component.once('value', callback);
                            return null;
                        });
                    }
                    return null;
                }
            },
    
            presets: {
    
                loadAll(patch_id, callback) {
                    // console.log('%cpreset', 'background-color: black; color: red', 'loadAll');
                    const presets = Services.PRESETS.child(patch_id);
                    presets.once('value', callback);
                    return null;
                },
    
                save(patch_id, preset_id, preset_name, callback) {
                    // console.log('%cpreset', 'background-color: black; color: red', 'save');
    
                    const patch = Services.PRESETS.child(patch_id);
                    const preset = patch.child(preset_id);
                    preset.set({
                        date: String(Date.now()),
                        name: preset_name,
                        components: {}
                    });
                    preset.once('value', snapshot => {
                        Services.api.presets.loadAll(patch_id, callback);
                        return null;
                    });
                    return null;
                },
    
                removeAll(patch_id, callback) {
                    // console.log('%cpreset', 'background-color: black; color: red', 'removeAll');
                    const presets = Services.PRESETS.child(patch_id);
                    presets.remove(callback);
                    return null;
                },
    
                remove(patch_id, callback) {
                    // console.log('%cpreset', 'background-color: black; color: red', 'remove');
                    const presets = Services.PRESETS.child(Session.patch.uid);
                    const preset = presets.child(patch_id);
                    preset.remove(error => {
                        if (!error) {
                            return Services.api.presets.loadAll(Session.patch.uid, snapshot => {
                                Session.patch.preset = 'default';
                                Session.patch.presets = snapshot.val();
                                if (callback) {
                                    callback(snapshot);
                                }
                                return null;
                            });
                        }
                    });
                    return null;
                },
    
                // updates settings of known components
                update(id, callback) {
                    if (Session.patch.uid === 'default') { return; }
                    // console.log('%cpreset', 'background-color: black; color: red', 'update');
    
                    const presets = Services.PRESETS.child(Session.patch.uid);
                    const preset = presets.child(id);
                    const component = preset.child('components');
                    component.remove(() => {
                        const components = Session.DUPLICATE_OBJECT(Session.SETTINGS);
    
                        // loops all components
                        for (let comp in components) {
                            // loops all properties in component
                            for (let prop in components[comp]) {
                                // deletes everything outsite settings
                                if (prop !== 'settings') {
                                    delete components[comp][prop];
                                } else {
                                    // loops everything inside settings, and saves it
                                    for (let p in components[comp][prop]) {
                                        components[comp][p] = components[comp][prop][p];
                                    }
                                    // safely remove settings
                                    delete components[comp][prop];
                                }
                            }
                        }
    
                        component.update(components);
                        component.once('value', snapshot => {
                            Session.patch.presets[id].components = snapshot.val();
                            if (callback) {
                                return callback(snapshot);
                            }
                        });
                        return null;
                    });
                    return null;
                },
    
                // updates settings of known components
                updateAdd(id, data) {
                    if (Session.patch.uid === 'default') { return; }
                    // console.log('%cpreset', 'background-color: black; color: red', 'updateAdd');
    
                    const settings = Session.DUPLICATE_OBJECT(data.settings);
    
                    const presets = Services.PRESETS.child(Session.patch.uid);
                    const preset = presets.child(id);
                    const components = preset.child('components');
                    const component = components.child(data.component_session_uid);
                    component.set(settings);
                    component.once('value', snapshot => {
                        if (Session.patch.presets[id].components === null) {
                            Session.patch.presets[id].components = {};
                        }
                        Session.patch.presets[id].components[data.component_session_uid] = snapshot.val();
                        return null;
                    });
                    return null;
                },
    
                // removes component
                updateRemove(id, component_session_uid) {
                    if (Session.patch.uid === 'default') { return; }
                    // console.log('%cpreset', 'background-color: black; color: red', 'updateRemove');
    
                    const presets = Services.PRESETS.child(Session.patch.uid);
                    const preset = presets.child(id);
                    const components = preset.child('components');
                    const component = components.child(component_session_uid);
                    component.remove(error => {
                        if (!error) {
                            delete Session.patch.presets[id].components[component_session_uid];
                        }
                        return null;
                    });
                    return null;
                }
            }
        };
        
    }

    static GENERATE_UID(len, radix) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        const uuid = [];
        let i = undefined;
        radix = radix || chars.length;
        if (len) {
            i = 0;
            while (i < len) {
                uuid[i] = chars[0 | (Math.random() * radix)];
                i++;
            }
        } else {
            let r = undefined;
            uuid[8] = (uuid[13] = (uuid[18] = (uuid[23] = '-')));
            uuid[14] = '4';
            i = 0;
            while (i < 36) {
                if (!uuid[i]) {
                    r = 0 | (Math.random() * 16);
                    uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
                }
                i++;
            }
        }
        return uuid.join('');
    }
}
Services.initClass();
