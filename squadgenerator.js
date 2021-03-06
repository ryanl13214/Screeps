var squadmanage = require('squadManager');
var bannedMineRooms = ["E27N3", "E26N3", "E23N3", "E23N4", "E22N4", "E22N5", "E27N6", "E29N5", "E28N7", "E27N6"];
var squadgenerator = {
    run: function(roomname, redflags)
    {
        var mainflag = Game.flags[roomname];
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////// CENTER MINES////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(Game.rooms[roomname].storage.store.getUsedCapacity("energy") > 10000)
        {
            if(mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange.length != 0)
            {
                var squads = Memory.squadObject;
                var squadnames = Object.keys(squads);
                var currsquadspawning = Game.flags[roomname].memory.flagstruct.squadspawning;
                // creating damage squads
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                for(l = 0; l < mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange.length; l++)
                {
                    var found = false;
                    for(q = 0; q < squadnames.length; q++)
                    {
                        if(squadnames[q] == (roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "centerdamagesquad") || squadnames[q] == (roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "solocenterdamager"))
                        {
                            found = true;
                        }
                    }
                    var centerxposition = mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l].substring(1, 3);
                    var centeryposition = mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l].substring(4, 5);
                    if(centerxposition == "25" && centeryposition == "5")
                    {
                        found = true;
                    }
                    if(!found)
                    {
                        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
                        if(Game.rooms[roomname].controller.level == 7){
                        squadmanage.initializeSquad(roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "solocenterdamager", [mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l]], false, "solocenterdamager", roomname,
                        {
                            "solo": [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                     });
                        } 
                         if(Game.rooms[roomname].controller.level == 8){
                            squadmanage.initializeSquad(roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "solocenterdamager", [mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l]], false, "solocenterdamager", roomname,
                        {
                            "solo": [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL],
                           
                        });  
                             
                         }
                        
                    }
                }
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
                        if((squadnames[q] == (roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "solocenterdamager") && Memory.squadObject[roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "solocenterdamager"].squadisready == true))
                        {
                            damagesquadready = true;
                            if(currsquadspawning.includes(roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "centerMiningSquad"))
                            {
                                if(Memory.squadObject[roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "solocenterdamager"].SquadMembersCurrent.length > 0)
                                {}
                                else
                                {
                                    console.log("resetting squad spawn priority from mineing operations");
                                    Game.flags[roomname].memory.flagstruct.squadspawning = "";
                                }
                            }
                        }
                    }
                    var centerxposition = mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l].substring(1, 3);
                    var centeryposition = mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l].substring(4, 5);
                    if(centerxposition == "25" && centeryposition == "5")
                    {
                        damagesquadready = true;
                    }
                    if(!squadAlreadyExists && damagesquadready)
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
                        });
                    }
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////other mines////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(Game.rooms[roomname].storage.store.getUsedCapacity("energy") > 10000)
        {
            if(mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange.length < 2)
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
                    if(!found && l <3)
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
                                    "miner0": bodypartsMINER,
                                    "claimer": [MOVE, CLAIM, MOVE, CLAIM]
                                });
                           
                            if(1 == 2)
                            {
                                squadmanage.initializeSquad(roomname + mainflag.memory.flagstruct.claimedroomstuct.MineRooms[l] + "MiningSquad", [mainflag.memory.flagstruct.claimedroomstuct.MineRooms[l]], false, "MiningSquad", roomname,
                                {
                                    "mover1": bodypartsMOVER,
                                    "mover2": bodypartsMOVER,
                                    "mover3": bodypartsMOVER,
                                    "miner0": bodypartsMINER,
                                    "miner1": bodypartsMINER,
                                    "claimer": [MOVE, CLAIM, MOVE, CLAIM]
                                });
                            }
                        }
                    }
                }
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }
}
module.exports = squadgenerator;