var squadmanage = require('squadManager');
var bannedMineRooms = ["E27N3", "E26N3", "E23N3", "E23N4", "E22N4", "E22N5", "E27N6",   "E28N7","E28N4","E26N1"];
var squadgenerator = {
    run: function(roomname)
    {
        
        var mainflag = Game.flags[roomname];
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////// CENTER MINES////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(Game.rooms[roomname].storage.store.getUsedCapacity("energy") > 10000 && Memory.empire.roomsobj[roomname].centerroomsinrange.length != 0 && Game.rooms[roomname].controller.level ==8  )
        {
            
                var squads = Memory.squadObject;
                var squadnames = Object.keys(squads);
                var currsquadspawning = Game.flags[roomname].memory.flagstruct.squadspawning;
              /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // creating mineing squads  
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                for(l = 0; l < Memory.empire.roomsobj[roomname].centerroomsinrange.length; l++)
                {
                    var squadAlreadyExists = false;
                    var damagesquadready = false;
                    for(q = 0; q < squadnames.length; q++)
                    {
                        if(squadnames[q] == (roomname + Memory.empire.roomsobj[roomname].centerroomsinrange[l] + "centerMiningSquad"))
                        {
                            squadAlreadyExists = true;
                        }
                    }
                    for(q = 0; q < squadnames.length; q++)
                    {
                        if(currsquadspawning.includes(roomname + Memory.empire.roomsobj[roomname].centerroomsinrange[l] + "centerMiningSquad"))
                        {
                            Game.flags[roomname].memory.flagstruct.squadspawning = "";
                        }
                    }
            
                    if(!squadAlreadyExists )
                    {
                        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
                        var numberofparts = Math.floor((energyavailable - 200) / 150);
                        if(numberofparts > 9)
                        {
                            numberofparts = 9;
                        }
                        var bodypartsMINER = [CARRY, CARRY, MOVE, MOVE];
                        for(let j = 0; j < numberofparts; j++)
                        {
                            bodypartsMINER.push(MOVE);
                            bodypartsMINER.push(WORK);
                        }
                     
                
                        squadmanage.initializeSquad(roomname + Memory.empire.roomsobj[roomname].centerroomsinrange[l] + "centerMiningSquad", [Memory.empire.roomsobj[roomname].centerroomsinrange[l]], false, "centerMiningSquad", roomname,
                        {
                            "miner0": bodypartsMINER,
                            "miner1": bodypartsMINER,
                            "miner2": bodypartsMINER,
                        },"a");
                    }
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////other mines////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(Game.rooms[roomname].storage.store.getUsedCapacity("energy") > 10000)
        {
            if(Memory.empire.roomsobj[roomname].centerroomsinrange.length < 2  )
            {
                var squads = Memory.squadObject;
                var squadnames = Object.keys(squads);
                for(l = 0; l < Memory.empire.roomsobj[roomname].MineRooms.length; l++)
                {
                    var found = false;
                    for(q = 0; q < bannedMineRooms.length; q++)
                    {
                        if(bannedMineRooms[q] == Memory.empire.roomsobj[roomname].MineRooms[l])
                        {
                            found = true;
                        }
                    }
                    if(!found && l <4)
                    {
                        var squadAlreadyExists = false;
                        var damagesquadready = false;
                        for(q = 0; q < squadnames.length; q++)
                        {
                            if(squadnames[q] == (roomname + Memory.empire.roomsobj[roomname].MineRooms[l] + "MiningSquad"))
                            {
                                squadAlreadyExists = true;
                            }
                        }
                        if(!squadAlreadyExists)
                        {
                            var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
                            var numberofparts = Math.floor((energyavailable - 200) / 150);
                            if(numberofparts > 6)
                            {
                                numberofparts = 6;
                            }
                            var bodypartsMINER = [CARRY, CARRY, MOVE, MOVE];
                            for(let j = 0; j < numberofparts; j++)
                            {
                                bodypartsMINER.push(MOVE);
                                bodypartsMINER.push(WORK);
                            }
              
                  
                        
                                squadmanage.initializeSquad(roomname + Memory.empire.roomsobj[roomname].MineRooms[l] + "MiningSquad", [Memory.empire.roomsobj[roomname].MineRooms[l]], false, "MiningSquad", roomname,
                                {
                                    "miner0": bodypartsMINER
                                },"a");
                           
                           
                        }
                    }
                }
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   
    }
}
module.exports = squadgenerator;