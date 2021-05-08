var creepfunctions = require('prototype.creepfunctions');
var rolerepair = {
    run: function(creep)
    {
        var startCpurepair = Game.cpu.getUsed();
        var check = creepfunctions.checkglobaltasks(creep);
        if(check)
        {
            if(creep.memory.memstruct.tasklist.length == 0)
            {
                if(creep.memory.full == true && creep.carry.energy == 0)
                {
                    creep.memory.full = false;
                }
                if(creep.memory.full != true && creep.carry.energy == creep.carryCapacity)
                {
                    creep.memory.full = true;
                    creep.memory.sourcetarget = (creep.memory.sourcetarget + 1) % 2;
                }
                if(!creep.memory.full)
                {
                    creep.memory.hastask = false;
                    if(!creep.memory.hastask)
                    {
                        creepfunctions.findfullcontainers(creep, 500);
                    }
                    if(!creep.memory.hastask)
                    {
                        creep.say("a");
                        var sources = creep.room.find(FIND_SOURCES);
                        if(creep.harvest(sources[creep.memory.sourcetarget]) == ERR_NOT_IN_RANGE)
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
                if(creep.memory.full)
                {
                    var target = creep.room.find(FIND_HOSTILE_CREEPS);
                    var targe2 = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    var structuresclosetoenemys = [];
                    if(targe2 != undefined)
                    {
                        var structuresclosetoenemys = targe2.pos.findInRange(FIND_STRUCTURES, 3,
                        {
                            filter: (structure) => (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART)
                        });
                    }
                    var nukeIncoming = creep.room.find(FIND_NUKES);
                    var myspawns = creep.room.find(FIND_MY_SPAWNS);
                    var spawnsInDanger = [];
                    var terminalInDanger = false;
                    var storageInDanger = false;
                    //  nukes 
                    if(nukeIncoming.length != 0 && target.length ==0)
                    {
                        // storaqge spawn and terminal
                        var storagerampartsneeded = 0.;
                        // calc storage ramparts needed
                        for(var i = 0; i < nukeIncoming.length; i++)
                        {
                            var range = creep.room.storage.pos.getRangeTo(nukeIncoming[i]);
                            if(range == 0)
                            {
                                storagerampartsneeded += 10100000;
                            }
                            else if(range < 3)
                            {
                                storagerampartsneeded += 5100000;
                            }
                        }
                        var terminalrampartsneeded = 0.;
                        // calc terminal ramparts needed
                        for(var i = 0; i < nukeIncoming.length; i++)
                        {
                            var range = creep.room.terminal.pos.getRangeTo(nukeIncoming[i]);
                            if(range == 0)
                            {
                                terminalrampartsneeded += 10100000;
                            }
                            else if(range < 3)
                            {
                                terminalrampartsneeded += 5100000;
                            }
                        }
                        var storagerampartsCurrent = 0;
                        var terminalrampartsCurrent = 0;
                        var tmp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, creep.room.storage.pos.x, creep.room.storage.pos.y);
                        var terminalrapartActual;
                        var storagerampartActual;
                        for(var i = 0; i < tmp.length; i++)
                        {
                            if(tmp[i].structureType == STRUCTURE_RAMPART)
                            {
                                storagerampartsCurrent = tmp[i].hits;
                                storagerampartActual = tmp[i];
                            }
                        }
                        var tmp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, creep.room.terminal.pos.x, creep.room.terminal.pos.y);
                        for(var i = 0; i < tmp.length; i++)
                        {
                            if(tmp[i].structureType == STRUCTURE_RAMPART)
                            {
                                terminalrampartsCurrent = tmp[i].hits;
                                terminalrapartActual = tmp[i];
                            }
                        }
                        if(terminalrampartsneeded > terminalrampartsCurrent)
                        {
                            var range = creep.pos.getRangeTo(terminalrapartActual);
                            if(range <= 3)
                            {
                                creep.repair(terminalrapartActual);
                            }
                            else
                            {
                                creep.moveTo(terminalrapartActual);
                            }
                            creep.say("nuketerminal");
                        }
                        else if(storagerampartsneeded > storagerampartsCurrent)
                        {
                            var range = creep.pos.getRangeTo(storagerampartActual);
                            if(range <= 3)
                            {
                                creep.repair(storagerampartActual);
                            }
                            else
                            {
                                creep.moveTo(storagerampartActual.pos);
                            }
                            creep.say("nukestorage");
                        }
                        else
                        {
                            creep.say("nukeready");
                            nukeIncoming = [];
                        }
                        // end of nuke check
  
                    }   
                    if(nukeIncoming.length == 0 || target.length !=0)
                        {
                            if(structuresclosetoenemys.length == 0)
                            {
                                creep.memory.hastask = false;
                                if(!creep.memory.hastask)
                                {
                                    if(!creep.memory.hastask)
                                    {
                                        creepfunctions.buildstructs(creep);
                                    }
                                    if(!creep.memory.hastask)
                                    {
                                        creepfunctions.repairbuildingsfull(creep);
                                    }
                                    if(!creep.memory.hastask)
                                    {
                                        this.repairLowestRamparts(creep);
                                    }
                                }
                            }
                            else
                            {
                                
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
                                if(structuresclosetoenemys.length != 0)
                                {
                                    var tmp = 0;
                                    var value = 9999999999999999999;
                                    for(var i = 0; i < structuresclosetoenemys.length; i++)
                                    {
                                        if(structuresclosetoenemys[i].hits < value)
                                        {
                                            value = structuresclosetoenemys[i].hits;
                                            tmp = i;
                                        }
                                    }
                                    var range = creep.pos.getRangeTo(structuresclosetoenemys[tmp]);
                                    if(range <= 3)
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
                        }
                }
                creep.memory.cpuUsed = creep.memory.cpuUsed + (Game.cpu.getUsed() - startCpurepair);
                if(creep.ticksToLive == 1)
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
        if(LowestRamparts.length != 0)
        {
            var value = 9999999999999999999;
            for(var i = 0; i < LowestRamparts.length; i++)
            {
                if(LowestRamparts[i].hits < value)
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