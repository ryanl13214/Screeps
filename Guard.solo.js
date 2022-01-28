var guardSolo = {
    /** @param {Creep} creep **/
        getDAMAGEpOTENTIAL: function(roomname)
    {

        var damagePotentialOfEnemysInROom = 0;
        var EnCreeps = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS );
        for (var j = 0; j < EnCreeps.length; j++)
        {
            for (var q = 0; q < EnCreeps[j].body.length; q++)
            {
                if (EnCreeps[j].body[q].type == RANGED_ATTACK)
                {

                    if (EnCreeps[j].body[q].boost == "XKHO2")
                    {
                        damagePotentialOfEnemysInROom += 40;
                    }
                    else
                    {
                        damagePotentialOfEnemysInROom += 10;
                    }

                }
                if (EnCreeps[j].body[q].type == ATTACK)
                {

                    if (EnCreeps[j].body[q].boost == "XUH2O")
                    {
                        damagePotentialOfEnemysInROom += 120;
                    }
                    else
                    {
                        damagePotentialOfEnemysInROom += 30;
                    }

                }
            }
        }

        return damagePotentialOfEnemysInROom
    },
    
            updateDamagepertick: function(creep)
    {

        var damagePotentialOfEnemysInROom = 0;
        var EnCreeps = creep.pos.findInRange(FIND_HOSTILE_CREEPS,3 );
        for (var j = 0; j < EnCreeps.length; j++)
        {
            for (var q = 0; q < EnCreeps[j].body.length; q++)
            {
                if (EnCreeps[j].body[q].type == RANGED_ATTACK)
                {

                    if (EnCreeps[j].body[q].boost == "XKHO2")
                    {
                        damagePotentialOfEnemysInROom += 40;
                    }
                    else
                    {
                        damagePotentialOfEnemysInROom += 10;
                    }

                }
           
            }
        }
        
        
        
        
        
        
        var EnCreeps = creep.pos.findInRange(FIND_HOSTILE_CREEPS,1 );
        for (var j = 0; j < EnCreeps.length; j++)
        {
            for (var q = 0; q < EnCreeps[j].body.length; q++)
            {
           
                if (EnCreeps[j].body[q].type == ATTACK)
                {

                    if (EnCreeps[j].body[q].boost == "XUH2O")
                    {
                        damagePotentialOfEnemysInROom += 120;
                    }
                    else
                    {
                        damagePotentialOfEnemysInROom += 30;
                    }

                }
            }
        }
        
        
        
        
        

        return damagePotentialOfEnemysInROom
    },
    
    run: function(creep)
    {
        creep.memory.damagetakenThisTick = this.updateDamagepertick(creep);
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_POWER_CREEPS,
        {

            filter: (res) =>
            {
                return (res.owner.username != 'Invader' && res.owner.username != 'Source Keeper');
            }

        });

        if (target == undefined)
        {
            var target2 = creep.room.find(FIND_HOSTILE_CREEPS);

            for (var xx = 0; xx < target2.length; xx++)
            {
                if (target == undefined)
                {
                    var closeattackers = target2[xx].pos.findInRange(FIND_HOSTILE_CREEPS, 1,
                    {

                        filter: (res) =>
                        {
                            return (res.body.filter(x => x === "attack").length > 20);
                        }
                    });

                    if (closeattackers.length == 0)
                    {
                        target = target2[xx]
                    }
                }

            }

        }

        //    var target = creepfunctions.getcombattagetsclosest(creep);
        var retarget = false
        if (creep.memory.combatStruct != undefined)
        {
            var memtarg = Game.getObjectById(creep.memory.combatStruct.currentTarget)

            if (memtarg == undefined || Game.time %50 ==0 )
            {
                retarget = true;
                creep.memory.combatStruct.currentStage == "int"
            }

        }

        if ((creep.memory.combatStruct == undefined && target != undefined) || (retarget && target != undefined)) // cvheck fro dead target ect missing 5+ticks
        {

            creep.memory.combatStruct = {
                currentTarget: target.id,
                currentStage: "int",
                BlockPosition: this.GetBlockPosition(creep, target)
            }

        }

        if (creep.memory.combatStruct)
        {

            try
            {
                creep.room.visual.circle(creep.memory.combatStruct.BlockPosition,
                {
                    fill: 'transparent',
                    radius: 0.55,
                    stroke: 'red'
                });
            }
            catch (e)
            {}
            if (creep.memory.combatStruct.currentStage == "int")
            {

                if (creep.memory.combatStruct.BlockPosition == false)
                {
                    creep.memory.combatStruct.currentStage = "close"
                }
                var memtarg = Game.getObjectById(creep.memory.combatStruct.currentTarget)

                if (memtarg)
                {
                    var range = memtarg.pos.getRangeTo(creep);

                    if (range < 4)
                    {
                        creep.memory.combatStruct.currentStage = "close"
                    }

                    if (creep.pos.x == creep.memory.combatStruct.BlockPosition.x && creep.pos.y == creep.memory.combatStruct.BlockPosition.y)
                    {
                        creep.memory.combatStruct.currentStage = "close"
                    }
                    else
                    {

                        this.solochaseavoidpath(creep, creep.memory.combatStruct.BlockPosition);

                    }
                }

            }

            if (creep.memory.combatStruct.currentStage == "close")
            {

                creep.rangedMassAttack();
                var range = creep.pos.getRangeTo(Game.getObjectById(creep.memory.combatStruct.currentTarget));

                var closestCreep = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);

                if (closestCreep.length != 0)
                {
                    creep.attack(closestCreep[0])
                    creep.memory.combatStruct.currentTarget = closestCreep[0].id
                }

                creep.moveTo(Game.getObjectById(creep.memory.combatStruct.currentTarget))

            }

        }

        if (creep.room.name != creep.memory.memstruct.spawnRoom)
        {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.memstruct.spawnRoom))
        }
        else
        {
            var range = creep.pos.getRangeTo(new RoomPosition(25, 25,  creep.memory.memstruct.spawnRoom));

            if (range >= 25)
            {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.memstruct.spawnRoom))
            }
        }
        creep.say(creep.memory.combatStruct.currentStage);
        
        var damagePotential = this.getDAMAGEpOTENTIAL(creep.room.name);
        if(damagePotential > 2000)
        {
            this.dontDie(creep)
        }
        this.recycleboost(creep)

    },
    GetBlockPosition: function(creep, targ)
    {

        if (creep.memory.edgeArray == undefined)
        {
            var result = [];
            var terrain = new Room.Terrain(creep.room.name);
            var roomanme = creep.room.name
            for (var xx = 0; xx < 50; xx++)
            {

                if (terrain.get(xx, 0) != TERRAIN_MASK_WALL)
                {
                    result.push(new RoomPosition(xx, 0, roomanme));

                }
                if (terrain.get(xx, 49) != TERRAIN_MASK_WALL)
                {
                    result.push(new RoomPosition(xx, 49, roomanme));

                }

                if (terrain.get(0, xx) != TERRAIN_MASK_WALL)
                {
                    result.push(new RoomPosition(0, xx, roomanme));

                }
                if (terrain.get(49, xx) != TERRAIN_MASK_WALL)
                {
                    result.push(new RoomPosition(49, xx, roomanme));

                }

                creep.memory.edgeArray = result;

            }

        }

        return this.getPosaitioncost(creep, targ)

    },
    dontDie: function(creep)
    {
// only do this if en damage potential is high 
        var towers = creep.room.find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_TOWER);
            }
        });

        var avgrange = 0;
        for (var xx = 0; xx < towers.length; xx++)
        {

            avgrange += creep.pos.getRangeTo(towers[xx])
        }

        var avgrangeacc = Math.floor(avgrange / towers.length)

        if (avgrangeacc > 17)
        {
            creep.moveTo(towers[0])
        }

        if (creep.room.storage)
        {

            if (creep.hits < creep.hitsMax)
            {

                creep.moveTo(Game.rooms[creep.memory.memstruct.spawnRoom].storage)

            }

        }

    },
    getPosaitioncost: function(creep, targ)
    {
        //      var path = creep.pos.findPathTo(target);
        // use the target finder for the displaced targets
        let goals = _.map(creep.memory.edgeArray, function(host)
        {
            return {
                pos: host,
                range: 5
            };
        });

        let ret = PathFinder.search(
            targ.pos, goals,
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
                    room.find(FIND_STRUCTURES).forEach(function(struct)
                    {
                        if (struct.structureType !== STRUCTURE_CONTAINER && struct.structureType !== STRUCTURE_ROAD)
                        {
                            costs.set(struct.pos.x, struct.pos.y, 0xff);
                        }
                    });

                    return costs;
                },
            }
        );

        if (ret.path.length > 3)
        {
            var pos = ret.path[3];

        }
        else
        {
            var pos = false;

        }
       
       
        return pos;

    },

    solochaseavoidpath: function(creep, target)
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

                    room.find(FIND_HOSTILE_CREEPS).forEach(function(cre)
                    {
                        for (var xx = -3; xx < 3; xx++)
                        {
                            for (var yy = -3; yy < 3; yy++)
                            {
                                costs.set(cre.pos.x + xx, cre.pos.y + yy, 245);
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
                        costs.set(cre.pos.x, cre.pos.y, 15);
                    });

                    room.find(FIND_STRUCTURES).forEach(function(struct)
                    {
                        if (struct.structureType !== STRUCTURE_CONTAINER && struct.structureType !== STRUCTURE_ROAD && (struct.structureType !== STRUCTURE_RAMPART || !struct.my))
                        {
                            costs.set(struct.pos.x, struct.pos.y, 0xff);
                        }
                    });
                    room.find(FIND_MY_CREEPS).forEach(function(cre)
                    {
                        costs.set(cre.pos.x, cre.pos.y, 0xff);
                    });
                    return costs;
                },
            }
        );
        var pos = ret.path[0];

        for (var xx = 0; xx < ret.path.length; xx++)
        {
            Game.rooms[creep.room.name].visual.circle(ret.path[xx].x, ret.path[xx].y,
            {
                fill: 'transparent',
                radius: 0.1,
                stroke: "red"
            });

            if (ret.path[xx].x == 0 || ret.path[xx].y == 0 || ret.path[xx].x == 50 || ret.path[xx].y == 50)
            {
                creep.memory.attackrole = "cavalry"
            }

        }
        if (ret.path.length != 0)
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
module.exports = guardSolo;