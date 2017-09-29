/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class PhysicsEngine {

    constructor(width, height, debug) {

        this.getBodyCB = this.getBodyCB.bind(this);
        this.width = width;
        this.height = height;
        this.debug = debug;
        this.allowSleep         = true;
        this.worldScale         = 60;
        this.worldStep          = 1/20;
        this.velocityIterations = 5;
        this.positionIterations = 4;
        this.gravity            = new Box2D.Common.Math.b2Vec2(0, 0);

        // virtual bounds
        this.boundsSize = { x: 0, y: 0, width: this.width, height: this.height };

        this.boundSize = 10;
        this.boundPadding = 0;

        this.debugCanvas = document.createElement( 'canvas' );

        this.bounds = [];

        // dragging
        this.selectedBody = null;
        this.mousePVec = null;
        this.mouseJoint = null;
    }

    init() {
        this.world = new Box2D.Dynamics.b2World(this.gravity, this.allowSleep);
        if (this.debug) {
            this.world.SetDebugDraw(this.debugDraw());
        }

        this.addBounds();
        return null;
    }

    update() {
        this.world.Step( this.worldStep, this.velocityIterations, this.positionIterations);
        this.world.DrawDebugData();
        this.world.ClearForces();
        return null;
    }

    down(mouseX, mouseY) {
        const body = this.getBodyAtPosition( mouseX / this.worldScale, mouseY / this.worldScale );
        if (body) {
            const md = new Box2D.Dynamics.Joints.b2MouseJointDef();
            md.bodyA = this.world.GetGroundBody();
            md.bodyB = body;
            md.target.Set( mouseX / this.worldScale, mouseY / this.worldScale );
            md.collideConnected = true;
            md.maxForce = 1000.0 * body.GetMass();
            this.mouseJoint = this.world.CreateJoint( md );
            body.SetAwake( true );
        }
        return body;
    }

    move(mouseX, mouseY) {
        if (this.mouseJoint) {
            this.mouseJoint.SetTarget(new Box2D.Common.Math.b2Vec2( mouseX / this.worldScale, mouseY / this.worldScale ));
        }
        return null;
    }

    up(mouseX, mouseY) {
        if (this.mouseJoint) {
            this.world.DestroyJoint( this.mouseJoint );
            this.mouseJoint = null;
            this.selectedBody = null;
        }
        return null;
    }

    getBodyAtPosition(x, y) {
        this.mousePVec = new Box2D.Common.Math.b2Vec2( x, y );
        const aabb = new Box2D.Collision.b2AABB();
        aabb.lowerBound.Set( x - 0.001, y - 0.001 );
        aabb.upperBound.Set( x + 0.001, y + 0.001 );
        this.world.QueryAABB( this.getBodyCB, aabb );

        return this.selectedBody;
    }

    getBodyCB(fixture) {
        if (fixture.GetBody().GetType() !== Box2D.Dynamics.b2Body.b2_staticBody) {
            if (fixture.GetShape().TestPoint( fixture.GetBody().GetTransform(), this.mousePVec )) {
                this.selectedBody = fixture.GetBody();
                return false;
            }
        }
        return true;
    }

    createBox(x, y, width, height, type) {
        const polygonShape = new Box2D.Collision.Shapes.b2PolygonShape();
        polygonShape.SetAsBox( width / 2 / this.worldScale, height / 2 / this.worldScale );

        const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.5;
        fixtureDef.shape = polygonShape;

        const bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = type;
        // bodyDef.linearDamping = 4
        // bodyDef.angularDamping = 4
        // bodyDef.fixedRotation = true
        bodyDef.position.Set( x / this.worldScale, y / this.worldScale );

        const body = this.world.CreateBody( bodyDef );
        body.CreateFixture( fixtureDef );
        return body;
    }

    createCircle( radius, x, y, type ) {
        const polygonShape = new Box2D.Collision.Shapes.b2CircleShape( radius / this.worldScale );

        const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.1;
        fixtureDef.shape = polygonShape;

        const bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = type;
        // bodyDef.linearDamping = 2
        // bodyDef.angularDamping = 2
        // bodyDef.fixedRotation = true
        bodyDef.position.Set( x / this.worldScale, y / this.worldScale );

        const body = this.world.CreateBody( bodyDef );
        body.CreateFixture( fixtureDef );
        return body;
    }

    createCustom( vertices, x, y, type ) {
        const polygonShape = new Box2D.Collision.Shapes.b2PolygonShape();

        const fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.1;
        fixtureDef.shape = polygonShape;
        fixtureDef.shape.SetAsArray( vertices );

        const bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = type;
        bodyDef.linearDamping = 1.5;
        bodyDef.angularDamping = 1.5;
        bodyDef.fixedRotation = true;
        bodyDef.position.Set( x / this.worldScale, y / this.worldScale );

        const body = this.world.CreateBody( bodyDef );
        body.CreateFixture( fixtureDef );
        return body;
    }

    addBounds() {
        this.bounds.push( this.createBox(
            this.boundsSize.x + (this.boundsSize.width / 2),
            this.boundsSize.y + this.boundPadding + (this.boundSize / 2) + 0,
            this.boundsSize.width + (this.boundSize * 2),
            this.boundSize,
            Box2D.Dynamics.b2Body.b2_staticBody ) );

        this.bounds.push( this.createBox(
            (this.boundsSize.x - this.boundPadding - (this.boundSize / 2)) + this.boundsSize.width,
            this.boundsSize.y + (this.boundsSize.height / 2),
            this.boundSize,
            this.boundsSize.height + (this.boundSize * 2),
            Box2D.Dynamics.b2Body.b2_staticBody ) );

        this.bounds.push( this.createBox(
            this.boundsSize.x + (this.boundsSize.width / 2),
            (this.boundsSize.y - this.boundPadding - (this.boundSize / 2)) + this.boundsSize.height,
            this.boundsSize.width + (this.boundSize * 2),
            this.boundSize,
            Box2D.Dynamics.b2Body.b2_staticBody ) );

        this.bounds.push( this.createBox(
            this.boundsSize.x + this.boundPadding + (this.boundSize / 2) + 0,
            this.boundsSize.y + (this.boundsSize.height / 2),
            this.boundSize,
            this.boundsSize.height + (this.boundSize * 2),
            Box2D.Dynamics.b2Body.b2_staticBody ) );
        return null;
    }

    removeBounds() {
        for (let i = 0, end = this.bounds.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            this.world.DestroyBody(this.bounds[i]);
        }
        this.bounds = [];
        return null;
    }

    destroy(body) {
        this.world.DestroyBody(body);
        return null;
    }

    debugDraw() {
        this.debugCanvas.style.position = 'absolute';
        this.debugCanvas.style.top = 0;
        this.debugCanvas.style.left = 0;
        this.debugCanvas.style.pointerEvents = 'none';
        this.debugCanvas.width = this.width;
        this.debugCanvas.height = this.height;
        document.body.appendChild( this.debugCanvas );

        const debugDraw = new Box2D.Dynamics.b2DebugDraw();
        debugDraw.SetSprite( this.debugCanvas.getContext( '2d' ) );
        debugDraw.SetDrawScale( this.worldScale );
        debugDraw.SetFillAlpha( 0.5 );
        debugDraw.SetLineThickness( 1.0 );
        debugDraw.SetFlags( Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit );
        return debugDraw;
    }
}
