/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Cookies {
    static initClass() {
    
        this.DURATION = 365;
    }

    static setCookie(cname, cvalue) {
        const d = new Date;
        d.setTime(d.getTime() + (Cookies.DURATION * 24 * 60 * 60 * 1000));
        const expires = `expires=${d.toUTCString()}`;
        document.cookie = cname + '=' + cvalue + '; ' + expires;
    }

    static getCookie(cname) {
        const name = cname + '=';
        const ca = document.cookie.split(';');
        let i = 0;
        while (i < ca.length) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
            i++;
        }
        return false;
    }
}
Cookies.initClass();
