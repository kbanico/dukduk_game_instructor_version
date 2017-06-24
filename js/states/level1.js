var Level1 = {
    init:function(){
      this.game.physics.arcade.gravity.y = 1000;  
    
        this.playerSpeed = 300;
    },
    preload:function(){
        

    },
    create:function(){
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.loadLevel();
        
        //jump timer
        this.jumpTimer = 0;
        
        //crab left over
        this.crabLeftOver = 5;
        this.crabLeftOverText = this.game.add.text(20,20,"Find " + this.crabLeftOver + " duk duk crabs",{font: "30px Arial", fill: "#fff"});
        this.crabLeftOverText.fixedToCamera = true;
        
        
    },
    update:function(){
        this.game.physics.arcade.collide(this.player,this.collisionLayer,this.blockCollision,null,this)
        movePlayer(this.player,this.playerSpeed,this.cursors);
        this.game.physics.arcade.overlap(this.player,this.pickaxe,null,this.attachPickAxe,this);
        this.game.physics.arcade.overlap(this.player,this.crabs,null,this.pickedUpCrab,this);
        this.game.physics.arcade.overlap(this.player,this.hut,null,this.showCrab,this)
        
    },
    loadLevel:function(){
        game.stage.backgroundColor = '#98F5FF';

        //load the map
        this.map = this.game.add.tilemap("level1");
        
        //join the tiles
        this.map.addTilesetImage("tileset","gameTiles");
        this.map.addTilesetImage("spritesheet_tiles","minecraftTiles")
        this.map.addTilesetImage("Environment","environment")
        
        //collision layer
        this.map.setCollisionBetween(250,350,true,"collisionLayer")
        
        //create layers
        this.collisionLayer = this.map.createLayer("collisionLayer")
        this.collisionLayer.resizeWorld();
        this.backgroundLayer = this.map.createLayer("backgroundLayer")
        this.game.world.sendToBack(this.backgroundLayer)
        
        
        //add player
        var playerData = findObjectsByType("player",this.map,"objectsLayer");
        this.player = game.add.sprite(playerData[0].x,playerData[0].y,"player");
        this.player.scale.setTo(scaleRatio,scaleRatio)
        this.player.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        
        this.player.animations.add("walk",[0,1,2,0,1,2],10,true)
        this.player.body.setSize(100,100,20,60)
        
        //follow player
        this.game.camera.follow(this.player);
        
        //load sounds
        this.drill = game.add.audio("drill");
        this.oh_yeah = game.add.audio("oh_yeah")
        
        //add the crabs
        this.crabsData = findObjectsByType("crab",this.map,"objectsLayer");
        
        //crab group
        this.crabs = game.add.group();
        this.crabsData.forEach(function(element){
            var crab = this.game.add.sprite(element.x + 10,element.y + 20,"crab")
            crab.scale.x = scaleRatio;
            crab.scale.y = scaleRatio;
            
            var crabTween = this.game.add.tween(crab).to({x:crab.x + 40},1000,"Linear",true,0,-1);
            crabTween.yoyo(true,0)
            this.game.physics.arcade.enable(crab);
            crab.body.allowGravity = false;
            this.crabs.add(crab);
        },this);
        
        //add the pickaxe
        this.pickaxeData = findObjectsByType("pickaxe",this.map,"objectsLayer");
        this.pickaxe = this.game.add.sprite(this.pickaxeData[0].x+40,this.pickaxeData[0].y+50,"items","pick_gold.png")
        this.pickaxe.scale.x=scaleRatio;
        this.pickaxe.scale.y=scaleRatio;
        this.game.physics.arcade.enable(this.pickaxe);
        this.pickaxe.body.allowGravity = false;
        this.swingAxe = game.add.tween(this.pickaxe).to({angle: 50}, 300, Phaser.Easing.Sinusoidal.InOut, false, 0, Infinity, true);
        
        
        //add the hut
        this.hut = this.game.add.sprite(this.game.world.x +1200,this.game.world.centerY-340,"hut")
        this.hut.scale.setTo(scaleRatio);
        this.game.physics.arcade.enable(this.hut)
        this.hut.body.allowGravity = false
        
        
        //front group
        this.frontGroup = this.game.add.group()
        this.frontGroup.add(this.player)
        this.frontGroup.add(this.pickaxe)
    },
    blockCollision:function(player,block){
        //console.log(block.collideUp)
        //console.log(block.index)
        //console.log(player)
        if(player.canBreakBlocks){
            

            if(this.cursors.down.isDown && player.body.blocked.down){
                if(block.collideUp){
                    this.destroyBlock(block)

                }
            }else if(this.cursors.right.isDown && player.body.blocked.right){
                if(block.collideRight){
                    this.destroyBlock(block)
                }
            }else if(this.cursors.left.isDown && player.body.blocked.left){
                if(block.collideLeft){
                    this.destroyBlock(block)
                }
            }
        }
    },
    destroyBlock:function(block){
        if(block.index != 253 && block.index != 342 && block.index != 205){
            this.map.removeTile(block.x, block.y, this.collisionLayer).destroy();
            //block.collideDown = false;
            //block.collideLeft = false;
            //block.collideRight = false;
            this.drill.play()

        }
    },
    attachPickAxe:function(player,pickaxe){
        player.canBreakBlocks = true;
        pickaxe.x = player.x-20;
        pickaxe.y = player.y;
        
        if(player.facingLeft){
            pickaxe.scale.setTo(scaleRatio * -1,scaleRatio)
            pickaxe.x = player.x-10;
            pickaxe.y = player.y;
        }
        if(player.facingRight){
            pickaxe.scale.setTo(scaleRatio,scaleRatio) 
            pickaxe.x = player.x+10;
            pickaxe.y = player.y;   
        }
        this.swingAxe.start();
      
    },
    pickedUpCrab:function(player,crab){
        this.oh_yeah.play();
        crab.kill();
        this.crabLeftOver-=1;
        if(this.crabLeftOver == 0){
            this.crabLeftOverText.text = "Awesome Head To The House"
        }else{
            this.crabLeftOverText.text = "Find " + this.crabLeftOver + " more"

        }
    },
    showCrab:function(player,hut){
        hut.body.enable = false
        
        if(this.crabLeftOver == 4){
            console.log("YOYOYO")
            for(var i = 0; i < 5; i++){
                var crab = this.game.add.sprite((i  * 50) + hut.x*0.8,hut.y,"crab");
                crab.scale.setTo(0.5)
                                                
            }
        }
    }
//    render:function(){
//        game.debug.body(this.player)
//        this.crabs.forEach(function(element){
//            game.debug.body(element)
//        },this)
//    }
}
