    /*
room considtions

 2sources
  
  13*13 area
  sources with 2 accessable areas
 */
    var squadmanage = require('squadManager');
    var rolescout = {
        run: function(creep)
        {
            var flagstruct = {
                roomissafe: false,
                roomsuitableforClaiming: false,
                numberOfSourcesInRoom: 0,
                roomIsFightTeritory: false,
                roomIsMyTeritory: false,
                distancefromoom: 9999,
                squadspawning: "",
                mineroomsProfitmargin: 0,
                mineroomsCPU: 0,
                mineroomsCost: 0,
                claimedroomstuct:
                {
                    roomIsStronghold: false,
                    MineRooms: [],
                    centerroomsinrange: [],
                    mineroomsProfitmargin: [],
                    cpuUsedlastTick: 99,
                    roomdefconstruct:
                    {},
                    dismantelrooms: []
                }
            };
            if(creep.room.name == creep.memory.prevRoom || creep.memory.exitchosen == "a") // creep stays in the same room
            {
                /////////////////////////////////////////////////////////////////////
                const roomExits = Game.map.describeExits(creep.room.name);
                const roomnames = Object.values(roomExits);
                if(creep.memory.exitchosen == "a" || creep.memory.exitchosen == null)
                {
                    creep.memory.exitchosen = Math.floor(Math.random() * roomnames.length);
                }
                const exitDir = Game.map.findExit(creep.room, roomnames[creep.memory.exitchosen]);
                const exit = creep.pos.findClosestByRange(exitDir);
                creep.moveTo(exit,
                {
                    reusePath: 20,
                    visualizePathStyle:
                    {
                        stroke: 'rgb(1,3,4)'
                    }
                });
                Game.map.visual.line(creep.pos, exit,
                {
                    color: '#ffffff',
                    lineStyle: 'dashed'
                });
                /////////////////////////////////////////////////////////////////////
            }
            else
            {
                if(creep.memory.exitchosen != "a" && creep.room.name != creep.memory.prevRoom) // if ceep has moved into new room
                {
                    creep.moveTo(new RoomPosition(25, 25, creep.room.name),
                    {
                        reusePath: 3,
                        visualizePathStyle:
                        {
                            stroke: 'rgb(1,3,4)'
                        }
                    });
                    creep.memory.prevRoom = creep.room.name;
                    creep.memory.exitchosen = "a";
                    var flagForRoom = Game.flags[creep.room.name];
                    if(flagForRoom == undefined && creep.room.name != creep.memory.home) // ////////////////////////////////////////////////////////////////////                                      CREEP IN NEW ROOM
                    {
                        creep.room.createFlag(25, 25, creep.room.name);
                        var flagForRoom = Game.flags[creep.room.name];
                        flagForRoom.memory.flagstruct = flagstruct;
                        flagForRoom.memory.flagstruct.distancefromoom = 1500 - creep.ticksToLive;
                        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                        if(target)
                        {
                            flagForRoom.memory.flagstruct.roomissafe = false;
                        }
                        else
                        {
                            flagForRoom.memory.flagstruct.roomissafe = true;
                            if(creep.ticksToLive > 1400 && creep.room.name != creep.memory.memstruct.spawnRoom)
                            {
                                //    Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.MineRooms.push(creep.room.name);
                                Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.roomIsFightTeritory = true;
                                Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.roomIsMyTeritory = true;
                            }
                        }
                    }
                    else // ////////////////////////////////////////////////////////////////////                                                                                                       CREEP already scouted room
                    {
                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
                        //                                             add ally room code                                                                                                                    
                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
                        if(creep.ticksToLive > 800 && creep.room.name != creep.memory.home && creep.room.controller != undefined && creep.room.controller.owner == "Q13214")
                        {
                            var tmpvar = Game.flags[creep.room.name].memory.flagstruct.claimedroomstuct.allyRoomsInRange;
                            var found = false;
                            for(q = 0; q < tmpvar.length; q++)
                            {
                                if(tmpvar[q] == creep.memory.memstruct.spawnRoom)
                                {
                                    found = true;
                                }
                            }
                            if(found == false)
                            {
                                Game.flags[creep.room.name].memory.flagstruct.claimedroomstuct.allyRoomsInRange.push(creep.memory.memstruct.spawnRoom);
                            }
                        }
                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
                        //                                              update the distance                                                                                                                      
                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
                        if(flagForRoom.memory.flagstruct.distancefromoom > 1500 - creep.ticksToLive)
                        {
                            flagForRoom.memory.flagstruct.distancefromoom = 1500 - creep.ticksToLive;
                        }
                        flagForRoom.memory.flagstruct.numberOfSourcesInRoom = creep.room.find(FIND_SOURCES).length;
                        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
                        if(creep.ticksToLive > 1200)
                        {
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// put here due to inherent danger
                            //                                                   finding strongholds
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
                            var testingsquads = Memory.squadObject;
                            if(testingsquads == undefined)
                            {
                                Memory.squadObject = {};
                            }
                            const resourcekeys = Object.keys(testingsquads);
                            var listEnemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
                            var tmpvar = resourcekeys;
                            var found = false;
                            for(q = 0; q < tmpvar.length; q++)
                            {
                                if(tmpvar[q] == creep.room.name + "_stronghold_SERPENT")
                                {
                                    found = true;
                                }
                            }
                            if(!found && creep.room.controller == undefined && listEnemyStructures.length > 4 && (creep.ticksToLive > 1300 || Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.roomIsStronghold))
                            {
                                // level 7 only 
                                /*
                                 console.log("ssceefgrout spawning serpent squad");
                                  squadmanage.initializeSquad(creep.room.name + "_stronghold_SERPENT", [creep.room.name], true, "serpent", creep.memory.memstruct.spawnRoom, {
                                     "head": [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL],
                                     "body": [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL],
                                     "tail": [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL],
                                      }
                                  );
                                console.log("sscout spawning serpent squad");
                                 
                                console.log("ssceefgrout spawning serpent squad");
                                squadmanage.initializeSquad(creep.room.name + "_stronghold_SERPENT", [creep.room.name], true, "serpent", creep.memory.memstruct.spawnRoom,
                                {
                                    "head": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                                    "body": [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                                    "tail": [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
                                });
                                  */
                            }
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        }
                        if(creep.ticksToLive > 1400)
                        {
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            //                                               ADD CORRIDOR MINING ROOMS
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                            var deposoits = creep.room.find(FIND_DEPOSITS);
                            if(deposoits.length != 0 && Game.rooms[creep.memory.memstruct.spawnRoom].controller.level > 4)
                            {
                                if(!target)
                                {
                                    var bgodyparts = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
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
                                                opportuniticRenew: true,
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
                                    tmptasklist.push(["createslave", "healer"]);
                                    for(var c = 0; c < corridorRoomList.length; c++)
                                    {
                                        tmptasklist.push(["patrolroom", corridorRoomList[c]]);
                                    }
                                      tmptasklist.push(["repeat", corridorRoomList.length ]);
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
                                                opportuniticRenew: true,
                                                hastask: false
                                            }
                                        }
                                    });
                                }
                            }
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            //                                                     deciding what corridor rooms to mine 
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
                            var depo = creep.room.find(FIND_DEPOSITS);
                            var tmpvar = Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.corridorRooms;
                            if(tmpvar == undefined)
                            {
                                Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.corridorRooms = [];
                            }
                            var found = false;
                            for(q = 0; q < tmpvar.length; q++)
                            {
                                if(tmpvar[q] == creep.room.name)
                                {
                                    found = true;
                                }
                            }
                            if(!found && creep.room.name != creep.memory.memstruct.spawnRoom && creep.room.controller == undefined && depo.length != 0)
                            {
                                Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.corridorRooms.push(creep.room.name); /// 
                            }
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            //                                                     deciding what rooms to mine 
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
                            var listEnemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
                            var listEnemycreeps = creep.room.find(FIND_HOSTILE_CREEPS);
                            var tmpvar = Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.MineRooms;
                            var found = false;
                            for(q = 0; q < tmpvar.length; q++)
                            {
                                if(tmpvar[q] == creep.room.name)
                                {
                                    found = true;
                                }
                            }
                            var available = true;
                            if(!found && creep.room.name != creep.memory.memstruct.spawnRoom && creep.room.controller != undefined)
                            {
                                if(Game.rooms[creep.memory.memstruct.spawnRoom].controller.level < 7)
                                {
                                    //   available = true;
                                }
                                if(Game.rooms[creep.memory.memstruct.spawnRoom].controller.level < 8 && tmpvar.length < 3)
                                {
                                    available = true;
                                }
                                if(Game.rooms[creep.memory.memstruct.spawnRoom].controller.level == 8 && tmpvar.length < 4)
                                {
                                    available = true;
                                }
                                creep.say(available);
                                if(available && creep.ticksToLive > 1450 && listEnemyStructures.length == 0 && listEnemycreeps.length == 0)
                                {
                                    Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.MineRooms.push(creep.room.name); /// 
                                }
                            }
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            //                                                        deciding what center rooms to mine 
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            var tmpvar = Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.centerroomsinrange;
                            var found = false;
                            for(q = 0; q < tmpvar.length; q++)
                            {
                                if(tmpvar[q] == creep.room.name)
                                {
                                    found = true;
                                }
                            }
                            if(Game.rooms[creep.memory.memstruct.spawnRoom].controller.level < 7)
                            {
                                found = true;
                            }
                            if(Game.rooms[creep.memory.memstruct.spawnRoom].controller.level == 7 && tmpvar.length > 0)
                            {
                                found = true;
                            }
                            if(Game.rooms[creep.memory.memstruct.spawnRoom].controller.level == 8 && tmpvar.length > 0)
                            {
                                found = true;
                            }
                            if(!found && creep.room.name != creep.memory.memstruct.spawnRoom && creep.room.controller == undefined)
                            {
                                Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.centerroomsinrange.push(creep.room.name); /// this causes duplicates to need to remove dupes
                            }
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            //                                                          teritory managment
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.roomIsFightTeritory = true;
                            Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.roomIsMyTeritory = true;
                        }
                        if(creep.ticksToLive > 1300)
                        {
                            Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.roomIsMyTeritory = true;
                        }
                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    }
                }
            }
            creep.memory.prevRoom = creep.room.name;
        }
    };
    module.exports = rolescout;