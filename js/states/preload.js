var PreloadState = {
    init:function(){
      this.game.physics.arcade.gravity.y = 1000;  
    
        this.playerSpeed = 300;
    },
    preload:function(){
        this.preloadBg = this.game.add.sprite(game.world.centerX,game.world.centerY,"ibb2");
       
        this.preloadBar = this.game.add.sprite(game.world.centerX,game.world.centerY,"ibb") ;
        this.load.setPreloadSprite(this.preloadBar);
        
        this.game.load.spritesheet("player","assets/player.png",130,170);
        this.game.load.spritesheet("crab","assets/crab_spritesheet.png",400,348)
        
        //load tilemap image
        this.game.load.tilemap("level1","assets/levels/level1.json",null,Phaser.Tilemap.TILED_JSON)
        
        this.game.load.tilemap("level2","assets/levels/level2.json",null,Phaser.Tilemap.TILED_JSON);
        this.game.load.image("gameTiles","assets/tileset.png");
        this.game.load.image("minecraftTiles","assets/spritesheet_tiles.png");
        
        //this.game.load.image("crab","assets/crab.png");
        
        this.game.load.atlasXML('items', 'assets/spritesheet_items.png', 'assets/spritesheet_items.xml');

        this.game.load.image("environment","assets/Environment.png");
        this.game.load.image("hut","assets/hut.png")
        
        this.game.load.image("goodjob","assets/goodjob.png")
        //this.game.load.image("baddie","assets/bad_guy.png")
        this.game.load.image("heart","assets/heart.png")
        this.game.load.spritesheet("spider","assets/spider1.png",605,650)
        this.game.load.image("beach","assets/beach2.png")
        
        //controls
        this.game.load.image("up","assets/up.png")
        this.game.load.image("down","assets/down.png")
        this.game.load.image("left","assets/left.png")
        this.game.load.image("right","assets/right.png")
        
        this.game.load.image("a","assets/a.png")
        this.game.load.image("shell1","assets/shell1.png")
        this.game.load.image("shell2","assets/shell2.png")
        this.game.load.image("shell3","assets/shell3.png")
        this.load.spritesheet('baddie', 'assets/zombie_sheet.png', 30, 50, 3, 1, 2);
    
         //sounds
          
        this.game.load.audio("drill","assets/sounds/drill.ogg");
        this.game.load.audio("oh_yeah","assets/sounds/oh_yeah.ogg");
        this.game.load.audio("blue","assets/sounds/blue.ogg");
        this.game.load.audio("brown","assets/sounds/brown.ogg");
        this.game.load.audio("green","assets/sounds/green.ogg");
        this.game.load.audio("red","assets/sounds/red.ogg");
        this.game.load.audio("pink","assets/sounds/pink.ogg");
        
        
        
    },
    create:function(){
        this.game.state.start("Level1");
    }
}