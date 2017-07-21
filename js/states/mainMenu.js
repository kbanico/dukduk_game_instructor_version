var MainMenu = {
    create:function(){
        this.background = game.add.sprite(0,0,"mainBackground")
        this.background.height = game.height
        this.background.width = game.width
        //set the localStorage
        if(this.game.device.localStorage){
            var bestLevel = localStorage.getItem("bestLevel");
            if(bestLevel == null){
                localStorage.setItem("bestLevel",1)
                this.level = 1
            }else{
                this.level = localStorage.getItem("bestLevel")
            }
        }
        
        this.logo = game.add.text(game.width / 2,(game.height / 2),"DUKDUK GAME\n   -kjdesigns-",{font:"24px Arial",fill:"#fff"})
        this.logo.anchor.setTo(0.5)
        
        this.levelCounter = 0
        for(var i = 0; i < 2; i++){
            for(var j = 0; j < 2; j++){
                this.levelCounter++;
                var button = game.add.sprite(200 +  (200 * j), 100 +  (i * 150),"latte")
                button.scale.setTo(0.7)
                button.anchor.setTo(0.5)
                button.levelNumber = this.levelCounter;
                buttonText = game.add.text(button.x-7,button.y,this.levelCounter,{font:"30px Arial",fill:"#fff"})
               
                
                //don't make the button input enabled if we player didn't pass levels
                if(button.levelNumber <= this.level ){
                    button.inputEnabled = true;
                }else{
                    button.inputEnabled = false;
                    button.alpha = 0.5
                }
                
                
                 button.events.onInputDown.add(function(button){
                    console.log("the number is " + button.levelNumber)
                    game.state.start("Level"+button.levelNumber)
                },this)
            }
        }
        
        //this should == 4
        console.log("levelCounter " + this.levelCounter)
        
    },
    
}








