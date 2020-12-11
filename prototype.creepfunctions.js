var creepfunctions = {
    /*
    USED BY: 
        memstruct function
    milti
    
    
    */
    checkglobaltasks: function(creep)
    {
        if (creep.memory.memstruct.tasklist.length == 0)
        {
            return true;
        }
        else
        if (creep.memory.memstruct.tasklist[0] != undefined)
        {
            if (creep.memory.memstruct.tasklist[0][0] == "joinSquad")
            {
                if(creep.ticksToLive==1499){
               var tempid = creep.id;
                  console.log("adding creep to squad - "+ tempid);
                
                
                Memory.squadObject[creep.memory.memstruct.tasklist[0][1]].SquadMembersCurrent.push(tempid);
              //  creep.say(creep.memory.memstruct.tasklist[0][1]);
               // creep.say(creep.id);
                creep.memory.memstruct.tasklist.splice(0, 1);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "moveToRoom")
            {
                var targetRoomFlag = Game.flags[creep.memory.memstruct.tasklist[0][1]];
                var pos1 = creep.pos;
                var pos2 = targetRoomFlag.pos;
                const range = creep.pos.getRangeTo(targetRoomFlag.pos);
                if (range > 23)
                { // might cause bug on nxt room wall 
                    creep.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creep.pos, targetRoomFlag.pos,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }
                else
                {
                    creep.memory.memstruct.tasklist.splice(0, 1);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "moveTo")
            {
                var targetposition = new RoomPosition(creep.memory.memstruct.tasklist[0][1], creep.memory.memstruct.tasklist[0][2], creep.room.name);
                var range = creep.pos.getRangeTo(targetposition);
                if (range != 0)
                {
                    creep.moveTo(targetposition);
                    creep.say(range);
                }
                else
                {
                    creep.memory.memstruct.tasklist.splice(0, 1);
                }
            }
        }
        else
        {
            return true;
        }
    },
    /*
    USED BY: 
        most eventually ranger primarily
    
    
    
    */
    findDroppedEnergy: function(creep)
    {
        var droppedresources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
        {
            filter: (res) =>
            {
                return (res.resourceType == RESOURCE_ENERGY) && (res.amount > creep.store.getFreeCapacity());
            }
        });
        if (droppedresources != undefined)
        {
            var range = creep.pos.getRangeTo(droppedresources);
            if (range <= 1)
            {
                creep.pickup(droppedresources);
            }
            else
            {
                creep.moveTo(droppedresources,
                {
                    reusePath: range
                });
            }
            creep.memory.hastask = false;
        }
    },
    /*
    USED BY: 
        most eventually ranger primarily
    
    
    
    */
    stockstorage: function(creep)
    {
        var storageactual = creep.room.storage;
        if (storageactual != undefined)
        {
            if (storageactual.store.getUsedCapacity() < 20000)
            {
                var range = creep.pos.getRangeTo(storageactual);
                if (range <= 1)
                {
                    creep.transfer(storageactual, RESOURCE_ENERGY);
                }
                else
                {
                    creep.moveTo(storageactual,
                    {
                        reusePath: range
                    });
                }
                creep.memory.hastask = false;
            }
        }
    },
    /*
    USED BY: 
        most eventually ranger primarily
    
    
    
    */
    combatMove: function(creep, avoidarray, avoidclosest)
    {
        var currX = creep.pos.x;
        var currY = creep.pos.y;
        var enemyX = avoidclosest.pos.x;
        var enemyY = avoidclosest.pos.y;
        var basicfleepositonX = enemyX - currX;
        var basicfleepositonY = enemyY - currY;
        
        if(basicfleepositonX > 49){basicfleepositonX=49;}
        if(basicfleepositonX < 0){basicfleepositonX=0;}
        
        if(basicfleepositonY > 49){basicfleepositonY=49;}
        if(basicfleepositonY < 0){basicfleepositonY=0;}
         
        creep.moveTo(new RoomPosition(creep.pos.x - basicfleepositonX, creep.pos.y - basicfleepositonY, creep.room.name));
        // to do make it avoid terrain 
        // make it avoid more than one creep.
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
            if (storageMain != undefined && storageMain.store.getUsedCapacity() > 50000)
            {
                var range = creep.pos.getRangeTo(storageMain);
                if (range <= 1)
                {
                    creep.withdraw(storageMain);
                }
                else
                {
                    creep.moveTo(storageMain,
                    {
                        reusePath: range,
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
            var range = creep.pos.getRangeTo(repairtarg);
            if (range <= 3)
            {
                creep.repair(repairtarg);
            }
            else
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
                return (s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART) && s.hits < s.hitsMax * 0.99;
            }
        });
        if (repairtarg)
        {
            var range = creep.pos.getRangeTo(repairtarg);
            if (range <= 3)
            {
                creep.repair(repairtarg);
            }
            else
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
    upkeepwalls: function(creep)
    {
        var repairtarg = creep.pos.findClosestByRange(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return (s.structureType == STRUCTURE_WALL && s.hits < s.hitsMax * 0.015) || (s.structureType == STRUCTURE_RAMPART && s
                    .hits < s.hitsMax * 0.015);
            }
        });
        if (repairtarg)
        {
            var range = creep.pos.getRangeTo(repairtarg);
            if (range <= 3)
            {
                creep.repair(repairtarg);
            }
            else
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
    stocktowerswithenergy: function(creep)
    {
        var buildingsneedingenergy = creep.room.find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (
                    (structure.structureType == STRUCTURE_TOWER && structure.energy < 300));
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
        var constructionsites = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (constructionsites  != undefined)
        {
            var range = creep.pos.getRangeTo(constructionsites);
            if (range <= 3)
            {
                creep.build(constructionsites);
            }
            else
            {
                creep.moveTo(constructionsites,
                {
                    reusePath: range
                });
            }
            creep.memory.hastask = true;
        }
    }
}
module.exports = creepfunctions;