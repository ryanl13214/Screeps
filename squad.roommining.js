var creepfunctions = require('prototype.creepfunctions');
var roommining = {
    callAid: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var roomObj = Game.rooms[mainMemoryObject.squadHomeRoom];
        var myCreeps = roomObj.find(FIND_MY_CREEPS);
        var numberofguardingcreeps = _.filter(myCreeps, (creep) => creep.memory.role == 'guard' && creep.memory.attackrole == "chasedown");
        if (numberofguardingcreeps.length != 0) // todo and home room is not under attack
        {
            if (numberofguardingcreeps[0].memory.memstruct.tasklist == 0)
            {
                //  console.log("moveToRoom");
                numberofguardingcreeps[0].memory.memstruct.tasklist = [
                    ["forcemoveToRoom", mainMemoryObject.arrayOfSquadGoals[0]],
                    ["clearRoomPassive"],
                    ["forcemoveToRoom", mainMemoryObject.squadHomeRoom]
                ];
            }
        }

    },
 
    run: function(squadID)
    {
        // console.log("test mineing op");
        var mainMemoryObject = Memory.squadObject[squadID];
        var newroomposition = new RoomPosition(mainMemoryObject.squadposition[0], mainMemoryObject.squadposition[1], mainMemoryObject.arrayOfSquadGoals[0])
        //var target = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        var miners = [];
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            var creepername = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).name.substring(0, 4);
            if (creepername == "mine")
            {
                miners.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
        }
        var roomObj = Game.rooms[mainMemoryObject.arrayOfSquadGoals[0]];
        if (roomObj != undefined)
        {
            // combat
            var invaders = roomObj.find(FIND_HOSTILE_CREEPS);

            var hostileStructs = roomObj.find(FIND_HOSTILE_STRUCTURES);
            if (invaders.length != 0 || hostileStructs.length != 0)
            {
                this.callAid(squadID);
            }
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // reservation
            if ((roomObj.controller.reservation != undefined && roomObj.controller.reservation.ticksToEnd < 2000) || roomObj.controller.reservation == undefined || roomObj.controller.owner == undefined || roomObj.controller.reservation.username != "Q13214")
            {
                // summon reserver
                var energyavailable = Game.rooms[mainMemoryObject.squadHomeRoom].energyCapacityAvailable;
                var numberofparts = Math.floor((energyavailable) / 650);
                if (numberofparts > 10)
                {
                    numberofparts = 10;
                }
                Game.spawns[mainMemoryObject.squadHomeRoom].spawnCreep([MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM], mainMemoryObject.arrayOfSquadGoals[0] + "claimer",
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: mainMemoryObject.squadHomeRoom,
                            tasklist: [
                                ["forcemoveToRoom", mainMemoryObject.arrayOfSquadGoals[0]],
                                ["reserve"]
                            ],
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: false,
                            hastask: false
                        }
                    }
                });
            }
            ////////////////////////////
            var containers = roomObj.find(FIND_STRUCTURES,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 1800);
                }
            });
            var containersall = roomObj.find(FIND_STRUCTURES,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 1);
                }
            });

           
    
          
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // 2 sources
            var sources = roomObj.find(FIND_SOURCES);
            //  Object.keys(mainMemoryObject.SquadMembersGoal.length);
            // console.log( Object.keys(mainMemoryObject.SquadMembersGoal).length);
            if (sources.length == 2 && Object.keys(mainMemoryObject.SquadMembersGoal).length < 4)
            {
                var energyavailable = Game.rooms[mainMemoryObject.squadHomeRoom].energyCapacityAvailable;
                var numberofparts = Math.floor((energyavailable - 200) / 150);
                if (numberofparts > 6)
                {
                    numberofparts = 6;
                }
                var bodypartsMINER = [CARRY, CARRY, MOVE, MOVE];
                for (let j = 0; j < numberofparts; j++)
                {
                    bodypartsMINER.push(MOVE);
                    bodypartsMINER.push(WORK);
                }
                var numberofparts = Math.floor((energyavailable) / 100);
                if (numberofparts > 15)
                {
                    numberofparts = 15;
                }

                mainMemoryObject.SquadMembersGoal = {

                    "miner0": bodypartsMINER,
                    "miner1": bodypartsMINER
                };
            }
            ///////////////////////////////////////////////////
            // construction 
            if (Game.time % 6000 == 0)
            {
                var roomObj = Game.rooms[mainMemoryObject.arrayOfSquadGoals[0]];
                var constructionSitess = roomObj.find(FIND_CONSTRUCTION_SITES);
                for (let j = 0; j < constructionSitess.length; j++)
                {
                    constructionSitess[j].remove();
                }
            }
            //////////////////////////////////////////////////////
        } // end of rooms
        //////////////////////////////////////////////////////////////MINER ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        for (var c = 0; c < miners.length; c++)
        {
            var creeper = miners[c];
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    creep not in room
            if (creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) // MOVE TO ROOM
            {
                var pos1 = creeper.pos;
                var range = creeper.pos.getRangeTo(new RoomPosition(25, 25, mainMemoryObject.arrayOfSquadGoals[0]));
                if (range > 23)
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
                if (range > 1)
                {
                    var A = creeper.moveTo(source_target,
                    {
                        ignoreCreeps: true,
                        reusePath: range,
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                    if (Game.time % 4 == 0)
                    {
                        var targets = creeper.pos.findInRange(FIND_MY_CREEPS, 1);
                        for (var c = 0; c < targets.length; c++)
                        {
                            targets[c].moveTo(creeper.pos);
                        }
                    }
                }
                else
                {
                    var targets = creeper.pos.findInRange(FIND_STRUCTURES, 1,
                    {
                        filter: object => object.hits * 2 < object.hitsMax
                    });
                    targets.sort((a, b) => a.hits - b.hits);
                    if (targets.length > 0 && creeper.store.getUsedCapacity("energy") > 25)
                    {
                        creeper.repair(targets[0]);
                    }
                    else
                    {
                        creeper.harvest(source_target);
                    }
                }
                if (creeper.store.getFreeCapacity() == 0)
                {
                    var targets = creeper.pos.findInRange(FIND_STRUCTURES, 1,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_CONTAINER);
                        }
                    });
                    if (targets.length == 0)
                    {
                        creeper.room.createConstructionSite(creeper.pos.x, creeper.pos.y, STRUCTURE_CONTAINER);
                        var constructionsites = creeper.pos.findInRange(FIND_CONSTRUCTION_SITES, 1);
                        if (constructionsites[0] != undefined)
                        {
                            creeper.build(constructionsites[0]);
                        }
                    }
                    if (creeper.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {}
                }

                var targets = creepfunctions.getHostilesInRange(creeper, 5);

                if (targets.length != 0)
                {
                    const targetArr = creeper.room.find(FIND_HOSTILE_CREEPS);
                    target = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    creeper.moveTo(new RoomPosition(25, 25, mainMemoryObject.arrayOfSquadGoals[0]));
                }

            }
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }
}
module.exports = roommining;