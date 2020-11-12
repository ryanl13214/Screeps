/*
defcon levels
13  room starting up requesting rapid bossted jacks
12 room starting up requesting jacks
11   
10  ideal
9   eco doffocultys 
8   base under minor attack
7  only close combar enemys
6 harrasment of the mining opperations 
5 enermy creeps in room but not working together ---
4 more than 4 creps in room  (squad)
3 boosted creeps in room
2 attack has had some sucsess (first wall brieched)
1 strong seige (nukes launched)
0 sector wide seige (two or more rooms at defcon 1,2,3)


OUTCOMES


13 /12/    spawn jacks in all rooms withing 500 ticks









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
 
         console.log("ranged parts "+ numberOfRangedParts);
         console.log("total parts "+ totalBodyParts);
             if(  numberOfRangedParts == 1 && totalBodyParts<30 ){
                 console.log("defcon 7");
                 return 7;//change to 7 once ranger is complete.
             }
             else if(target.length<3 && totalBodyParts<40   ){
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
            return 11;
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
         
    }
}
module.exports = defcon;

