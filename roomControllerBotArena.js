var tower = require('tower');
var roles = require('roles');

var roomControllerBotArena = {
    run: function(roomname)
    {

        //          run basicBuild 
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        var levelOfRoom = Game.rooms[roomname].controller.level;
        var mainspawn = Game.rooms[roomname].find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_SPAWN);
            }
        });
        var ext = Game.rooms[roomname].find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_EXTENSION);
            }
        });
        
        
        
        
        
        
        
        
          var flag1 = Game.flags[roomname + "source1" ];
            var flag2 = Game.flags[roomname + "container1"];
        
          var flag11 = Game.flags[roomname + "source0" ];
            var flag22 = Game.flags[roomname + "container0" ];
        if(flag1 && flag11 && flag2 && flag22  )
        {
            if(flag1.pos.x == flag11.pos.x  && flag1.pos.y == flag11.pos.y  )
            {
                flag1.remove()
                flag11.remove()
                flag2.remove()
                flag22.remove()
            }
            
            
            
            
            
            
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        if (levelOfRoom == 2 && mainspawn.length != 0 && ext.length < 5)
        {

            Game.rooms[roomname].createConstructionSite(mainspawn[0].pos.x, mainspawn[0].pos.y + 2, STRUCTURE_EXTENSION);
            Game.rooms[roomname].createConstructionSite(mainspawn[0].pos.x, mainspawn[0].pos.y + 3, STRUCTURE_EXTENSION);

            Game.rooms[roomname].createConstructionSite(mainspawn[0].pos.x + 1, mainspawn[0].pos.y + 2, STRUCTURE_EXTENSION);
            Game.rooms[roomname].createConstructionSite(mainspawn[0].pos.x + 1, mainspawn[0].pos.y + 3, STRUCTURE_EXTENSION);

            Game.rooms[roomname].createConstructionSite(mainspawn[0].pos.x + 2, mainspawn[0].pos.y + 3, STRUCTURE_EXTENSION);
        }

        if (levelOfRoom == 3 && mainspawn.length != 0 && ext.length < 10)
        {

            Game.rooms[roomname].createConstructionSite(mainspawn[0].pos.x, mainspawn[0].pos.y + 2, STRUCTURE_EXTENSION);
            Game.rooms[roomname].createConstructionSite(mainspawn[0].pos.x, mainspawn[0].pos.y + 3, STRUCTURE_EXTENSION);

            Game.rooms[roomname].createConstructionSite(mainspawn[0].pos.x + 1, mainspawn[0].pos.y + 2, STRUCTURE_EXTENSION);
            Game.rooms[roomname].createConstructionSite(mainspawn[0].pos.x + 1, mainspawn[0].pos.y + 3, STRUCTURE_EXTENSION);

            Game.rooms[roomname].createConstructionSite(mainspawn[0].pos.x + 2, mainspawn[0].pos.y + 3, STRUCTURE_EXTENSION);

            Game.rooms[roomname].createConstructionSite(mainspawn[0].pos.x - 1, mainspawn[0].pos.y + 1, STRUCTURE_EXTENSION);
            Game.rooms[roomname].createConstructionSite(mainspawn[0].pos.x - 2, mainspawn[0].pos.y + 2, STRUCTURE_EXTENSION);
            Game.rooms[roomname].createConstructionSite(mainspawn[0].pos.x - 1, mainspawn[0].pos.y + 3, STRUCTURE_EXTENSION);

            Game.rooms[roomname].createConstructionSite(mainspawn[0].pos.x + 3, mainspawn[0].pos.y + 1, STRUCTURE_EXTENSION);

            Game.rooms[roomname].createConstructionSite(mainspawn[0].pos.x + 4, mainspawn[0].pos.y + 1, STRUCTURE_EXTENSION);
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

        if ((containers.length < 1 || levelOfController <= 3) && (!Game.creeps['erly1' + roomname] || !Game.creeps['erly2' + roomname]))
        {

            memstruct.tasklist = [
                ["harvest", 1],
                ["fillspawn"],
                ["buildGeneral"],
                ["upgrade"],
                ["repeat", 4]
            ]
            var bpodyparts = [MOVE, MOVE, WORK, CARRY];

            if (levelOfController == 2 && energycurrentlyavailable >= 400)
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
            memstruct.tasklist = [
                ["harvest", 0],
                ["fillspawn"],
                ["buildGeneral"],
                ["upgrade"],
                ["repeat", 4]
            ]
            Game.spawns[roomname].spawnCreep(bpodyparts, 'erly2' + roomname,
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
        else
        if (movers.length < 2 && containers.length != 0)
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

            Game.spawns[roomname].spawnCreep(bpodyparts, 'mover' + roomname + Game.time,
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
               Game.spawns[roomname].spawnCreep(bpodyparts, 'mover' + roomname + Game.time,
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



var workheavybody = [MOVE, WORK, WORK, CARRY];

             
            var numberofparts = Math.floor((energyavailable - 300) / 125);
            if (numberofparts > 20)
            {
                numberofparts = 20;
            }
            for (let j = 0; j < numberofparts; j++)
            {
                if(j % 2 == 0 )
                {
                  workheavybody.push(MOVE);  
                }
                workheavybody.push(WORK);
            }
          
            //memstruct.tasklist = [
            //    ["requestPulltosource", 0] 
            //]
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

                if (Game.creeps['harvester0' + roomname] && Game.creeps['harvester0' + roomname].ticksToLive < 100)
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
                if (Game.creeps['altharvester0' + roomname] && Game.creeps['altharvester0' + roomname].ticksToLive < 100)
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

                if (Game.creeps['harvester1' + roomname] && Game.creeps['harvester1' + roomname].ticksToLive < 100)
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
                if (Game.creeps['altharvester1' + roomname] && Game.creeps['altharvester1' + roomname].ticksToLive < 100)
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

        else if (!Game.creeps['repair' + roomname])
        {
            var bodyparts = [WORK, CARRY, MOVE, MOVE];

            if (energyavailable >= 600)
            {
                var numberofparts = Math.floor((energyavailable - 250) / 350);
                if (numberofparts * 6 > 46)
                {
                    numberofparts = Math.floor(50 / 6);
                }

                for (let q = 0; q < numberofparts; q++)
                {
                    bodyparts.push(WORK);
                    bodyparts.push(CARRY);
                    bodyparts.push(CARRY);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                }
            }

            Game.spawns[roomname].spawnCreep(bodyparts, 'repair' + roomname,
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
        else if (!Game.creeps['repair1' + roomname])
        {
            var bodyparts = [WORK, CARRY, MOVE, MOVE];

            if (energyavailable >= 600)
            {
                var numberofparts = Math.floor((energyavailable - 250) / 350);
                if (numberofparts * 6 > 46)
                {
                    numberofparts = Math.floor(50 / 6);
                }

                for (let q = 0; q < numberofparts; q++)
                {
                    bodyparts.push(WORK);
                    bodyparts.push(CARRY);
                    bodyparts.push(CARRY);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                }
            }

            Game.spawns[roomname].spawnCreep(bodyparts, 'repair1' + roomname,
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
        else if (!Game.creeps['repair3' + roomname])
        {
            var bodyparts = [WORK, CARRY, MOVE, MOVE];

            if (energyavailable >= 600)
            {
                var numberofparts = Math.floor((energyavailable - 250) / 350);
                if (numberofparts * 6 > 46)
                {
                    numberofparts = Math.floor(50 / 6);
                }

                for (let q = 0; q < numberofparts; q++)
                {
                    bodyparts.push(WORK);
                    bodyparts.push(CARRY);
                    bodyparts.push(CARRY);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                }
            }

            Game.spawns[roomname].spawnCreep(bodyparts, 'repair3' + roomname,
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

        else if (!Game.creeps['repair4' + roomname])
        {
            var bodyparts = [WORK, CARRY, MOVE, MOVE];

            if (energyavailable >= 600)
            {
                var numberofparts = Math.floor((energyavailable - 250) / 350);
                if (numberofparts * 6 > 46)
                {
                    numberofparts = Math.floor(50 / 6);
                }

                for (let q = 0; q < numberofparts; q++)
                {
                    bodyparts.push(WORK);
                    bodyparts.push(CARRY);
                    bodyparts.push(CARRY);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                }
            }

            Game.spawns[roomname].spawnCreep(bodyparts, 'repair4' + roomname,
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
        else if (!Game.creeps['upgrader2' + roomname] && energyavailable >= 550)
        {

            memstruct.tasklist = [
                ["withdrawControllerContainer"],
                ["upgrade"],
                ["repeat", 2]
            ]

            var bodyparts = [MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY];

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

        }
        else if (!Game.creeps['upgrader3' + roomname] && energyavailable >= 550)
        {

            memstruct.tasklist = [
                ["withdrawControllerContainer"],
                ["upgrade"],
                ["repeat", 2]
            ]

            var bodyparts = [MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY];

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

        else if (fullcontainers.length > 0 && movers.length < 7)
        {

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

        //          run towers
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        //          run basic defcon
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

    }
}
module.exports = roomControllerBotArena;