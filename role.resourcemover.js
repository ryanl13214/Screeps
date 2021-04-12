var creepfunctions = require('prototype.creepfunctions');
var roleresourcemover = {
    run: function(creep)
    {
        creep.say(creep.memory.memstruct.tasklist.length);
        
        
                if(creep.room.storage)
        {
            if(creep.pos.x != creep.room.storage.pos.x - 1 || creep.pos.y != creep.room.storage.pos.y - 1)
            {
                creep.moveTo(new RoomPosition(creep.room.storage.pos.x - 1, creep.room.storage.pos.y - 1, creep.room.name))
            }
        }
        var check  = creepfunctions.checkglobaltasks(creep);
        if(check){
     
        var link = creep.pos.findInRange(FIND_STRUCTURES, 1,
        {
            filter: (structure) => (structure.structureType == STRUCTURE_LINK)
        });
          
        if(link.length !=0)
        {  
            if(link[0].store.getUsedCapacity("energy") > 500)// and creep emty
            {  
                creep.withdraw(link[0], "energy");
               creep.memory.memstruct.tasklist.push(["transfer",creep.room.storage.id , "energy"]);
        
            }
           
           
        }
        }
    }
};
module.exports = roleresourcemover;