var labs = {

    decideBoost: function(roomname)
    {
        var mainFlag = Game.flags[roomname];
        var strg = mainFlag.room.storage;
        var terminalActual = mainFlag.room.terminal;
        if (Memory.empire == undefined)
        {
            Memory.empire = {};
        }
        else if (Memory.empire.roomsobj == undefined)
        {
            Memory.empire.roomsobj = {};
        }
        else if (Memory.empire.roomsobj[roomname] == undefined)
        {
            Memory.empire.roomsobj[roomname] = {};
        }

        if (Memory.empire.roomsobj[roomname].labBoostCurr == undefined)
        {
            Memory.empire.roomsobj[roomname].labBoostCurr = "";
        }
        var products = {
            "G": ["ZK", "UL"],
            "OH": ["O", "H"],
            "UH": ["U", "H"],
            "LH": ["L", "H"],
            "ZH": ["Z", "H"],
            "KH": ["K", "H"],
            "GH": ["G", "H"],
            "KO": ["K", "O"],
            "LO": ["L", "O"],
            "GO": ["G", "O"],
            "ZO": ["Z", "O"],
            "LHO2": ["OH", "LO"],
            "GHO2": ["OH", "GO"],
            "ZHO2": ["OH", "ZO"],
            "KHO2": ["OH", "KO"],
            "UH2O": ["OH", "UH"],
            "LH2O": ["OH", "LH"],
            "ZH2O": ["OH", "ZH"],
            "KH2O": ["OH", "KH"],
            "GH2O": ["OH", "GH"],
            "XGHO2": ["X", "GHO2"],
            "XUH2O": ["X", "UH2O"],
            "XLH2O": ["X", "LH2O"],
            "XLHO2": ["X", "LHO2"],
            "XZH2O": ["X", "ZH2O"],
            "XZHO2": ["X", "ZHO2"],
            "XKHO2": ["X", "KHO2"],
            "XGH2O": ["X", "GH2O"]
        };
        var a = [
            ["XGHO2", 8000],
            ["XUH2O", 8000],
            ["XLH2O", 8000],
            ["XLHO2", 8000],
            ["XZH2O", 8000],
            ["XZHO2", 8000],
            ["XKHO2", 8000],
            ["KH2O", 4000],
            ["XGH2O", 4000]
        ];
        
        
        if(Game.time % 1  == 0)
        {
                //                Memory.empire.roomsobj[roomname].labDone = true;
                 //
                    //        Memory.empire.roomsobj[roomname].labReady = false;
                      //      Memory.empire.roomsobj[roomname].labBoostCurr = "";  
        }
        
        
                    var basics = ["H", "O", "U", "L", "Z", "X", "G"];

        var isBasic = basics.indexOf(Memory.empire.roomsobj[roomname].labBoostCurr);
            
            
            if (isBasic != -1)
        {
              console.log("reset 3");
            Memory.empire.roomsobj[roomname].labBoostCurr = "";

        }else  if (Memory.empire.roomsobj[roomname].labBoostCurr == "")
        {
        for (var i = 0; i < a.length; i++)
        {
            var currCheck = products[a[i][0]];
            if (terminalActual.store.getUsedCapacity(a[i][0]) < a[i][1] - 1000  )
            {
                if (strg.store.getUsedCapacity(currCheck[0]) > 1000 && strg.store.getUsedCapacity(currCheck[1]) > 1000)
                {
                      console.log("assingn 1", a[i][0]);
                    Memory.empire.roomsobj[roomname].labBoostCurr = a[i][0];
                }
            }
        }

       
            var a = Object.keys(products);
            for (var i = 0; i < a.length; i++)
            {
                var currCheck = products[a[i]];
                if (terminalActual.store.getUsedCapacity(a[i]) < 1000 && (Memory.empire.roomsobj[roomname].labBoostCurr == ""))
                {
                    if (strg.store.getUsedCapacity(currCheck[0]) > 1000 && strg.store.getUsedCapacity(currCheck[1]) > 1000)
                    {     console.log("assingn 2");
                        Memory.empire.roomsobj[roomname].labBoostCurr = a[i];
                    }
                }
            }
            
            
     
            
            
        }

 
    

    else    if (Memory.empire.roomsobj[roomname].labBoostCurr != "")
        {
            /////////////////////////

            var moverscarrynonenergy = Game.rooms[roomname].find(FIND_MY_CREEPS,
            {
                filter: (creep) =>
                {
                    return (creep.memory.role == 'mover' && creep.memory.memstruct.tasklist.length != 0 && creep.store.getUsedCapacity() - creep.store.getUsedCapacity(RESOURCE_ENERGY) != 0);
                }
            });

            var currentProduction = Memory.empire.roomsobj[roomname].labBoostCurr;

            var currentProductForLab1 = products[currentProduction][0];
            var currentProductForLab2 = products[currentProduction][1];

            var mainLab1 = (new RoomPosition(mainFlag.pos.x - 5, mainFlag.pos.y + 1, roomname)).findInRange(FIND_MY_STRUCTURES, 0,
            {
                filter:
                {
                    structureType: STRUCTURE_LAB
                }
            });
            var mainLab2 = (new RoomPosition(mainFlag.pos.x - 3, mainFlag.pos.y + 1, roomname)).findInRange(FIND_MY_STRUCTURES, 0,
            {
                filter:
                {
                    structureType: STRUCTURE_LAB
                }
            });

            //    console.log("  current  ", currentProduction);
            //     console.log("reset current cechk   ", currentProductForLab1, " and ", currentProductForLab2);
            //    console.log("  current cechk   ", strg.store.getUsedCapacity(currentProductForLab1), " and ", strg.store.getUsedCapacity(currentProductForLab2));
            if (mainLab1.length != 0 && mainLab1[0].store.getUsedCapacity(currentProductForLab1) < 1000 && strg.store.getUsedCapacity(currentProductForLab1) < 1000 && Memory.empire.roomsobj[roomname].labReady == false && Memory.empire.roomsobj[roomname].labDone == false)
            {
                //  console.log("  currfdgdgfdgent  ");
                var basics = ["H", "O", "U", "L", "Z", "X", "G"];

                var isBasic = basics.indexOf(currentProductForLab1);
                if (isBasic == -1 && moverscarrynonenergy.length == 0)
                {
                    //      console.log("reset current production from ", currentProduction, " to ", currentProductForLab1);
                    Memory.empire.roomsobj[roomname].labBoostCurr = currentProductForLab1;

                }
                else if (isBasic != -1 && moverscarrynonenergy.length == 0)
                {
                    console.log("reset 1");
                    Memory.empire.roomsobj[roomname].labBoostCurr = "";
                }

            }
            if (mainLab2.length != 0 && mainLab2[0].store.getUsedCapacity(currentProductForLab2) < 1 && strg.store.getUsedCapacity(currentProductForLab2) < 1000 && Memory.empire.roomsobj[roomname].labReady == false && Memory.empire.roomsobj[roomname].labDone == false)
            {
                //   console.log("  fffffggh  ");
                var basics = ["H", "O", "U", "L", "Z", "X", "G"];

                var isBasic = basics.indexOf(currentProductForLab2);
                if (isBasic == -1 && moverscarrynonenergy.length == 0)
                {
                    //          console.log("reset current production from ", currentProduction, " to ", currentProductForLab2);
                    Memory.empire.roomsobj[roomname].labBoostCurr = currentProductForLab2;

                }
                else if (isBasic != -1 && moverscarrynonenergy.length == 0)
                {
                      console.log("reset 2");
                    Memory.empire.roomsobj[roomname].labBoostCurr = "";
                }
                //     console.log("  fff  ", Memory.empire.roomsobj[roomname].labBoostCurr);
            }
        }





    },

    run: function(roomname)
    {
        this.decideBoost(roomname);

        var allLabs = Game.rooms[roomname].find(FIND_MY_STRUCTURES,
        {
            filter:
            {
                structureType: STRUCTURE_LAB
            }
        });
        var CurrentMODE = "g";
        var mainFlag = Game.flags[roomname];
        var empireroomsobj = Memory.empire.roomsobj[roomname];
        if (Memory.empire == undefined)
        {
            Memory.empire = {};
        }
        else if (Memory.empire.roomsobj == undefined)
        {
            Memory.empire.roomsobj = {};
        }
        else if (Memory.empire.roomsobj[roomname] == undefined)
        {
            Memory.empire.roomsobj[roomname] = {};
        }

        if (Memory.empire.roomsobj[roomname].labBoostCurr == undefined)
        {
            Memory.empire.roomsobj[roomname].labBoostCurr = "";
        }
        if (Memory.empire.roomsobj[roomname].labReady == undefined)
        {
            Memory.empire.roomsobj[roomname].labReady = false;
        }
        if (Memory.empire.roomsobj[roomname].labDone == undefined)
        {
            Memory.empire.roomsobj[roomname].labDone = false;
        }

        var allLabs = Game.rooms[roomname].find(FIND_MY_STRUCTURES,
        {
            filter:
            {
                structureType: STRUCTURE_LAB
            }
        });

        var allLabsWithResinthem = Game.rooms[roomname].find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_LAB && structure.store.getUsedCapacity(RESOURCE_ENERGY) < structure.store.getUsedCapacity());
            }
        });

        var currentProduction = Memory.empire.roomsobj[roomname].labBoostCurr;
        var mainLab1 = (new RoomPosition(mainFlag.pos.x - 5, mainFlag.pos.y + 1, roomname)).findInRange(FIND_MY_STRUCTURES, 0,
        {
            filter:
            {
                structureType: STRUCTURE_LAB
            }
        });
        var mainLab2 = (new RoomPosition(mainFlag.pos.x - 3, mainFlag.pos.y + 1, roomname)).findInRange(FIND_MY_STRUCTURES, 0,
        {
            filter:
            {
                structureType: STRUCTURE_LAB
            }
        });

        var products = {
            "G": ["ZK", "UL"],
            "OH": ["O", "H"],
            "UH": ["U", "H"],
            "LH": ["L", "H"],
            "ZH": ["Z", "H"],
            "KH": ["K", "H"],
            "GH": ["G", "H"],
            "KO": ["K", "O"],
            "LO": ["L", "O"],
            "GO": ["G", "O"],
            "ZO": ["Z", "O"],
            "GHO2": ["OH", "GO"],
            "UH2O": ["OH", "UH"],
            "LH2O": ["OH", "LH"],
            "LHO2": ["OH", "LO"],
            "ZH2O": ["OH", "ZH"],
            "ZHO2": ["OH", "ZO"],
            "KHO2": ["OH", "KO"],
            "KH2O": ["OH", "KH"],
            "GH2O": ["OH", "GH"],
            "XGHO2": ["X", "GHO2"],
            "XUH2O": ["X", "UH2O"],
            "XLH2O": ["X", "LH2O"],
            "XLHO2": ["X", "LHO2"],
            "XZH2O": ["X", "ZH2O"],
            "XZHO2": ["X", "ZHO2"],
            "XKHO2": ["X", "KHO2"],
            "XGH2O": ["X", "GH2O"]
        };

        var mainFlag = Game.flags[roomname];
        if (currentProduction != "" && currentProduction != undefined)
        {
          //  console.log("labs stage 0 ", roomname);
            var currentProductForLab1 = products[currentProduction][0];
            var currentProductForLab2 = products[currentProduction][1];
            var strg = Game.rooms[roomname].storage;
            var moverscarrynonenergy = Game.rooms[roomname].find(FIND_MY_CREEPS,
            {
                filter: (creep) =>
                {
                    return (creep.memory.role == 'mover' && creep.memory.memstruct.tasklist.length != 0 && creep.store.getUsedCapacity() - creep.store.getUsedCapacity(RESOURCE_ENERGY) != 0);
                }
            });

            if (mainLab1.length != 0)
            {
                var input = Object.keys(mainLab1[0].store);
                for (var t = 0; t < input.length; t++)
                {
                    if (input[t] != "energy")
                    {
                        if (input[t] != currentProductForLab1)
                        {
                                Memory.empire.roomsobj[roomname].labDone = true;
                                                    Memory.empire.roomsobj[roomname].labReady = false;
                         //   Memory.empire.roomsobj[roomname].labBoostCurr = "";
                        }
                    }
                }
            }

            if (mainLab2.length != 0)
            {
                var input = Object.keys(mainLab2[0].store);
                for (var t = 0; t < input.length; t++)
                {
                    if (input[t] != "energy")
                    {
                        if (input[t] != currentProductForLab2)
                        {

                                Memory.empire.roomsobj[roomname].labDone = true;
                                                    Memory.empire.roomsobj[roomname].labReady = false;
                         //   Memory.empire.roomsobj[roomname].labBoostCurr = "";
                        }
                    }
                }
            }

 

            if (Memory.empire.roomsobj[roomname].labReady == false && Memory.empire.roomsobj[roomname].labDone == false && Memory.empire.roomsobj[roomname].labBoostCurr != "")
            {
             //   console.log("labs stage 1 ", roomname);
                if (mainLab1.length != 0 && mainLab1[0].store.getUsedCapacity(currentProductForLab1) > 999 && mainLab2.length != 0 && mainLab2[0].store.getUsedCapacity(currentProductForLab2) > 999)
                {
                  //  console.log("starlabs ")
                   Memory.empire.roomsobj[roomname].labReady = true;
                }
                else
                {

                    var movers = Game.rooms[roomname].find(FIND_MY_CREEPS,
                    {
                        filter: (creep) =>
                        {
                            return (creep.memory.role == 'mover' && creep.memory.memstruct.tasklist.length == 0 && creep.ticksToLive > 300);
                        }
                    });
                    if (movers.length != 0)
                    {
                        if (mainLab1.length != 0 && mainLab1[0].store.getUsedCapacity(currentProductForLab1) == 0 && Game.rooms[roomname].storage.store.getUsedCapacity(currentProductForLab1) > 999)
                        {
                            movers[0].memory.memstruct.tasklist.push(["deposit"]);
                            movers[0].memory.memstruct.tasklist.push(["withdraw", Game.rooms[roomname].storage.id, currentProductForLab1, 1000]);
                            movers[0].memory.memstruct.tasklist.push(["transfer", mainLab1[0].id, currentProductForLab1]);
                        }

                        if (mainLab2.length != 0 && mainLab2[0].store.getUsedCapacity(currentProductForLab2) == 0 && Game.rooms[roomname].storage.store.getUsedCapacity(currentProductForLab1) > 999)
                        {
                            movers[0].memory.memstruct.tasklist.push(["deposit"]);
                            movers[0].memory.memstruct.tasklist.push(["withdraw", Game.rooms[roomname].storage.id, currentProductForLab2, 1000]);
                            movers[0].memory.memstruct.tasklist.push(["transfer", mainLab2[0].id, currentProductForLab2]);
                        }
                    }

                }
            }
            else if (Memory.empire.roomsobj[roomname].labReady == true && mainLab1.length != 0 && mainLab2.length != 0)
            {
            //    console.log("labs stage 2 ", roomname);
                for (var i = 0; i < allLabs.length; i++)
                {
                    if (allLabs[i].store.getUsedCapacity() - allLabs[i].store.getUsedCapacity(RESOURCE_ENERGY) == 0 || allLabs[i].store.getUsedCapacity(currentProduction) != 0)
                    {
                        allLabs[i].runReaction(mainLab1[0], mainLab2[0])
                    }
                }

                if (mainLab1[0].store.getUsedCapacity() - mainLab1[0].store.getUsedCapacity(RESOURCE_ENERGY) == 0)
                {
                    Memory.empire.roomsobj[roomname].labDone = true;
                    Memory.empire.roomsobj[roomname].labReady = false
                }

                if (mainLab2[0].store.getUsedCapacity() - mainLab2[0].store.getUsedCapacity(RESOURCE_ENERGY) == 0)
                {
                    Memory.empire.roomsobj[roomname].labDone = true;
                    Memory.empire.roomsobj[roomname].labReady = false
                }

            }
            else if (Memory.empire.roomsobj[roomname].labDone == true && mainFlag)
            {
              //  console.log("labs stage 3 ", roomname);

                var allLabsWithResinthem = (new RoomPosition(mainFlag.pos.x - 5, mainFlag.pos.y + 1, roomname)).findInRange(FIND_STRUCTURES, 2,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_LAB && structure.store.getUsedCapacity(RESOURCE_ENERGY) > structure.store.getUsedCapacity());
                    }
                });

                var movers = Game.rooms[roomname].find(FIND_MY_CREEPS,
                {
                    filter: (creep) =>
                    {
                        return (creep.memory.role == 'mover' && creep.memory.memstruct.tasklist.length == 0 && creep.ticksToLive > 300);
                    }
                });

                if (allLabsWithResinthem.length == 0)
                {
                    Memory.empire.roomsobj[roomname].labDone = false;
                    Memory.empire.roomsobj[roomname].labReady = false;
                    Memory.empire.roomsobj[roomname].labBoostCurr = "";
                }

                if (movers.length != 0)
                {

                    movers[0].memory.memstruct.tasklist.push(["deposit"]);
                    for (var i = 0; i < allLabsWithResinthem.length; i++)
                    {
                        var input = Object.keys(allLabsWithResinthem[i].store);
                        for (var t = 0; t < input.length; t++)
                        {
                            if (input[t] != "energy")
                            {

                                movers[0].memory.memstruct.tasklist.push(["withdraw", allLabsWithResinthem[i].id, input[t]]);
                            }
                        }
                    }
                    if (movers[0].memory.memstruct.tasklist.length != 0)
                    {
                        movers[0].memory.memstruct.tasklist.push(["deposit"]);
                    }
                }
            }
        }
        else
        {
         //   console.log("labs no boost selected ", roomname);
    //       

            var allLabsWithResinthem = (new RoomPosition(mainFlag.pos.x - 5, mainFlag.pos.y + 1, roomname)).findInRange(FIND_STRUCTURES, 2,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_LAB && structure.store.getUsedCapacity(RESOURCE_ENERGY) > structure.store.getUsedCapacity());
                }
            });

            var movers = Game.rooms[roomname].find(FIND_MY_CREEPS,
            {
                filter: (creep) =>
                {
                    return (creep.memory.role == 'mover' && creep.memory.memstruct.tasklist.length == 0 && creep.ticksToLive > 300);
                }
            });

            if (allLabsWithResinthem.length == 0)
            {
                Memory.empire.roomsobj[roomname].labDone = false;
                Memory.empire.roomsobj[roomname].labReady = false;
                Memory.empire.roomsobj[roomname].labBoostCurr = "";
            }else{
                 Memory.empire.roomsobj[roomname].labDone = true; 
            }

            if (movers.length != 0)
            {

                movers[0].memory.memstruct.tasklist.push(["deposit"]);
                for (var i = 0; i < allLabsWithResinthem.length; i++)
                {
                    var input = Object.keys(allLabsWithResinthem[i].store);
                    for (var t = 0; t < input.length; t++)
                    {
                        if (input[t] != "energy")
                        {

                            movers[0].memory.memstruct.tasklist.push(["withdraw", allLabsWithResinthem[i].id, input[t]]);
                        }
                    }
                }
                if (movers[0].memory.memstruct.tasklist.length != 0)
                {
                    movers[0].memory.memstruct.tasklist.push(["deposit"]);
                }
            }

        }

    }
}
module.exports = labs;