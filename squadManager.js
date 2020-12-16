var creepfunctions = require('prototype.creepfunctions');
var squadmanager = {

    run: function(squadID) {
        var mainMemoryObject = Memory.squadObject[squadID];
        var numberOfLivingSqaudMembers = [];
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++) {
            if (Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c])) {
                numberOfLivingSqaudMembers.push(mainMemoryObject.SquadMembersCurrent[c]);
            }
        }

        mainMemoryObject.SquadMembersCurrent = numberOfLivingSqaudMembers;

        if (mainMemoryObject.squadcreationtime + 500 < Game.time && numberOfLivingSqaudMembers.length == 0) {
            delete Memory.squadObject[squadID];
        } else {
            const resourcevalues = Object.values(mainMemoryObject.SquadMembersGoal);
            if (mainMemoryObject.SquadMembersCurrent.length < resourcevalues.length && Game.flags[mainMemoryObject.squadHomeRoom].memory.flagstruct.spawnfree == true) {
                if (Game.flags[mainMemoryObject.squadHomeRoom].memory.flagstruct.squadspawning == "") {
                    Game.flags[mainMemoryObject.squadHomeRoom].memory.flagstruct.squadspawning = squadID;
                }
                if (Game.flags[mainMemoryObject.squadHomeRoom].memory.flagstruct.squadspawning == squadID) {
                    this.spawnnewcreep(squadID, mainMemoryObject.squadHomeRoom);
                }
            } else if (1 == 2) {
                ///boosting
            } else if (mainMemoryObject.SquadMembersCurrent.length == resourcevalues.length) {

                mainMemoryObject.squadisready = true;
                Game.flags[mainMemoryObject.squadHomeRoom].memory.flagstruct.squadspawning = "";
            }

            if (mainMemoryObject.squadisready) {
                if (mainMemoryObject.squadType == "centerroomattacksquad") {
                    this.centtersquad_controlFunction(squadID);
                }
                if (mainMemoryObject.squadType == "solocenterdamager") {
                    this.solocenterSquad_controlFunction(squadID);
                }

            }

            if (mainMemoryObject.SquadMembersCurrent.length != 0) {
                if (mainMemoryObject.squadType == "centerMiningSquad") {
                    this.centerMiningOpteration(squadID);
                }
            }

        }
    },

    initializeSquad: function(squadID, arrayOfSquadGoals, squadIsBoosted, squadType, squadHomeRoom, SquadMembers) {
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
    planMovement: function(data) {},
    spawnnewcreep: function(squadID, squadHomeRoom) { // add in function fpor broken squads to be reincorpirated
        var mainMemoryObject = Memory.squadObject[squadID];
        // find the missing members 
        var memstruct = {
            spawnRoom: squadHomeRoom,
            tasklist: [
                ["joinSquad", squadID]
            ], // add in go to muster room.
            objectIDStorage: "",
            boosted: false,
            moveToRenew: false,
            opportuniticRenew: true,
            hastask: false,
            full: false,
            wantsToJoinSquad: false,
            isInSquad: false,
            SquadID: "0",
            SquadRole: false
        };
        var spawnss = Game.spawns[squadHomeRoom];
        var mainMemoryObject = Memory.squadObject[squadID];

        const number = Game.time % Object.values(mainMemoryObject.SquadMembersGoal).length;

        const resourcevalues = Object.values(mainMemoryObject.SquadMembersGoal);
        const names = Object.keys(mainMemoryObject.SquadMembersGoal);
        spawnss.spawnCreep(resourcevalues[number], names[number] + "-" + squadID, {
            memory: {
                role: 'multi',
                cpuUsed: 0,
                memstruct: memstruct
            }
        });

    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    centtersquad_controlFunction: function(squadID) {
        //  console.log("centtersquad_controlFunction");
        var mainMemoryObject = Memory.squadObject[squadID];
        var newroomposition = new RoomPosition(mainMemoryObject.squadposition[0], mainMemoryObject.squadposition[1], mainMemoryObject.arrayOfSquadGoals[0])

        var target = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        if (target != undefined) {
            mainMemoryObject.squadposition = [target.pos.x, target.pos.y];
        } else if (Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).room.name == mainMemoryObject.arrayOfSquadGoals[0]) {
            if (mainMemoryObject.arrayOfSquadGoals.length > 1) {

                var tmp = mainMemoryObject.arrayOfSquadGoals.splice(0, 1);
                mainMemoryObject.arrayOfSquadGoals.push(tmp);

            }
        }

        var healers = [];
        var rangers = [];
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++) {
            if (Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).name.substring(0, 4) == "heal") {
                healers.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            } else {
                rangers.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }

        }

        for (var c = 0; c < rangers.length; c++) {
            var creeper = rangers[c];

            var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var range = creeper.pos.getRangeTo(targets);
            const rangetohealer = creeper.pos.getRangeTo(healers[0]);
            creeper.say(rangetohealer);

            // error checking for room transition
            if (creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) {
                creeper.moveTo(Game.flags[mainMemoryObject.arrayOfSquadGoals[0]]);
            }
            if (range > 3 && creeper.hits == creeper.hitsMax) {
                creeper.moveTo(newroomposition);
            } else if (creeper.hits + 300 < creeper.hitsMax || (rangetohealer > 3 && creeper.hits != creeper.hitsMax)) {
                creeper.moveTo(healers[0]);
            }
            if (range <= 3) {
                creeper.rangedAttack(targets);
            }
        }

        for (var c = 0; c < healers.length; c++) {

            var creeper = healers[c];

            if (creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) {
                creeper.moveTo(Game.flags[mainMemoryObject.arrayOfSquadGoals[0]]);
            }

            var target = creeper.pos.findInRange(FIND_MY_CREEPS, 1, {
                filter: function(object) {
                    return object.hits < object.hitsMax;
                }
            });
            if (target.length != 0) {
                creeper.heal(target[0]);
            } else {
                var target = creeper.pos.findInRange(FIND_MY_CREEPS, 3, {
                    filter: function(object) {
                        return object.hits < object.hitsMax;
                    }
                });
                if (target.length != 0) {
                    creeper.rangedHeal(target[0]);
                }
            }

            var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var range = creeper.pos.getRangeTo(targets);

            if (range > 5) {
                creeper.moveTo(newroomposition);
            }
            if (range < 5) {
                const targetArr = creeper.room.find(FIND_HOSTILE_CREEPS);
                target = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                creepfunctions.combatMove(creeper, targetArr, target);
            }
        }

    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    solocenterSquad_controlFunction: function(squadID) {
        //  console.log("centtersquad_controlFunction");
        var mainMemoryObject = Memory.squadObject[squadID];
        var newroomposition = new RoomPosition(mainMemoryObject.squadposition[0], mainMemoryObject.squadposition[1], mainMemoryObject.arrayOfSquadGoals[0])

        var target = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        if (target != undefined) {
            mainMemoryObject.squadposition = [target.pos.x, target.pos.y];
        } else if (Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).room.name == mainMemoryObject.arrayOfSquadGoals[0]) {
            if (mainMemoryObject.arrayOfSquadGoals.length > 1) {
                console.log("before splice", mainMemoryObject.arrayOfSquadGoals);
                var tmp = mainMemoryObject.arrayOfSquadGoals.splice(0, 1);
                mainMemoryObject.arrayOfSquadGoals.push(tmp);
                console.log("after splice", mainMemoryObject.arrayOfSquadGoals);
            }
        }

        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++) {

            var creeper = rangers[c];

            var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var range = creeper.pos.getRangeTo(targets);
            const rangetohealer = creeper.pos.getRangeTo(healers[0]);
            creeper.say(rangetohealer);

            // error checking for room transition
            if (creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) {
                creeper.moveTo(Game.flags[mainMemoryObject.arrayOfSquadGoals[0]]);
            }
            if (range > 3 && creeper.hits == creeper.hitsMax) {
                creeper.moveTo(newroomposition);
            } else if (creeper.hits + 300 < creeper.hitsMax) {
                //combatmove
            }
            if (range <= 3) {
                creeper.rangedAttack(targets);
            }

        }

    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    centerMiningOpteration: function(squadID) {

        var mainMemoryObject = Memory.squadObject[squadID];
        var newroomposition = new RoomPosition(mainMemoryObject.squadposition[0], mainMemoryObject.squadposition[1], mainMemoryObject.arrayOfSquadGoals[0])
        //var target = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        var fixer = [];
        var movers = [];
        var miners = [];
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++) {
            var creepername = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).name.substring(0, 4);

            if (creepername == "move") {
                movers.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
            if (creepername == "mine") {
                miners.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
            if (creepername == "fixe") {
                fixer.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
        }

        for (var c = 0; c < fixer.length; c++) {
            var creeper = fixer[c];
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) // MOVE TO ROOM
            {
                var targetRoomFlag = Game.flags[mainMemoryObject.arrayOfSquadGoals[0]];
                var pos1 = creeper.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creeper.pos.getRangeTo(targetRoomFlag.pos);
                if (range > 23) { // might cause bug on nxt room wall 
                    creeper.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creeper.pos, targetRoomFlag.pos, {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }

            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            else {

                var target = creeper.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: function(object) {
                        return object.hits < object.hitsMax;
                    }
                });
                if (target) {
                    if (creeper.heal(target) == ERR_NOT_IN_RANGE) {
                        creeper.moveTo(target);
                    }
                }

                var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var range = creeper.pos.getRangeTo(targets);

                if (range < 5) {
                    const targetArr = creeper.room.find(FIND_HOSTILE_CREEPS);
                  var   target = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    creepfunctions.combatMove(creeper, targetArr, target);
                }

            }

        }

        for (var c = 0; c < miners.length; c++) {
            var creeper = miners[c];

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) // MOVE TO ROOM
            {
                var targetRoomFlag = Game.flags[mainMemoryObject.arrayOfSquadGoals[0]];
                var pos1 = creeper.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creeper.pos.getRangeTo(targetRoomFlag.pos);
                if (range > 23) { // might cause bug on nxt room wall 
                    creeper.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creeper.pos, targetRoomFlag.pos, {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }

            } else {
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                var sources = creeper.room.find(FIND_SOURCES);

                var source_target = sources[creeper.name.substring(5, 6)];

                var range = creeper.pos.getRangeTo(source_target);
                if (range > 1) {
                    creeper.moveTo(source_target, {
                        reusePath: range,
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                } else {
                    creeper.harvest(source_target);
                    creeper.drop(RESOURCE_ENERGY);
                }

               
               

                var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var range = creeper.pos.getRangeTo(targets);

                if (range < 5) {
                    const targetArr = creeper.room.find(FIND_HOSTILE_CREEPS);
                    target = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    creeper.moveTo(Game.flags[mainMemoryObject.arrayOfSquadGoals[0]]);
                }

            }

        }

        for (var c = 0; c < movers.length; c++) {
            var creeper = movers[c];
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (creeper.store.getUsedCapacity() != creeper.store.getCapacity() && creeper.room.name == mainMemoryObject.arrayOfSquadGoals[0]) // COLLECT RESOURCES
            {
         var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var droppedresources = creeper.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                    filter: (res) => {
                        return (res.resourceType == RESOURCE_ENERGY) && (res.amount > creeper.store.getFreeCapacity() ) && res.pos.getRangeTo(targets) >5;
                    }
                });
                    var tombstones = creeper.pos.findClosestByPath(FIND_TOMBSTONES,
                {
                    filter: (tomb) =>
                    {
                        return (tomb.store.getUsedCapacity() != tomb.store.getUsedCapacity(RESOURCE_ENERGY)) || (tomb.store.getUsedCapacity(
                            RESOURCE_ENERGY) > 300);
                    }
                });
 if (droppedresources != undefined) {

                    var range = creeper.pos.getRangeTo(droppedresources);
                    if (range <= 1) {
                        creeper.pickup(droppedresources);
                    } else {
                        creeper.moveTo(droppedresources, {
                            reusePath: range,
                            visualizePathStyle: {
                                stroke: '#ffaa00'
                            }
                        });
                    }

                }  
                if (droppedresources != undefined) {

                    var range = creeper.pos.getRangeTo(droppedresources);
                    if (range <= 1) {
                        creeper.pickup(droppedresources);
                    }
                    
                }
                if (tombstones != undefined) {

                    var range = creeper.pos.getRangeTo(tombstones);
                    if (range <= 1) {
                        creeper.withdraw(tombstones,RESOURCE_ENERGY);
                    }
                    
                }
                var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var range = creeper.pos.getRangeTo(targets);

                if (range <= 5) {
                    const targetArr = creeper.room.find(FIND_HOSTILE_CREEPS);
                    target = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    creepfunctions.combatMove(creeper, targetArr, target);
                }

            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (creeper.store.getUsedCapacity() == creeper.store.getCapacity() && creeper.room.name != mainMemoryObject.squadHomeRoom) //  // MOVE TO HOME
            {
                var targetRoomFlag = Game.flags[mainMemoryObject.squadHomeRoom];
                var pos1 = creeper.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creeper.pos.getRangeTo(targetRoomFlag.pos);
                if (range > 23) { // might cause bug on nxt room wall 
                    creeper.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creeper.pos, targetRoomFlag.pos, {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }

            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (creeper.store.getUsedCapacity() != 0 && creeper.room.name == mainMemoryObject.squadHomeRoom) //  // DEPOSIT RESOURCES
            {

                var storagemain = creeper.room.storage;

                var terminal = creeper.room.terminal;

                var targ;

                if (terminal != undefined) {
                    targ = terminal;
                } else if (storagemain != undefined) {
                    targ = storagemain;
                }
                var range = creeper.pos.getRangeTo(targ);
                if (range <= 1) {
                    creeper.transfer(targ, RESOURCE_ENERGY, creeper.energyAvailable);
                } else {
                    creeper.moveTo(targ, {
                        reusePath: range,
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }

            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (creeper.store.getUsedCapacity() != creeper.store.getCapacity() && creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) // MOVE TO ROOM
            {
                var targetRoomFlag = Game.flags[mainMemoryObject.arrayOfSquadGoals[0]];
                var pos1 = creeper.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creeper.pos.getRangeTo(targetRoomFlag.pos);
                if (range > 23) { // might cause bug on nxt room wall 
                    creeper.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creeper.pos, targetRoomFlag.pos, {
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

}
module.exports = squadmanager;