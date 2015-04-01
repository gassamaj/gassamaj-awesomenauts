game.PlayerEntity = me.Entity.extend({
init: function(x, y, settings) {
this.setSuper(x, y);
        this.setPlayerTimers();
        this.setAttributes();
        this.type = "PlayerEntity";
        this.setFlags();
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.addAnimation();
        this.renderable.setCurrentAnimation("idle");
        },
        setSuper: function(x, y) {
        this._super(me.Entity, 'init', [x, y, {
        image: "player",
                width: 64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64",
                getShape: function() {
                return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
        }]);
        },
        setPlayerTimers: function() {
        this.now = new Date().getTime();
                this.lastHit = this.now;
                this.lastAtAttack = new Date().getTime(); //Haven't used this
        },
        setAttributes: function() {
        this.health = game.data.playerHealth;
                this.body.setVelocity(game.data.playerMoveSpeed, 20);
                this.attack = game.data.playerAttack;
        },
        setFlags: function() {
        //Keeps track of which direction your character is going
        this.facing = "right";
                this.dead = false;
                this.attacking = false;
        },
        addAnimation: function() {
        this.renderable.addAnimation("idle", [78]);
                this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
                this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
        },
        update: function(delta) {
        this.now = new Date().getTime();
                this.dead = this.checkIfDead();
                this.checkKeyPressesAndMove();
                this.setAnimation();
                me.collision.check(this, true, this.collideHandler.bind(this), true);
                this.body.update(delta);
                this._super(me.Entity, "update", [delta]);
                return true;
        },
        checkIfDead: function() {
        if (this.health <= 0) {
        return true;
        }
        return false;
        },
        checkKeyPressesAndMove: function() {
        if (me.input.isKeyPressed("right")) {
        this.moveRight();
        } else if (me.input.isKeyPressed("left")) {
        this.moveLeft();
        } else {
        this.body.vel.x = 0;
        }

        if (me.input.isKeyPressed("jump") && !this.jumping && !this.falling) {
        this.jump();
        }

        this.attacking = me.input.isKeyPressed("attack");
        },
        moveRight: function() {

        },
        moveLeft: function() {
        this.facing = "left";
                this.body.vel.x -= this.body.accel.x * me.timer.tick;
                this.flipX(false);
        },
        jump: function() {
        this.jumping = true;
                this.body.vel.y -= this.body.accel.y * me.timer.tick;
        },
        setAnimation: function() {

        },
        loseHealth: function(damage) {
        this.health = this.health - damage;
        },
        collideHandler: function(response) {
        if (response.b.type === 'EnemyBaseEntity') {
        this.collideWithEnemyBase(response);
        
        } else if (response.b.type === 'EnemyCreep') {
        this.collideWithEnemyCreep(response);
        }
        
        },
        collideWithEnemyBase: function(response){
            var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;
 
  
         
        
        this.stopMovement(xdif);
        
        
        
    },
            stopMovement: function(xdif){
             if (xdif > 0) {
             //this.pos.x = this.pos.x + 1;
              if (this.facing === "left") {
              this.body.vel.x = 0;
                                    }
                           } else {
               //this.pos.x = this.pos.x - 1;
               if (this.facing === "right") {
              this.body.vel.x = 0;
             }
          }

        },
        checkAttack: function(xdif, ydif){
        if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer
                && (Math.abs(ydif) <= 40) &&
                (((xdif > 0) && this.facing === "left") || ((xdif < 0) && this.facing === "right"))
                ) {
        this.lastHit = this.now;
                //if the creeps health is less than our attack, execute code in if statement
                return true;
        }
        return false;
        },

        hitCreep: function(response){
        if (response.b.health <= game.data.playerAttack) {
        //adds one gold for a creep kill
        game.data.gold += 1;
                console.log("Current gold:" + game.data.gold);
        }

        response.b.loseHealth(game.data.playerAttack);
        }

});




