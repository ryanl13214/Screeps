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
        if(mainMemoryObject.squadcreationtime + 500 < Game.time && numberOfLivingSqaudMembers.length == 0)
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
            if(mainMemoryObject.squadisready) // group squads
            {
                if(mainMemoryObject.squadType == "serpent" && mainMemoryObject.SquadMembersCurrent.length == 3) // add else here for retreating
                {
                    this.serpentsquad_controlFunction(squadID);
                }
            }
            if(mainMemoryObject.SquadMembersCurrent.length != 0) //independant squads
            {
                if(mainMemoryObject.squadType == "centerMiningSquad")
                {
                    this.centerMiningOpteration(squadID);
                }
                if(mainMemoryObject.squadType == "solocenterdamager")
                {
                    this.solocenterSquad_controlFunction(squadID);
                }
                if(mainMemoryObject.squadType == "MiningSquad")
                {
                    this.MiningOpteration(squadID);
                }
                
                
                
            }
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
        for(var i = 0; i < allspawns.length; i++)
        {
            var curspawn = allspawns[i];
            for(var q = 0; q < names.length; q++)
            {
                curspawn.spawnCreep(resourcevalues[q], names[q] + "-" + squadID,
                {
                    memory:
                    {
                        role: 'multi',
                        cpuUsed: 0,
                        memstruct: memstruct
                    }
                });
            }
        }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    centtersquad_controlFunction: function(squadID)
    {
        //  console.log("centtersquad_controlFunction");
        var mainMemoryObject = Memory.squadObject[squadID];
        var newroomposition = new RoomPosition(mainMemoryObject.squadposition[0], mainMemoryObject.squadposition[1], mainMemoryObject.arrayOfSquadGoals[0])
        var target = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target != undefined)
        {
            mainMemoryObject.squadposition = [target.pos.x, target.pos.y];
        }
        else if(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).room.name == mainMemoryObject.arrayOfSquadGoals[0])
        {
            if(mainMemoryObject.arrayOfSquadGoals.length > 1)
            {
                var tmp = mainMemoryObject.arrayOfSquadGoals.splice(0, 1);
                mainMemoryObject.arrayOfSquadGoals.push(tmp);
            }
        }
        var healers = [];
        var rangers = [];
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            if(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).name.substring(0, 4) == "heal")
            {
                healers.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
            else
            {
                rangers.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
        }
        for(var c = 0; c < rangers.length; c++)
        {
            var creeper = rangers[c];
            var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var range = creeper.pos.getRangeTo(targets);
            const rangetohealer = creeper.pos.getRangeTo(healers[0]);
            creeper.say(rangetohealer);
            // error checking for room transition
            if(creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0])
            {
                creeper.moveTo(Game.flags[mainMemoryObject.arrayOfSquadGoals[0]]);
            }
            if(range > 3 && creeper.hits == creeper.hitsMax)
            {
                creeper.moveTo(newroomposition);
            }
            else if(creeper.hits + 300 < creeper.hitsMax || (rangetohealer > 3 && creeper.hits != creeper.hitsMax))
            {
                creeper.moveTo(healers[0]);
            }
            if(range <= 3)
            {
                creeper.rangedAttack(targets);
            }
        }
        for(var c = 0; c < healers.length; c++)
        {
            var creeper = healers[c];
            if(creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0])
            {
                creeper.moveTo(Game.flags[mainMemoryObject.arrayOfSquadGoals[0]]);
            }
            var target = creeper.pos.findInRange(FIND_MY_CREEPS, 1,
            {
                filter: function(object)
                {
                    return object.hits < object.hitsMax;
                }
            });
            if(target.length != 0)
            {
                creeper.heal(target[0]);
            }
            else
            {
                var target = creeper.pos.findInRange(FIND_MY_CREEPS, 3,
                {
                    filter: function(object)
                    {
                        return object.hits < object.hitsMax;
                    }
                });
                if(target.length != 0)
                {
                    creeper.rangedHeal(target[0]);
                }
            }
            var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var range = creeper.pos.getRangeTo(targets);
            if(range > 5)
            {
                creeper.moveTo(newroomposition);
            }
            if(range < 5)
            {
                const targetArr = creeper.room.find(FIND_HOSTILE_CREEPS);
                target = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                creepfunctions.combatMove(creeper, targetArr, target);
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
        var newroomposition = new RoomPosition(mainMemoryObject.squadposition[0], mainMemoryObject.squadposition[1], mainMemoryObject.arrayOfSquadGoals[0])
        var target = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target != undefined)
        {
            mainMemoryObject.squadposition = [target.pos.x, target.pos.y];
        }
        else if(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).room.name == mainMemoryObject.arrayOfSquadGoals[0])
        {
            if(mainMemoryObject.arrayOfSquadGoals.length > 1)
            {
                var tmp = mainMemoryObject.arrayOfSquadGoals.splice(0, 1);
                mainMemoryObject.arrayOfSquadGoals.push(tmp);
            }
        }
        var creeper = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]);
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
            creeper.moveTo(Game.flags[mainMemoryObject.arrayOfSquadGoals[0]]);
        }
        else if(range > 3 && creeper.hits == creeper.hitsMax)
        {
            creeper.moveTo(targets);
        }
        else if(creeper.hits + 300 < creeper.hitsMax || melefound)
        {
            const targetArr = creeper.room.find(FIND_HOSTILE_CREEPS);
            var target = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target != undefined){
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
        creeper.heal(creeper);
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
                    creeper.moveTo(Game.flags[mainMemoryObject.arrayOfSquadGoals[0]]);
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
                
                var target = creeper.pos.findClosestByRange(FIND_STRUCTURES,
                {
                    filter:
                    {
                        structureType: STRUCTURE_LINK
                    }
                });
                
                
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
                    creeper.moveTo(Game.flags[mainMemoryObject.arrayOfSquadGoals[0]]);
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
    bumRushSquad: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var newroomposition = new RoomPosition(mainMemoryObject.squadposition[0], mainMemoryObject.squadposition[1], mainMemoryObject.arrayOfSquadGoals[0])
        var target = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target != undefined)
        {
            mainMemoryObject.squadposition = [target.pos.x, target.pos.y];
        }
        else if(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).room.name == mainMemoryObject.arrayOfSquadGoals[0])
        {
            if(mainMemoryObject.arrayOfSquadGoals.length > 1)
            {
                var tmp = mainMemoryObject.arrayOfSquadGoals.splice(0, 1);
                mainMemoryObject.arrayOfSquadGoals.push(tmp);
            }
        }
        var healers = [];
        var rangers = [];
        var attackers = [];
        var dismantlers = [];
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            var nameOfCreep = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).name.substring(0, 4);
            if(nameOfCreep == "heal")
            {
                healers.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
            else if(nameOfCreep == "rang")
            {
                rangers.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
            else if(nameOfCreep == "atta")
            {
                attackers.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
            else if(nameOfCreep == "dism")
            {
                dismantlers.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
        }
    },
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
    //    console.log("got to begining of global");
        if(serpentHead.room.name != mainMemoryObject.arrayOfSquadGoals[0])
        {
            serpentHead.moveTo(Game.flags[mainMemoryObject.arrayOfSquadGoals[0]]);
            serpentBody.moveTo(new RoomPosition(serpentHeadPositionStorageX, serpentHeadPositionStorageY, currroomnamehead));
            serpentTail.moveTo(new RoomPosition(serpentBodyPositionStorageX, serpentBodyPositionStorageY, currroomnamebody));
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
                    serpentHead.moveTo(closesttarget);
                    serpentBody.moveTo(new RoomPosition(serpentHeadPositionStorageX, serpentHeadPositionStorageY, currroomnamehead));
                    serpentTail.moveTo(new RoomPosition(serpentBodyPositionStorageX, serpentBodyPositionStorageY, currroomnamebody));
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
                    serpentHead.moveTo(closesttarget);
                    serpentBody.moveTo(new RoomPosition(serpentHeadPositionStorageX, serpentHeadPositionStorageY, currroomnamehead));
                    serpentTail.moveTo(new RoomPosition(serpentBodyPositionStorageX, serpentBodyPositionStorageY, currroomnamebody));
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
            if(listEnemyStructures != undefined)
            {
                var closesttarget = serpentHead.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (structure) => (structure.structureType == STRUCTURE_RAMPART) || (structure.structureType == STRUCTURE_TOWER) || (structure.structureType == STRUCTURE_INVADER_CORE)
                });
                var rangetotarg = closesttarget.pos.getRangeTo(serpentHead);
                if(rangetotarg > 3)
                {
                    serpentHead.moveTo(closesttarget);
                    serpentBody.moveTo(new RoomPosition(serpentHeadPositionStorageX, serpentHeadPositionStorageY, currroomnamehead));
                    serpentTail.moveTo(new RoomPosition(serpentBodyPositionStorageX, serpentBodyPositionStorageY, currroomnamebody));
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
                serpentHead.rangedHeal(serpentHead);
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
        console.log("got to end of body");
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
            serpentHead.moveTo(serpentHead);
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
          else  if(creepername == "mine")
            {
                miners.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }else{
                  claimer.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
            
        }
        for(var c = 0; c < miners.length; c++)
        {
            var creeper = miners[c];
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
                
                if(creeper.store.getFreeCapacity() ==0)
                {
                        var   targets = creeper.pos.findInRange(FIND_STRUCTURES,3,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_CONTAINER  )
                        ;
                    }
                });
                    
                    if (targets.length == 0) {
                       creeper.room.createConstructionSite(creeper.pos.x, creeper.pos.y , STRUCTURE_CONTAINER);
                var constructionsites = creeper.pos.findInRange(FIND_CONSTRUCTION_SITES, 1);
                  
                if (constructionsites[0]  != undefined) 
                {
                   creeper.build(constructionsites[0]);
                }
            }
            if (creeper.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {}
                    
                    
                    
                    
                    
                    
                }
                
                
                
                
                
                var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var range = creeper.pos.getRangeTo(targets);
                if(range < 5)
                {
                    const targetArr = creeper.room.find(FIND_HOSTILE_CREEPS);
                    target = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    creeper.moveTo(Game.flags[mainMemoryObject.arrayOfSquadGoals[0]]);
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
              
              
              
             var  containers = creeper.pos.findClosestByRange(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return ((structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy > 1800) 
                        ;
                    }
                });
              
              
              
                    var range = creeper.pos.getRangeTo(containers);
                    if(range <= 1)
                    {
                      
                      
                      creeper.withdraw(containers,  RESOURCE_ENERGY);
                      
                      
                      
                      
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
       
         for(var c = 0; c < claimer.length; c++){
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
                
                
                   if (creeper.reserveController(creeper.room.controller) == ERR_NOT_IN_RANGE) {
                creeper.moveTo(creeper.room.controller, {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
            }

                
                
            }
             
             
             
             
         }
       
       
       
       
       
       
       
       
        
        
        
        
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
module.exports = squadmanager;