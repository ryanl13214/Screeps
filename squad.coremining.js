var creepfunctions = require('prototype.creepfunctions');
var coremining = {
    run: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var newroomposition = new RoomPosition(mainMemoryObject.squadposition[0], mainMemoryObject.squadposition[1], mainMemoryObject.arrayOfSquadGoals[0]);
        
                     
        
                       if(!Game.creeps[squadID + "guard"])
            {
                delete Memory.creeps[squadID + "guard"];
                
                
                
                       Game.spawns[mainMemoryObject.squadHomeRoom].spawnCreep(
               [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL]
                , squadID + "guard",
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: mainMemoryObject.squadHomeRoom,
                            tasklist: [
                                ["GuardCenterRoom",  mainMemoryObject.arrayOfSquadGoals[0]]
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
                var roomPosition = new RoomPosition(25, 25, mainMemoryObject.arrayOfSquadGoals[0]);
                var pos1 = creeper.pos;
                var range = creeper.pos.getRangeTo(roomPosition);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creeper.moveTo(roomPosition);
                    Game.map.visual.line(creeper.pos, roomPosition,
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
                var roomPosition = new RoomPosition(25, 25, mainMemoryObject.arrayOfSquadGoals[0]);
                var pos1 = creeper.pos;
                var range = creeper.pos.getRangeTo(roomPosition);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creeper.moveTo(roomPosition);
                    Game.map.visual.line(creeper.pos, roomPosition,
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
                    creeper.moveTo(new RoomPosition(25, 25, mainMemoryObject.arrayOfSquadGoals[0]));
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
                var roomPosition = new RoomPosition(25, 25, mainMemoryObject.arrayOfSquadGoals[0]);
                var pos1 = creeper.pos;
                var range = creeper.pos.getRangeTo(roomPosition);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creeper.moveTo(roomPosition);
                    Game.map.visual.line(creeper.pos, roomPosition,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////           
        }
    }
}
module.exports = coremining;