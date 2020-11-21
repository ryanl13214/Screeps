/*
KNOWN ISSUES
 


*/
var roleMover = {
    //     this role is for moving energy from full containers to other areas within the same room    
    run: function(creep)
    {
        const startCpu = Game.cpu.getUsed();
        // creep logic goes here
        if (creep.store.getUsedCapacity() == 0)
        {
            creep.memory.memstruct.full = false;
        }
        else if (creep.memory.memstruct.full == false && _.sum(creep.carry) == creep.carryCapacity)
        {
            creep.memory.memstruct.full = true;
            creep.memory.target = "a";
        }
        if (creep.memory.memstruct.full == false)
        {
            var storagemain;
            var links;
            var containers;
            var droppedresources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
            {
                filter: (res) =>
                {
                    return (res.resourceType != RESOURCE_ENERGY) || (res.amount > 100);
                }
            });
            if (droppedresources == undefined && creep.memory.target == "a")
            {
                storagemain = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_STORAGE) && structure.store.energy > 500000;
                    }
                });
                containers = creep.pos.findClosestByRange(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy > 1800;
                    }
                });
              
                if (containers == undefined && creep.room.level >5)
                {
                    var term = creep.room.terminal;
                    if(term != undefined)
                    {
                        if(term.store.getUsedCapacity("energy") > 50000)
                        {
                            containers = term.id;
                        }
                    }
                }
              
                var tombstones = creep.pos.findClosestByPath(FIND_TOMBSTONES,
                {
                    filter: (tomb) =>
                    {
                        return (tomb.store.getUsedCapacity() != tomb.store.getUsedCapacity(RESOURCE_ENERGY)) || (tomb.store.getUsedCapacity(
                            RESOURCE_ENERGY) > 300);
                    }
                });
                if (tombstones != undefined)
                {
                    creep.memory.target = tombstones.id;
                }
                else if (containers != undefined)
                {
                    creep.memory.target = containers.id;
                }
                else if (storagemain != undefined && creep.room.controller.level < 8)
                {
                    creep.memory.target = storagemain.id;
                }
            }
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
                        reusePath: range,
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
            }
            else if (creep.memory.target != undefined)
            {
                var object = Game.getObjectById(creep.memory.target);
                var resourcekeys = [RESOURCE_ENERGY];
                if (object == null)
                {
                    creep.memory.target = "a";
                }
                else
                {
                    resourcekeys = Object.keys(object.store);
                }
                if (resourcekeys.length == 0)
                {
                    creep.memory.target = "a";
                }
                var range = creep.pos.getRangeTo(object);
                if (range <= 1)
                {
                    creep.withdraw(object, resourcekeys[0]);
                }
                else
                {
                    var moveerrorcode = creep.moveTo(object,
                    {
                        reusePath: range,
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                    if (moveerrorcode != 0)
                    {
                        creep.memory.target = "a";
                    }
                }
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////
        if (creep.memory.memstruct.full == true)
        {
            if (creep.store[RESOURCE_ENERGY] == creep.store.getUsedCapacity())
            {
                var targets2 = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure
                            .structureType == STRUCTURE_LAB) && structure.energy != structure.energyCapacity;
                    }
                });
                var targets4 = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy < 900;
                    }
                });
                var storagemain = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_STORAGE);
                    }
                });
                var terminal = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_TERMINAL) && structure.store.energy < 50000;
                    }
                });
                var targ;
                if (targets2 != undefined)
                {
                    targ = targets2;
                }
                else if (terminal != undefined)
                {
                    targ = terminal;
                }
                else if (targets4 != undefined)
                {
                    targ = targets4;
                }
                else if (storagemain != undefined && creep.room.controller.level < 8)
                {
                    targ = storagemain;
                }
                var range = creep.pos.getRangeTo(targ);
                if (range <= 1)
                {
                  creep.transfer(targ, RESOURCE_ENERGY, creep.energyAvailable);
                }
                else
                {
                     creep.moveTo(targ,
                    {
                        reusePath: range,
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
            }
            else
            {
                var terminalObject = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_TERMINAL);
                    }
                });
                if (terminalObject != undefined)
                {
                    targ = terminalObject;
                }
                else if (creep.room.storage != undefined)
                {
                    targ = creep.room.storage;
                }
                const resourcevalues = Object.values(creep.store);
                const resourcekeys = Object.keys(creep.store);
                var range = creep.pos.getRangeTo(targ);
                if (range <= 1)
                {
                 creep.transfer(targ, resourcekeys[0], resourcevalues[0]);
                }
                else
                {
                     creep.moveTo(targ,
                    {
                        reusePath: range,
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
            }
        }
        creep.memory.cpuUsed = creep.memory.cpuUsed + (Game.cpu.getUsed() - startCpu);
        if (creep.ticksToLive == 1)
        {
            console.log("mover cpu avg-" + (creep.memory.cpuUsed / 1500));
        }
    }
};
module.exports = roleMover;