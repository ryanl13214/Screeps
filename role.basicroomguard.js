var creepfunctions = require('prototype.creepfunctions');
var roleguard = {
    /** @param {Creep} creep **/
    run: function(creep)
    {
        if (creepfunctions.checkglobaltasks(creep))
        {
            if (creep.memory.attackrole == "basicattacker")
            {
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (target)
                {
                    if (creep.attack(target) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                }else{
                    
                    
                        var targetst = creep.room.find(FIND_HOSTILE_STRUCTURES,{
                    filter: (s) =>
                    {
                        return (s.structureType == STRUCTURE_SPAWN);
                    }
                });
                if (targetst.length > 0)
                {
                       if (creep.attack(targetst[0]) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(targetst[0]);
                    }
                }
                    
                    
                    
                }
                
                
                
                
                
                
                
                
                
                
                
                
            }
            if (creep.memory.attackrole == "basicranger")
            {
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                const targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                if (targets.length > 0)
                {
                    creep.rangedAttack(targets[0]);
                }
                const range = creep.pos.getRangeTo(target);
                if (range > 2)
                {
                    creep.moveTo(target);
                }
                if (range < 3)
                {
                    creepfunctions.combatMove(creep, targetArr, target);
                }
            }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (creep.memory.attackrole == "roomAbuser")
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
                if (targets.length > 0)
                {
                    creep.say("attack");
                     
                    //creep.rangedAttack(targets[0]);
                }
                
                if (targetst.length != 0 && creep.hits == creep.hitsMax)
                {
                    creep.say("position 1");
                    creep.moveTo(new RoomPosition(48, 25, creep.room.name));
                }
                
                if (creep.hits != creep.hitsMax)
                {
                    if (targetst.length == 0)
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
                else if (creep.hits == creep.hitsMax && targetst.length == 0)
                {
                    creep.moveTo(new RoomPosition(0, 25, creep.room.name));
                }
               //  creep.rangedMassAttack();
                  creep.say(targets.length );
                  if (targets.length > 0)
                {
                    creep.say("attack");
                     
                    creep.rangedAttack(targets[0]);
                }
            }
                
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            
            if (creep.memory.attackrole == "basicHealer")
            {
                const target = creep.pos.findClosestByRange(FIND_MY_CREEPS,
                {
                    filter: function(object)
                    {
                        return object.hits < object.hitsMax;
                    }
                });
                if (target)
                {
                    if (creep.heal(target) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                }
            }
            
            
            
            
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
            
            
            
            
            
            if (creep.memory.attackrole == "rangerhealer")
            {
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                const targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                if (targets.length > 0)
                {
                    creep.rangedAttack(targets[0]);
                }
                
                if (creep.hits < creep.hitsMax )
                {
                    creep.heal(creep);
                }
                
                
                const range = creep.pos.getRangeTo(target);
                if (range > 2 && creep.hits + 300 > creep.hitsMax)
                {
                    creep.moveTo(target);
                }
                if (range < 3 || (creep.hits + 300 < creep.hitsMax && range < 5) )
                {
                    creepfunctions.combatMove(creep, targetArr, target);
                }
        
                
                
            }
            
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
            
            
            
            
            
            
            
            
        }
    }
};
module.exports = roleguard;