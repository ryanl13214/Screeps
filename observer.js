var obs = {
    run: function(roomname, obsActual)
    {
        if(Memory.empire == undefined)
        {
            Memory.empire = {};
        }
        if(Memory.empire.roomsobj == undefined)
        {
            Memory.empire.roomsobj = {};
        }
        if(Memory.empire.roomsobj[roomname] == undefined)
        {
            Memory.empire.roomsobj[roomname] = {}
        }
        if(Memory.empire.roomsobj[roomname].oberverobj == undefined)
        {
            Memory.empire.roomsobj[roomname].oberverobj = {
                currentRoom: "",
                xx: 0,
                yy: 0,
                powerEnabled: false,
                tasklist: []
            }
        }
        var mainmemoryobj = Memory.empire.roomsobj[roomname].oberverobj
        if(Game.time % 5 == 0 && 1 == 2)
        {
            Memory.empire.roomsobj[roomname].oberverobj.xx = -10;
            Memory.empire.roomsobj[roomname].oberverobj.yy = -10;
        }
        if(Game.time % 3 == 0)
        {
            var xxx = mainmemoryobj.xx;
            var yyy = mainmemoryobj.yy;
            if(xxx > 10)
            {
                Memory.empire.roomsobj[roomname].oberverobj.xx = -10;
                Memory.empire.roomsobj[roomname].oberverobj.yy++;
            }
            if(yyy > 10)
            {
                Memory.empire.roomsobj[roomname].oberverobj.yy = -10;
                Memory.empire.roomsobj[roomname].oberverobj.xx = -10;
            }
        
            var targetroom = this.getRoomname(roomname, Memory.empire.roomsobj[roomname].oberverobj.xx, Memory.empire.roomsobj[roomname].oberverobj.yy);
            Memory.empire.roomsobj[roomname].oberverobj.currentRoom = targetroom;
          Memory.empire.roomsobj[roomname].oberverobj.xx++;
     
         
             obsActual.observeRoom(targetroom);
             
              
        }
        else  
        {
             
     
             obsActual.observeRoom(mainmemoryobj.currentRoom);
             if(Game.rooms[mainmemoryobj.currentRoom]){
            this.roomscan(roomname , mainmemoryobj.currentRoom);
             }            
        }
        
        
         Game.map.visual.circle(new RoomPosition(25,25,Memory.empire.roomsobj[roomname].oberverobj.currentRoom), {fill: 'white', radius:  20, stroke: 'white'});
         Game.map.visual.line(new RoomPosition(25,25,roomname), new RoomPosition(25,25,Memory.empire.roomsobj[roomname].oberverobj.currentRoom),{color: '#ff0000', lineStyle: 'dashed'});
        
        
        
        
        
        
    },
    roomscan: function(roomname, scanroom)
    {
          Game.map.visual.circle(new RoomPosition(25,25,scanroom), {fill: 'red', radius:  15 , stroke: 'white'});
        
        var distancefromhomeroom = Game.map.getRoomLinearDistance(roomname, scanroom);
        
        
        if(distancefromhomeroom < 4 && 1==2)
        { 
            
            
            var target = Game.rooms[scanroom].find(FIND_HOSTILE_STRUCTURES,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_INVADER_CORE);
                }
            });
            if(target.length != 0 && target[0].level ==0)
            {   
                console.log("spawning lvl 0 stroingohlder ");
                Game.spawns[roomname].spawnCreep(
                    [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK]
                    , 'stronglvl2' + scanroom,
                    {
                        memory:
                        {
                            role: 'guard',
                            attackrole: "chasedown",
                            memstruct:
                            {
                                spawnRoom: roomname,
                                tasklist: [
                                    ["createslaveBOOST"],
                                    ["boosAllMax"],
                                    ["forcemoveToRoom", scanroom]
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
            if(target.length != 0 && target[0].level == 2)
            {   
                console.log("spawning lvl 2 stroingohlder ");
                Game.spawns[roomname].spawnCreep(
                    [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK]
                    , 'stronglvl2' + scanroom,
                    {
                        memory:
                        {
                            role: 'guard',
                            attackrole: "chasedown",
                            memstruct:
                            {
                                spawnRoom: roomname,
                                tasklist: [
                                    ["createslaveBOOST"],
                                    ["boosAllMax"],
                                    ["forcemoveToRoom", scanroom]
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
            if(target.length != 0 && target[0].level == 3)
            {   
                console.log("spawning lvl 3 stroingohlder ");
                Game.spawns[roomname].spawnCreep(
                    [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK]
                    , 'stronglvl2' + scanroom,
                    {
                        memory:
                        {
                            role: 'guard',
                            attackrole: "chasedown",
                            memstruct:
                            {
                                spawnRoom: roomname,
                                tasklist: [
                                    ["createslaveBOOST"],
                                    ["boosAllMax"],
                                    ["forcemoveToRoom", scanroom]
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
            
            
            
            
        }
    },
    getRoomname: function(center, xx, yy)
    {
        var xxString = "";
        var yyString = "";
        var xletter = center.substring(0, 1);
        var yletter = "";
        if(center.indexOf("S") != -1)
        {
            yletter = "S";
        }
        if(center.indexOf("N") != -1)
        {
            yletter = "N";
        }
        var yyposition = center.indexOf(yletter);
        //console.log("yyposition",yyposition);
        if(yyposition == 2)
        {
            xxString = center.substring(1, 2);
            yyString = center.substring(3, center.length);
        }
        if(yyposition == 3)
        {
            xxString = center.substring(1, 4);
            yyString = center.substring(4, center.length);
        }
        var xxint = parseInt(xxString);
        var yyint = parseInt(yyString);
        if(xxint < Math.abs(xx) && xx < 0 && xletter == "E")
        {
            xxint = Math.abs((Math.abs(xx) - xxint));
            xletter = "W";
            //    console.log("e to w");
        }
        else if(xxint < Math.abs(xx) && xx < 0 && xletter == "W")
        {
            xxint = Math.abs((Math.abs(xx) - xxint));
            xletter = "E";
            //      console.log("w to e");
        }
        else
        {
            xxint = Math.abs((xxint + xx));
        }
        if(yyint < Math.abs(yy) && yy < 0 && yletter == "N")
        {
            yyint = Math.abs((Math.abs(yy) - yyint));
            yletter = "S";
        }
        else if(yyint < Math.abs(yy) && yy < 0 && yletter == "S")
        {
            yyint = Math.abs((Math.abs(yy) - yyint));
            yletter = "N";
        }
        else
        {
            yyint = Math.abs((yyint + yy));
        }
        return xletter + xxint + yletter + yyint;
    }
}
module.exports = obs;