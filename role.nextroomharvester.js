var rolenextroomHarvester = {
    /** @param {Creep} creep **/
    run: function(creep)
    {
        if (creep.ticksToLive == 1)
        {
            console.log('Creep from', creep.memory.target, 'has harvested', creep.memory.totalharvested);
        }
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (creep.memory.full == true && creep.carry.energy == 0)
        {
            creep.memory.full = false;
            creep.memory.totalharvested += creep.carryCapacity;
        }
        if (creep.memory.full == false && creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.full = true;
        }
        if (creep.memory.full == false)
        {
            if (creep.room.name == creep.memory.target) // IF CREEP IS IN TARGET ROOM AND HAS NO ENERGY
            {
                creep.pos.createConstructionSite(STRUCTURE_ROAD);
                var sources = creep.room.find(FIND_SOURCES_ACTIVE);
                if (creep.harvest(creep.pos.findClosestByPath(sources)) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(creep.pos.findClosestByPath(sources),
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
            }
            else
            { // IF CREEP IS NOT IN TARGET ROOM AND HAS NO ENERRGY
                
               const exitDir = Game.map.findExit(creep.room, creep.memory.target);
    const exit = creep.pos.findClosestByRange(exitDir);
    creep.moveTo(exit);
            }
        }
        if (creep.memory.full == true)
        {
            if (creep.room.name == creep.memory.home)
            {
                var targets = creep.room.find(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_TERMINAL);
                    }
                });
                if (targets.length > 0)
                {
                    if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(targets[0],
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ffffff'
                            }
                        });
                    }
                }
            }
            else if (targets.length > 0 && creep.room.name != creep.memory.home)
            {
                if (creep.build(targets[targets.length - 1 ]) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targets[targets.length - 1],
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ffffff'
                        }
                    });
                }
            }
            else
            {
                
                          const exitDir = Game.map.findExit(creep.room, creep.memory.home);
    const exit = creep.pos.findClosestByRange(exitDir);
    creep.moveTo(exit);
            }
        }
    }
};
module.exports = rolenextroomHarvester;