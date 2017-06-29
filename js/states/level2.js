var Level2 = {
    init:function(){
       
       
    },
    preload:function(){
        game.load.image("wackacrab","assets/wackacrab.png");
        game.load.image("shovel","assets/shovel.png")
    },
    create:function(){
       
        this.background = game.add.sprite(0,0,"wackacrab")
        this.background.height = game.height
        this.background.width = game.width
//        this.troy = game.add.sprite(210,380, "crab")    
//        this.troy.scale.setTo(0.7)
//        this.raeIsDukduk = game.add.sprite(500, 380, "crab")
//        this.raeIsDukduk.scale.setTo(0.7)
//        
        this.positions = [{x:210,y:150},{x:500,y:150},{x:210,y:280},{x:210,y:380},{x:500,y:280},{x:500,y:380}]
//        this.positions.forEach(function(potato){
//            var rasp = game.add.sprite(potato.x, potato.y,"crab");
//            rasp.scale.setTo(0.7)
//        },this);
        
        // random genration
        var randomPopUp = game.rnd.integerInRange(0,5)
        console.log(randomPopUp);
        game.add.sprite(this.positions[randomPopUp].x,this.positions[randomPopUp].y,"crab")
        this.shovel = game.add.sprite(300,150,"shovel")
        this.shovel.inputEnabled = true;
        this.shovel.input
    
    },
    update:function(){
        
    }
}