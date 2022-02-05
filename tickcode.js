/// red + begin with quadf spawns a flag attack squad
// yellow dismantle flags
// blue ranged targets
// brown stronghold Attack
var roompathfind = require('roompathfinder');
var squadmanage = require('squadManager');
   var observer = require('observer');
var tickcode = {
    run: function()
    {
        // anti creep   var deathBlinker = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]

        // generic 10 tougbht 30 heal 
        //     var bodypartstail =  [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL];

        //   10 tought 15 heal 15 ranged 
        //         var bodypartshead =  [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL];

        // 12 tough 14 range 14 heal 
        // var bodyp = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL];

        if (Game.shard.name == "shard2")
        {
            
            this.launchNukea();
            this.flagControl();
            var squadname = "TEST"

            for (var name in Game.creeps)
            {
                if (Game.creeps[name])
                {
                    if (Game.creeps[name].memory.role == "mover")
                    {
                        //   Game.creeps[name].suicide()
                    }

                }
            }





 


/*
5ff8a9b25961652be06ff2e5   term 
604086126454eac544410921   fact



var twr = Game.getObjectById("61e142e76486b621f4480f5f");

var str = Game.getObjectById("5fdf5a4f9fcf940d421a1419");

twr.attack(str);

    var rawPath = roompathfind.run("E23S4","E25N1", 4);

 var finalPath = [];
   for (var q = 0; q < rawPath.length; q++)
            {
                finalPath.push(["forcemoveToRoom", rawPath[q]])
            }

    finalPath.push(["gatherstoredResources", rawPath[q]])

    finalPath.push(["BMdrop" ])
  finalPath.push(["repeat",2 ])

var bpodyparts =[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL]

  Game.spawns["E25N1"].spawnCreep(bpodyparts, 'dropper' ,
                    {
                        memory:
                        {
                            role: 'mover',
                            cpuUsed: 0,
                            roomtarg: "E25N1",
                            sourcetarget: Game.time % 2,
                            full: false,
                            memstruct: {
                spawnRoom: "E25N1",
                tasklist:finalPath,
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
            }
                        }
                    });
*/





       
            /////////////////////////////////////////////////////////////////////////////////////////////////////
 

        }
    },

    selectRooms: function(roomID) // select rooms within moverange
    {

        var ownedrooms = [];
        var roomsa = [];
        if (Memory.empire != undefined && Memory.empire.roomsobj != undefined)
        {
            ownedrooms = Object.keys(Memory.empire.roomsobj);
        }

        var returnList = [];
        var counter = 15;
        for (var i = 0; i < ownedrooms.length; i++)
        {
            if( Game.rooms[ownedrooms[i]] == undefined)
            {
            delete     Memory.empire.roomsobj[ownedrooms[i]]
            }
            else if(Game.map.getRoomLinearDistance(roomID, ownedrooms[i]) < counter && Game.map.getRoomLinearDistance(roomID, ownedrooms[i]) > 0 && Game.rooms[ownedrooms[i]].controller.level == 8) // check that room has good amount of boosts
            {
                counter = Game.map.getRoomLinearDistance(roomID, ownedrooms[i]);
                returnList = [];
                returnList.push(ownedrooms[i]);
            }
        }

        return returnList
    },

    createBlinkySQuad: function(flagname)
    {
        var squadflag = Game.flags[flagname];
        var squadtype = flagname.substring(4, flagname.length - 1);
        var squadName = squadflag.name;
        var flagroomName = squadflag.pos.roomName;

        if (squadflag.color == COLOR_RED)
        {

            // find closest room
            var roomss = this.selectRooms(flagroomName)

            if (roomss.length == 0)
            {
                return 0;
            }

            var squadname = squadName;

            if (Memory.squadObject[squadname] == undefined) // && Game.time % 1500 < 100)
            {
                var finalPath = [];

                if (squadtype == "std")
                {
                    var deathBlinker = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
                }
                else if (squadtype == "db")
                {
                    var deathBlinker = [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]

                }
                else
                {
                    return 0;
                }

                var rawPath = roompathfind.run(flagroomName, roomss[0], 4);
                for (var q = 0; q < rawPath.length; q++)
                {
                    finalPath.push(["forcemoveToRoom", rawPath[q]])
                }
                finalPath.push(["flagattack", flagroomName]);
                squadmanage.initializeSquad(squadname, finalPath, true, "quad", roomss[0],
                {
                    "head1": deathBlinker,
                    "tail1": deathBlinker,
                    "head2": deathBlinker,
                    "tail2": deathBlinker
                }, "blinky");
            }

        }

    },
    createDuoSQuad: function(flagname)
    {
        var squadflag = Game.flags[flagname];
        var squadtype = flagname.substring(3, flagname.length - 1);
        var squadName = squadflag.name;
        var flagroomName = squadflag.pos.roomName;

        // find closest room
        var roomss = this.selectRooms(flagroomName)

        if (roomss.length == 0)
        {
            return 0;
        }

        var squadname = squadName;

        if (Memory.squadObject[squadname] == undefined)
        {
            var finalPath = [];

            //  dis // flag dismantle
            // atk // chasedown
            // bli // blinkys   

            var bodypartstail = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
            if (squadtype == "dis")
            {
                var bodypartshead = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK]
            }

            var rawPath = roompathfind.run(flagroomName, roomss[0], 4);
            for (var q = 0; q < rawPath.length; q++)
            {
                finalPath.push(["forcemoveToRoom", rawPath[q]])
            }

            squadmanage.initializeSquad(squadname,
                finalPath, true, "duo", roomss[0],
                {
                    "head": bodypartshead,
                    "tail": bodypartstail,
                }, "dis");
        }

    },
    createedgeSQuad: function(flagname) ///               getRoomname: function(center, xx, yy)
    {
        var squadflag = Game.flags[flagname];
        
        
        
        var flagx = squadflag.pos.x
        var flagy = squadflag.pos.y
            var flagroomName = squadflag.pos.roomName;
            var edgeroonmane = "";
        if(flagx == 47){
        
            edgeroonmane =  observer.getRoomname(flagroomName, 1, 0)
        }
               if(flagx == 2){
                 
                 edgeroonmane =  observer.getRoomname(flagroomName, -1, 0)
        }
        
        
        if(flagy == 47){
         
                    edgeroonmane =  observer.getRoomname(flagroomName, 0, 1)     
        }
               if(flagy == 2){
                
               edgeroonmane =  observer.getRoomname(flagroomName,0, -1)
        }          
        
        
         
        
        
        
        
        var squadtype = flagname.substring(4, flagname.length - 1);
        var squadName = squadflag.name;
    

        // find closest room
        var roomss = this.selectRooms(flagroomName)

        if (roomss.length == 0)
        {
            return 0;
        }

        var squadname = squadName;

        if (Memory.squadObject[squadname] == undefined)
        {
            var finalPath = [];

            //  dis // flag dismantle
            // atk // chasedown
            // bli // blinkys   

            var bodypartstail = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
            if (squadtype == "dis")
            {
                var bodypartshead = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK]
            }

            var rawPath = roompathfind.run(edgeroonmane, roomss[0], 4);
            for (var q = 0; q < rawPath.length; q++)
            {
                finalPath.push(["forcemoveToRoom", rawPath[q]])
            }
        finalPath.push(["forcemoveToRoom",flagroomName])
            squadmanage.initializeSquad(squadname,
                finalPath, true, "duo", roomss[0],
                {
                    "head": bodypartshead,
                    "tail": bodypartstail,
                }, "dis");
        }

    },
    
    
    
    launchNukea: function()
    {
        var manNukeFlag = Game.flags["nuke"];

        if (manNukeFlag == undefined)
        {
            return 0
        }
        else
        {
            var roomname = manNukeFlag.pos.roomName;

            var roominrange = [];
            var roomsall = Object.keys(Game.rooms);
            var roomsobj = Game.rooms;
            for (var i = 0; i < roomsall.length; i++)
            {

                if (Game.map.getRoomLinearDistance(roomname, roomsall[i]) <= 10 && Game.flags["nuke"] != undefined)
                {

                    var nuker = Game.rooms[roomsall[i]].find(FIND_MY_STRUCTURES,
                    {
                        filter:
                        {
                            structureType: STRUCTURE_NUKER
                        }
                    });
                    if (nuker.length == 1)
                    {
                        var a = nuker[0].launchNuke(Game.flags["nuke"].pos);
                        if (a == 0)
                        {
                            Game.flags["nuke"].remove()

                            return 0
                        }

                    }

                }

            }

        }

    },

    flagControl: function()
    {
        var gameflags = Game.flags;
        var keys = Object.keys(gameflags);
        var values = Object.values(gameflags);
        var roomob2j = Game.flags["qwe"];
        if (roomob2j != undefined)
        {
            var roomObj = roomob2j.room;
            if (roomObj != undefined)
            {
                var constructionSitess = roomObj.find(FIND_CONSTRUCTION_SITES);
                for (var c = 0; c < constructionSitess.length; c++)
                {
                    constructionSitess[c].remove();
                }
                Game.flags["qwe"].remove();
            }
        }
        for (var c = 0; c < keys.length; c++)
        {
            if (values[c].color == COLOR_RED && keys[c].substring(0, 4) == "quad")
            {
                this.createBlinkySQuad(keys[c]);
            }
            if (values[c].color == COLOR_RED && keys[c].substring(0, 3) == "duo")
            {
                this.createDuoSQuad(keys[c]);
            }
           if (values[c].color == COLOR_RED && keys[c].substring(0, 4) == "edge")
            {
                this.createedgeSQuad(keys[c]);
            }
        }
    }

}
module.exports = tickcode;