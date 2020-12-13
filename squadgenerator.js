var squadmanage = require('squadManager');
var squadgenerator = {
    run: function(roomname) {
        var mainflag = Game.flags[roomname];
        if (mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange.length != 0) 
        {
            var squads = Memory.squadObject;
            const squadnames = Object.keys(squads);
            
            for (l = 0;  l < mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange.length; l++) 
            {
            var found = false;
            
            for (q = 0; q < squadnames.length; q++) 
            {
                if (squadnames[q] == (roomname+mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l]+"centerdamagesquad") || squadnames[q] == (roomname+mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l]+"solocenterdamager")) 
                {
                    found = true;
                }
            }
            
            
            
            if (!found) 
            {
                
                var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
                
                if(energyavailable > 5600){
                    squadmanage.initializeSquad(roomname+mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l]+"solocenterdamager", [mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l]], false, "solocenterdamager", roomname, 
                    {
                        "solo": [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL],
                    });  
                }else{
                     var numberofparts = Math.floor((energyavailable-150) / 200); 
                        var bodyparts = [ MOVE, MOVE, MOVE];
                     
                            for (let j = 0; j < numberofparts; j++)
                        {
                           bodyparts.push(MOVE);
                     
                        }
                           for (let j = 0; j < numberofparts; j++)
                        {
                           bodyparts.push(RANGED_ATTACK);
                     
                        }
                            
                         
                        
                     var numberofparts = Math.floor((energyavailable) / 300); 
                        var bodypartshealer = [];
                                          for (let j = 0; j < numberofparts; j++)
                        {
                             bodypartshealer.push(MOVE);
                     
                        }
                           for (let j = 0; j < numberofparts; j++)
                        {
                             bodypartshealer.push(HEAL);
                     
                        }
             
             
                    
                squadmanage.initializeSquad(roomname+mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l]+"centerdamagesquad", [mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l]], false, "centerroomattacksquad", roomname, 
                {
                    "attack1": bodyparts,
                    "attack2": bodyparts,
                    "healer1": bodypartshealer,
                });
                    
                }
                
                
                
                

            }
        }
        
    }
        
    }

}
module.exports = squadgenerator;
 