Level4 = {
    preload:function(){
        
    },
    create:function(){
         

        this.background = this.game.stage.backgroundColor = '#f0fffd'
        this.spider = this.game.add.sprite(100,100,"spider")
        this.spider.scale.setTo(0.3)
        this.spider.anchor.setTo(0.5)
        //this.game.camera.follow(this.spider)
        this.game.physics.arcade.enable(this.spider)
        this.spider.body.allowGravity = false;
        this.spider.body.setSize(150,150,220,380)
        
                         
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
        
        this.fireBullet();
        
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
        
        this.spider.addChild(circles)
        
        

        
    },update:function(){
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
            this.nextBullet = this.game.time.now + 200
            this.fireBullet();
        }

    
    },
    
    performTween:function(){
        var randomTime = Math.floor(Math.random() * 3) * Math.floor(Math.random()) *1000
        if(this.spider.alive){
            this.chance = game.rnd.integerInRange(1,10)
            var tween1 = this.game.add.tween(this.spider)
            if(this.chance <=2 && this.getRandomFirstAlive(this.huts) != undefined){
                

                this.house = this.getRandomFirstAlive(this.huts)
                console.log(this.house + "is this.house")
                this.yPos = this.house.y;
                this.xPos = this.house.x
                tween1.to({x:this.xPos,y:this.yPos},game.rnd.integerInRange(1,3) * 1000)
                tween1.start()
                tween1.onComplete.addOnce(function(){
                    var newHouse = game.add.sprite(this.house.x,this.house.y,"hut");
                    this.house.kill();
                    newHouse.scale.setTo(0.1)
                    newHouse.x = game.rnd.integerInRange(this.spider.x-450, this.spider.x -200)
                    newHouse.y = this.spider.y - 600
                    this.spider.addChild(newHouse)
                    tween1.to({y:0}).start();
                    tween1.onComplete.addOnce(this.performTween,this)
                   
                },this)
            }else if(this.countAlive == this.huts.length){
                tween3 = game.add.tween(this.spider)
                tween3.to({x:game.world.centerX,y:game.world.centerY}).start()
                tween3 = game.add.tween(this.spider.scale).to({x:2,y:2}).start();
                tween3.onComplete.addOnce(function(){
                    game.time.events.add(3000,function(){game.state.restart();})
                },this)
                
                
            }
            else{
                tween2 = this.game.add.tween(this.spider)
                for(var i = 0; i < 3; i++){
                    tween2.to({y:game.rnd.integerInRange(50,400)},randomTime)
                    tween2.to({x:game.rnd.integerInRange(0,game.width-(this.spider.width / 2))},randomTime)
                    tween2.to({x:game.rnd.integerInRange(0,game.width-(this.spider.width / 2)),y:100},randomTime)
                }
                tween2.start();
                tween2.onComplete.addOnce(this.performTween,this)
                
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
            bullet.reset(this.player.x,this.player.y-this.player.height)
        }
        this.bullets.add(bullet)
        bullet.body.allowGravity = false
        bullet.scale.setTo(0.5);
        bullet.body.velocity.y = -700;
        // Kill the bullet when out of the world
        bullet.checkWorldBounds = true; 
        bullet.outOfBoundsKill = true;
        
    },
    render:function(){
        this.game.debug.body(this.house1)
        this.game.debug.body(this.house2)
        this.game.debug.body(this.spider)

    }
}