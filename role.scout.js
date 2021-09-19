     /*
room considtions

 2sources
  
  13*13 area
  sources with 2 accessable areas
 */
     var creepfunctions = require('prototype.creepfunctions');
     var rolescout = {
         run: function(creep)
         {
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
             else if(creep.memory.exitchosen != "a" && creep.room.name != creep.memory.prevRoom) // if ceep has moved into new room
             {
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
                 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
                 //                                             add ally room code                                                                                                                    
                 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
                 if(creep.ticksToLive > 800 && creep.room.name != creep.memory.home && creep.room.controller != undefined && creep.room.controller.owner == "Q13214")
                 {
                     if(creep.memory.memstruct.spawnRoom != creep.memory.home)
                     {
                         var tempvar = Game.flags[creep.room.name].memory.flagstruct.claimedroomstuct.allyRoomsInRange;
                         var found = false;
                         for(q = 0; q < tempvar.length; q++)
                         {
                             if(tempvar[q][0] == creep.memory.memstruct.spawnRoom)
                             {
                                 found = true;
                             }
                         }
                         if(!found)
                         {
                             Game.flags[creep.room.name].memory.flagstruct.claimedroomstuct.allyRoomsInRange.push([creep.memory.memstruct.spawnRoom, 1500 - creep.ticksToLive, creep.memory.roomhistory]);
                         }
                         if(found)
                         {
                             for(q = 0; q < tempvar.length; q++)
                             {
                                 if(tempvar[q][0] == creep.memory.memstruct.spawnRoom && tempvar[q][1] > 1500 - creep.ticksToLive)
                                 {
                                     Game.flags[creep.room.name].memory.flagstruct.claimedroomstuct.allyRoomsInRange[q][1] = 1500 - creep.ticksToLive;
                                     Game.flags[creep.room.name].memory.flagstruct.claimedroomstuct.allyRoomsInRange[q][2] = creep.memory.roomhistory;
                                 }
                             }
                         }
                     }
                 }
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
                     var tmpvar = Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.corridorRooms;
                     if(tmpvar == undefined)
                     {
                         Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.corridorRooms = [];
                         var tmpvar = Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.corridorRooms;
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
                             Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.MineRooms.push(creep.room.name); /// 
                         }
                     }
                     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                     //                                                        deciding what center rooms to mine 
                     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                     var tmpvar = Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.centerroomsinrange;
                     var sources = Game.rooms[creep.room.name].find(FIND_SOURCES);
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
                         Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.centerroomsinrange.push(creep.room.name); /// this causes duplicates to need to remove dupes
                     }
                 }
                 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             }
             
             creep.memory.prevRoom = creep.room.name;
         }
     };
     module.exports = rolescout;