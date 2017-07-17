//scaling
var getGameLandscapeDimensions = function(max_w,max_h){
    var w = window.innerWidth * window.devicePixelRatio
    var h = window.innerHeight * window.devicePixelRatio;
    
    var landW = Math.max(w,h);
    var landH = Math.min(w,h);
    
    if(landW > max_w){
        var ratioW = max_w / landW;
        landW *= ratioW;
        landH *= ratioW;
    }
    
    if(landH > max_h){
        var ratioH = max_h / landH;
        landW*= ratioH;
        landH*= ratioH;
    }
    return {w:landW,h:landH}
}


var dim = getGameLandscapeDimensions(640,360);


//scale ratio
var scaleRatio = window.devicePixelRatio / 1.5;


//move player function
var movePlayer = function(player,speed,cursors){
   if(cursors.left.isDown || player.customProperties.goLeft){
        player.scale.setTo(0.5*-1,0.5)
        player.body.velocity.x = -speed
        player.animations.play("walk")
        player.facingLeft = true;
        player.facingRight = false;
        if(cursors.left.isDown && cursors.up.isDown){
            player.body.velocity.y = -speed;
        }
   }
   else if(cursors.right.isDown || player.customProperties.goRight ){
        player.body.velocity.x = speed
        player.scale.setTo(0.5,0.5)
        player.animations.play("walk")
        if(cursors.right.isDown && cursors.up.isDown){
            player.body.velocity.y = -speed;
        } 
        player.facingLeft = false;
        player.facingRight = true;
        
    }else if(cursors.up.isDown || player.customProperties.mustJump){
        player.body.velocity.y = -speed
        player.animations.play("walk")
    }else{
        player.body.velocity.x = 0;
        player.animations.stop()
    }
}


//tiled objects
function findObjectsByType(targetType,tilemap,layer){
    var results = [];
    tilemap.objects[layer].forEach(function(element){
        if(element.properties.type == targetType){
            element.y-= tilemap.tileHeight;
            results.push(element);
        }
    },this);
    return results;
}


//on screen controls
function createOnScreenControls(player){
    this.up= game.add.button(game.width-100,game.height-200,"up")
    this.down = game.add.button(game.width -100,game.height-100,"down")
    this.right = game.add.button(200,game.height - 150,"right")
    this.left = game.add.button(0,game.height - 150,"left")
    
    this.up.fixedToCamera = true
    this.down.fixedToCamera = true
    this.left.fixedToCamera = true
    this.right.fixedToCamera = true
    
    this.up.events.onInputDown.add(function(){
        player.customProperties.mustJump = true
    },this) 
    
    this.up.events.onInputUp.add(function(){
        player.customProperties.mustJump = false
    },this) 
    
    
    this.left.events.onInputDown.add(function(){
        console.log("up button touched")
        player.customProperties.goLeft = true
    },this) 
    
    this.left.events.onInputUp.add(function(){
        console.log("up button not touched")
        player.customProperties.goLeft = false
    },this) 
    
    this.right.events.onInputDown.add(function(){
        console.log("up button touched")
        player.customProperties.goRight = true
    },this) 
    
    this.right.events.onInputUp.add(function(){
        console.log("up button not touched")
        player.customProperties.goRight = false
    },this) 
    
    this.down.events.onInputDown.add(function(){
        console.log("up button touched")
        player.customProperties.goDown = true
    },this) 
    
    this.down.events.onInputUp.add(function(){
        console.log("up button not touched")
        player.customProperties.goDown = false
    },this) 
    
}



var game = new Phaser.Game(dim.x,dim.y, Phaser.AUTO);
game.state.add("Boot", BootState);
game.state.add("Preload", PreloadState);
game.state.add("Level1", Level1)
game.state.add("Level2", Level2)
game.state.add("Level3", Level3)
game.state.add("Level4", Level4)
game.state.start("Boot")