var squadmanage = require('squadManager');
var squadgenerator = {
    run: function(roomname) {
        var mainflag = Game.flags[roomname];
        if (mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange.length != 0) 
        {
            var squads = Memory.squadObject;
            const resourcekeys = Object.keys(squads);
            var found = false;
            for (q = 0; q < resourcekeys.length; q++) 
            {
                if (resourcekeys[q] == (roomname+"centerdamagesquad")) 
                {
                    found = true;
                }
            }
            if (!found) 
            {
                
                
                
                
                squadmanage.initializeSquad(roomname+"centerdamagesquad", mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange, false, "centerroomattacksquad", roomname, 
                {
                    "attack1": [ATTACK,MOVE],
                    "attack2":[ATTACK,MOVE],
                    "attack3": [ATTACK,MOVE],
                    "heal1": [ATTACK,MOVE],
                });
            }
        }
    }

}
module.exports = squadgenerator;
/*
        
    var towerdamage= C.TOWER_POWER_ATTACK * C.TOWER_FALLOFF * (14 - C.TOWER_OPTIMAL_RANGE) / (C.TOWER_FALLOFF_RANGE - C.TOWER_OPTIMAL_RANGE);

        var towerdamage= C.TOWER_POWER_ATTACK * C.TOWER_FALLOFF * (range - C.TOWER_OPTIMAL_RANGE) / (C.TOWER_FALLOFF_RANGE - C.TOWER_OPTIMAL_RANGE);
    }
        console.log( TOWER_POWER_ATTACK * TOWER_FALLOFF * (14 - TOWER_OPTIMAL_RANGE) / (TOWER_FALLOFF_RANGE - TOWER_OPTIMAL_RANGE));
        //        amount -= amount * C.TOWER_FALLOFF * (range - C.TOWER_OPTIMAL_RANGE) / (C.TOWER_FALLOFF_RANGE - C.TOWER_OPTIMAL_RANGE);
        
         var towerdamage= C.TOWER_POWER_ATTACK * C.TOWER_FALLOFF * (14 - C.TOWER_OPTIMAL_RANGE) / (C.TOWER_FALLOFF_RANGE - C.TOWER_OPTIMAL_RANGE);

        */