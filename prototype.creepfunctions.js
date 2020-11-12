var creepfunctions = {
    
    
        /*
    USED BY: 
        most eventually ranger primarily
    
    
    
    */
    combatMove: function(creep,avoidarray,avoidclosest)
    {
     var   currX =creep.pos.x;
var currY =creep.pos.y;
        
       var enemyX = avoidclosest.pos.x;
     var   enemyY= avoidclosest.pos.y;
        
       var   basicfleepositonX = enemyX - currX   ;
           var   basicfleepositonY = enemyY - currY   ;
        creep.moveTo(new RoomPosition(creep.pos.x -basicfleepositonX ,creep.pos.y -basicfleepositonY,creep.room.name   ));
        
        
        // to do make it avoid terrain 
        // make it avoid more than one creep.
    },
    
    
    
    /*
    USED BY: 
        jack
    
    
    
    */
    checkglobaltasks: function(creep)
    {
        if (creep.memory.tasklist[0])
        {
            if (creep.memory.tasklist[0][0] == "moveto")
            {
                const path = creep.pos.findPathTo(creep.memory.targetroom);
                if (path.length > 0)
                {
                    creep.move(path[0].direction);
                }
                else
                {
                    creep.memory.tasklist[0].splice(0, 1);
                }
            }
            if (creep.memory.tasklist[0][0] == "moveToRoom")
            {
                var targetRoomFlag = Game.flags[tasklist[0][1]];
                if (1 > 10)
                {
                    creep.move(path[0].direction);
                }
                else
                {
                    creep.memory.tasklist[0].splice(0, 1);
                }
            }
            if (creep.memory.tasklist[0][0] == "pickup")
            {}
            if (creep.memory.tasklist[0][0] == "dropoff")
            {}
        }
    },
    /*
    USED BY: 
        jack
        mover
        repairer
    */
    findfullcontainers: function(creep, energyleveltodrawfrom)
    {
        var containers = creep.pos.findClosestByRange(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return s.structureType == STRUCTURE_CONTAINER && s.store.energy > energyleveltodrawfrom;
            }
        });
        if (containers == undefined)
        {
            containers = creep.pos.findClosestByRange(FIND_STRUCTURES,
            {
                filter: (s) =>
                {
                    return s.structureType == STRUCTURE_LINK && s.store.energy > 500;
                }
            });
        }
        if (containers != undefined)
        {
            if (creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(containers,
                {
                    visualizePathStyle:
                    {
                        stroke: '#ffaa00'
                    }
                });
            }
            creep.memory.hastask = true;
        }
        else
        {
            var storageMain = creep.room.storage;
            if (storageMain != undefined && storageMain.store.getUsedCapacity() >50000 )
            {
                if (creep.withdraw(storageMain, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(storageMain,
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
                creep.memory.hastask = true;
            }
        }
    },
    /*
    USED BY: 
        jack
    
    
    
    */
    checklocaltasks: function(creep)
    {
        if (creep.memory.tasklist[0] == "moveto")
        {
            const path = creep.pos.findPathTo(creep.memory.targetroom);
            if (path.length > 0)
            {
                creep.move(path[0].direction);
            }
            else
            {
                creep.memory.tasklist[0].splice(0, 1);
            }
        }
    },
    /*
    USED BY: 
        jack
    
    
    
    */
    repairbuildings: function(creep)
    {
        var repairtarg = creep.pos.findClosestByRange(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return (s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_CONTAINER) && s.hits < s.hitsMax * 0.7;
            }
        });
        if (repairtarg)
        {
            if (creep.repair(repairtarg) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(repairtarg,
                {
                    reusePath: 5
                });
            }
            creep.memory.hastask = true;
        }
    },
    /*
    USED BY: 
        repairer
    
    
    
    */
    repairbuildingsfull: function(creep)
    {
        var repairtarg = creep.pos.findClosestByRange(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return (s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_CONTAINER) && s.hits < s.hitsMax * 0.99;
            }
        });
        if (repairtarg)
        {
            if (creep.repair(repairtarg) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(repairtarg,
                {
                    reusePath: 5
                });
            }
            creep.memory.hastask = true;
        }
        else
        {
            var closestDamagedStructure = creep.room.find(FIND_STRUCTURES,
            {
                filter: (structure) => structure.hits < structure.hitsMax * 0.1 && structure.structureType != STRUCTURE_WALL
            });
            closestDamagedStructure += creep.room.find(FIND_STRUCTURES,
            {
                filter: (structure) => structure.hits < structure.hitsMax * 0.015 && structure.structureType == STRUCTURE_WALL
            });
            if (closestDamagedStructure.length != 0)
            {
                if (creep.repair(closestDamagedStructure[0]) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(closestDamagedStructure[0],
                    {
                        reusePath: 5
                    });
                }
                creep.memory.hastask = true;
            }
        }
    },
    /*
    USED BY: 
        jack
    
    
    
    */
    upgradecontroller: function(creep)
    {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(creep.room.controller,
            {
                visualizePathStyle:
                {
                    stroke: '#ffffff'
                }
            });
        }
        creep.memory.hastask = true;
    },
    /*
    USED BY: 
        jack
    
    
    
    */
    stockbuildingswithenergy: function(creep)
    {
        var buildingsneedingenergy = creep.room.find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (
                    (structure.structureType == STRUCTURE_EXTENSION && structure.energy < 50) || (structure.structureType ==
                        STRUCTURE_CONTAINER && structure.store.energy < 500) || (structure.structureType == STRUCTURE_SPAWN && structure
                        .energy < 300));
            }
        });
        creep.say(buildingsneedingenergy.length);
        if (buildingsneedingenergy.length > 0)
        {
            if (creep.transfer(creep.pos.findClosestByPath(buildingsneedingenergy), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(creep.pos.findClosestByPath(buildingsneedingenergy),
                {
                    visualizePathStyle:
                    {
                        stroke: '#ffffff'
                    }
                });
            }
            creep.memory.hastask = true;
        }
    },
    /*
    USED BY: 
        jack
    
    
    
    */
    buildstructs: function(creep)
    {
        var constructionsites = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (constructionsites.length != 0)
        {
            if (creep.build(constructionsites[0]) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(constructionsites[0],
                {
                    reusePath: 5
                });
            }
            creep.memory.hastask = true;
        }
    }
}
module.exports = creepfunctions;