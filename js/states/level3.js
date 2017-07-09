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
        this.game.camera.follow(this.player)
        this.player.body.collideWorldBounds = true;
        this.player.body.allowGravity = false;
        
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
            //add the sprite
            var sSprite = this.game.add.sprite(shell.x,shell.y,"items","apple.png");
            //add physics
            this.game.physics.enable(sSprite);
            sSprite.body.allowGravity = false;
            this.shellsGroup.add(sSprite)
        },this)
        
        //add enemies
        this.baddies = this.game.add.group();
        for(var i = 0; i < 20; i++){
            var bad_guy = this.game.add.sprite(game.rnd.integerInRange(0,130 * 60),game.rnd.integerInRange(0,130*15),"baddie")
            bad_guy.scale.setTo(0.15)
            this.game.physics.arcade.enable(bad_guy);
            bad_guy.body.collideWorldBounds = true;
            bad_guy.body.velocity.setTo(game.rnd.integerInRange(-300,300),game.rnd.integerInRange(-300,300))
            bad_guy.body.bounce.set(1)
            bad_guy.body.allowGravity = false
            this.baddies.add(bad_guy)
        }
        
        //add a sword
        this.sword= this.player.addChild(game.add.sprite(80,-10,"items","sword_diamond.png"))
        this.sword.scale.setTo(0.6)
        this.sword.angle = 400;
        this.sword.visible = false;
        this.game.physics.arcade.enable(this.sword)
        //remove the sword gravity
        this.sword.body.allowGravity = false;
        
        //add space bar key
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        
        
        //text for the object of the game
        this.questText = game.add.text(20,20,"Collect 20 shells then a door will appear")
        this.shellColleted = 0;
        this.shellLabel = game.add.text(20,60,this.shellColleted + " shells collected")
        
        this.questText.fixedToCamera = true;
        this.shellLabel.fixedToCamera = true;
        
        
        //add a life bar
        this.heartGroup = this.game.add.group()
        for(var i = 0; i < 3; i++){
            var heart = this.game.add.sprite(600 + (55 * i),50,"heart")
            heart.anchor.setTo(0.5)
            heart.scale.setTo(0.1)
            this.heartGroup.add(heart)
        }
        this.heartGroup.fixedToCamera = true;
        
        //for the shells
        
        
        //add a door to fight the boss
        //this will make us go to another level for boss battle
        
        
        
        

    },
    update:function(){
        //sword and enemy overlap
        this.game.physics.arcade.overlap(this.sword,this.baddies,null,this.hitEnemies,this)
        this.game.physics.arcade.overlap(this.player,this.shellsGroup,null,this.collectShells,this)
        this.game.physics.arcade.overlap(this.player,this.baddies,null,this.playerHit,this)
        
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        if (this.cursors.up.isDown)
        {
            this.player.body.velocity.y = -300
            //this.player.angle = -90
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.velocity.y = 300
            //this.player.angle = 90
        }

        if (this.cursors.left.isDown)
        {
            this.player.body.velocity.x = -300;
            this.player.scale.setTo(-1,1)
            //this.player.angle = 0
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.velocity.x = 300;
            this.player.scale.setTo(1,1)
            //this.player.angle = 0
        }
        
        //show sword
        if(this.game.input.activePointer.isDown || this.spaceKey.isDown){
            this.showSword();
        }else{
            this.hideSword();
        }

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
        if(this.shellColleted==1){
            //add the door
            this.house = game.add.sprite(7430,775,"hut")
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
            baddy.x+=100;
        }else{
            player.kill();
            this.game.time.events.add(1500,function(){
                this.game.state.restart()
            })
        }
    },
    render:function(){
        //this.game.debug.body(this.sword)
    }
}