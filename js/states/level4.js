Level4 = {
    preload:function(){
        
    },
    create:function(){
         

        this.background = this.game.add.sprite(0,0,"beach")
        this.background.width = this.game.width;
        this.background.height = this.game.height;
        this.spider = this.game.add.sprite(100,100,"spider")
        this.spider.scale.setTo(0.3)
        this.spider.anchor.setTo(0.5)
        //this.game.camera.follow(this.spider)
        this.game.physics.arcade.enable(this.spider)
        this.spider.body.allowGravity = false;
        this.spider.body.setSize(150,150,220,350);
        this.spider.health = 200;
        /*this.spider.animations.add("walking",[0,1],1,true)
        this.spider.animations.play("walking")*/
        
                         
        this.huts = this.game.add.group();
        this.huts.enableBody = true;
        this.house1 = game.add.sprite(100,530,"hut")
        this.house1.scale.setTo(0.1)
        this.huts.add(this.house1)
        
        this.house2 = game.add.sprite(300,530,"hut")
        this.house2.scale.setTo(0.1)
        this.huts.add(this.house2)
        
        
        this.house3 = game.add.sprite(500,530,"hut")
        this.house3.scale.setTo(0.1)
        this.huts.add(this.house3)
        
        
        this.huts.enableBody = true;
        this.huts.setAll("body.allowGravity",false)
        
        this.performTween()
        this.getRandomFirstAlive(this.huts);
        
        
        //add the player
        this.player = game.add.sprite(game.world.centerX,game.world.height - 20,"player")
        this.player.scale.setTo(0.3);
        this.player.anchor.setTo(0.5)
        this.game.physics.arcade.enable(this.player)
        this.player.body.allowGravity = false;
        this.player.body.collideWorldBounds = true;
        this.player.animations.add("walking",[0,1,2],10,true)
        
        
        
        //cursor
        this.cursors = game.input.keyboard.createCursorKeys();
        
        //bullets
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.nextBullet = 0;
                
        // add a new graphics object at the center of the world
        var circles = game.add.graphics(this.spider.x-120, this.spider.y);
        // add first 1px wide unfilled red circle with a radius of 50 at the center (0, 0) of the graphics object
        circles.lineStyle(5, 0xff0000);
        circles.drawCircle(0, 0, 50);
        // add the second 1px wide unfilled green circle with a radius of 100
        circles.lineStyle(5, 0x00ff00);
        circles.drawCircle(0, 0, 100);
        // and finally add the third 1px wide unfilled blue circle with a radius of 150
        circles.lineStyle(5, 0x0000ff);
        circles.drawCircle(0, 0, 150);
        
        var circleTween = game.add.tween(circles).to({alpha:0})
        circleTween.yoyo(true).loop()
        circleTween.start()
        
        this.spider.addChild(circles);
        
        //health bar
        this.bmd = game.add.bitmapData(200,40);
        this.bmd.ctx.beginPath();
        this.bmd.ctx.rect(0,0,180,30)
        this.bmd.ctx.fillStyle = "#00685e";
        this.bmd.ctx.fill();
        this.healthBar = game.add.sprite(-100,game.world.centerY-600,this.bmd)
        this.healthBar.anchor.y = 0.5;
        
        this.spider.addChild(this.healthBar)
        
        //bonus
        this.bmd2 = game.add.bitmapData(200,40);
        this.bmd2.ctx.beginPath();
        this.bmd2.ctx.rect(0,0,180,30)
        this.bmd2.ctx.fillStyle= "#800080"
        this.bmd2.ctx.fill();
        
        this.bonusBar = game.add.sprite(game.world.centerX,20,this.bmd2)
        this.bonusBar.scale.setTo(0,1)
        this.bonuses = this.game.add.group();
        this.bonuses.enableBody = true;
        this.bonus = 1;
        
        this.game.time.events.loop(12000,this.newBonus,this);
        
        this.questText = game.add.text(20,20,"Defeat The Spider Before He Steals The Huts",{font:"20px Arial",fill:"#fff"})
        game.time.events.add(5000,function(){
            this.questText.visible = false;
        },this)
        
        //sounds
        this.dukduk = game.add.audio("drill")

        
        
        
    },update:function(){
        
        //overlaps
        this.game.physics.arcade.overlap(this.spider,this.bullets,this.hitSpider,null,this)
        this.game.physics.arcade.overlap(this.player,this.bonuses,this.takeBonus,null,this)
        
        //check the count of alive huts
        this.countAlive = 0
        this.huts.forEach(function(e){
            if(!e.alive){
                this.countAlive++
            }
        },this)
        
        //moving player
        
        this.player.body.velocity.x = 0;
        if(this.cursors.right.isDown){
            this.player.body.velocity.x = 300;
            this.player.scale.setTo(0.3)
            this.player.animations.play("walking")
        }
        else if(this.cursors.left.isDown){
            this.player.body.velocity.x = -300
            this.player.scale.setTo(-0.3,0.3)
            this.player.animations.play("walking")
        }else{
            this.player.animations.stop()
        }
        
        //the bullet
        if(this.cursors.up.isDown && this.game.time.now > this.nextBullet){
            
            this.fireBullet();
            if(this.bonus != 1){
                this.nextBullet = game.time.now + 15;
                
            }else{
               this.nextBullet = this.game.time.now + 200; 
            }
        }

    
    },
    
    performTween:function(){
        var randomTime = Math.floor(Math.random() * 3) * Math.floor(Math.random()) *1000
        if(this.spider.alive){
            this.chance = game.rnd.integerInRange(1,10)
            this.spider.tween1 = this.game.add.tween(this.spider)
            
            if(this.chance <= 2 && this.getRandomFirstAlive(this.huts) != undefined){
                

                this.house = this.getRandomFirstAlive(this.huts)
                console.log(this.house + "is this.house")
                this.yPos = this.house.y;
                this.xPos = this.house.x
                this.spider.tween1.to({x:this.xPos,y:this.yPos},game.rnd.integerInRange(1,3) * 1000)
                this.spider.tween1.start()
                this.spider.tween1.onComplete.addOnce(function(){
                    var newHouse = game.add.sprite(this.house.x,this.house.y,"hut");
                    this.house.kill();
                    newHouse.scale.setTo(0.1)
                    newHouse.x = game.rnd.integerInRange(this.spider.x-450, this.spider.x -200)
                    newHouse.y = this.spider.y - 600
                    this.spider.addChild(newHouse)
                    this.spider.tween1.to({y:0}).start();
                    this.spider.tween1.onComplete.addOnce(this.performTween,this)
                    
                   
                },this)
            }else if(this.countAlive == this.huts.length){
                //we lose
                this.spider.body = false;
                this.spider.tween3 = game.add.tween(this.spider)
                this.spider.tween3.to({x:game.world.centerX,y:game.world.centerY}).start()
                this.spider.tween3.onComplete.addOnce(function(){
                    this.spider.tween3 = game.add.tween(this.spider.scale).to({x:2,y:2}).start();
                },this)
                
                this.spider.tween3.onComplete.addOnce(function(){
                    game.time.events.add(3000,function(){game.state.restart();})
                },this)
                
                
            }
            else{
                this.spider.tween2 = this.game.add.tween(this.spider)
                
                for(var i = 0; i < 3; i++){
                    this.spider.tween2.to({y:game.rnd.integerInRange(50,400)},randomTime)
                    this.spider.tween2.to({x:game.rnd.integerInRange(0,game.width-(this.spider.width / 2))},randomTime)
                    this.spider.tween2.to({x:game.rnd.integerInRange(0,game.width-(this.spider.width / 2)),y:100},randomTime)
                    
                }
                
                this.spider.tween2.start();
                this.spider.tween2.onComplete.addOnce(this.performTween,this)
                
                
            }
        }
            
    },
       getRandomFirstAlive:function(group){
        var arr = [];
        group.children.forEach(function(element){
            if(element.alive){
                arr.push(element);
            }
            
        },this)
      
        random = Math.floor(Math.random() * arr.length)
        return arr[random]
    },
    
    fireBullet:function(){
        var bullet = this.bullets.getFirstDead();
        if(!bullet){
            bullet = this.game.add.sprite(this.player.x-20,this.player.y-this.player.height,"items","ore_gold.png")
        }else{
            bullet.reset(this.player.x-20,this.player.y-this.player.height)
        }
        this.bullets.add(bullet)
        bullet.body.allowGravity = false
        bullet.scale.setTo(0.5);
        bullet.body.velocity.y = -700;
        // Kill the bullet when out of the world
        bullet.checkWorldBounds = true; 
        bullet.outOfBoundsKill = true;
        bullet.body.setSize(50,50,bullet.width / 3 + 20,bullet.height / 3 + 10)
        //will only play the duk duk sound with single bullets
        if(this.bonus === 1){
            this.dukduk.play();
        }
        
        
    },
    hitSpider:function(spider,bullet){
        if(this.spider.health > 0){
            console.log("hit spider")
            bullet.kill();
            this.spider.health -= 1;
            barWidth = this.healthBar.width;
            this.healthBar.width = barWidth - barWidth/this.spider.health
            console.log(this.spider.health)  
        }else{
            //remove physics
            this.spider.body = false;
            //remove any tweens
            if(this.spider.tween1){
                this.spider.tween1.stop();
           } 
            if(this.spider.tween2){
                this.spider.tween2.stop();
           } 
            if(this.spider.tween3){
                this.spider.tween3.stop();
           }
            var deathTween = game.add.tween(this.spider).to({angle: "+180"},850,Phaser.Easing.Linear.None).to({y:game.world.height-100}).to({y:game.world.height - 150}).to({y:game.world.height-100}).start();
            //this.spider.animations.stop()
            this.game.time.events.add(3000,function(){
                var goodJob = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,"goodjob")
                goodJob.anchor.setTo(0.5)
                console.log("you win")
            },this);
            
            //restart
            game.time.events.add(5000,function(){
                game.state.restart();
            },this)
        }
        
        
    },
    render:function(){
        /*this.game.debug.body(this.house1)
        this.game.debug.body(this.house2)
        this.game.debug.body(this.spider)
        this.bullets.forEachAlive(function(element){
            this.game.debug.body(element)
        },this);*/

    },
    newBonus:function(){
        var bonus = this.bonuses.getFirstDead();
        if(!bonus){
            bonus = game.add.sprite(game.rnd.integerInRange(20,game.width - 50),0,"items","apple.png");
        }else{
            bonus.reset(game.rnd.integerInRange(20,game.width - 50),0)
        }
        this.bonuses.add(bonus)
        bonus.scale.setTo(0.5)
        bonus.body.allowGravity = false
        bonus.body.velocity.y = 100;
        bonus.anchor.setTo(0.5)
        bonus.checkWorldBounds = true;  
        bonus.outOfBoundsKill = true; 
    },
    takeBonus:function(player,bonus){
        this.bonus+=1;
        bonus.kill();
        this.bonusBar.scale.setTo(1,1)
        game.add.tween(this.bonusBar.scale).to({x:0},4000).start();
        game.time.events.add(4000,function(){
            this.bonus = 1;
        },this)
    }
    
}

