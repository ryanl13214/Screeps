     /*
room considtions

 2sources
  
  13*13 area
  sources with 2 accessable areas
 */
 var bannedMineRooms = ["E27N3", "E26N3", "E23N3", "E23N4", "E22N4", "E22N5", "E27N6",   "E28N7","E28N4","E26N1","E27N4",];
     var creepfunctions = require('prototype.creepfunctions');
     var observer = require('observer');
     var rolescout = {
         run: function(creep)
         {
             var roomname =creep.memory.memstruct.spawnRoom;
             if(creep.memory.roomhistory == undefined)
             {
                 creep.memory.roomhistory = [];
             }
             var flagstruct = {
                 roomsuitableforClaiming: false,
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
                 const roomnames2 = Object.values(roomExits);
               
                 var roomnames =[];
                 for(var i = 0 ; i < roomnames2.length ; i++)
                 {
                     if(Memory.roomlist[roomnames2[i]] == undefined || Memory.roomlist[roomnames2[i]].dangerLevel < 5)
                     {
                        roomnames.push(roomnames2[i])
                     }
                 }
                 
              
                 
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
             else if(creep.memory.exitchosen != "a" && creep.room.name != creep.memory.prevRoom) // if ceep has moved into new room
             {
                 observer.addToRoomList(creep.room.name);
                 creep.moveTo(new RoomPosition(25, 25, creep.room.name), // move away from room edge
                     {
                         reusePath: 3,
                         visualizePathStyle:
                         {
                             stroke: 'rgb(1,3,4)'
                         }
                     });
                 creep.memory.prevRoom = creep.room.name;
                 creep.memory.exitchosen = "a";

                 if(creep.ticksToLive > 1400)
                 {
                     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                     //                                               ADD CORRIDOR MINING ROOMS
                     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                     creepfunctions.mineCorridor(creep);
                     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                     //                                                     deciding what corridor rooms to mine 
                     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
                     var depo = creep.room.find(FIND_DEPOSITS);
                     var tmpvar = Memory.empire.roomsobj[roomname].corridorRooms;
                     if(tmpvar == undefined)
                     {
                         Memory.empire.roomsobj[roomname].corridorRooms = [];
                         var tmpvar = Memory.empire.roomsobj[roomname].corridorRooms;
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
                         Memory.empire.roomsobj[roomname].corridorRooms.push(creep.room.name); /// 
                     }
                     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                     //                                                     deciding what rooms to mine 
                     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
                     var listEnemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
                     var listEnemycreeps = creep.room.find(FIND_HOSTILE_CREEPS);
                     var tmpvar = Memory.empire.roomsobj[roomname].MineRooms;
                     var found = false;
                     
                          if(tmpvar == undefined)
                     {
                         Memory.empire.roomsobj[roomname].MineRooms = [];
                         var tmpvar = Memory.empire.roomsobj[roomname].MineRooms;
                     }
                     
                     
                     
                     for(q = 0; q < tmpvar.length; q++)
                     {
                         if(tmpvar[q] == creep.room.name)
                         {
                             found = true;
                         }
                     }
                       var bannedMineRooms = ["E27N3", "E26N3", "E23N3", "E23N4", "E22N4", "E22N5", "E27N6",   "E28N7","E28N4","E26N1"];
                    
                     for(q = 0; q < bannedMineRooms.length; q++)
                     {
                         if(bannedMineRooms[q] == creep.room.name)
                         {
                             found = true;
                         }
                     }
                     
                     
                     
                     
                     var available = true;
                     if(!found && creep.room.name != creep.memory.memstruct.spawnRoom && creep.room.controller != undefined)
                     {
                         if(Game.rooms[creep.memory.memstruct.spawnRoom].controller.level < 8 && tmpvar.length < 5)
                         {
                             available = true;
                         }
                         if(Game.rooms[creep.memory.memstruct.spawnRoom].controller.level == 8 && tmpvar.length < 8)
                         {
                             available = true;
                         }
                         creep.say(available);
                         if(available && creep.ticksToLive > 1450 && listEnemyStructures.length == 0 && listEnemycreeps.length == 0)
                         {
                             Memory.empire.roomsobj[roomname].MineRooms.push(creep.room.name); /// 
                         }
                     }
                     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                     //                                                        deciding what center rooms to mine 
                     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                     var tmpvar = Memory.empire.roomsobj[roomname].centerroomsinrange;
                     var sources = Game.rooms[creep.room.name].find(FIND_SOURCES);
                         
                          if(tmpvar == undefined)
                     {
                         Memory.empire.roomsobj[roomname].centerroomsinrange = [];
                         var tmpvar = Memory.empire.roomsobj[roomname].centerroomsinrange;
                     }
                     
                     
                     
                     
                     
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
                     if(!found && creep.room.name != creep.memory.memstruct.spawnRoom && creep.room.controller == undefined && sources.length != 0 && creep.ticksToLive > 1450)
                     {
                         Memory.empire.roomsobj[roomname].centerroomsinrange.push(creep.room.name); /// this causes duplicates to need to remove dupes
                     }
                 }
                 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             }
             
             creep.memory.prevRoom = creep.room.name;
         }
     };
     module.exports = rolescout;