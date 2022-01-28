var tower = {
 
    run: function(roomname, storagevalue)
    {
        var allHosiles = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS);
        var towers = Game.rooms[roomname].find(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return (s.structureType == STRUCTURE_TOWER);
            }
        });
        var woundedCreeps = Game.rooms[roomname].find(FIND_MY_CREEPS,
        {
            filter: (creep) => (creep.hits < creep.hitsMax)
        });
        
        Game.rooms[roomname].find(FIND_MY_CREEPS,
        {
            filter: (creep) => (creep.hits < creep.hitsMax)
        });
        
        var fullbuild = Game.rooms[roomname].find(FIND_STRUCTURES,
        {
            filter: (structure) => (structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_RAMPART)
        });
        var tmp = 0;
        var value = 9999999999999999999;
        for (var i = 0; i < fullbuild.length; i++)
        {
            if (fullbuild[i].hits < value)
            {
                value = fullbuild[i].hits;
                tmp = i;
            }
        }
        var mainflag = Game.flags[roomname];
        var targetList = [];

        for (var i = 0; i < allHosiles.length; i++)
        {
            var healcapacity = 0;
            var damagePotential = 0;
            var hostilehealers = allHosiles[i].pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            for (var j = 0; j < hostilehealers.length; j++)
            {
                if (hostilehealers[j].body.find(elem => elem.type === "heal") != undefined)
                {
                    for (var q = 0; q < hostilehealers[j].body.length; q++)
                    {
                        if (hostilehealers[j].body[q].type == HEAL)
                        {
                            var range = allHosiles[i].pos.getRangeTo(hostilehealers[j]);
                            if (range < 2)
                            {
                                healcapacity += 48;
                            }
                            else if (range < 4)
                            {
                                healcapacity += 16;
                            }
                        }
                    }
                }
            }
            var guards = allHosiles[i].pos.findInRange(FIND_MY_CREEPS, 3);
            for (var j = 0; j < guards.length; j++)
            {
                for (var q = 0; q < guards[j].body.length; q++)
                {
                    if (guards[j].body[q].type == RANGED_ATTACK)
                    {
                        var range = allHosiles[i].pos.getRangeTo(guards[j]);
                        if (range < 4)
                        {
                            if (guards[j].body[q].boost == "XKHO2")
                            {
                                damagePotential += 30;
                            }
                            else
                            {
                                damagePotential += 10;
                            }
                        }
                        else if (range < 4)
                        {
                            // todo deal with overflow from mass attack
                        }
                    }
                    if (guards[j].body[q].type == ATTACK)
                    {
                        var range = allHosiles[i].pos.getRangeTo(guards[j]);
                        if (range == 1)
                        {
                            if (guards[j].body[q].boost == "XUH2O")
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
            for (var l = 0; l < towers.length; l++)
            {
                if (towers[l].store.getUsedCapacity("energy") > 50)
                {
                    var range = towers[l].pos.getRangeTo(allHosiles[i]);
                    if (towers[l].effects != undefined && towers[l].effects.length == 2)
                    {
                        var amount = TOWER_POWER_ATTACK;
                    }
                    else if (towers[l].effects != undefined && towers[l].effects.length == 1 && towers[l].effects[0] == PWR_OPERATE_TOWER)
                    {
                        var amount = TOWER_POWER_ATTACK * 1.4;
                    }
                    else if (towers[l].effects != undefined && towers[l].effects.length == 1 && towers[l].effects[0] == PWR_DISRUPT_TOWER)
                    {
                        var amount = TOWER_POWER_ATTACK / 2;
                    }
                    else
                    {
                        var amount = TOWER_POWER_ATTACK;
                    }

                    if (range < 20 && range > 5)
                    {
                        damagePotential += amount * TOWER_FALLOFF * (range - TOWER_OPTIMAL_RANGE) / (TOWER_FALLOFF_RANGE - TOWER_OPTIMAL_RANGE);
                    }
                    if (range < 5)
                    {
                        damagePotential += amount
                    }
                    if (range > 19)
                    {

                        if (towers[l].effects != undefined && towers[l].effects.length == 1 && towers[l].effects[0] == PWR_OPERATE_TOWER)
                        {
                            damagePotential += 210
                        }
                        else if (towers[l].effects != undefined && towers[l].effects.length == 1 && towers[l].effects[0] == PWR_DISRUPT_TOWER)
                        {
                            damagePotential += 75
                        }
                        else
                        {
                            damagePotential += 150
                        }

                    }

                }

            }
var unmodifiedDamage = damagePotential;
            var boostedTough = false;
            for (var q = 0; q < allHosiles[i].body.length; q++)
            {
                if (allHosiles[i].body[q].boost == "XGHO2" && allHosiles[i].body[q].hits != 0)
                {
                    if(healcapacity >= 100)
                    {
                           damagePotential  = damagePotential - 333;
                         healcapacity -= 100;
                    }
                }
            }
            
            
        new RoomVisual(roomname).text(damagePotential,  allHosiles[i].pos.x - 0.5,  allHosiles[i].pos.y  , {align: 'left',color: 'blue'}); 
           
             new RoomVisual(roomname).text(healcapacity,  allHosiles[i].pos.x - 0.5,  allHosiles[i].pos.y +  0.5, {align: 'left',color: 'green'}); 
           
            if (healcapacity  + 100 < damagePotential)
            {
                targetList.push(allHosiles[i]);
            }
        }

        /////////////////////////////
        var woundedPowerCreeps = Game.rooms[roomname].find(FIND_MY_POWER_CREEPS,
        {
            filter: (structure) => (structure.hits < structure.hitsMax)
        });

        for (var i = 0; i < towers.length; i++)
        {
            var doretos = towers[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS,
            {
                filter: (c) =>
                {
                    return (c.owner.username == "Invader");
                }
            });

            var closestcreep = towers[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS)
 var closestcreeploist = towers[i].room.find(FIND_HOSTILE_CREEPS)

            var closestDamagedStructurelow = towers[i].room.find(FIND_STRUCTURES,
            {
                filter: (structure) => ((structure.hits < 4000000) && structure.structureType == STRUCTURE_RAMPART)
            });

            var soloNeedingHeal = towers[i].room.find(FIND_MY_CREEPS,
            {
                filter: (creep) => (creep.memory.role == "guard" && creep.memory.attackrole == "solochaser")
            });

            var soloNeedsHeal = false;
            if (soloNeedingHeal.length != 0)
            {

                var soloNeedingHeal2 = soloNeedingHeal[0].pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                if (soloNeedingHeal2.length != 0)
                {
                    soloNeedsHeal = true;
                }
            }
              if (soloNeedsHeal == true )
            {
                     var healingRecuitred =  soloNeedingHeal[0].memory.damagetakenThisTick
            }else{
                 var healingRecuitred  = 0;
            }
            
            
            
            

            if (soloNeedsHeal == true && healingRecuitred > 0)
            {
                
                 soloNeedingHeal[0].memory.damagetakenThisTick =- Math.floor(unmodifiedDamage*0.66)
                towers[i].heal(soloNeedingHeal[0]);
                
            }
             else if (soloNeedsHeal == true &&  soloNeedingHeal[0].memory.combatStruct != undefined && soloNeedingHeal[0].memory.combatStruct.currentTarget  != undefined)
            {
                  var memtarg = Game.getObjectById(soloNeedingHeal[0].memory.combatStruct.currentTarget)

                  towers[i].attack(memtarg);
                
            }

            else if (Game.rooms[roomname].controller.safeMode != undefined && closestcreep != undefined && Game.rooms[roomname].controller.level != 8)
            {
                towers[i].attack(closestcreep);
            }

            else if (woundedCreeps.length != 0 && i == 1) // add ability for creeps to call in heals 
            {
                towers[i].heal(woundedCreeps[0]);
            }
            else if (woundedPowerCreeps.length != 0)
            {
                towers[i].heal(woundedPowerCreeps[0]);
            }
            else if (targetList.length != 0 && Game.rooms[roomname].controller.safeMode == undefined) // make limiter to ensure tower draining doesnt work 
            {
                towers[i].attack(targetList[0]);
            }
            else if (doretos != undefined) // make limiter to ensure tower draining doesnt work 
            {
                towers[i].attack(doretos);
            }

            else if (closestDamagedStructurelow.length != 0 && allHosiles.length == 0 && towers[i].store.getUsedCapacity("energy") > 500 && storagevalue > 105000)
            {
                towers[i].repair(fullbuild[tmp]);
            }

        }
    }
}
module.exports = tower;