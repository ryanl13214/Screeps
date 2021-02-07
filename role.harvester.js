var creepfunctions = require('prototype.creepfunctions');
var roleharvester = {
    /** @param {Creep} creep **/
    run: function(creep)
    {
        
        
        if(Game.flags[creep.room.name + "source" + creep.memory.sourcetarget] == undefined){
            var target = creep.room.find(FIND_SOURCES);
            const pathh = creep.pos.findPathTo(target[creep.memory.sourcetarget],{ignoreCreeps:true});
            if(pathh.length > 2){
                    creep.moveTo(target[creep.memory.sourcetarget]);
            }else if (pathh.length == 2){
                   creep.room.createFlag(creep.pos.x  , creep.pos.y , creep.room.name + "container" + creep.memory.sourcetarget);
                   creep.moveTo(target[creep.memory.sourcetarget]);
            }else if(pathh.length == 1){
                 creep.room.createFlag(creep.pos.x  , creep.pos.y , creep.room.name + "source" + creep.memory.sourcetarget);
            }
            
            
                     
               
               
            
        }
        
        
        
        
        
        
        
        
        
        
        if(creep.ticksToLive < 130)
        {
            creep.memory.role = "harvesteralt";
        }
        if(creep.ticksToLive > 1400)
        {
            creep.moveTo(Game.flags[creep.room.name + "source" + creep.memory.sourcetarget].pos, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
        var sources = creep.pos.findInRange(FIND_SOURCES, 1);
        creep.harvest(sources[0]);
        var targets = creep.pos.findInRange(FIND_STRUCTURES, 1,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_LINK);
            }
        });
        if(targets.length == 0)
        {
            var constructionsites = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 1);
           // console.log(constructionsites[0]);
            if(constructionsites[0] != undefined)
            {
                creep.say(creep.build(constructionsites[0]))
            }
            else if(constructionsites.length == 0)
            {
                creep.drop(RESOURCE_ENERGY, 20)
                creep.say("drop");
            }
        }
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {}
        //creepfunctions.movehomeandrenew(creep,creep.memory.memstruct.spawnRoom,100);
    }
};
module.exports = roleharvester;