var creepfunctions = require('prototype.creepfunctions');
var roleresourcemover = {
    run: function(creep)
    {
        // creep.say(creep.memory.memstruct.tasklist.length);
        if(creep.memory.memstruct.tasklist.length > 30)
        {
            creep.memory.memstruct.tasklist = [];
        }
        if(creep.body.find(elem => elem.type === "heal") != undefined)
        {
            creep.heal(creep);
        }
        if(creep.room.storage)
        {
            if(creep.pos.x != creep.room.storage.pos.x - 1 || creep.pos.y != creep.room.storage.pos.y - 1)
            {
                creep.moveTo(new RoomPosition(creep.room.storage.pos.x - 1, creep.room.storage.pos.y - 1, creep.room.name))
            }
        }
       
        
        
        if(creep.memory.rescounter2 == undefined)
        {
            creep.memory.rescounter2 = 0;
        }
         
        if(creep.memory.rescounter2 > 15)
        {
            creep.memory.rescounter2 = 0;
          var pwrspawn = creep.pos.findInRange(FIND_STRUCTURES, 1,
        {
            filter: (structure) => (structure.structureType == STRUCTURE_POWER_SPAWN)
        });
            Game.spawns[creep.room.name].spawnCreep(
                [MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], creep.room.name + 'power',
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: creep.room.name,
                            tasklist: [
                                ["withdraw", creep.room.terminal.id, "energy", 800],
                                ["transfer", pwrspawn[0].id, "energy"],
                                ["repeat", 2]
                            ],
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: true,
                            hastask: false
                        }
                    }
                });
        }
        
        
        
        
     
          var pwrspawn = creep.pos.findInRange(FIND_STRUCTURES, 1,
        {
            filter: (structure) => (structure.structureType == STRUCTURE_POWER_SPAWN)
        });
        
        if(pwrspawn.length != 0)
        {
            if(pwrspawn[0].store.getUsedCapacity("energy") < 3000)
            {
                creep.memory.rescounter2++;
            }
            if(pwrspawn[0].store.getUsedCapacity("energy") > 3000)
            {
                creep.memory.rescounter2 = 0;
            }
        }
        
        
        var check = creepfunctions.checkglobaltasks(creep);
        if(check)
        {
            var badResource = ["H", "O", "U", "L", "Z"];
            //   ["drop" , "what to drop"]
            //        creep.drop(targ, creep.memory.memstruct.tasklist[0][1]);
            for(var j = 0; j < badResource.length; j++) // transfer to strg
            {
                if(creep.room.terminal.store.getUsedCapacity(badResource[j]) > 40000 && creep.memory.memstruct.tasklist.length == 0)
                {
                    creep.memory.memstruct.tasklist.push(["deposit"]);
                    creep.memory.memstruct.tasklist.push(["withdraw", creep.room.terminal.id, badResource[j], creep.store.getCapacity()]);
                    creep.memory.memstruct.tasklist.push(["drop", badResource[j]]);
                }
            }
            var spawnss = creep.pos.findInRange(FIND_MY_SPAWNS, 1,
            {
                filter: (structure) => (structure.store.getUsedCapacity("energy") < 250)
            });
            if(spawnss.length != 0)
            {
                
                creep.memory.memstruct.tasklist.push(["deposit"]);
                creep.memory.memstruct.tasklist.push(["withdraw", creep.room.terminal.id, "energy", 300 - spawnss[0].store.getUsedCapacity("energy")]);
                creep.memory.memstruct.tasklist.push(["transfer", spawnss[0].id, "energy"]);
                
                     //  new RoomVisual(creep.room.name).line(targ.pos.x,targ.pos.y,creep.pos.x,creep.pos.y);
                 //    new RoomVisual(creep.room.name).text(creep.memory.memstruct.tasklist[0][2],creep.pos.x,creep.pos.y, {color: 'green', font: 0.3}); 
                    
                
                
            }
            var link = creep.pos.findInRange(FIND_STRUCTURES, 1,
            {
                filter: (structure) => (structure.structureType == STRUCTURE_LINK)
            });
            if(link.length != 0)
            {
                if(link[0].store.getUsedCapacity("energy") > 500) // and creep emty
                {
                    creep.withdraw(link[0], "energy");
                    creep.memory.memstruct.tasklist.push(["transfer", creep.room.storage.id, "energy"]);
                }
            }
        }
    }
};
module.exports = roleresourcemover;