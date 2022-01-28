var creepfunctions = require('prototype.creepfunctions');
rolerepair = {
    repairNuketargets: function(creep) {},
    roomUnderAttack: function(creep) {},
findfullcontainers: function(creep, energyleveltodrawfrom)
    {
        var containers = creep.pos.findClosestByRange(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return s.structureType == STRUCTURE_CONTAINER && s.store.getUsedCapacity("energy") > energyleveltodrawfrom;
            }
        });
        if (containers == undefined)
        {
            containers = creep.pos.findClosestByRange(FIND_STRUCTURES,
            {
                filter: (s) =>
                {
                    return s.structureType == STRUCTURE_LINK && s.store.getUsedCapacity("energy") > 500;
                }
            });
        }
        if (containers != undefined && containers != null)
        {
            if (creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(containers,
                {
                    visualizePathStyle:
                    {
                        stroke: '#ffaa00'
                    }
                });
            }
            creep.memory.hastask = true;
        }
        else
        {
            var storageMain = creep.room.storage;
            if (storageMain != undefined && storageMain.store.getUsedCapacity() > 50000)
            {
                var range = creep.pos.getRangeTo(storageMain);
                if (range <= 1)
                {
                    creep.withdraw(storageMain, RESOURCE_ENERGY);
                }
                else
                {
                    creep.moveTo(storageMain,
                    {
                        reusePath: range,
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
                creep.memory.hastask = true;
            }
        }
    },
    /*
    USED BY: 
        jack
    
    
    
    */
    checklocaltasks: function(creep)
    {
        if (creep.memory.tasklist[0] == "moveto")
        {
            const path = creep.pos.findPathTo(creep.memory.targetroom);
            if (path.length > 0)
            {
                creep.move(path[0].direction);
            }
            else
            {
                creep.memory.tasklist[0].splice(0, 1);
            }
        }
    },
    /*
    USED BY: 
        jack
    
    
    
    */
    repairbuildings: function(creep)
    {
        var repairtarg = creep.pos.findClosestByRange(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return (s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_CONTAINER) && s.hits < s.hitsMax * 0.7;
            }
        });
        if (repairtarg)
        {
            var range = creep.pos.getRangeTo(repairtarg);
            if (range <= 3)
            {
                creep.repair(repairtarg);
            }
            else
            {
                creep.moveTo(repairtarg,
                {
                    reusePath: 5
                });
            }
            creep.memory.hastask = true;
        }
    },
    /*
    USED BY: 
        repairer
    
    
    
    */
    repairbuildingsfull: function(creep)
    {
        var repairtarg = creep.pos.findClosestByRange(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return ( s.structureType != STRUCTURE_RAMPART) && s.hits < s.hitsMax * 0.99;
            }
        });
        if (repairtarg)
        {
            var range = creep.pos.getRangeTo(repairtarg);
            if (range <= 3)
            {
                creep.repair(repairtarg);
            }
            else
            {
                creep.moveTo(repairtarg,
                {
                    reusePath: 5
                });
            }
            creep.memory.hastask = true;
        }
    },
        buildstructs: function(creep)
    {
        var constructionsites = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (constructionsites != undefined)
        {
            var range = creep.pos.getRangeTo(constructionsites);
            if (range <= 3)
            {
                creep.build(constructionsites);
            }
            else
            {
                creep.moveTo(constructionsites,
                {
                    reusePath: range
                });
            }
            creep.memory.hastask = true;
        }
    },
    upkeepwalls: function(creep)
    {
        var repairtarg = creep.pos.findClosestByRange(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return  (s.structureType == STRUCTURE_RAMPART && s.hits < s.hitsMax * 0.5);
            }
        });
        if (repairtarg)
        {
            var range = creep.pos.getRangeTo(repairtarg);
            if (range <= 3)
            {
                creep.repair(repairtarg);
            }
            else
            {
                creep.moveTo(repairtarg,
                {
                    reusePath: 5
                });
            }
            creep.memory.hastask = true;
        }
    },
    upgradecontroller: function(creep)
    {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(creep.room.controller,
            {
                visualizePathStyle:
                {
                    stroke: '#ffffff'
                }
            });
        }
        creep.memory.hastask = true;
    },
    stockbuildingswithenergy: function(creep)
    {
        var buildingsneedingenergy = creep.room.find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (
                    (structure.structureType == STRUCTURE_EXTENSION && structure.energy < 50) || (structure.structureType == STRUCTURE_CONTAINER && structure.store.energy < 500) || (structure.structureType == STRUCTURE_SPAWN && structure.energy < 300));
            }
        });
        if (buildingsneedingenergy.length > 0)
        {
            if (creep.transfer(creep.pos.findClosestByPath(buildingsneedingenergy), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(creep.pos.findClosestByPath(buildingsneedingenergy),
                {
                    visualizePathStyle:
                    {
                        stroke: '#ffffff'
                    }
                });
            }
            creep.memory.hastask = true;
        }
    },
    run: function(creep)
    {
        var startCpurepair = Game.cpu.getUsed();

        if (creep.memory.sourcetarget == undefined)
        {
            creep.memory.sourcetarget = 1;
        }

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
                this.findfullcontainers(creep, 500);
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
                    filter: (structure) => ( structure.structureType == STRUCTURE_RAMPART)
                });
            }

            var myspawns = creep.room.find(FIND_MY_SPAWNS);
            var spawnsInDanger = [];
            var terminalInDanger = false;
            var storageInDanger = false;

            if (structuresclosetoenemys.length == 0 )
            {
                creep.memory.hastask = false;
                if (!creep.memory.hastask)
                {
                    if (!creep.memory.hastask)
                    {
                        this.buildstructs(creep);
                    }
                    if (!creep.memory.hastask)
                    {
                        this.repairbuildingsfull(creep);
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
            console.log("repairer cpu avg-" + (creep.memory.cpuUsed / 1500));
        }

    },
    repairLowestRamparts: function(creep)
    {
        var LowestRamparts = creep.room.find(FIND_STRUCTURES,
        {
            filter: (structure) => (  structure.structureType == STRUCTURE_RAMPART)
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