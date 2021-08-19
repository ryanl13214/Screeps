var creepfunctions = require('prototype.creepfunctions');
var coredefence = {
    run: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        for(var kk = 0; kk < mainMemoryObject.SquadMembersCurrent.length; kk++)
        {
            var creeper = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[kk]);
            var target = creeper.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
     
            
            
            
           
           
            if(target != undefined)
            {
                mainMemoryObject.squadposition = [target.pos.x, target.pos.y];
            }
            else if(creeper.room.name == mainMemoryObject.arrayOfSquadGoals[0])
            {
                if(mainMemoryObject.arrayOfSquadGoals.length > 1)
                {
                    var tmp = mainMemoryObject.arrayOfSquadGoals.splice(0, 1);
                    mainMemoryObject.arrayOfSquadGoals.push(tmp);
                }
            }
            
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
                creeper.moveTo(new RoomPosition(25, 25, mainMemoryObject.arrayOfSquadGoals[0]));
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
            var invaderCore = creeper.room.find(FIND_HOSTILE_STRUCTURES,
                {
                    filter: function(object)
                    {
                        return object.structureType != STRUCTURE_KEEPER_LAIR;
                    }
                });
            if(invaderCore != undefined)
            {
                creeper.rangedMassAttack();
                creeper.moveTo(invaderCore);
          
          
            }
            
            
            
            creeper.heal(creeper);
        }
    },
}
module.exports = coredefence;