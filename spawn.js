var spwan = {

    run: function(roomname, storagevalue, roomExits, creepsinroom)
    {
        var targeth = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS);

        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        ///////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        if (Game.spawns[roomname + "1"] != undefined)
        {
            if (Game.spawns[roomname + "1"].spawning)
            {
                if (Game.spawns[roomname + "1"].spawning.name == 'resourcemover' + roomname)
                {
                    Game.spawns[roomname + "1"].spawning.setDirections([BOTTOM]);
                }
                else
                {
                    Game.spawns[roomname + "1"].spawning.setDirections([TOP, TOP_LEFT, TOP_RIGHT]);
                }
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (Game.spawns[roomname] != undefined && Game.spawns[roomname].spawning)
        {
            if (Game.spawns[roomname].spawning.name == 'towermover' + roomname)
            {
                Game.spawns[roomname].spawning.setDirections([TOP_LEFT]);
            }
            else if (Game.rooms[roomname].controller.level < 8)
            {
                Game.spawns[roomname].spawning.setDirections([RIGHT, LEFT, TOP, BOTTOM_RIGHT, BOTTOM]);
            }
            else
            {
                Game.spawns[roomname].spawning.setDirections([RIGHT, BOTTOM_RIGHT, BOTTOM]);
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (Game.spawns[roomname + "2"] != undefined)
        {
            if (Game.spawns[roomname + "2"].spawning)
            {
                Game.spawns[roomname + "2"].spawning.setDirections([TOP_LEFT, BOTTOM_RIGHT, RIGHT]);
            }
        }

        for (var i = 0; i < spawnss.length; i++)
        {
            if (spawnss[i].spawning && spawnss[i].spawning.remainingTime < 2)
            {
                var ajacentcreepstorenew = spawnss[i].pos.findInRange(FIND_MY_CREEPS, 1);
                for (var q = 0; q < ajacentcreepstorenew.length; q++)
                {
                    ajacentcreepstorenew[q].moveTo(new RoomPosition(0, 0, roomname));
                }

            }

        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;

        for (var i = 0; i < spawnss.length; i++)
        {
            //       try{
            var ajacentcreepstorenew = spawnss[i].pos.findInRange(FIND_MY_CREEPS, 1,
            {
                filter: (creep) =>
                {
                    return (creep.memory.memstruct.boosted == false && (creep.memory.memstruct.opportuniticRenew == true || creep.memory.memstruct.moveToRenew == true) && creep.ticksToLive < 1490);
                }
            });
            if (ajacentcreepstorenew.length != 0 && storagevalue != 0 && energyavailable > 1000)
            {
                spawnss[i].renewCreep(ajacentcreepstorenew[0]);
            }
        }
        var levelOfController = Game.rooms[roomname].controller.level;
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // console.log(roomname, " creepsinroom.length ", creepsinroom.length  );
        var harvesters = _.filter(creepsinroom, (creep) => creep.memory.role == 'harvester');

        if (Game.time % 30 == 0 || levelOfController < 4 || creepsinroom.length < 4 || harvesters.length == 0)
        {

            var energycurrentlyavailable = Game.rooms[roomname].energyAvailable;

            var harvesters = _.filter(creepsinroom, (creep) => creep.memory.role == 'harvester');

            var movers = _.filter(creepsinroom, (creep) => creep.memory.role == 'mover');

            //standard creep memory
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
            Game.flags[roomname].memory.flagstruct.spawnfree = true;
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var wallsBreeched = false;
            var targetsInsideWalls = Game.flags[roomname].pos.findInRange(FIND_HOSTILE_CREEPS, 7);
            if (targetsInsideWalls.length != 0)
            {
                wallsBreeched = true;
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
            var extractorneeded = false;
            if (spawnss.length != 0 && targeth.length == 0)
            {
                var minerals = Game.rooms[roomname].find(FIND_MINERALS)[0].mineralAmount;
                if (minerals > 0)
                {
                    extractorneeded = true;
                }
            }
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (Memory.empire == undefined)
            {
                Memory.empire = {};
            }
            if (Memory.empire.roomsobj == undefined)
            {
                Memory.empire.roomsobj = {};
            }
            if (Memory.empire.roomsobj[roomname] == undefined)
            {
                Memory.empire.roomsobj[roomname] = {}
            }
            if (Memory.empire.roomsobj[roomname].moversobj == undefined)
            {
                console.log("creating moverObj");
                Memory.empire.roomsobj[roomname].moversobj = {
                    numberOfMoveres: 1,
                    ticksSinceLastCall: 0,
                    ticksOfNeeded: 0

                }
            }

            var roomObj = Game.rooms[roomname];
            var containers = roomObj.find(FIND_STRUCTURES,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 1800);
                }
            });

            var droppedresources = roomObj.find(FIND_DROPPED_RESOURCES,
            {
                filter: (res) =>
                {
                    return (res.amount > 1000);
                }
            });
            var mineroomsneedmovers = false;

            for (var i = 0; i < Memory.empire.roomsobj[roomname].MineRooms.length; i++)
            {
                var checkroom = Memory.empire.roomsobj[roomname].MineRooms[i]

                if (Game.rooms[checkroom] == undefined)
                {

                }
                else
                {

                    var containers = Game.rooms[checkroom].find(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 1800);
                        }
                    });

                    var droppedresources = Game.rooms[checkroom].find(FIND_DROPPED_RESOURCES,
                    {
                        filter: (res) =>
                        {
                            return (res.amount > 1000);
                        }
                    });

                    var tombstones = Game.rooms[checkroom].find(FIND_TOMBSTONES,
                    {
                        filter: (tomb) =>
                        {
                            return (tomb.store.getUsedCapacity() != tomb.store.getUsedCapacity(RESOURCE_ENERGY)) || (tomb.store.getUsedCapacity(RESOURCE_ENERGY) > 300);
                        }
                    });

                    if (containers.length != 0 || droppedresources.length != 0 || tombstones.length != 0)
                    {
                        mineroomsneedmovers = true;
                    }

                }
            }

            for (var i = 0; i < Memory.empire.roomsobj[roomname].centerroomsinrange.length; i++)
            {
                var checkroom = Memory.empire.roomsobj[roomname].centerroomsinrange[i]
                if (Game.rooms[checkroom] == undefined)
                {

                }
                else
                {

                    var containers = [];
                    //var roomname = creep.room.name;

                    var container1 = Game.flags[roomname + "container1"];

                    var input = Game.rooms[roomname].lookForAt(LOOK_STRUCTURES, container1.pos);

                    for (var i = 0; i < input.length; i++)
                    {
                        if (input[i].structureType == STRUCTURE_CONTAINER)
                        {
                            if (input[i].store.getUsedCapacity(RESOURCE_ENERGY) > 1800)
                            {
                                containers.push(input[i]);
                            }
                        }
                    }

                    var container0 = Game.flags[roomname + "container0"];

                    var input = Game.rooms[roomname].lookForAt(LOOK_STRUCTURES, container0.pos);

                    for (var i = 0; i < input.length; i++)
                    {
                        if (input[i].structureType == STRUCTURE_CONTAINER)
                        {
                            if (input[i].store.getUsedCapacity(RESOURCE_ENERGY) > 1800)
                            {
                                containers.push(input[i]);
                            }
                        }
                    }

                    var droppedresources = Game.rooms[checkroom].find(FIND_DROPPED_RESOURCES,
                    {
                        filter: (res) =>
                        {
                            return (res.amount > 1000);
                        }
                    });

                    var tombstones = Game.rooms[checkroom].find(FIND_TOMBSTONES,
                    {
                        filter: (tomb) =>
                        {
                            return (tomb.store.getUsedCapacity() != tomb.store.getUsedCapacity(RESOURCE_ENERGY)) || (tomb.store.getUsedCapacity(RESOURCE_ENERGY) > 300);
                        }
                    });

                    if (containers.length != 0 || droppedresources.length != 0 || tombstones.length != 0)
                    {
                        mineroomsneedmovers = true;
                    }

                }
            }
            // mineroomsneedmovers = false;
            if ((containers.length > 0 || droppedresources.length > 0 || mineroomsneedmovers == true) && movers.length == Memory.empire.roomsobj[roomname].moversobj.numberOfMoveres)
            {
                if (Memory.empire.roomsobj[roomname].moversobj.ticksOfNeeded > 15)
                {
                    Memory.empire.roomsobj[roomname].moversobj.ticksSinceLastCall = 0
                }
                Memory.empire.roomsobj[roomname].moversobj.ticksOfNeeded = Memory.empire.roomsobj[roomname].moversobj.ticksOfNeeded + 1;
            }
            else if (movers.length >= Memory.empire.roomsobj[roomname].moversobj.numberOfMoveres)
            {
                if (Memory.empire.roomsobj[roomname].moversobj.ticksSinceLastCall > 15)
                {
                    Memory.empire.roomsobj[roomname].moversobj.ticksOfNeeded = 0
                }

                Memory.empire.roomsobj[roomname].moversobj.ticksSinceLastCall = Memory.empire.roomsobj[roomname].moversobj.ticksSinceLastCall + 1;
            }

            if (Memory.empire.roomsobj[roomname].moversobj.ticksOfNeeded > 50)
            {

                Memory.empire.roomsobj[roomname].moversobj.ticksOfNeeded = 0

                Memory.empire.roomsobj[roomname].moversobj.numberOfMoveres = Memory.empire.roomsobj[roomname].moversobj.numberOfMoveres + 1
            }

            if (Memory.empire.roomsobj[roomname].moversobj.ticksSinceLastCall > 50)
            {
                Memory.empire.roomsobj[roomname].moversobj.ticksSinceLastCall = 0
                Memory.empire.roomsobj[roomname].moversobj.numberOfMoveres = Memory.empire.roomsobj[roomname].moversobj.numberOfMoveres - 1
            }

            if (Memory.empire.roomsobj[roomname].moversobj.numberOfMoveres < 1 + Memory.empire.roomsobj[roomname].MineRooms.length + (Memory.empire.roomsobj[roomname].centerroomsinrange.length * 2))
            {
                Memory.empire.roomsobj[roomname].moversobj.numberOfMoveres = 1 + Memory.empire.roomsobj[roomname].MineRooms.length + (Memory.empire.roomsobj[roomname].centerroomsinrange.length * 2)
            }
            Memory.empire.roomsobj[roomname].moversobj.numberOfMoveres = 1 + Memory.empire.roomsobj[roomname].MineRooms.length + (Memory.empire.roomsobj[roomname].centerroomsinrange.length * 2)
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            for (var i = 0; i < spawnss.length; i++)
            {
                if (!Game.creeps['towermover' + roomname] && spawnss[i].name == roomname && levelOfController >= 4 && storagevalue != 0 && energycurrentlyavailable < 500)
                {
                    //   console.log('towermover',roomname);
                    memstruct.opportuniticRenew = false
                    var bpodyparts = [CARRY];
                    spawnss[i].spawnCreep(bpodyparts, 'towermover' + roomname,
                    {
                        memory:
                        {
                            memstruct: memstruct,
                            role: 'towermover',
                            working: false
                        }
                    });

                }

                else if (movers.length == 0)
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
                  
                    spawnss[i].spawnCreep(bpodyparts, 'mover' + roomname + Game.time,
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

                else if (harvesters.length < 2)
                {

                    var ecotrouble = false;

                    var workheavybody = [];

                    if (levelOfController == 1)
                    {
                        workheavybody = [MOVE, WORK, WORK, CARRY];
                    }
                    else if (levelOfController == 2 && Game.rooms[roomname].energyCapacityAvailable >= 550)
                    {
                        workheavybody = [MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY];
                    }
                    else if (levelOfController == 3 && Game.rooms[roomname].energyCapacityAvailable >= 750)
                    {
                        workheavybody = [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY];
                    }
                    else if (levelOfController > 3 && Game.rooms[roomname].energyCapacityAvailable >= 1000)
                    {
                        workheavybody = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY]
                    }
                    else
                    {
                        workheavybody = [MOVE, WORK, WORK, CARRY];
                    }

                    var boostharvesters = false;
                    var powerCreepList = Game.rooms[roomname].find(FIND_MY_POWER_CREEPS);
                    if (powerCreepList != undefined)
                    {
                        for (var PP = 0; PP < powerCreepList.length; PP++)
                        {
                            if (powerCreepList[PP].powers[PWR_REGEN_SOURCE] != undefined)
                            {
                                boostharvesters = true;
                            }
                        }
                    }
                    if (boostharvesters)
                    {
                        workheavybody = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY];
                    }

                    if (!Game.creeps['harvester0' + roomname] && !Game.creeps['altharvester0' + roomname])
                    {
                        spawnss[i].spawnCreep(workheavybody, 'harvester0' + roomname,
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

                        if (Game.creeps['harvester0' + roomname] && Game.creeps['harvester0' + roomname].ticksToLive < 100)
                        {
                            spawnss[i].spawnCreep(workheavybody, 'altharvester0' + roomname,
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
                        if (Game.creeps['altharvester0' + roomname] && Game.creeps['altharvester0' + roomname].ticksToLive < 100)
                        {
                            spawnss[i].spawnCreep(workheavybody, 'harvester0' + roomname,
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

                    if (!Game.creeps['harvester1' + roomname] && !Game.creeps['altharvester1' + roomname])
                    {
                        spawnss[i].spawnCreep(workheavybody, 'harvester1' + roomname,
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

                        if (Game.creeps['harvester1' + roomname] && Game.creeps['harvester1' + roomname].ticksToLive < 100)
                        {
                            spawnss[i].spawnCreep(workheavybody, 'altharvester1' + roomname,
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
                        if (Game.creeps['altharvester1' + roomname] && Game.creeps['altharvester1' + roomname].ticksToLive < 100)
                        {
                            spawnss[i].spawnCreep(workheavybody, 'harvester1' + roomname,
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
                else if (!Game.creeps['towermover' + roomname] && spawnss[i].name == roomname && levelOfController >= 4 && storagevalue != 0)
                {
                    //   console.log('towermover',roomname);
                    var nukeIncoming = Game.rooms[roomname].find(FIND_NUKES);
                    var bpodyparts = [CARRY, CARRY, CARRY, CARRY];

                    if (storagevalue > 950000 && levelOfController < 6)
                    {
                        bpodyparts = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
                    }

                    if (storagevalue > 300000 && levelOfController < 8)
                    {
                        bpodyparts = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
                    }

                    if (energyavailable == 300)
                    {
                        bpodyparts = [CARRY, CARRY, WORK, CARRY, CARRY];
                    }

                    if (storagevalue > 950000 && levelOfController > 5 || nukeIncoming.length != 0)
                    {
                        bpodyparts = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
                        var numberofparts = Math.floor((energyavailable - 1000) / 100);
                        if (numberofparts > 40)
                        {
                            numberofparts = 40;
                        }
                        for (let j = 0; j < numberofparts; j++)
                        {
                            bpodyparts.push(WORK);
                        }
                    }
                    if (nukeIncoming.length != 0 && !wallsBreeched)
                    {
                        
                        
                        if (Game.rooms[roomname].controller.level > 6)
                        {
                            bpodyparts = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
                        }
                        
                        
                        
                        
                        
                        
                        
                        if (Game.rooms[roomname].controller.level == 6)
                        {
                            bpodyparts = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
                        }
                        if (Game.rooms[roomname].controller.level == 5)
                        {
                            bpodyparts = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY];
                        }
                        
                        
                        
                        
                        if (Game.rooms[roomname].controller.level == 8 && Game.flags[roomname + "AltTower"] != undefined)
                        {
                            memstruct.tasklist.push(["boost","XLH2O",30]) 
                              memstruct.tasklist.push(["boost","XZHO2",5])
                            bpodyparts = [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY]
                        }
                        
                        
                    }
                    
                    
                    
                    
                    
                    
                    
                    

                    spawnss[i].spawnCreep(bpodyparts, 'towermover' + roomname,
                    {
                        memory:
                        {
                            memstruct: memstruct,
                            role: 'towermover',
                            working: false
                        }
                    });
                }

                else if (!Game.creeps['towermoveralt' + roomname] && Game.flags[roomname + "AltTower"] != undefined && levelOfController >= 4 && storagevalue != 0)
                {
                    //   console.log('towermover',roomname);
                    var nukeIncoming = Game.rooms[roomname].find(FIND_NUKES);

                    var bpodyparts = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];

                    spawnss[i].spawnCreep(bpodyparts, 'towermoveralt' + roomname,
                    {
                        memory:
                        {
                            memstruct: memstruct,
                            role: 'towermover',
                            working: false
                        }
                    });
                }

                else if (!Game.creeps['resourcemover' + roomname] && levelOfController > 5 && Game.rooms[roomname].terminal != undefined)
                {
                    if (levelOfController == 8 && spawnss[i].name == roomname + "1")
                    {
                        var bodyparts = [MOVE];
                        for (let j = 0; j < 35; j++)
                        {
                            bodyparts.push(CARRY);
                        }

                        spawnss[i].spawnCreep(bodyparts, 'resourcemover' + roomname,
                        {
                            memory:
                            {
                                role: 'resmover',
                                memstruct: memstruct
                            }
                        });
                    }
                    else if (levelOfController < 8)
                    {
                        spawnss[i].spawnCreep([MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], 'resourcemover' + roomname,
                        {
                            memory:
                            {
                                role: 'resmover',
                                memstruct: memstruct
                            }
                        });
                    }
                }

                else if (movers.length < Memory.empire.roomsobj[roomname].moversobj.numberOfMoveres)
                {
                    var bodyparts = [];
                    var numberofparts = Math.floor(Game.rooms[roomname].energyCapacityAvailable / 100);
                    if (numberofparts * 2 > 50)
                    {
                        numberofparts = Math.floor(50 / 2);
                    }
                    var bodyparts = [];
                    for (let q = 0; q < numberofparts; q++)
                    {
                        bodyparts.push(CARRY);
                        bodyparts.push(MOVE);
                    }
                    for (let q = 0; q < Memory.empire.roomsobj[roomname].moversobj.numberOfMoveres; q++)
                    {
                        spawnss[i].spawnCreep(bodyparts, 'mover' + roomname + q,
                        {
                            memory:
                            {
                                role: 'mover',
                                cpuUsed: 0,
                                roomtarg: roomname,

                                full: false,
                                memstruct: memstruct
                            }
                        });
                    }

                }

                else if ((!Game.creeps['repair' + roomname] || energyavailable < 900) && targeth.length == 0)
                {
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

                    if (energyavailable < 900)
                    {

                        bodyparts = [MOVE, MOVE, MOVE, WORK, CARRY];
                        spawnss[i].spawnCreep(bodyparts, 'repair1' + roomname,
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
                        spawnss[i].spawnCreep(bodyparts, 'repair2' + roomname,
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
                        spawnss[i].spawnCreep(bodyparts, 'repair3' + roomname,
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
   memstruct.tasklist.push(["boost","LH",numberofparts])
                    spawnss[i].spawnCreep(bodyparts, 'repair' + roomname,
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

                else if (!Game.creeps['upgrader' + roomname])
                {

                    var bodyparts = [];

                    if (levelOfController < 3)
                    {
                        bodyparts = [MOVE, WORK, WORK, CARRY];
                    }

                    if (levelOfController == 4)
                    {
                        bodyparts = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY];
                    }
                    if (levelOfController == 5)
                    {
                        bodyparts = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY];
                    }

                    var term = Game.rooms[roomname].terminal;

                    if (levelOfController == 6)
                    {
                        bodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];

                        if (term != undefined && term.store.getUsedCapacity("XGH2O") > 500)
                        {
                            memstruct.tasklist.push(["boost", "XGH2O", 15]);
                        }

                    }
                    if (levelOfController == 7)
                    {
                        bodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];

                        if (term != undefined && term.store.getUsedCapacity("XGH2O") > 900)
                        {
                            memstruct.tasklist.push(["boost", "XGH2O", 25]);
                        }

                    }
                    if (levelOfController == 8)
                    {
                        bodyparts = [MOVE, MOVE, WORK, CARRY];
                    }

                    //  memstruct.tasklist = [["booost", "GH2O", ]];

                    spawnss[i].spawnCreep(bodyparts, 'upgrader' + roomname,
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
                else if (!Game.creeps['scoutobs' + roomname] && Game.rooms[roomname].controller.level > 3)
                {

                    spawnss[i].spawnCreep([MOVE], 'scoutobs' + roomname,
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
                else if (!Game.creeps['extractor' + roomname] && extractorneeded && levelOfController >= 6)
                {
                    var numberofparts = Math.floor(energyavailable / 350);
                    if (numberofparts > 8)
                    {
                        numberofparts = 8;
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
                    spawnss[i].spawnCreep(bodyparts, 'extractor' + roomname,
                    {
                        memory:
                        {
                            role: 'extractor',
                            cpuUsed: 0,
                            depositId: false,
                            mineralType: "",
                            roomtarg: roomname,
                            sourcetarget: Game.time % 2,
                            full: false,
                            memstruct: memstruct
                        }
                    });
                }

                else
                {
                    Game.flags[roomname].memory.flagstruct.spawnfree = true;
                }
            }

        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }
}
module.exports = spwan;