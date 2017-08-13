var Level6 = {
    preload:function(){
        game.scale.setGameSize(1000, 650); // et voila!
        
        
    },
    create:function(){
        this.game.physics.arcade.gravity.y = 300
        game.stage.backgroundColor = "#98f5ff"
        this.map = this.game.add.tilemap("level6");
        this.map.addTilesetImage("jungle_spritesheet","jungleTiles")
        
        //create layers
        this.backgroundLayer = this.map.createLayer("backgroundLayer");
        this.collisionLayer = this.map.createLayer("collisionLayer")
        this.enemyCollisionLayer = this.map.createLayer("enemyCollisionLayer")
        this.enemyCollisionLayer.visible = false
        this.backgroundLayer.resizeWorld();
        this.map.setCollisionBetween(1,30,true,"collisionLayer")
        this.map.setCollisionBetween(1,30,true,"enemyCollisionLayer")
        
        this.player = new Player(this,10,1000,"player")
        this.player.scale.setTo(0.7)
        this.game.camera.follow(this.player)
        
        //control player
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        //groups
        this.enemies = this.game.add.group()
        this.bullets = this.game.add.group();
        
        
        
        var enemyArr = findObjectsByType("enemy",this.map,"objectsLayer");
        
        enemyArr.forEach(function(e){
            var enemy = new Enemy(this,e.x,e.y,"pig");
            this.enemies.add(enemy)
        },this)
        
        
        this.shootingTime = 0;
        
        
    },
    update:function(){
        this.game.physics.arcade.collide(this.player,this.collisionLayer)
        this.game.physics.arcade.collide(this.enemies,this.collisionLayer)
        this.game.physics.arcade.collide(this.enemies,this.enemyCollisionLayer)
        this.game.physics.arcade.overlap(this.enemies,this.bullets,function(enemy,bullet){
            bullet.kill();
            enemy.kill();
            //enemy.damage(0.3)
        },null,this)
        this.game.physics.arcade.overlap(this.player,this.enemies,function(player,enemy){
            player.kill();
        },null,this)
        
        this.game.physics.arcade.collide(this.bullets,this.collisionLayer,function(bullet,tile){
            bullet.kill();
        },null,this)
        
        
        if(this.input.activePointer.isDown && this.game.time.now > this.shootingTime){
            this.fireBullet(this.player.x,this.player.y - 50);
            this.shootingTime = this.game.time.now + 500
        }
        
       
    },
    fireBullet:function(x,y){
        var bullet = this.bullets.getFirstDead()
        if(!bullet){
            bullet = new Bullet(this,x,y)
        }else{
            bullet.reset(x,y)
        }
        bullet.loadTexture("shell" + Math.floor(Math.random() * 3 + 1))
        if(this.player.scale.x > 0){
            bullet.body.velocity.x = 400
        }else{
            bullet.body.velocity.x = -400
        }
        var tween = this.game.add.tween(bullet).to({angle:"+360"},850).start();
        this.bullets.add(bullet)
    },
    randomVelocity(velocity){
        velocity = Math.floor(Math.random()* velocity + 60);
        scale = Math.floor(Math.random() * 2) == 1 ? -1 : 1
        return velocity * scale;
    }
}


function Enemy(state,x,y,key){
    Phaser.Sprite.call(this,state.game,x,y,key);
    this.state = state;
    this.game = state.game;
    
    this.anchor.setTo(0.7);
    this.game.physics.arcade.enable(this);
    this.game.add.existing(this);
    this.body.velocity.x = this.state.randomVelocity(200)
    this.body.collideWorldBounds = true;
    this.body.bounce.x = 1
    this.timeCounter = 0
    
    
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(){
    
    if(this.body.velocity.x > 0){
        this.scale.x = 1
    }
    else {
        this.scale.x = -1
    }
}

function Player(state,x,y,key){
    Phaser.Sprite.call(this,state.game,x,y,key);
    this.state = state;
    this.game = state.game;
    this.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this);
    this.game.add.existing(this);
    this.animations.add("walk",[0,1,],8,false)
    this.body.gravity.y = 1000
    this.body.collideWorldBounds = true;
    
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
    this.body.velocity.x = 0
    
    
    
    if(this.state.cursors.left.isDown){
        this.body.velocity.x = -500;
        this.scale.x = -0.7
        this.animations.play("walk")
    }
    else if(this.state.cursors.right.isDown){
        this.body.velocity.x = 500;
        this.scale.x = 0.7
        this.animations.play("walk")
    }
    if(this.state.cursors.up.isDown && this.body.onFloor()){
        this.body.velocity.y = -600;
        this.animations.play("walk")
    }  
};

function Bullet(state,x,y){
    Phaser.Sprite.call(this,state.game,x,y,"shell" + Math.floor(Math.random() * 3 + 1))
    this.state = state;
    this.game = state.game;
    this.game.physics.arcade.enable(this);
    this.anchor.setTo(0.5)
    this.body.gravity.y = 200;
    this.scale.setTo(0.1)
    this.checkWorldBounds = true;  
    this.outOfBoundsKill = true; 
    
    
}

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

