var squadmanage = require('squadManager');
var obs = {
    run: function(roomname, obsActual)
    {
        if (Memory.empire == undefined)
        {
            Memory.empire = {};
        }
        if (Memory.hostileempires == undefined)
        {
            Memory.hostileempires = {};
        }

        if (Memory.roomlist == undefined)
        {
            console.log("creating roomlist")
            Memory.roomlist = {};
            //    delete   Memory.roomlist
        }

        if (Memory.empire.roomsobj == undefined)
        {
            Memory.empire.roomsobj = {};
        }
        if (Memory.empire.roomsobj[roomname] == undefined)
        {
            Memory.empire.roomsobj[roomname] = {}
        }
        if (Memory.empire.roomsobj[roomname].oberverobj == undefined)
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
        
        
        if(Memory.empire.roomsobj[roomname].oberverobj.tasklist.length == 0)
        {
        
        
        
        
        
        if (Game.time % 5 == 0 && 1 == 2)
        {
            Memory.empire.roomsobj[roomname].oberverobj.xx = -10;
            Memory.empire.roomsobj[roomname].oberverobj.yy = -10;
        }
        if (Game.time % 3 == 0)
        {
            var xxx = mainmemoryobj.xx;
            var yyy = mainmemoryobj.yy;
            if (xxx > 10)
            {
                Memory.empire.roomsobj[roomname].oberverobj.xx = -10;
                Memory.empire.roomsobj[roomname].oberverobj.yy++;
            }
            if (yyy > 10)
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
            if (Game.rooms[mainmemoryobj.currentRoom])
            {
                this.roomscan(roomname, mainmemoryobj.currentRoom);
            }
        }

        Game.map.visual.circle(new RoomPosition(25, 25, Memory.empire.roomsobj[roomname].oberverobj.currentRoom),
        {
            fill: 'white',
            radius: 20,
            stroke: 'white'
        });
        Game.map.visual.line(new RoomPosition(25, 25, roomname), new RoomPosition(25, 25, Memory.empire.roomsobj[roomname].oberverobj.currentRoom),
        {
              width: 5,
            color: '#ff0000',
            lineStyle: 'dashed'
        });
}
        else
        {
            // check if the room still needs observer by 
               obsActual.observeRoom(Memory.empire.roomsobj[roomname].oberverobj.tasklist[0]);  
            
            if(Game.time % 750 == 0 )
            {
             Memory.empire.roomsobj[roomname].oberverobj.tasklist =[];   
            }
            
            
            
            
        }





    },
    roomscan: function(roomname, scanroom) // make available for scout
    {
        Game.map.visual.circle(new RoomPosition(25, 25, scanroom),
        {
            fill: 'red',
            radius: 15,
            stroke: 'white'
        });

        var distancefromhomeroom = Game.map.getRoomLinearDistance(roomname, scanroom);

        if (distancefromhomeroom < 4 && 1==2) // destroy stronmgholdfs
        {

            var target = Game.rooms[scanroom].find(FIND_HOSTILE_STRUCTURES,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_INVADER_CORE);
                }
            });
            
            if (target.length != 0 && target[0].level == 2)
            {
                console.log("spawning lvl 2 stroingohlder ");
                Game.spawns[roomname].spawnCreep(
                    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], 'stronglvl2' + scanroom,
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
            
            if (target.length != 0 && target[0].level == 3)
            {
                console.log("spawning lvl 3 stroingohlder ");
                Game.spawns[roomname].spawnCreep(
                    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], 'stronglvl2' + scanroom,
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
            
            if (target.length != 0 && target[0].level == 4)
            {
                
                
                
                
                
                
                
    var bodyp =   [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL];
    
            if(Memory.squadObject.strong4 == undefined  )
            {
                squadmanage.initializeSquad("strong4", [
                    ["forcemoveToRoom", scanroom],
                    ["GeneralAttack", scanroom]
                ], true, "quad", roomname,
                {
                    "head1": bodyp,
                    "tail1": bodyp,
                    "head2": bodyp,
                    "tail2": bodyp
                }, "blinky");
            }
            
                
                
                
                
                
                
                
                
                
            }


        }

        if (Memory.roomlist != undefined)
        {
            // if the room is not on roomlist
            //         if(Memory.roomlist[scanroom] == undefined)
            //       {
            this.addToRoomList(scanroom);
            //       }

            // if room is on list and hasnt been updatred in a while.

        }

    },

    addToRoomList: function(scanroom) // make available for scout
    {

        var exits = Game.map.describeExits(scanroom);
        //   {
        //   "1": "W8N4",    // TOP
        //  "3": "W7N3",    // RIGHT
        //  "5": "W8N2",    // BOTTOM
        //   "7": "W9N3"     // LEFT
        //}
        var ExitTopacc = false;

        var ExitRightacc = false;

        var ExitBottomacc = false;

        var ExitLeftacc = false;

        var exitstwo = Object.keys(exits);
        for (var i = 0; i < exitstwo.length; i++)
        {
            if (exitstwo[i] == "1")
            {
                ExitTopacc = true;
            }
            if (exitstwo[i] == "3")
            {
                ExitRightacc = true;
            }
            if (exitstwo[i] == "5")
            {
                ExitBottomacc = true;
            }
            if (exitstwo[i] == "7")
            {
                ExitLeftacc = true;
            }
        }

        var dangerlevel = 0;

        if (Game.rooms[scanroom].controller != undefined)
        {
  //console.log(JSON.stringify(Game.rooms[scanroom].controller.reservation));
          
          
                if (Game.rooms[scanroom].controller.reservation != undefined) // reserved room
                    {
                     //   console.log("reservad room");
                        this.addToHostileEmpireList(scanroom, Game.rooms[scanroom].controller.reservation.username)
                        dangerlevel = 4;
                    }
          
          
          
          
          
          
            if (Game.rooms[scanroom].controller.owner != undefined)
            {
                if (Game.rooms[scanroom].controller.owner.username != "Q13214" && Game.rooms[scanroom].controller.owner.username != undefined)
                {  //console.log("a" );
                    if (Game.rooms[scanroom].controller.level > 0) // owned room
                    {
                        this.addToHostileEmpireList(scanroom, Game.rooms[scanroom].controller.owner.username)
                        dangerlevel = 5;
                    }
                   
                }
            }

            if (Game.rooms[scanroom].controller.level == 0) // empty room
            {
                dangerlevel = 2;
            }

        }
        else
        {
            // keepers

            // halway

            var targets = Game.rooms[scanroom].find(FIND_HOSTILE_STRUCTURES,
            {
                filter: function(object)
                {
                    return object.structureType == STRUCTURE_KEEPER_LAIR;
                }
            });

            if (targets.length == 0)
            {
                dangerlevel = 1;
            }
            else
            {
                dangerlevel = 3;
            }

        }

        /*
        danger levels
        1 hallway
        2 empty room
        3 keeper room
        4 reserved room
        5 controlled room



        */

        Memory.roomlist[scanroom] = {
            roomname: scanroom,
            distanceFromHomeRoom: 99999,
            closestRoom: "",
            dangerLevel: dangerlevel,
            ExitTop: ExitTopacc,
            ExitRight: ExitRightacc,
            ExitBottom: ExitBottomacc,
            ExitLeft: ExitLeftacc

        }

        ;

    },


handleCurrentRelationships: function(){

   //   war list
// currentRelationship list    war (kill every room whenever can)  harrass ( remove all minders with outriders)  net () good ()

   /* 
   
    [Atanner,"net"],
    [TgDgNU,"net"],
    [RayAidas,"net"],
    [Hulmir,"net"],
    [6g3y,"net"],
    [SBense,"net"]
   */ 
var warList=[];
    
    for(var i = 0; i < warList.length; i++)
    {
        if (Memory.hostileempires[warList[i]] != undefined)
        {
            Memory.hostileempires[warList[i]].currentRelationship = "war";
            
    
    
        }  
    }
         
    
    
    
    
},








    addToHostileEmpireList: function(scanroom, usernameacc) // make available for scout
    {

        if (Memory.hostileempires[usernameacc] == undefined)
        {
            Memory.hostileempires[usernameacc] = {

                listOfBases: [],
                listOFminingRooms: [],
                generalDangerLevel: 0,
                currentRelationship: "good",
                exploitableBehaviors:
                {}

            };
        }
        else
        {


                   if (Game.rooms[scanroom].controller.reservation != undefined) // reserved room
                    {
                        var checker = Memory.hostileempires[usernameacc].listOFminingRooms.indexOf(scanroom); // 1  (true)

                        if (checker == -1)
                        {
                            Memory.hostileempires[usernameacc].listOFminingRooms.push(scanroom);
                        }

                    }
                








            if (Game.rooms[scanroom].controller != undefined && Game.rooms[scanroom].controller.owner != undefined )
            {
                if (Game.rooms[scanroom].controller.owner.username != "Q13214" && Game.rooms[scanroom].controller.owner.username != undefined)
                {
                    if (Game.rooms[scanroom].controller.level > 0) // owned room
                    {
                        var checker = Memory.hostileempires[usernameacc].listOfBases.indexOf(scanroom); // 1  (true)
                        if (checker == -1)
                        {
                            Memory.hostileempires[usernameacc].listOfBases.push(scanroom);
                        }

                    }
 

                }
                
                
                
                
                
                  
                
                

            }

        }

    },

    getRoomname: function(center, xx, yy)
    {
        var xxString = "";
        var yyString = "";
        var xletter = center.substring(0, 1);
        var yletter = "";
        if (center.indexOf("S") != -1)
        {
            yletter = "S";
        }
        if (center.indexOf("N") != -1)
        {
            yletter = "N";
        }
        var yyposition = center.indexOf(yletter);
        //console.log("yyposition",yyposition);
        if (yyposition == 2)
        {
            xxString = center.substring(1, 2);
            yyString = center.substring(3, center.length);
        }
        if (yyposition == 3)
        {
            xxString = center.substring(1, 4);
            yyString = center.substring(4, center.length);
        }
        var xxint = parseInt(xxString);
        var yyint = parseInt(yyString);
        if (xxint < Math.abs(xx) && xx < 0 && xletter == "E")
        {
            xxint = Math.abs((Math.abs(xx) - xxint));
            xletter = "W";
            //    console.log("e to w");
        }
        else if (xxint < Math.abs(xx) && xx < 0 && xletter == "W")
        {
            xxint = Math.abs((Math.abs(xx) - xxint));
            xletter = "E";
            //      console.log("w to e");
        }
        else
        {
            xxint = Math.abs((xxint + xx));
        }
        if (yyint < Math.abs(yy) && yy < 0 && yletter == "N")
        {
            yyint = Math.abs((Math.abs(yy) - yyint));
            yletter = "S";
        }
        else if (yyint < Math.abs(yy) && yy < 0 && yletter == "S")
        {
            yyint = Math.abs((Math.abs(yy) - yyint));
            yletter = "N";
        }
        else
        {
            yyint = Math.abs((yyint + yy));
        }
        
        
        
        
        
        
        
        
        
        
        /// if crossing north to south - 1 from the y to accoutn for two 0  this is likly the case for all directions 
if(yletter == "S"  && center.indexOf("S") == -1)// if the new letter is s and the old one wasnt 
{
    yyint--;
}


/// if crossing north to south - 1 from the y to accoutn for two 0  this is likly the case for all directions 
if(yletter == "N"  && center.indexOf("N") == -1)// if the new letter is s and the old one wasnt 
{
    yyint--;
}


/// if crossing north to south - 1 from the y to accoutn for two 0  this is likly the case for all directions 
if(yletter == "E"  && center.indexOf("E") == -1)// if the new letter is s and the old one wasnt 
{
    xxint--;
}


/// if crossing north to south - 1 from the y to accoutn for two 0  this is likly the case for all directions 
if(yletter == "W"  && center.indexOf("W") == -1)// if the new letter is s and the old one wasnt 
{
    xxint--;
}



        
        
        
        
        
        
        
        
        
        return xletter + xxint + yletter + yyint;
    }
}
module.exports = obs;