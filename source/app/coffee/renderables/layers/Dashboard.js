/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import core.View
// import renderables.Background
// import renderables.components.*
// import utils.*
class Dashboard extends View {
  constructor() {
    {
      // Hack: trick Babel/TypeScript into allowing this before super.
      if (false) {
        super();
      }
      let thisFn = (() => {
        this;
      }).toString();
      let thisName = thisFn
        .slice(thisFn.indexOf("{") + 1, thisFn.indexOf(";"))
        .trim();
      eval(`${thisName} = this;`);
    }
    this.onBackgroundDown = this.onBackgroundDown.bind(this);
    this.onBackgroundMove = this.onBackgroundMove.bind(this);
    this.onBackgroundUp = this.onBackgroundUp.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onRemove = this.onRemove.bind(this);
    super();

    App.ADD.add(this.onAdd);
    App.REMOVE.add(this.onRemove);

    this.canvasSizeW = window.screen.availWidth * 2 * AppData.RATIO;
    this.canvasSizeH = window.screen.availHeight * 2 * AppData.RATIO;

    this.background = new Background();
    this.addChild(this.background);

    this.lineGraphics = new PIXI.Graphics();
    this.lineGraphics.alpha = AppData.LINE_ALPHA;
    this.addChild(this.lineGraphics);

    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);

    this.holder = new PIXI.Container();
    this.addChild(this.holder);

    this.draggable = new DraggableElement(this.background);
    this.draggable.position.x = (this.canvasSizeW - AppData.WIDTH) / -2;
    this.draggable.position.y = (this.canvasSizeH - AppData.HEIGHT) / -2;

    this.physics = new PhysicsEngine(this.canvasSizeW, this.canvasSizeH, false);
    this.physics.init();

    this.center = new Vec2();

    // is mouse down? used on move
    this.mouseDown = false;
    // used in down and move to identify if its a click or a up event
    this.isClick = false;
    // stored session_uid on mouse down if clicked on a body
    this.downBody = null;

    if (Modernizr.touch) {
      this.background.on("touchstart", this.onBackgroundDown);
      this.background.on("touchmove", this.onBackgroundMove);
      this.background.on("touchend", this.onBackgroundUp);
      this.background.on("touchendoutside", this.onBackgroundUp);
    } else {
      this.background.on("mousedown", this.onBackgroundDown);
      this.background.on("mousemove", this.onBackgroundMove);
      this.background.on("mouseup", this.onBackgroundUp);
      this.background.on("mouseupoutside", this.onBackgroundUp);
    }

    this.components = [];
    this.positions = [];

    if (AppData.SHOW_KEYBOARD_PANNEL) {
      this.draggable.position.y -= AppData.KEYBOARD_PANNEL_HEIGHT / 2;
    }
  }

  onBackgroundDown(e) {
    this.mouseDown = true;
    this.isClick = true;
    this.draggable.lock = true;

    const x = e.data.global.x - this.draggable.position.x - this.x;
    const y = e.data.global.y - this.draggable.position.y - this.y;
    this.downBody = this.physics.down(x, y);

    if (this.downBody === null) {
      App.TOGGLE_SETTINGS_PANNEL_HEIGHT.dispatch({ type: false });
      this.draggable.lock = false;
    }

    AppData.SHOW_MENU_PANNEL = false;
    App.TOGGLE_MENU.dispatch({ width: 0 });
    return null;
  }

  onBackgroundMove(e) {
    if (this.mouseDown) {
      this.isClick = false;

      const x = e.data.global.x - this.draggable.position.x - this.x;
      const y = e.data.global.y - this.draggable.position.y - this.y;
      this.physics.move(x, y);
    }
    return null;
  }

  onBackgroundUp(e) {
    const x = e.data.global.x - this.draggable.position.x - this.x;
    const y = e.data.global.y - this.draggable.position.y - this.y;
    this.physics.up(x, y);

    if (this.downBody !== null) {
      const xxx = Math.round(
        this.downBody.GetPosition().x * this.physics.worldScale +
          this.draggable.position.x -
          AppData.WIDTH / 2
      );
      const yyy = Math.round(
        this.downBody.GetPosition().y * this.physics.worldScale +
          this.draggable.position.y -
          AppData.HEIGHT / 2
      );

      // avoiding pixi to fire when I click the HTML
      if (this.mouseDown) {
        App.AUTO_SAVE.dispatch({
          component_session_uid: this.downBody.GetUserData().uid,
          x: xxx,
          y: yyy
        });
      }
    }
    this.mouseDown = false;
    this.draggable.lock = false;

    if (this.downBody !== null && this.isClick) {
      App.TOGGLE_SETTINGS_PANNEL_HEIGHT.dispatch({
        type: true,
        component_session_uid: this.downBody.GetUserData().uid
      });
      this.downBody = null;
    }
    return null;
  }

  onResize() {
    this.background.width = AppData.WIDTH;
    this.background.height = AppData.HEIGHT;
    this.draggable.resize(
      AppData.WIDTH,
      AppData.HEIGHT,
      this.canvasSizeW,
      this.canvasSizeH
    );
    return null;
  }

  onAdd(data) {
    this.center.x = AppData.WIDTH / 2 - this.draggable.position.x;
    this.center.y = AppData.HEIGHT / 2 - this.draggable.position.y;
    // if AppData.SHOW_KEYBOARD_PANNEL
    // @center.y = (AppData.HEIGHT - AppData.KEYBOARD_PANNEL_HEIGHT) / 2  - @draggable.position.y
    this.add(data);
    return null;
  }

  onRemove(data) {
    this.remove(data);
    return null;
  }

  add(data) {
    let shape;
    switch (data.type_uid) {
      case AppData.COMPONENTS.NSG:
        shape = new ComponentNsg(data.component_session_uid);
        break;
      case AppData.COMPONENTS.OSC:
        shape = new ComponentOsc(data.component_session_uid);
        break;
      case AppData.COMPONENTS.ENV:
        shape = new ComponentEnv(data.component_session_uid);
        break;
      case AppData.COMPONENTS.FLT:
        shape = new ComponentFlt(data.component_session_uid);
        break;
      case AppData.COMPONENTS.PTG:
        shape = new ComponentPtg(data.component_session_uid);
        break;
      case AppData.COMPONENTS.LFO:
        shape = new ComponentLfo(data.component_session_uid);
        break;
      default:
        return;
    }

    shape.onAdd();

    // attach box2d object to shape (for positioning)
    shape.box2d = this.physics.createCustom(
      shape.vertices,
      this.center.x + data.x,
      this.center.y + data.y,
      Box2D.Dynamics.b2Body.b2_dynamicBody
    );
    // attached component session id, for clicks logic
    shape.box2d.SetUserData({
      uid: shape.component_session_uid
    });
    this.components.push(shape);
    this.holder.addChild(shape);

    const xxx = Math.round(
      shape.box2d.GetPosition().x * this.physics.worldScale +
        this.draggable.position.x -
        AppData.WIDTH / 2
    );
    const yyy = Math.round(
      shape.box2d.GetPosition().y * this.physics.worldScale +
        this.draggable.position.y -
        AppData.HEIGHT / 2
    );
    return null;
  }

  remove(data) {
    App.TOGGLE_SETTINGS_PANNEL_HEIGHT.dispatch({ type: false });
    for (
      let i = 0, end = this.components.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      var component = this.components[i];

      if (component.component_session_uid === data.component_session_uid) {
        this.components.splice(i, 1);

        component.onRemove(() => {
          this.holder.removeChild(component);

          this.physics.destroy(component.box2d);

          return delete Session.SETTINGS[data.component_session_uid];
        });
        break;
      }
    }
    return null;
  }

  update() {
    this.graphics.clear();

    this.draggable.update();
    this.draggable.constrainToBounds();

    this.background.update(this.draggable.position, this.draggable.zoom);
    this.physics.update();

    this.positions = [];

    // gets data from box2D and position shapes
    for (
      let i = 0, end = this.components.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      const shape = this.components[i];

      const pos = shape.box2d.GetPosition();
      const rot = shape.box2d.GetAngle();

      shape.x = this.draggable.position.x + pos.x * this.physics.worldScale;
      shape.y = this.draggable.position.y + pos.y * this.physics.worldScale;
      shape.rotation = rot;

      // position
      let { x } = shape;
      let { y } = shape;

      // limits
      const lw = AppData.WIDTH;
      const lh = AppData.HEIGHT;

      // color
      const color =
        AppData.COLORS[Session.GET(shape.component_session_uid).type_uid];

      // constrains
      if (x < 0) {
        x = 0;
      }
      if (x > lw) {
        x = AppData.WIDTH;
      }
      if (y < 0) {
        y = 0;
      }
      if (y > lh) {
        y = AppData.HEIGHT;
      }

      if (x <= 0 || x >= lw || y <= 0 || y >= lh) {
        this.graphics.lineStyle(0);
        this.graphics.beginFill(color);
        this.graphics.drawCircle(x, y, AppData.MINIMAP);
        this.graphics.endFill();
      }

      // adds position per component_session_uid to be used to draw lines
      this.positions[shape.component_session_uid] = {
        x,
        y
      };
    }

    this.renderLines();
    return null;
  }

  renderLines() {
    this.lineGraphics.clear();

    for (
      let i = 0, end = this.components.length, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      const shape = this.components[i];

      if (Session.SETTINGS[shape.component_session_uid].audioCapable === true) {
        const env =
          Session.SETTINGS[shape.component_session_uid].connections.ENV;
        const ptg =
          Session.SETTINGS[shape.component_session_uid].connections.PTG;
        const lfo =
          Session.SETTINGS[shape.component_session_uid].connections.LFO;
        const flt =
          Session.SETTINGS[shape.component_session_uid].connections.FLT;

        if (env) {
          // colour = AppData.COLORS[Session.GET(shape.component_session_uid).type_uid]
          this.lineGraphics.beginFill(0, 0);
          this.lineGraphics.lineStyle(1 * AppData.RATIO, 0xffffff);
          this.lineGraphics.moveTo(
            this.positions[shape.component_session_uid].x,
            this.positions[shape.component_session_uid].y
          );
          this.lineGraphics.lineTo(
            this.positions[env].x,
            this.positions[env].y
          );
          this.lineGraphics.endFill();
        }

        if (ptg) {
          // colour = AppData.COLORS[Session.GET(shape.component_session_uid).type_uid]
          this.lineGraphics.beginFill(0, 0);
          this.lineGraphics.lineStyle(1 * AppData.RATIO, 0xffffff);
          this.lineGraphics.moveTo(
            this.positions[shape.component_session_uid].x,
            this.positions[shape.component_session_uid].y
          );
          this.lineGraphics.lineTo(
            this.positions[ptg].x,
            this.positions[ptg].y
          );
          this.lineGraphics.endFill();
        }

        if (lfo) {
          // colour = AppData.COLORS[Session.GET(shape.component_session_uid).type_uid]
          this.lineGraphics.beginFill(0, 0);
          this.lineGraphics.lineStyle(1 * AppData.RATIO, 0xffffff);
          this.lineGraphics.moveTo(
            this.positions[shape.component_session_uid].x,
            this.positions[shape.component_session_uid].y
          );
          this.lineGraphics.lineTo(
            this.positions[lfo].x,
            this.positions[lfo].y
          );
          this.lineGraphics.endFill();
        }

        if (flt) {
          // colour = AppData.COLORS[Session.GET(shape.component_session_uid).type_uid]
          this.lineGraphics.beginFill(0, 0);
          this.lineGraphics.lineStyle(1 * AppData.RATIO, 0xffffff);
          this.lineGraphics.moveTo(
            this.positions[shape.component_session_uid].x,
            this.positions[shape.component_session_uid].y
          );
          this.lineGraphics.lineTo(
            this.positions[flt].x,
            this.positions[flt].y
          );
          this.lineGraphics.endFill();
        }
      }
    }
    return null;
  }
}
