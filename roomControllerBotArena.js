var tower = require('tower');
var roles = require('roles');
var roompathfind = require('roompathfinder');
var buildbase = require('buildbase');
var roomControllerBotArena = {
    run: function(roomname)
    { 
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
           if (Memory.empire.roomsobj[roomname] == undefined   )
        {
            Memory.empire.roomsobj[roomname] = {
    
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        tower.run(roomname, 0);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        var mainflag = Game.flags[roomname];
         
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        if (mainflag == undefined)
        {
         

            //  console.log(roomname);
            if (spawnss.length > 0)
            {
                Game.rooms[roomname].createFlag(Game.spawns[roomname].pos.x , Game.spawns[roomname].pos.y + 1, roomname);
            }
       
            var mainflags = Game.flags[roomname];
         
        }
        //          run basicBuild 
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        var memstruct = {
            spawnRoom: roomname,
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
        var levelOfRoom = Game.rooms[roomname].controller.level;
        var mainspawn = Game.rooms[roomname].find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_SPAWN);
            }
        });

        var droppedresources = Game.rooms[roomname].find(FIND_DROPPED_RESOURCES,
        {
            filter: (res) =>
            {
                return (res.resourceType == RESOURCE_ENERGY && res.amount > 250);
            }
        });

        var target = Game.rooms[roomname].find(FIND_SOURCES);
        if (Memory.botarena == undefined)
        {
            Memory.botarena = {
                rooms:
                {}
            }

        }
        if (Memory.botarena.rooms[roomname] == undefined)
        {
            Memory.botarena.rooms[roomname] = {
                source1ID: target[1].id,
                source0ID: target[0].id
            }
        }

        var ext = Game.rooms[roomname].find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_EXTENSION);
            }
        });

        var flag1 = Game.flags[roomname + "source1"];
        var flag2 = Game.flags[roomname + "container1"];

        var flag11 = Game.flags[roomname + "source0"];
        var flag22 = Game.flags[roomname + "container0"];
        if (flag1 && flag11 && flag2 && flag22)
        {
            if (flag1.pos.x == flag11.pos.x && flag1.pos.y == flag11.pos.y)
            {
                flag1.remove()
                flag11.remove()
                flag2.remove()
                flag22.remove()
            }

        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
           var mainflag = Game.flags[roomname ];
        
        
        
        
        buildbase.run(roomname, mainflag.pos.x, mainflag.pos.y);
        

        
















        var numberOfMinersNeeded = 0;
        var roomnames = Object.keys(Memory.roomlist)
        for (var j = 0; j < roomnames.length; j++)
        {
            if (Memory.roomlist[roomnames[j]].distanceFromHomeRoom < 100 && Memory.roomlist[roomnames[j]].dangerLevel == 2)
            {
                numberOfMinersNeeded += Memory.roomlist[roomnames[j]].numberOfSources
            }

        }

        //          run roles 
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        var creepsinroom = _.filter(Game.creeps, (creep) => (creep.memory.memstruct != undefined && creep.memory.memstruct.spawnRoom === roomname));
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            roles
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

        roles.run(creepsinroom);

        //          run spawn 
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        var energycurrentlyavailable = Game.rooms[roomname].energyAvailable;
        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
        var levelOfController = Game.rooms[roomname].controller.level;
        var harvesters = _.filter(creepsinroom, (creep) => creep.memory.role == 'harvester');

        var upgraders = _.filter(creepsinroom, (creep) => creep.memory.role == 'upgra');
        var movers = _.filter(creepsinroom, (creep) => creep.memory.role == 'mover');
        var repairs = _.filter(creepsinroom, (creep) => creep.memory.role == 'repair');
        var multi = _.filter(creepsinroom, (creep) => creep.memory.role == 'multi');
        //standard creep memory

        var containers = Game.rooms[roomname].find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        });
        var fullcontainers = Game.rooms[roomname].find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity() > 1900);
            }
        });


 








        if (!Game.creeps['erly1' + roomname] || (!Game.creeps['erly2' + roomname]))
        {
          
                memstruct.tasklist = [
                    ["pickupDroppedEnergy"],
                    ["harvest", Memory.botarena.rooms[roomname].source1ID],
                     ["fillTowers"],
                    ["fillspawn"],
                    ["fillext"],
                    ["buildGeneral"],
                    ["upgrade"],
                    ["repeat", 6]
                ]
                var bpodyparts = [MOVE, MOVE, WORK, CARRY];

                if (energycurrentlyavailable >= 400)
                {
                    bpodyparts.push(WORK)

                    bpodyparts.push(MOVE)
                }

                Game.spawns[roomname].spawnCreep(bpodyparts, 'erly2' + roomname,
                {
                    memory:
                    {
                        role: 'multi',
                        cpuUsed: 0,
                        roomtarg: roomname,
                        sourcetarget: 0,
                        full: false,
                        memstruct: memstruct
                    }
                });

            
            memstruct.tasklist = [
                ["pickupDroppedEnergy"],
                ["harvest", Memory.botarena.rooms[roomname].source1ID],
                ["fillspawn"],
                ["fillext"],
                ["buildGeneral"],
                ["upgrade"],
                ["repeat", 6]
            ]
            var bpodyparts = [MOVE, MOVE, WORK, CARRY];

            if (energycurrentlyavailable >= 400)
            {
                bpodyparts.push(WORK)

                bpodyparts.push(MOVE)
            }

            Game.spawns[roomname].spawnCreep(bpodyparts, 'erly1' + roomname,
            {
                memory:
                {
                    role: 'multi',
                    cpuUsed: 0,
                    roomtarg: roomname,
                    sourcetarget: 0,
                    full: false,
                    memstruct: memstruct
                }
            });

        }
        else if (energyavailable < 750 && (!Game.creeps['erly4' + roomname] || !Game.creeps['erly3' + roomname]) && containers.length != 3)
        {
   
            memstruct.tasklist = [
                ["harvest", Memory.botarena.rooms[roomname].source1ID],
                ["repeat", 1]
            ]
            var bpodyparts = [MOVE, WORK, WORK];
            if (energyavailable == 350)
            {
                bpodyparts.push(WORK)

            }
            if (energyavailable == 450)
            {
                bpodyparts.push(WORK)

            }
            if (energyavailable == 550)
            {
                bpodyparts.push(WORK)

            }

            Game.spawns[roomname].spawnCreep(bpodyparts, 'erly3' + roomname,
            {
                memory:
                {
                    role: 'multi',
                    cpuUsed: 0,
                    roomtarg: roomname,
                    sourcetarget: 0,
                    full: false,
                    memstruct: memstruct
                }
            });
            memstruct.tasklist = [
                ["harvest", Memory.botarena.rooms[roomname].source1ID],
                ["repeat", 1]
            ]
            Game.spawns[roomname].spawnCreep(bpodyparts, 'erly4' + roomname,
            {
                memory:
                {
                    role: 'multi',
                    cpuUsed: 0,
                    roomtarg: roomname,
                    sourcetarget: 1,
                    full: false,
                    memstruct: memstruct
                }
            });

        }
        else if ( (!Game.creeps['erlyd01' + roomname] || !Game.creeps['erlyd02' + roomname]) && containers.length != 3)
        {
 
            memstruct.tasklist = [
                ["harvest", Memory.botarena.rooms[roomname].source0ID],
                ["repeat", 1]
            ]
            var bpodyparts = [MOVE, WORK, WORK];
            if (energyavailable == 350)
            {
                bpodyparts.push(WORK)

            }
            if (energyavailable == 450)
            {
                bpodyparts.push(WORK)

            }
            if (energyavailable == 550)
            {
                bpodyparts.push(WORK)

            }

            Game.spawns[roomname].spawnCreep(bpodyparts, 'erlyd01' + roomname,
            {
                memory:
                {
                    role: 'multi',
                    cpuUsed: 0,
                    roomtarg: roomname,
                    sourcetarget: 0,
                    full: false,
                    memstruct: memstruct
                }
            });
            memstruct.tasklist = [
                ["harvest", Memory.botarena.rooms[roomname].source0ID],
                ["repeat", 1]
            ]
            Game.spawns[roomname].spawnCreep(bpodyparts, 'erlyd02' + roomname,
            {
                memory:
                {
                    role: 'multi',
                    cpuUsed: 0,
                    roomtarg: roomname,
                    sourcetarget: 1,
                    full: false,
                    memstruct: memstruct
                }
            });

        }
        else if (!Game.creeps['erlym' + roomname] && movers.length == 0)
        {
   
            var bpodyparts = [MOVE, MOVE, CARRY, MOVE, CARRY, CARRY];

            memstruct.tasklist = [
                ["pickupDroppedEnergy"],
                ["fillspawn"],
                ["fillext"],
                ["repeat", 3]
            ];
            Game.spawns[roomname].spawnCreep(bpodyparts, 'erlym' + roomname,
            {
                memory:
                {
                    role: 'multi',
                    cpuUsed: 0,
                    roomtarg: roomname,
                    sourcetarget: 1,
                    full: false,
                    memstruct: memstruct
                }
            });

        }
        else if ((!Game.creeps['mover' + roomname] || !Game.creeps['mover1' + roomname])  && containers.length != 0)
        {
           
            memstruct.opportuniticRenew = false

            var bpodyparts = [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY];
            var numberofparts = Math.floor((energycurrentlyavailable - 300) / 100);
            if (numberofparts > 20)
            {
                numberofparts = 20;
            }
            for (let j = 0; j < numberofparts; j++)
            {
                bpodyparts.push(CARRY);
                bpodyparts.push(MOVE);
            }

            Game.spawns[roomname].spawnCreep(bpodyparts, 'mover' + roomname  ,
            {
                memory:
                {
                    role: 'mover',
                    cpuUsed: 0,
                    roomtarg: roomname,
                    sourcetarget: Game.time % 2,
                    full: false,
                    memstruct: memstruct
                }
            });
            
            Game.spawns[roomname].spawnCreep(bpodyparts, 'mover1' + roomname  ,
            {
                memory:
                {
                    role: 'mover',
                    cpuUsed: 0,
                    roomtarg: roomname,
                    sourcetarget: Game.time % 2,
                    full: false,
                    memstruct: memstruct
                }
            });            
            
            
            
            
            
            

        }
        else if (energyavailable >= 550 && harvesters.length < 2)
        {

            var workheavybody = [MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY]

            var numberofparts = Math.floor((energyavailable - 550) / 125);
            if (numberofparts > 20)
            {
                numberofparts = 20;
            }
            for (let j = 0; j < numberofparts; j++)
            {

                workheavybody.push(WORK);
            }
            for (let j = 0; j < Math.floor(numberofparts / 2); j++)
            {

                workheavybody.push(MOVE);
            }

            if (!Game.creeps['harvester0' + roomname] && !Game.creeps['altharvester0' + roomname])
            {
                Game.spawns[roomname].spawnCreep(workheavybody, 'harvester0' + roomname,
                {
                    memory:
                    {
                        role: 'harvester',

                        sourcetarget: 0,
                        full: false,
                        memstruct: memstruct
                    }
                });
            }
            else
            {

                if (Game.creeps['harvester0' + roomname] && Game.creeps['harvester0' + roomname].ticksToLive < 55)
                {
                    Game.spawns[roomname].spawnCreep(workheavybody, 'altharvester0' + roomname,
                    {
                        memory:
                        {
                            role: 'harvester',

                            sourcetarget: 0,
                            full: false,
                            memstruct: memstruct
                        }
                    });
                }
                if (Game.creeps['altharvester0' + roomname] && Game.creeps['altharvester0' + roomname].ticksToLive < 55)
                {
                    Game.spawns[roomname].spawnCreep(workheavybody, 'harvester0' + roomname,
                    {
                        memory:
                        {
                            role: 'harvester',

                            sourcetarget: 0,
                            full: false,
                            memstruct: memstruct
                        }
                    });
                }

            }

            //memstruct.tasklist = [
            //    ["requestPulltosource",1] 
            //]
            if (!Game.creeps['harvester1' + roomname] && !Game.creeps['altharvester1' + roomname])
            {
                Game.spawns[roomname].spawnCreep(workheavybody, 'harvester1' + roomname,
                {
                    memory:
                    {
                        role: 'harvester',

                        sourcetarget: 1,
                        full: false,
                        memstruct: memstruct
                    }
                });
            }
            else
            {

                if (Game.creeps['harvester1' + roomname] && Game.creeps['harvester1' + roomname].ticksToLive < 55)
                {
                    Game.spawns[roomname].spawnCreep(workheavybody, 'altharvester1' + roomname,
                    {
                        memory:
                        {
                            role: 'harvester',

                            sourcetarget: 1,
                            full: false,
                            memstruct: memstruct
                        }
                    });
                }
                if (Game.creeps['altharvester1' + roomname] && Game.creeps['altharvester1' + roomname].ticksToLive < 55)
                {
                    Game.spawns[roomname].spawnCreep(workheavybody, 'harvester1' + roomname,
                    {
                        memory:
                        {
                            role: 'harvester',

                            sourcetarget: 1,
                            full: false,
                            memstruct: memstruct
                        }
                    });
                }

            }

        }
        else if (upgraders.length < 5 && droppedresources.length != 0 && containers.length != 3)
        {
            //  console.log("spawn 0");

            var bpodyparts = [MOVE, MOVE, WORK, CARRY, CARRY];

            memstruct.tasklist = [
                ["pickupDroppedEnergy"],
                ["harvest"],
                ["fillspawn"],
                ["buildGeneral"],
                ["upgrade"],
                ["repeat", 5]
            ];

            for (let j = 0; j <= 9; j++)
            {
                Game.spawns[roomname].spawnCreep(bpodyparts, 'multiUP' + roomname + j,
                {
                    memory:
                    {
                        role: 'upgra',
                        cpuUsed: 0,
                        roomtarg: roomname,
                        sourcetarget: 1,
                        full: false,
                        memstruct: memstruct
                    }
                });

            }

        }
        else if (repairs.length < 3 || (repairs.length < 6 && levelOfController == 2))
        {
        memstruct.tasklist = [
                        ["withdrawContainersStorageLink"],
                        ["pickupDroppedEnergy"],
                        ["harvest"],
                        ["repairRampartsClosestToEnemy"],
                        ["repairRoadsAndContainers"],
                        ["nukeDefence"],
                        ["buildGeneral"],
                        ["RepLowestDefence"],
                        ["upgrade"],
                        ["repeat", 9]
                    ]
           
                    var bodyparts = [];
                    var numberofparts = Math.floor(energyavailable / 350);
                    if (numberofparts * 6 > 50)
                    {
                        numberofparts = Math.floor(50 / 6);
                    }
                    var bodyparts = [];
                    for (let q = 0; q < numberofparts; q++)
                    {
                        bodyparts.push(WORK);
                        bodyparts.push(CARRY);
                        bodyparts.push(CARRY);
                        bodyparts.push(MOVE);
                        bodyparts.push(MOVE);
                        bodyparts.push(MOVE);
                    }

               

            for (let q = 0; q < 6; q++)
            {
                Game.spawns[roomname].spawnCreep(bodyparts, 'repair' + roomname + q,
                {
                    memory:
                    {
                        role: 'repair',
                        cpuUsed: 0,
                        roomtarg: roomname,
                        sourcetarget: Game.time % 2,
                        full: false,
                        memstruct: memstruct
                    }
                });
            }
        }
        else if (!Game.creeps['upgrader' + roomname])
        {
            // console.log("spawn 3");
            if (energyavailable >= 550)
            {

                var bodyparts = [MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY];
            }
            else
            {
                var bodyparts = [MOVE, WORK, WORK, CARRY];
            }

            Game.spawns[roomname].spawnCreep(bodyparts, 'upgrader' + roomname,
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
        else if (!Game.creeps['scoutobs' + roomname])
        {
 
            Game.spawns[roomname].spawnCreep([MOVE], 'scoutobs' + roomname,
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
        else if (!Game.creeps['scoutobs1' + roomname])
        {

            Game.spawns[roomname].spawnCreep([MOVE], 'scoutobs1' + roomname,
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
        else if (!Game.creeps['scoutobs2' + roomname])
        {

            Game.spawns[roomname].spawnCreep([MOVE], 'scoutobs2' + roomname,
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

        else if ((!Game.creeps['upgrader2' + roomname] || !Game.creeps['upgrader3' + roomname]) && energyavailable >= 550 && containers.length == 3)
        {

            memstruct.tasklist = [
                ["withdrawControllerContainer"],
                ["upgrade"],
                ["repeat", 2]
            ]

            var bodyparts = [MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY];
            if (energyavailable >= 650)
            {
                bodyparts.push(WORK)

            }
            Game.spawns[roomname].spawnCreep(bodyparts, 'upgrader2' + roomname,
            {
                memory:
                {
                    role: 'upgrader',
                    cpuUsed: 0,
                    full: false,
                    memstruct: memstruct
                }
            });

            Game.spawns[roomname].spawnCreep(bodyparts, 'upgrader3' + roomname,
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
        else if (energyavailable >= 550 && containers.length == 3 && (!Game.creeps['upgrader41' + roomname] || !Game.creeps['upgrader51' + roomname]))
        {
            memstruct.tasklist = [
                ["withdrawControllerContainer"],
                ["upgrade"],
                ["repeat", 2]
            ]
            var bpodyparts = [MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY]
            if (energyavailable >= 650)
            {
                bpodyparts.push(WORK)

            }

            if (energyavailable >= 750)
            {
                bpodyparts.push(WORK)

            }

            Game.spawns[roomname].spawnCreep(bpodyparts, 'upgrader41' + roomname,
            {
                memory:
                {
                    role: 'mover',
                    cpuUsed: 0,
                    roomtarg: roomname,
                    sourcetarget: Game.time % 2,
                    full: false,
                    memstruct: memstruct
                }
            });

            Game.spawns[roomname].spawnCreep(bpodyparts, 'upgrader51' + roomname,
            {
                memory:
                {
                    role: 'mover',
                    cpuUsed: 0,
                    roomtarg: roomname,
                    sourcetarget: Game.time % 2,
                    full: false,
                    memstruct: memstruct
                }
            });

        }
        else if (fullcontainers.length > 0 && movers.length < 7)
        {

            var bpodyparts = [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY];
            var numberofparts = Math.floor((energyavailable - 300) / 100);
            if (numberofparts > 20)
            {
                numberofparts = 20;
            }
            for (let j = 0; j < numberofparts; j++)
            {
                bpodyparts.push(CARRY);
                bpodyparts.push(MOVE);
            }

            Game.spawns[roomname].spawnCreep(bpodyparts, 'mover1' + roomname,
            {
                memory:
                {
                    role: 'mover',
                    cpuUsed: 0,
                    roomtarg: roomname,
                    sourcetarget: Game.time % 2,
                    full: false,
                    memstruct: memstruct
                }
            });

            Game.spawns[roomname].spawnCreep(bpodyparts, 'mover2' + roomname,
            {
                memory:
                {
                    role: 'mover',
                    cpuUsed: 0,
                    roomtarg: roomname,
                    sourcetarget: Game.time % 2,
                    full: false,
                    memstruct: memstruct
                }
            });

            Game.spawns[roomname].spawnCreep(bpodyparts, 'mover3' + roomname,
            {
                memory:
                {
                    role: 'mover',
                    cpuUsed: 0,
                    roomtarg: roomname,
                    sourcetarget: Game.time % 2,
                    full: false,
                    memstruct: memstruct
                }
            });

            Game.spawns[roomname].spawnCreep(bpodyparts, 'mover4' + roomname,
            {
                memory:
                {
                    role: 'mover',
                    cpuUsed: 0,
                    roomtarg: roomname,
                    sourcetarget: Game.time % 2,
                    full: false,
                    memstruct: memstruct
                }
            });

            Game.spawns[roomname].spawnCreep(bpodyparts, 'mover5' + roomname,
            {
                memory:
                {
                    role: 'mover',
                    cpuUsed: 0,
                    roomtarg: roomname,
                    sourcetarget: Game.time % 2,
                    full: false,
                    memstruct: memstruct
                }
            });
            Game.spawns[roomname].spawnCreep(bpodyparts, 'mover6' + roomname,
            {
                memory:
                {
                    role: 'mover',
                    cpuUsed: 0,
                    roomtarg: roomname,
                    sourcetarget: Game.time % 2,
                    full: false,
                    memstruct: memstruct
                }
            });

        }

        else if (containers.length != 0) // ad condition for roomlist being long enough
        {

            var bodyparts = [MOVE, MOVE, WORK, WORK]
            var numberofparts = Math.floor((energyavailable - 300) / 150);
            if (numberofparts > 4)
            {
                numberofparts = 4;
            }
            for (let j = 0; j < numberofparts; j++)
            {
                bodyparts.push(WORK);
                bodyparts.push(MOVE);
            }

            var viableROoms = [];
            var harvestrooms = []
            var scoutedRooms = Object.keys(Memory.roomlist);
            for (var i = 0; i < scoutedRooms.length; i++)
            {
                if (Memory.roomlist[scoutedRooms[i]].distanceFromHomeRoom < 80 && Memory.roomlist[scoutedRooms[i]].dangerLevel == 2)
                {
                    harvestrooms.push(scoutedRooms[i]);
                }
            }
            
            for (let j = 0; j < harvestrooms.length; j++)
            {

                for (let qj = 0; qj < Memory.roomlist[harvestrooms[j]].SourceIDs.length; qj++)
                {
                    let finalPath = []
                    var rawPath = roompathfind.run(harvestrooms[j], roomname, 2);
                    for (var q = 0; q < rawPath.length; q++)
                    {
                        finalPath.push(["forcemoveToRoom", rawPath[q]])
                    }

                    finalPath.push(["harvestNextRoom", Memory.roomlist[harvestrooms[j]].SourceIDs[qj]])
                    memstruct.tasklist = finalPath
                    Game.spawns[roomname].spawnCreep(bodyparts, (harvestrooms[j] + "-" + Memory.roomlist[harvestrooms[j]].SourceIDs[qj]),
                    {
                        memory:
                        {
                            role: 'multi',
                            cpuUsed: 0,
                            full: false,
                            memstruct: memstruct
                        }
                    });

                }

            }
        }

        //          run towers
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        //          run basic defcon
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

    }
}
module.exports = roomControllerBotArena;