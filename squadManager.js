var creepfunctions = require('prototype.creepfunctions');
var squadmanager = {
    run: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var numberOfLivingSqaudMembers = [];
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            if(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]))
            {
                numberOfLivingSqaudMembers.push(mainMemoryObject.SquadMembersCurrent[c]);
            }
        }
        mainMemoryObject.SquadMembersCurrent = numberOfLivingSqaudMembers;
        if(mainMemoryObject.squadcreationtime + 1500 < Game.time && numberOfLivingSqaudMembers.length == 0 && Game.flags[mainMemoryObject.squadHomeRoom].memory.flagstruct.squadspawning == "")
        {
            delete Memory.squadObject[squadID];
        }
        else
        {
            const resourcevalues = Object.values(mainMemoryObject.SquadMembersGoal);
            if(mainMemoryObject.SquadMembersCurrent.length < resourcevalues.length && (Game.flags[mainMemoryObject.squadHomeRoom].memory.flagstruct.spawnfree == true || Game.rooms[mainMemoryObject.squadHomeRoom].controller.level > 6))
            {
                if(Game.flags[mainMemoryObject.squadHomeRoom].memory.flagstruct.squadspawning == "")
                {
                    Game.flags[mainMemoryObject.squadHomeRoom].memory.flagstruct.squadspawning = squadID;
                }
                if(Game.flags[mainMemoryObject.squadHomeRoom].memory.flagstruct.squadspawning == squadID)
                {
                    this.spawnnewcreep(squadID, mainMemoryObject.squadHomeRoom);
                }
            }
            else if(mainMemoryObject.SquadMembersCurrent.length == resourcevalues.length)
            {
                mainMemoryObject.squadisready = true;
                Game.flags[mainMemoryObject.squadHomeRoom].memory.flagstruct.squadspawning = "";
            }
/////////////////////////////////////////////////////////////////////////////////////////////////////////
            
            if(mainMemoryObject.squadisready) // group squads
            {
                if(mainMemoryObject.squadType == "serpent" && mainMemoryObject.SquadMembersCurrent.length == 3) // add else here for retreating
                {
                    this.serpentsquad_controlFunction(squadID);
                }
            }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////// 
            if(mainMemoryObject.SquadMembersCurrent.length != 0) //independant squads
            {
                if(mainMemoryObject.squadType == "SoloPatrol")
                {
                    this.SoloPatrol(squadID);
                }
                    if(mainMemoryObject.squadType == "centerMiningSquad")
                {
                    this.centerMiningOpteration(squadID);
                }
                if(mainMemoryObject.squadType == "solocenterdamager")
                {
                    var startCpu = Game.cpu.getUsed();
                    this.solocenterSquad_controlFunction(squadID);
                    Game.flags[mainMemoryObject.squadHomeRoom].memory.flagstruct.mineroomsCPU += Game.cpu.getUsed() - startCpu;
                }
                
                if(mainMemoryObject.squadType == "MiningSquad")
                {
                    var startCpu = Game.cpu.getUsed();
                    this.MiningOpteration(squadID);
                    Game.flags[mainMemoryObject.squadHomeRoom].memory.flagstruct.mineroomsCPU += Game.cpu.getUsed() - startCpu;
                }
                
            }
/////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    },
    initializeSquad: function(squadID, arrayOfSquadGoals, squadIsBoosted, squadType, squadHomeRoom, SquadMembers)
    {
            console.log("creating squad");
        Memory.squadObject[squadID] = {
            arrayOfSquadGoals: arrayOfSquadGoals,
            squadIsBoosted: squadIsBoosted,
            squadType: squadType,
            squadHomeRoom: squadHomeRoom,
            SquadMembersCurrent: [],
            squadposition: [25, 25],
            SquadMembersGoal: SquadMembers,
            squadisready: false,
            squadcreationtime: Game.time,
            squaddisolvetime: Game.time + 1500
        };
    },
    pathfinding: function(creep) {},
    spawnnewcreep: function(squadID, squadHomeRoom)
    { // add in function fpor broken squads to be reincorpirated
        var mainMemoryObject = Memory.squadObject[squadID];
        var tasklistt = [
            ["joinSquad", squadID]
        ];
        var mainflag = Game.flags[squadHomeRoom];
        if(mainMemoryObject.squadIsBoosted == true)
        {
            tasklistt = [
                ["waituntil", mainMemoryObject.squadcreationtime + 250],
                ["renewfull"],
                ["boosAllMax"],
                ["moveToLoose", mainflag.pos.x - 7, mainflag.pos.y - 7],
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
        const number = Game.time % Object.values(mainMemoryObject.SquadMembersGoal).length;
        const resourcevalues = Object.values(mainMemoryObject.SquadMembersGoal);
        const names = Object.keys(mainMemoryObject.SquadMembersGoal);
        var sucs3esscounter = 9;
        var total = 0;
        for(var i = 0; i < allspawns.length; i++)
        {
            var curspawn = allspawns[i];
            for(var q = 0; q < names.length; q++)
            {
                if(sucs3esscounter != 0 && Game.rooms[squadHomeRoom].storage.store.getUsedCapacity("energy") > 10000)
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
                    if(sucs3esscounter == 0 && (Memory.squadObject[squadID].squadType == "MiningSquad" || Memory.squadObject[squadID].squadType == "centerMiningSquad" || Memory.squadObject[squadID].squadType == "solocenterdamager"))
                    {
                        total = 0;
                        for(var j = 0; j < resourcevalues[q].length; j++)
                        {
                            if(resourcevalues[q][j] == HEAL)
                            {
                                total += 250;
                            }
                            if(resourcevalues[q][j] == ATTACK)
                            {
                                total += 80;
                            }
                            if(resourcevalues[q][j] == RANGED_ATTACK)
                            {
                                total += 150;
                            }
                            if(resourcevalues[q][j] == WORK)
                            {
                                total += 100;
                            }
                            if(resourcevalues[q][j] == MOVE)
                            {
                                total += 50;
                            }
                            if(resourcevalues[q][j] == MOVE)
                            {
                                total += 50;
                            }
                            if(resourcevalues[q][j] == TOUGH)
                            {
                                total += 10;
                            }
                        }
                        Game.flags[squadHomeRoom].memory.flagstruct.mineroomsCost += total;
                    }
                }
            }
        }
    },

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    solocenterSquad_controlFunction: function(squadID)
    {
        //  console.log("centtersquad_controlFunction");
        var mainMemoryObject = Memory.squadObject[squadID];
        //     var newroomposition = new RoomPosition(mainMemoryObject.squadposition[0], mainMemoryObject.squadposition[1], mainMemoryObject.arrayOfSquadGoals[0])
        for(var kk = 0; kk < mainMemoryObject.SquadMembersCurrent.length; kk++)
        {
            var target = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[kk]).pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target != undefined)
            {
                mainMemoryObject.squadposition = [target.pos.x, target.pos.y];
            }
            else if(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[kk]).room.name == mainMemoryObject.arrayOfSquadGoals[0])
            {
                if(mainMemoryObject.arrayOfSquadGoals.length > 1)
                {
                    var tmp = mainMemoryObject.arrayOfSquadGoals.splice(0, 1);
                    mainMemoryObject.arrayOfSquadGoals.push(tmp);
                }
            }
            var creeper = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[kk]);
            var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS,
            {
                filter: function(object)
                {
                    return object.body.length > 1;
                }
            });
            var range = creeper.pos.getRangeTo(targets);
            var meletargets = creeper.pos.findInRange(FIND_HOSTILE_CREEPS, 2);
            var melefound = false;
            for(var c = 0; c < meletargets.length; c++)
            {
                for(var a = 0; a < meletargets[c].body.length; a++)
                {
                    if(meletargets[c].body[a].type == ATTACK)
                    {
                        melefound = true;
                    }
                }
            }
            if(!melefound)
            {
                //  creeper.say("no mele");
                creeper.moveTo(targets);
            }
            if(creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0])
            {
               creeper.moveTo(new RoomPosition(25,25,mainMemoryObject.arrayOfSquadGoals[0] ));
            }
            else if(range > 3 && creeper.hits == creeper.hitsMax)
            {
                creeper.moveTo(targets);
            }
            else if(creeper.hits + 300 < creeper.hitsMax || melefound)
            {
                const targetArr = creeper.room.find(FIND_HOSTILE_CREEPS);
                var target = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(target != undefined)
                {
                    creepfunctions.combatMove(creeper, targetArr, target);
                }
            }
            if(range <= 3)
            {
                creeper.rangedAttack(targets);
            }
            if(range == 1)
            {
                creeper.rangedMassAttack();
            }
            if(targets == undefined)
            {
                var targets = creeper.room.find(FIND_HOSTILE_STRUCTURES,
                {
                    filter: function(object)
                    {
                        return object.structureType == STRUCTURE_KEEPER_LAIR;
                    }
                });
                var temp = 9;
                var counter = 9999;
                if(targets.length != 0)
                {
                    creeper.say(targets.length);
                    for(var k = 0; k < targets.length; k++)
                    {
                        if(targets[k].ticksToSpawn < counter)
                        {
                            counter = targets[k].ticksToSpawn;
                            temp = k;
                        }
                    }
                    var range = creeper.pos.getRangeTo(targets[temp]);
                    if(range > 3)
                    {
                        creeper.say("no one to fighhtr");
                        creeper.moveTo(targets[temp]);
                    }
                }
            }
            creeper.heal(creeper);
        }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    centerMiningOpteration: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var newroomposition = new RoomPosition(mainMemoryObject.squadposition[0], mainMemoryObject.squadposition[1], mainMemoryObject.arrayOfSquadGoals[0])
        //var target = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var fixer = [];
        var movers = [];
        var miners = [];
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            var creepername = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).name.substring(0, 4);
            if(creepername == "move")
            {
                movers.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
            if(creepername == "mine")
            {
                miners.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
            if(creepername == "fixe")
            {
                fixer.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
        }
        for(var c = 0; c < fixer.length; c++)
        {
            var creeper = fixer[c];
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) // MOVE TO ROOM
            {
                var targetRoomFlag = Game.flags[mainMemoryObject.arrayOfSquadGoals[0]];
                var pos1 = creeper.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creeper.pos.getRangeTo(targetRoomFlag.pos);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creeper.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creeper.pos, targetRoomFlag.pos,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            else
            {
                var target = creeper.pos.findClosestByRange(FIND_MY_CREEPS,
                {
                    filter: function(object)
                    {
                        return object.hits < object.hitsMax;
                    }
                });
                if(target)
                {
                    if(creeper.heal(target) == ERR_NOT_IN_RANGE)
                    {
                        creeper.moveTo(target);
                    }
                }
                var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var range = creeper.pos.getRangeTo(targets);
                if(range < 5)
                {
                    const targetArr = creeper.room.find(FIND_HOSTILE_CREEPS);
                    var target = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    creepfunctions.combatMove(creeper, targetArr, target);
                }
            }
        }
        for(var c = 0; c < miners.length; c++)
        {
            var creeper = miners[c];
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) // MOVE TO ROOM
            {
                var targetRoomFlag = Game.flags[mainMemoryObject.arrayOfSquadGoals[0]];
                var pos1 = creeper.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creeper.pos.getRangeTo(targetRoomFlag.pos);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creeper.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creeper.pos, targetRoomFlag.pos,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }
            }
            else
            {
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                var sources = creeper.room.find(FIND_SOURCES);
                var source_target = sources[creeper.name.substring(5, 6)];
                var range = creeper.pos.getRangeTo(source_target);
                if(range > 1)
                {
                    creeper.moveTo(source_target,
                    {
                        reusePath: range,
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
                else
                {
                    creeper.harvest(source_target);
                    creeper.drop(RESOURCE_ENERGY);
                }
                var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var range = creeper.pos.getRangeTo(targets);
                if(range < 5)
                {
                    const targetArr = creeper.room.find(FIND_HOSTILE_CREEPS);
                    target = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    creeper.moveTo(new RoomPosition(25,25,mainMemoryObject.arrayOfSquadGoals[0] ));
                }
            }
        }
        for(var c = 0; c < movers.length; c++)
        {
            var creeper = movers[c];
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creeper.store.getUsedCapacity() != creeper.store.getCapacity() && creeper.room.name == mainMemoryObject.arrayOfSquadGoals[0]) // COLLECT RESOURCES
            {
                var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var droppedresources = creeper.pos.findClosestByPath(FIND_DROPPED_RESOURCES,
                {
                    filter: (res) =>
                    {
                        return (res.resourceType == RESOURCE_ENERGY) && (res.amount > creeper.store.getFreeCapacity()) && res.pos.getRangeTo(targets) > 5;
                    }
                });
                var smallerdroppedresources = creeper.pos.findClosestByPath(FIND_DROPPED_RESOURCES,
                {
                    filter: (res) =>
                    {
                        return (res.resourceType == RESOURCE_ENERGY) && (res.amount > 50) && res.pos.getRangeTo(targets) > 5;
                    }
                });
                var tombstones = creeper.pos.findClosestByPath(FIND_TOMBSTONES,
                {
                    filter: (tomb) =>
                    {
                        return (tomb.store.getUsedCapacity() != tomb.store.getUsedCapacity(RESOURCE_ENERGY)) || (tomb.store.getUsedCapacity(RESOURCE_ENERGY) > 300);
                    }
                });
                if(droppedresources != undefined)
                {
                    var range = creeper.pos.getRangeTo(droppedresources);
                    if(range <= 1)
                    {
                        creeper.pickup(droppedresources);
                    }
                    else
                    {
                        creeper.moveTo(droppedresources,
                        {
                            reusePath: range,
                            visualizePathStyle:
                            {
                                stroke: '#ffaa00'
                            }
                        });
                    }
                }
                else
                if(tombstones != undefined)
                {
                    var range = creeper.pos.getRangeTo(tombstones);
                    if(range <= 1)
                    {
                        creeper.withdraw(tombstones, RESOURCE_ENERGY);
                    }
                    else
                    {
                        creeper.moveTo(tombstones,
                        {
                            reusePath: range,
                            visualizePathStyle:
                            {
                                stroke: '#ffaa00'
                            }
                        });
                    }
                }
                else if(smallerdroppedresources != undefined)
                {
                    var range = creeper.pos.getRangeTo(smallerdroppedresources);
                    if(range <= 1)
                    {
                        creeper.pickup(smallerdroppedresources);
                    }
                    else
                    {
                        creeper.moveTo(smallerdroppedresources,
                        {
                            reusePath: range,
                            visualizePathStyle:
                            {
                                stroke: '#ffaa00'
                            }
                        });
                    }
                }
                var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var range = creeper.pos.getRangeTo(targets);
                if(range <= 5)
                {
                    const targetArr = creeper.room.find(FIND_HOSTILE_CREEPS);
                    target = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    creepfunctions.combatMove(creeper, targetArr, target);
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creeper.store.getUsedCapacity() > creeper.store.getCapacity() * 0.8 && creeper.room.name != mainMemoryObject.squadHomeRoom) //  // MOVE TO HOME
            {
                var targetRoomFlag = Game.flags[mainMemoryObject.squadHomeRoom];
                var pos1 = creeper.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creeper.pos.getRangeTo(targetRoomFlag.pos);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creeper.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creeper.pos, targetRoomFlag.pos,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creeper.store.getUsedCapacity() != 0 && creeper.room.name == mainMemoryObject.squadHomeRoom) //  // DEPOSIT RESOURCES
            {
                var storagemain = creeper.room.storage;
                var terminal = creeper.room.terminal;
                var targ;
                var target = creeper.pos.findInRange(FIND_STRUCTURES, 5,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_LINK && structure.store.getUsedCapacity("energy") < 800); // allow ops resources
                    }
                });
                target = creeper.pos.findClosestByRange(target);
                if(target != undefined)
                {
                    targ = target;
                }
                else if(storagemain != undefined)
                {
                    targ = storagemain;
                }
                var range = creeper.pos.getRangeTo(targ);
                if(range <= 1)
                {
                    creeper.transfer(targ, RESOURCE_ENERGY, creeper.energyAvailable);
                }
                else
                {
                    creeper.moveTo(targ,
                    {
                        reusePath: range,
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creeper.store.getUsedCapacity() < 1 && creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) // MOVE TO ROOM
            {
                // console.log(creeper.room.name,"creep moving",mainMemoryObject.arrayOfSquadGoals[0]);
                var targetRoomFlag = Game.flags[mainMemoryObject.arrayOfSquadGoals[0]];
                var pos1 = creeper.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creeper.pos.getRangeTo(targetRoomFlag.pos);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creeper.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creeper.pos, targetRoomFlag.pos,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////           
        }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    reclaimopperation: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var newroomposition = new RoomPosition(mainMemoryObject.squadposition[0], mainMemoryObject.squadposition[1], mainMemoryObject.arrayOfSquadGoals[0])
        //var target = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var movers = [];
        var miners = [];
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            var creepername = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).name.substring(0, 4);
            if(creepername == "move")
            {
                movers.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
            if(creepername == "mine")
            {
                miners.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
        }
        for(var c = 0; c < miners.length; c++)
        {
            var creeper = miners[c];
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) // MOVE TO ROOM
            {
                var targetRoomFlag = Game.flags[mainMemoryObject.arrayOfSquadGoals[0]];
                var pos1 = creeper.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creeper.pos.getRangeTo(targetRoomFlag.pos);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creeper.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creeper.pos, targetRoomFlag.pos,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }
            }
            else
            {
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // operations here
                var target = creeper.pos.findClosestByRange(FIND_STRUCTURES,
                {
                    filter:
                    {
                        structureType: STRUCTURE_WALL
                    }
                });
                if(target)
                {
                    if(creeper.dismantle(target) == ERR_NOT_IN_RANGE)
                    {
                        creeper.moveTo(target);
                    }
                }
                var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var range = creeper.pos.getRangeTo(targets);
                if(range < 5)
                {
                    const targetArr = creeper.room.find(FIND_HOSTILE_CREEPS);
                    target = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                   creeper.moveTo(new RoomPosition(25,25,mainMemoryObject.arrayOfSquadGoals[0] ));
                }
            }
        }
        for(var c = 0; c < movers.length; c++)
        {
            var creeper = movers[c];
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creeper.store.getUsedCapacity() != creeper.store.getCapacity() && creeper.room.name == mainMemoryObject.arrayOfSquadGoals[0]) // COLLECT RESOURCES
            {
                var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var droppedresources = creeper.pos.findClosestByPath(FIND_DROPPED_RESOURCES,
                {
                    filter: (res) =>
                    {
                        return (res.resourceType == RESOURCE_ENERGY) && (res.amount > creeper.store.getFreeCapacity()) && res.pos.getRangeTo(targets) > 5;
                    }
                });
                if(droppedresources != undefined)
                {
                    var range = creeper.pos.getRangeTo(droppedresources);
                    if(range <= 1)
                    {
                        creeper.pickup(droppedresources);
                    }
                    else
                    {
                        creeper.moveTo(droppedresources,
                        {
                            reusePath: range,
                            visualizePathStyle:
                            {
                                stroke: '#ffaa00'
                            }
                        });
                    }
                }
                var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var range = creeper.pos.getRangeTo(targets);
                if(range <= 5)
                {
                    const targetArr = creeper.room.find(FIND_HOSTILE_CREEPS);
                    target = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    creepfunctions.combatMove(creeper, targetArr, target);
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creeper.store.getUsedCapacity() == creeper.store.getCapacity() && creeper.room.name != mainMemoryObject.squadHomeRoom) //  // MOVE TO HOME
            {
                var targetRoomFlag = Game.flags[mainMemoryObject.squadHomeRoom];
                var pos1 = creeper.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creeper.pos.getRangeTo(targetRoomFlag.pos);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creeper.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creeper.pos, targetRoomFlag.pos,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creeper.store.getUsedCapacity() != 0 && creeper.room.name == mainMemoryObject.squadHomeRoom) //  // DEPOSIT RESOURCES
            {
                var storagemain = creeper.room.storage;
                var terminal = creeper.room.terminal;
                var targ;
                if(terminal != undefined)
                {
                    targ = terminal;
                }
                else if(storagemain != undefined)
                {
                    targ = storagemain;
                }
                var range = creeper.pos.getRangeTo(targ);
                if(range <= 1)
                {
                    creeper.transfer(targ, RESOURCE_ENERGY, creeper.energyAvailable);
                }
                else
                {
                    creeper.moveTo(targ,
                    {
                        reusePath: range,
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creeper.store.getUsedCapacity() != creeper.store.getCapacity() && creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) // MOVE TO ROOM
            {
                var targetRoomFlag = Game.flags[mainMemoryObject.arrayOfSquadGoals[0]];
                var pos1 = creeper.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creeper.pos.getRangeTo(targetRoomFlag.pos);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creeper.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creeper.pos, targetRoomFlag.pos,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////           
        }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    bumRushSquad: function(squadID) {},
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    serpentsquad_controlFunction: function(squadID)
    {
        //    console.log("serpent control");
        var mainMemoryObject = Memory.squadObject[squadID];
        var serpentHead = [];
        var serpentBody = [];
        var serpentTail = [];
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            var creepername = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).name.substring(0, 4);
            if(creepername == "head")
            {
                serpentHead.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
            else if(creepername == "body")
            {
                serpentBody.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
            else if(creepername == "tail")
            {
                serpentTail.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
        }
        serpentBody = serpentBody[0];
        serpentHead = serpentHead[0];
        serpentTail = serpentTail[0];
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////MOVEMENT///////////////////////////////////////////////////////////////////////////      
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     
        var currroomnamehead = serpentHead.room.name;
        var currroomnamebody = serpentBody.room.name;
        var serpentHeadPositionStorageX = serpentHead.pos.x;
        var serpentHeadPositionStorageY = serpentHead.pos.y;
        var serpentBodyPositionStorageX = serpentBody.pos.x;
        var serpentBodyPositionStorageY = serpentBody.pos.y;
        var tailfatigue = serpentTail.fatigue;
        var bodyfatigue = serpentBody.fatigue;
        //    console.log("got to begining of global");
        if(serpentHead.room.name != mainMemoryObject.arrayOfSquadGoals[0])
        {
            if(tailfatigue == 0 && bodyfatigue == 0)
            
            {
                 serpentHead.moveTo(new RoomPosition(25,25,mainMemoryObject.arrayOfSquadGoals[0] ));
              //  serpentHead.moveTo(Game.flags[mainMemoryObject.arrayOfSquadGoals[0]]);
                serpentBody.moveTo(new RoomPosition(serpentHeadPositionStorageX, serpentHeadPositionStorageY, currroomnamehead));
                serpentTail.moveTo(new RoomPosition(serpentBodyPositionStorageX, serpentBodyPositionStorageY, currroomnamebody));
            }
        }
        var closesttarget = serpentHead.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var targetlist = serpentHead.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        //  var rangetoclosestCreep = serpentHead.pos.getRangeTo(targets);
        var highPrioryttargets = [];
        var dangerousTargets = [];
        // console.log("got to begining of head");
        // check fi creep is dismantel or attack
        var headType = "ranger";
        if(headType == "attack")
        {
            if(closesttarget != undefined)
            {
                if(serpentHead.attack(closesttarget) == ERR_NOT_IN_RANGE)
                {
                    if(tailfatigue == 0 && bodyfatigue == 0)
                    {
                        serpentHead.moveTo(closesttarget);
                        serpentBody.moveTo(new RoomPosition(serpentHeadPositionStorageX, serpentHeadPositionStorageY, currroomnamehead));
                        serpentTail.moveTo(new RoomPosition(serpentBodyPositionStorageX, serpentBodyPositionStorageY, currroomnamebody));
                    }
                }
            }
        }
        if(headType == "dismantle")
        {
            var listEnemyStructures = serpentHead.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
            if(listEnemyStructures != undefined)
            {
                var closesttarget = serpentHead.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (structure) => (structure.structureType == STRUCTURE_RAMPART) || (structure.structureType == STRUCTURE_TOWER) || (structure.structureType == STRUCTURE_INVADER_CORE)
                });
                var rangetotarg = closesttarget.pos.getRangeTo(serpentHead);
                if(rangetotarg > 1)
                {
                    if(tailfatigue == 0 && bodyfatigue == 0)
                    {
                        serpentHead.moveTo(closesttarget);
                        serpentBody.moveTo(new RoomPosition(serpentHeadPositionStorageX, serpentHeadPositionStorageY, currroomnamehead));
                        serpentTail.moveTo(new RoomPosition(serpentBodyPositionStorageX, serpentBodyPositionStorageY, currroomnamebody));
                    }
                }
                else
                {
                    serpentHead.dismantle(closesttarget);
                    serpentHead.say("dismanetling");
                }
            }
        }
        if(headType == "ranger")
        {
            var listEnemyStructures = serpentHead.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
           serpentHead.rangedMassAttack();
            if(listEnemyStructures != undefined)
            {
                   
                var closesttarget = serpentHead.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (structure) => (structure.structureType == STRUCTURE_RAMPART) || (structure.structureType == STRUCTURE_TOWER) || (structure.structureType == STRUCTURE_INVADER_CORE)
                });
                if(closesttarget != undefined)
                {
                    var rangetotarg = closesttarget.pos.getRangeTo(serpentHead);
                }
                else
                {
                    var rangetotarg = -1;
                }
                if(rangetotarg > 3)
                {
                    if(tailfatigue == 0 && bodyfatigue == 0)
                    {
                        serpentHead.moveTo(closesttarget);
                        serpentBody.moveTo(new RoomPosition(serpentHeadPositionStorageX, serpentHeadPositionStorageY, currroomnamehead));
                        serpentTail.moveTo(new RoomPosition(serpentBodyPositionStorageX, serpentBodyPositionStorageY, currroomnamebody));
                    }
                }
                else
                {
                    serpentHead.rangedAttack(closesttarget);
                }
            }
            if(serpentHead.hits < serpentBody.hits)
            {
                serpentHead.rangedHeal(serpentHead);
            }
            else if(serpentBody.hits < serpentTail.hits)
            {
                serpentHead.heal(serpentBody);
            }
            else if(serpentTail.hits < serpentTail.hitsMax)
            {
                serpentTail.heal(serpentTail);
            }
            else
            {
                serpentHead.heal(serpentHead);
            }
        }
        //     console.log("got to end of head");
        // serpent body ranged attack creep in range 
        if(serpentHead.hits < serpentBody.hits)
        {
            serpentBody.heal(serpentHead);
        }
        else if(serpentBody.hits < serpentTail.hits)
        {
            serpentBody.heal(serpentBody);
        }
        else if(serpentTail.hits < serpentTail.hitsMax)
        {
            serpentTail.heal(serpentTail);
        }
        else
        {
            serpentBody.rangedHeal(serpentHead);
        }
        var range = serpentBody.pos.getRangeTo(closesttarget);
        if(range <= 3)
        {
            serpentBody.rangedAttack(closesttarget);
        }
        else
        {
            var targsInRange3 = serpentHead.pos.findInRange(FIND_HOSTILE_CREEPS, 3); // add in enemy structures as lesser priorityy
            serpentBody.rangedAttack(targsInRange3);
        }
        // console.log("got to end of body");
        // serpent tail healing
        if(serpentHead.hits < serpentBody.hits)
        {
            serpentTail.rangedHeal(serpentHead);
        }
        else if(serpentBody.hits < serpentTail.hits)
        {
            serpentTail.heal(serpentBody);
        }
        else if(serpentTail.hits < serpentTail.hitsMax)
        {
            serpentTail.heal(serpentTail);
        }
        else
        {
            serpentTail.rangedHeal(serpentHead);
        }
        //   console.log("got to end of tail");
        // reconstruct broken squad
        var rangetohead = serpentBody.pos.getRangeTo(serpentHead);
        if(rangetohead > 1)
        {
            serpentBody.say("rebuild");
            serpentBody.moveTo(serpentHead);
        }
        var rangetoBody = serpentBody.pos.getRangeTo(serpentTail);
        if(rangetoBody > 1)
        {
            serpentTail.say("oor ")
            serpentTail.moveTo(serpentBody);
        }
        var rangetoBodyhead = serpentBody.pos.getRangeTo(serpentHead);
        if(rangetoBodyhead > 1 && serpentHead.room.name == serpentBody.room.name) // if att room edge then it can move independantly
        {
            serpentHead.say("oor ")
            serpentHead.moveTo(serpentBody);
        }
        
        var rangetohead = serpentHead.pos.getRangeTo(serpentTail);
        if(rangetohead > 2 && serpentHead.room.name == serpentTail.room.name) 
        {
            serpentBody.say("rebuild");
            serpentHead.moveTo(serpentTail);
        } 
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    MiningOpteration: function(squadID)
    {
        // console.log("test mineing op");
        var mainMemoryObject = Memory.squadObject[squadID];
        var newroomposition = new RoomPosition(mainMemoryObject.squadposition[0], mainMemoryObject.squadposition[1], mainMemoryObject.arrayOfSquadGoals[0])
        //var target = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var claimer = [];
        var movers = [];
        var miners = [];
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            var creepername = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).name.substring(0, 4);
            if(creepername == "move")
            {
                movers.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
            else if(creepername == "mine")
            {
                miners.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
            else
            {
                claimer.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
        }
        for(var c = 0; c < miners.length; c++)
        {
            var creeper = miners[c];
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    creep not in room
            if(creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) // MOVE TO ROOM
            {
            
                var pos1 = creeper.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creeper.pos.getRangeTo(    new RoomPosition(25,25,mainMemoryObject.arrayOfSquadGoals[0]));
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creeper.moveTo( new RoomPosition(25,25,mainMemoryObject.arrayOfSquadGoals[0]));
                    Game.map.visual.line(creeper.pos,  new RoomPosition(25,25,mainMemoryObject.arrayOfSquadGoals[0]),
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }
            }
            else
            {
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                var sources = creeper.room.find(FIND_SOURCES);
                var source_target = sources[creeper.name.substring(5, 6)];
                var range = creeper.pos.getRangeTo(source_target);
                if(range > 1)
                {
                    creeper.moveTo(source_target,
                    {
                        reusePath: range,
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
                else
                {
                    creeper.harvest(source_target);
                }
                if(creeper.store.getFreeCapacity() == 0)
                {
                    var targets = creeper.pos.findInRange(FIND_STRUCTURES, 3,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_CONTAINER);
                        }
                    });
                    if(targets.length == 0)
                    {
                        creeper.room.createConstructionSite(creeper.pos.x, creeper.pos.y, STRUCTURE_CONTAINER);
                        var constructionsites = creeper.pos.findInRange(FIND_CONSTRUCTION_SITES, 1);
                        if(constructionsites[0] != undefined)
                        {
                            creeper.build(constructionsites[0]);
                        }
                    }
                    if(creeper.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {}
                }
                var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var range = creeper.pos.getRangeTo(targets);
                if(range < 5)
                {
                    const targetArr = creeper.room.find(FIND_HOSTILE_CREEPS);
                    target = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                 creeper.moveTo(new RoomPosition(25,25,mainMemoryObject.arrayOfSquadGoals[0] ));
                }
            }
        }
        for(var c = 0; c < movers.length; c++)
        {
            var creeper = movers[c];
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creeper.store.getUsedCapacity() != creeper.store.getCapacity() && creeper.room.name == mainMemoryObject.arrayOfSquadGoals[0]) // COLLECT RESOURCES
            {
                var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var containers = creeper.pos.findClosestByRange(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return ((structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy > 1800);
                    }
                });
                var dropped = creeper.pos.findClosestByRange(FIND_DROPPED_RESOURCES); 
                
                if(containers == undefined){
                    containers=dropped;
                }
                var range = creeper.pos.getRangeTo(containers);
                if(range <= 1)
                {
                    creeper.withdraw(containers, RESOURCE_ENERGY);
                }
                else
                {
                    creeper.moveTo(containers,
                    {
                        reusePath: range,
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
                
                
                
                
                
                
                
                var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creeper.store.getUsedCapacity() > creeper.store.getCapacity() * 0.8 && creeper.room.name != mainMemoryObject.squadHomeRoom) //  // MOVE TO HOME
            {
                var targetRoomFlag = Game.flags[mainMemoryObject.squadHomeRoom];
                var pos1 = creeper.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creeper.pos.getRangeTo(targetRoomFlag.pos);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creeper.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creeper.pos, targetRoomFlag.pos,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creeper.store.getUsedCapacity() != 0 && creeper.room.name == mainMemoryObject.squadHomeRoom) //  // DEPOSIT RESOURCES
            {
                var storagemain = creeper.room.storage;
                var terminal = creeper.room.terminal;
                var targ;
                if(storagemain != undefined)
                {
                    targ = storagemain;
                }
                var range = creeper.pos.getRangeTo(targ);
                if(range <= 1)
                {
                    var tmp = creeper.store.getUsedCapacity();
                    var suc = creeper.transfer(targ, RESOURCE_ENERGY, tmp);
                    if(suc == 0)
                    {
                        //    console.log(  Game.flags[creeper.room.name].memory.flagstruct.mineroomsProfitmargin);
                        Game.flags[creeper.room.name].memory.flagstruct.mineroomsProfitmargin += tmp;
                        //console.log(  Game.flags[creeper.room.name].memory.flagstruct.mineroomsProfitmargin);
                    }
                }
                else
                {
                    creeper.moveTo(targ,
                    {
                        reusePath: range,
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creeper.store.getUsedCapacity() < 1 && creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) // MOVE TO ROOM
            {
                // console.log(creeper.room.name,"creep moving",mainMemoryObject.arrayOfSquadGoals[0]);
                var targetRoomFlag = Game.flags[mainMemoryObject.arrayOfSquadGoals[0]];
                var pos1 = creeper.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creeper.pos.getRangeTo(targetRoomFlag.pos);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creeper.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creeper.pos, targetRoomFlag.pos,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////           
        }
        for(var c = 0; c < claimer.length; c++)
        {
            var creeper = claimer[c];
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    creep not in room
            if(creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) // MOVE TO ROOM
            {
                var targetRoomFlag = Game.flags[mainMemoryObject.arrayOfSquadGoals[0]];
                var pos1 = creeper.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creeper.pos.getRangeTo(targetRoomFlag.pos);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creeper.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creeper.pos, targetRoomFlag.pos,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }
            }
            else
            {
                
                var targets = creeper.room.find(FIND_HOSTILE_STRUCTURES);
                
                if(targets.length !=0){
                try{
                    
   Game.spawns[mainMemoryObject.squadHomeRoom].spawnCreep([MOVE,MOVE,MOVE,MOVE, MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK  ], 'roomguard' + squadID,{memory:{role: 'guard',attackrole:"mineguard",  memstruct:{spawnRoom: "E24N3", tasklist: [["moveToRoom",  mainMemoryObject.arrayOfSquadGoals[0]]],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

 
                }catch(e){}
                }
                
                
                
                if(creeper.reserveController(creeper.room.controller) == ERR_NOT_IN_RANGE)
                {
                    creeper.moveTo(creeper.room.controller,
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }else  if(creeper.reserveController(creeper.room.controller) == -7){
                      if(creeper.attackController(creeper.room.controller) == ERR_NOT_IN_RANGE) {
        creeper.moveTo(creep.room.controller);
    }
                    
                }
                
                
                
                
                
                
            }
        }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    SoloPatrol: function(squadID)
    {
        // console.log("test mineing op");
        var mainMemoryObject = Memory.squadObject[squadID];
        creep = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]);
 var q = mainMemoryObject.arrayOfSquadGoals[0];
        
        var c = 0;
        var target = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target == undefined) // if no enemy creeps in room. 
        {
            if(creep.room.name != mainMemoryObject.arrayOfSquadGoals[0])
            {
               creep.say("test to room");
               
                var targposition = new RoomPosition(25, 25,  mainMemoryObject.arrayOfSquadGoals[0] );
                
                creep.say("move  ");
                try
                {
                    creep.heal(creep);
                }
                catch (e)
                {}
                var pos1 = creep.pos;
                var pos2 = targposition;
                const range = creep.pos.getRangeTo(targposition);
                creep.say(range);
                if(range > 23)
                { // might cause bug on nxt room wall 
                  
                    creep.moveTo(targposition);
                    Game.map.visual.line(creep.pos, targposition,
                    {
                        color: '#ff00ff',
                        lineStyle: 'solid'
                    });
                }
            }
            else
            {
                  creep.say("room clear");
                var tmp = mainMemoryObject.arrayOfSquadGoals.splice(0, 1);
                mainMemoryObject.arrayOfSquadGoals.push(tmp[0]);
            }
        }
        else
        {
               creep.say("hostile");
            const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
            const targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            if(targets.length > 0)
            {
                creep.rangedAttack(targets[0]);
            }
            const rangeg = creep.pos.getRangeTo(target);
            if(rangeg > 2)
            {
                creep.moveTo(target);
            }
            
                 try
            {
                creep.heal(creep);
            }
            catch (e)
            {}
            
            
            
            
            if(rangeg < 3)
            
            { 
                  let goals = _.map(target, function(source) {
    // We can't actually walk on sources-- set `range` to 1 
    // so we path next to it.
    return { pos: source.pos, range: 3 };
  });
                
                  console.log(JSON.stringify(goals));
                let path = PathFinder.search(creep.pos, 
                
                
                
                
                goals
                
                
                
                ,{flee:true}).path;
                console.log(JSON.stringify(path));
creep.moveByPath(path);
             
                
                
                
                
                
                
                 
            }
        
        }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
module.exports = squadmanager;