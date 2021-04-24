var serpentsquad = {
    run: function(squadID)
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
                serpentHead.moveTo(new RoomPosition(25, 25, mainMemoryObject.arrayOfSquadGoals[0]));
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
    }
}
module.exports = serpentsquad;