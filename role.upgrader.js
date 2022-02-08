var creepfunctions = require('prototype.creepfunctions');
var roleUpgrader = {
    run: function(creep)
    {
        var check = creepfunctions.checkglobaltasks(creep);
        var conflag = Game.flags[creep.room.name + "controllerpos"];
        var conflag2 = Game.flags[creep.room.name + "controllerposcontainer"];
        if(conflag == undefined || conflag2 == undefined && check)
        {
            const pathh = creep.pos.findPathTo(creep.room.controller,
            {
                ignoreCreeps: true
            });
            if(pathh.length > 2)
            {
                creep.moveTo(creep.room.controller,
                {
                    ignoreCreeps: true
                });
            }
            else if(pathh.length == 2)
            {
                creep.room.createFlag(creep.pos.x, creep.pos.y, creep.room.name + "controllerposcontainer");
                creep.moveTo(creep.room.controller,
                {
                    ignoreCreeps: true
                });
            }
            else if(pathh.length == 1)
            {
                creep.room.createFlag(creep.pos.x, creep.pos.y, creep.room.name + "controllerpos");
            }
        }
        if(check && conflag != undefined)
        {
            
            if(Game.time % 10000){
                
                
                     if(creep.room.controller.level < 7 )
                    {
                        var flag1 = Game.flags[creep.room.name + "controllerposcontainer" ];
                        Game.rooms[creep.room.name].createConstructionSite(flag1.pos.x, flag1.pos.y, STRUCTURE_CONTAINER);
                    }
                     else     if(creep.room.controller.level < 8 )
                    {
                        var flag1 = Game.flags[creep.room.name + "controllerposcontainer" ];
                        Game.rooms[creep.room.name].createConstructionSite(flag1.pos.x, flag1.pos.y, STRUCTURE_LINK);
                    }
                    
                    
                    
            }
            
            
            
            
            
            
            
            if(creep.memory.full && creep.carry.energy == 0)
            {
                creep.memory.full = false;
            }
            if(!creep.memory.full && creep.store.getUsedCapacity("energy") ==creep.store.getCapacity()  )
            {
                creep.memory.full = true;
            }
            if(creep.memory.full)
            {
                creep.upgradeController(creep.room.controller);
                creep.moveTo(Game.flags[creep.room.name + "controllerpos"].pos,
                {
                    visualizePathStyle:
                    {
                        stroke: '#ffaa00'
                    }
                });
            }
            else
            {
                var droppedresources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1,
                {
                    filter: (res) =>
                    {
                        return (res.resourceType == RESOURCE_ENERGY);
                    }
                });
                if(droppedresources.length != 0)
                {
                    creep.pickup(droppedresources[0]);
                }
                else
                {
                      var controllerflag = Game.flags[creep.room.name + "controllerposcontainer"];
                         var controllerlink = controllerflag.pos.findInRange(FIND_STRUCTURES, 1,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_LINK) ;
                }
            });
                    
                    
                    
                  
                    if(controllerlink.length != 0)
                    {
                        if(creep.withdraw(controllerlink[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(controllerlink[0],
                            {
                                visualizePathStyle:
                                {
                                    stroke: '#ffaa00'
                                }
                            });
                        }
                    }
                    else
                    {
                        var sources = creep.pos.findClosestByRange(FIND_SOURCES);
                        if(creep.harvest(sources) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(sources,
                            {
                                visualizePathStyle:
                                {
                                    stroke: '#ffaa00'
                                }
                            });
                        }
                    }
                }
            }
            //     creepfunctions.movehomeandrenew(creep,creep.memory.memstruct.spawnRoom,100);
        }
    }
};
module.exports = roleUpgrader;