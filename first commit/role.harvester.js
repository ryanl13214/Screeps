var roleharvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        
        
        if(creep.ticksToLive <130){
            creep.memory.role="harvesteralt";
        }
        
        if (creep.carry.energy < creep.carryCapacity - 20) {
            var sources = creep.room.find(FIND_SOURCES); // this method uses more memory ta it should when im running low on memory change this
            //store the source target into memory
            if (creep.harvest(sources[creep.memory.sourcetarget]) == ERR_NOT_IN_RANGE) {
                //   console.log(creep.room.name +"source"+creep.memory.sourcetarget);
                creep.moveTo(Game.flags[creep.room.name + "source" + creep.memory.sourcetarget].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
 
        } else {
            const targets =Game.flags[creep.room.name + "container" + creep.memory.sourcetarget].pos.lookFor(LOOK_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_LINK)  && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity()
                }});
            if (targets.length == 0) {
                var constructionsites = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 2);
                if (constructionsites.length != 0) {
                    creep.build(constructionsites[0])
                }
                if (constructionsites.length ==0) {
                    creep.drop(RESOURCE_ENERGY, 5)
                    creep.say("drop");
                }
            }
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {}
        }
    }

};

module.exports = roleharvester;