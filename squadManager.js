var creepfunctions = require('prototype.creepfunctions');
var coremining = require('squad.coremining');
var roommining = require('squad.roommining');
var quadsquad = require('squad.quad');
var duosquad = require('squad.duo');
var squadmanager = {
    run: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];

        try
        {
            if (Memory.squadObject[Memory.empire.roomsobj[mainMemoryObject.squadHomeRoom].squadSpawning] == undefined)
            {
               Memory.empire.roomsobj[mainMemoryObject.squadHomeRoom].squadSpawning= "";
            }
        }
        catch (e)
        {
            // squad setup wrong
            delete Memory.squadObject[squadID];
        }

        var numberOfLivingSqaudMembers = [];
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            if (Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]))
            {
                numberOfLivingSqaudMembers.push(mainMemoryObject.SquadMembersCurrent[c]);
            }
        }
        mainMemoryObject.SquadMembersCurrent = numberOfLivingSqaudMembers;
        if (mainMemoryObject.squadcreationtime + 1500 < Game.time && numberOfLivingSqaudMembers.length == 0 || ((mainMemoryObject.squadType == "duo" || mainMemoryObject.squadType == "quad") && mainMemoryObject.SquadMembersCurrent.length == 0 && mainMemoryObject.squadisready))
        {
            console.log("deleting squad-", squadID);
            delete Memory.squadObject[squadID];
        }
        else
        {
            var squadMemberGoal = Object.values(mainMemoryObject.SquadMembersGoal);
            if (mainMemoryObject.SquadMembersCurrent.length < squadMemberGoal.length )
            {

                if (Memory.empire.roomsobj[mainMemoryObject.squadHomeRoom].squadSpawning == "")
                {
                    Memory.empire.roomsobj[mainMemoryObject.squadHomeRoom].squadSpawning = squadID;
                    if (Memory.empire.roomsobj[mainMemoryObject.squadHomeRoom].squadSpawning != undefined)
                    {
                        Memory.empire.roomsobj[mainMemoryObject.squadHomeRoom].squadSpawning = squadID;
                    }
                }
                if (Memory.empire.roomsobj[mainMemoryObject.squadHomeRoom].squadSpawning == squadID)
                {
                    if (mainMemoryObject.squadType == "quad" && mainMemoryObject.squadisready == true)
                    {
                        Memory.empire.roomsobj[mainMemoryObject.squadHomeRoom].squadSpawning = "";

                        if (Memory.empire.roomsobj[mainMemoryObject.squadHomeRoom].squadSpawning != undefined)
                        {
                            Memory.empire.roomsobj[mainMemoryObject.squadHomeRoom].squadSpawning = "";
                        }
                    }

                    else if (mainMemoryObject.squadType == "duo" && mainMemoryObject.squadisready == true)
                    {
                        Memory.empire.roomsobj[mainMemoryObject.squadHomeRoom].squadSpawning = "";
                    }

                    else
                    {
                      this.spawnnewcreep(squadID, mainMemoryObject.squadHomeRoom);
                    }
                }
            }
            else if (mainMemoryObject.SquadMembersCurrent.length == squadMemberGoal.length)
            {
                mainMemoryObject.squadisready = true;
                Memory.empire.roomsobj[mainMemoryObject.squadHomeRoom].squadSpawning = "";
                if (Memory.empire.roomsobj[mainMemoryObject.squadHomeRoom].squadSpawning != undefined)
                {
                    Memory.empire.roomsobj[mainMemoryObject.squadHomeRoom].squadSpawning = "";
                }
            }
            /////////////////////////////////////Solid GroupSquads////////////////////////////////////////////////////////////////////  squads that only fuinctiuon with set numbers 

            if (mainMemoryObject.squadType == "quad" && (mainMemoryObject.SquadMembersCurrent.length != 0 && mainMemoryObject.squadisready))
            {
                quadsquad.run(squadID);
            }
            if (mainMemoryObject.squadType == "duo" && (mainMemoryObject.SquadMembersCurrent.length != 0 && mainMemoryObject.squadisready))
            {
                duosquad.run(squadID);
            }
            ///////////////////////////////////////////////////////////////////////////////////////////////////////// squads that can function with looser restrictions
            if (mainMemoryObject.SquadMembersCurrent.length != 0) //independant squads
            {
                if (mainMemoryObject.squadType == "centerMiningSquad")
                {
                    coremining.run(squadID);
                }
                if (mainMemoryObject.squadType == "MiningSquad")
                {
                    var startCpu = Game.cpu.getUsed();
                    roommining.run(squadID);
       //            Game.flags[mainMemoryObject.squadHomeRoom].memory.flagstruct.mineroomsCPU += Game.cpu.getUsed() - startCpu;
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    },
    initializeSquad: function(squadID, arrayOfSquadGoals, squadIsBoosted, squadType, squadHomeRoom, SquadMembers, squadSubType)
    {
        console.log("creating squad", squadID);
        Memory.squadObject[squadID] = {
            arrayOfSquadGoals: arrayOfSquadGoals,
            squadIsBoosted: squadIsBoosted,
            squadType: squadType,
            squadHomeRoom: squadHomeRoom,
            SquadMembersCurrent: [],
            squadSubType: squadSubType,
            squadposition: [25, 25],
            SquadMembersGoal: SquadMembers,
            squadisready: false,
            squadcreationtime: Game.time,
            squaddisolvetime: Game.time + 1500
        };
    },
    spawnnewcreep: function(squadID, squadHomeRoom)
    {

        // add in function fpor broken squads to be reincorpirated
        var mainMemoryObject = Memory.squadObject[squadID];
        var tasklistt = [
            ["joinSquad", squadID]
        ];
        var mainflag = Game.flags[squadHomeRoom];
        if (mainMemoryObject.squadIsBoosted == true)
        {
            var temp = [];
            var waitUntil = Object.keys(mainMemoryObject.SquadMembersGoal);
            for (var c = 0; c < waitUntil.length; c++)
            {
                temp.push(waitUntil[c] + "-" + squadID);
            }
            tasklistt = [
                ["waitForCreepsToSpawn", temp],
                ["renewfull"],
                ["boosAllMax"],
                //   ["moveToLoose", mainflag.pos.x - 7, mainflag.pos.y - 7],
                ["joinSquad", squadID]
            ];
        }
        else
        {
            tasklistt = [
                ["joinSquad", squadID]
            ];
        }
        var mainflag = Game.flags[squadHomeRoom];
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
        var mainMemoryObject = Memory.squadObject[squadID];
        var number = Game.time % Object.values(mainMemoryObject.SquadMembersGoal).length;
        var resourcevalues = Object.values(mainMemoryObject.SquadMembersGoal);
        var names = Object.keys(mainMemoryObject.SquadMembersGoal);
        var sucs3esscounter = 9;
        var total = 0;
        for (var i = 0; i < allspawns.length; i++)
        {
            var curspawn = allspawns[i];
            for (var q = 0; q < names.length; q++)
            {
                if (sucs3esscounter != 0 && Game.rooms[squadHomeRoom].storage.store.getUsedCapacity("energy") > 10000 || Game.rooms[squadHomeRoom].controller.level == 8)
                {
                    sucs3esscounter = curspawn.spawnCreep(resourcevalues[q], names[q] + "-" + squadID,
                    {
                        memory:
                        {
                            role: 'multi',
                            cpuUsed: 0,
                            memstruct: memstruct
                        }
                    });
                    //////////////////////////////////////////////////// resource tracking ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    if (sucs3esscounter == 0 && (Memory.squadObject[squadID].squadType == "MiningSquad" || Memory.squadObject[squadID].squadType == "centerMiningSquad" || Memory.squadObject[squadID].squadType == "solocenterdamager"))
                    {
                        total = 0;
                        for (var j = 0; j < resourcevalues[q].length; j++)
                        {
                            if (resourcevalues[q][j] == HEAL)
                            {
                                total += 250;
                            }
                            if (resourcevalues[q][j] == ATTACK)
                            {
                                total += 80;
                            }
                            if (resourcevalues[q][j] == RANGED_ATTACK)
                            {
                                total += 150;
                            }
                            if (resourcevalues[q][j] == WORK)
                            {
                                total += 100;
                            }
                            if (resourcevalues[q][j] == MOVE)
                            {
                                total += 50;
                            }
                            if (resourcevalues[q][j] == MOVE)
                            {
                                total += 50;
                            }
                            if (resourcevalues[q][j] == TOUGH)
                            {
                                total += 10;
                            }
                        }
                     //   if (Game.flags[squadHomeRoom].memory.flagstruct.mineroomsCost == undefined)
                    //    {
                      //      Game.flags[squadHomeRoom].memory.flagstruct.mineroomsCost = 0;
                      //  }
               //         Game.flags[squadHomeRoom].memory.flagstruct.mineroomsCost += total;
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                }
            }
        }
    },
}
module.exports = squadmanager;