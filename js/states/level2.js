var Level2 = {
    init:function(){
       
       
    },
    preload:function(){
        game.load.image("wackacrab","assets/wackacrab.png");
    },
    create:function(){
       
        this.background = game.add.sprite(0,0,"wackacrab")
        this.background.height = game.height
        this.background.width = game.width
        this.troy = game.add.sprite(210,380, "crab")    
        this.troy.scale.setTo(0.7)
        this.raeIsDukduk = game.add.sprite(500, 380, "crab")
        this.raeIsDukduk.scale.setTo(0.7)
        
        this.positions = [[210,150],[500, 150],[210,280],[210,380],[500,280],[500,380]]
    },
    update:function(){
        
    }
}