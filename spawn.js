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
    run: function(roomname, defconlevel, storagevalue, roomExits,creepsinroom)
    {
        if (Game.spawns[roomname].spawning)
        {
            if (Game.spawns[roomname].spawning.name == 'towermover' + roomname)
            {
                Game.spawns[roomname].spawning.setDirections([LEFT]);
            }
            else
            {
                Game.spawns[roomname].spawning.setDirections([RIGHT]);
            }
        }
        if (Game.time % 5 == 0)
        {
            var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
            console.log(energyavailable);
           
            var jacks = _.filter(creepsinroom, (creep) => creep.memory.role == 'jack');
            var repairers = _.filter(creepsinroom, (creep) => creep.memory.role == 'repair');
            var towermover = _.filter(creepsinroom, (creep) => creep.memory.role == 'towermover');
            var harvesters = _.filter(creepsinroom, (creep) => creep.memory.role == 'harvester');
            var movers = _.filter(creepsinroom, (creep) => creep.memory.role == 'mover');
            var upgraders = _.filter(creepsinroom, (creep) => creep.memory.role == 'upgrader');
            var resourcemover = _.filter(creepsinroom, (creep) => creep.memory.role == 'resmover');
            var extractor = _.filter(creepsinroom, (creep) => creep.memory.role == 'extractor');
            var nextroomharvester = _.filter(creepsinroom, (creep) => creep.memory.role == 'nextroom');
             
            var requiredJacks = 5;
            if (Game.rooms[roomname].controller.level > 3 && storagevalue > 10000 && creepsinroom.length != 0)
            {
                requiredJacks = 0;
            }
            //standard creep memory
            var memstruct = {
                spawnRoom: roomname,
                pickuptarget: "",
                pickupitem: "",
                transfertargroom: "",
                transfercontainer: "",
                boosted: false
            };
            var claim = false;
            var claimroomtarg;
            var routetotargroom;
            if (Game.flags[roomname + "claim"])
            {
                // claim = true;
                claimroomtarg = Game.flags[roomname + "claim"].memory;
            }
            var numberofnextrooms = roomExits.length;
            console.log("nextroom[q]a" +nextroomharvester.length+"--required next rooms-"+numberofnextrooms);
            var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
            for (var i = 0; i < spawnss.length; i++)
            {
                if (jacks.length == 0 && requiredJacks != 0)
                {
                    spawnss[i].spawnCreep([WORK, CARRY, MOVE, CARRY, MOVE], 'jack' + Game.time,
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
                else if (movers.length == 0)
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
                else if (towermover == 0 && spawnss[i].name == roomname)
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
                else if (resourcemover == 0 && spawnss[i].name == roomname && Game.rooms[roomname].controller.level == 6)
                {
                    spawnss[i].spawnCreep([WORK, CARRY, CARRY, MOVE, WORK, CARRY, CARRY, MOVE], 'resourcemover' + roomname,
                    {
                        memory:
                        {
                            role: 'resmover',
                            working: false,
                            memstruct: memstruct
                        }
                    });
                }
                else if (harvesters.length < 2 && energyavailable > 1000)
                {
                    if (harvesters.length == 0)
                    {
                        spawnss[i].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE], 'harvester1' + roomname,
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
                        spawnss[i].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE], 'harvester' + (harvesters[0].memory.sourcetarget + 1) % 2 + roomname,
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
                else if (movers.length < 4 && requiredJacks == 0 && Game.rooms[roomname].controller.level < 6)
                {
                    spawnss[i].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'mover' + Game.time,
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
                else if (movers.length < 2 && requiredJacks == 0 && Game.rooms[roomname].controller.level == 6)
                {
                    spawnss[i].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'mover' + Game.time,
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
                else if (movers.length < 1 && requiredJacks == 0 && Game.rooms[roomname].controller.level == 7)
                {
                    spawnss[i].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE,CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'mover' + Game.time,
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
                else if (repairers.length == 0)
                {
                    var bodyparts = [WORK, CARRY, MOVE, MOVE];
                    if (Game.spawns[roomname].room.controller.level > 5)
                    {
                        var numberofparts = Math.floor(energyavailable / 400);
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
                else if (extractor.length < 1 && 2 == 1) //////////////////////////////////////////////
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
                else if (nextroomharvester.length < numberofnextrooms)  
                          
                {
                    console.log("nextroom[q]");
                    var numberofparts = Math.floor(energyavailable / 350);
                    if(numberofparts>50){numberofparts=Math.floor( 50/6);}
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
                    const resourcevalues = Object.values(roomExits);
                    const resourcekeys = Object.keys(roomExits);
                    if (nextroomharvester.length == 0)
                    {console.log("nextroomharvester.length == 0");
                        spawnss[i].spawnCreep(bodyparts, 'nextroom-' + roomname + "-" + resourcevalues[resourcevalues.length - 1],
                        {
                            memory:
                            {
                                role: 'nextroom',
                                cpuUsed: 0,
                                target: resourcevalues[resourcevalues.length - 1],
                                home: roomname,
                                sourcetarget: (Game.time * 3) % 2,
                                tasklist: [],
                                full: false,
                                memstruct: memstruct
                            }
                        });
                    }
                    else
                    {       
                        console.log("resourcevalues[q]");
                        var takenrooms = []
                        for (var u = 0; u < nextroomharvester.length; u++)
                        {
                            takenrooms += [nextroomharvester[u].memory.target];
                        }
                        for (var q = 0; q < resourcevalues.length; q++)
                        {
                              var found = false;
                            for (var u = 0; u < nextroomharvester.length; u++)
                            {
                              if(resourcevalues[q] ===String(nextroomharvester[u].memory.target) ){found=true;}
                            }
                            
                            
                            if (!found)
                            {
                                spawnss[i].spawnCreep(bodyparts, 'nextroom-' + roomname + "-" + resourcevalues[q],
                                {
                                    memory:
                                    {
                                        role: 'nextroom',
                                        cpuUsed: 0,
                                        target: resourcevalues[q],
                                        home: roomname,
                                        sourcetarget: (Game.time * 3) % 2,
                                        tasklist: [],
                                        full: false,
                                        memstruct: memstruct
                                    }
                                });
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