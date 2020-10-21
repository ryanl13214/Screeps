var roleMover = {

    //     this role is for moving energy from full containers to other areas within the same room    



    run: function(creep) {


        const startCpu = Game.cpu.getUsed();

        // creep logic goes here

        if (creep.carry.energy == 0) 
        {
            creep.memory.full = false;
        } 
        else if (creep.memory.full == false && _.sum(creep.carry) == creep.carryCapacity) 
        {
            creep.memory.full = true;
        }



        if (creep.memory.full == false) {
            var sources2 = creep.room.find(FIND_DROPPED_RESOURCES);

            var sources3 = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_LINK) && structure.energy > 400;
                }
            });
            //	creep.say(links.length);

            if (sources3.length == 0) {
                var sources3 = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy > 1600;
                    }
                });
            }
            if (sources2.length > 0) {
                if (creep.pickup(creep.pos.findClosestByRange(sources2)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.pos.findClosestByRange(sources2), {
                        reusePath: 10
                    });
                }
            } else {

                if (creep.withdraw(creep.pos.findClosestByRange(sources3), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.pos.findClosestByRange(sources3), {
                        reusePath: 10
                    });
                }
            }
        }
        if (creep.memory.full == true) {
            var closestEnemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            var targets2 = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy != structure.energyCapacity;
                }
            });
            var targets4 = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy < 1000;
                }
            });
            var targets5 = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE);
                }
            });
            var terminal = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TERMINAL) && structure.store.energy < 50000;
                }
            });
            var targ;
            if (targets2 != undefined) {
                targ = targets2;
            } else if (terminal != undefined) {
                targ = terminal;
            } else if (targets4 != undefined) {
                targ = targets4;
            } else if (targets5 != undefined) {
                targ = targets5;
            }
            if (creep.transfer(targ, RESOURCE_ENERGY, creep.energyAvailable) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targ, {
                    reusePath: 50
                });
            }
        }
        const elapsed = Game.cpu.getUsed() - startCpu;
        //  console.log('Creep mover has used '+elapsed+' CPU time');

    }
};
module.exports = roleMover;