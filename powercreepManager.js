var squadmanage = require('squadManager');
var creepfunctions = require('prototype.creepfunctions');
var powercreepManager = {
    checkShield: function(creep)
    {
        //creep.say("PWR_SHIELD");
        if (creep.powers[PWR_SHIELD] != undefined && creep.powers[PWR_SHIELD].cooldown == 0)
        {
            creep.usePower(PWR_SHIELD);
        }
    },
    checkForcorpses: function(creep)
    {
        var droppedresources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1,
        {
            filter: (res) =>
            {
                return (res.resourceType == RESOURCE_OPS);
            }
        });
        if (droppedresources.length != 0)
        {
            creep.pickup(droppedresources[0]);
        }

    },
    loopTasks: function(creep)
    {
        //     console.log(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0]);
        if (creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0] == "repeat")
        {
            //   creep.say(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0]);
            if (creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][1] + 1 == creep.memory.memstruct.tasklist.length)
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
            if (creep.memory.duoId != undefined)
            {
                var slave = Game.getObjectById(creep.memory.duoId);
                if (slave)
                {
                    var targets = slave.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                    if (targets.length > 0)
                    {
                        slave.rangedAttack(targets[0]);
                    }

                    const range = creep.pos.getRangeTo(slave);
                    var counter = 1;
                    if (slave.pos.x == 50 || slave.pos.x == 0 || slave.pos.y == 50 || slave.pos.y == 0)
                    {
                        counter = 3;
                    }
                    if (range > counter && creep.room.name == slave.room.name && Game.time % 3 == 0)
                    {
                        creep.say("come");
                        creep.moveTo(slave);
                    }
                }
            }
        }
        catch (e)
        {}
    },
    checkPowerCreepTasks: function(powerCreep)
    {
        creep = powerCreep;
        if (creep.memory.memstruct.tasklist.length == 0)
        {
            return true;
        }
        else
        if (creep.memory.memstruct.tasklist[0] != undefined)
        {
                   creep.say(creep.memory.memstruct.tasklist[0][0])
            if (creep.memory.memstruct.tasklist[0][0] == "moveToRoom")
            {
                var targposition = new RoomPosition(25, 25, creep.memory.memstruct.tasklist[0][1]);
                var pos1 = creep.pos;
                var pos2 = targposition;
                const range = creep.pos.getRangeTo(targposition);
                if (range > 23)
                { // might cause bug on nxt room wall 
                    creep.moveTo(targposition);
                    Game.map.visual.line(creep.pos, targposition,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                    var targets = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    var range2 = creep.pos.getRangeTo(targets);
                    if (range2 <= 5)
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
                if (creep.memory.memstruct.tasklist[0][0] == "wait")
                {
                    creep.say(creep.memory.waittimer)
                    if (!creep.memory.waittimer)
                    {
                        creep.memory.waittimer = 0;
                    }
                    creep.memory.waittimer =  creep.memory.waittimer + 1 ;

                    if (creep.memory.waittimer < creep.memory.memstruct.tasklist[0][1])
                    { // might cause bug on nxt room wall 

                    }
                    else
                    {
                            creep.memory.waittimer = 0;
                        this.loopTasks(creep);
                    }

                }
            

        }
    },
    run: function(powerCreep)
    {

        if (Memory.empire == undefined)
        {
            Memory.empire = {};
        }
        if (Memory.empire.powercreeps == undefined)
        {
            Memory.empire.powercreeps = {
                attackers: [],
                defenders: [],
                outriders: []
            };
        }

        var r;
        if (powerCreep.memory.memstruct == undefined)
        {
            powerCreep.memory.memstruct = {
                spawnRoom: "",
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
        if (powerCreep.room == undefined) // creep is not in the world
        {

            if (!(powerCreep.spawnCooldownTime > Date.now()))
            {
                try
                {
                    var myArray = powerCreep.name.split("-");

                    var pwrspawn = Game.rooms[myArray[0]].find(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_POWER_SPAWN);
                        }
                    });

                    if (pwrspawn.length != 0)
                    {

                        if (myArray.length == 3)
                        {
                            if (myArray[1] == "atk")
                            {
                                //        Memory.empire.powercreeps.attackers.push(powerCreep.id)
                            }
                            if (myArray[1] == "def")
                            {
                                //          Memory.empire.powercreeps.defenders.push(powerCreep.id) 
                            }

                        }
                        if (myArray.length == 1) // contains outrider
                        {
                            //  Memory.empire.powercreeps.outriders.push(powerCreep.id)    
                        }

                        powerCreep.memory.memstruct.spawnRoom = myArray[0];
                        powerCreep.spawn(pwrspawn[0]);
                    }
                }
                catch (e)
                {}
            }

        }
        else // creep is in the world
        {
            var check = this.checkPowerCreepTasks(powerCreep);
            //powerCreep.say(check);
            if (check && powerCreep.room.name != powerCreep.memory.memstruct.spawnRoom)
            {
                powerCreep.memory.memstruct.tasklist = [
                    ["moveToRoom", powerCreep.memory.memstruct.spawnRoom]
                ]
            }
            if (check)
            {
                if (Game.rooms[powerCreep.memory.memstruct.spawnRoom].controller.isPowerEnabled == false && powerCreep.memory.memstruct.spawnRoom == powercreep.room.name)
                {
                    if (powerCreep.enableRoom(Game.rooms[powerCreep.memory.memstruct.spawnRoom].controller) == -9)
                    {
                        powerCreep.moveTo(Game.rooms[powerCreep.memory.memstruct.spawnRoom].controller,
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
                    var creepid = powerCreep.name.substring(0, 7);

                    if (powerCreep.name == "defender1")
                    {
                        this.defence(powerCreep);
                    }
                    else
                    {
                        this.roomManager(powerCreep); // add limiters on when it should run check defcon and game time to operate only when needed
                    }

                }
            }
        }
    },

    defence: function(powerCreep)
    {
        var mainflag = Game.flags[powerCreep.room.name];
        if (Game.time % 50 == 0)
        {
            powerCreep.usePower(PWR_GENERATE_OPS);
        }

        if (powerCreep.store.getFreeCapacity() < 5) // creep is full
        {
            var range = powerCreep.pos.getRangeTo(powerCreep.room.storage);
            if (range > 1)
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
            var range = powerCreep.pos.getRangeTo(new RoomPosition(mainflag.pos.x - 1, mainflag.pos.y + 1, mainflag.room.name));
            if (range > 0)
            {
                powerCreep.moveTo(new RoomPosition(mainflag.pos.x - 1, mainflag.pos.y + 1, mainflag.room.name),
                {
                    visualizePathStyle:
                    {
                        stroke: '#ff0000'
                    }
                });
            }
        }
        var enBodyparts = mainflag.memory.totalEnemyBodyParts;

        if (powerCreep.store.getUsedCapacity("ops") < 210 && powerCreep.room.storage.store.getUsedCapacity("ops") > 5000) // todo add in capacity check
        {
            if (powerCreep.withdraw(powerCreep.room.storage, RESOURCE_OPS, powerCreep.store.getFreeCapacity() / 2) == ERR_NOT_IN_RANGE)
            {
                powerCreep.moveTo(powerCreep.room.storage);
                powerCreep.say("wit storage");
            }
        }
        powerCreep.memory.memstruct.spawnRoom
    },

    roomManager: function(powerCreep)
    {
               var target = Game.rooms[powerCreep.memory.memstruct.spawnRoom].find(FIND_HOSTILE_CREEPS);
      
        ////////////////////////////////////gen ops//////////////////////////////////////////////////////////////////////////////////////////
        if (Game.time % 50 == 0)
        {
            powerCreep.usePower(PWR_GENERATE_OPS);
        }
        ////////////////////////////////////store ops//////////////////////////////////////////////////////////////////////////////////////////
        if (powerCreep.store.getFreeCapacity() < 5) // creep is full
        {
            var range = powerCreep.pos.getRangeTo(powerCreep.room.storage);
            if (range > 1)
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
      else if (powerCreep.store.getUsedCapacity() < powerCreep.store.getCapacity() / 2) // creep is full
        {
            var range = powerCreep.pos.getRangeTo(powerCreep.room.storage);
            if (range > 1)
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
                powerCreep.withdraw(powerCreep.room.storage, RESOURCE_OPS, powerCreep.store.getCapacity() / 2);
            }
        }
        
        
        
        
        else
        {
            var mainflag = Game.flags[powerCreep.memory.memstruct.spawnRoom];
            var range = powerCreep.pos.getRangeTo(new RoomPosition(mainflag.pos.x + 7, mainflag.pos.y + 7, mainflag.room.name));
            if (range > 2)
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
        var nukeIncoming = Game.rooms[powerCreep.memory.memstruct.spawnRoom].find(FIND_NUKES,
        {
            filter: (nuke) =>
            {
                return (nuke.timeToLand < 150);
            }
        });

        if (powerCreep.ticksToLive < 500)
        {

            var pwrspawn = powerCreep.room.find(FIND_STRUCTURES,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_POWER_SPAWN);
                }
            })[0];
            var range = powerCreep.pos.getRangeTo(pwrspawn);
            if (range < 2)
            {
                powerCreep.renew(pwrspawn);
            }
            if (powerCreep.ticksToLive < 500)
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
        }
        else if (nukeIncoming.length != 0)
        {

            var roomExits = Game.map.describeExits(powerCreep.room.name);
            var roomnames = Object.values(roomExits);
            if (powerCreep.memory.exitchosen == "a" || powerCreep.memory.exitchosen == null)
            {
                powerCreep.memory.exitchosen = Math.floor(Math.random() * roomnames.length);
            }

            powerCreep.memory.memstruct.tasklist.push(["moveToRoom", roomnames[powerCreep.memory.exitchosen]])
            powerCreep.memory.memstruct.tasklist.push(["wait", 200])

        }

        else

        {
            var hasAtask = false;
            powerCreep.say("a");
            var targetArr = powerCreep.room.find(FIND_HOSTILE_CREEPS);
          //  powerCreep.say(powerCreep.powers[PWR_OPERATE_TOWER] != undefined);
            ////////////////////////////////////  PWR_OPERATE_FACTORY//////////////////////////////////////////////////////////////////////////////////////////
       
            if (powerCreep.powers[PWR_OPERATE_SPAWN] != undefined && powerCreep.powers[PWR_OPERATE_SPAWN].cooldown < 15 && hasAtask == false)
            {
                hasAtask = this.opSpawn(powerCreep)
            }
            ////////////////////////////////////  PWR_OPERATE_FACTORY//////////////////////////////////////////////////////////////////////////////////////////
            if (powerCreep.powers[PWR_OPERATE_FACTORY] != undefined && hasAtask == false)
            {
                hasAtask = this.opFact(powerCreep)
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
            if (powerCreep.powers[PWR_REGEN_SOURCE] != undefined && hasAtask == false   )
            {
                hasAtask = this.regenSource(powerCreep)
            }
            ////////////////////////////////////stock with energy//////////////////////////////////////////////////////////////////////////////////////////
            if (powerCreep.powers[PWR_OPERATE_EXTENSION] != undefined && powerCreep.powers[PWR_OPERATE_EXTENSION].cooldown < 5 && hasAtask == false)
            {
                hasAtask = this.opExtenstions(powerCreep)
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
            if (powerCreep.powers[PWR_REGEN_MINERAL] != undefined && hasAtask == false)
            {
                hasAtask = this.regenMineral(powerCreep)

            }
            //////////////////////////////////// operate power//////////////////////////////////////////////////////////////////////////////////////////
            if (powerCreep.powers[PWR_OPERATE_POWER] != undefined && powerCreep.powers[PWR_OPERATE_POWER].cooldown < 15 && hasAtask == false)
            {

                hasAtask = this.opPower(powerCreep)
            }
            /////////////////////////////////////////////////
     if (powerCreep.powers[PWR_OPERATE_TOWER] != undefined && hasAtask == false && targetArr.length != 0)
            {
                powerCreep.say("b");
                hasAtask = this.opTower(powerCreep)
                powerCreep.say(hasAtask);
            }

        }
    },
    opTower: function(powerCreep)
    {

        powerCreep.say("qa");
        var towers = powerCreep.room.find(FIND_MY_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_TOWER);
            }
        });
        for (var i = 0; i < towers.length; i++)
        {
            powerCreep.say(i);
            if (towers[i].effects == undefined || towers[i].effects.length == 0)
            {
                var range = powerCreep.pos.getRangeTo(towers[i]);
                if (range <= 3)
                {
                    powerCreep.usePower(PWR_OPERATE_TOWER, towers[i]);
                }
                else
                {
                    powerCreep.moveTo(towers[i],
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ff0000'
                        }
                    });
                }
                return true
            }
        }
        return false

    },

    opExtenstions: function(powerCreep)
    {

        var strongroom = powerCreep.room;
        if (strongroom.energyAvailable * 1.15 < strongroom.energyCapacityAvailable)
        {
            if (strongroom.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 15000)
            {
                var range = powerCreep.pos.getRangeTo(strongroom.storage);
                if (range <= 3)
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
            else if (strongroom.terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 15000)
            {
                var range = powerCreep.pos.getRangeTo(strongroom.terminal);
                if (range <= 3)
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
            return true
        }
        return false
    },

    opFact: function(powerCreep)
    {
        if (powerCreep.store.getUsedCapacity("ops") > 110) // creep is full
        {
            var FACTORY = powerCreep.room.find(FIND_MY_STRUCTURES,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_FACTORY);
                }
            })[0];
            if (FACTORY != undefined   && FACTORY.effects == undefined || FACTORY.effects.length == 0) ///////////////////////////////////////////////
            {
                powerCreep.moveTo(FACTORY,
                {
                    visualizePathStyle:
                    {
                        stroke: '#ff0000'
                    }
                });
                powerCreep.usePower(PWR_OPERATE_FACTORY, FACTORY);

                return true

            }
        }
        return false
    },

    regenSource: function(powerCreep)
    {

        var target = powerCreep.room.find(FIND_SOURCES);

        for (var q = 0; q < 2; q++)
        {

            if (target[q].effects.length == 1)
            {
                if (target[q].effects[0].ticksRemaining < 20 || target[q].effects.length == 0)
                {
                    powerCreep.moveTo(target[q]);   
                    powerCreep.room.visual.line(powerCreep.pos, target[q].pos,
                {
                    color: 'green',
                    lineStyle: 'dashed'
                });
                    
                       powerCreep.usePower(PWR_REGEN_SOURCE, target[q]);
                return true  
                    
                    
                }

           
                
                
            }

            else if (target[q].effects.length == 0)
            {
                powerCreep.moveTo(target[q],
                {
                    visualizePathStyle:
                    {
                        stroke: '#ff0000'
                    }
                });
                   powerCreep.room.visual.line(powerCreep.pos, target[q].pos,
                {
                    color: 'red',
                    lineStyle: 'dashed'
                });
                powerCreep.usePower(PWR_REGEN_SOURCE, target[q]);
                return true
            }

        }
        return false
    },

    regenMineral: function(powerCreep)
    {
        var target = powerCreep.room.find(FIND_MINERALS);
        var boolchecker = false;

        var extractorneeded;
        var minerals = powerCreep.room.find(FIND_MINERALS)[0].mineralAmount;
        if (minerals > 0)
        {
            extractorneeded = true;
        }
        if (extractorneeded)
        {
            if (target[0].effects == undefined)
            {

                powerCreep.moveTo(target[0],
                {
                    visualizePathStyle:
                    {
                        stroke: '#ff0000'
                    }
                });
                powerCreep.usePower(PWR_REGEN_MINERAL, targets[0]);
                return true

            }
            else if (target[0].effects.length != 0)
            {

                if (target[0].effects.length == 1)
                {
                    if (target[0].effects[0].ticksRemaining < 20 || target[0].effects.length == 0)
                    {
                        powerCreep.moveTo(target[0],
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ff0000'
                            }
                        });
                        powerCreep.usePower(PWR_REGEN_MINERAL, targets[0]);
                        return true
                    }
                }
            }
            else if (target[0].effects.length == 0 || target[0].effects == undefined)
            {

                powerCreep.moveTo(target[0],
                {
                    visualizePathStyle:
                    {
                        stroke: '#ff0000'
                    }
                });
                powerCreep.usePower(PWR_REGEN_MINERAL, targets[0]);
                return true
            }

        }
    },

    opPower: function(powerCreep)
    {
        if (powerCreep.store.getUsedCapacity("ops") > 210)
        {
            var pwrspawn = powerCreep.room.find(FIND_MY_STRUCTURES,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_POWER_SPAWN);
                }
            })[0];
            if (pwrspawn.effects == undefined || pwrspawn.effects.length == 0)
            {
                powerCreep.moveTo(pwrspawn,
                {
                    visualizePathStyle:
                    {
                        stroke: '#ff0000'
                    }
                });
                powerCreep.usePower(PWR_OPERATE_POWER, pwrspawn);
                return true
            }
        }
        return false
    },

    opSpawn: function(powerCreep)
    {
        if (powerCreep.store.getUsedCapacity("ops") > 310) // creep is full
        {
            var Spawns = Game.spawns[powerCreep.room.name];
            if (Spawns != undefined && Spawns.effects == undefined || Spawns.effects.length == 0 && Spawns.spawning) ///////////////////////////////////////////////
            {
                powerCreep.moveTo(Spawns,
                {
                    visualizePathStyle:
                    {
                        stroke: '#ff0000'
                    }
                });
                powerCreep.usePower(PWR_OPERATE_SPAWN, Spawns);
                return true
            }
            var Spawns = Game.spawns[powerCreep.room.name + "1"];
            if (Spawns != undefined && Spawns.effects == undefined || Spawns.effects.length == 0 && Spawns.spawning) ///////////////////////////////////////////////
            {
                powerCreep.moveTo(Spawns,
                {
                    visualizePathStyle:
                    {
                        stroke: '#ff0000'
                    }
                });
                powerCreep.usePower(PWR_OPERATE_SPAWN, Spawns);
                return true
            }
            var Spawns = Game.spawns[powerCreep.room.name + "2"];
            if (Spawns != undefined && Spawns.effects == undefined || Spawns.effects.length == 0 && Spawns.spawning) ///////////////////////////////////////////////
            {
                powerCreep.moveTo(Spawns,
                {
                    visualizePathStyle:
                    {
                        stroke: '#ff0000'
                    }
                });
                powerCreep.usePower(PWR_OPERATE_SPAWN, Spawns);
                return true
            }
        }
        return false
    },

    opOBS: function(powerCreep) {

    },

}
module.exports = powercreepManager;