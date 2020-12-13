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
            if (mainMemoryObject.SquadMembersCurrent.length < resourcevalues.length  &&    Game.flags[mainMemoryObject.squadHomeRoom].memory.flagstruct.spawnfree == true) {
                this.spawnnewcreep(squadID, mainMemoryObject.squadHomeRoom);
            } else if (1 == 2) {
                ///boosting
            } else if (mainMemoryObject.SquadMembersCurrent.length == resourcevalues.length) {
                console.log("squad is ready ", squadID);
                mainMemoryObject.squadisready = true;
            }
            if (mainMemoryObject.squadisready) {
                if (mainMemoryObject.squadType == "centerroomattacksquad") {
                    this.centtersquad_controlFunction(squadID);
                }
                if (mainMemoryObject.squadType == "solocenterdamager") {
                    this.solocenterSquad_controlFunction(squadID);
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
        const number = Object.values(mainMemoryObject.SquadMembersCurrent).length;
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
                console.log("before splice", mainMemoryObject.arrayOfSquadGoals);
                var tmp = mainMemoryObject.arrayOfSquadGoals.splice(0, 1);
                mainMemoryObject.arrayOfSquadGoals.push(tmp);
                console.log("after splice", mainMemoryObject.arrayOfSquadGoals);
            }
        }




        var healers = [];
        var rangers = [];
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++) {
            if (Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).name == "healer1-E24N3centerdamagesquad") {
                healers.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            } else {
                rangers.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }

        }



        for (var c = 0; c < rangers.length; c++) {
            var creeper = rangers[c];

            var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            const range = creeper.pos.getRangeTo(targets);
            const rangetohealer = creeper.pos.getRangeTo(healers[0]);
            creeper.say(rangetohealer);

            // error checking for room transition
            if (creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) 
            {
                creeper.moveTo(Game.flags[mainMemoryObject.arrayOfSquadGoals[0]]);
            }
            if (range > 3 && creeper.hits == creeper.hitsMax) 
            {
                creeper.moveTo(newroomposition);
            }
            else if (creeper.hits + 300 < creeper.hitsMax) 
            {
                creeper.moveTo(healers[0]);
            }
            if (range <= 3) 
            {
                creeper.rangedAttack(targets);
            }
        }

        for (var c = 0; c < healers.length; c++) {

            var creeper = healers[c];
            
            if (creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) 
            {
                creeper.moveTo(Game.flags[mainMemoryObject.arrayOfSquadGoals[0]]);
            }
            
            var target = creeper.pos.findInRange(FIND_MY_CREEPS, 1, {
                filter: function(object) {
                    return object.hits < object.hitsMax;
                }
            });
            if (target.length != 0) 
            {
                creeper.heal(target[0]);
            } 
            else 
            {
                var target = creeper.pos.findInRange(FIND_MY_CREEPS, 3, {
                    filter: function(object) {
                        return object.hits < object.hitsMax;
                    }
                });
                if (target.length != 0) 
                {
                    creeper.rangedHeal(target[0]);
                }
            }



            var targets = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            const range = creeper.pos.getRangeTo(targets);
             
            if (range > 5) 
            {
                creeper.moveTo(newroomposition);
            }
            if (range < 5) 
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
            const range = creeper.pos.getRangeTo(targets);
            const rangetohealer = creeper.pos.getRangeTo(healers[0]);
            creeper.say(rangetohealer);

            // error checking for room transition
            if (creeper.room.name != mainMemoryObject.arrayOfSquadGoals[0]) 
            {
                creeper.moveTo(Game.flags[mainMemoryObject.arrayOfSquadGoals[0]]);
            }
            if (range > 3 && creeper.hits == creeper.hitsMax) 
            {
                creeper.moveTo(newroomposition);
            }
            else if (creeper.hits + 300 < creeper.hitsMax) 
            {
               //combatmove
            }
            if (range <= 3) 
            {
                creeper.rangedAttack(targets);
            }



        }
 


    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
module.exports = squadmanager;