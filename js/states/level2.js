var Level2 = {
    init:function(){
        //INSTRUCTIONS FOR STUDENTS
        
        //add a show randomcrab function
        //set shovel physics
        //set crab physics
        //prevent the shovel and the crab from falling
        //add overlap function
        //set the body of the shover
        //set the body of the crab
        //show another crab using showcrab function
        //add a random time to show the crab
        //add a score variable
        //add a score label
        //increase score when pick up crab
        //change the text to add the score
        //have the crab disappear when not clicked
        //add a tween
        //add a timer when tween starts
        
       
       
    },
    preload:function(){
        game.load.image("wackacrab","assets/wackacrab.png");
        game.load.image("shovel","assets/shovel.png")
    },
    create:function(){
       
        this.background = game.add.sprite(0,0,"wackacrab")
        this.background.height = game.height
        this.background.width = game.width
        
        this.positions = [{x:210,y:150},{x:500,y:150},{x:210,y:280},{x:210,y:380},{x:500,y:280},{x:500,y:380}]

       
        //crab group
         this.crabGroup = game.add.group();
        
        //the shovel
        this.shovel = game.add.sprite(300,150,"shovel")
        this.shovel.inputEnabled = true;
        this.shovel.input.enableDrag(true);
        
        //add a physical body to shovel
        game.physics.arcade.enable(this.shovel);
        //prevent it from falling
        this.shovel.body.allowGravity = false;
        
        //show a random crab
        this.showRandomCrab();
        
        //make the body of the shovel smaller
        this.shovel.body.setSize(50,50,70,50)
        
    
        
        //score variable
        this.score = 0
        
        //score label
        this.scoreLabel = game.add.text(20,20,"Score: " + this.score,{font: "25px Arial",fill:"#fff"});
        
        //good job
        this.goodjob = this.game.add.sprite(game.world.centerX,-200,"goodjob")
        this.goodjob.anchor.setTo(0.5)
        this.goodjobTween = game.add.tween(this.goodjob)
        this.goodjobTween.to({y:game.world.centerY},800);

        
       
    
    },
    update:function(){
        //shovel and crab 
        game.physics.arcade.overlap(this.shovel,this.crabGroup,null,this.removeCrab,this);  
        
        //kill crab if out of bounds
        this.crabGroup.forEachAlive(function(crab){
            if(!crab.inWorld){
                crab.kill();
            }
        },this);
        
        if(this.score >= 1){
            game.time.events.remove(this.animationTime)
            game.time.events.remove( this.showCrabTimer)
            this.goodjobTween.start();
            game.time.events.add(4000,function(){game.state.start("Level3")},this)
            
        }

    },
    showRandomCrab:function(){
        var randomPopUp = game.rnd.integerInRange(0,5)
        var crab = game.add.sprite(this.positions[randomPopUp].x,this.positions[randomPopUp].y,"crab")
        
        //random frame
        crab.frame = game.rnd.integerInRange(0,4)
        
        //change crab size
        crab.scale.setTo(0.3);
        
        //add a physical body
        game.physics.arcade.enable(crab);
        
        //prevent it from falling
        crab.body.allowGravity = false;
        
        //make the body of the crab smaller
        crab.body.setSize(200,200,70,50);
        
        
       
        //start timer 
        animationGoTime = game.rnd.integerInRange(100,2000);
        
        //remove crab after certain amount of time
        var tween = game.add.tween(crab);
        
        //start the animation
        this.animationTime = game.time.events.add(animationGoTime,function(){
          

            //running positions
            var xPos = [-200,game.width + 200];
            var yPos = [game.height + 200, -200]
            tween.to({x:xPos[game.rnd.integerInRange(0,1)],y:yPos[game.rnd.integerInRange(0,1)]},game.rnd.integerInRange(1500,2000));
            tween.start();
            
            tween.onComplete.add(function(){
                game.time.events.add(game.rnd.integerInRange(2500,3500),this.showRandomCrab,this )
            },this);
        
        },this);
        
        this.crabGroup.add(crab)
        
      
        
    },
    removeCrab:function(shovel,crab){
        crab.kill();
        //play sounds
        //load another dukduk after a random time
        var randomTime = game.rnd.integerInRange(1000,3000);
        this.showCrabTimer = game.time.events.add(randomTime,this.showRandomCrab,this);
        
        //increase score
        this.score++;
        
        //change the text
        this.scoreLabel.text = "Score: " + this.score
        
        
    },
    render:function(){
//        this.game.debug.body(this.shovel)
//        this.crabGroup.forEachAlive(function(crab){
//            this.game.debug.body(crab)
//        },this)
    }
}