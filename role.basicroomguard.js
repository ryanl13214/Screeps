var creepfunctions = require('prototype.creepfunctions');
var roleguard = {
    /** @param {Creep} creep **/
    run: function(creep)
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
            if (range > 3)
            {
                creep.moveTo(target);
                
            }
             if (range < 3)
                {
                    creepfunctions.combatMove(creep, targetArr, target);
                }
        }
    }
};
module.exports = roleguard;