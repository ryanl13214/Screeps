var roommining = {
    run: function(squadID)
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
                var range = creeper.pos.getRangeTo(new RoomPosition(25, 25, mainMemoryObject.arrayOfSquadGoals[0]));
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creeper.moveTo(new RoomPosition(25, 25, mainMemoryObject.arrayOfSquadGoals[0]));
                    Game.map.visual.line(creeper.pos, new RoomPosition(25, 25, mainMemoryObject.arrayOfSquadGoals[0]),
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
                var containers = creeper.pos.findClosestByRange(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return ((structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy > 1800);
                    }
                });
                var dropped = creeper.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if(containers == undefined)
                {
                    containers = dropped;
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
        for(var c = 0; c < claimer.length; c++)
        {
            var creeper = claimer[c];
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    creep not in room
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
                var targets = creeper.room.find(FIND_HOSTILE_STRUCTURES);
                if(targets.length = 0)
                {
                    var targets = creeper.room.find(FIND_HOSTILE_CREEPS); // todo make bodypart tracker 
                }
                if(targets.length != 0)
                {
                    try
                    {
                        var levelofcontrollerinhomeroom = Game.rooms[mainMemoryObject.squadHomeRoom].controller.level;
                        if(levelofcontrollerinhomeroom == 5)
                        {
                            Game.spawns[mainMemoryObject.squadHomeRoom].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, HEAL], 'roomguard' + squadID,
                            {
                                memory:
                                {
                                    role: 'guard',
                                    attackrole: "mineguard",
                                    memstruct:
                                    {
                                        spawnRoom: "E24N3",
                                        tasklist: [
                                            ["moveToRoom", mainMemoryObject.arrayOfSquadGoals[0]]
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
                        else
                        {
                            Game.spawns[mainMemoryObject.squadHomeRoom].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, HEAL], 'roomguard' + squadID,
                            {
                                memory:
                                {
                                    role: 'guard',
                                    attackrole: "mineguard",
                                    memstruct:
                                    {
                                        spawnRoom: "E24N3",
                                        tasklist: [
                                            ["moveToRoom", mainMemoryObject.arrayOfSquadGoals[0]]
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
                    }
                    catch (e)
                    {}
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
                }
                else if(creeper.reserveController(creeper.room.controller) == -7)
                {
                    if(creeper.attackController(creeper.room.controller) == ERR_NOT_IN_RANGE)
                    {
                        creeper.moveTo(creep.room.controller);
                    }
                }
            }
        }
    }
}
module.exports = roommining;