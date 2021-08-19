var creepfunctions = {
    /*
    USED BY: 
        memstruct function
    milti
    
    if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
            }
    */
    initializeSquad: function(squadID, arrayOfSquadGoals, squadIsBoosted, squadType, squadHomeRoom, SquadMembers)
    {
        console.log("creating squad");
        Memory.squadObject[squadID] = {
            arrayOfSquadGoals: arrayOfSquadGoals,
            squadIsBoosted: squadIsBoosted,
            squadType: squadType,
            squadHomeRoom: squadHomeRoom,
            SquadMembersCurrent: [],
            squadposition: [25, 25],
            SquadMembersGoal: SquadMembers,
            squadisready: false,
            squadcreationtime: Game.time,
            squaddisolvetime: Game.time + 1500
        };
    },
    combatMove: function(creep, avoidarray, avoidclosest) // check if creep has damage parts
    {
        let goals = _.map(avoidarray, function(host)
        {
            return {
                pos: host.pos,
                range: 3
            };
        });
        let patha = PathFinder.search(creep.pos, goals,
        {
            flee: true
        }).path;
        creep.moveByPath(patha);
    },
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
                if(range > counter && creep.room.name == slave.room.name)
                {
                    creep.say("come");
                    creep.moveTo(slave);
                }
            }
            if(creep.memory.duoId2 != undefined)
            {
                var slave = Game.getObjectById(creep.memory.duoId2);
                const range = creep.pos.getRangeTo(slave);
                var counter = 2;
                if(creep.room.controller != undefined && creep.room.controller.level > 3 && creep.room.name != creep.memory.memstruct.spawnRoom)
                {
                    var counter = 2;
                }
                if(slave.pos.x == 50 || slave.pos.x == 0 || slave.pos.y == 50 || slave.pos.y == 0)
                {
                    counter = 3;
                }
                if(range > counter && creep.room.name == slave.room.name && Game.time % 2 == 0)
                {
                    creep.say("WAIT");
                    creep.cancelOrder('move');
                }
            }
        }
        catch (e)
        {}
    },
    checkglobaltasks: function(creep)
    {
        if(creep.memory.memstruct.tasklist.length == 0)
        {
            return true;
        }
        else
        if(creep.memory.memstruct.tasklist[0] != undefined)
        {
            if(creep.memory.memstruct.tasklist[0][0] == "joinSquad")
            {
                if(creep.ticksToLive < 1500)
                {
                    var tempid = creep.id;
                    //  console.log("adding creep to squad - " + tempid);
                    try
                    {
                        var listOfSquadMembers = Memory.squadObject[creep.memory.memstruct.tasklist[0][1]].SquadMembersCurrent
                        var itemfound = 0;
                        for(var i = 0; i < listOfSquadMembers.length; i++)
                        {
                            if(listOfSquadMembers[i] == creep.id)
                            {
                                itemfound = 1;
                            }
                        }
                        if(itemfound == 0)
                        {
                            Memory.squadObject[creep.memory.memstruct.tasklist[0][1]].SquadMembersCurrent.push(tempid);
                            return true;
                        }
                        // this.loopTasks(creep);
                    }
                    catch (e)
                    {
                        //     console.log("missing squad");
                    }
                    //  creep.say(creep.memory.memstruct.tasklist[0][1]);
                    // creep.say(creep.id);
                    // creep.memory.memstruct.tasklist.splice(0, 1);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "waitForCreepsToSpawn")
            {
                var creepsSpawnedin = false;
                for(var i = 0; i < creep.memory.memstruct.tasklist[0][1].length; i++)
                {
                    if(Game.creeps[creep.memory.memstruct.tasklist[0][1][i]] == undefined)
                    {
                        creepsSpawnedin = false;
                    }
                }
                if(creepsSpawnedin)
                {
                    for(var i = 0; i < creep.memory.memstruct.tasklist[0][1].length; i++)
                    {
                        if(Game.creeps[creep.memory.memstruct.tasklist[0][1][i]].ticksToLive > 1499)
                        {
                            creepsSpawnedin = false;
                        }
                    }
                }
               
               var all =false;
               
                    for(var i = 0; i < creep.memory.memstruct.tasklist[0][1].length; i++)
                    {
                        if(Game.creeps[creep.memory.memstruct.tasklist[0][1][i]].ticksToLive > 1499)
                        {
                            all = true;
                        }
                    }
                 if(all == false)
                {
                    creepsSpawnedin= true;
                }
                if(creepsSpawnedin)
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "withdraw")
            {
                if(creep.store.getFreeCapacity() == 0 || creep.ticksToLive < 200)
                {
                    this.loopTasks(creep);
                }
                //     ["withdraw" , "5f4e3d6138522b1096393b7d","tissue",optional value]
                // ad factory terminal storoage indicators
                const targ = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                creep.say(targ.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][2]));
                if(creep.memory.memstruct.tasklist[0].length == 3 || (targ.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][2]) < creep.memory.memstruct.tasklist[0][3]))
                {
                    var a = creep.withdraw(targ, creep.memory.memstruct.tasklist[0][2]);
                }
                else
                {
                    if(creep.memory.memstruct.tasklist[0][3] > creep.store.getFreeCapacity())
                    {
                        creep.memory.memstruct.tasklist[0][3] = creep.store.getFreeCapacity();
                    }
                    var a = creep.withdraw(targ, creep.memory.memstruct.tasklist[0][2], creep.memory.memstruct.tasklist[0][3]);
                }
                if(a == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targ);
                }
                else if(a == 0)
                {
                    new RoomVisual(creep.room.name).line(targ.pos.x, targ.pos.y, creep.pos.x, creep.pos.y);
                    new RoomVisual(creep.room.name).text(creep.memory.memstruct.tasklist[0][2], creep.pos.x, creep.pos.y,
                    {
                        color: 'white',
                        font: 0.3
                    });
                    this.loopTasks(creep);
                }
                else if(a == -6)
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "transfer")
            {
                //     ["withdraw" , "5f4e3d6138522b1096393b7d","tissue"]
                const targ = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                
                 var b = creep.withdraw("energy", creep.memory.memstruct.tasklist[0][2],((creep.memory.memstruct.tasklist[0][3]/3) *2));
                 var a = creep.transfer(targ, creep.memory.memstruct.tasklist[0][2], creep.memory.memstruct.tasklist[0][3]);
            
                new RoomVisual(creep.room.name).line(targ.pos.x, targ.pos.y, creep.pos.x, creep.pos.y);
                new RoomVisual(creep.room.name).text(creep.memory.memstruct.tasklist[0][2], creep.pos.x, creep.pos.y,
                {
                    color: 'green',
                    font: 0.3
                });
                if(a == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targ);
                }
                else if(a == 0)
                {
                    this.loopTasks(creep);
                }
                else if(a == -6)
                {
                    this.loopTasks(creep);
                }
                else if(a == -8)
                {
                    this.loopTasks(creep);
                }
                else if(creep.store.getUsedCapacity() == 0)
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "withdrawBoost")
            {
                if(creep.store.getFreeCapacity() == 0 || creep.ticksToLive < 200)
                {
                    this.loopTasks(creep);
                }
                 
                const targ = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                
           
                var a = creep.withdraw(targ, creep.memory.memstruct.tasklist[0][2], creep.memory.memstruct.tasklist[0][3]);
               
               var b = creep.withdraw("energy", creep.memory.memstruct.tasklist[0][2],((creep.memory.memstruct.tasklist[0][3]/3) *2));
               
               
               
                if(a == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targ);
                }
                else if(a == 0)
                {
                    new RoomVisual(creep.room.name).line(targ.pos.x, targ.pos.y, creep.pos.x, creep.pos.y);
                    new RoomVisual(creep.room.name).text(creep.memory.memstruct.tasklist[0][2], creep.pos.x, creep.pos.y,
                    {
                        color: 'white',
                        font: 0.3
                    });
                    this.loopTasks(creep);
                }
                else if(a == -6)
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "transferBoost")
            {
                //     ["withdraw" , "5f4e3d6138522b1096393b7d","tissue"]
                const targ = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                if(creep.memory.memstruct.tasklist[0].length == 3)
                {
                    var a = creep.transfer(targ, creep.memory.memstruct.tasklist[0][2]);
                }
                else
                {
                    var a = creep.transfer(targ, creep.memory.memstruct.tasklist[0][2], creep.memory.memstruct.tasklist[0][3]);
                }
                new RoomVisual(creep.room.name).line(targ.pos.x, targ.pos.y, creep.pos.x, creep.pos.y);
                new RoomVisual(creep.room.name).text(creep.memory.memstruct.tasklist[0][2], creep.pos.x, creep.pos.y,
                {
                    color: 'green',
                    font: 0.3
                });
                if(a == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targ);
                }
                else if(a == 0)
                {
                    this.loopTasks(creep);
                }
                else if(a == -6)
                {
                    this.loopTasks(creep);
                }
                else if(a == -8)
                {
                    this.loopTasks(creep);
                }
                else if(creep.store.getUsedCapacity() == 0)
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "drop")
            {
                //     ["drop" , "what to drop"]
                var a = creep.drop(creep.memory.memstruct.tasklist[0][1]);
                if(a == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targ);
                }
                else if(a == 0)
                {
                    this.loopTasks(creep);
                }
                else if(creep.store.getUsedCapacity() == 0)
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "reserve")
            {
                //      if((roomObj.controller.reservation != undefined && roomObj.controller.reservation.ticksToEnd < 1000) || roomObj.controller.reservation == undefined    || roomObj.controller.reservation.username != "Q13214"  )
                var range = creep.pos.getRangeTo(creep.room.controller);
                if(range > 1)
                {
                    creep.moveTo(creep.room.controller,
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
                if(creep.room.controller.reservation != undefined && creep.room.controller.reservation.username == "Q13214")
                {
                    creep.reserveController(creep.room.controller)
                }
                if(creep.room.controller.reservation != undefined && creep.room.controller.reservation.username != "Q13214")
                {
                    creep.attackController(creep.room.controller)
                }
                if(creep.room.controller.reservation == undefined)
                {
                    creep.reserveController(creep.room.controller)
                }
                creep.signController(creep.room.controller, "Q's room");
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "steal")
            {
                if(creep.store.getFreeCapacity() == 0 || creep.ticksToLive < 200)
                {
                    this.loopTasks(creep);
                }
                if(creep.memory.memstruct.tasklist[0][1] == "terminal")
                {
                    creep.say(creep.memory.memstruct.tasklist[0][1]);
                    var targ = creep.room.find(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return structure.structureType == STRUCTURE_TERMINAL;
                        }
                    })[0];
                    var resourcesToSteal = Object.keys(targ.store);
                    var listvalues = Object.values(targ.store);
                }
                else if(creep.memory.memstruct.tasklist[0][1] == "factory")
                {
                    var targ = creep.room.find(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return structure.structureType == STRUCTURE_FACTORY;
                        }
                    })[0];
                    var resourcesToSteal = Object.keys(targ.store);
                    var listvalues = Object.values(targ.store);
                }
                else if(creep.memory.memstruct.tasklist[0][1] == "storage")
                {
                    var targ = creep.room.storage;
                    var resourcesToSteal = Object.keys(targ.store);
                    var listvalues = Object.values(targ.store);
                }
                else
                {
                    var targ = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                    var resourcesToSteal = Object.keys(targ.store);
                    var listvalues = Object.values(targ.store);
                }
                creep.say(targ);
                var steal = ["XGHO2", "XUH2O", "XLHO2", "XZH2O", "XZHO2", "XKHO2", "X", "power", 'utrium_bar', 'lemergium_bar', 'zynthium_bar', 'keanium_bar', 'ghodium_melt', 'oxidant', 'reductant', 'purifier', 'battery', 'composite', 'crystal', 'liquid', 'wire', 'switch', 'transistor', 'microchip', 'circuit', 'cell', 'phlegm', 'tissue', 'muscle', 'organoid', 'alloy', 'tube', 'fixtures', 'frame', 'hydraulics', 'condensate', 'concentrate', 'extract', 'spirit', 'emanation'];
                var index = 0;
                for(a = 0; a < resourcesToSteal.length; a++)
                {
                    var found = false;
                    for(q = 0; q < steal.length; q++)
                    {
                        if(steal[q] == resourcesToSteal[a])
                        {
                            found = true;
                        }
                    }
                    if(found == true)
                    {
                        index = a;
                    }
                }
                var a = creep.withdraw(targ, resourcesToSteal[index]);
                if(a == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targ);
                }
                else if(a == 0)
                {
                    creep.say("YOINK");
                }
                else if(a == -6)
                {}
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "basicrenew")
            {
                var spawnss = creep.room.find(FIND_MY_SPAWNS);
                creep.moveTo(spawnss[0],
                {
                    visualizePathStyle:
                    {
                        stroke: '#ffaa00'
                    }
                });
                try
                {
                    spawnss[0].renewCreep(creep);
                }
                catch (e)
                {}
                var found = false;
                for(var ik = 0; ik < creep.body.length; ik++)
                {
                    if(creep.body[ik] == CLAIM)
                    {
                        found = true;
                    }
                }
                var tmp = 1450;
                if(found == true)
                {
                    tmp = 590;
                }
                if(creep.ticksToLive > tmp)
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "deposit")
            {
                if(creep.store.getUsedCapacity() > 0)
                {
                    if(creep.room.terminal != undefined && creep.room.terminal.store.getFreeCapacity() > 1500)
                    {
                        var targ = creep.room.terminal;
                    }
                    else if(creep.room.storage != undefined && creep.room.storage.store.getFreeCapacity() > 1500)
                    {
                        var targ = creep.room.storage;
                    }
                    else
                    {}
                    const resourcevalues = Object.values(creep.store);
                    const resourcekeys = Object.keys(creep.store);
                    var range = creep.pos.getRangeTo(targ);
                    if(range <= 1)
                    {
                        creep.transfer(targ, resourcekeys[0], resourcevalues[0]);
                    }
                    else
                    {
                        creep.moveTo(targ,
                        {
                            reusePath: 20,
                            visualizePathStyle:
                            {
                                stroke: '#ffaa00'
                            },
                            maxRooms: 0
                        });
                    }
                }
                else
                {
                    this.loopTasks(creep);
                    this.checkglobaltasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "mineCoridor")
            {
                var deposoits = creep.room.find(FIND_DEPOSITS);
                var droppedresources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
                {
                    filter: (res) =>
                    {
                        return (res.resourceType != RESOURCE_ENERGY);
                    }
                });
                var tombstones = creep.pos.findClosestByPath(FIND_TOMBSTONES,
                {
                    filter: (tomb) =>
                    {
                        return (tomb.store.getUsedCapacity() != tomb.store.getUsedCapacity(RESOURCE_ENERGY)) || (tomb.store.getUsedCapacity(
                            RESOURCE_ENERGY) > 30000000);
                    }
                });
                if(creep.store.getUsedCapacity(RESOURCE_ENERGY) != 0)
                {
                    creep.drop(RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY));
                }
                if(droppedresources != undefined)
                {
                    var range = creep.pos.getRangeTo(droppedresources);
                    if(range <= 1)
                    {
                        creep.pickup(droppedresources);
                    }
                    else
                    {
                        creep.moveTo(droppedresources,
                        {
                            reusePath: range,
                            visualizePathStyle:
                            {
                                stroke: '#ffaa00'
                            }
                        });
                    }
                }
                else if(tombstones != undefined)
                {
                    creep.say("tomb");
                    var object = Game.getObjectById(tombstones);
                    var resourcekeys = [RESOURCE_ENERGY];
                    var range = creep.pos.getRangeTo(tombstones);
                    if(range <= 1)
                    {
                        creep.withdraw(tombstones, resourcekeys[0]);
                    }
                    else
                    {
                        creep.moveTo(tombstones,
                        {
                            reusePath: range,
                            visualizePathStyle:
                            {
                                stroke: '#ffaa00'
                            }
                        });
                    }
                }
                else
                {
                    if(deposoits.length != 0)
                    {
                        if(creep.harvest(deposoits[0]) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(deposoits[0]);
                        }
                    }
                    if(deposoits.length > 1)
                    {
                        if(deposoits[0].cooldown > 25)
                        {
                            if(creep.harvest(deposoits[1]) == ERR_NOT_IN_RANGE)
                            {
                                creep.moveTo(deposoits[1]);
                            }
                        }
                    }
                    var hostile = creep.room.find(FIND_HOSTILE_CREEPS);
                    if(creep.store.getFreeCapacity() == 0 || creep.ticksToLive < 200 || hostile.length != 0 && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
                    {
                        this.loopTasks(creep);
                    }
                }
                if(creep.store.getFreeCapacity() == 0 && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "clearRoomPassive")
            {
                var invaders = creep.room.find(FIND_HOSTILE_CREEPS);
                var hostileStructs = creep.room.find(FIND_HOSTILE_STRUCTURES);
                if(invaders.length == 0 && hostileStructs.length == 0)
                {
                    this.loopTasks(creep);
                }
                else
                {
                    return true;
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "createslave") // used by master
            {
                creep.say("create healer");
                var bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]; // add a function to caUTOBUILD
                Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(bgodyparts, creep.name + "'s heal slave",
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: creep.memory.memstruct.spawnRoom,
                            tasklist: [
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
                if(creep.memory.duoId == undefined)
                {}
                else
                {
                    creep.say("a");
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "createslaveBOOST") // used by master// only rcl8
            {
                creep.say("create healer");
                var mainflag = Game.flags[creep.room.name];
                if(creep.pos.x == mainflag.pos.x - 1 && creep.pos.y == mainflag.pos.y - 3)
                {
                    creep.move(LEFT);
                }
                var bgodyparts = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]; // add a function to caUTOBUILD
                if(creep.room.controller.level == 7)
                {
                    var bgodyparts = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL];
                }
                if(creep.room.controller.level == 6)
                {
                    var bgodyparts = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL];
                }
                Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(bgodyparts, creep.name + "'s heal slave",
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: creep.memory.memstruct.spawnRoom,
                            tasklist: [
                                ["boosAllMax"],
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
                if(creep.memory.duoId == undefined)
                {}
                else
                {
                    creep.say("a");
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "createslaveBOOST2") // used by master// only rcl8
            {
                creep.say("create healer");
                var mainflag = Game.flags[creep.room.name];
                if(creep.pos.x == mainflag.pos.x - 1 && creep.pos.y == mainflag.pos.y - 3)
                {
                    creep.move(LEFT);
                }
                var bgodyparts = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]; // add a function to caUTOBUILD
                Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(bgodyparts, creep.name + "'s heal slave2",
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: creep.memory.memstruct.spawnRoom,
                            tasklist: [
                                ["boosAllMax"],
                                ["findMaster2", creep.id]
                            ],
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: false,
                            hastask: false
                        }
                    }
                });
                if(creep.memory.duoId2 == undefined)
                {}
                else
                {
                    creep.say("a");
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "findMaster") // used by slave
            {
                const master = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                if(master == null)
                {
                    creep.suicide();
                }
                try
                {
                    creep.moveTo(master);
                }
                catch (e)
                {}
                if(master != undefined && master != null)
                {
                    if(master.memory.duoId == undefined)
                    {
                        master.memory.duoId = creep.id;
                    }
                    else
                    {
                        if(creep.hits == creep.hitsMax)
                        {
                            creep.heal(master);
                        }
                        else
                        {
                            if(Game.time & 2 == 0)
                            {
                                creep.heal(master);
                            }
                            else
                            {
                                creep.heal(creep);
                            }
                        }
                    }
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "findMaster2") // used by slave
            {
                const master = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                if(master == null)
                {
                    creep.suicide();
                }
                try
                {
                    creep.moveTo(master);
                }
                catch (e)
                {}
                if(master != undefined && master != null)
                {
                    if(master.memory.duoId2 == undefined)
                    {
                        master.memory.duoId2 = creep.id;
                    }
                    else
                    {
                        if(creep.hits == creep.hitsMax)
                        {
                            creep.heal(master);
                        }
                        else
                        {
                            if(Game.time & 2 == 0)
                            {
                                creep.heal(master);
                            }
                            else
                            {
                                creep.heal(creep);
                            }
                        }
                    }
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "waitTick")
            {
                this.loopTasks(creep);
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "patrolroom")
            {
                creep.say("patrolroom");
                var targets = creep.room.find(FIND_HOSTILE_CREEPS);
                var targposition = new RoomPosition(25, 25, creep.memory.memstruct.tasklist[0][1]);
                var pos1 = creep.pos;
                var pos2 = targposition;
                const range = creep.pos.getRangeTo(targposition);
                if(range > 23 && targets.length == 0)
                {
                    creep.say("moveTo");
                    creep.moveTo(targposition);
                    Game.map.visual.line(creep.pos, targposition,
                    {
                        color: '#090900',
                        lineStyle: 'solid'
                    });
                }
                else
                {
                    if(targets.length != 0)
                    {
                        creep.say("hostile");
                        return true;
                    }
                    else
                    {
                        creep.say("repeat");
                        this.loopTasks(creep);
                    }
                }
                var tombstones = creep.pos.findClosestByPath(FIND_TOMBSTONES,
                {
                    filter: (tomb) =>
                    {
                        return (tomb.store.getUsedCapacity() != tomb.store.getUsedCapacity(RESOURCE_ENERGY)) || (tomb.store.getUsedCapacity(
                            RESOURCE_ENERGY) > 300);
                    }
                });
                var droppedresources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
                {
                    filter: (res) =>
                    {
                        return (res.resourceType != RESOURCE_ENERGY) || (res.amount > 200);
                    }
                });
                if(droppedresources != undefined || tombstones != undefined)
                {
                    this.summonHauler(creep.room.name, creep.memory.memstruct.spawnRoom);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "gatherLooseResources")
            {
                if(creep.store.getFreeCapacity() == 0)
                {
                    this.loopTasks(creep);
                }
                else
                {
                    var droppedresources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                    var tombstones = creep.pos.findClosestByRange(FIND_TOMBSTONES);
                    if(droppedresources != undefined)
                    {
                        var range = creep.pos.getRangeTo(droppedresources);
                        if(range <= 1)
                        {
                            creep.pickup(droppedresources);
                        }
                        else
                        {
                            creep.moveTo(droppedresources,
                            {
                                reusePath: range,
                                visualizePathStyle:
                                {
                                    stroke: '#ffaa00'
                                }
                            });
                        }
                    }
                    else if(tombstones != undefined)
                    {
                        creep.say("tomb");
                        var object = Game.getObjectById(tombstones);
                        var resourcekeys = Object.keys(tombstones.store);
                        var range = creep.pos.getRangeTo(tombstones);
                        if(range <= 1)
                        {
                            creep.withdraw(tombstones, resourcekeys[0]);
                        }
                        else
                        {
                            creep.moveTo(tombstones,
                            {
                                reusePath: range,
                                visualizePathStyle:
                                {
                                    stroke: '#ffaa00'
                                }
                            });
                        }
                    }
                    else
                    {
                        this.loopTasks(creep);
                    }
                    ////////////////
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "gatherstoredResources") /////////////////////////////////////////////////////////////////////////
            {
                if(creep.store.getFreeCapacity() == 0)
                {
                    this.loopTasks(creep);
                }
                else
                {
                    var targ = creep.pos.findClosestByPath(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_STORAGE) && structure.store.getUsedCapacity() > 0;
                        }
                    });
                    if(targ == undefined)
                    {
                        targ = creep.pos.findClosestByRange(FIND_STRUCTURES,
                        {
                            filter: (structure) =>
                            {
                                return ((structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity() > 0);
                            }
                        });
                    }
                    if(targ != undefined)
                    {
                        var resourcekeys = Object.keys(targ.store);
                        var range = creep.pos.getRangeTo(targ);
                        if(range <= 1)
                        {
                            creep.withdraw(targ, resourcekeys[0]);
                        }
                        else
                        {
                            creep.moveTo(targ,
                            {
                                reusePath: range,
                                visualizePathStyle:
                                {
                                    stroke: '#ffaa00'
                                }
                            });
                        }
                    }
                    else
                    {
                        this.loopTasks(creep);
                    }
                    ////////////////
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "downgrade")
            {
                if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(creep.room.controller,
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "claim")
            {
                if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(creep.room.controller,
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "boost") // [0][0] boost [0][1] boosy mineral typ3e [0][2]number of bodyparts
            {
                var boostlab;
                var flagmid = Game.flags[creep.room.name];
                var temp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, flagmid.pos.x - 2, flagmid.pos.y - 2);
                for(var i = 0; i < temp.length; i++)
                {
                    if(temp[i].structureType == STRUCTURE_LAB)
                    {
                        boostlab = temp[i];
                    }
                }
                if(creep.pos.x == flagmid.pos.x - 1 && creep.pos.y == flagmid.pos.y - 3)
                {
                    // if the terminal has less then use storage vice versa
                    if(boostlab != undefined)
                    {
                        creep.memory.memstruct.boosted = true;
                        var temp2 = Object.keys(boostlab.store);
                        var excesRes;
                        for(var i = 0; i < temp2.length; i++)
                        {
                            if(temp2 != "energy")
                            {
                                //   console.log(temp2);
                                excesRes = temp2[i];
                            }
                        }
                        var resmoveractual = Game.creeps["resourcemover" + creep.room.name];
                        if(resmoveractual != undefined && resmoveractual.memory.memstruct.tasklist.length == 0)
                        {
                            if(boostlab.store.getUsedCapacity("energy") < 1000) // stock e
                            {
                                resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                                resmoveractual.memory.memstruct.tasklist.push(["withdraw", resmoveractual.room.terminal.id, "energy", Math.min(2000 - boostlab.store.getUsedCapacity("energy"), resmoveractual.store.getCapacity())]);
                                resmoveractual.memory.memstruct.tasklist.push(["transfer", boostlab.id, "energy", Math.min(2000 - boostlab.store.getUsedCapacity("energy"), resmoveractual.store.getCapacity())]);
                                resmoveractual.memory.memstruct.tasklist.push(["waitTick"]);
                                // trNSFER ENERGY
                                resmoveractual.say("lab E");
                            }
                            else if(excesRes != creep.memory.memstruct.tasklist[0][1] && temp2.length == 2) // clean resourtce
                            {
                                // console.log(excesRes + " " + creep.memory.memstruct.tasklist[0][1]);
                                var temp = Object.keys(boostlab.store);
                                var excesRes;
                                for(var i = 0; i < temp.length; i++)
                                {
                                    if(temp != "energy")
                                    {
                                        excesRes = temp[i];
                                    }
                                }
                                resmoveractual.say("clean" + excesRes);
                                resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                                resmoveractual.memory.memstruct.tasklist.push(["withdraw", boostlab.id, excesRes, boostlab.store.getUsedCapacity(excesRes)]);
                                resmoveractual.memory.memstruct.tasklist.push(["transfer", resmoveractual.room.storage.id, excesRes, boostlab.store.getUsedCapacity(excesRes)]);
                                resmoveractual.memory.memstruct.tasklist.push(["waitTick"]);
                            }
                            else if(boostlab.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][1]) >= creep.memory.memstruct.tasklist[0][2] * 30) // boost
                            {
                                // lab boos creep here
                                creep.say("hasboost");
                                boostlab.boostCreep(creep, creep.memory.memstruct.tasklist[0][2])
                                if(creep.memory.memstruct.tasklist.length > 1 && creep.memory.memstruct.tasklist[1][0] != "boost")
                                {
                                    creep.move(TOP);
                                }
                                this.loopTasks(creep);
                            }
                            else if(boostlab.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][1]) < creep.memory.memstruct.tasklist[0][2] * 30) // stock resourtce
                            {
                                var resmoveractual = Game.creeps["resourcemover" + creep.room.name];
                                resmoveractual.say("fill2");
                                if(resmoveractual != undefined)
                                {
                                    var temp;
                                    if(resmoveractual.room.terminal.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][1]) > creep.memory.memstruct.tasklist[0][2] * 30)
                                    {
                                        temp = resmoveractual.room.terminal.id;
                                    }
                                    else if(resmoveractual.room.storage.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][1]) > creep.memory.memstruct.tasklist[0][2] * 30)
                                    {
                                        temp = resmoveractual.room.storage.id;
                                    }
                                    else
                                    {
                                        this.loopTasks(creep); // todo add flag to stop spawning boost creeps
                                    }
                                    resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                                    resmoveractual.memory.memstruct.tasklist.push(["withdraw", temp, creep.memory.memstruct.tasklist[0][1], (creep.memory.memstruct.tasklist[0][2] * 30) - boostlab.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][1])]);
                                    resmoveractual.memory.memstruct.tasklist.push(["transfer", boostlab.id, creep.memory.memstruct.tasklist[0][1], (creep.memory.memstruct.tasklist[0][2] * 30) - boostlab.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][1])]);
                                    resmoveractual.memory.memstruct.tasklist.push(["waitTick"]);
                                }
                            }
                        }
                        // cleanup
                    } //. BOOSTLAB UNDEFINED 
                }
                else
                {
                    creep.say("movetb");
                    var roompos = new RoomPosition(creep.room.storage.pos.x - 1, creep.room.storage.pos.y - 3, creep.room.name);
                    var pathh = creep.pos.findPathTo(roompos,
                    {
                        ignoreCreeps: true
                    });
                    creep.say(pathh.length);
                    creep.say(pathh[0].y);
                    var nextPosition = new RoomPosition(pathh[0].x, pathh[0].y, creep.room.name);
                    // var blockingcreep = nextPosition.findInRange(FIND_MY_CREEPS);
                    var targets2 = nextPosition.findInRange(FIND_MY_CREEPS, 0);
                    var a = creep.moveByPath(pathh);
                    //creep.say(a);
                    if(targets2.length != 0 && (pathh.length > 1 || targets2[0].memory.memstruct.tasklist.length == 0))
                    {
                        creep.say("blocked");
                        var blockingCreeps = creep.pos.findInRange(FIND_MY_CREEPS, 1);
                        for(var ii = 0; ii < blockingCreeps.length; ii++)
                        {
                            blockingCreeps[ii].moveTo(creep);
                        }
                        creep.moveByPath(pathh);
                    }
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "moveToObjectLoose")
            {
                creep.say("e");
                //   var targetRoomFlag = Game.flags[creep.memory.memstruct.tasklist[0][1]];
                try
                {
                    var targobject = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]).pos;
                    var range = creep.pos.getRangeTo(targobject);
                    creep.say("t-" + targobject.pos);
                    if(range > 2)
                    {
                        creep.moveTo(targobject);
                        creep.say("r-" + range);
                    }
                    else if(range < 4)
                    {
                        creep.say("in range");
                        this.loopTasks(creep);
                    }
                }
                catch (e)
                { // losing visual on object
                    //     creep.say("error");
                    this.loopTasks(creep);
                }
                this.allowSlave(creep);
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "moveToRoom")
            {
                if(creep.body.find(elem => elem.type === "heal") != undefined && creep.hits < creep.hitsMax)
                {
                    creep.heal(creep);
                }
                //   var targetRoomFlag = Game.flags[creep.memory.memstruct.tasklist[0][1]];
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
                        this.combatMove(creep, targetArr, target);
                    }
                }
                else
                {
                    this.loopTasks(creep);
                }
                this.allowSlave(creep);
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "forcemoveToRoom")
            {
                if(creep.body.find(elem => elem.type === "heal") != undefined && creep.hits < creep.hitsMax)
                {
                    creep.heal(creep);
                }
                //   var targetRoomFlag = Game.flags[creep.memory.memstruct.tasklist[0][1]];
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
            else if(creep.memory.memstruct.tasklist[0][0] == "attackMoveToRoom")
            {
                var targetRoomFlag = Game.flags[creep.memory.memstruct.tasklist[0][1]];
                var pos1 = creep.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creep.pos.getRangeTo(targetRoomFlag.pos);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    var targets = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    var range2 = creep.pos.getRangeTo(targets);
                    if(range2 <= 4)
                    {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                        var targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                        var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                        if(targets.length > 0)
                        {
                            creep.rangedAttack(targets[0]);
                        }
                        if(creep.hits < creep.hitsMax)
                        {
                            creep.heal(creep);
                        }
                        if(creep.memory.attackrole == "ranger")
                        { // long range creeps here 
                            var range = creep.pos.getRangeTo(target);
                            if(range > 3)
                            {
                                creep.moveTo(target);
                            }
                            if(range < 3 || (creep.hits + 300 < creep.hitsMax && range < 5))
                            {
                                creepfunctions.combatMove(creep, targetArr, target);
                            }
                        }
                        else
                        {
                            if(range > 1)
                            {
                                creep.moveTo(target);
                            }
                        }
                    }
                    else
                    {
                        creep.moveTo(targetRoomFlag.pos);
                    }
                }
                else
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "moveTo")
            {
                try
                {
                    creep.heal(creep);
                }
                catch (e)
                {}
                var targetposition = new RoomPosition(creep.memory.memstruct.tasklist[0][1], creep.memory.memstruct.tasklist[0][2], creep.room.name);
                var range = creep.pos.getRangeTo(targetposition);
                if(range != 0)
                {
                    creep.moveTo(targetposition);
                    // creep.say(range);
                }
                else
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "moveToLoose")
            {
                var targetposition = new RoomPosition(creep.memory.memstruct.tasklist[0][1], creep.memory.memstruct.tasklist[0][2], creep.room.name);
                var range = creep.pos.getRangeTo(targetposition);
                if(range > 2)
                {
                    creep.moveTo(targetposition);
                    creep.say(range);
                }
                else
                {
                    this.loopTasks(creep);
                }
            }
                        else if(creep.memory.memstruct.tasklist[0][0] == "moveToLooseinterRoom")
            {
                var targetposition = new RoomPosition(creep.memory.memstruct.tasklist[0][1], creep.memory.memstruct.tasklist[0][2], creep.memory.memstruct.tasklist[0][3]);
                var range = creep.pos.getRangeTo(targetposition);
                if(range > 2)
                {
                    creep.moveTo(targetposition);
                    creep.say(range);
                }
                else
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "waituntil")
            {
                if(Game.time < creep.memory.memstruct.tasklist[0][1])
                {
                    creep.say("wait");
                }
                else
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "repair")
            {
                try
                {
                    var target = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                    if(target.hits + 800 > target.hitsMax)
                    {
                        this.loopTasks(creep);
                    }
                    if(creep.store.getUsedCapacity("energy") != 0)
                    {
                        if(creep.repair(target) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(target);
                        }
                    }
                    else
                    {
                        this.loopTasks(creep);
                    }
                }
                catch (e)
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "renewfull")
            {
                this.movehomeandrenew(creep);
                var found = false;
                for(var ik = 0; ik < creep.body.length; ik++)
                {
                    if(creep.body[ik] == CLAIM)
                    {
                        found = true;
                    }
                }
                var tmp = 1450;
                if(found == true)
                {
                    tmp = 590;
                }
                if(creep.ticksToLive > tmp)
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "createPatrolBetweenTwoRooms")
            {
                var a = creep.name;
                this.initializeSquad(a, [creep.memory.memstruct.tasklist[0][1], creep.memory.memstruct.tasklist[0][2]], false, "SoloPatrol", creep.memory.memstruct.spawnRoom,
                {
                    a: []
                });
                this.loopTasks(creep);
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "boosAllMax") // used only by combat will deal with dismantel attack heal ranged_attack tough and move only 
            {
                var numberOfHealParts = 0;
                var numberOfAttackParts = 0;
                var numberOfRangedParts = 0;
                var numberOfMoveParts = 0;
                var numberOfWorkParts = 0;
                var numberOfToughParts = 0;
                var arraytopush = [];
                for(var j = 0; j < creep.body.length; j++)
                {
                    if(creep.body[j].type == HEAL)
                    {
                        numberOfHealParts++;
                    }
                    if(creep.body[j].type == ATTACK)
                    {
                        numberOfAttackParts++;
                    }
                    if(creep.body[j].type == RANGED_ATTACK)
                    {
                        numberOfRangedParts++;
                    }
                    if(creep.body[j].type == WORK)
                    {
                        numberOfWorkParts++;
                    }
                    if(creep.body[j].type == MOVE)
                    {
                        numberOfMoveParts++;
                    }
                    if(creep.body[j].type == TOUGH)
                    {
                        numberOfToughParts++;
                    }
                }
                if(numberOfHealParts != 0)
                {
                    arraytopush.push(["boost", "XLHO2", numberOfHealParts]);
                }
                if(numberOfAttackParts != 0)
                {
                    arraytopush.push(["boost", "XUH2O", numberOfAttackParts]);
                }
                if(numberOfRangedParts != 0)
                {
                    arraytopush.push(["boost", "XKHO2", numberOfRangedParts]);
                }
                if(numberOfWorkParts != 0)
                {
                    arraytopush.push(["boost", "XZH2O", numberOfWorkParts]);
                }
                if(numberOfMoveParts != 0)
                {
                    arraytopush.push(["boost", "XZHO2", numberOfMoveParts]);
                }
                if(numberOfToughParts != 0)
                {
                    arraytopush.push(["boost", "XGHO2", numberOfToughParts]);
                }
                this.loopTasks(creep);
                for(var i = 0; i < creep.memory.memstruct.tasklist.length; i++)
                {
                    arraytopush.push(creep.memory.memstruct.tasklist[i]);
                }
                creep.memory.memstruct.tasklist = arraytopush;
            }
            else
            {
                this.loopTasks(creep);
            }
        }
        else
        {
            this.loopTasks(creep);
            return true;
        }
    },
    summonHauler: function(targroom, haulerHome)
    {
        var haulersFREE = Game.rooms[haulerHome].find(FIND_MY_CREEPS,
        {
            filter: (creep) =>
            {
                return (creep.memory.role == "mover" && creep.memory.memstruct.tasklist.length == 0);
            }
        });
        var homeflag = Game.flags[haulerHome];
        if(homeflag.memory.flagstruct.haulerOUT == undefined)
        {
            homeflag.memory.flagstruct.haulerOUT = Game.time;
        }
        if(Game.time - homeflag.memory.flagstruct.haulerOUT > 80 && haulersFREE.length != 0)
        { // if a mover was NOT recently sent out
            console.log("summoning hauler");
            haulersFREE[0].memory.memstruct.tasklist = [
                ["deposit"],
                ["moveToRoom", targroom],
                ["gatherLooseResources"],
                ["moveToRoom", haulerHome],
                ["deposit"]
            ];
            homeflag.memory.flagstruct.haulerOUT = Game.time;
        }
    },
    /*
    USED BY: 
        most eventually ranger primarily
    
    
    
    */
    findDroppedEnergy: function(creep)
    {
        var droppedresources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
        {
            filter: (res) =>
            {
                return (res.resourceType == RESOURCE_ENERGY) && (res.amount > creep.store.getFreeCapacity());
            }
        });
        if(droppedresources != undefined)
        {
            var range = creep.pos.getRangeTo(droppedresources);
            if(range <= 1)
            {
                creep.pickup(droppedresources);
            }
            else
            {
                creep.moveTo(droppedresources,
                {
                    reusePath: range
                });
            }
            creep.memory.hastask = false;
        }
    },
    /*
     USED BY: 
         most eventually ranger primarily
     
     
     
     */
    movehomeandrenew: function(creep, homeroom, timeer)
    {
        // check iff the renew spot is free and room is able to renew
        if(creep.memory.isrenweing == undefined)
        {
            creep.memory.isrenweing = false;
        }
        if(creep.ticksToLive < timeer)
        {
            creep.memory.isrenweing = true;
        }
        if(creep.ticksToLive > 1400)
        {
            creep.memory.isrenweing = false;
        }
        if(creep.memory.isrenweing)
        {
            if(creep.room.name == homeroom)
            {
                if(creep.memory.isrenweing)
                {
                    var spawnss = creep.room.find(FIND_MY_SPAWNS);
                    creep.moveTo(spawnss[0],
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
            }
            else
            {
                var targetRoomFlag = Game.flags[homeroom];
                var pos1 = creep.pos;
                var pos2 = targetRoomFlag.pos;
                const range = creep.pos.getRangeTo(targetRoomFlag.pos);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creep.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creep.pos, targetRoomFlag.pos,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }
            }
        }
    },
    /*
    USED BY: 
        most eventually ranger primarily
    
    
    
    */
    stockstorage: function(creep)
    {
        var storageactual = creep.room.storage;
        if(storageactual != undefined)
        {
            if(storageactual.store.getUsedCapacity() < 20000)
            {
                var range = creep.pos.getRangeTo(storageactual);
                if(range <= 1)
                {
                    creep.transfer(storageactual, RESOURCE_ENERGY);
                }
                else
                {
                    creep.moveTo(storageactual,
                    {
                        reusePath: range
                    });
                }
                creep.memory.hastask = false;
            }
        }
    },
    /*
    USED BY: 
        jack
        mover
        repairer
    */
    findfullcontainers: function(creep, energyleveltodrawfrom)
    {
        var containers = creep.pos.findClosestByRange(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return s.structureType == STRUCTURE_CONTAINER && s.store.getUsedCapacity("energy") > energyleveltodrawfrom;
            }
        });
        if(containers == undefined)
        {
            containers = creep.pos.findClosestByRange(FIND_STRUCTURES,
            {
                filter: (s) =>
                {
                    return s.structureType == STRUCTURE_LINK && s.store.getUsedCapacity("energy") > 500;
                }
            });
        }
        if(containers != undefined && containers != null)
        {
            if(creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
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
            if(storageMain != undefined && storageMain.store.getUsedCapacity() > 50000)
            {
                var range = creep.pos.getRangeTo(storageMain);
                if(range <= 1)
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
        if(creep.memory.tasklist[0] == "moveto")
        {
            const path = creep.pos.findPathTo(creep.memory.targetroom);
            if(path.length > 0)
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
        if(repairtarg)
        {
            var range = creep.pos.getRangeTo(repairtarg);
            if(range <= 3)
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
                return (s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART) && s.hits < s.hitsMax * 0.99;
            }
        });
        if(repairtarg)
        {
            var range = creep.pos.getRangeTo(repairtarg);
            if(range <= 3)
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
    upkeepwalls: function(creep)
    {
        var repairtarg = creep.pos.findClosestByRange(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return (s.structureType == STRUCTURE_WALL && s.hits < s.hitsMax * 0.1) || (s.structureType == STRUCTURE_RAMPART && s.hits < s.hitsMax * 0.5);
            }
        });
        if(repairtarg)
        {
            var range = creep.pos.getRangeTo(repairtarg);
            if(range <= 3)
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
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
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
        if(buildingsneedingenergy.length > 0)
        {
            if(creep.transfer(creep.pos.findClosestByPath(buildingsneedingenergy), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
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
    stocktowerswithenergy: function(creep) {},
    mineCorridor: function(creep)
    {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var deposoits = creep.room.find(FIND_DEPOSITS,
        {
            filter: (dep) =>
            {
                return (dep.lastCooldown < 150);
            }
        });
        if(deposoits.length != 0 && Game.rooms[creep.memory.memstruct.spawnRoom].controller.level > 4)
        {
            if(!target)
            {
                if(Game.rooms[creep.memory.memstruct.spawnRoom].controller.level == 5)
                {
                    var bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY];
                }
                else if(Game.rooms[creep.memory.memstruct.spawnRoom].controller.level == 6)
                {
                    var bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY];
                }
                else if(Game.rooms[creep.memory.memstruct.spawnRoom].controller.level > 6)
                {
                    var bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY];
                }
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
                            opportuniticRenew: false,
                            hastask: false
                        }
                    }
                });
            }
            else
            {
                var bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK];
                var corridorRoomList = Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.corridorRooms;
                var tmptasklist = [];
                if(corridorRoomList == undefined)
                {
                    Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.corridorRooms = [];
                }
                tmptasklist.push(["createslave", "healer"]);
                for(var c = 0; c < corridorRoomList.length; c++)
                {
                    tmptasklist.push(["patrolroom", corridorRoomList[c]]);
                }
                tmptasklist.push(["repeat", corridorRoomList.length]);
                Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(bgodyparts, 'coridor guard' + creep.memory.memstruct.spawnRoom,
                {
                    memory:
                    {
                        role: 'guard',
                        attackrole: "chasedown",
                        memstruct:
                        {
                            spawnRoom: creep.memory.memstruct.spawnRoom,
                            tasklist: tmptasklist,
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: false,
                            hastask: false
                        }
                    }
                });
            }
        }
    },
    buildstructs: function(creep)
    {
        var constructionsites = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if(constructionsites != undefined)
        {
            var range = creep.pos.getRangeTo(constructionsites);
            if(range <= 3)
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
    }
}
module.exports = creepfunctions;