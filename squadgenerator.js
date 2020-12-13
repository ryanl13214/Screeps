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
                    "attack1": [MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK],
                    "attack2": [MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK],
                    "attack3": [MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK],
                    "healer1": [MOVE,HEAL],
                });
            }
        }
    }

}
module.exports = squadgenerator;
 