Level4 = {
    preload:function(){
        
    },
    create:function(){
         

        this.background = this.game.stage.backgroundColor = "#5DA5DB"
        this.spider = this.game.add.sprite(100,100,"spider")
        this.spider.scale.setTo(0.3)
        this.spider.anchor.setTo(0.5)
        //this.game.camera.follow(this.spider)
        this.game.physics.arcade.enable(this.spider)
        this.spider.body.allowGravity = false;
        
                         
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
        this.player = game.add.sprite(game.world.centerX,game.world.height - 50,"player")
        this.player.scale.setTo(0.3);
        

        
    },update:function(){
//        if(this.spider.alive){
//             var randomTime = Math.floor(Math.random() * 3) * Math.floor(Math.random()) *1000
//             console.log(randomTime)
////            tween2.to({y:game.rnd.integerInRange(50,400)},randomTime)
////            tween2.to({x:game.width-(this.spider.width / 2)})
////            tween2.to({x:game.rnd.integerInRange(0,game.width-(this.spider.width / 2)),y:100})
//            tween2.to({y:game.rnd.integerInRange(50,400)},randomTime)
//            tween2.to({x:game.rnd.integerInRange(0,game.width-(this.spider.width / 2))},randomTime)
//            tween2.to({x:game.rnd.integerInRange(0,game.width-(this.spider.width / 2)),y:100},randomTime)
//            tween2.start();
//        }
        
        
        //check the count of alive huts
        this.countAlive = 0
        this.huts.forEach(function(e){
            if(!e.alive){
                this.countAlive++
            }
        },this)
//        if(this.countAlive == this.huts.length){
//            game.time.events.add(3000,function(){game.state.restart();})
//        }
    

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
           
        /*//randomize it
        for(var i = arr.length - 1; i > 0; i--){
            random = Math.floor(Math.random() * arr.length)
            temp = arr[i]
            arr[i] = arr[random]
            arr[random] = temp
        }*/
        //console.log(arr[0].x)
        random = Math.floor(Math.random() * arr.length)
        return arr[random]
    },

    render:function(){
        this.game.debug.body(this.house1)
        this.game.debug.body(this.house2)
        this.game.debug.body(this.spider)

}
}