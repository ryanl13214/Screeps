/*
    BODYPART_COST: {
        "move": 50,
        "work": 100,
        "attack": 80,
        "carry": 50,
        "heal": 250,
        "ranged_attack": 150,
        "tough": 10,
        "claim": 600
    },
*/
//Game.spawns['w35s8'].spawnCreep([MOVE], 'flager' + Game.time, {memory: {role: 'flagger' , target:"source0"}});
var spwan = {
    run: function(roomname, defconlevel, storagevalue, roomExits, creepsinroom)
    {
        if (Game.spawns[roomname].spawning)
        {
            
            if (Game.spawns[roomname].spawning.name == 'towermover' + roomname)
            {
                Game.spawns[roomname].spawning.setDirections([LEFT]);
            }
            else if( Game.rooms[roomname].controller.level >4)
            {
                Game.spawns[roomname].spawning.setDirections([RIGHT]);
            }
            
        }
        if (Game.time % 5 == 0)
        {
            var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
            var jacks = _.filter(creepsinroom, (creep) => creep.memory.role == 'jack');
            var repairers = _.filter(creepsinroom, (creep) => creep.memory.role == 'repair');
            var towermover = _.filter(creepsinroom, (creep) => creep.memory.role == 'towermover');
            var harvesters = _.filter(creepsinroom, (creep) => creep.memory.role == 'harvester');
            var movers = _.filter(creepsinroom, (creep) => creep.memory.role == 'mover');
            var upgraders = _.filter(creepsinroom, (creep) => creep.memory.role == 'upgrader');
            var resourcemover = _.filter(creepsinroom, (creep) => creep.memory.role == 'resmover');
            var extractor = _.filter(creepsinroom, (creep) => creep.memory.role == 'extractor');
            var nextroomharvester = _.filter(creepsinroom, (creep) => creep.memory.role == 'nextroom');
            var scouts = _.filter(creepsinroom, (creep) => creep.memory.role == 'scout');
            var numberofguardingcreeps = _.filter(creepsinroom, (creep) => creep.memory.role == 'guard');
            var requiredJacks = 9;
            if (Game.rooms[roomname].controller.level > 3 && storagevalue > 10000 && creepsinroom.length > 2)
            {
                requiredJacks = 0;
            }
            //standard creep memory
            var memstruct = {
                spawnRoom: roomname,
                objectIDStorage: "",
                boosted: false,
                moveToRenew: false,
                opportuniticRenew: true,
                hastask: false
            };
            var claim = false;
            var claimroomtarg;
            var routetotargroom;
            if (Game.flags[roomname + "claim"])
            {
                claimroomtarg = Game.flags[roomname + "claim"].memory;
            }
            var numberofnextrooms = roomExits.length;
            var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
            var extractorneeded = false;
            if (spawnss.length != 0)
            {
                var minerals = spawnss[0].room.MINERAL_REGEN_TIME; // will break spawns if there is no spawn in the room.
                if (minerals != 0)
                {
                    extractorneeded = true;
                }
            }
            //    console.log(spawnss[0].room.MINERAL_REGEN_TIME);//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     
            var levelOfController = Game.rooms[roomname].controller.level;
            for (var i = 0; i < spawnss.length; i++)
            {
                if (Game.flags[spawnss[0].room.name + "source0"] == undefined)
                {
                    spawnss[i].spawnCreep([MOVE], 'jack' + Game.time,
                    {
                        memory:
                        {
                            role: 'flagger',
                            target: "source1",
                            memstruct: memstruct
                        }
                    });
                }
                else if (Game.flags[spawnss[0].room.name + "source1"] == undefined)
                {
                    spawnss[i].spawnCreep([MOVE], 'jack' + Game.time,
                    {
                        memory:
                        {
                            role: 'flagger',
                            target: "source2",
                            memstruct: memstruct
                        }
                    });
                }
                else if (Game.flags[spawnss[0].room.name + "controllerpos"] == undefined)
                {
                    spawnss[i].spawnCreep([MOVE], 'jack' + Game.time,
                    {
                        memory:
                        {
                            role: 'flagger',
                            target: "controller",
                            memstruct: memstruct
                        }
                    });
                }
                const target = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS);
                console.log(defconlevel);
                if (defconlevel == 8 && numberofguardingcreeps.length <  target.length)
                {
                    spawnss[i].spawnCreep([ATTACK, ATTACK, MOVE, MOVE], 'guard' + Game.time,
                    {
                        memory:
                        {
                            role: 'guard',
                            attackrole: "basicattacker",
                            memstruct: memstruct
                        }
                    });
                }
                if (defconlevel == 7 && numberofguardingcreeps.length <  target.length)
                {
                    var numberofparts = Math.floor((energyavailable-120) / 200);
                    var bodyparts = [];
                    if (numberofparts > 23)
                    {
                        numberofparts = 23;
                    }
                     bodyparts.push(TOUGH);
                     bodyparts.push(TOUGH);
                    for (let i = 0; i < numberofparts; i++)
                    {
                        bodyparts.push(RANGED_ATTACK);
                        bodyparts.push(MOVE);
                    }
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                    
                    spawnss[i].spawnCreep(bodyparts, 'guard' + Game.time,
                    {
                        memory:
                        {
                            role: 'guard',
                            attackrole: "basicranger",
                            memstruct: memstruct
                        }
                    });
                }
                if (defconlevel > 8 || numberofguardingcreeps >= target.length)
                {
                    if (jacks.length < requiredJacks - 1)
                    {
                        spawnss[i].spawnCreep([WORK, CARRY, MOVE, MOVE], 'jack' + Game.time,
                        {
                            memory:
                            {
                                role: 'jack',
                                cpuUsed: 0,
                                roomtarg: roomname,
                                sourcetarget: (Game.time * 3) % 2,
                                tasklist: [],
                                full: false,
                                memstruct: memstruct
                            }
                        });
                    }
                    else if (jacks.length < requiredJacks && energyavailable > 349)
                    {
                        var numberofparts = Math.floor(energyavailable / 350);
                        var bodyparts = [];
                        for (let i = 0; i < numberofparts; i++)
                        {
                            bodyparts.push(WORK);
                            bodyparts.push(CARRY);
                            bodyparts.push(CARRY);
                            bodyparts.push(MOVE);
                            bodyparts.push(MOVE);
                            bodyparts.push(MOVE);
                        }
                        spawnss[i].spawnCreep(bodyparts, 'jack' + Game.time,
                        {
                            memory:
                            {
                                role: 'jack',
                                cpuUsed: 0,
                                roomtarg: roomname,
                                sourcetarget: Game.time % 2,
                                tasklist: [],
                                full: false,
                                memstruct: memstruct
                            }
                        });
                    }
                     else if (upgraders.length <2 && requiredJacks  != 0 )// add condition that ensures the source and controller are close together
                    {
                          var numberofparts = Math.floor((energyavailable - 150) / 100);
                        var bodyparts = [];
                        for (let i = 0; i < numberofparts; i++)
                        {
                            bodyparts.push(WORK);
                         
                        }
                         bodyparts.push(CARRY);
                         bodyparts.push(MOVE);
                         bodyparts.push(MOVE);
                        spawnss[i].spawnCreep(bodyparts, 'upgrader' + Game.time,
                        {
                            memory:
                            {
                                role: 'upgrader',
                                cpuUsed: 0,
                                full: false,
                                memstruct: memstruct
                            }
                        });
                    }
                    if (numberofguardingcreeps.length < 1)
                    {
                        var numberofparts = Math.floor(energyavailable / 200);
                        var bodyparts = [];
                        if (numberofparts > 3)
                        {
                            numberofparts = 3;
                        }
                        for (let i = 0; i < numberofparts; i++)
                        {
                            bodyparts.push(RANGED_ATTACK);
                            bodyparts.push(MOVE);
                        }
                        spawnss[i].spawnCreep(bodyparts, 'guard' + Game.time,
                        {
                            memory:
                            {
                                role: 'guard',
                                attackrole: "basicranger",
                                memstruct: memstruct
                            }
                        });
                    }
                    else if (movers.length == 0 && levelOfController > 4)
                    {
                        spawnss[i].spawnCreep([CARRY, CARRY, MOVE, CARRY, MOVE, MOVE], 'mover' + Game.time,
                        {
                            memory:
                            {
                                role: 'mover',
                                cpuUsed: 0,
                                roomtarg: roomname,
                                target: "a",
                                tasklist: [],
                                full: false,
                                memstruct: memstruct
                            }
                        });
                    }
                    else if (towermover == 0 && spawnss[i].name == roomname && levelOfController > 4)
                    {
                        spawnss[i].spawnCreep([WORK, CARRY, CARRY, MOVE, WORK, CARRY, CARRY, MOVE], 'towermover' + roomname,
                        {
                            memory:
                            {
                                memstruct: memstruct,
                                role: 'towermover',
                                working: false
                            }
                        });
                    }
                    else if (resourcemover == 0 && spawnss[i].name == roomname && Game.rooms[roomname].controller.level >= 6)
                    {
                        spawnss[i].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, WORK, CARRY, CARRY, MOVE], 'resourcemover' + roomname,
                        {
                            memory:
                            {
                                role: 'resmover',
                                working: false,
                                memstruct: memstruct
                            }
                        });
                    }
                    else if (harvesters.length < 2 && energyavailable > 1000 && requiredJacks == 0)
                    {
                        if (harvesters.length == 0)
                        {
                            spawnss[i].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE], 'harvester1' +
                                roomname,
                                {
                                    memory:
                                    {
                                        role: 'harvester',
                                        sourcetarget: 1,
                                        memstruct: memstruct
                                    }
                                });
                        }
                        else
                        {
                            spawnss[i].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE], 'harvester' + (
                                harvesters[0].memory.sourcetarget + 1) % 2 + roomname,
                            {
                                memory:
                                {
                                    role: 'harvester',
                                    sourcetarget: (harvesters[0].memory.sourcetarget + 1) % 2,
                                    memstruct: memstruct
                                }
                            });
                        }
                    }
                    else if (movers.length < 4 && requiredJacks == 0 && Game.rooms[roomname].controller.level < 6 && requiredJacks == 0)
                    {
                        spawnss[i].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                            'mover' + Game.time,
                            {
                                memory:
                                {
                                    role: 'mover',
                                    cpuUsed: 0,
                                    roomtarg: roomname,
                                    target: "a",
                                    tasklist: [],
                                    full: false,
                                    memstruct: memstruct
                                }
                            });
                    }
                    else if (movers.length < 2 && requiredJacks == 0 && Game.rooms[roomname].controller.level == 6 && requiredJacks == 0)
                    {
                        spawnss[i].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                            'mover' + Game.time,
                            {
                                memory:
                                {
                                    role: 'mover',
                                    cpuUsed: 0,
                                    roomtarg: roomname,
                                    target: "a",
                                    tasklist: [],
                                    full: false,
                                    memstruct: memstruct
                                }
                            });
                    }
                    else if (movers.length < 1 && requiredJacks == 0 && Game.rooms[roomname].controller.level == 7 && requiredJacks == 0)
                    {
                        spawnss[i].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE,
                            CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE
                        ], 'mover' + Game.time,
                        {
                            memory:
                            {
                                role: 'mover',
                                cpuUsed: 0,
                                roomtarg: roomname,
                                target: "a",
                                tasklist: [],
                                full: false,
                                memstruct: memstruct
                            }
                        });
                    }
                    else if (upgraders.length == 0 && requiredJacks == 0)
                    {
                        spawnss[i].spawnCreep([WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], 'upgrader' + Game.time,
                        {
                            memory:
                            {
                                role: 'upgrader',
                                cpuUsed: 0,
                                full: false,
                                memstruct: memstruct
                            }
                        });
                    }
                    else if (upgraders.length < 1 && requiredJacks == 0 && storagevalue > 700000)
                    {
                        var numberofparts = Math.floor(energyavailable / 300);
                        var bodyparts = [];
                        for (let i = 0; i < numberofparts; i++)
                        {
                            bodyparts.push(WORK);
                            bodyparts.push(WORK);
                            bodyparts.push(CARRY);
                            bodyparts.push(MOVE);
                        }
                        spawnss[i].spawnCreep(bodyparts, 'upgrader' + Game.time,
                        {
                            memory:
                            {
                                role: 'upgrader',
                                cpuUsed: 0,
                                roomtarg: roomname,
                                sourcetarget: Game.time % 2,
                                tasklist: [],
                                full: false,
                                memstruct: memstruct
                            }
                        });
                    }
                    else if (repairers.length == 0 && requiredJacks == 0)
                    {
                        var bodyparts = [WORK, CARRY, MOVE, MOVE];
                        if (Game.spawns[roomname].room.controller.level > 5)
                        {
                            var numberofparts = Math.floor(energyavailable / 400);
                            if (numberofparts * 6 > 50)
                            {
                                numberofparts = Math.floor(50 / 6);
                            }
                            var bodyparts = [];
                            for (let i = 0; i < numberofparts; i++)
                            {
                                bodyparts.push(WORK);
                                bodyparts.push(CARRY);
                                bodyparts.push(CARRY);
                                bodyparts.push(MOVE);
                                bodyparts.push(MOVE);
                                bodyparts.push(MOVE);
                            }
                        }
                        spawnss[i].spawnCreep(bodyparts, 'repair' + Game.time,
                        {
                            memory:
                            {
                                role: 'repair',
                                cpuUsed: 0,
                                roomtarg: roomname,
                                sourcetarget: Game.time % 2,
                                tasklist: [],
                                full: false,
                                memstruct: memstruct
                            }
                        });
                    }
                    else if (scouts.length < 1 && Game.rooms[roomname].controller.level > 3)
                    {
                        spawnss[i].spawnCreep([MOVE], 'scout' + roomname,
                        {
                            memory:
                            {
                                memstruct: memstruct,
                                role: 'scout',
                                exitchosen: "a",
                                prevRoom: roomname
                            }
                        });
                    }
                    else if (extractor.length < 1 && extractorneeded && 1 == 2) //////////////////////////////////////////////
                    {
                        var numberofparts = Math.floor(energyavailable / 350);
                        var bodyparts = [];
                        for (let i = 0; i < numberofparts; i++)
                        {
                            bodyparts.push(WORK);
                            bodyparts.push(CARRY);
                            bodyparts.push(CARRY);
                            bodyparts.push(MOVE);
                            bodyparts.push(MOVE);
                            bodyparts.push(MOVE);
                        }
                        spawnss[i].spawnCreep(bodyparts, 'extractor' + Game.time,
                        {
                            memory:
                            {
                                role: 'extractor',
                                cpuUsed: 0,
                                depositId: false,
                                mineralType: "",
                                roomtarg: roomname,
                                sourcetarget: Game.time % 2,
                                tasklist: [],
                                full: false,
                                memstruct: memstruct
                            }
                        });
                    }
                    else if (nextroomharvester.length < numberofnextrooms && Game.rooms[roomname].controller.level > 3)
                    {
                        var numberofparts = Math.floor(energyavailable / 350);
                        if (numberofparts > 50)
                        {
                            numberofparts = Math.floor(50 / 6);
                        }
                        var bodyparts = [];
                        for (let i = 0; i < numberofparts; i++)
                        {
                            bodyparts.push(WORK);
                            bodyparts.push(CARRY);
                            bodyparts.push(CARRY);
                            bodyparts.push(MOVE);
                            bodyparts.push(MOVE);
                            bodyparts.push(MOVE);
                        }
                        const roomExits = Game.map.describeExits(roomname);
                        const roomnames = Object.values(roomExits);
                        const resourcekeys = Object.keys(roomExits);
                        if (nextroomharvester.length == 0 && Game.rooms[roomname].controller.level > 3)
                        {
                            spawnss[i].spawnCreep(bodyparts, 'nextroom-' + roomname + "-" + roomnames[roomnames.length - 1],
                            {
                                memory:
                                {
                                    role: 'nextroom',
                                    cpuUsed: 0,
                                    target: roomnames[roomnames.length - 1],
                                    home: roomname,
                                    sourcetarget: 0,
                                    tasklist: [],
                                    full: false,
                                    memstruct: memstruct
                                }
                            });
                        }
                        else
                        {
                            var takenrooms = []
                            for (var u = 0; u < nextroomharvester.length; u++)
                            {
                                takenrooms += [nextroomharvester[u].memory.target];
                            }
                            for (var q = 0; q < roomnames.length; q++)
                            {
                                var found = 0;
                                for (var u = 0; u < nextroomharvester.length; u++)
                                {
                                    if (roomnames[q] === String(nextroomharvester[u].memory.target))
                                    {
                                        found++;
                                    }
                                }
                                console.log("number of found creeps " + found);
                                if (found < 2 && Game.rooms[roomname].controller.level < 7 || found < 1)
                                {
                                    console.log("spawning next roomer " + roomnames[q]);
                                    spawnss[i].spawnCreep(bodyparts, 'nextroom-' + roomname + "-" + roomnames[q] + " " + found,
                                    {
                                        memory:
                                        {
                                            role: 'nextroom',
                                            cpuUsed: 0,
                                            target: roomnames[q],
                                            home: roomname,
                                            sourcetarget: 0,
                                            tasklist: [],
                                            full: false,
                                            memstruct: memstruct
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
                //   console.log(Game.time%200);
            }
        } // end of spawns loop
    }
}
module.exports = spwan;