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
        this.getRandomFirstAlive(this.huts)

        
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

    },
    
    performTween:function(){
        var randomTime = Math.floor(Math.random() * 3) * Math.floor(Math.random()) *1000
        if(this.spider.alive){
            this.chance = game.rnd.integerInRange(1,10)
            var tween1 = this.game.add.tween(this.spider)
            if(this.chance > 1 ){
                
                this.chanceHouse = game.rnd.integerInRange(0,2)
                this.house = this.huts.children[this.chanceHouse]
                this.yPos = this.house.y;
                this.xPos = this.house.x
                tween1.to({x:this.xPos,y:this.yPos},game.rnd.integerInRange(1,3) * 1000)
                console.log("should start and get at house " + this.chanceHouse + " the house is " + this.huts.children[this.chanceHouse].x + " and y is " + this.huts.children[this.chanceHouse].y )
                tween1.start()
            }else{
                tween2 = this.game.add.tween(this.spider)
                for(var i = 0; i < 3; i++){
                    console.log(i)
                    tween2.to({y:game.rnd.integerInRange(50,400)},randomTime)
                    tween2.to({x:game.rnd.integerInRange(0,game.width-(this.spider.width / 2))},randomTime)
                    tween2.to({x:game.rnd.integerInRange(0,game.width-(this.spider.width / 2)),y:100},randomTime)
                }
                tween2.start();
            }
        }
            
    },
       getRandomFirstAlive:function(group){
        var arr = [];
        group.forEachAlive(function(element){
            arr.push(element);
        },this)
        for(var i = arr.length - 1; i > 0; i--){
            random = Math.floor(Math.random() * arr.length)
            temp = arr[i]
            arr[i] = arr[random]
            arr[random] = temp
        }
        console.log(arr[0].x)
        return arr
    },
    render:function(){
        this.game.debug.body(this.house1)
        this.game.debug.body(this.house2)
        this.game.debug.body(this.spider)

}
}