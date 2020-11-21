/*
defcon levels
14   eco doffocultys 
13   room starting up requesting rapid bossted jacks
12   room starting up requesting jacks
11   room assisting other room 
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
*/





 


 

var defcon = {



    run: function(roomname ) {
 
        
        
       const target = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS);
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
                
                 return 7;//change to 7 once ranger is complete.
             }
             else if(target.length<3    ){
                 
                // check heal capacity less than tower capacity 
                return 8;
             }
            
            else  if(target.length>3 || totalBodyParts>40){
              
              
              if( numberOfRangedParts ==0  ){
                 return 7;
             }
              
              var enemycreepsarecohesive = false;
              
              
              
              
              
              
              
              
             if(enemycreepsarecohesive){
                 return 4;
             }else{
                 return 5;
             }
             }
            
            
        }else{
            return 10;
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
         
    }
}
module.exports = defcon;

