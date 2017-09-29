/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Tour {

    constructor() {
        this.handleClick = this.handleClick.bind(this);
        this.handleSkip = this.handleSkip.bind(this);
        this.handleStep = this.handleStep.bind(this);
        this.action1 = this.action1.bind(this);
        this.action2 = this.action2.bind(this);
        this.action3 = this.action3.bind(this);
        this.action4 = this.action4.bind(this);
        this.action5 = this.action5.bind(this);
        this.canClick = false;
        this.stepIndex = 0;
        this.cur = 0;
        this.old = undefined;

        this.steps = [];

        // open menu
        this.steps.push({
            align: 'tr',
            x: 10,
            y: 10,
            instructions: 'Click on the menu icon to access your tools and settings',
            action: this.action1
        });

        // add component
        this.steps.push({
            align: 'tr',
            x: 10,
            y: 110,
            instructions: 'Click to add a new component',
            action: this.action2
        });

        // add OSC
        this.steps.push({
            align: 'tr',
            x: 139,
            y: 136,
            instructions: 'Let\'s start with an Oscillator to generate sound',
            action: this.action3
        });

        // click on settings
        this.steps.push({
            align: 'tl',
            x: 160,
            y: 160,
            instructions: 'Now select the component to change its settings',
            action: this.action4
        });

        // click on settings
        this.steps.push({
            align: 'bl',
            x: '50%',
            y: '25%',
            instructions: 'You can use your keyboard or mouse to make sound.',
            action: this.action5
        });

        this.outer = document.createElement('div');
        this.outer.className = 'tour--outer-holder';
        document.body.appendChild(this.outer);

        this.dark = document.createElement('div');
        this.dark.className = 'tour--dark-holder';
        this.outer.appendChild(this.dark);

        this.instructionsHolder = document.createElement('div');
        this.instructionsHolder.className = 'tour--instructions-holder';
        this.outer.appendChild(this.instructionsHolder);

        this.instructions = document.createElement('div');
        this.instructions.className = 'tour--instructions-inner';
        this.instructionsHolder.appendChild(this.instructions);

        // add circle
        this.inner = document.createElement('div');
        this.inner.className = 'tour--inner-holder';
        this.outer.appendChild(this.inner);

        this.circle = document.createElement('div');
        this.circle.className = 'tour--circle';
        this.inner.appendChild(this.circle);

        this.skip = document.createElement('div');
        this.skip.innerHTML = 'Skip Tour';
        this.skip.className = 'tour--skip';
        this.outer.appendChild(this.skip);

        this.started = document.createElement('div');
        this.started.innerHTML = 'Get Started';
        this.started.className = 'tour--get-started';
        this.outer.appendChild(this.started);

        // add nav
        this.nav = document.createElement('nav');
        this.nav.className = 'nav';
        this.outer.appendChild(this.nav);

        for (let i = 0, end = this.steps.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            const a = document.createElement('div');
            this.nav.appendChild(a);
        }
    }

    start() {
        if (Modernizr.touch) {
            this.circle.addEventListener('touchend', this.handleClick, false);
            this.started.addEventListener('touchend', this.handleClick, false);
            this.skip.addEventListener('touchend', this.handleSkip, false);
        } else {
            this.circle.addEventListener('mouseup', this.handleClick, false);
            this.started.addEventListener('mouseup', this.handleClick, false);
            this.skip.addEventListener('mouseup', this.handleSkip, false);
        }

        AppData.TOUR_MODE = true;
        AppData.KEYPRESS_ALLOWED = false;
        TweenLite.to(this.dark, 0, { opacity: 0.7 });
        TweenLite.to(this.outer, 0.5, { autoAlpha: 1, onComplete: this.handleStep });
        return null;
    }

    end() {
        if (Modernizr.touch) {
            this.circle.removeEventListener('touchend', this.handleClick, false);
            this.started.removeEventListener('touchend', this.handleClick, false);
            this.skip.removeEventListener('touchend', this.handleSkip, false);
        } else {
            this.circle.removeEventListener('mouseup', this.handleClick, false);
            this.started.removeEventListener('mouseup', this.handleClick, false);
            this.skip.removeEventListener('mouseup', this.handleSkip, false);
        }

        TweenLite.to(this.outer, 0.5, { autoAlpha: 0, onComplete: () => {
            // reset everything
            TweenLite.to(this.dark, 0, { opacity: 0 });

            AppData.TOUR_MODE = false;
            AppData.KEYPRESS_ALLOWED = true;

            TweenLite.to(this.nav, 0, { autoAlpha: 1 });
            TweenLite.to(this.started, 0, { autoAlpha: 0, bottom: 0 });
            TweenLite.to(this.skip, 0, { autoAlpha: 0, bottom: 0 });

            App.LOAD_PATCH.dispatch({
                uid: 'default',
                confirm: false
            });

            Cookies.setCookie('tour', 'hide');
            return null;
        }
        });
        return null;
    }

    handleClick(e) {
        e.preventDefault();
        if (this.canClick === false) { return; }
        this.canClick = false;

        this.steps[this.stepIndex].action();
        this.hideIndicator();
        return null;
    }

    handleSkip(e) {
        e.preventDefault();
        if (this.canClick === false) { return; }
        this.canClick = false;

        this.stepIndex = this.steps.length-1;
        this.steps[this.stepIndex].action();
        this.hideIndicator();
        return null;
    }

    handleStep() {
        if (this.cur !== undefined) {
            this.old = this.cur;
        }
        this.cur = this.stepIndex;

        if (this.old !== undefined) {
            this.nav.children[this.old].className = '';
        }
        this.nav.children[this.stepIndex].className = 'selected';

        this.instructions.innerHTML = this.steps[this.stepIndex].instructions;

        this.moveTo(this.steps[this.stepIndex].align, this.steps[this.stepIndex].x, this.steps[this.stepIndex].y);
        if (this.stepIndex < (this.steps.length-1)) {
            this.showIndicator();
            if (this.stepIndex === 0) {
                TweenLite.to(this.skip, 0.5, { autoAlpha: 1, bottom: '25%', ease: Power2.easeInOut });
            } else {
                TweenLite.to(this.skip, 0.5, { autoAlpha: 0, ease: Power2.easeInOut });
            }
        } else {
            this.canClick = true;
            TweenLite.to(this.nav, 0.3, { autoAlpha: 0 });
            TweenLite.to(this.started, 0.5, { autoAlpha: 1, bottom: this.steps[this.stepIndex].y, ease: Power2.easeInOut });
        }
        return null;
    }

    moveTo(align, x, y) {
        switch (align) {
            case 'tr': TweenLite.to(this.inner, 0.0, { css: { top: y, left: 'initial',bottom: 'initial', right: x } }); break;
            case 'tl': TweenLite.to(this.inner, 0.0, { css: { top: y, left: x,bottom: 'initial', right: 'initial' } }); break;
            case 'bl': TweenLite.to(this.inner, 0.0, { css: { top: 'initial', left: x,bottom: y, right: 'initial' } }); break;
        }
        return null;
    }

    showIndicator() {
        TweenLite.to(this.inner, 0.8, { autoAlpha: 1, delay: 0.5, ease: Power2.easeOut, onComplete: () => {
            this.canClick = true;
            return null;
        }
        });
        return null;
    }

    hideIndicator() {
        TweenLite.to(this.inner, 0.0, { autoAlpha: 0 });
        return null;
    }

    delayToNextStep(duration) {
        setTimeout(() => {
            this.stepIndex++;
            if (this.stepIndex < this.steps.length) {
                return this.handleStep();
            } else {
                return this.end();
            }
        }
        , duration);
        return null;
    }

    // open menu
    action1() {
        AppData.SHOW_MENU_PANNEL = true;
        App.TOGGLE_MENU.dispatch({ width: AppData.MENU_PANNEL + AppData.MENU_PANNEL_BORDER });
        this.delayToNextStep(0);
        return null;
    }

    // open component pannel
    action2() {
        window.app.menu.openSubmenu(1);
        this.delayToNextStep(0);
        return null;
    }

    // add OSC
    action3() {
        const component = {
            'type_uid': 1,
            x: -((AppData.WIDTH/2)+app.dashboard.x) + (200*AppData.RATIO),
            y: -((AppData.HEIGHT/2)+app.dashboard.y) + (200*AppData.RATIO)
        };
        const data = Session.ADD(component);

        App.ADD.dispatch(data);
        App.SETTINGS_CHANGE.dispatch({ component: data.component_session_uid });
        this.delayToNextStep(0);
        return null;
    }

    action4() {
        for (let uid in Session.SETTINGS) {
            App.TOGGLE_SETTINGS_PANNEL_HEIGHT.dispatch({
                type: true,
                component_session_uid: Session.SETTINGS[uid].component_session_uid
            });
        }
        AppData.SHOW_MENU_PANNEL = false;
        App.TOGGLE_MENU.dispatch({ width: 0 });
        this.delayToNextStep(0);
        return null;
    }

    action5() {
        return this.delayToNextStep(0);
    }
}
