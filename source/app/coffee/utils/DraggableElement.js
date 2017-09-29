/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// import math.Vec2
class DraggableElement {
  constructor(element) {
    // settings
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.element = element;
    this.VELOCITY_DAMPING = 0.9;
    this.TWEEN_EASE = 0.07;
    this.PRECISION = 0.1;

    // vectors
    this.position = new Vec2();
    this.velocity = new Vec2();

    this.draggingOld = new Vec2();
    this.draggingCur = new Vec2();
    this.tweenTarget = new Vec2();

    // more settings
    this.lock = false;
    this.dragging = false;
    this.moving = false;
    this.onTween = false;
    this.speed = 0;
    this.currentTouches = 0;

    if (Modernizr.touch) {
      this.element
        .on("touchstart", this.onTouchStart)
        .on("touchmove", this.onTouchMove)
        .on("touchend", this.onTouchEnd)
        .on("touchendoutside", this.onTouchEnd);
    } else {
      this.element
        .on("mousedown", this.onMouseDown)
        .on("mousemove", this.onMouseMove)
        .on("mouseup", this.onMouseUp)
        .on("mouseupoutside", this.onMouseUp);
    }
  }
  // window.addEventListener 'mousewheel', @onMouseWheel, false

  onMouseDown(e) {
    e.data.originalEvent.preventDefault();
    this.startDrag(e.data.originalEvent.clientX, e.data.originalEvent.clientY);
    return null;
  }

  onMouseMove(e) {
    e.data.originalEvent.preventDefault();
    this.moving = true;
    this.updateDrag(e.data.originalEvent.clientX, e.data.originalEvent.clientY);
    return null;
  }

  onMouseUp() {
    this.endDrag();
    return null;
  }

  onTouchStart(e) {
    this.currentTouches++;
    if (this.currentTouches > 1) {
      return;
    }
    this.identifier = e.data.identifier;

    e.data.originalEvent.preventDefault();
    this.startDrag(e.data.global.x, e.data.global.y);
    return null;
  }

  onTouchMove(e) {
    if (this.identifier !== e.data.identifier) {
      return;
    }

    e.data.originalEvent.preventDefault();
    this.updateDrag(e.data.global.x, e.data.global.y);
    return null;
  }

  onTouchEnd(e) {
    this.currentTouches--;
    if (this.identifier !== e.data.identifier) {
      return;
    }

    this.endDrag();
    this.identifier = null;
    return null;
  }

  onMouseWheel(event) {
    if (this.lock === true) {
      return;
    }
    if (AppData.SHOW_MENU_PANNEL === true) {
      return;
    }

    this.tweenPositionTo = null;
    this.velocity.set(event.wheelDeltaX * 0.2, event.wheelDeltaY * 0.2);
    return null;
  }

  startDrag(posX, posY) {
    if (this.dragging) {
      return;
    }
    if (this.lock) {
      return;
    }
    this.dragging = true;
    this.draggingCur.set(posX, posY);
    this.draggingOld.copy(this.draggingCur);
    return null;
  }

  updateDrag(posX, posY) {
    if (!this.dragging) {
      return;
    }
    if (this.lock) {
      return;
    }
    this.draggingCur.set(posX, posY);
    const x = this.draggingCur.x - this.draggingOld.x;
    const y = this.draggingCur.y - this.draggingOld.y;
    this.velocity.set(x, y);
    this.draggingOld.copy(this.draggingCur);
    return null;
  }

  endDrag() {
    if (!this.dragging) {
      return;
    }
    this.dragging = false;
    return null;
  }

  update() {
    // if there is a tween, interpolate value
    if (this.onTween) {
      this.position.interpolateTo(this.tweenTarget, this.TWEEN_EASE);
      if (
        Math.abs(Vec2.subtract(this.position, this.tweenTarget).length()) <
        this.PRECISION
      ) {
        this.onTween = false;
      }
    }

    if (this.lock) {
      return;
    }

    if (this.moving === true) {
      this.moving = false;
    }
    if (!this.moving) {
      this.velocity.scale(this.VELOCITY_DAMPING);
    }
    this.speed = this.velocity.length();

    // round to precision
    if (Math.abs(this.speed) < this.PRECISION) {
      this.velocity.x = 0;
      this.velocity.y = 0;
    }

    this.position.x += this.velocity.x * AppData.RATIO;
    this.position.y += this.velocity.y * AppData.RATIO;
    return null;
  }

  resize(viewportWidth, viewportHeight, globalWidth, globalHeight) {
    this.vpw = viewportWidth;
    this.vph = viewportHeight;
    this.gw = globalWidth;
    this.gh = globalHeight;
    return null;
  }

  constrainToBounds() {
    if (this.position.x < -(this.gw - this.vpw)) {
      this.position.x = -(this.gw - this.vpw);
    }
    if (this.position.x > 0) {
      this.position.x = 0;
    }
    if (this.position.y < -(this.gh - this.vph)) {
      this.position.y = -(this.gh - this.vph);
    }
    if (this.position.y > 0) {
      this.position.y = 0;
    }
    return null;
  }

  // sets the dragger to a specific x/y position
  setPosition(x, y) {
    const temp = new Vec2(x, y);
    temp.invert();

    this.onTween = true;
    this.tweenTarget.copy(temp);
    return null;
  }
}
