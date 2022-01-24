var guardChasedown = {
    /** @param {Creep} creep **/
       run: function(creep)
    {
        if (creep.memory.movementIsFree == undefined)
        {
            creep.memory.movementIsFree = true;
        }

        var target = creepfunctions.getcombattagetsclosest(creep);
        if (target != undefined && target.body.length == 50 && creep.memory.memstruct.spawnRoom == creep.room.name && creep.memory.memstruct.boosted == false)
        {
            //     this.archer(creep);
        }
        else
        {

            if (target == undefined)
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
            if (target == undefined && 1 == 2)
            {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_INVADER_CORE || structure.structureType == STRUCTURE_TOWER);
                    }
                });
                if (target == undefined)
                {
                    target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_TOWER);
                        }
                    });
                    if (target == undefined)
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
            if (range == 1)
            {
                creep.rangedMassAttack();
                creep.attack(target);
            }
            else if (range < 4)
            {
                if (creep.body.find(elem => elem.type === "heal") != undefined) // pre-heal
                {
                    creep.heal(creep);
                }
                creep.rangedAttack(target);
            }
            else
            {
                if (creep.body.find(elem => elem.type === "heal") != undefined && creep.hits < creep.hitsMax)
                {
                    creep.heal(creep);
                }
            }
            if (creep.memory.movementIsFree == true)
            {
                creep.moveTo(target);
            }
            else
            {
                var DuoPartner = Game.getObjectById(creep.memory.movementIsFree);
                creep.moveTo(DuoPartner);
                creep.memory.movementIsFree = true;
            }
          
        }
               this.recycleboost(creep)
    } ,
       recycleboost: function(creep)
    {
        if (creep.ticksToLive < 60)
        {
            var mainflag = creep.room.storage;
            if (mainflag)
            {
                var targpos = new RoomPosition(mainflag.pos.x - 4, mainflag.pos.y + 3, creep.room.name)

                var lab = targpos.findInRange(FIND_STRUCTURES, 1,
                {
                    filter: (res) =>
                    {
                        return (res.structureType == STRUCTURE_LAB && res.cooldown < 10);
                    }
                });

                var targpos2 = new RoomPosition(mainflag.pos.x - 4, mainflag.pos.y - 1, creep.room.name)

                var lab2 = targpos2.findInRange(FIND_STRUCTURES, 1,
                {
                    filter: (res) =>
                    {
                        return (res.structureType == STRUCTURE_LAB && res.cooldown < 10);
                    }
                });

                if (lab.length != 0)
                {
                    if (targpos.x != creep.pos.x || targpos.y != creep.pos.y)
                    {
                        creep.moveTo(targpos);
                    }
                    else if (targpos.x == creep.pos.x && targpos.y == creep.pos.y)
                    {
                        lab[0].unboostCreep(creep);
                    }
                }
                else if (lab2.length != 0)
                {
                    if (targpos2.x != creep.pos.x || targpos2.y != creep.pos.y)
                    {
                        creep.moveTo(targpos2);
                    }
                    else if (targpos2.x == creep.pos.x && targpos2.y == creep.pos.y)
                    {
                        lab2[0].unboostCreep(creep);
                    }

                }

            }

        }
    },
 
};
module.exports = guardChasedown;