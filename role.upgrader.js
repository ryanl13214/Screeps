var roleUpgrader = {
    run: function(creep) {
        
        
        if(creep.memory.full && creep.carry.energy == 0) {
            creep.memory.full = false;
        }
        if(!creep.memory.full && creep.carry.energy == creep.carryCapacity) {
            creep.memory.full = true;
        }
        if(creep.memory.full) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.flags[creep.room.name + "controllerpos"  ].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else 
        {  
               var droppedresources = creep.pos.findInRange(FIND_DROPPED_RESOURCES,1,
                {
                    filter: (res) =>
                    {
                        return (res.resourceType ==  RESOURCE_ENERGY)  ;
                    }
                }); 
            if(droppedresources.length != 0) 
            { 
                creep.pickup(droppedresources[0]);
            } 
            else{
            const targets =Game.flags[creep.room.name + "controllercontainer" ].pos.lookFor(LOOK_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_LINK)  && structure.store[RESOURCE_ENERGY] != 0
            }});
            
            if(targets.length != 0){
            if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                 creep.moveTo(Game.flags[creep.room.name + "controllerpos"  ].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
            } 
            }else
            {
                var sources = creep.pos.findClosestByRange(FIND_SOURCES);
              
                if (creep.harvest(sources ) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources , {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
            
            
            
            
            }
            
            
            
            
            }
        }
        
        
	}
};

module.exports = roleUpgrader;











