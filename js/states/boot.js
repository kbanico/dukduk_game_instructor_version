var BootState = {
    init:function(){
        this.game.stage.backgroundCOlor = "#fff";
        
        //scaling
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        
        
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        
        
        
    },
    preload:function(){
        this.game.load.image("ibb","assets/ibbturtle.png")
        this.game.load.image("ibb2","assets/ibbturtle2.png")
    },
    create:function(){
        this.game.state.start("Preload")
    }
}