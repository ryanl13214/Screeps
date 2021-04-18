var creepfunctions = require('prototype.creepfunctions');
var roleguard = {
    /** @param {Creep} creep **/
    run: function(creep)
    {   
        if(creepfunctions.checkglobaltasks(creep))
        {
            
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "basicRoomAttacker")
            {
                creep.heal(creep);
                var found = [];
                var flagsinrange = creep.pos.findInRange(FIND_FLAGS, 3);
                if(flagsinrange.length != 0)
                {
                    found = creep.room.lookForAt(LOOK_STRUCTURES, flagsinrange[0].pos);
                    if(found.length != 0)
                    {
                        found = creep.room.lookForAt(FIND_HOSTILE_STRUCTURES, flagsinrange[0].pos);
                    }
                }
                if(found.length != 0)
                {
                    creep.say(found);
                    creep.rangedAttack(found[0]);
                }
                else
                {
                    creep.rangedMassAttack();
                }
                var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (res) =>
                    {
                        return (res.structureType == STRUCTURE_TOWER) ;
                    }
                });
                
                
                
                
                if(target == undefined){
                           var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (res) =>
                    {
                        return (res.structureType == STRUCTURE_SPAWN) ;
                    }
                });
                }
                
                         if(target == undefined){
                           var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (res) =>
                    {
                        return (res.structureType == STRUCTURE_NUKER) ;
                    }
                });
                }
                         if(target == undefined && 1==2){
                           var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (res) =>
                    {
                        return (res.structureType == STRUCTURE_TERMINAL) ;
                    }
                });
                }
                
                         if(target == undefined && 1==2){
                           var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (res) =>
                    {
                        return (res.structureType == STRUCTURE_STORAGE) ;
                    }
                });
                }
                         if(target == undefined && 1==2){
                           var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (res) =>
                    {
                        return (res.structureType == STRUCTURE_FACTORY) ;
                    }
                });
                }
                         if(target == undefined){
                           var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (res) =>
                    {
                        return (res.structureType == STRUCTURE_LAB) ;
                    }
                });
                }
                                         if(target == undefined){
                           var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (res) =>
                    {
                        return (res.structureType == STRUCTURE_EXTENSION) ;
                    }
                });
                }
                
                
                
                         if(target == undefined){
              //             var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                }
                
                
                
                var targetPos;
                if(target != undefined)
                {
                    targetPos = target.pos;
                }
                
                let path = creep.room.findPath(creep.pos, targetPos,
                {
                    maxOps: 200
                });
                if(targetPos != undefined && target != undefined)
                {
                    if(!path.length || !targetPos.isEqualTo(path[path.length - 1]))
                    {
                        creep.say("?");
                        path = creep.room.findPath(creep.pos, targetPos,
                        {
                            maxOps: 1000,
                            ignoreDestructibleStructures: true,
                            ignoreCreeps: true
                        });
                    }
                    creep.say(path.length);
                    if(path.length)
                    {
                        creep.move(path[0].direction);
                    }
                    let patha = creep.room.findPath(creep.pos, targetPos,
                    {
                        maxOps: 200
                    });
                    if(patha.length > 2)
                    {
                        creep.move(patha[0].direction);
                    }
                }
                creepfunctions.allowSlave(creep);
            }
            
            
     
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            else   if(creep.memory.attackrole == "attacker")
            {
                this.attacker(creep);
                
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
           else    if(creep.memory.attackrole == "ranger")
            {
                this.ranger(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       else        if(creep.memory.attackrole == "chasedown")
            {
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(target)
                {
                    const range = creep.pos.getRangeTo(target);
                    if(range < 2)
                    {
                        creep.attack(target);
                        creep.moveTo(target);
                        creep.rangedAttack(target);
                    }
                    else
                    {
                        var a = creep.heal(creep);
                        creep.moveTo(target);
                        creep.rangedAttack(target);
                    }
                }
                if(creep.room.controller == undefined)
                {
                    creepfunctions.mineCorridor(creep);
                }
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
           else    if(creep.memory.attackrole == "healer")
            {
                const target = creep.pos.findClosestByRange(FIND_MY_CREEPS,
                {
                    filter: function(object)
                    {
                        return object.hits < object.hitsMax;
                    }
                });
                if(target)
                {
                    creep.moveTo(target);
                    if(creep.pos.isNearTo(target))
                    {
                        creep.heal(target);
                    }
                    else
                    {
                        creep.rangedHeal(target);
                    }
                }
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             else  if(creep.memory.attackrole == "roomAbuser")
            {
                var targetsinsquare = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (s) =>
                    {
                        return (s.structureType == STRUCTURE_SPAWN);
                    }
                }, 4);
                var targets = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (s) =>
                    {
                        return (s.structureType == STRUCTURE_SPAWN);
                    }
                }, 3);
                var targetst = creep.room.find(FIND_HOSTILE_STRUCTURES);
                if(targets.length > 0)
                {
                    creep.say("attack");
                    //creep.rangedAttack(targets[0]);
                }
                if(targetst.length != 0 && creep.hits == creep.hitsMax)
                {
                    creep.say("position 1");
                    creep.moveTo(new RoomPosition(48, 25, creep.room.name));
                }
                if(creep.hits != creep.hitsMax)
                {
                    if(targetst.length == 0)
                    {
                        creep.say("heal");
                        creep.moveTo(Game.flags["roomAbusePoint"].pos);
                    }
                    else
                    {
                        creep.say("back");
                        creep.moveTo(new RoomPosition(49, 25, creep.room.name));
                    }
                }
                else if(creep.hits == creep.hitsMax && targetst.length == 0)
                {
                    creep.moveTo(new RoomPosition(0, 25, creep.room.name));
                }
                //  creep.rangedMassAttack();
                creep.say(targets.length);
                if(targets.length > 0)
                {
                    creep.say("attack");
                    creep.rangedAttack(targets[0]);
                }
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "rangerhealer")
            {
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                const targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                if(targets.length > 0)
                {
                    creep.rangedAttack(targets[0]);
                }
                if(creep.hits < creep.hitsMax)
                {
                    creep.heal(creep);
                }
                const range = creep.pos.getRangeTo(target);
                if(range > 2 && creep.hits + 300 > creep.hitsMax)
                {
                    creep.moveTo(target);
                }
                if(range < 3 || (creep.hits + 300 < creep.hitsMax && range < 5))
                {
                    creepfunctions.combatMove(creep, targetArr, target);
                }
                if(creep.room.name != creep.memory.memstruct.spawnRoom)
                {
                    var targetRoomFlag = Game.flags[creep.memory.memstruct.spawnRoom];
                    var pos1 = creep.pos;
                    var pos2 = targetRoomFlag.pos;
                    const range = creep.pos.getRangeTo(targetRoomFlag.pos);
                    if(range > 23)
                    { // might cause bug on nxt room wall 
                        creep.moveTo(targetRoomFlag.pos);
                    }
                }
            }
 
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
         creepfunctions.allowSlave(creep);
    },
    ranger: function(creep)
    {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
        const targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        if(targets.length > 0)
        {
            creep.rangedAttack(targets[0]);
        }
        const range = creep.pos.getRangeTo(target);
        if(range > 2)
        {
            creep.moveTo(target);
        }
        if(range < 3)
        {
            creepfunctions.combatMove(creep, targetArr, target);
        }
        try
        {
            creep.heal(creep);
        }
        catch (e)
        {}
    },
    attacker: function(creep)
    {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target)
        {
            if(creep.attack(target) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target);
            }
        }
        else
        {
            var targetst = creep.room.find(FIND_HOSTILE_STRUCTURES,
            {
                filter: (s) =>
                {
                    return (s.structureType == STRUCTURE_SPAWN);
                }
            });
            if(targetst.length > 0)
            {
                if(creep.attack(targetst[0]) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targetst[0]);
                }
            }
        }
    },
    MineGuard: function(creep)
    {
        creep.say("mine");
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target)
        {
            if(creep.attack(target) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target);
            }
        }
        else
        {
 
            var targetst = creep.room.find(FIND_HOSTILE_STRUCTURES);
            if(targetst.length > 0)
            {
                if(creep.attack(targetst[0]) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targetst[0]);
                }
            }
        }
    } 
};
module.exports = roleguard;