var guardSword = {
    /** @param {Creep} creep **/
    run: function(creep)
    {

        var creepername = creep.name.substring(0, 4);
        if (creepername == "solo" && Game.time % 50 == 0)
        {
            creep.memory.attackrole = "solochaser"
        }

        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target)
        {
            var ramparts = target.pos.findInRange(FIND_STRUCTURES, 1,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_RAMPART);
                }
            });
            var freeRamparts = [];
            for (var i = 0; i < ramparts.length; i++)
            {

                freeRamparts.push(ramparts[i]);

            }
            var distance = 999999;
            var index = 9999;
            for (var i = 0; i < freeRamparts.length; i++)
            {
                var range = freeRamparts[i].pos.getRangeTo(target);
                if (range < distance)
                {
                    distance = range;
                    index = i;
                }
            }
            var targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
            var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            if (freeRamparts.length != 0)
            {
                var range = creep.pos.getRangeTo(target);
                if (range > 0)
                {
                    var moveValue = this.SafeMove(creep, freeRamparts[index].pos, 1);
                    creep.room.visual.line(creep.pos, freeRamparts[index].pos,
                    {
                        color: 'red',
                        lineStyle: 'dashed'
                    });
                    creep.say(moveValue);

                }
            }
        }
        else
        {
            var ramparts = creep.pos.findInRange(FIND_STRUCTURES, 3,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_RAMPART);
                }
            });

            var targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
            if (ramparts.length != 0 && targetArr.length == 0)
            {
                var range = creep.pos.getRangeTo(ramparts[0]);
                if (range < 4)
                {
                    creep.moveTo(ramparts[0]);
                }
            }

        }

        var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
        if (targets.length > 0)
        {
            creep.attack(targets[0]);
        }
       this.recycleboost(creep)
    },
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
module.exports = guardSword;