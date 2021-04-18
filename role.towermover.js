var roletowermover = {
    run: function(creep)
    {
        //     var sources = creep.room.find(FIND_STRUCTURES, { filter: (structure) =>{return (structure.structureType == STRUCTURE_CONTAINER);}}); 
        // creep.say(sources.length); 
    if(creep.memory.spawntime == undefined){
        creep.memory.spawntime 
    }else{
         if(creep.memory.spawntime> 10000){
        creep.suicide();
    }else{
    creep.memory.spawntime++;    
    }
    }
    
    
    
    
    
    
        var sources = creep.room.find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_STORAGE);
            }
        });
        if(creep.store.getUsedCapacity() < creep.store.getCapacity()/2)
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
        if(targets.length != 0)
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
        else if(constructionsites.length != 0)
        {
            creep.build(constructionsites[0]);
        }
        else
        {
            var closestDamagedStructure = creep.pos.findInRange(FIND_STRUCTURES, 3,
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
};
module.exports = roletowermover;