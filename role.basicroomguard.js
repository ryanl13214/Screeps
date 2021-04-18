var creepfunctions = require('prototype.creepfunctions');
var roleguard = {
    /** @param {Creep} creep **/
    run: function(creep)
    {
        if(creepfunctions.checkglobaltasks(creep))
        {
            if(creep.memory.attackrole == "chasedown")
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
                                        
        if(creep.body.find(elem => elem.type === "heal") != undefined  ){
            creep.heal(creep);
            
        }
                        
                        creep.moveTo(target);
                        creep.rangedAttack(target);
                    }
                }
     
       if(creep.body.find(elem => elem.type === "heal") != undefined &&  creep.hits < creep.hitsMax && !target   ){
            creep.heal(creep);
            
        }
                
                
                creepfunctions.allowSlave(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "basicRoomRangedAttacker")
            {
                creep.heal(creep);
                var found = [];
                var flagsinrange = creep.pos.findInRange(FIND_FLAGS, 3);
                if(flagsinrange.length != 0)
                {
                    found = creep.room.lookForAt(LOOK_STRUCTURES, flagsinrange[0].pos);
                    if(found.length != 0)
                    {
                        //       found = creep.room.lookForAt(FIND_HOSTILE_STRUCTURES, flagsinrange[0].pos);
                    }
                }
                if(found.length != 0)
                {
                    var range = creep.pos.getRangeTo(found[0]);
                    if(range < 2)
                    {
                        creep.rangedMassAttack();
                    }
                    else
                    {
                        creep.rangedAttack(found[0]);
                    }
                }
                else
                {
                    creep.rangedMassAttack();
                    const target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_SPAWN);
                        }
                    });
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
                            path = creep.room.findPath(creep.pos, targetPos,
                            {
                                maxOps: 1000,
                                ignoreDestructibleStructures: true,
                                ignoreCreeps: true
                            });
                        }
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
                }
                //override mass attack to target creeps
                var hostilecreeps = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                for(var i = 0; i < hostilecreeps.length; i++)
                {
                    var ramparts = hostilecreeps[i].pos.findInRange(FIND_HOSTILE_STRUCTURES, 0);
                    if(ramparts.length == 0)
                    {
                        creep.rangedAttack(hostilecreeps[i]);
                    }
                }
                creepfunctions.allowSlave(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "basicRoomDIS")
            {
                var target = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType !=  STRUCTURE_STORAGE && res.structureType !=  STRUCTURE_TERMINAL &&  res.structureType !=  STRUCTURE_FACTORY    );
                        }
                    }
                
                
                );
                            if(target.length != 0)
                            {
                                creep.dismantle(target[0]);
                            }
                var found = [];
                var flagsinrange = creep.room.find(FIND_FLAGS);
                if(flagsinrange.length != 0)
                {
                    found = creep.room.lookForAt(LOOK_STRUCTURES, flagsinrange[0].pos);
                    if(found.length != 0)
                    {
                        //       found = creep.room.lookForAt(FIND_HOSTILE_STRUCTURES, flagsinrange[0].pos);
                    }
                }
                 
                if(found.length != 0)
                {
                    if(creep.dismantle(found[0]) == ERR_NOT_IN_RANGE)
                    {
                       
                        var findNewtarget = creep.moveTo(found[0]);
                        if(findNewtarget == -2)
                        {
                            var target = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                            if(target.length != 0)
                            {
                                creep.dismantle(target[0]);
                            }
                        }
                    }
                }
                else
                {
                    var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType ==  STRUCTURE_TOWER  );
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
                       //  var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                }
                    if(target != undefined)
                    {
                        if(creep.dismantle(target) == ERR_NOT_IN_RANGE)
                        {
                            creep.say("f");
                            var findNewtarget = creep.moveTo(target);
                            if(findNewtarget == -2)
                            {
                                var target = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                                if(target.length != 0)
                                {
                                    creep.dismantle(target[0]);
                                }
                            }
                        }
                        creep.moveTo(target);
                    }
                }
                creepfunctions.allowSlave(creep);
            }
              creep.say("a");
            if(creep.memory.attackrole == "archer")
            {
                creep.say("archer");
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var targetlist = creep.room.find(FIND_HOSTILE_CREEPS);
                var rangedpartsround = false;
                for(var i = 0; i < targetlist.length; i++)
                {
                    for(var j = 0; j < targetlist.length; j++)
                    {
                        if(targetlist[i].body[j].type == RANGED_ATTACK)
                        {
                            rangedpartsround = true;
                        }
                    }
                }
                if(target != undefined)
                {
                    var ramparts = target.pos.findInRange(FIND_STRUCTURES, 5,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_RAMPART);
                        }
                    });
                    var freeRamparts = [];
                    for(var i = 0; i < ramparts.length; i++)
                    {
                        var psotiontaken = false;
                        var targets2 = ramparts[i].pos.findInRange(FIND_MY_CREEPS, 0);
                        if(targets2.length != 0)
                        {
                            psotiontaken = true
                        }
                        else
                        {
                            freeRamparts.push(ramparts[i]);
                        }
                    }
                    var distance = 999999;
                    var index = 9999;
                    for(var i = 0; i < freeRamparts.length; i++)
                    {
                        var range = freeRamparts[i].pos.getRangeTo(target);
                        if(range < distance)
                        {
                            distance = range;
                            index = i;
                            // console.log(distance);
                        }
                    }
                    creep.say(distance);
                    const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                    var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                    var targetsformove = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
                    var targets3 = creep.pos.findInRange(FIND_STRUCTURES, 0,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_RAMPART);
                        }
                    });
                    if(freeRamparts.length != 0)
                    {
                        if(targets3.length == 0 || targetsformove.length == 0)
                        { // need to move to closest rampart this stops when in range 
                            creep.moveTo(freeRamparts[index].pos);
                        }
                    }
                    var targetsclose = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                    if(targetsclose.length > 0)
                    {
                        creep.attack(targets[0]);
                    }
                    var targetscloseby = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                    try
                    {
                        if(targets.length > 0 && targetscloseby < 2)
                        {
                            creep.rangedAttack(targets[0]);
                        }
                        else
                        {
                            creep.rangedMassAttack();
                        }
                    }
                    catch (e)
                    {
                        creep.say("attack");
                        this.attacker(creep);
                    }
                }
                if(rangedpartsround == false || freeRamparts.length == 0)
                { // add a distance from main flag
                    //    creep.say("im a ranger baby");
                    //    this.ranger(creep);
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
            if(creep.memory.attackrole == "cavalry")
            {
                //  creep.say("f.length");
                // console.log("d");
                const closetarget = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var targetlist = creep.room.find(FIND_HOSTILE_CREEPS);
                if(closetarget != undefined)
                {
                    var ramparts = closetarget.pos.findInRange(FIND_STRUCTURES, 2,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_RAMPART);
                        }
                    });
                    var freeRamparts = [];
                    for(var i = 0; i < ramparts.length; i++)
                    {
                        var psotiontaken = false;
                        var targets2 = ramparts[i].pos.findInRange(FIND_MY_CREEPS, 0); // not itself
                        // console.log(targets2);
                        //  console.log(creep);
                        //  creep.say(targets2 == creep);
                        if(targets2.length != 0 && targets2 != creep)
                        {
                            psotiontaken = true
                        }
                        else
                        {
                            freeRamparts.push(ramparts[i]);
                        }
                    }
                    creep.say(freeRamparts.length);
                    var distance = 999999;
                    var index = 9999;
                    for(var i = 0; i < freeRamparts.length; i++)
                    {
                        var range = freeRamparts[i].pos.getRangeTo(closetarget);
                        if(range < distance)
                        {
                            distance = range;
                            index = i;
                            //console.log(distance);
                        }
                    }
                    if(freeRamparts.length != 0)
                    {
                        var targetsincurrrange = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                        var targetsformove = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 2);
                        var creepRangeToClosestsFreeRampart = freeRamparts[index].pos.getRangeTo(creep);
                        if(targetsformove.length == 0 || creep.hits < creep.hitsMax)
                        { // need to move to closest rampart this stops when in range 
                            creep.moveTo(freeRamparts[index].pos);
                        }
                        if(creep.hits == creep.hitsMax && creepRangeToClosestsFreeRampart < 1)
                        {
                            creep.moveTo(closetarget);
                        }
                        else
                        {
                            creep.say("else");
                        }
                        if(targetsincurrrange != undefined)
                        {
                            creep.attack(targetsincurrrange[0]);
                        }
                    }
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
            if(creep.memory.attackrole == "attacker")
            {
                this.attacker(creep);
                creepfunctions.allowSlave(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "ranger")
            {
                this.ranger(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "mineguard")
            {
                this.MineGuard(creep);
            }
            //////////////////////////////////////USE ONLY FOR CORRIDOR MINES !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            if(creep.memory.attackrole == "healer")
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
        if(target != undefined)
        {
            var range = creep.pos.getRangeTo(target);
            if(range < 4)
            {
                creep.rangedAttack(target);
            }
            if(range > 3)
            {
                creep.moveTo(target,
                {
                    reusePath: 10
                });
            }
            if(range < 3)
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
            if(target != undefined)
            {
                var range = creep.pos.getRangeTo(target);
                if(range < 4)
                {
                    creep.rangedAttack(target);
                }
                if(range > 3)
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