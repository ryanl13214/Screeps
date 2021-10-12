var tower = {
    run: function(roomname, storagevalue)
    {
        var towers = Game.rooms[roomname].find(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return (s.structureType == STRUCTURE_TOWER);
            }
        });
        var woundedCreeps = Game.rooms[roomname].find(FIND_MY_CREEPS,
        {
            filter: (structure) => (structure.hits < structure.hitsMax)
        });
        var fullbuild = Game.rooms[roomname].find(FIND_STRUCTURES,
        {
            filter: (structure) => (structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_RAMPART) || (structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_WALL)
        });
        var tmp = 0;
        var value = 9999999999999999999;
        for(var i = 0; i < fullbuild.length; i++)
        {
            if(fullbuild[i].hits < value)
            {
                value = fullbuild[i].hits;
                tmp = i;
            }
        }
        var mainflag = Game.flags[roomname];
        var targetList = [];
        var allHosiles = mainflag.room.find(FIND_HOSTILE_CREEPS);
        for(var i = 0; i < allHosiles.length; i++)
        {
            var healcapacity = 0;
            var damagePotential = 0;
            var hostilehealers = allHosiles[i].pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            for(var j = 0; j < hostilehealers.length; j++)
            {
                if(hostilehealers[j].body.find(elem => elem.type === "heal") != undefined)
                {
                    for(var q = 0; q < hostilehealers[j].body.length; q++)
                    {
                        if(hostilehealers[j].body[q].type == HEAL)
                        {
                            var range = allHosiles[i].pos.getRangeTo(hostilehealers[j]);
                            if(range < 2)
                            {
                                healcapacity += 48;
                            }
                            else if(range < 4)
                            {
                                healcapacity += 16;
                            }
                        }
                    }
                }
            }
            var guards = allHosiles[i].pos.findInRange(FIND_MY_CREEPS, 3);
            for(var j = 0; j < guards.length; j++)
            {
                for(var q = 0; q < guards[j].body.length; q++)
                {
                    if(guards[j].body[q].type == RANGED_ATTACK)
                    {
                        var range = allHosiles[i].pos.getRangeTo(guards[j]);
                        if(range < 4)
                        {
                            if(guards[j].body[q].boost == "XKHO2")
                            {
                                damagePotential += 30;
                            }
                            else
                            {
                                damagePotential += 10;
                            }
                        }
                        else if(range < 4)
                        {
                            // todo deal with overflow from mass attack
                        }
                    }
                    if(guards[j].body[q].type == ATTACK)
                    {
                        var range = allHosiles[i].pos.getRangeTo(guards[j]);
                        if(range == 1)
                        {
                            if(guards[j].body[q].boost == "XUH2O")
                            {
                                damagePotential += 90;
                            }
                            else
                            {
                                damagePotential += 30;
                            }
                        }
                    }
                }
            }
            for(var l = 0; l < towers.length; l++)
            {
                var range = towers[l].pos.getRangeTo(allHosiles[i]);
                if(towers[l].effects != undefined && towers[l].effects.length > 0)
                {
                    if(towers[l].effects.length == 2)
                    {
                        var amount = TOWER_POWER_ATTACK;
                    }
                    else if(towers[l].effects.length == 1 && towers[l].effects[0] == PWR_OPERATE_TOWER)
                    {
                        var amount = TOWER_POWER_ATTACK * 1.4;
                    }
                    else if(towers[l].effects.length == 1 && towers[l].effects[0] == PWR_DISRUPT_TOWER)
                    {
                        var amount = TOWER_POWER_ATTACK / 2;
                    }
                }
                else
                {
                    var amount = TOWER_POWER_ATTACK;
                }
                if(range > TOWER_OPTIMAL_RANGE && range <= 20)
                {
                    damagePotential += 150;
                }
                else if(range < 20 && range > 10)
                {
                    damagePotential += amount * TOWER_FALLOFF * (range - TOWER_OPTIMAL_RANGE) / (TOWER_FALLOFF_RANGE - TOWER_OPTIMAL_RANGE);
                }
                else
                {
                    damagePotential += TOWER_POWER_ATTACK;
                }
            }
            var boostedTough = false;
            for(var q = 0; q < allHosiles[i].body.length; q++)
            {
                if(allHosiles[i].body[q].boost == "XGHO2" && allHosiles[i].body[q].hits != 0)
                {
                    boostedTough = true;
                }
            }
            if(boostedTough)
            {
                damagePotential = damagePotential * 0.3;
            }
            var nearVBorder = false;
            if(allHosiles[i].pos.x < 3 || allHosiles[i].pos.x > 47 || allHosiles[i].pos.y < 3 || allHosiles[i].pos.y > 47)
            {
                healcapacity += 1500;
            }
            if(allHosiles[i].pos.x < 4 || allHosiles[i].pos.x > 46 || allHosiles[i].pos.y < 4 || allHosiles[i].pos.y > 46)
            {
                nearVBorder = true;
            }
            
            if(healcapacity < damagePotential || (nearVBorder == false && Game.rooms[roomname].controller.safeMode > 1))
            {
                targetList.push(allHosiles[i]);
            }
        }
      
        /////////////////////////////
        var woundedPowerCreeps = Game.rooms[roomname].find(FIND_MY_POWER_CREEPS,
        {
            filter: (structure) => (structure.hits < structure.hitsMax)
        });
        for(var i = 0; i < towers.length; i++)
        {
            var doretos = towers[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS,
            {
                filter: (c) =>
                {
                    return (c.owner.username == "Invader");
                }
            });
            var closestDamagedStructure = towers[i].pos.findInRange(FIND_STRUCTURES, 9,
            {
                filter: (structure) => (structure.hits < structure.hitsMax * 0.1) && structure.structureType != STRUCTURE_WALL
            });
            if(woundedCreeps.length != 0 && i == 0)
            {
                towers[i].heal(woundedCreeps[0]);
            }
            else if(woundedPowerCreeps.length != 0)
            {
                towers[i].heal(woundedPowerCreeps[0]);
            }
            else if(targetList.length != 0) // make limiter to ensure tower draining doesnt work 
            {
                towers[i].attack(targetList[0]);
            }
            else if(doretos != undefined) // make limiter to ensure tower draining doesnt work 
            {
                towers[i].attack(doretos);
            }
            else if(closestDamagedStructure.length != 0 && towers[i].store.getUsedCapacity() > 200 && towers[i].room.controller.level > 3 && Game.rooms[roomname].storage.store.getUsedCapacity("energy") > 10000)
            {
                towers[i].repair(closestDamagedStructure[0]);
            }
            else if(fullbuild.length != 0 && towers[i].room.controller.level > 3 && Game.rooms[roomname].storage != undefined && Game.rooms[roomname].storage.store.getUsedCapacity("energy") > 10000)
            {
                towers[i].repair(fullbuild[tmp]);
            }
        }
    }
}
module.exports = tower;