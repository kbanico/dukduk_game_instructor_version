var Level5 = {
    preload:function(){
        game.load.image("analog","assets/fusia.png");
        game.load.image("arrow","assets/longarrow2.png");
        game.load.image("bg1","assets/layer_1.png")
        game.load.image("rain","assets/rain.png")
        game.load.image("island","assets/island.png")
        game.load.image("water","assets/water.png")
        
    },
    create:function(){
        this.game.physics.arcade.gravity.y = 0;
        game.world.setBounds(0,0,5000,360);
        game.add.tileSprite(0,0,5000,360,"bg1")
        this.water = game.add.tileSprite(0,this.game.world.height-130,5000,130,"water")
        this.water.autoScroll(-200,0);
        this.game.physics.arcade.enable(this.water)
        this.water.body.immovable = true;
        this.water.body.setSize(this.water.width,this.water.height/2,0,this.water.height/2)
        
        
        //the launch pool
        var graphics = game.add.graphics(0,0);
        graphics.beginFill(0x049e0c);
        graphics.drawRect(295,100,10,250)
        
        this.analog = game.add.sprite(300,100,"analog")
        this.analog.width = 8;
        this.analog.anchor.setTo(0.5,0)
        
        this.arrow = game.add.sprite(300,100,"arrow");
        this.arrow.anchor.setTo(0.1,0.5)
        
        this.island = game.add.sprite(game.world.width - 450,0,"island")
        this.island.scale.setTo(0.5);
        this.game.physics.arcade.enable(this.island);
        
        
        this.player = game.add.sprite(150,100,"player")
        this.player.scale.setTo(0.3)
        this.player.animations.add("walking",[0,1,2],10,true);
        this.game.physics.arcade.enable(this.player)
        this.player.body.collideWorldBounds = true;
        this.player.body.bounce.set(0.8,0.7)
        this.player.body.drag.set(40,0);
        this.player.customParams = {};
        this.player.customParams.invisible = false;
   
        
        this.player.inputEnabled = true;
        this.player.events.onInputDown.add(this.set,this);
        this.player.events.onInputUp.add(this.launch,this);
        
        this.myTween = game.add.tween(this.player).to({x:150,y:100},1000,Phaser.Easing.Linear.None);
        this.myTween.onComplete.add(this.reappear,this);
        
        this.game.camera.follow(this.player,Phaser.Camera.FOLLOW_TOPDOWN)
        
        
        //enemies
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        var prevX = 0;
        var offsetX = 300;
        for(var i = 0; i < 10; i++){
            random = game.rnd.integerInRange(0,4);
            x = Math.floor(Math.random() * 5000) + 300;
            y = Math.floor(Math.random() * game.height - 50) - 50;
//            console.log(Math.abs(prevX - x) <= offsetX)
//            console.log(prevX)
            while(Math.abs(prevX - x) <= offsetX){
                x = Math.floor(Math.random() * 5000) + 500
            }
            prevX = x;
            crab = game.add.sprite(x,y,"crab")
            crab.frame = random
            crab.scale.setTo(0.2)
            crab.anchor.setTo(0.5);
            game.physics.arcade.enable(crab)
            crab.body.collideWorldBounds = true;
            tween = game.add.tween(crab).to({angle:359},1000,null,true,0,Infinity)
            this.enemies.add(crab)
            
        }
        
        //emitter
        this.emitter = game.add.emitter(0,0,100);
        this.emitter.makeParticles("rain");
        
        
        //random powerups
        this.powerUps = game.add.group();
        for(var i = 0; i < 5; i++){
            random = Math.floor(Math.random() * 3) + 1
            var power = game.add.sprite(game.rnd.integerInRange(300,4000),game.rnd.integerInRange(20,300),"shell" + random);
            power.scale.setTo(0.15)
            power.anchor.setTo(0.5)
            this.game.physics.arcade.enable(power)
            this.powerUps.add(power)
        }
    },
    update:function(){
        
        this.game.physics.arcade.collide(this.player,this.water,function(player,water){
            if(player.body.velocity.x >=10){
                this.emitter.x = player.x + 25;
                this.emitter.y = player.y +50;
                this.emitter.start(true,1000,null,20)
            }
        },null,this);
        
        this.game.physics.arcade.overlap(this.player,this.island,function(player,island){
            player.body.enable = false;
            player.animations.stop();
            tween = this.game.add.tween(player)
            tween.to({x:island.x+200,y:island.y + 200},800).start();
        },null,this);
        
        if(!this.player.customParams.invinsible){
            this.game.physics.arcade.collide(this.player,this.enemies)
        }
        
        this.game.physics.arcade.overlap(this.player,this.powerUps,function(player,powerup){
            if(!player.customParams.invinsible){
                powerup.kill();
                player.tint = 10830012.399608092;
                player.customParams.invinsible = true;
                player.customParams.tween = game.add.tween(player)
                player.customParams.tween.to({alpha:0.5},800,"Linear",true).loop(true).yoyo(true)
                game.time.events.add(5000,function(){
                   player.customParams.invinsible = false;
                    player.customParams.tween.loop = false;
                    player.customParams.tween.stop();
                    player.tint = 0xFFFFFF
                },this)
            }
        },null,this)
        
        this.arrow.rotation = game.physics.arcade.angleBetween(this.arrow,this.player)
        
        if(this.catchFlag){
            this.distance = game.physics.arcade.distanceToPointer(this.arrow);
            
            this.theta = game.physics.arcade.angleToPointer(this.arrow);
            
            // Govern the distance the sprite is dragged away from launch post
            if(this.distance > 330){
                this.distance = 300;
                this.adjacentX = Math.cos(this.theta) * this.distance;
                this.oppositeY = Math.sin(this.theta) * this.distance;
                this.player.x = 300 + this.adjacentX;
                this.player.y = 200 + this.oppositeY;
                this.analog.height = this.distance;
            }else{
                this.player.x = game.input.activePointer.worldX;
                this.player.y = game.input.activePointer.worldY;
                this.analog.height = this.distance;
            }
            this.arrow.alpha = 1;
            this.analog.alpha = 0.5;
            this.analog.rotation = this.arrow.rotation - Math.PI / 2;
            this.launchVelocity = this.analog.height;
        }
        
        //check sprite motion and if done, return camera to left side of world
        
        var tweening = this.myTween.isRunning;
       
        //console.log(!tweening && this.launched &&  this.player.body.deltaX()==0 && this.player.body.deltaY() == 0)
        if(!tweening && this.launched &&  this.player.body.velocity.x ==0 && this.player.body.velocity.y < 0){
            this.player.body.velocity.setTo(0,0);
            this.player.body.moves = false;
            this.player.body.enable = false;
            this.player.animations.stop();
            this.myTween.start();
        }
        
        
        
       
        
        
        
    },
    reappear:function(){
        this.launched = false;
        this.player.alpha = 1;
    },
    set:function(player,pointer){
        //disallow launching until reset
        if(!this.launched){
            this.catchFlag = true;
            this.game.camera.follow(null);
            this.player.body.enable = false;
            this.player.body.moves = false;
            this.player.body.gravity.set(0);
            this.player.body.velocity.set(0);
            this.player.animations.play("walking")
        }
    },
    launch:function(){
        if(this.catchFlag){
            this.catchFlag = false;
            this.launched = true;
            game.camera.follow(this.player,Phaser.Camera.FOLLOW_TOPDOWN);
            this.arrow.alpha = 0;
            this.analog.alpha = 0;
            this.Xvector = (this.arrow.x - this.player.x) * 3;
            this.Yvector = (this.arrow.y - this.player.y) * 3;
            this.player.body.enable = true;
            this.player.body.moves = true;
            this.player.body.gravity.setTo(0,180);
            this.player.body.velocity.setTo(this.Xvector,this.Yvector);
        }
    }
}