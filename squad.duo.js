var Duo = {
    allowSlave: function(creep)
    {
        if(creep.memory.duoId != undefined)
        {
            var slave = Game.getObjectById(creep.memory.duoId);
            const range = creep.pos.getRangeTo(slave);
            var counter = 1;
            if(slave.pos.x == 50 || slave.pos.x == 0 || slave.pos.y == 50 || slave.pos.y == 0)
            {
                counter = 3;
            }
            if(range > counter && creep.room.name == slave.room.name && Game.time % 3 == 0)
            {
                creep.say("come");
                creep.moveTo(slave);
            }
        }
    },
    run: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        var target;
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        var tail;
        var head;
        for(var c = 0; c < all.length; c++)
        {
            if(all.memory.role == "tail")
            {
                tail = all[c];
            }
            if(all.memory.role != "tail")
            {
                head = all[c];
            }
        }
        if(head.memory.memstruct.tasklist.length != 0 && head.memory.memstruct.tasklist[0].length > 1 && head.memory.memstruct.tasklist[0][0] == "joinsquad")
        {
            head.memory.memstruct.tasklist = mainMemoryObject.arrayOfSquadGoals;
        }
        
        
        
        if(tail.memory.memstruct.tasklist.length != 0 && tail.memory.memstruct.tasklist[0].length > 1 && tail.memory.memstruct.tasklist[0][0] == "joinsquad" )
        {
            tail.memory.memstruct.tasklist = ["findMaster", creep.id];
        }
        
        
        
        
        
      
        
        
        
        
        
        
        
        
        
        
    }
}
module.exports = Duo;