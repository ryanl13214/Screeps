  /*
room considtions

 2sources
  
  13*13 area
  sources with 2 accessable areas
 */
var rolescout = {
    run: function(creep)
    {
        var flagstruct={
        roomissafe:false,
        roomsuitableforClaiming:false,
        numberOfSourcesInRoom:0,
        roomIsFightTeritory:false,
        roomIsMyTeritory:false,
        distancefromoom:9999,
        claimedroomstuct:{
            MineRooms:[],
            centerroomsinrange:[],
            mineroomsProfitmargin:[],
            cpuUsedlastTick:99,
            roomdefconstruct:{}
        }};
     
        if (creep.room.name == creep.memory.prevRoom || creep.memory.exitchosen == "a")// creep stays in the same room
        {
            const roomExits = Game.map.describeExits(creep.room.name);
            const roomnames = Object.values(roomExits);
            if (creep.memory.exitchosen == "a" || creep.memory.exitchosen == null)
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
            creep.say(creep.moveTo(exit));
            Game.map.visual.line(creep.pos, exit,
            {
                color: '#ffffff',
                lineStyle: 'dashed'
            });
        }
        else
        {
            if (creep.memory.exitchosen != "a" && creep.room.name != creep.memory.prevRoom)// if ceep has moved into new room
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
                    flagForRoom.memory.flagstruct=flagstruct;
                    flagForRoom.memory.flagstruct.distancefromoom = 1500 - creep.ticksToLive;
                    const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    if (target)
                    {
                        flagForRoom.memory.flagstruct.roomissafe = false;
                    }
                    else
                    {
                        flagForRoom.memory.flagstruct.roomissafe = true;
                        if (creep.ticksToLive > 1400 && creep.room.name !=creep.memory.memstruct.spawnRoom )
                        {
                            Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.MineRooms.push(creep.room.name);
                            Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.roomIsFightTeritory=true;
                            Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.roomIsMyTeritory=true;
                        }
                    }
                }
                else
                {
                    if (flagForRoom.memory.flagstruct.distancefromoom  > 1500 - creep.ticksToLive)
                    {
                        flagForRoom.memory.flagstruct.distancefromoom  = 1500 - creep.ticksToLive;
                    }
                     
                    if (creep.ticksToLive > 1400  )
                    {
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                     deciding what rooms to mine 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
                        var tmpvar =  Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.MineRooms;
                        var found = false;
                        for(q = 0 ; q <  tmpvar.length ;q++){
                            
                            if(tmpvar[q] == creep.room.name){
                                found= true;
                            }
                            
                        }
                        
                        if(!found && creep.room.name !=creep.memory.memstruct.spawnRoom && creep.room.controller != undefined)
                        {
                            Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.MineRooms.push(creep.room.name);/// this causes duplicates to need to remove dupes
                        }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                        deciding what center rooms to mine 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        
                        
                        var tmpvar =  Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.centerroomsinrange;
                        var found = false;
                        for(q = 0 ; q <  tmpvar.length ;q++){
                            
                            if(tmpvar[q] == creep.room.name){
                                found= true;
                            }
                            
                        }
                        
                        if(!found && creep.room.name !=creep.memory.memstruct.spawnRoom && creep.room.controller == undefined)
                        {
                            Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.centerroomsinrange.push(creep.room.name);/// this causes duplicates to need to remove dupes
                        }
                        
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        
                        
                        Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.roomIsFightTeritory=true;
                        Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.roomIsMyTeritory=true;
                    }
                    if (creep.ticksToLive > 1300)
                    {
                        Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.roomIsMyTeritory=true;
                    }
                }
            }
        }
        creep.memory.prevRoom = creep.room.name;
    }
};
module.exports = rolescout;