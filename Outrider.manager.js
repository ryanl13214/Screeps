var roompathfind = require('roompathfinder');
var harrassers = require('Outrider.mineHarasser');
var OutriderManager = {
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
            if (Game.map.getRoomLinearDistance(roomID, ownedrooms[i]) < counter && Game.map.getRoomLinearDistance(roomID, ownedrooms[i]) != 0 &&  ownedrooms[i] != "E24N3" ) //  check room has a valid path 
            {
                counter = Game.map.getRoomLinearDistance(roomID, ownedrooms[i]);
                returnList = [];
                returnList.push(ownedrooms[i]);
            }
        }

        if (returnList.length != 0)
        {
            return returnList[0]
        }
        else
        {
            return "null"
        }

    },

    createDesieredCreepList: function()
    {

        var Peacebool = true;

        var warList = Object.keys(Memory.hostileempires);
        for (var i = 0; i < warList.length; i++)
        {
            if (Memory.hostileempires[warList[i]].currentRelationship == "war")
            {
                Peacebool = false;
                for (var ii = 0; ii < Memory.hostileempires[warList[i]].listOFminingRooms.length; ii++)
                {

                    var tkmpobj = {
                        targRoomname: Memory.hostileempires[warList[i]].listOFminingRooms[ii],
                        nearestRoomName: this.selectRooms(Memory.hostileempires[warList[i]].listOFminingRooms[ii]),
                        creeptrole: "atk",
                        GuardBody: [],
                        lastActiveGuard: 0
                    }

                    Memory.outrider.TargetRooms.push(tkmpobj)
                }

            }
        }
        Memory.outrider.PeaceInTheVally = Peacebool

    },

    run: function(roomID)
    {

        if (Memory.outrider == undefined)
        {
            Memory.outrider = {
                TargetRooms: [],
                PeaceInTheVally: false,
                activeRiders:[]
            }
        }

        if (Memory.outrider.TargetRooms.length == 0 && (Memory.outrider.PeaceInTheVally == false || Game.time % 20 == 0))
        {
            this.createDesieredCreepList()
        }

        for (var i = 0; i < Memory.outrider.TargetRooms.length; i++)
        {

    

            if (Memory.outrider.TargetRooms[i].lastActiveGuard == 0 || Game.time - Memory.outrider.TargetRooms[i].lastActiveGuard < 0)        // if the creep in room warning was old 
            {

               this.spawnnewcreep(Memory.outrider.TargetRooms[i].targRoomname , Memory.outrider.TargetRooms[i].nearestRoomName ,  Memory.outrider.TargetRooms[i].creeptrole   )

            }

        } 
        
         var all = [];
        var target;
        for (var c = 0; c <   Memory.outrider.activeRiders.length       ; c++)
        {
            
            if(!Game.getObjectById(Memory.outrider.activeRiders[c]))
            {
                 Memory.outrider.activeRiders.splice(c, 1); 
            }
            
            if(1==1){// begiond with mine
           harrassers.run(Game.getObjectById(Memory.outrider.activeRiders[c]))
           }
            
            
        }
        
        
        
        
        

    },
    spawnnewcreep: function(roomname, squadHomeRoom, typeacc)
    {

        // add in function fpor broken squads to be reincorpirated
        var tasklistt = [
            ["findPathBetweenRooms", roomname, squadHomeRoom, 4],
            ["joinOutriders"]
        ];
        var bodyparts = []

        if (typeacc == "atk")
        {
            bodyparts = [MOVE, ATTACK]
        }

        // find the missing members 
        var memstruct = {
            spawnRoom: squadHomeRoom,
            tasklist: tasklistt,
            objectIDStorage: "",
            boosted: false,
            moveToRenew: false,
            opportuniticRenew: true,
            hastask: false,
            full: false,
            spawntime: Game.time,
            wantsToJoinSquad: false,
            isInSquad: false,
            SquadID: "0",
            SquadRole: false
        };
        var allspawns = Game.rooms[squadHomeRoom].find(FIND_MY_SPAWNS);
        if (Game.rooms[squadHomeRoom].storage && Game.rooms[squadHomeRoom].storage.store.getUsedCapacity("energy") > 30000)
        {
            for (var i = 0; i < allspawns.length; i++)
            {

                allspawns[i].spawnCreep(bodyparts, "mine-OR-" + roomname,
                {
                    memory:
                    {
                        role: 'multi',
                        attackrole: typeacc,
                        cpuUsed: 0,
                        memstruct: memstruct
                    }
                });
            }
        }

    },

}
module.exports = OutriderManager;