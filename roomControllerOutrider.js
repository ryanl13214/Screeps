var tower = require('tower');
var roles = require('roles');
var roompathfind = require('roompathfinder');

var roomController = {
    run: function(roomname)
    {
        tower.run(roomname, 0);
             if (Memory.empire.roomsobj[roomname] == undefined && (Game.rooms[roomname] != undefined && Game.rooms[roomname].controller != undefined && Game.rooms[roomname].controller.owner === "Q13214" )  )
        {
            Memory.empire.roomsobj[roomname] = {
    
            }
        }
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

        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        var creepquee = ["a", "a", "r", "w", "w"]
      if (Memory.outrider == undefined)
        {
            Memory.outrider = {
                TargetRooms: [],
                PeaceInTheVally: false,
                activeRiders:[]
            }
        }

        if (Memory.outrider.outriderRooms == undefined)
        {
            Memory.outrider.outriderRooms = {}
        }
        if (Memory.outrider.outriderRooms[roomname] == undefined)
        {
            Memory.outrider.outriderRooms[roomname] = {
                currCounter: 0
            }
        }

        var creepsinroom = _.filter(Game.creeps, (creep) => (creep.memory.memstruct != undefined && creep.memory.memstruct.spawnRoom === roomname));
        // console.log("or ",creepsinroom.length);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            roles
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

        roles.run(creepsinroom);

        //          run roles  
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        var targets = [];
        var warList = Object.keys(Memory.hostileempires);
        for (var i = 0; i < warList.length; i++)
        {
            if (Memory.hostileempires[warList[i]].currentRelationship == "war")
            {

                for (var ii = 0; ii < Memory.hostileempires[warList[i]].listOFminingRooms.length; ii++)
                {
                    if (Memory.hostileempires[warList[i]].listOFminingRooms[ii] != roomname)
                    {
                        targets.push(Memory.hostileempires[warList[i]].listOFminingRooms[ii]) // add list of rooms with confirmed hositiles in them and 
                    }

                }

            }
        }
        var sources = Game.rooms[roomname].find(FIND_SOURCES);

        //          run spawn 
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        var mainspawn = Game.rooms[roomname].find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_SPAWN);
            }
        });

        if (mainspawn.length != 0)
        {
            mainspawn = mainspawn[0]
        }
        var harvestsource = mainspawn.pos.findInRange(FIND_SOURCES, 2);

        var secondharvestSource;
        var secondharvestSourcetmp = mainspawn.room.find(FIND_SOURCES);
        if (secondharvestSourcetmp[0].id == harvestsource[0].id)
        {
            if (secondharvestSourcetmp.length == 2)
            {
                secondharvestSource = secondharvestSourcetmp[1].id
            }

        }
        else
        {
            secondharvestSource = secondharvestSourcetmp[0].id
        }

        if (mainspawn.length == 0)
        {

        }

        else if (!Game.creeps['erly1' + roomname] || !Game.creeps['erly2' + roomname] || !Game.creeps['erly3' + roomname])
        {

            memstruct.tasklist = [

                ["harvest", harvestsource[0].id],

                ["fillspawn"],

                ["repeat", 2]
            ]
            var bpodyparts = [MOVE, WORK, WORK, CARRY];
            mainspawn.spawnCreep(bpodyparts, 'erly1' + roomname,
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
            mainspawn.spawnCreep(bpodyparts, 'erly2' + roomname,
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

            mainspawn.spawnCreep(bpodyparts, 'erly3' + roomname,
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

        else if ((!Game.creeps['erly4' + roomname] || !Game.creeps['erly5' + roomname]) && secondharvestSource != undefined && sources.length == 2)
        {

            memstruct.tasklist = [

                ["harvest", secondharvestSource],
                ["upgrade"],
                ["repeat", 2]
            ]
            var bpodyparts = [MOVE, MOVE, WORK, CARRY];
            mainspawn.spawnCreep(bpodyparts, 'erly4' + roomname,
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

            mainspawn.spawnCreep(bpodyparts, 'erly5' + roomname,
            {
                memory:
                {
                    role: 'repair',
                    cpuUsed: 0,
                    roomtarg: roomname,
                    sourcetarget: 0,
                    full: false,
                    memstruct: memstruct
                }
            });

        }

        else if (targets.length != 0 && Game.cpu.bucket == 10000)
        {

            var currentSpawning = creepquee[Memory.outrider.outriderRooms[roomname].currCounter % creepquee.length]

            if (currentSpawning == "a")
            {
                var bpodyparts = [MOVE, ATTACK];

                memstruct.tasklist = [
                    ["joinOutriders"],

                ]

                var a = mainspawn.spawnCreep(bpodyparts, 'basicattacker' + Game.time,
                {
                    memory:
                    {
                        attackrole: "atk",
                        role: 'multi',
                        cpuUsed: 0,
                        roomtarg: roomname,
                        sourcetarget: 0,
                        full: false,
                        memstruct: memstruct
                    }
                });
                if (a == OK)
                {
                    Memory.outrider.outriderRooms[roomname].currCounter++
                }

            }
            if (currentSpawning == "r")
            {
                memstruct.tasklist = [
                    ["joinOutriders"],

                ]
                var bpodyparts = [MOVE, RANGED_ATTACK];
                var a = mainspawn.spawnCreep(bpodyparts, 'ranger' + Game.time,
                {
                    memory:
                    {
                        attackrole: "ranger",
                        role: 'multi',
                        cpuUsed: 0,
                        roomtarg: roomname,
                        sourcetarget: 0,
                        full: false,
                        memstruct: memstruct
                    }
                });

                if (a == OK)
                {
                    Memory.outrider.outriderRooms[roomname].currCounter++
                }

            }

            if (currentSpawning == "w")
            {
                memstruct.tasklist = [
                    ["joinOutriders"],

                ]
                var bpodyparts = [MOVE, WORK];
                var a = mainspawn.spawnCreep(bpodyparts, 'worker' + Game.time,
                {
                    memory:
                    {
                        attackrole: "dis",
                        role: 'multi',
                        cpuUsed: 0,
                        roomtarg: roomname,
                        sourcetarget: 0,
                        full: false,
                        memstruct: memstruct
                    }
                });
                if (a == OK)
                {
                    Memory.outrider.outriderRooms[roomname].currCounter++
                }

            }

            else if ((Game.time % 2 == 0 || targets.length == 0) && creepsinroom.length < 80 && Object.keys(Memory.roomlist).length < 40)
            {
                mainspawn.spawnCreep([MOVE], 'scoutobs1' + roomname + Game.time,
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

        }

        //          run towers
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

    }
}
module.exports = roomController;