var creepfunctions = require('prototype.creepfunctions');
var roleharvester = {
    /** @param {Creep} creep **/
    run: function(creep)
    {
        var check = creepfunctions.checkglobaltasks(creep);
        if(check)
        {
            var flag1 = Game.flags[creep.room.name + "source" + creep.memory.sourcetarget];
            var flag2 = Game.flags[creep.room.name + "container" + creep.memory.sourcetarget];
            if(flag1 == undefined || flag2 == undefined)
            {
                var target = creep.room.find(FIND_SOURCES);
                const pathh = creep.pos.findPathTo(target[creep.memory.sourcetarget],
                {
                    ignoreCreeps: true
                });
                if(pathh.length > 2)
                {
                    creep.moveTo(target[creep.memory.sourcetarget]);
                }
                else if(pathh.length == 2)
                {
                    creep.room.createFlag(creep.pos.x, creep.pos.y, creep.room.name + "container" + creep.memory.sourcetarget);
                    creep.moveTo(target[creep.memory.sourcetarget]);
                }
                else if(pathh.length == 1)
                {
                    creep.room.createFlag(creep.pos.x, creep.pos.y, creep.room.name + "source" + creep.memory.sourcetarget);
                }
            }
            if(creep.ticksToLive < 130)
            {
                creep.memory.role = "harvesteralt";
            }
            var range = creep.pos.getRangeTo(flag1);
            if(range < 1)
            {
                var sources = creep.pos.findInRange(FIND_SOURCES, 1);
                creep.harvest(sources[0]);
            }
            else
            {
                creep.moveTo(flag1,
                {
                    reusePath: range,
                    visualizePathStyle:
                    {
                        stroke: '#ffaa00'
                    }
                });
            }
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
                    var flag1 = Game.flags[creep.room.name + "container" + creep.memory.sourcetarget];
                    if( Game.rooms[creep.memory.memstruct.spawnRoom].controller.level < 4)
                    {
                        var flag1 = Game.flags[creep.room.name + "container" + creep.memory.sourcetarget];
                        Game.rooms[creep.room.name].createConstructionSite(flag1.pos.x, flag1.pos.y, STRUCTURE_CONTAINER);
                    }
                }
            }
            else
            {
                creep.transfer(targets[Game.time % targets.length], RESOURCE_ENERGY);
            }
            //creepfunctions.movehomeandrenew(creep,creep.memory.memstruct.spawnRoom,100);
        }
    }
};
module.exports = roleharvester;