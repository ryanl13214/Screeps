var squadmanage = require('squadManager');
var bannedMineRooms = ["E27N3", "E26N3", "E23N3", "E23N4", "E22N4", "E22N5", "E27N6",   "E28N7","E28N4","E26N1"];
var squadgenerator = {
    run: function(roomname)
    {
        var mainflag = Game.flags[roomname];
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////// CENTER MINES////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(Game.rooms[roomname].storage.store.getUsedCapacity("energy") > 10000 && mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange.length != 0 && Game.rooms[roomname].controller.level ==8  )
        {
            
                var squads = Memory.squadObject;
                var squadnames = Object.keys(squads);
                var currsquadspawning = Game.flags[roomname].memory.flagstruct.squadspawning;
              /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // creating mineing squads  
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                for(l = 0; l < mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange.length; l++)
                {
                    var squadAlreadyExists = false;
                    var damagesquadready = false;
                    for(q = 0; q < squadnames.length; q++)
                    {
                        if(squadnames[q] == (roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "centerMiningSquad"))
                        {
                            squadAlreadyExists = true;
                        }
                    }
                    for(q = 0; q < squadnames.length; q++)
                    {
                        if(currsquadspawning.includes(roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "centerMiningSquad"))
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
                        var bodypartsfixer = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL];
                        var numberofparts = Math.floor((energyavailable) / 100);
                        if(numberofparts > 25)
                        {
                            numberofparts = 25;
                        }
                        var bodypartsMOVER = [];
                        for(let j = 0; j < numberofparts; j++)
                        {
                            bodypartsMOVER.push(MOVE);
                            bodypartsMOVER.push(CARRY);
                        }
                        squadmanage.initializeSquad(roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "centerMiningSquad", [mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l]], false, "centerMiningSquad", roomname,
                        {
                            "mover1": bodypartsMOVER,
                            "mover2": bodypartsMOVER,
                            "mover3": bodypartsMOVER,
                            "mover4": bodypartsMOVER,
                            "mover5": bodypartsMOVER,
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
            if(mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange.length < 2 || 1==1)
            {
                var squads = Memory.squadObject;
                var squadnames = Object.keys(squads);
                for(l = 0; l < mainflag.memory.flagstruct.claimedroomstuct.MineRooms.length; l++)
                {
                    var found = false;
                    for(q = 0; q < bannedMineRooms.length; q++)
                    {
                        if(bannedMineRooms[q] == mainflag.memory.flagstruct.claimedroomstuct.MineRooms[l])
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
                            if(squadnames[q] == (roomname + mainflag.memory.flagstruct.claimedroomstuct.MineRooms[l] + "MiningSquad"))
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
                            var numberofparts = Math.floor((energyavailable) / 100);
                            if(numberofparts > 15)
                            {
                                numberofparts = 15;
                            }
                            var bodypartsMOVER = [];
                            for(let j = 0; j < numberofparts; j++)
                            {
                                bodypartsMOVER.push(MOVE);
                                bodypartsMOVER.push(CARRY);
                            }
                        
                                squadmanage.initializeSquad(roomname + mainflag.memory.flagstruct.claimedroomstuct.MineRooms[l] + "MiningSquad", [mainflag.memory.flagstruct.claimedroomstuct.MineRooms[l]], false, "MiningSquad", roomname,
                                {
                                    "mover1": bodypartsMOVER,
                                    "mover2": bodypartsMOVER,
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