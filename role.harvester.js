var creepfunctions = require('prototype.creepfunctions');
var roleharvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        
         
           if(creep.ticksToLive>1400  ){
                     creep.moveTo(Game.flags[creep.room.name + "source" + creep.memory.sourcetarget].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
 
        if (creep.carry.energy < creep.carryCapacity - 20) {
            
            var sources = creep.pos.findInRange(FIND_SOURCES,1);  
           
            creep.harvest(sources[0]);
          
        } else {
            const targets =Game.flags[creep.room.name + "container" + creep.memory.sourcetarget].pos.lookFor(LOOK_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_LINK)  && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity()
                }});
            if (targets.length == 0) {
                var constructionsites = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 1);
                  console.log(constructionsites[0] );
                if (constructionsites[0]  != undefined) {
                   
                   creep.say( creep.build(constructionsites[0]))
                     
                }
                else if (constructionsites.length ==0) 
                {
                    creep.drop(RESOURCE_ENERGY, 20)
                    creep.say("drop");
                }
            }
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {}
        }
        
        //creepfunctions.movehomeandrenew(creep,creep.memory.memstruct.spawnRoom,100);
        
    }

};

module.exports = roleharvester;