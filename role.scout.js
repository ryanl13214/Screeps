 /*
room considtions

 2sources
  
  13*13 area
  sources with 2 accessable areas
 */
 var rolescout = {
     run: function(creep)
     {
         if (creep.room.name == creep.memory.prevRoom || creep.memory.exitchosen == "a")
         {
             const roomExits = Game.map.describeExits(creep.room.name);
             const roomnames = Object.values(roomExits);
             if (creep.memory.exitchosen == "a" || creep.memory.exitchosen == null)
             {
                 creep.memory.exitchosen = Math.floor(Math.random() * roomnames.length);
             }
          //   creep.say(creep.memory.exitchosen);
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
             
             
              
             
             creep.say( creep.moveTo(exit));
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             Game.map.visual.line(creep.pos, exit,
             {
                 color: '#ffffff',
                 lineStyle: 'dashed'
             });
         }
         else
         {
             if (creep.memory.exitchosen != "a" && creep.room.name != creep.memory.prevRoom)
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
                 creep.say(creep.room.name);
                 if (flagForRoom == undefined && creep.room.name != creep.memory.home)
                 {
                     creep.room.createFlag(25, 25, creep.room.name);
                     var flagForRoom = Game.flags[creep.room.name];
                     flagForRoom.memory.distance = 1500 - creep.ticksToLive;
                     flagForRoom.memory.dangerours = false;
                     if (creep.ticksToLive < 100)
                     {
                         Game.flags[creep.memory.memstruct.spawnRoom].memory.extramineingrooms = +[creep.room.name];
                     }
                 }
                 else
                 {
                     if (flagForRoom.memory.distance > 1500 - creep.ticksToLive)
                     {
                         flagForRoom.memory.distance = 1500 - creep.ticksToLive;
                     }
                    try
                    {
                       if (  creep.ticksToLive > 1400)
                        {
                            Game.flags[creep.memory.home].memory.extraMineRooms += [creep.room.name];
                        }
                    }catch (e)
                    {
                          Game.flags[creep.memory.home].memory.extraMineRooms = [creep.room.name];     
                    }
                     
                     if (creep.ticksToLive > 1400)
                     {
                         Game.flags[creep.memory.home].memory.extraMineRooms.push(creep.room.name);
                     }
                     if (creep.ticksToLive > 1000)
                     {
                         Game.map.visual.rect(new RoomPosition(5, 5, creep.pos.roomName), 40, 40,
                         {
                             fill: 'transparent',
                             stroke: '#ff0000'
                         });
                     }
                 }
             }
         }
         creep.memory.prevRoom = creep.room.name;
     }
 };
 module.exports = rolescout;