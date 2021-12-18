var roompathfind = require('roompathfinder');
var roomClaimer = {

    run: function(roomID)
    {
    
//  var pathacc = roompathfind.run(attackID, ownedrooms[i], 0); // 0 means allow through hostile rooms

var roomss = this.selectRooms(roomID);

if(roomss.length != 0)
{
    this.sendClaimSquad(roomID,roomss[0]);
}


        var storeage = Game.rooms[roomID].storage;

if(storeage != undefined)
{
    delete Memory.claimManager[roomID];
}

















    },
    selectRooms: function(roomID)
    {
         var ownedrooms = [];
        var roomsa = [];
        if (Memory.empire != undefined && Memory.empire.roomsobj != undefined)
        {
            ownedrooms = Object.keys(Memory.empire.roomsobj);
        }
       
        var returnList = [];
        var counter=99;
        for (var i = 0; i < ownedrooms.length; i++)
        {
            if (Game.map.getRoomLinearDistance(roomID, ownedrooms[i]) < counter ) // check that room has good amount of boosts
            {
                counter = Game.map.getRoomLinearDistance(roomID, ownedrooms[i]);
                returnList=[];
                returnList.push(ownedrooms[i]);
            }
        }
        
        
        
        
        
        return returnList
    },
  sendClaimSquad: function(targetRoom, HomeRoom)
    {
        
        var rawPath = roompathfind.run(targetRoom, HomeRoom, 5);  
         var Path = [
           
        ];
   
                    for (var q = 0; q < rawPath.length; q++)
                    {
                        Path.push(["forcemoveToRoom", rawPath[q]])
                    }
        
      console.log(JSON.stringify(Path));
         Path.push(["forcemoveToRoom",targetRoom])
        for(var c = 0; c < 3; c++)
        {
            Game.spawns[HomeRoom].spawnCreep([MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY,MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY],
                targetRoom + 'repair-' + c,
                {
                    memory:
                    {
                        role: 'repair',
                        memstruct:
                        {
                            spawnRoom: HomeRoom,
                            tasklist: Path,
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: true,
                            hastask: false
                        }
                    }
                });
        }
        
        for(var c = 0; c < 1; c++)
        {
            Game.spawns[HomeRoom].spawnCreep([MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY,MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY,MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY,MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY],
                targetRoom + 'up' + c,
                {
                    memory:
                    {
                        role: 'upgrader',
                        memstruct:
                        {
                            spawnRoom: HomeRoom,
                            tasklist: Path,
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: true,
                            hastask: false
                        }
                    }
                });
        }
        
   var      parts=[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY]
                                Game.spawns[HomeRoom].spawnCreep(parts, 'minharvester1' + HomeRoom,
                        {
                            memory:
                            {
                                role: 'harvester',
                                sourcetarget: 1,
                              memstruct:
                        {
                            spawnRoom: targetRoom,
                            tasklist: Path,
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: true,
                            hastask: false
                        }
                            }
                        });
        Game.spawns[HomeRoom].spawnCreep(parts, 'minharvester0' + HomeRoom,
                        {
                            memory:
                            {
                                role: 'harvester',
                                sourcetarget: 0,
                              memstruct:
                        {
                            spawnRoom: targetRoom,
                            tasklist: Path,
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: true,
                            hastask: false
                        }
                            }
                        });
        
        
        
        
        
 
        Path.push(["claim"]);
        Game.spawns[HomeRoom].spawnCreep([MOVE, MOVE, MOVE, MOVE, CLAIM],
            'claimer',
            {
                memory:
                {
                    role: 'multi',
                    memstruct:
                    {
                        spawnRoom: HomeRoom,
                        tasklist: Path,
                        objectIDStorage: "",
                        boosted: false,
                        moveToRenew: false,
                        opportuniticRenew: true,
                        hastask: false
                    }
                }
            });
    },
 

}
module.exports = roomClaimer;