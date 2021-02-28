var creepfunctions = require('prototype.creepfunctions');
var roleguard = {
    /** @param {Creep} creep **/
    run: function(creep)
    {
        if(creepfunctions.checkglobaltasks(creep))
        {
            if(creep.memory.attackrole == "archer")
            {
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var targetlist = creep.room.find(FIND_HOSTILE_CREEPS);
                var rangedpartsround = false;
                for(var i = 0; i < targetlist.length; i++)
                {
                    for(var j = 0; j < targetlist.length; j++)
                    {
                        if(targetlist[i].body[j].type == RANGED_ATTACK)
                        {
                            rangedpartsround = true;
                        }
                    }
                }
                if(target != undefined)
                {
                    var ramparts = target.pos.findInRange(FIND_STRUCTURES, 5,
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
                    creep.say(distance);
                    const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                    var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                    var targetsformove = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
                    var targets3 = creep.pos.findInRange(FIND_STRUCTURES, 0,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_RAMPART);
                        }
                    });
                    if(freeRamparts.length != 0)
                    {
                        if(targets3.length == 0 || targetsformove.length == 0)
                        { // need to move to closest rampart this stops when in range 
                            creep.moveTo(freeRamparts[index].pos);
                        }
                    }
                    var targetsclose = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                    if(targetsclose.length > 0)
                    {
                        creep.attack(targets[0]);
                    }
                    var targetscloseby = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                    try
                    {
                        if(targets.length > 0 && targetscloseby < 2)
                        {
                            creep.rangedAttack(targets[0]);
                        }
                        else
                        {
                            creep.rangedMassAttack();
                        }
                    }
                    catch (e)
                    {
                        creep.say("attack");
                        this.attacker(creep);
                    }
                }
                if(rangedpartsround == false || freeRamparts.length == 0)
                { // add a distance from main flag
                    //    creep.say("im a ranger baby");
                    //    this.ranger(creep);
                }
                if(creep.room.name != creep.memory.memstruct.spawnRoom)
                {
                    var targetRoomFlag = Game.flags[creep.memory.memstruct.spawnRoom];
                    var pos1 = creep.pos;
                    var pos2 = targetRoomFlag.pos;
                    const range = creep.pos.getRangeTo(targetRoomFlag.pos);
                    if(range > 23)
                    { // might cause bug on nxt room wall 
                        creep.moveTo(targetRoomFlag.pos);
                    }
                }
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "cavalry")
            {
                //  creep.say("f.length");
                // console.log("d");
                const closetarget = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
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
                    for(var i = 0; i < ramparts.length; i++)
                    {
                        var psotiontaken = false;
                        var targets2 = ramparts[i].pos.findInRange(FIND_MY_CREEPS, 0); // not itself
                        // console.log(targets2);
                        //  console.log(creep);
                        //  creep.say(targets2 == creep);
                        if(targets2.length != 0 && targets2 != creep)
                        {
                            psotiontaken = true
                        }
                        else
                        {
                            freeRamparts.push(ramparts[i]);
                        }
                    }
                    creep.say(freeRamparts.length);
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
                        var targetsincurrrange = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                        var targetsformove = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 2);
                        var creepRangeToClosestsFreeRampart = freeRamparts[index].pos.getRangeTo(creep);
                        if(targetsformove.length == 0 || creep.hits < creep.hitsMax)
                        { // need to move to closest rampart this stops when in range 
                            creep.moveTo(freeRamparts[index].pos);
                        }
                        if(creep.hits == creep.hitsMax && creepRangeToClosestsFreeRampart < 1)
                        {
                            creep.moveTo(closetarget);
                        }
                        else
                        {
                            creep.say("else");
                        }
                        if(targetsincurrrange != undefined)
                        {
                            creep.attack(targetsincurrrange[0]);
                        }
                    }
                }
                if(creep.room.name != creep.memory.memstruct.spawnRoom)
                {
                    var targetRoomFlag = Game.flags[creep.memory.memstruct.spawnRoom];
                    var pos1 = creep.pos;
                    var pos2 = targetRoomFlag.pos;
                    const range = creep.pos.getRangeTo(targetRoomFlag.pos);
                    if(range > 23)
                    { // might cause bug on nxt room wall 
                        creep.moveTo(targetRoomFlag.pos);
                    }
                }
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "attacker")
            {
                this.attacker(creep);
                this.allowSlave(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "ranger")
            {
                this.ranger(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "mineguard")
            {
                this.MineGuard(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "chasedown")
            {
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(target)
                {
                    const range = creep.pos.getRangeTo(target);
                    if(range < 2)
                    {
                        creep.attack(target);
                        creep.moveTo(target);
                        creep.rangedAttack(target);
                    }
                    else
                    {
                        var a = creep.heal(creep);
                        creep.moveTo(target);
                        creep.rangedAttack(target);
                    }
                }
                if(creep.room.controller == undefined)
                {
                    const depo = creep.pos.findClosestByRange(FIND_DEPOSITS);
                    if(depo)
                    {
                        var bgodyparts = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
                        Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(bgodyparts, 'coridor miner' + creep.room.name,
                        {
                            memory:
                            {
                                role: 'multi',
                                memstruct:
                                {
                                    spawnRoom: creep.memory.memstruct.spawnRoom,
                                    tasklist: [
                                        ["moveToRoom", creep.room.name],
                                        ["mineCoridor"],
                                        ["moveToRoom", creep.memory.memstruct.spawnRoom],
                                        ["deposit"],
                                        ["repeat", 4]
                                    ],
                                    objectIDStorage: "",
                                    boosted: false,
                                    moveToRenew: false,
                                    opportuniticRenew: true,
                                    hastask: false
                                }
                            }
                        });
                    }
                }
                this.allowSlave(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "healer")
            {
                const target = creep.pos.findClosestByRange(FIND_MY_CREEPS,
                {
                    filter: function(object)
                    {
                        return object.hits < object.hitsMax;
                    }
                });
                if(target)
                {
                    creep.moveTo(target);
                    if(creep.pos.isNearTo(target))
                    {
                        creep.heal(target);
                    }
                    else
                    {
                        creep.rangedHeal(target);
                    }
                }
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "roomAbuser")
            {
                var targetsinsquare = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (s) =>
                    {
                        return (s.structureType == STRUCTURE_SPAWN);
                    }
                }, 4);
                var targets = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (s) =>
                    {
                        return (s.structureType == STRUCTURE_SPAWN);
                    }
                }, 3);
                var targetst = creep.room.find(FIND_HOSTILE_STRUCTURES);
                if(targets.length > 0)
                {
                    creep.say("attack");
                    //creep.rangedAttack(targets[0]);
                }
                if(targetst.length != 0 && creep.hits == creep.hitsMax)
                {
                    creep.say("position 1");
                    creep.moveTo(new RoomPosition(48, 25, creep.room.name));
                }
                if(creep.hits != creep.hitsMax)
                {
                    if(targetst.length == 0)
                    {
                        creep.say("heal");
                        creep.moveTo(Game.flags["roomAbusePoint"].pos);
                    }
                    else
                    {
                        creep.say("back");
                        creep.moveTo(new RoomPosition(49, 25, creep.room.name));
                    }
                }
                else if(creep.hits == creep.hitsMax && targetst.length == 0)
                {
                    creep.moveTo(new RoomPosition(0, 25, creep.room.name));
                }
                //  creep.rangedMassAttack();
                creep.say(targets.length);
                if(targets.length > 0)
                {
                    creep.say("attack");
                    creep.rangedAttack(targets[0]);
                }
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "rangerhealer")
            {
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                const targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                if(targets.length > 0)
                {
                    creep.rangedAttack(targets[0]);
                }
                if(creep.hits < creep.hitsMax)
                {
                    creep.heal(creep);
                }
                const range = creep.pos.getRangeTo(target);
                if(range > 2 && creep.hits + 300 > creep.hitsMax)
                {
                    creep.moveTo(target);
                }
                if(range < 3 || (creep.hits + 300 < creep.hitsMax && range < 5))
                {
                    creepfunctions.combatMove(creep, targetArr, target);
                }
                if(creep.room.name != creep.memory.memstruct.spawnRoom)
                {
                    var targetRoomFlag = Game.flags[creep.memory.memstruct.spawnRoom];
                    var pos1 = creep.pos;
                    var pos2 = targetRoomFlag.pos;
                    const range = creep.pos.getRangeTo(targetRoomFlag.pos);
                    if(range > 23)
                    { // might cause bug on nxt room wall 
                        creep.moveTo(targetRoomFlag.pos);
                    }
                }
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "basicRoomAttacker")
            {
                creep.heal(creep);
                var found = [];
                var flagsinrange = creep.pos.findInRange(FIND_FLAGS, 3);
                if(flagsinrange.length != 0)
                {
                    found = creep.room.lookForAt(LOOK_STRUCTURES, flagsinrange[0].pos);
                    if(found.length != 0)
                    {
                        found = creep.room.lookForAt(FIND_HOSTILE_STRUCTURES, flagsinrange[0].pos);
                    }
                }
                if(found.length != 0)
                {
                    creep.say(found);
                    creep.rangedAttack(found[0]);
                }
                else
                {
                    creep.rangedMassAttack();
                }
                const target = creep.pos.findClosestByRange(FIND_STRUCTURES,
                {
                    filter: (res) =>
                    {
                        return (res.structureType != STRUCTURE_SPAWN) && res.isActive();
                    }
                });
                var targetPos;
                if(target != undefined)
                {
                    targetPos = target.pos;
                }
                let path = creep.room.findPath(creep.pos, targetPos,
                {
                    maxOps: 200
                });
                if(targetPos != undefined && target != undefined)
                {
                    if(!path.length || !targetPos.isEqualTo(path[path.length - 1]))
                    {
                        creep.say("?");
                        path = creep.room.findPath(creep.pos, targetPos,
                        {
                            maxOps: 1000,
                            ignoreDestructibleStructures: true,
                            ignoreCreeps: true
                        });
                    }
                    if(path.length)
                    {
                        creep.move(path[0].direction);
                    }
                    let patha = creep.room.findPath(creep.pos, targetPos,
                    {
                        maxOps: 200
                    });
                    if(patha.length > 2)
                    {
                        creep.move(patha[0].direction);
                    }
                }
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    },
    ranger: function(creep)
    {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
        const targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        if(targets.length > 0)
        {
            creep.rangedAttack(targets[0]);
        }
        const range = creep.pos.getRangeTo(target);
        if(range > 2)
        {
            creep.moveTo(target);
        }
        if(range < 3)
        {
            creepfunctions.combatMove(creep, targetArr, target);
        }
        try
        {
            creep.heal(creep);
        }
        catch (e)
        {}
    },
    attacker: function(creep)
    {
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
            var targetst = creep.room.find(FIND_HOSTILE_STRUCTURES,
            {
                filter: (s) =>
                {
                    return (s.structureType == STRUCTURE_SPAWN);
                }
            });
            if(targetst.length > 0)
            {
                if(creep.attack(targetst[0]) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targetst[0]);
                }
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
            const depo = creep.pos.findClosestByRange(FIND_DEPOSITS);
            if(depo)
            {
                var bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE,MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY];
                Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(bgodyparts, 'coridor miner' + creep.room.name,
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: creep.memory.memstruct.spawnRoom,
                            tasklist: [
                                ["moveToRoom", creep.room.name],
                                ["mineCoridor"],
                                ["moveToRoom", creep.memory.memstruct.spawnRoom],
                                ["deposit"],
                                ["repeat", 4]
                            ],
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: true,
                            hastask: false
                        }
                    }
                });
            }
            var targetst = creep.room.find(FIND_HOSTILE_STRUCTURES);
            if(targetst.length > 0)
            {
                if(creep.attack(targetst[0]) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targetst[0]);
                }
            }
        }
    },
    allowSlave: function(creep)
    {
        if(creep.memory.duoId != undefined)
        {
            var slave = Game.getObjectById(creep.memory.duoId);
            const range = creep.pos.getRangeTo(slave);
            var counter = 1;
            if(slave.pos.x == 50 || slave.pos.x == 0 || slave.pos.y == 50 || slave.pos.y == 0)
            {
                counter = 2;
            }
            if(range > counter && creep.room.name == slave.room.name)
            {
                creep.say("come");
                creep.moveTo(slave);
            }
        }
    }
};
module.exports = roleguard;