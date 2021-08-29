var creepfunctions = require('prototype.creepfunctions');
var powercreepManager = {
    loopTasks: function(creep)
    {
        //     console.log(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0]);
        if(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0] == "repeat")
        {
            //   creep.say(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0]);
            if(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][1] + 1 == creep.memory.memstruct.tasklist.length)
            {
                var tmpstore = creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1]
                var back = creep.memory.memstruct.tasklist.splice(0, 1);
                creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1] = back[0];
                creep.memory.memstruct.tasklist.push(tmpstore);
            }
            else
            {
                creep.memory.memstruct.tasklist.splice(0, 1);
            }
        }
        else
        {
            creep.memory.memstruct.tasklist.splice(0, 1);
        }
    },
    allowSlave: function(creep)
    {
        try
        {
            if(creep.memory.duoId != undefined)
            {
                var slave = Game.getObjectById(creep.memory.duoId);
                const range = creep.pos.getRangeTo(slave);
                var counter = 1;
                if(slave.pos.x == 50 || slave.pos.x == 0 || slave.pos.y == 50 || slave.pos.y == 0)
                {
                    counter = 3;
                }
                if(range > counter && creep.room.name == slave.room.name && Game.time % 3 ==0)
                {
                    creep.say("come");
                    creep.moveTo(slave);
                }
            }
             
        }
        catch (e)
        {}
    },
    checkPowerCreepTasks: function(powerCreep)
    {
        creep = powerCreep;
        if(creep.memory.memstruct.tasklist.length == 0)
        {
            return true;
        }
        else
        if(creep.memory.memstruct.tasklist[0] != undefined)
        {
            if(creep.memory.memstruct.tasklist[0][0] == "moveToRoom")
            {
                var targposition = new RoomPosition(25, 25, creep.memory.memstruct.tasklist[0][1]);
                var pos1 = creep.pos;
                var pos2 = targposition;
                const range = creep.pos.getRangeTo(targposition);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creep.moveTo(targposition);
                    Game.map.visual.line(creep.pos, targposition,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                    var targets = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    var range2 = creep.pos.getRangeTo(targets);
                    if(range2 <= 5)
                    {
                        const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                        target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                        //     this.combatMove(creep, targetArr, target);
                    }
                }
                else
                {
                    this.loopTasks(creep);
                }
                this.allowSlave(creep);
            }
            if(creep.memory.memstruct.tasklist[0][0] == "attackRoom")
            {
             
                /////////////////////////////////////////////////
                if(creep.memory.duoId != undefined)
                {
                    var slave = Game.getObjectById(creep.memory.duoId);
                    if(slave != undefined)
                    {
                        if(creep.store.getFreeCapacity() > 10)
                        {
                           // creep.withdraw("ops", slave, 10);
                        }
                    }
                }
                else
                {
                    creep.say("spawning");
                    Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(
                        [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL], 'powerspawnSupport',
                        {
                            memory:
                            {
                                role: 'multi',
                                memstruct:
                                {
                                    spawnRoom: creep.memory.memstruct.spawnRoom,
                                    tasklist: [
                                        ["boosAllMax"],
                                        ["withdraw", "terminal", "ops"], //["withdraw", strg.id, "energy", moveAmount]);
                                        ["findMaster", creep.id]
                                    ],
                                    objectIDStorage: "",
                                    boosted: false,
                                    moveToRenew: false,
                                    opportuniticRenew: false,
                                    hastask: false
                                }
                            }
                        });
                }
                //////////////////////////////////////////////////
            
                if(powerCreep.ticksToLive < 800)
                {
                    // go home and renew
                    if(creep.room.name != creep.memory.memstruct.spawnRoom)
                    {
                        creep.moveTo(new RoomPosition(25, 25, creep.memory.memstruct.spawnRoom));
                    }
                    else
                    {
                        var myPowerspawn = powerCreep.room.find(FIND_MY_STRUCTURES,
                        {
                            filter: (structure) =>
                            {
                                return (structure.structureType == STRUCTURE_POWER_SPAWN);
                            }
                        });
                        creep.moveTo(myPowerspawn[0]);
                        var range = powerCreep.pos.getRangeTo(myPowerspawn[0]);
                        if(range < 2)
                        {
                            powerCreep.renew(myPowerspawn[0]);
                        }
                    }
                }
                if(creep.memory.memstruct.spawnRoom == creep.room.name && creep.store.getUsedCapacity(RESOURCE_OPS) < 2500 && powerCreep.ticksToLive > 800)
                {
                   
                    powerCreep.moveTo(creep.room.storage);
                     powerCreep.withdraw(powerCreep.room.storage, RESOURCE_OPS);
                
                }
                else if(powerCreep.ticksToLive > 800 && creep.memory.memstruct.tasklist[0][1] == creep.room.name)
                {
                    creep.say("r");
                        if(powerCreep.powers[PWR_SHIELD] != undefined)
                    {
                        if(1 == 1)
                        {
                            powerCreep.usePower(PWR_SHIELD);
                        }
                    }
                    if(powerCreep.powers[PWR_DISRUPT_TERMINAL] != undefined)
                    {
                        var enemyTerminal = powerCreep.room.find(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (structure) =>
                            {
                                return (structure.structureType == STRUCTURE_TERMINAL);
                            }
                        });
                        if(enemyTerminal.length != 0)
                        {
                            var range = powerCreep.pos.getRangeTo(enemyTerminal);
                            if(range < 20)
                            {
                                powerCreep.moveTo(enemyTerminal[0]);
                            }
                            else
                            {
                                var enemyLogisticCreeps = enemyTerminal[0].pos.findInRange(FIND_HOSTILE_CREEPS, 2);
                                if(enemyLogisticCreeps.length != 0  ) //cooldown
                                {
                                    powerCreep.usePower(PWR_DISRUPT_TERMINAL, enemyTerminal[0]);
                                }
                            }
                        }
                    }
                    if(powerCreep.powers[PWR_DISRUPT_TOWER] != undefined && 1==2)
                    {
                        var enTowers = powerCreep.room.find(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (structure) =>
                            {
                                return (structure.structureType == STRUCTURE_TOWER);
                            }
                        });
                        if(enTowers.length != 0)
                        {
                            var range = powerCreep.pos.getRangeTo(enTowers[0]);
                            if(range < 20)
                            {
                                powerCreep.moveTo(enTowers[0]);
                            }
                            else
                            {
                                var enemyLogisticCreeps = enTowers[0].pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                                if(enemyLogisticCreeps.length != 0 && Game.time % 5 ==0) //cooldown
                                {
                                    powerCreep.usePower(PWR_DISRUPT_TOWER, enTowers[0]);
                                }
                            }
                        }
                    }
                    if(powerCreep.powers[PWR_DISRUPT_SPAWN] != undefined && 1==2)
                    {
                        var enSPAWNS = powerCreep.room.find(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (structure) =>
                            {
                                return (structure.structureType == STRUCTURE_SPAWN);
                            }
                        });
                        if(enSPAWNS.length != 0)
                        {
                            var range = powerCreep.pos.getRangeTo(enSPAWNS[0]);
                            if(range < 20)
                            {
                                powerCreep.moveTo(enSPAWNS[0]);
                            }
                            else
                            {
                                var enemyLogisticCreeps = enSPAWNS[0].pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                                if(enemyLogisticCreeps.length != 0 && 1 == 2) //cooldown
                                {
                                    powerCreep.usePower(PWR_DISRUPT_SPAWN, enSPAWNS[0]);
                                }
                            }
                        }
                    }
                 
                }
                else if(powerCreep.ticksToLive > 800 && creep.memory.memstruct.tasklist[0][0] != creep.room.name)
                {
                   // creep.moveTo(new RoomPosition(25, 25, creep.memory.memstruct.tasklist[0][1]));
                }
                this.allowSlave(powerCreep);
            }
        }
    },
    run: function(powerCreep)
    {
        var r;
        if(powerCreep.memory.memstruct == undefined)
        {
            powerCreep.memory.memstruct = {
                spawnRoom: "E24N3",
                tasklist: [],
                objectIDStorage: "",
                boosted: false,
                moveToRenew: false,
                opportuniticRenew: true,
                hastask: false,
                full: false,
                wantsToJoinSquad: false,
                isInSquad: false,
                SquadID: "0",
                SquadRole: false
            };
        }
        // for the ops gens move to some position and gen ops and transfer them into storage.
        // spawn only in a stronhold.
        //   console.log(powerCreep.spawnCooldownTime );
        if(powerCreep.room == undefined) // creep is not in the world
        {
            if(!(powerCreep.spawnCooldownTime > Date.now()) && powerCreep.name == "eco1" || powerCreep.name == "attacker1")
            {
                var pwrspawn = Game.rooms["E24N3"].find(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_POWER_SPAWN);
                    }
                });
                //     console.log(powerCreep.spawn(pwrspawn[0]));
                if(pwrspawn.length != 0)
                {
                    powerCreep.spawn(pwrspawn[0]);
                }
            }
            if(!(powerCreep.spawnCooldownTime > Date.now()) && (powerCreep.name == "eco2"))
            {
                powerCreep.memory.memstruct.spawnRoom = "E28N5";
                var pwrspawn = Game.rooms["E28N5"].find(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_POWER_SPAWN);
                    }
                });
                //     console.log(powerCreep.spawn(pwrspawn[0]));
                if(pwrspawn.length != 0)
                {
                    powerCreep.spawn(pwrspawn[0]);
                }
            }
        }
        else // creep is in the world
        {
            var check = this.checkPowerCreepTasks(powerCreep);
            powerCreep.say(check);
            if(check)
            {
                
                if(powerCreep.room.controller.isPowerEnabled == false)
                {
                    if(powerCreep.enableRoom(powerCreep.room.controller) == -9)
                    {
                        powerCreep.moveTo(powerCreep.room.controller,
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ff0000'
                            }
                        });
                    }
                }
                else
                {
                    var powerList = powerCreep.powers;
                    var powerkeys = Object.keys(powerList);
                    var powervalues = Object.values(powerList);
                    var creepid = powerCreep.name.substring(0, 6);
                        this.roomManager(powerCreep); // add limiters on when it should run check defcon and game time to operate only when needed
                    
                }
            }
        }
    },
   
    roomManager: function(powerCreep)
    {
        ////////////////////////////////////gen ops//////////////////////////////////////////////////////////////////////////////////////////
        if(Game.time % 50 == 0)
        {
            powerCreep.usePower(PWR_GENERATE_OPS);
        }
        ////////////////////////////////////store ops//////////////////////////////////////////////////////////////////////////////////////////
        if(powerCreep.store.getFreeCapacity() < 5) // creep is full
        {
            var range = powerCreep.pos.getRangeTo(powerCreep.room.storage);
            if(range > 1)
            {
                powerCreep.moveTo(powerCreep.room.storage,
                {
                    visualizePathStyle:
                    {
                        stroke: '#ff0000'
                    }
                });
            }
            else
            {
                powerCreep.transfer(powerCreep.room.storage, RESOURCE_OPS, powerCreep.store.getUsedCapacity("ops"));
            }
        }
        else
        {
            var mainflag = Game.flags[powerCreep.room.name];
            var range = powerCreep.pos.getRangeTo(new RoomPosition(mainflag.pos.x + 7, mainflag.pos.y + 7, mainflag.room.name));
            if(range > 2)
            {
                powerCreep.moveTo(new RoomPosition(mainflag.pos.x + 7, mainflag.pos.y + 7, mainflag.room.name),
                {
                    visualizePathStyle:
                    {
                        stroke: '#ff0000'
                    }
                });
            }
        }
        /////////////////////////////////renew //////////////////////////////////////////////////////////////////////////////////////////////
        var pwrspawn = powerCreep.room.find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_POWER_SPAWN);
            }
        })[0];
        var range = powerCreep.pos.getRangeTo(pwrspawn);
        if(range < 2)
        {
            powerCreep.renew(pwrspawn);
        }
        if(powerCreep.ticksToLive < 500)
        {
            powerCreep.moveTo(pwrspawn,
            {
                visualizePathStyle:
                {
                    stroke: '#ff0000'
                },
                reusePath: 50
            });
        }
        if(powerCreep.ticksToLive > 500)
        {
            ////////////////////////////////////  PWR_OPERATE_FACTORY//////////////////////////////////////////////////////////////////////////////////////////
            if(powerCreep.powers[PWR_OPERATE_FACTORY] != undefined)
            {
                if(powerCreep.store.getUsedCapacity("ops") > 110) // creep is full
                {
                    var FACTORY = powerCreep.room.find(FIND_MY_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_FACTORY);
                        }
                    })[0];
                    if(FACTORY.effects == undefined || FACTORY.effects.length == 0) ///////////////////////////////////////////////
                    {
                        powerCreep.moveTo(FACTORY,
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ff0000'
                            }
                        });
                        powerCreep.usePower(PWR_OPERATE_FACTORY, FACTORY);
                    }
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
            if(powerCreep.powers[PWR_REGEN_SOURCE] != undefined)
            {
                powerCreep.say("REGEN_SOURCE");
                var target = powerCreep.room.find(FIND_SOURCES);
                var boolchecker = false;
                powerCreep.say(target[0].effects.length);
                if(target[0].effects.length != 0)
                {
                    if(target[0].effects.length == 1)
                    { // source has an effect on it
                        if(target[0].effects[0].ticksRemaining < 20 || target[0].effects.length == 0)
                        {
                            powerCreep.moveTo(target[0],
                            {
                                visualizePathStyle:
                                {
                                    stroke: '#ff0000'
                                }
                            });
                            boolchecker = true;
                        }
                    }
                }
                else if(target[0].effects.length == 0)
                {
                    powerCreep.moveTo(target[0],
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ff0000'
                        }
                    });
                }
                if(target[1].effects.length != 0 && !boolchecker)
                {
                    if(target[1].effects.length == 1)
                    { // source has an effect on it
                        if(target[1].effects[0].ticksRemaining < 20 || target[1].effects.length == 0)
                        {
                            powerCreep.moveTo(target[1],
                            {
                                visualizePathStyle:
                                {
                                    stroke: '#ff0000'
                                }
                            });
                        }
                    }
                }
                else if(target[1].effects.length == 0)
                {
                    powerCreep.moveTo(target[1],
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ff0000'
                        }
                    });
                }
                ////////////////   
                var targets = powerCreep.pos.findInRange(FIND_SOURCES, 3);
                if(targets.length != 0)
                {
                    powerCreep.usePower(PWR_REGEN_SOURCE, targets[0]);
                }
            }
            ////////////////////////////////////stock with energy//////////////////////////////////////////////////////////////////////////////////////////
            if(powerCreep.powers[PWR_OPERATE_EXTENSION] != undefined && powerCreep.powers[PWR_OPERATE_EXTENSION].cooldown < 5)
            {
                powerCreep.say("PWR_EXTENSION");
                var strongroom = powerCreep.room;
                if(strongroom.energyAvailable * 1.15 < strongroom.energyCapacityAvailable)
                { // add cooldown check and storage full check else termianl
                    if(strongroom.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 15000)
                    {
                        var range = powerCreep.pos.getRangeTo(strongroom.storage);
                        if(range <= 3)
                        {
                            powerCreep.usePower(PWR_OPERATE_EXTENSION, strongroom.storage);
                        }
                        else
                        {
                            powerCreep.moveTo(strongroom.storage,
                            {
                                visualizePathStyle:
                                {
                                    stroke: '#ff0000'
                                }
                            });
                        }
                    }
                    else if(strongroom.terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 15000)
                    {
                        var range = powerCreep.pos.getRangeTo(strongroom.terminal);
                        if(range <= 3)
                        {
                            powerCreep.usePower(PWR_OPERATE_EXTENSION, strongroom.terminal);
                        }
                        else
                        {
                            powerCreep.moveTo(strongroom.terminal,
                            {
                                visualizePathStyle:
                                {
                                    stroke: '#ff0000'
                                }
                            });
                        }
                    }
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
            if(powerCreep.powers[PWR_REGEN_MINERAL] != undefined)
            {
                powerCreep.say("PWR_MINERAL");
                powerCreep.say("ee");
                var target = powerCreep.room.find(FIND_MINERALS);
                var boolchecker = false;
                powerCreep.say(target[0].effects);
                var extractorneeded;
                var minerals = powerCreep.room.find(FIND_MINERALS)[0].mineralAmount;
                if(minerals > 0)
                {
                    extractorneeded = true;
                }
                if(extractorneeded)
                {
                    if(target[0].effects == undefined)
                    {
                        powerCreep.say("dee");
                        powerCreep.moveTo(target[0],
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ff0000'
                            }
                        });
                    }
                    else if(target[0].effects.length != 0)
                    {
                        powerCreep.say("dfee");
                        if(target[0].effects.length == 1)
                        {
                            if(target[0].effects[0].ticksRemaining < 20 || target[0].effects.length == 0)
                            {
                                powerCreep.moveTo(target[0],
                                {
                                    visualizePathStyle:
                                    {
                                        stroke: '#ff0000'
                                    }
                                });
                                boolchecker = true;
                            }
                        }
                    }
                    else if(target[0].effects.length == 0 || target[0].effects == undefined)
                    {
                        powerCreep.say("dee");
                        powerCreep.moveTo(target[0],
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ff0000'
                            }
                        });
                    }
                    ////////////////   
                    var targets = powerCreep.pos.findInRange(FIND_MINERALS, 3);
                    if(targets.length != 0)
                    {
                        powerCreep.usePower(PWR_REGEN_MINERAL, targets[0]);
                    }
                }
            }
            //////////////////////////////////// operate power//////////////////////////////////////////////////////////////////////////////////////////
            if(powerCreep.powers[PWR_OPERATE_POWER] != undefined && powerCreep.powers[PWR_OPERATE_POWER].cooldown < 15)
            {
                powerCreep.say("PWR_POWER");
                if(powerCreep.store.getUsedCapacity("ops") > 510) // creep is full
                {
                    var pwrspawn = powerCreep.room.find(FIND_MY_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_POWER_SPAWN);
                        }
                    })[0];
                    if(pwrspawn.effects == undefined || pwrspawn.effects.length == 0)
                    {
                        powerCreep.moveTo(pwrspawn,
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ff0000'
                            }
                        });
                        powerCreep.usePower(PWR_OPERATE_POWER, pwrspawn);
                    }
                }
                else if(powerCreep.store.getUsedCapacity("ops") < 210 && powerCreep.room.storage.store.getUsedCapacity("ops") > 5000)
                {
                    if(powerCreep.withdraw(powerCreep.room.storage, RESOURCE_OPS, powerCreep.store.getFreeCapacity() / 2) == ERR_NOT_IN_RANGE)
                    {
                        powerCreep.moveTo(powerCreep.room.storage);
                        powerCreep.say("wit storage");
                    }
                }
            }
            /////////////////////////////////////////////////
            if(powerCreep.powers[PWR_OPERATE_SPAWN] != undefined && powerCreep.powers[PWR_OPERATE_SPAWN].cooldown < 15)
            {
                powerCreep.say("PWR_SPAWN");
                if(powerCreep.store.getUsedCapacity("ops") > 310) // creep is full
                {
                    var Spawns = Game.spawns[powerCreep.room.name];
                    if(Spawns != undefined && Spawns.effects == undefined || Spawns.effects.length == 0 && Spawns.spawning) ///////////////////////////////////////////////
                    {
                        powerCreep.moveTo(Spawns,
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ff0000'
                            }
                        });
                        powerCreep.usePower(PWR_OPERATE_SPAWN, Spawns);
                    }
                    var Spawns = Game.spawns[powerCreep.room.name + "1"];
                    if(Spawns != undefined && Spawns.effects == undefined || Spawns.effects.length == 0 && Spawns.spawning) ///////////////////////////////////////////////
                    {
                        powerCreep.moveTo(Spawns,
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ff0000'
                            }
                        });
                        powerCreep.usePower(PWR_OPERATE_SPAWN, Spawns);
                    }
                    var Spawns = Game.spawns[powerCreep.room.name + "2"];
                    if(Spawns != undefined && Spawns.effects == undefined || Spawns.effects.length == 0 && Spawns.spawning) ///////////////////////////////////////////////
                    {
                        powerCreep.moveTo(Spawns,
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ff0000'
                            }
                        });
                        powerCreep.usePower(PWR_OPERATE_SPAWN, Spawns);
                    }
                }
                else if(powerCreep.store.getUsedCapacity("ops") < 210 && powerCreep.room.storage.store.getUsedCapacity("ops") > 5000) // todo add in capacity check
                {
                    if(powerCreep.withdraw(powerCreep.room.storage, RESOURCE_OPS, powerCreep.store.getFreeCapacity() / 2) == ERR_NOT_IN_RANGE)
                    {
                        powerCreep.moveTo(powerCreep.room.storage);
                        powerCreep.say("wit storage");
                    }
                }
            }
        }
    },
}
module.exports = powercreepManager;