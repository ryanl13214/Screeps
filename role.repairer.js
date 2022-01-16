var creepfunctions = require('prototype.creepfunctions');
var rolerepair = {
       repairNuketargets: function(creep)
    {
    },
    roomUnderAttack: function(creep)
    {
    },
   
    run: function(creep)
    {
        var startCpurepair = Game.cpu.getUsed();
        var check = creepfunctions.checkglobaltasks(creep);
        if (check)
        {

            if (creep.memory.sourcetarget == undefined)
            {
                creep.memory.sourcetarget = 1;
            }

            if (creep.memory.memstruct.tasklist.length == 0)
            {
                if (creep.memory.full == true && creep.carry.energy == 0)
                {
                    creep.memory.full = false;
                }
                if (creep.memory.full != true && creep.carry.energy == creep.carryCapacity)
                {
                    creep.memory.full = true;
                    creep.memory.sourcetarget = (creep.memory.sourcetarget + 1) % 2;
                }
                if (!creep.memory.full)
                {
                    creep.memory.hastask = false;
                    if (!creep.memory.hastask)
                    {
                        creepfunctions.findfullcontainers(creep, 500);
                    }
                    if (!creep.memory.hastask)
                    {
                        creep.say("!creep.memory.hastask");
                        var sources = creep.room.find(FIND_SOURCES);

                        if (sources.length == 1)
                        {
                            creep.memory.sourcetarget = 0;
                        }

                        if (creep.harvest(sources[creep.memory.sourcetarget]) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(sources[creep.memory.sourcetarget],
                            {
                                visualizePathStyle:
                                {
                                    stroke: '#ffaa00'
                                }
                            });
                        }
                    }
                }
                if (creep.memory.full)
                {
                    var target = creep.room.find(FIND_HOSTILE_CREEPS,
                    {
                        filter: (structure) => (structure.body.length > 15)
                    });
                    var targe2 = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS,
                    {
                        filter: (structure) => (structure.body.length > 15)
                    });
                    var structuresclosetoenemys = [];
                    if (targe2 != undefined)
                    {
                        var structuresclosetoenemys = targe2.pos.findInRange(FIND_STRUCTURES, 3,
                        {
                            filter: (structure) => (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART)
                        });
                    }
                
                    var myspawns = creep.room.find(FIND_MY_SPAWNS);
                    var spawnsInDanger = [];
                    var terminalInDanger = false;
                    var storageInDanger = false;
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                        if (structuresclosetoenemys.length == 0 || creep.name == 'repair2' + creep.room.name)
                        {
                            creep.memory.hastask = false;
                            if (!creep.memory.hastask)
                            {
                                if (!creep.memory.hastask)
                                {
                                    creepfunctions.buildstructs(creep);
                                }
                                if (!creep.memory.hastask)
                                {
                                    creepfunctions.repairbuildingsfull(creep);
                                }
                                if (!creep.memory.hastask)
                                {
                                    this.repairLowestRamparts(creep);
                                }
                                if (!creep.memory.hastask)
                                {

                                    try
                                    {

                                        creep.upgradeController(creep.room.controller);
                                        creep.moveTo(creep.room.controller,
                                        {
                                            visualizePathStyle:
                                            {
                                                stroke: '#ffaa00'
                                            }
                                        });
                                    }
                                    catch (e)
                                    {}
                                }

                            }
                        }
                        else
                        {

                            if (structuresclosetoenemys.length != 0)
                            {
                                var tmp = 0;
                                var value = 9999999999999999999;
                                for (var i = 0; i < structuresclosetoenemys.length; i++)
                                {
                                    if (structuresclosetoenemys[i].hits < value)
                                    {
                                        value = structuresclosetoenemys[i].hits;
                                        tmp = i;
                                    }
                                }
                                var range = creep.pos.getRangeTo(structuresclosetoenemys[tmp]);
                                if (range <= 3)
                                {
                                    creep.repair(structuresclosetoenemys[tmp]);
                                }
                                else
                                {
                                    creep.moveTo(structuresclosetoenemys[tmp],
                                    {
                                        reusePath: 5
                                    });
                                }
                            }
                        }

                        let goals = _.map(target, function(host)
                        {
                            return {
                                pos: host.pos,
                                range: 4
                            };
                        });
                        let patha = PathFinder.search(creep.pos, goals,
                        {
                            flee: true
                        }).path;
                        creep.moveByPath(patha);

                    }
 
                
                creep.memory.cpuUsed = creep.memory.cpuUsed + (Game.cpu.getUsed() - startCpurepair);
                if (creep.ticksToLive == 1)
                {
                    //    console.log("repairer cpu avg-"+(creep.memory.cpuUsed/1500));
                }
                //      creepfunctions.movehomeandrenew(creep,creep.memory.memstruct.spawnRoom,100);
            }
        }
    },
    repairLowestRamparts: function(creep)
    {
        var LowestRamparts = creep.room.find(FIND_STRUCTURES,
        {
            filter: (structure) => (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART)
        });
        var tmp = 0;
        if (LowestRamparts.length != 0)
        {
            var value = 9999999999999999999;
            for (var i = 0; i < LowestRamparts.length; i++)
            {
                if (LowestRamparts[i].hits < value)
                {
                    value = LowestRamparts[i].hits;
                    tmp = i;
                }
            }
            creep.memory.memstruct.tasklist.push(["repair", LowestRamparts[tmp].id]);
        }
    }
};
module.exports = rolerepair;