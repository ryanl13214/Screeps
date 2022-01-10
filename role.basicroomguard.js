var creepfunctions = require('prototype.creepfunctions');
var attackerCode = require('role.basicattacker');
var roleguard = {
    /** @param {Creep} creep **/
    SafeMove: function(creep, target, prio)
    {
        var path = creep.pos.findPathTo(target);
        // use the target finder for the displaced targets
        let goals = {
            pos: target,
            range: 0
        };
        let ret = PathFinder.search(
            creep.pos, target,
            {
                // We need to set the defaults costs higher so that we
                // can set the road cost lower in `roomCallback`
                plainCost: 1,
                swampCost: 5,
                roomCallback: function(roomName)
                {
                    let room = creep.room;
                    if (!room) return;
                    let costs = new PathFinder.CostMatrix;
                    var terrain = new Room.Terrain(roomName);

                    if (prio == 0)
                    {
                        room.find(FIND_MY_CREEPS).forEach(function(cre)
                        {
                            costs.set(cre.pos.x, cre.pos.y, 0xff);
                        });
                    }

                    room.find(FIND_HOSTILE_CREEPS).forEach(function(cre)
                    {
                        for (var xx = -3; xx < 3; xx++)
                        {
                            for (var yy = -3; yy < 3; yy++)
                            {
                                costs.set(cre.pos.x + xx, cre.pos.y + yy, 25);
                            }
                        }
                    });
                    room.find(FIND_MY_STRUCTURES).forEach(function(struct)
                    {
                        if ((struct.structureType == STRUCTURE_RAMPART && struct.my))
                        {
                            costs.set(struct.pos.x, struct.pos.y, 1);
                        }
                    });
                    room.find(FIND_MY_POWER_CREEPS).forEach(function(cre)
                    {
                        costs.set(cre.pos.x, cre.pos.y, 0xff);
                    });

                    room.find(FIND_MY_CREEPS).forEach(function(cre)
                    {
                        costs.set(cre.pos.x, cre.pos.y, 9);
                    });

                    room.find(FIND_STRUCTURES).forEach(function(struct)
                    {
                        if (struct.structureType !== STRUCTURE_CONTAINER && struct.structureType !== STRUCTURE_ROAD && (struct.structureType !== STRUCTURE_RAMPART || !struct.my))
                        {
                            costs.set(struct.pos.x, struct.pos.y, 0xff);
                        }
                    });

                    return costs;
                },
            }
        );
        var pos = ret.path[0];
        creep.say("a");

        if (prio == 0)
        {
            var col = "blue"
        }
        else
        {
            var col = "red"
        }

        for (var xx = 0; xx < ret.path.length; xx++)
        {
            Game.rooms[creep.room.name].visual.circle(ret.path[xx].x, ret.path[xx].y,
            {
                fill: 'transparent',
                radius: 0.1,
                stroke: col
            });
        }
        if (prio == 1 && ret.path.length != 0)
        {

            var found = ret.path[0].lookFor(LOOK_CREEPS);

            if (found.length != 0)
            {

                found[0].moveTo(creep)
            }
        }

        return creep.moveTo(pos);
    },
    recycleboost: function(creep)
    {
        if (creep.ticksToLive < 60)
        {
            var mainflag = creep.room.storage;
            if (mainflag)
            {
                var targpos = new RoomPosition(mainflag.pos.x - 4, mainflag.pos.y - 1, creep.room.name)
                if (targpos.x != creep.pos.x || targpos.y != creep.pos.y)
                {
                    creep.moveTo(targpos);
                }
                else if (targpos.x == creep.pos.x && targpos.y == creep.pos.y)
                {
                    var lab = creep.pos.findInRange(FIND_STRUCTURES, 1,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_LAB && res.cooldown == 0);
                        }
                    });
                    if (lab.length != 0)
                    {
                        lab[0].unboostCreep(creep);
                        //   creep.suicide();
                    }
                    else
                    {
                        //     creep.suicide();
                    }
                }
            }
        }
    },
    decideMassAttack: function(creep)
    {
        var enemiesInRange = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
        var structuresInRange = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
        var enemiesInRange2 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 2);
        var structuresInRange2 = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 2);
        var enemiesInRange3 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        var structuresInRange3 = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);

        var counter = 0;
        counter += enemiesInRange.length * 10;
        counter += structuresInRange.length * 10;
        counter += enemiesInRange2.length * 4;
        counter += structuresInRange2.length * 4;
        counter += enemiesInRange3.length;
        counter += structuresInRange3.length;

        if (counter > 10)
        {
            creep.memory.damageThisTick = counter;
            return true;
        }
        else
        {
            creep.memory.damageThisTick = 10;
            return false;
        }

        return true;
    },
    handleattacks: function(creep)
    {
        var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        var decideMassAttack = this.decideMassAttack(creep);
        if (decideMassAttack)
        {
            creep.rangedMassAttack();
        }
        else if (targets.length > 0)
        {
            creep.rangedAttack(targets[0]);
        }
    },
    plunderCorridor: function(creep)
    {
        if (creep.body.find(elem => elem.type === "carry") != undefined)
        {
            var resourcesPot = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1,
            {
                filter: (res) =>
                {
                    return (res.resourceType == RESOURCE_METAL || res.resourceType == RESOURCE_SILICON || res.resourceType == RESOURCE_BIOMASS || res.resourceType == RESOURCE_MIST);
                }
            });
            if (resourcesPot.length != 0)
            {
                creep.pickup(resourcesPot[0]);
            }
        }
        if (creep.store.getUsedCapacity() != 0 && creep.ticksToLive < 200)
        {
            if (creep.memory.memstruct.spawnRoom != creep.room.name)
            {
                var temparr = [
                    ["forcemoveToRoom", creep.memory.memstruct.spawnRoom],
                    ["deposit"]
                ];
                for (var i = 0; i < creep.memory.memstruct.tasklist.length; i++)
                {
                    temparr.push(creep.memory.memstruct.tasklist[i]);
                }
                creep.memory.memstruct.tasklist = temparr;
            }
        }
        if (creep.store.getFreeCapacity() == 0)
        {
            if (creep.memory.memstruct.spawnRoom != creep.room.name)
            {
                var temparr = [
                    ["forcemoveToRoom", creep.memory.memstruct.spawnRoom],
                    ["deposit"]
                ];
                for (var i = 0; i < creep.memory.memstruct.tasklist.length; i++)
                {
                    temparr.push(creep.memory.memstruct.tasklist[i]);
                }
                creep.memory.memstruct.tasklist = temparr;
            }
        }
    },
    checkRuins: function(creep)
    {
        var resourcesPot = creep.room.find(FIND_RUINS,
        {
            filter: (res) =>
            {
                return (res.resourceType != RESOURCE_ENERGY);
            }
        });
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_TOWER);
            }
        });
        var target2 = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_INVADER_CORE);
            }
        });
        if ((resourcesPot.length != 0 && target == undefined) || (resourcesPot.length != 0 && target2 == undefined && creep.room.controller == undefined))
        {
            //  creepfunctions.summonHauler(creep.room.name, creep.memory.memstruct.spawnRoom);
            Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(
                [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL], 'powerspawnSupport2' + creep.name,
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: creep.memory.memstruct.spawnRoom,
                            tasklist: [
                                ["deposit"],
                                ["moveToRoom", creep.room.name],
                                ["gatherLooseResources"],
                                ["gatherstoredResources"],
                                ["moveToRoom", creep.memory.memstruct.spawnRoom],
                                ["deposit"],
                                ["repeat", 6]
                            ],
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: false,
                            hastask: false
                        }
                    }
                }
            );
        }
    },
    chaseDown: function(creep)
    {
        if (creep.memory.movementIsFree == undefined)
        {
            creep.memory.movementIsFree = true;
        }

        var target = creepfunctions.getcombattagetsclosest(creep);
        if (target != undefined && target.body.length == 50 && creep.memory.memstruct.spawnRoom == creep.room.name && creep.memory.memstruct.boosted == false)
        {
            this.archer(creep);
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
            if (target == undefined)
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
            creepfunctions.allowSlave(creep);
        }
    },

    archer: function(creep)
    {

        var closetarg = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var range = creep.pos.getRangeTo(closetarg);
        if (range > 4)
        {
            var target2 = creep.room.find(FIND_HOSTILE_CREEPS);
        }
        else
        {
            var target2 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
        }

        //    var target2 = creep.room.find(FIND_HOSTILE_CREEPS);
        var target;

        for (var i = 0; i < target2.length; i++)
        {
            var targets3 = target2[i].pos.findInRange(FIND_MY_CREEPS, 4,
            {
                filter: (creepacc) =>
                {
                    return (creepacc.memory.role == 'guard' && creep.id != creepacc.id);
                }
            });

            if (targets3.length == 0)
            {
                target = target2[i]

                creep.room.visual.line(creep.pos, target.pos,
                {
                    color: 'red',
                    lineStyle: 'dashed'
                });

            }

        }
        creep.say(target);

        if (!target)
        {
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        }

        //////////////////////////////// end of target selection 

        if (target)
        {
            creep.room.visual.line(creep.pos, target.pos,
            {
                color: 'red',
                lineStyle: 'dashed'
            });
            var ramparts = target.pos.findInRange(FIND_STRUCTURES, 3,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_RAMPART);
                }
            });
            var freeRamparts = [];
            for (var i = 0; i < ramparts.length; i++)
            {
                var psotiontaken = false;
                var targets2 = ramparts[i].pos.findInRange(FIND_MY_CREEPS, 0);
                if (targets2.length == 0)
                {
                    freeRamparts.push(ramparts[i]);
                }

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

            var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);

            var targetArr = creep.room.find(FIND_HOSTILE_CREEPS);

            if (creep.memory.isSafe == true && targets.length != 0)
            {

            }
            else if (freeRamparts.length != 0)
            {
                this.SafeMove(creep, freeRamparts[index].pos, 0)

            }

        }

        this.handleattacks(creep);
    },

    run: function(creep)
    {

        var rampartsa = creep.pos.findInRange(FIND_MY_STRUCTURES, 0,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_RAMPART);
            }
        });

        if (rampartsa.length == 0)
        {

            creep.memory.isSafe = false
        }
        else
        {

            creep.memory.isSafe = true
        }

        //   this.checkRuins(creep);
        this.plunderCorridor(creep)
        if (creepfunctions.checkglobaltasks(creep))
        {
            if (creep.memory.attackrole == "chasedown")
            {
                this.chaseDown(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (creep.memory.attackrole == "archer")
            {
                ////////////////////////////////  target selection 
                this.archer(creep)

            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (creep.memory.attackrole == "cavalry")
            {
                this.cavalry(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (creep.memory.attackrole == "mineguard")
            {
                this.MineGuard(creep);
            }
            else
            {
                attackerCode.run(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
        this.recycleboost(creep);
    },
    cavalry: function(creep)
    {
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

    },
    ranger: function(creep)
    {
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS,
        {
            filter: (c) =>
            {
                return (c.pos.x > 2 && c.pos.x < 48 && c.pos.y < 48 && c.pos.y > 2);
            }
        });
        if (target != undefined)
        {
            var range = creep.pos.getRangeTo(target);
            if (range < 4)
            {
                creep.rangedAttack(target);
            }
            if (range > 3)
            {
                creep.moveTo(target,
                {
                    reusePath: 10
                });
            }
            if (range < 3)
            {
                const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                creepfunctions.combatMove(creep, targetArr, target);
            }
        }
        else
        {
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
            {
                filter: (res) =>
                {
                    return (res.structureType != STRUCTURE_CONTAINER);
                }
            });
            if (target != undefined)
            {
                var range = creep.pos.getRangeTo(target);
                if (range < 4)
                {
                    creep.rangedAttack(target);
                }
                if (range > 3)
                {
                    creep.moveTo(target,
                    {
                        reusePath: 10
                    });
                }
            }
        }
        creep.heal(creep);
    },
    getParts: function(creep)
    {
        var target = creep.room.find(FIND_HOSTILE_CREEPS);
        var numberofguardingcreeps = _.filter(creepsinroom, (creep) => creep.memory.role == 'guard');
        var numberOfHealParts = 0;
        var numberOfAttackParts = 0;
        var numberOfRangedParts = 0;
        var totalBodyParts = 0;
        var numberOfworkParts = 0;
        for (var i = 0; i < target.length; i++)
        {
            for (var j = 0; j < target[i].body.length; j++)
            {
                if (target[i].body[j].type == HEAL)
                {
                    numberOfHealParts++;
                }
                if (target[i].body[j].type == ATTACK)
                {
                    numberOfAttackParts++;
                }
                if (target[i].body[j].type == RANGED_ATTACK)
                {
                    numberOfRangedParts++;
                }
                if (target[i].body[j].type == WORK)
                {
                    numberOfworkParts++;
                }
                totalBodyParts++;
            }
        }
    },
    MineGuard: function(creep)
    {
        creep.say("mine");
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target)
        {
            if (creep.attack(target) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target);
            }
        }
        else
        {
            var targetst = creep.room.find(FIND_HOSTILE_STRUCTURES);
            if (targetst.length > 0)
            {
                if (creep.attack(targetst[0]) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targetst[0]);
                }
            }
        }
    }
};
module.exports = roleguard;