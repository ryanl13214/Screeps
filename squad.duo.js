var creepfunctions = require('prototype.creepfunctions');
var guardCode = require('role.basicroomguard');

var attackerCode = require('role.basicattacker');
        /*
        
        var bodypartshead = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK];
         var bodypartstail = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL];
            if(Memory.squadObject.testDuo == undefined)
            {
                squadmanage.initializeSquad("testDuo", [["moveToRoom", "E25N4"]], false, "duo", "E24N3",
                {
                    "head": bodypartshead,
                    "tail": bodypartstail,
                },"chasedown");
            }
        
        */


var Duo = {
    allowSlave: function(creep)
    {
        if(creep.memory.duoId != undefined)
        {
            var slave = Game.getObjectById(creep.memory.duoId);
            const range = creep.pos.getRangeTo(slave);
            var counter = 1;
            if(slave.pos.x == 50 || slave.pos.x == 0 || slave.pos.y == 50 || slave.pos.y == 0)
            {
                counter = 3;
            }
            if(range > counter && creep.room.name == slave.room.name && Game.time % 3 == 0)
            {
                creep.say("come");
                creep.moveTo(slave);
            }
        }
    },
    run: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        var target;
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        var tail;
        var head;
        
        
        if(all.length ==0 ){
               delete Memory.squadObject[squadID];
        }
        
        
        
        for(var c = 0; c < all.length; c++)
        {
            var creepername = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).name.substring(0, 4);
            if(creepername == "tail")
            {
                tail = all[c];
            }
            if(creepername != "tail")
            {
                head = all[c];
            }
        }
        if(head && head.memory.memstruct.tasklist.length != 0 && head.memory.memstruct.tasklist[0].length > 1 && head.memory.memstruct.tasklist[0][0] == "joinSquad")
        {
            head.memory.memstruct.tasklist = mainMemoryObject.arrayOfSquadGoals;
        }
        ///////////////////////////////////////////////////////////////////////////////
        if(head){
        var check = creepfunctions.checkglobaltasks(head);
        if(check)
        {
            if(mainMemoryObject.squadSubType == "chasedown")
            {
                head.say("a");
                this.chaseDown(head,tail);
            }
            if(mainMemoryObject.squadSubType == "DismantleOuterBunker")
            {
                this.chaseDown(head,tail);
            }
            if(mainMemoryObject.squadSubType == "dismantlerRoom")
            {
                this.chaseDown(head,tail);
            }
            if(mainMemoryObject.squadSubType == "roomDefence")
            {
                this.chaseDown(head,tail);
            }
        }
        }
        ///////////////////////////////////
        var slave = tail;
        if(slave && head){
        const range = head.pos.getRangeTo(slave);
        var counter = 1;
        if(slave.pos.x == 50 || slave.pos.x == 0 || slave.pos.y == 50 || slave.pos.y == 0)
        {
            counter = 3;
        }
        if(range > counter && head.room.name == slave.room.name && Game.time % 3 == 0)
        {
            head.say("come");
            head.moveTo(slave);
        }
        ///////////////////////////////////////////   
        var master = head;
        if(master == null)
        {
            tail.suicide();
        }
        tail.moveTo(master);
        if(master != undefined && master != null)
        {
            if(tail.hits == tail.hitsMax)
            {
                tail.heal(master);
            }
            else
            {
                if(Game.time & 2 == 0)
                {
                    tail.heal(master);
                }
                else
                {
                    tail.heal(creep);
                }
            }
        }
        }
    },
    chaseDown: function(creep,Healer)
    {
       
        var target = creepfunctions.getcombattagetsclosest(creep);
        if(target == undefined)
        {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS,
            {
                filter:
                {
                    owner:
                    {
                        username: 'Invader'
                    }
                }
            });
        }
        //////////////// attack strucrtures 
        if(target == undefined)
        {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_INVADER_CORE || structure.structureType == STRUCTURE_TOWER);
                }
            });
            if(target == undefined)
            {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_TOWER);
                    }
                });
                if(target == undefined)
                {
                    target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_RAMPART);
                        }
                    });
                }
            }
        }
        //////////////// 
        var range = creep.pos.getRangeTo(target);
        if(range == 1)
        {
            creep.rangedMassAttack();
            creep.attack(target);
        }
        else if(range < 4)
        {
            if(creep.body.find(elem => elem.type === "heal") != undefined) // pre-heal
            {
                creep.heal(creep);
            }
            creep.rangedAttack(target);
        }
        else
        {
            if(creep.body.find(elem => elem.type === "heal") != undefined && creep.hits < creep.hitsMax)
            {
                creep.heal(creep);
            }
        }
        
        
         var range = creep.pos.getRangeTo(Healer);
        
        /////////////////////////////
        if(range==1 || Game.time % 5 != 0)
        {
            creep.moveTo(target);
        }
        else
        {
     
            creep.moveTo(Healer);
       
        }
        ////////////////////////////
    },
    
    
    
    
    
    
    
      flagDismantle: function(creep,Healer)
    {
    
    var movetarg ;
                 creep.rangedMassAttack();
                var target = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1,
                {
                    filter: (res) =>
                    {
                        return (res.structureType != STRUCTURE_STORAGE && res.structureType != STRUCTURE_TERMINAL && res.structureType != STRUCTURE_FACTORY);
                    }
                });
                if(target.length != 0)
                {
                    creep.dismantle(target[0]);
                }
                var found = [];
                var flagsinrange = creep.pos.findClosestByPath(FIND_FLAGS);
                if(flagsinrange  != undefined)
                {
                    found = creep.room.lookForAt(LOOK_STRUCTURES, flagsinrange.pos);
                    
                    
                    if( flagsinrange.pos.x == creep.pos.x   &&  flagsinrange.pos.x == creep.pos.x    &&  flagsinrange.pos.y  == creep.pos.y  &&  flagsinrange.pos.y == creep.pos.y){
                        flagsinrange.remove();
                    }else{
                     movetarg =flagsinrange;   
                    }
                    
                    
                    if(found.length != 0)
                    {
                        //       found = creep.room.lookForAt(FIND_HOSTILE_STRUCTURES, flagsinrange[0].pos);
                    }
                }
                if(found.length != 0)
                {
                    if(creep.dismantle(found[0]) == ERR_NOT_IN_RANGE)
                    {
                        var findNewtarget = creep.moveTo(found[0]);
                        if(findNewtarget == -2)
                        {
                            var target = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                            if(target.length != 0)
                            {
                                creep.dismantle(target[0]);
                            }
                        }
                    }
                }
                else
                {
                    var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_TOWER);
                        }
                    });
                    if(target == undefined)
                    {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (res) =>
                            {
                                return (res.structureType == STRUCTURE_SPAWN);
                            }
                        });
                    }
                    if(target == undefined)
                    {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (res) =>
                            {
                                return (res.structureType == STRUCTURE_NUKER);
                            }
                        });
                    }
                    if(target == undefined && 1 == 2)
                    {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (res) =>
                            {
                                return (res.structureType == STRUCTURE_TERMINAL);
                            }
                        });
                    }
                    if(target == undefined && 1 == 2)
                    {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (res) =>
                            {
                                return (res.structureType == STRUCTURE_STORAGE);
                            }
                        });
                    }
                    if(target == undefined && 1 == 2)
                    {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (res) =>
                            {
                                return (res.structureType == STRUCTURE_FACTORY);
                            }
                        });
                    }
                    if(target == undefined)
                    {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (res) =>
                            {
                                return (res.structureType == STRUCTURE_LAB);
                            }
                        });
                    }
                    if(target == undefined)
                    {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (res) =>
                            {
                                return (res.structureType == STRUCTURE_EXTENSION);
                            }
                        });
                    }
                    if(target == undefined)
                    {
                        //  var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                    }
                    if(target != undefined)
                    {
                        if(creep.dismantle(target) == ERR_NOT_IN_RANGE)
                        {
                  movetarg = target;
                        }
                        
                    }
                }
               
               
         var range = creep.pos.getRangeTo(Healer);
        
        /////////////////////////////
        if(range==1 || Game.time % 5 != 0)
        {
            creep.moveTo(    movetarg    );
        }
        else
        {
     
            creep.moveTo(Healer);
       
        }
    
    
    }
    
    
    
    
    
    
    
    
    
    
}
module.exports = Duo;