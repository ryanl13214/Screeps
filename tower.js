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
                var range = Math.max(Math.abs(allHosiles[i].pos.x - towers[l].pos.x), Math.abs(allHosiles[i].pos.y - towers[l].pos.y));
                var amount = TOWER_POWER_ATTACK;
                if(range > TOWER_OPTIMAL_RANGE)
                {
                    if(range > TOWER_FALLOFF_RANGE)
                    {
                        range = TOWER_FALLOFF_RANGE;
                    }
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
                if(allHosiles[i].body[q].boost == "XGHO2")
                {
                    boostedTough = true;
                }
            }
            if(boostedTough)
            {
                damagePotential = damagePotential * 0.3;
            }
      //      console.log("creeep heal capacity " + healcapacity + " damage " + damagePotential);
           
           
           
           if(allHosiles[i].pos.x< 3 ||   allHosiles[i].pos.x> 47 || allHosiles[i].pos.y< 3 ||   allHosiles[i].pos.y> 47 ){
        //       console.log(healcapacity);
               healcapacity+= 1500;
                //  console.log(healcapacity+" "+damagePotential);
           }
           
           
           
           
           
            if(healcapacity < damagePotential * 1.1  || Game.rooms[roomname].controller.safeMode > 1 || allHosiles[i].body.length < 25)
            {
                targetList.push(allHosiles[i]);
            }
        }
        //   console.log(JSON.stringify(targetList));
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
            else if(woundedPowerCreeps.length != 0  )
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