var powercreepManager = {
    run: function(powerCreep)
    {
        var r;
        // for the ops gens move to some position and gen ops and transfer them into storage.
        // spawn only in a stronhold.
        //   console.log(powerCreep.spawnCooldownTime );
        if(powerCreep.room == undefined) // creep is not in the world
        {
            if(!(powerCreep.spawnCooldownTime > Date.now()))
            {
                var pwrspawn = Game.rooms["E24N3"].find(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_POWER_SPAWN);
                    }
                });
                //     console.log(powerCreep.spawn(pwrspawn[0]));
                powerCreep.spawn(pwrspawn[0]);
            }
        }
        else // creep is in the world
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
            var powerList = powerCreep.powers;
            var powerkeys = Object.keys(powerList);
            var powervalues = Object.values(powerList);
            var creepid = powerCreep.name.substring(0, 6)
            if(creepid == "opsHar")
            {
                this.opsharvester(powerCreep); // add limiters on when it should run check defcon and game time to operate only when needed
            }
            else
            {
                this.roomManager(powerCreep); // add limiters on when it should run check defcon and game time to operate only when needed
            }
        }
    },
    opsharvester: function(powerCreep)
    {
        if(Game.time % 50 == 0)
        {
            powerCreep.usePower(PWR_GENERATE_OPS);
        }
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
        if(powerCreep.ticksToLive < 200)
        {
            powerCreep.moveTo(pwrspawn,
            {
                visualizePathStyle:
                {
                    stroke: '#ff0000'
                }
            });
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
            powerCreep.say(mainflag);
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
                }
            });
        }
        ////////////////////////////////////stock with energy//////////////////////////////////////////////////////////////////////////////////////////
        if(powerCreep.powers[PWR_OPERATE_EXTENSION] != undefined)
        {
            var strongroom = powerCreep.room;
            //       powerCreep.say(strongroom.energyCapacityAvailable);
            if(strongroom.energyAvailable * 1.15 < strongroom.energyCapacityAvailable)
            { // add cooldown check and storage full check else termianl
                powerCreep.say("a");
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
        if(powerCreep.powers[PWR_REGEN_SOURCE] != undefined)
        {
            var target = powerCreep.room.find(FIND_SOURCES);
            var boolchecker = false;
            powerCreep.say(target[1].effects.length);
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
                powerCreep.say("t0");
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
                powerCreep.say("t1");
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
        //////////////////////////////////// operate power//////////////////////////////////////////////////////////////////////////////////////////
        if(powerCreep.powers[PWR_OPERATE_POWER] != undefined)
        {
            if(powerCreep.store.getUsedCapacity("ops") > 210) // creep is full
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
            }else{
                 
                if(powerCreep.withdraw(powerCreep.room.terminal, RESOURCE_OPS ) == ERR_NOT_IN_RANGE) {
    powerCreep.moveTo(powerCreep.room.terminal);powerCreep.say("wit term");
}
                
                
            }
        }
    },
}
module.exports = powercreepManager;