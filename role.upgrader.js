var creepfunctions = require('prototype.creepfunctions');
var roleUpgrader = {
    run: function(creep) {
  var check =    creepfunctions.checkglobaltasks(creep);



   
        if(Game.flags[creep.room.name + "controllerpos"] == undefined){
          
            const pathh = creep.pos.findPathTo(creep.room.controller,{ignoreCreeps:true});
            if(pathh.length > 2){
                    creep.moveTo(creep.room.controller);
            }else if (pathh.length == 2){
                   creep.room.createFlag(creep.pos.x  , creep.pos.y , creep.room.name + "controllerposcontainer");
                   creep.moveTo(creep.room.controller);
            }else if(pathh.length == 1){
                 creep.room.createFlag(creep.pos.x  , creep.pos.y , creep.room.name + "controllerpos");
            }
            
            
                     
               
               
            
        }
        
        
        

if(check){


        if (creep.memory.full && creep.carry.energy == 0) {
            creep.memory.full = false;
        }
        if (!creep.memory.full && creep.carry.energy == creep.carryCapacity) {
            creep.memory.full = true;
        }
        if (creep.memory.full) 
        {
             creep.upgradeController(creep.room.controller) ;
             
             
             
                creep.moveTo(Game.flags[creep.room.name + "controllerpos"].pos, {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
            
            
            
            
            
            
            
        } else {
            var droppedresources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {
                filter: (res) => {
                    return (res.resourceType == RESOURCE_ENERGY);
                }
            });
            if (droppedresources.length != 0) {
                creep.pickup(droppedresources[0]);
            } else {

                var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_LINK) && structure.store.getUsedCapacity() >creep.store.getFreeCapacity();
                    }
                });

                if (targets != undefined) {
                    if (creep.withdraw(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets, {
                            visualizePathStyle: {
                                stroke: '#ffaa00'
                            }
                        });
                    }
                } else {
                    var sources = creep.pos.findClosestByRange(FIND_SOURCES);

                    if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources, {
                            visualizePathStyle: {
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