var roletowermover = {
    run: function(creep)
    {
        //     var sources = creep.room.find(FIND_STRUCTURES, { filter: (structure) =>{return (structure.structureType == STRUCTURE_CONTAINER);}}); 
        // creep.say(sources.length); 
        if(creep.memory.spawntime == undefined)
        {
            creep.memory.spawntime = 0;
        }
        else
        {
            if(creep.memory.spawntime > 10000)
            {
                creep.suicide();
            }
            else
            {
                creep.memory.spawntime++;
            }
        }
        var nukeIncoming = creep.room.find(FIND_NUKES);
        var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        var sources = creep.room.find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_STORAGE);
            }
        });
        if(creep.store.getUsedCapacity() < creep.store.getCapacity() / 2)
        {
            creep.withdraw(creep.pos.findClosestByRange(sources), RESOURCE_ENERGY);
        }
        var constructionsites = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3);
        var targets = creep.pos.findInRange(FIND_STRUCTURES, 1,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_TOWER && structure.energy < 1000 - creep.store.getCapacity());
            }
        });
        var lowEnergySpawns = creep.pos.findInRange(FIND_STRUCTURES, 1,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_SPAWN && structure.energy < 300);
            }
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //  nukes 
            var link = creep.pos.findInRange(FIND_STRUCTURES, 2,
        {
            filter: (structure) => (structure.structureType == STRUCTURE_LINK)
        });
        if(link.length != 0)
        {
            if(link[0].store.getUsedCapacity("energy") > 700)
            {
                creep.memory.rescounter++;
            }
            if(link[0].store.getUsedCapacity("energy") < 100)
            {
                creep.memory.rescounter = 0;
            }
        }
          if(creep.memory.rescounter == undefined)
        {
            creep.memory.rescounter = 0;
        }
        if(creep.memory.rescounter > 15 || creep.room.controller.level == 5)
        {
            creep.memory.rescounter = 0;
            var link = creep.pos.findInRange(FIND_STRUCTURES, 2,
            {
                filter: (structure) => (structure.structureType == STRUCTURE_LINK)
            });
            if(link.length != 0){
            Game.spawns[creep.room.name].spawnCreep(
                [MOVE, CARRY, CARRY, CARRY, CARRY, CARRY], creep.room.name + 'linker',
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: creep.room.name,
                            tasklist: [
                                ["withdraw", link[0].id, "energy", 800],
                                ["transfer", creep.room.storage.id, "energy"],
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
        }
        
        
        if(nukeIncoming.length != 0 && creep.room.energyAvailable > 299)
        {
            // storaqge spawn and terminal
            var storagerampartsneeded = 0.;
            // calc storage ramparts needed
            for(var i = 0; i < nukeIncoming.length; i++)
            {
                var range = creep.room.storage.pos.getRangeTo(nukeIncoming[i]);
                if(range == 0)
                {
                    storagerampartsneeded += 10100000;
                }
                else if(range < 3)
                {
                    storagerampartsneeded += 5100000;
                }
            }
            var terminalrampartsneeded = 0.;
            // calc terminal ramparts needed
            for(var i = 0; i < nukeIncoming.length; i++)
            {
                var range = creep.room.terminal.pos.getRangeTo(nukeIncoming[i]);
                if(range == 0)
                {
                    terminalrampartsneeded += 10100000;
                }
                else if(range < 3)
                {
                    terminalrampartsneeded += 5100000;
                }
            }
            var storagerampartsCurrent = 0;
            var terminalrampartsCurrent = 0;
            var tmp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, creep.room.storage.pos.x, creep.room.storage.pos.y);
            var terminalrapartActual;
            var storagerampartActual;
            for(var i = 0; i < tmp.length; i++)
            {
                if(tmp[i].structureType == STRUCTURE_RAMPART)
                {
                    storagerampartsCurrent = tmp[i].hits;
                    storagerampartActual = tmp[i];
                }
            }
            var tmp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, creep.room.terminal.pos.x, creep.room.terminal.pos.y);
            for(var i = 0; i < tmp.length; i++)
            {
                if(tmp[i].structureType == STRUCTURE_RAMPART)
                {
                    terminalrampartsCurrent = tmp[i].hits;
                    terminalrapartActual = tmp[i];
                }
            }
            if(terminalrampartsneeded > terminalrampartsCurrent - 20000)
            {
                creep.repair(terminalrapartActual);
                creep.say("nuketerminal");
            }
            else if(storagerampartsneeded > storagerampartsCurrent - 20000)
            {
                creep.repair(storagerampartActual);
                creep.say("nukestorage");
            }
            else
            {
                creep.say("nukeready");
                nukeIncoming = 0;
            }
            var creepbodypartsneeded = 0;
            if(creep.room.controller.level > 6)
            {
                creepbodypartsneeded = 50;
            }
            if(creep.room.controller.level == 6)
            {
                creepbodypartsneeded = 25;
            }
            if(creep.room.controller.level == 5)
            {
                creepbodypartsneeded = 19;
            }
            if(creep.body.length < creepbodypartsneeded && creepbodypartsneeded != 0)
            {
                //        creep.suicide();
            }
        } // end of nuke check
        if(targets.length != 0 && (nukeIncoming == 0 || hostiles.length != 0) || creep.room.energyAvailable < 300) // maybe check defcon too here TODO 
        {
            var transverAmount = creep.store.getCapacity();
            if(transverAmount > creep.store.getUsedCapacity())
            {
                transverAmount = creep.store.getUsedCapacity();
            }
            creep.transfer(targets[0], RESOURCE_ENERGY, transverAmount);
        }
        else if(lowEnergySpawns.length != 0)
        {
            var transverAmount = lowEnergySpawns[0].store.getFreeCapacity();
            if(transverAmount > creep.store.getUsedCapacity())
            {
                transverAmount = creep.store.getUsedCapacity();
            }
            creep.transfer(lowEnergySpawns[0], RESOURCE_ENERGY, transverAmount);
        }
        else if(constructionsites.length != 0 && nukeIncoming == 0)
        {
            creep.build(constructionsites[0]);
        }
        else
        {
            //   var nukeIncoming =    creep.room.find(FIND_NUKES);
            //  var myspawns  =    creep.room.find(FIND_MY_SPAWNS);
            //  var spawnsInDanger =[];
            //  var terminalInDanger  = false;
            //  var storageInDanger = false;
            // no nukes 
            if(nukeIncoming == 0 || creep.room.energyAvailable < 300)
            {
                var closestDamagedStructure = creep.pos.findInRange(FIND_STRUCTURES, 0,
                {
                    filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL
                });
                var tmp = 0;
                var value = 300000000;
                for(var i = 0; i < closestDamagedStructure.length; i++)
                {
                    if(closestDamagedStructure[i].hits < value)
                    {
                        value = closestDamagedStructure[i].hits;
                        tmp = i;
                    }
                }
                if(closestDamagedStructure.length != 0)
                {
                    creep.repair(closestDamagedStructure[tmp]);
                }
            }
        }
    }
};
module.exports = roletowermover;