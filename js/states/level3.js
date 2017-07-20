var Level3={
    preload:function(){
        
    },
    create:function(){
//        game.world.setBounds(0, 0, 7800, 1950);
         //Change the background colour
    //this.game.stage.backgroundColor = "#a9f0ff";
        //the map
        this.map = this.game.add.tilemap("level2");
        
        //join it
         this.map.addTilesetImage("spritesheet_tiles","minecraftTiles")
        
        //create layers
        this.backgroundLayer = this.map.createLayer("backgroundLayer")
        this.foregroundLayer = this.map.createLayer("foregroundLayer")
        this.backgroundLayer.resizeWorld();
        
        //player
        this.player = game.add.sprite(100,100,"player")
        this.game.physics.arcade.enable(this.player)
        this.player.anchor.setTo(0.5)
        this.player.scale.setTo(0.5)
        this.game.camera.follow(this.player)
        this.player.body.collideWorldBounds = true;
        this.player.body.allowGravity = false;
        this.player.customProperties = {};
        
        //cursor
        this.cursors = game.input.keyboard.createCursorKeys();
        
         //get shell data
        this.shellData = findObjectsByType("shell",this.map,"objectsLayer");
        console.log(this.shellData)
        var total = 0
        this.shellData.forEach(function(element){
            total++;
        },this);
        console.log(total)
        
        //add shells to the game
        this.shellsGroup = game.add.group()
        this.shellData.forEach(function(shell){
            random = Math.floor(Math.random()*3) + 1
            //add the sprite
            var sSprite = this.game.add.sprite(shell.x,shell.y,"shell" + random);
            sSprite.scale.setTo(0.2)
            //add physics
            this.game.physics.enable(sSprite);
            sSprite.body.allowGravity = false;
            this.shellsGroup.add(sSprite)
        },this)
        
        //add enemies
        this.baddies = this.game.add.group();
        for(var i = 0; i < 10; i++){
            var bad_guy = this.game.add.sprite(game.rnd.integerInRange(0,130 * 60),game.rnd.integerInRange(0,130*15),"baddie")
            bad_guy.scale.setTo(3)
            this.game.physics.arcade.enable(bad_guy);
            bad_guy.body.collideWorldBounds = true;
            bad_guy.anchor.setTo(0.5)
            bad_guy.body.velocity.setTo(game.rnd.integerInRange(-300,300),game.rnd.integerInRange(-300,300))
            bad_guy.body.bounce.set(1)
            bad_guy.body.allowGravity = false;
            bad_guy.animations.add("walking",[0,1,2],8,true);
            bad_guy.animations.play("walking")
            
            this.baddies.add(bad_guy)
        }
        
        //add a sword
        this.sword= this.player.addChild(game.add.sprite(80,-10,"sword"))
        this.sword.scale.setTo(0.6)
        this.sword.angle = 400;
        this.sword.visible = false;
        this.game.physics.arcade.enable(this.sword)
        //remove the sword gravity
        this.sword.body.allowGravity = false;
        
        //add space bar key
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        
        
        //text for the object of the game
        this.questText = game.add.text(20,60,"Collect 20 shells then a door will appear")
        this.shellColleted = 0;
        this.shellLabel = game.add.text(20,20,this.shellColleted + " shells collected")
        
        this.questText.fixedToCamera = true;
        this.shellLabel.fixedToCamera = true;
        
        this.game.time.events.add(5000,function(){
            this.questText.kill()
        },this)
        
        
        //add a life bar
        this.heartGroup = this.game.add.group()
        for(var i = 0; i < 3; i++){
            var heart = this.game.add.sprite(500 + (55 * i),30,"heart")
            heart.anchor.setTo(0.5)
            heart.scale.setTo(0.09)
            this.heartGroup.add(heart)
        }
        this.heartGroup.fixedToCamera = true;
        
        //for the shells
        
        
        this.createOnScreenControls()
        
        

    },
    update:function(){
        //sword and enemy overlap
        this.game.physics.arcade.overlap(this.sword,this.baddies,null,this.hitEnemies,this)
        this.game.physics.arcade.overlap(this.player,this.shellsGroup,null,this.collectShells,this)
        this.game.physics.arcade.overlap(this.player,this.baddies,null,this.playerHit,this)
        this.game.physics.arcade.overlap(this.player,this.house,null,this.touchedHouse,this)
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        if (this.cursors.up.isDown || this.player.customProperties.goUp)
        {
            this.player.body.velocity.y = -300
            //this.player.angle = -90
        }
        else if (this.cursors.down.isDown || this.player.customProperties.goDown )
        {
            this.player.body.velocity.y = 300
            //this.player.angle = 90
        }

        if (this.cursors.left.isDown || this.player.customProperties.goLeft )
        {
            this.player.body.velocity.x = -300;
            this.player.scale.setTo(-0.5,0.5)
            //this.player.angle = 0
        }
        else if (this.cursors.right.isDown || this.player.customProperties.goRight)
        {
            this.player.body.velocity.x = 300;
            this.player.scale.setTo(0.5,0.5)
            //this.player.angle = 0
        }
        
        //show sword
        if(this.player.customProperties.attack || this.spaceKey.isDown){
            this.showSword();
        }else{
            this.hideSword();
        }
        
        
        
        this.baddies.forEachAlive(function(zombie){
            if(this.player.x < zombie.x && ((zombie.y - this.player.y) <= 10)){
                zombie.scale.setTo(3,3)  
            }else if(this.player.x > zombie.x && ((zombie.y - this.player.y) <= 10)){
                zombie.scale.setTo(-3,3)  
            }else if(zombie.body.velocity.x > 0){
                zombie.scale.setTo(-3,3)
            }else{
                zombie.scale.setTo(3,3)
            }
            
            //zombie.body.velocity.x > 0 ? zombie.scale.setTo(-3,3) : zombie.scale.setTo(3,3)
             
            
        },this);
        
 
        
        
        
       

    },
    showSword:function(){
        this.sword.visible = true;
    },
    hideSword:function(){
        this.sword.visible = false;
    },
    hitEnemies:function(sword,enemy){
        if(this.sword.visible){
            enemy.kill();
            //play a sound
        }
        
    },
    collectShells:function(player,shell){
        this.shellColleted++;
        shell.kill();
        this.shellLabel.text = this.shellColleted + " shells collected";
        if(this.shellColleted==20){
            //add the door
            this.house = game.add.sprite(7430,775,"hut")
            this.physics.arcade.enable(this.house)
            this.house.body.allowGravity = false
            this.house.scale.setTo(0.5)
            this.game.camera.follow(null)
            var tween = this.game.add.tween(this.game.camera).to({x:this.house.x,y:this.house.y},2000,Phaser.Easing.Quadratic.InOut,true)
            this.baddies.setAll("body.enable",false)
            tween.onComplete.add(function(){
                this.game.time.events.add(2000,function(){
                    this.game.camera.follow(this.player)
                    this.game.time.events.add(3000,function(){this.baddies.setAll("body.enable",true)},this)
                    this.questText.text = "Quick head to the house"
                },this)
                
            },this)
            // If my camera is already following a targetif (that.game.camera.target) {  that.game.camera.follow(null);  // Unfollow the target  that.game.add.tween(that.game.camera).to( {x: pCenter.x - (that.game.camera.width / 2), y: pCenter.y - (that.game.camera.height / 2) }, 750, Phaser.Easing.Quadratic.InOut, true);  // Move the camera to the center of a planet, adjusting for the camera being 'centered' at the top-left.}
        }
        //play a sound
    },
    playerHit:function(player,baddy){
        var life = this.heartGroup.getFirstAlive()
        if(life !==null){
            life.kill()
//            baddy.x+=game.rnd.integerInRange(-300,300);
//            baddy.y+=game.rnd.integerInRange(-300,300);
            baddy.kill()
        }else{
            player.kill();
            this.game.time.events.add(1500,function(){
                this.game.state.restart()
            })
        }
    },
    render:function(){
        //this.game.debug.body(this.sword)
    },
      touchedHouse:function(player,house){
        console.log("YO")
        this.game.state.start("Level4")
    },
    createOnScreenControls:function(){
        this.up = game.add.button(100,game.height - 270,"up")
        this.down = game.add.button(100,game.height - 80,"down")
        this.right = game.add.button(200,game.height - 170,"right")
        this.left = game.add.button(0,game.height - 170,"left")
        this.a = game.add.button(game.width -150,game.height-120,"a")
        this.up.fixedToCamera = true
        this.down.fixedToCamera = true
        this.left.fixedToCamera = true
        this.right.fixedToCamera = true
        this.a.fixedToCamera = true
        
        this.up.events.onInputDown.add(function(){
        this.player.customProperties.goUp = true
    },this) 
    
        this.up.events.onInputUp.add(function(){
        this.player.customProperties.goUp = false
    },this) 
        
        this.up.events.onInputOver.add(function(){
        this.player.customProperties.goUp = true
    },this) 
    
        this.up.events.onInputOut.add(function(){
        this.player.customProperties.goUp = false
    },this)
    
    
        this.left.events.onInputDown.add(function(){
        this.player.customProperties.goLeft = true
    },this) 
    
        this.left.events.onInputUp.add(function(){
        this.player.customProperties.goLeft = false
    },this) 
        
        this.left.events.onInputOver.add(function(){
        this.player.customProperties.goLeft = true
    },this) 
    
        this.left.events.onInputOut.add(function(){
        this.player.customProperties.goLeft = false
    },this) 
    
        this.right.events.onInputDown.add(function(){
        this.player.customProperties.goRight = true
    },this) 
    
        this.right.events.onInputUp.add(function(){
        this.player.customProperties.goRight = false
    },this) 
        
        this.right.events.onInputOver.add(function(){
        this.player.customProperties.goRight = true
    },this) 
    
        this.right.events.onInputOut.add(function(){
        this.player.customProperties.goRight = false
    },this)
    
        this.down.events.onInputDown.add(function(){
        this.player.customProperties.goDown = true
    },this) 
    
        this.down.events.onInputUp.add(function(){
        this.player.customProperties.goDown = false
    },this) 
        
        this.down.events.onInputOver.add(function(){
        this.player.customProperties.goDown = true
    },this) 
    
        this.down.events.onInputOut.add(function(){
        this.player.customProperties.goDown = false
    },this) 
        
        this.a.events.onInputDown.add(function(){
        this.player.customProperties.attack = true
    },this) 
    
        this.a.events.onInputUp.add(function(){
        this.player.customProperties.attack = false
    },this) 
        
        this.a.events.onInputOver.add(function(){
        this.player.customProperties.attack = true
    },this) 
    
        this.a.events.onInputOut.add(function(){
        this.player.customProperties.attack = false
    },this) 
        
        
    }
   
}