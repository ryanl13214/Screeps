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
            creep.memory.full = false;
        }
        else if (creep.memory.full == false && _.sum(creep.carry) == creep.carryCapacity)
        {
            creep.memory.full = true;
            creep.memory.target = "a";
        }
        if (creep.memory.full == false)
        {
            var storagemain;
            var links;
            var containers;
            var droppedresources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
                {
                    filter: (res) =>
                    {
                        return (res.resourceType !=  RESOURCE_ENERGY) || (res.amount > 100);
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
                        return (structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy > 1600;
                    }
                });
                if (containers == undefined)
                {
                    containers = creep.pos.findClosestByRange(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy > 400;
                        }
                    }); 
                }
                if (containers == undefined)
                {
                    containers = creep.pos.findClosestByRange(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_TERMINAL) && structure.store.energy > 51000;
                        }
                    }); 
                }
                
                var tombstones = creep.pos.findClosestByPath(FIND_TOMBSTONES,
                {
                    filter: (tomb) =>
                    {
                        return (tomb.store.getUsedCapacity() != tomb.store.getUsedCapacity(RESOURCE_ENERGY)) || (tomb.store.getUsedCapacity(RESOURCE_ENERGY) > 300);
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
             
                else if (storagemain != undefined && creep.room.controller.level <8)
                {
                    creep.memory.target = storagemain.id;
                }
            }
            if (droppedresources != undefined)
            {
                if (creep.pickup(droppedresources) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(droppedresources,
                    {
                        reusePath: 10,
                        visualizePathStyle: {
                                stroke: '#ffaa00'
                            }
                    });
                }
            }
            else if (creep.memory.target != undefined)
            {
                var object = Game.getObjectById(creep.memory.target);
              
                var resourcekeys =  [RESOURCE_ENERGY];
               
                if(object == null){creep.memory.target = "a";} else{
                    
                    resourcekeys =Object.keys(object.store) ;
                   
                } 
                if(resourcekeys.length==0){
                    
                      creep.memory.target = "a";
                }
                var errorcode = creep.withdraw(object,resourcekeys[0] ); 
                if (errorcode != 0)
                {
                    var moveerrorcode = creep.moveTo(object,
                    {
                        reusePath: 10,
                        visualizePathStyle: {stroke: '#ffaa00'}
                    });
                }
                else if (errorcode != 0  )
                {
                    creep.memory.target = "a";
                }
              
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////
        if (creep.memory.full == true)
        {
            if (creep.store[RESOURCE_ENERGY] == creep.store.getUsedCapacity())
            {
                var targets2 = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_LAB) && structure.energy != structure.energyCapacity;
                    }
                });
                var targets4 = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy < 1500;
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
                else if (storagemain != undefined  && creep.room.controller.level <8)
                {
                    targ = storagemain;
                }
                if (creep.transfer(targ, RESOURCE_ENERGY, creep.energyAvailable) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targ,
                    {
                        reusePath: 5,
                        visualizePathStyle: {
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
                        return (structure.structureType == STRUCTURE_TERMINAL)  ;
                    }
                });
             
                    targ = terminalObject;
                 
          const resourcevalues = Object.values(creep.store);
                const resourcekeys = Object.keys(creep.store);
                if (creep.transfer(targ, resourcekeys[0], resourcevalues[0]) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targ,
                    {
                        reusePath: 5,
                        visualizePathStyle: {
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