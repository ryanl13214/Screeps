var creepfunctions = require('prototype.creepfunctions');
var attackerCode = require('role.basicattacker');
var roleguard = {
    /** @param {Creep} creep **/
    decideMassAttack: function(creep)
    {
        var enemiesInRange = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
        var structuresInRange = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
        var enemiesInRange2 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 2);
        var structuresInRange2 = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 2);
        var enemiesInRange3 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        var structuresInRange3 = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
        if(enemiesInRange.length != 0 || structuresInRange.length != 0)
        {
            return true;
        }
        else
        {
            var counter = 0;
            counter += enemiesInRange2.length * 4;
            counter += structuresInRange2.length * 4;
            counter += enemiesInRange3.length;
            counter += structuresInRange3.length;
            if(counter > 10)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        return true;
    },
    handleattacks: function(creep)
    {
        var targets = all[c].pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        var decideMassAttack = this.decideMassAttack(all[c]);
        if(decideMassAttack)
        {
            all[c].rangedMassAttack();
        }
        else if(targets.length > 0)
        {
            all[c].rangedAttack(targets[0]);
        }
    },
    plunderCorridor: function(creep)
    {
        if(creep.body.find(elem => elem.type === "carry") != undefined)
        {
            var resourcesPot = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1,
            {
                filter: (res) =>
                {
                    return (res.resourceType == RESOURCE_METAL || res.resourceType == RESOURCE_SILICON || res.resourceType == RESOURCE_BIOMASS || res.resourceType == RESOURCE_MIST);
                }
            });
            if(resourcesPot.length != 0)
            {
                creep.pickup(resourcesPot[0]);
            }
        }
        if(creep.store.getUsedCapacity() != 0 && creep.ticksToLive < 175)
        {
            creep.memory.memstruct.tasklist = [
                ["forcemoveToRoom", creep.memory.memstruct.spawnRoom],
                ["deposit"]
            ]
        }
        return true;
    },
    checkRuins: function(creep)
    {
        var resourcesPot = creep.room.find(FIND_RUINS,
        {
            filter: (res) =>
            {
                return (res.resourceType != RESOURCE_ENERGY);
            }
        });
        if(resourcesPot.length != 0)
        {
            creepfunctions.summonHauler(creep.room.name, creep.memory.memstruct.spawnRoom);
        }
    },
    run: function(creep)
    {
        this.checkRuins(creep);
        if(creepfunctions.checkglobaltasks(creep) && this.plunderCorridor(creep))
        {
            if(creep.memory.attackrole == "chasedown")
            {
                var whitelist = ["slowmotionghost"]
                var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                if(target == undefined)
                {
                    target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS,
                    {
                        filter:
                        {
                            owner:
                            {
                                username: 'Invader'
                            }
                        }
                    });
                }
                if(target == undefined)
                {
                    target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_INVADER_CORE);
                        }
                    });
                }
                var range = creep.pos.getRangeTo(target);
                if(range == 1)
                {
                    creep.moveTo(target);
                    creep.rangedMassAttack();
                    creep.attack(target);
                }
                else if(range < 4)
                {
                    if(creep.body.find(elem => elem.type === "heal") != undefined && creep.hits < creep.hitsMax)
                    {
                        creep.heal(creep);
                    }
                    creep.moveTo(target);
                    creep.rangedAttack(target);
                }
                else
                {
                    if(creep.body.find(elem => elem.type === "heal") != undefined && creep.hits < creep.hitsMax)
                    {
                        creep.heal(creep);
                    }
                    creep.moveTo(target);
                }
                var range = creep.pos.getRangeTo(target);
                creepfunctions.allowSlave(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "archer")
            {
                var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var targetlist = creep.room.find(FIND_HOSTILE_CREEPS);
                if(targetlist.length == 0)
                {
                    var range = creep.pos.getRangeTo(creep.room.controller);
                    var spawnsNear = creep.pos.findInRange(FIND_MY_STRUCTURES);
                    if(range > 5 && spawnsNear.length != 0)
                    {
                        creep.moveTo(creep.room.controller);
                    }
                }
                creep.say("archerguard");
                var rangedpartsround = false;
                for(var i = 0; i < targetlist.length; i++)
                {
                    for(var j = 0; j < targetlist[i].body.length; j++)
                    {
                        if(targetlist[i].body[j].type == RANGED_ATTACK)
                        {
                            rangedpartsround = true;
                        }
                    }
                }
                creep.say(rangedpartsround);
                if(targetlist.length != 0 && rangedpartsround)
                {
                    creep.say("qq");
                    var ramparts = target.pos.findInRange(FIND_STRUCTURES, 3,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_RAMPART);
                        }
                    });
                    var freeRamparts = [];
                    for(var i = 0; i < ramparts.length; i++)
                    {
                        var psotiontaken = false;
                        var targets2 = ramparts[i].pos.findInRange(FIND_MY_CREEPS, 0);
                        if(targets2.length != 0)
                        {
                            psotiontaken = true
                        }
                        else
                        {
                            freeRamparts.push(ramparts[i]);
                        }
                    }
                    creep.say("hh");
                    var distance = 999999;
                    var index = 9999;
                    for(var i = 0; i < freeRamparts.length; i++)
                    {
                        var range = freeRamparts[i].pos.getRangeTo(target);
                        if(range < distance)
                        {
                            distance = range;
                            index = i;
                            // console.log(distance);
                        }
                    }
                    const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                    var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                    creep.say("fr" + freeRamparts.length);
                    if(freeRamparts.length != 0)
                    {
                        var range = creep.pos.getRangeTo(target);
                        if(range > 1)
                        {
                            creep.moveTo(freeRamparts[index],
                            {
                                visualizePathStyle:
                                {
                                    stroke: '#ffffff'
                                }
                            });
                        }
                    }
                }
                else if(target != undefined && !rangedpartsround)
                { //creep.say("aaa");
                    //   this.ranger(creep);
                }
                var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                var targetscloseby = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                if(targets.length > 0 && targetscloseby < 2)
                {
                    creep.rangedAttack(targets[0]);
                }
                else
                {
                    creep.rangedMassAttack();
                }
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "cavalry")
            {
                var mainflag = Game.flags[creep.room.name];
                var closetarget = mainflag.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var targetlist = creep.room.find(FIND_HOSTILE_CREEPS);
                if(closetarget != undefined)
                {
                    var ramparts = closetarget.pos.findInRange(FIND_STRUCTURES, 2,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_RAMPART);
                        }
                    });
                    var freeRamparts = [];
                    creep.say("rl" + ramparts.length);
                    for(var i = 0; i < ramparts.length; i++)
                    {
                        var psotiontaken = false;
                        var targets3 = ramparts[i].pos.findInRange(FIND_MY_STRUCTURES, 0,
                        {
                            filter: (structure) =>
                            {
                                return (structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_ROAD && structure.structureType != STRUCTURE_CONTAINER);
                            }
                        });
                        var targets2 = ramparts[i].pos.findInRange(FIND_MY_CREEPS, 0); // not itself
                        // console.log(targets2);
                        //  console.log(creep);
                        //  creep.say(targets2 == creep);
                        if(targets2.length != 0 && targets2[0] != creep && targets3.length == 0)
                        {
                            if(targets2[0].memory.attackrole == "ranger" || targets2[0].memory.attackrole == "archer")
                            {
                                freeRamparts.push(ramparts[i]);
                                creep.say("qqq");
                            }
                            else
                            {
                                psotiontaken = true
                                creep.say("tress");
                            }
                        }
                        else
                        {
                            creep.say("frtt");
                            if(targets3.length == 0)
                            {
                                freeRamparts.push(ramparts[i]);
                            }
                        }
                    }
                    //  creep.say("fr"+freeRamparts.length);
                    var distance = 999999;
                    var index = 9999;
                    for(var i = 0; i < freeRamparts.length; i++)
                    {
                        var range = freeRamparts[i].pos.getRangeTo(closetarget);
                        if(range < distance)
                        {
                            distance = range;
                            index = i;
                            //console.log(distance);
                        }
                    }
                    if(freeRamparts.length != 0)
                    {
                        var creepRangeToClosestsFreeRampart = freeRamparts[index].pos.getRangeTo(creep);
                        if(creepRangeToClosestsFreeRampart != 0)
                        {
                            const pathh = creep.pos.findPathTo(freeRamparts[index],
                            {
                                ignoreCreeps: true
                            });
                            creep.moveByPath(pathh);
                            creep.say(pathh.length);
                            var ramparts = new RoomPosition(pathh[0].x, pathh[0].y, creep.room.name).findInRange(FIND_STRUCTURES, 0,
                            {
                                filter: (structure) =>
                                {
                                    return (structure.structureType == STRUCTURE_RAMPART);
                                }
                            });
                            var rampartscurr = creep.pos.findInRange(FIND_STRUCTURES, 0,
                            {
                                filter: (structure) =>
                                {
                                    return (structure.structureType == STRUCTURE_RAMPART);
                                }
                            });
                            var targetsincurrrange = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
                            var closetarget = mainflag.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                            var range = mainflag.pos.getRangeTo(closetarget);
                            creep.say("rp" + ramparts.length);
                            if(ramparts.length == 1)
                            {
                                creep.moveTo(new RoomPosition(pathh[0].x, pathh[0].y, creep.room.name));
                            }
                            if(ramparts.length == 0 && targetsincurrrange.length != 0 && range < 7 && rampartscurr.length != 0)
                            {
                                creep.say("cancelOrder");
                                creep.cancelOrder('move');
                            }
                            var blockingcreeps = new RoomPosition(pathh[0].x, pathh[0].y, creep.room.name).findInRange(FIND_MY_CREEPS, 0);
                            if(blockingcreeps.length != 0)
                            {
                                var blockingCreeps = creep.pos.findInRange(FIND_MY_CREEPS, 1);
                                for(var ii = 0; ii < blockingCreeps.length; ii++)
                                {
                                    blockingCreeps[ii].moveTo(creep);
                                }
                                creep.moveByPath(pathh);
                            }
                        }
                    }
                    var targetsincurrrange = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                    if(targetsincurrrange.length != 0)
                    {
                        creep.attack(closetarget);
                    }
                }
                if(creep.room.name != creep.memory.memstruct.spawnRoom)
                {
                    var targetRoomFlag = Game.flags[creep.memory.memstruct.spawnRoom];
                    var pos1 = creep.pos;
                    var pos2 = targetRoomFlag.pos;
                    var range = creep.pos.getRangeTo(targetRoomFlag.pos);
                    if(range > 23)
                    { // might cause bug on nxt room wall 
                        creep.moveTo(targetRoomFlag.pos);
                    }
                }
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "mineguard")
            {
                this.MineGuard(creep);
            }
            else
            {
                attackerCode.run(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    },
    ranger: function(creep)
    {
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS,
        {
            filter: (c) =>
            {
                return (c.pos.x > 2 && c.pos.x < 48 && c.pos.y < 48 && c.pos.y > 2);
            }
        });
        if(target != undefined)
        {
            var range = creep.pos.getRangeTo(target);
            if(range < 4)
            {
                creep.rangedAttack(target);
            }
            if(range > 3)
            {
                creep.moveTo(target,
                {
                    reusePath: 10
                });
            }
            if(range < 3)
            {
                const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                creepfunctions.combatMove(creep, targetArr, target);
            }
        }
        else
        {
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
            {
                filter: (res) =>
                {
                    return (res.structureType != STRUCTURE_CONTAINER);
                }
            });
            if(target != undefined)
            {
                var range = creep.pos.getRangeTo(target);
                if(range < 4)
                {
                    creep.rangedAttack(target);
                }
                if(range > 3)
                {
                    creep.moveTo(target,
                    {
                        reusePath: 10
                    });
                }
            }
        }
        creep.heal(creep);
    },
    getParts: function(creep)
    {
        var target = creep.room.find(FIND_HOSTILE_CREEPS);
        var numberofguardingcreeps = _.filter(creepsinroom, (creep) => creep.memory.role == 'guard');
        var numberOfHealParts = 0;
        var numberOfAttackParts = 0;
        var numberOfRangedParts = 0;
        var totalBodyParts = 0;
        var numberOfworkParts = 0;
        for(var i = 0; i < target.length; i++)
        {
            for(var j = 0; j < target[i].body.length; j++)
            {
                if(target[i].body[j].type == HEAL)
                {
                    numberOfHealParts++;
                }
                if(target[i].body[j].type == ATTACK)
                {
                    numberOfAttackParts++;
                }
                if(target[i].body[j].type == RANGED_ATTACK)
                {
                    numberOfRangedParts++;
                }
                if(target[i].body[j].type == WORK)
                {
                    numberOfworkParts++;
                }
                totalBodyParts++;
            }
        }
    },
    MineGuard: function(creep)
    {
        creep.say("mine");
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target)
        {
            if(creep.attack(target) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target);
            }
        }
        else
        {
            var targetst = creep.room.find(FIND_HOSTILE_STRUCTURES);
            if(targetst.length > 0)
            {
                if(creep.attack(targetst[0]) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targetst[0]);
                }
            }
        }
    }
};
module.exports = roleguard;