/*

if full of energy then do tasks in following order
1 stockbuildingswithenergy
2 repairbuildings
3 buildstructs
4 upgradecontroller
 
if not do the following oin order
1 withdraw from containser with more than 1000 energy 
2 harvet energy 
 

*/
var creepfunctions = require('prototype.creepfunctions');
var rolejack = {

    run: function(creep) {
        var startCpujack = Game.cpu.getUsed();
        checkglobaltasks(creep);
        //   checklocaltasks(creep);
        if (creep.memory.tasklist.length == 0) {
        if (creep.memory.full == true && creep.carry.energy == 0) {
                creep.memory.full = false;
            }
            if (creep.memory.full != true && creep.carry.energy == creep.carryCapacity) {
                creep.memory.full = true;
                creep.memory.sourcetarget = (creep.memory.sourcetarget + 1) % 2;
            }
            if (!creep.memory.full) {
                creep.memory.hastask = false;
                if (!creep.memory.hastask) {
                    creepfunctions.findfullcontainers(creep,1000);
                }
                if (!creep.memory.hastask) {
                    var sources = creep.room.find(FIND_SOURCES);
                    if (creep.harvest(sources[creep.memory.sourcetarget]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[creep.memory.sourcetarget], {
                            visualizePathStyle: {
                                stroke: '#ffaa00'
                            }
                        });
                    }
                }
            }
            if (creep.memory.full) {
                if (creep.memory.lastpos == creep.room.pos) {
                    creep.memory.sourcetarget = (creep.memory.sourcetarget + 1) % 2;
                }
                creep.memory.lastpos = creep.room.pos;
                creep.memory.hastask = false;
                if (!creep.memory.hastask) {
                    if (!creep.memory.hastask) {
                        creepfunctions.stockbuildingswithenergy(creep);
                    }
                    if (!creep.memory.hastask) {
                        creepfunctions.repairbuildings(creep);
                    }
                    if (!creep.memory.hastask) {
                        creepfunctions.buildstructs(creep);
                    }
                    if (!creep.memory.hastask) {
                        creepfunctions.upgradecontroller(creep);
                    }
                }
            }
        }
        creep.memory.cpuUsed = creep.memory.cpuUsed + (Game.cpu.getUsed() - startCpujack);
        if (creep.ticksToLive == 1) {
            console.log("jack cpu avg-" + (creep.memory.cpuUsed / 1500));
        }
    }
};
module.exports = rolejack;