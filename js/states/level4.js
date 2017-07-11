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
        
        
        var tween1 = this.game.add.tween(this.spider)
        this.chance = game.rnd.integerInRange(1,10)
        this.yPos = 0
        if(this.chance != 1){
            this.chanceHouse = game.rnd.integerInRange(0,2)
            this.home = this.huts.children[this.chanceHouse]
            console.log(this.home)
            this.yPos = this.home.y
            this.xPos = this.home.x
            console.log(this.xPos + " is x pos" + this.yPos + " is y pos")
        }else{
            this.yPos = this.game.rnd.integerInRange(50,200)
            this.xPos = this.game.width
        }
        tween1.to({x:this.xPos,y:this.yPos},2000)
        //tween1.start();
                   
        console.log(this.chance)
        
        tween2 = this.game.add.tween(this.spider)
        
//        for(var i = 0; i < 5; i++){
//            var randomTime = Math.floor(Math.random() * 3) * 1000
////            tween2.to({y:game.rnd.integerInRange(50,400)},randomTime)
////            tween2.to({x:game.width-(this.spider.width / 2)})
////            tween2.to({x:game.rnd.integerInRange(0,game.width-(this.spider.width / 2)),y:100})
//            tween2.to({y:game.rnd.integerInRange(50,400)},randomTime)
//            tween2.to({x:game.rnd.integerInRange(0,game.width-(this.spider.width / 2))},randomTime)
//            tween2.to({x:game.rnd.integerInRange(0,game.width-(this.spider.width / 2)),y:100},randomTime)
//            console.log("finihed" + i)
//        }
//        tween2.start();
  
        
//        var tween1 = this.game.add.tween(this.spider)
//        tween1.to({x:2800,y: 2600},1000).onComplete.add(function(){    console.log("onComplete");    tween1.to({x:2800,y:this.y +100},1000);    tween1.start();});    tween1.start();
        

        
    },update:function(){
        if(this.spider.alive){
             var randomTime = Math.floor(Math.random() * 3) * Math.floor(Math.random()) *1000
             console.log(randomTime)
//            tween2.to({y:game.rnd.integerInRange(50,400)},randomTime)
//            tween2.to({x:game.width-(this.spider.width / 2)})
//            tween2.to({x:game.rnd.integerInRange(0,game.width-(this.spider.width / 2)),y:100})
            tween2.to({y:game.rnd.integerInRange(50,400)},randomTime)
            tween2.to({x:game.rnd.integerInRange(0,game.width-(this.spider.width / 2))},randomTime)
            tween2.to({x:game.rnd.integerInRange(0,game.width-(this.spider.width / 2)),y:100},randomTime)
            tween2.start()
        }

    },
    render:function(){
        this.game.debug.body(this.house1)
        this.game.debug.body(this.spider)

}
}