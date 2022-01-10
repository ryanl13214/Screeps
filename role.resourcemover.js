var creepfunctions = require('prototype.creepfunctions');
var roleresourcemover = {
    run: function(creep)
    {
        // creep.say(creep.memory.memstruct.tasklist.length);
        if (creep.memory.memstruct.tasklist.length > 30)
        {
            creep.memory.memstruct.tasklist = [];
        }
        if (creep.body.find(elem => elem.type === "heal") != undefined)
        {
            creep.heal(creep);
        }
        
        if(creep.memory.storcount == undefined)
        {
             creep.memory.storcount=0
        }
            else
            {
                creep.memory.storcount ++;
                
            }
            
             
            
            
        if (creep.room.storage)
        {
            
            if (creep.pos.x != creep.room.storage.pos.x - 1 || creep.pos.y != creep.room.storage.pos.y - 1)
            {
                creep.moveTo(new RoomPosition(creep.room.storage.pos.x - 1, creep.room.storage.pos.y - 1, creep.room.name))
            }
              if(creep.memory.storcount > 4)
        {
             creep.memory.storcount=0
            
                    var s =  creep.room.storage.pos.findInRange(FIND_MY_CREEPS, 1,
        {
            filter: (creeper) => (creeper.memory.role == "mover")
        });
              for (var i = 0; i < s.length; i++)
        {
        s[i].moveTo(new RoomPosition(0,0, creep.room.name),
                {
                    ignoreCreeps: true
                });
        }
        
        }
            
            
            
        }

        if (creep.memory.rescounter2 == undefined)
        {
            creep.memory.rescounter2 = 0;
        }

        if (creep.memory.rescounter2 > 15)
        {
            creep.memory.rescounter2 = 0;
            var pwrspawn = creep.pos.findInRange(FIND_STRUCTURES, 1,
            {
                filter: (structure) => (structure.structureType == STRUCTURE_POWER_SPAWN)
            });
            Game.spawns[creep.room.name].spawnCreep(
                [MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], creep.room.name + 'power',
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: creep.room.name,
                            tasklist: [
                                ["withdraw", creep.room.terminal.id, "energy", 800],
                                ["transfer", pwrspawn[0].id, "energy"],
                                ["repeat", 2]
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

        var pwrspawn = creep.pos.findInRange(FIND_STRUCTURES, 1,
        {
            filter: (structure) => (structure.structureType == STRUCTURE_POWER_SPAWN)
        });

        if (pwrspawn.length != 0)
        {
            if (pwrspawn[0].store.getUsedCapacity("energy") < 3000)
            {
                creep.memory.rescounter2++;
            }
            if (pwrspawn[0].store.getUsedCapacity("energy") > 3000)
            {
                creep.memory.rescounter2 = 0;
            }
        }

        var check = creepfunctions.checkglobaltasks(creep);
        if (check)
        {
            var badResource = ["H", "O", "U", "L", "Z"];
            //   ["drop" , "what to drop"]
            //        creep.drop(targ, creep.memory.memstruct.tasklist[0][1]);
            for (var j = 0; j < badResource.length; j++) // transfer to strg
            {
                if (creep.room.terminal.store.getUsedCapacity(badResource[j]) > 40000 && creep.memory.memstruct.tasklist.length == 0)
                {
                    creep.memory.memstruct.tasklist.push(["deposit"]);
                    creep.memory.memstruct.tasklist.push(["withdraw", creep.room.terminal.id, badResource[j], creep.store.getCapacity()]);
                    creep.memory.memstruct.tasklist.push(["drop", badResource[j]]);
                }
            }
            var spawnss = creep.pos.findInRange(FIND_MY_SPAWNS, 1,
            {
                filter: (structure) => (structure.store.getUsedCapacity("energy") < 250)
            });
            if (spawnss.length != 0)
            {

                creep.memory.memstruct.tasklist.push(["deposit"]);
                creep.memory.memstruct.tasklist.push(["withdraw", creep.room.terminal.id, "energy", 300 - spawnss[0].store.getUsedCapacity("energy")]);
                creep.memory.memstruct.tasklist.push(["transfer", spawnss[0].id, "energy"]);
            }
            var link = creep.pos.findInRange(FIND_STRUCTURES, 1,
            {
                filter: (structure) => (structure.structureType == STRUCTURE_LINK)
            });
            if (link.length != 0)
            {
                if (link[0].store.getUsedCapacity("energy") > 500) // and creep emty
                {
                    creep.withdraw(link[0], "energy");
                    creep.memory.memstruct.tasklist.push(["transfer", creep.room.storage.id, "energy"]);
                }
            }

            if (creep.memory.memstruct.tasklist.length == 0)
            {
                this.storagea(creep);
            }

        }

        this.UpdateRoomData(creep.room.name);

    },
    UpdateRoomData: function(roomname)
    {
        if (Memory.empire == undefined)
        {
            Memory.empire = {};
        }
        if (Memory.empire.roomsobj == undefined)
        {
            Memory.empire.roomsobj = {};
        }

        if (Memory.empire.roomsobj[roomname] == undefined)
        {
            Memory.empire.roomsobj[roomname] = {}
        }

        var allResources = ["XGHO2", "XUH2O", "XLHO2", "XZH2O", "XZHO2", "XKHO2", "XLH2O"];

        var strg = Game.rooms[roomname].storage;
        var BoostLow = false;
        for (var i = 0; i < allResources.length; i++)
        {
            if (strg.store.getUsedCapacity(allResources[i]) < 4000)
            {
                BoostLow = true;
            }

        }

        if (Memory.empire.roomsobj[roomname].attackingCurrently == undefined)
        {
            Memory.empire.roomsobj[roomname].attackingCurrently = false;
        }

        if (Memory.empire.roomsobj[roomname].boostsLow == undefined)
        {
            Memory.empire.roomsobj[roomname].boostsLow = false;
        }
        else
        {
            Memory.empire.roomsobj[roomname].boostsLow = BoostLow;
        }

        if (Memory.empire.roomsobj[roomname].Defcon == undefined)
        {
            Memory.empire.roomsobj[roomname].Defcon = {};
        }

  if (Memory.empire.roomsobj[roomname].squadSpawning == undefined)
                    {
                        Memory.empire.roomsobj[roomname].squadSpawning = "";
                    }


    },

    simpleVisualiser: function(roomname, topos, frompos, textActual, number)
    {

        new RoomVisual(roomname).line(topos.x, topos.y, frompos.x, frompos.y);
        new RoomVisual(roomname).text(textActual + number, frompos.x, frompos.y,
        {
            color: 'red',
            font: 0.8
        });

    },
    storagea: function(creep)
    {
        creep.say("storage");
        var roomname = creep.room.name;
        var allResources = ["XGHO2", "XUH2O", "XLHO2", "XZH2O", "XZHO2", "XKHO2", "XLH2O", "XKH2O", "G", "OH",   "UH", "LH", "ZH", "KH", "GH", "KO", "LO", "GO", "ZO", "GHO2", "UH2O", "LH2O", "LHO2", "ZH2O", "ZHO2", "KHO2", "KH2O", "GH2O", "H", "O", "U", "L", "Z", "X"];
        var allValues = [40000      , 40000  , 40000 , 40000  , 40000  , 40000  , 40000  , 5000    , 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 15000,  15000,   15000,  15000,  15000,  15000,  15000,  15000,  15000, 5000, 5000, 5000, 5000, 5000, 5000];

        if (Game.rooms[roomname].controller.isPowerEnabled)
        {
            allResources.push("ops");
            allValues.push(100000);
        }
        else
        {
            allResources.push("ops");
            allValues.push(5000);
        }

        var termin = Game.rooms[roomname].terminal;
        var strg = Game.rooms[roomname].storage;

        var termianlCurrEnergy = termin.store.getUsedCapacity(RESOURCE_ENERGY);
        var storagegialenergy = 0;
        if (termianlCurrEnergy < 50000)
        {
            storagegialenergy = termianlCurrEnergy * 10;
        }
        else
        {
            storagegialenergy = 500000;
        }

        allResources.push("energy");
        allValues.push(storagegialenergy);

        // emptystorage
        var allspawns = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        if (allspawns.length == 0)
        {
            for (var i = 0; i < allValues.length; i++)
            {
                allValues[i] = 0;
            }
        }

        // get the resources from therminal

        for (var i = 0; i < allResources.length; i++)
        {
            var currentTerminalValue = termin.store.getUsedCapacity(allResources[i]);
            var currentStorageValue = strg.store.getUsedCapacity(allResources[i]);

            if (currentStorageValue < allValues[i] && currentTerminalValue > 0)
            {

                var moveAmount = 0;

                moveAmount = allValues[i] - currentStorageValue;
                if (moveAmount > currentTerminalValue)
                {
                    moveAmount = currentTerminalValue;
                }
                if (creep.memory.memstruct.tasklist.length == 0 && (allResources[i] != "energy" || moveAmount > 1000))
                {
                    creep.memory.memstruct.tasklist.push(["deposit"]);
                    creep.memory.memstruct.tasklist.push(["withdraw", termin.id, allResources[i], moveAmount]);
                    creep.memory.memstruct.tasklist.push(["transfer", strg.id, allResources[i]]);
                }
            }

        }

        /////////////////////////////////////
        // return anyt resources not in the list 

        var tmpresourcekeys = Object.keys(strg.store);
        var tmpresourcevalues = Object.values(strg.store);

        for (var i = 0; i < tmpresourcekeys.length; i++)
        {
            var itemInList = false;
            for (q = 0; q < allResources.length; q++)
            {
                if (tmpresourcekeys[i] == allResources[q])
                {
                    itemInList = true;
                }
            }

            if (itemInList == false)
            {
                var moveAmount = tmpresourcevalues;
                if (moveAmount > creep.store.getCapacity())
                {
                    moveAmount = creep.store.getCapacity();
                }
                if (creep.memory.memstruct.tasklist.length == 0 && (allResources[i] != "energy" || moveAmount > 1000))
                {
                    creep.say(tmpresourcekeys[i]);
                    creep.memory.memstruct.tasklist.push(["deposit"]);
                    creep.memory.memstruct.tasklist.push(["withdraw", strg.id, tmpresourcekeys[i], moveAmount]);
                    creep.memory.memstruct.tasklist.push(["transfer", termin.id, tmpresourcekeys[i]]);
                }
            }
        }

        ///////////////////////////////////////////////////
        // return any overflow resources 

        for (var i = 0; i < allResources.length; i++)
        {
            var currentTerminalValue = termin.store.getUsedCapacity(allResources[i]);
            var currentStorageValue = strg.store.getUsedCapacity(allResources[i]);
            if (currentStorageValue > allValues[i])
            {
                var moveAmount = 0;
                moveAmount = currentStorageValue - allValues[i];
                if (creep.memory.memstruct.tasklist.length == 0 && (allResources[i] != "energy" || moveAmount > 1000))
                {
                    creep.say("R", allResources[i]);
                    creep.memory.memstruct.tasklist.push(["deposit"]);
                    creep.memory.memstruct.tasklist.push(["withdraw", strg.id, allResources[i], moveAmount]);
                    creep.memory.memstruct.tasklist.push(["transfer", termin.id, allResources[i]]);
                }
            }
        }
    }

};
module.exports = roleresourcemover;