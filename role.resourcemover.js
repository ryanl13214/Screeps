/*
if there is energy in the link then withdraw it 
if the energy level of the terminal is over 51,000 withdraw energy from it
*/
var creepfunctions = require('prototype.creepfunctions');
var roleresourcemover = {
    run: function(creep)
    {
        if (creep.store.getFreeCapacity() == creep.store.getCapacity())
        {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.store.getFreeCapacity() == 0)
        {
            creep.memory.working = true;
        }
        var flagmid = Game.flags[creep.room.name];
        creep.moveTo(new RoomPosition(flagmid.pos.x - 1, flagmid.pos.y - 1, creep.room.name),
        {
            visualizePathStyle:
            {
                stroke: '#ffaa00'
            }
        });
        if (creep.memory.working == false)
        {
            var storagemain = creep.pos.findClosestByPath(FIND_STRUCTURES,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_STORAGE && structure.store.getUsedCapacity("energy") < structure.store
                        .getUsedCapacity());
                }
            });
            var overflowingterminal = creep.pos.findClosestByPath(FIND_STRUCTURES,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_TERMINAL && structure.store.getUsedCapacity("energy") > 51000);
                }
            });
            if (storagemain != undefined)
            {
                const resourcekeys = Object.keys(storagemain.store);
                for (var i = 0; i < resourcekeys.length; i++)
                {
                    if (resourcekeys[i] != "energy")
                    { // creep.say(resourcekeys[i]);
                        creep.withdraw(storagemain, resourcekeys[i]);
                    }
                }
            }
            else
            {
                var sourcelink = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_LINK);
                    }
                });
                var ofloadcontainer;
                var flagmain = Game.flags[creep.room.name];
                var temp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, flagmain.pos.x - 1, flagmain.pos.y);
                for (var i = 0; i < temp.length; i++)
                {
                    if (temp[i].structureType == STRUCTURE_CONTAINER)
                    {
                        ofloadcontainer = temp[i];
                    }
                }
                if (ofloadcontainer == undefined)
                {
                    // build stucture
                }
                else
                if (sourcelink.store.getUsedCapacity("energy") == 0 && overflowingterminal != undefined)
                {
                    creep.withdraw(overflowingterminal, RESOURCE_ENERGY);
                }
                else if (ofloadcontainer.store.getUsedCapacity() != 2000 && sourcelink.store.getUsedCapacity("energy") == 0)
                {
                    var storagemain = creep.pos.findClosestByPath(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_STORAGE);
                        }
                    });
                    creep.withdraw(storagemain, RESOURCE_ENERGY);
                }
                else
                {
                    creep.withdraw(sourcelink, RESOURCE_ENERGY);
                }
            }
        }
        if (creep.memory.working == true)
        {
            if (creep.store.getUsedCapacity("energy") < creep.store.getUsedCapacity())
            {
                
                var ofloadcontainer;
                var flagmain = Game.flags[creep.room.name];
                var temp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, flagmain.pos.x - 2, flagmain.pos.y - 1);
                for (var i = 0; i < temp.length; i++)
                {
                    if (temp[i].structureType == STRUCTURE_TERMINAL)
                    {
                        ofloadcontainer = temp[i];
                    }
                }
                // var linkto = Game.rooms[roomname].lookForAt('structure', storage_xpos - 2  , storage_ypos -1 )[0];
                const resourcevalues = Object.values(creep.store);
                const resourcekeys = Object.keys(creep.store);
                creep.transfer(ofloadcontainer, resourcekeys[0], resourcevalues[0]);
            }
            else
            {
                var ofloadcontainer;
                var flagmain = Game.flags[creep.room.name];
                var temp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, flagmain.pos.x - 1, flagmain.pos.y);
                for (var i = 0; i < temp.length; i++)
                {
                    if (temp[i].structureType == STRUCTURE_CONTAINER)
                    {
                        ofloadcontainer = temp[i];
                    }
                }
                // var linkto = Game.rooms[roomname].lookForAt('structure', storage_xpos - 2  , storage_ypos -1 )[0];
                if (ofloadcontainer.store.getUsedCapacity() < 2000)
                {
                    var transfervalue;
                    if (ofloadcontainer.store.getFreeCapacity() - creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
                    {
                        transfervalue = creep.store.getUsedCapacity(RESOURCE_ENERGY);
                    }
                    else
                    {
                        transfervalue = ofloadcontainer.store.getFreeCapacity();
                    }
                    creep.transfer(ofloadcontainer, RESOURCE_ENERGY, transfervalue);
                }
                else
                {
                    var twoTowers = creep.pos.findInRange(FIND_STRUCTURES, 1,
                    {
                        filter: (structure) => structure.structureType == STRUCTURE_TOWER && structure.store.getUsedCapacity("energy") < 100
                    });
                    if (twoTowers.length > 0 && false)
                    {
                        creep.transfer(twoTowers[0], RESOURCE_ENERGY, creep.store.getUsedCapacity());
                    }
                    else
                    {
                        var closestDamagedStructure = creep.pos.findInRange(FIND_STRUCTURES, 3,
                        {
                            filter: (structure) => structure.hits < structure.hitsMax * 0.1 && structure.structureType != STRUCTURE_WALL
                        });
                        var sourcelink = creep.pos.findClosestByPath(FIND_STRUCTURES,
                        {
                            filter: (structure) =>
                            {
                                return (structure.structureType == STRUCTURE_LINK);
                            }
                        });
                        if (closestDamagedStructure.length != 0 && creep.room.storage.store.getUsedCapacity() > 100000 && creep.room.terminal.store
                            .getUsedCapacity("energy") < 55000 && sourcelink != undefined) //////////////////////////////////////////
                        {
                            creep.repair(closestDamagedStructure[0]);
                        }
                        else
                        {
                            var storagemain = creep.pos.findClosestByPath(FIND_STRUCTURES,
                            {
                                filter: (structure) =>
                                {
                                    return (structure.structureType == STRUCTURE_STORAGE);
                                }
                            });
                            creep.transfer(storagemain, RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY));
                        }
                    }
                }
            }
        }
    }
};
module.exports = roleresourcemover;