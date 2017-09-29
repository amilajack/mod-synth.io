/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Analytics {

    static event(category, type, id) {
        if (window.ga) {
            if (id) {
                ga('send', 'event', category, type, id);
            } else {
                ga('send', 'event', category, type);
            }
        }
        return null;
    }
}
