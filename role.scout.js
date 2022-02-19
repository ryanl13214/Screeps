     /*
room considtions

 2sources
  
  13*13 area
  sources with 2 accessable areas
 */
   
     var creepfunctions = require('prototype.creepfunctions');
     var observer = require('observer');
     var rolescout = {
         
         lowCpouMove: function(leader ,target)
         {
             if(!target){
              return 0   
             }
             
             
             
             
            let ret = PathFinder.search(
            leader.pos, target,
            {
                // We need to set the defaults costs higher so that we
                // can set the road cost lower in `roomCallback`
                plainCost: 1,
                swampCost: 5,
                      maxRooms: 1,
                roomCallback: function(roomName)
                {
                    let room = leader.room;
                    // In this example `room` will always exist, but since 
                    // PathFinder supports searches which span multiple rooms 
                    // you should be careful!
                    if (!room) return;
                    let costs = new PathFinder.CostMatrix;
                    var terrain = new Room.Terrain(roomName);
                    // set costs 
                

                       
                        for (var xx = 0; xx < 50; xx++)
                        {
                            costs.set(xx, 0, 249);
                            costs.set(0, xx, 249);
                            costs.set(xx, 49, 249);
                            costs.set(49, xx, 249);
                   
                        }
 room.find(FIND_MY_CREEPS).forEach(function(struct)
                    {
                        
                         
                            room.visual.circle(struct.pos.x, struct.pos.y,
                            {
                                fill: 'transparent',
                                radius: 0.08,
                                stroke: 'black'
                            });
                            costs.set(struct.pos.x, struct.pos.y, 0xff);
                             

                        
                    });
                        room.find(FIND_STRUCTURES).forEach(function(struct)
                        {
                            if (struct.structureType !== STRUCTURE_CONTAINER && struct.structureType !== STRUCTURE_ROAD && (struct.structureType !== STRUCTURE_RAMPART || !struct.my))
                            {
                                //  Game.rooms[roomName].visual.circle(struct.pos.x, struct.pos.y,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(struct.pos.x, struct.pos.y, 0xff);
                       
                            }
                        });
                        for (var xx = 0; xx < 50; xx++)
                        {
                            for (var yy = 0; yy < 50; yy++)
                            {
                                if (terrain.get(xx, yy) == TERRAIN_MASK_WALL)
                                {
                                    //  Game.rooms[roomName].visual.circle(xx, yy,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                    costs.set(xx, yy, 0xff);
                                }
                                
                            }
                        }
 
 
                    return costs;
                },
            }
        );
        
        
               if (target && ret.path.length != 0 && (ret.path[ret.path.length - 1].x != target.x && ret.path[ret.path.length - 1].y != target.y))
        {
         
           
           return "noPath"
        }
        else
        {
        for (var xx = 0; xx < ret.path.length; xx++)
        {
           
           leader.memory.memstruct.tasklist.push(["lowCpuMove",ret.path[xx]])
        }
         
         if(ret.path.length){
             
         }
        }
         
         
        },
         
         
         
         
         
         run: function(creep)
         {
             var roomname = creep.memory.memstruct.spawnRoom;
             if (creep.memory.roomhistory == undefined)
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
             if (creep.room.name == creep.memory.prevRoom || creep.memory.exitchosen == "a") // creep stays in the same room
             {
                 /////////////////////////////////////////////////////////////////////
                 const roomExits = Game.map.describeExits(creep.room.name);
                 const roomnames2 = Object.values(roomExits);

                 if (Memory.roomlist == undefined)
                 {
                     Memory.roomlist = {};
                 }

                 var roomnames = [];
                 for (var i = 0; i < roomnames2.length; i++)
                 {
                    
                     if (Memory.roomlist[roomnames2[i]] == undefined)
                     {
                         roomnames.push(roomnames2[i])
                     }

                 }
 
                 if (roomnames.length == 0)
                 {
                     for (var i = 0; i < roomnames2.length; i++)
                     {
                         if (Memory.roomlist[roomnames2[i]].dangerLevel < 5)
                         {

                             roomnames.push(roomnames2[i])
                         }

                     }
                 }
 
                 if (roomnames.length == 0)
                 {
                     for (var i = 0; i < roomnames2.length; i++)
                     {

                         roomnames.push(roomnames2[i])

                     }
                 }
 


roomnames=roomnames2


                 if (creep.memory.exitchosen == "a" || creep.memory.exitchosen == null)
                 {
                     creep.memory.exitchosen = Game.time % roomnames.length;
                 }
                 let exitDir = Game.map.findExit(creep.room, roomnames[creep.memory.exitchosen]);
                 
                 
                 
                 let exit = creep.room.find(exitDir);
                
               var qwert = this.lowCpouMove(creep, exit[Game.time % exit.length])
                if(qwert == "noPath")
                {
                    creep.memory.exitchosen = "a"
                }
                
                
                
                  var check = creepfunctions.checkglobaltasks(creep);
                /*
                 creep.moveTo(exit,
                 {
                     maxRooms:0,
                     reusePath: 20,
                     visualizePathStyle:
                     {
                         stroke: 'rgb(1,3,4)'
                     }
                 });
                 */
                 Game.map.visual.line(creep.pos, exit[Game.time % exit.length],
                 {
                     color: '#ffffff',
                     lineStyle: 'dashed'
                 });
                 /////////////////////////////////////////////////////////////////////
             }
             else if (creep.memory.exitchosen != "a" && creep.room.name != creep.memory.prevRoom) // if ceep has moved into new room
             {
                 observer.addToRoomList(creep.room.name, 1500 - creep.ticksToLive, creep.memory.memstruct.spawnRoom);

                 if (Memory.roomlist[creep.room.name].distanceFromHomeRoom == undefined || Memory.roomlist[creep.room.name].distanceFromHomeRoom < 1500 - creep.ticksToLive)
                 {
                     Memory.roomlist[creep.room.name].distanceFromHomeRoom = 1500 - creep.ticksToLive
                     Memory.roomlist[creep.room.name].closestRoom = creep.memory.memstruct.spawnRoom

                 }

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

                 if (creep.ticksToLive > 1400)
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
                     if (tmpvar == undefined)
                     {
                         Memory.empire.roomsobj[roomname].corridorRooms = [];
                         var tmpvar = Memory.empire.roomsobj[roomname].corridorRooms;
                     }
                     var found = false;
                     for (q = 0; q < tmpvar.length; q++)
                     {
                         if (tmpvar[q] == creep.room.name)
                         {
                             found = true;
                         }
                     }
                     if (!found && creep.room.name != creep.memory.memstruct.spawnRoom && creep.room.controller == undefined && depo.length != 0)
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

                     if (tmpvar == undefined)
                     {
                         Memory.empire.roomsobj[roomname].MineRooms = [];
                         var tmpvar = Memory.empire.roomsobj[roomname].MineRooms;
                     }

                     for (q = 0; q < tmpvar.length; q++)
                     {
                         if (tmpvar[q] == creep.room.name)
                         {
                             found = true;
                         }
                     }
                     var bannedMineRooms = ["E27N3", "E26N3", "E23N3", "E23N4", "E22N4", "E22N5", "E27N6", "E28N7", "E28N4", "E26N1"];

                     for (q = 0; q < bannedMineRooms.length; q++)
                     {
                         if (bannedMineRooms[q] == creep.room.name)
                         {
                             found = true;
                         }
                     }

                     var available = true;
                     if (!found && creep.room.name != creep.memory.memstruct.spawnRoom && creep.room.controller != undefined)
                     {
                         if (Game.rooms[creep.memory.memstruct.spawnRoom].controller.level < 8 && tmpvar.length < 5)
                         {
                             available = true;
                         }
                         if (Game.rooms[creep.memory.memstruct.spawnRoom].controller.level == 8 && tmpvar.length < 8)
                         {
                             available = true;
                         }
                         creep.say(available);
                         if (available && creep.ticksToLive > 1450 && listEnemyStructures.length == 0 && listEnemycreeps.length == 0)
                         {
                             Memory.empire.roomsobj[roomname].MineRooms.push(creep.room.name); /// 
                         }
                     }
                     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                     //                                                        deciding what center rooms to mine 
                     //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                     var tmpvar = Memory.empire.roomsobj[roomname].centerroomsinrange;
                     var sources = Game.rooms[creep.room.name].find(FIND_SOURCES);

                     if (tmpvar == undefined)
                     {
                         Memory.empire.roomsobj[roomname].centerroomsinrange = [];
                         var tmpvar = Memory.empire.roomsobj[roomname].centerroomsinrange;
                     }

                     var found = false;
                     for (q = 0; q < tmpvar.length; q++)
                     {
                         if (tmpvar[q] == creep.room.name)
                         {
                             found = true;
                         }
                     }
                     if (Game.rooms[creep.memory.memstruct.spawnRoom].controller.level < 7)
                     {
                         found = true;
                     }
                     if (Game.rooms[creep.memory.memstruct.spawnRoom].controller.level == 7 && tmpvar.length > 0)
                     {
                         found = true;
                     }
                     if (Game.rooms[creep.memory.memstruct.spawnRoom].controller.level == 8 && tmpvar.length > 0)
                     {
                         found = true;
                     }
                     if (!found && creep.room.name != creep.memory.memstruct.spawnRoom && creep.room.controller == undefined && sources.length != 0 && creep.ticksToLive > 1450)
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