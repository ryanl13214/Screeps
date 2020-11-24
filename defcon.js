    /*
    10   ideal
    9     
    8                                  
    7    only close combar enemys                                                          (enemy can out heal towers then spawn basic ranger )
    6    harrasment of the mining opperations                                              (check if the harrasser is squad  if not then spawn equal number of guards )(if the harrasment is a squad then create a new squad)
    5    enermy creeps in room but not working together                                    --- spawn equal number of unboosted creeps
    4    more than 4 creps in room  (squad (unboosted))                                    --- spawn equal number of unboosted squads
    3    boosted squad creeps in room                                                      --- spawn equal number of  boosted squads
    2    attack has had some sucsess (first wall brieched)                                 --- (spawn 8 ranged attacks that sit on the circualr road and range the enemy ) 
    1    strong seige                                                                      --- call bossted creeps from other rooms  and continuous squad production (also beild engineer creeps.)
    0    sector wide seige (two or more rooms at defcon 1,2,3)                             -- all rooms in range spawn defending creeps and then yeet them into the enemy base. 
    
     
    -5 harrase the enemy colinisation attempt with rangers 
    -6 harrase a remote mining operation
    -7 destroy edge of the enemy room with next room opperations                           
    -8 send in seige squads to enemy room                                              
    -9 send in multiple squads to the enemy rooms  (also cosndier nuking)
    -10  
    -11 
    */
    // if an attack is happening it is given prioruty if they are fufilled then the next stage is also done ie in a siege then we will also harrase the mining opperations if they exist .   
 





 


 

var defcon = {



    run: function(roomname ) {
 
        
        
       const target = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS);
       
       
       var defconstuct={
           defenceLevel:10,
           attackLevel :10
       };
       
        var numberOfHealParts =0;
        var numberOfAttackParts=0;
        var numberOfRangedParts = 0;
        var totalBodyParts=0;
            for(var i = 0 ; i < target.length ; i++){
                for(var j = 0 ; j < target[i].body.length ; j++){
                     
                    if(target[i].body[j].type == HEAL){numberOfHealParts++;}
                    if(target[i].body[j].type == ATTACK){numberOfAttackParts++;}
                      if(target[i].body[j].type == RANGED_ATTACK){numberOfRangedParts++;}
                      totalBodyParts++;
                }
                
            }
            
              var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
            
            if(spawnss[0].hits < 1000 && target.length != 0){
                Game.rooms[roomname].controller.activateSafeMode()
                
            }
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
        if(target.length !=0){
  
             if(  numberOfRangedParts == 1 && totalBodyParts<30 ){
                
                 defconstuct.defenceLevel= 7;//change to 7 once ranger is complete.
             }
             else if(target.length<3    ){
                 
                // check heal capacity less than tower capacity 
                  defconstuct.defenceLevel= 8;
             }
            
            else  if(target.length>3 || totalBodyParts>40){
              
              
              if( numberOfRangedParts ==0  ){
                   defconstuct.defenceLevel= 7;
             }
              
              var enemycreepsarecohesive = false;
              
              
              
              
              
              
              
              
             if(enemycreepsarecohesive){
                   defconstuct.defenceLevel= 4;
             }else{
                   defconstuct.defenceLevel= 5;
             }
             }
            
            
        }else{
              defconstuct.defenceLevel= 10;
        }
        
        
        
        
        
        
        
        
        
        
        
        return defconstuct;
        
        
        
         
    }
}
module.exports = defcon;

