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
        this.crabLeftOverText = this.game.add.text(20,20,"Find " + this.crabColor+ " duk duk crabs",{font: "30px Arial", fill: "#fff"});
        this.crabLeftOverText.fixedToCamera = true;
        
        createOnScreenControls(this.player)
       
        
        
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
        this.player.scale.setTo(.5,.5)
        this.player.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        
        this.player.animations.add("walk",[0,1,2,0,1,2],10,true)
        this.player.body.setSize(100,100,20,60)
        this.player.customProperties = {}
        
        //follow player
        this.game.camera.follow(this.player);
        
        //load sounds
        this.drill = game.add.audio("drill");
        this.drill.volume = 0.2;
        this.oh_yeah = game.add.audio("oh_yeah")
        this.blue = game.add.audio("blue")
        this.blue.volume = 3;
        this.brown = game.add.audio("brown")
        this.brown.volume = 3;
        this.green = game.add.audio("green")
        this.green.volume = 3;
        this.red = game.add.audio("red")
//        this.red.volume = 3;
        this.pink = game.add.audio("pink")
        this.pink.volume = 3;
        
        //add the crabs
        this.crabsData = findObjectsByType("crab",this.map,"objectsLayer");
        
        //crab group
        this.crabs = game.add.group();
        //box
        this.gen_num = [];
        this.nums = [0,1,2,3,4]
   
        
        this.crabsData.forEach(function(element){
            
            var crab = this.game.add.sprite(element.x + 10,element.y + 20,"crab")
            crab.frame = element.properties.frame
            
            
            crab.scale.x =  .2;
            crab.scale.y =  .2;
            
            var crabTween = this.game.add.tween(crab).to({x:crab.x + 40},1000,"Linear",true,0,-1);
            crabTween.yoyo(true,0)
            this.game.physics.arcade.enable(crab);
            crab.body.allowGravity = false;
            this.crabs.add(crab);
        },this);
        
        //add the pickaxe
        this.pickaxeData = findObjectsByType("pickaxe",this.map,"objectsLayer");
        this.pickaxe = this.game.add.sprite(this.pickaxeData[0].x+40,this.pickaxeData[0].y+50,"pickaxe")
        this.pickaxe.scale.x=.5;
        this.pickaxe.scale.y=.5;
        this.game.physics.arcade.enable(this.pickaxe);
        this.pickaxe.body.allowGravity = false;
        this.swingAxe = game.add.tween(this.pickaxe).to({angle: 50}, 300, Phaser.Easing.Sinusoidal.InOut, false, 0, Infinity, true);
        
        
        //add the hut
        this.hut = this.game.add.sprite(1200,this.game.world.centerY-340,"hut")
        this.hut.scale.setTo(.45);
        this.game.physics.arcade.enable(this.hut)
        this.hut.body.allowGravity = false;
        
        
        //color = brown, pink, red, blue, green
        this.colorToBePicked = Math.floor(Math.random() * 5)
         //crab type
        if(this.colorToBePicked == 0){
            this.crabColor = "brown"
        }else if(this.colorToBePicked == 1){
            this.crabColor = "pink"
        }else if(this.colorToBePicked == 2){
            this.crabColor = "red"
        }else if(this.colorToBePicked == 3){
            this.crabColor = "blue";
        }else{
            this.crabColor = "green";
        }
        
        //front group
        this.frontGroup = this.game.add.group()
        this.frontGroup.add(this.player)
        this.frontGroup.add(this.pickaxe)
        
        this.info = game.add.sprite(game.width / 2,game.height / 2,"level1")
        this.info.anchor.setTo(0.5)
        this.info.alpha = 0.9
        this.info.fixedToCamera = true;
        this.info.inputEnabled = true;
        this.info.events.onInputDown.add(function(){
            this.info.visible = false;
        },this)
        
        game.time.events.add(5000,function(){
            if(this.info.visible){
                this.info.visible = false
            }
        },this)
    },
    blockCollision:function(player,block){
        //console.log(block.collideUp)
        //console.log(block.index)
        //console.log(player)
        if(player.canBreakBlocks){
            

            if((this.cursors.down.isDown || this.player.customProperties.goDown ) && player.body.blocked.down){
                if(block.collideUp){
                    this.destroyBlock(block)

                }
            }else if((this.cursors.right.isDown || this.player.customProperties.goRight ) && player.body.blocked.right){
                if(block.collideRight){
                    this.destroyBlock(block)
                }
            }else if((this.cursors.left.isDown || this.player.customProperties.goLeft ) && player.body.blocked.left){
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
            pickaxe.scale.setTo(.5 * -1,.5)
            pickaxe.x = player.x-10;
            pickaxe.y = player.y;
        }
        if(player.facingRight){
            pickaxe.scale.setTo(.5,.5) 
            pickaxe.x = player.x+10;
            pickaxe.y = player.y;   
        }
        this.swingAxe.start();
      
    },
    pickedUpCrab:function(player,crab){
        
        if(crab.frame == 4 && this.colorToBePicked == 4){
            this.green.play();
            crab.kill();
            this.crabLeftOver-=1;
        }else{
            console.log("NOPE WRONG")
        }
        if(crab.frame == 3 && this.colorToBePicked == 3){
            this.blue.play();
            crab.kill();
            this.crabLeftOver-=1;
        }else{
            console.log("NOPE WRONG")
        }
        if(crab.frame == 2 && this.colorToBePicked == 2){
            this.red.play();
            crab.kill();
            this.crabLeftOver-=1;
        }else{
            console.log("NOPE WRONG")
        }
        if(crab.frame == 1 && this.colorToBePicked == 1){
            this.pink.play();
            crab.kill();
            this.crabLeftOver-=1;
        }else{
            console.log("NOPE WRONG")
        }
        if(crab.frame == 0 && this.colorToBePicked == 0){
            this.brown.play();
            crab.kill();
            this.crabLeftOver-=1;
        }else{
            console.log("NOPE WRONG")
        }
        
        
        
        if(this.crabLeftOver == 0){
            this.crabLeftOverText.text = "Awesome Head To The House"
        }else{
//            this.crabLeftOverText.text = "Find " + this.crabLeftOver + " " + this.crabColor 
            this.crabLeftOverText.text = "Find " + this.crabLeftOver + " " + this.crabColor+ " duk duk crabs"

        }
    },
    showCrab:function(player,hut){
        
        
        if(this.crabLeftOver == 0){
            hut.body.enable = false
            console.log("YOYOYO")
            for(var i = 0; i < 5; i++){
                var crab = this.game.add.sprite((i  * 50) + hut.x*0.8,hut.y+100,"crab");
                crab.scale.setTo(0.2);
                crab.alpha = 0;
                crab.frame = this.colorToBePicked;
                var tween = game.add.tween(crab).to({alpha: 1},250,"Linear",false, i * 250).to({y: crab.y - 20},i * 250).start();
                this.crabLeftOverText.text = ""
            }
            tween.onComplete.add(function(){
                this.swingAxe.stop();
                var goodJobSprite = game.add.sprite(this.player.x-100,this.player.y-100,"goodjob")
                this.player.body.enable = false;
                
                game.time.events.add(2000,function(){this.game.state.start("Level2")},this)
            },this)
        }
    },
  
    getRandy:function(a){
        var randy = a[Math.floor(Math.random()*a.length)];
        if(randy != lastly){
            lastly = randy;
            return randy
        }else{
            this.getRandy(a);
        }
    },
//    render:function(){
//        game.debug.body(this.player)
//        this.crabs.forEach(function(element){
//            game.debug.body(element)
//        },this)
//    }
}

var lastly = -1
