var creepfunctions = require('prototype.creepfunctions');
var roleguard = {
    /** @param {Creep} creep **/
    
    
    run: function(creep)
    {
        if(creepfunctions.checkglobaltasks(creep))
        {
            if(creep.memory.attackrole == "roomDismantleOuterBunker")
            {
                creep.rangedMassAttack();
                var targlist = [];
                var targlist2 = [];
                var target = creep.room.find(FIND_SOURCES);
                
                if(target.length == 2)
                {
                    targlist2 = target[0].pos.findInRange(FIND_HOSTILE_STRUCTURES, 3,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_LINK );
                        }
                    });
                    
                  
                    
                    targlist = target[1].pos.findInRange(FIND_HOSTILE_STRUCTURES, 3,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_LINK );
                        }
                    });
                    
                    
                    
                    
                     if(targlist.length == 0)
                    {
                        targlist = target[1].pos.findInRange(FIND_HOSTILE_POWER_CREEPS, 3);
                    }
                    
                    
                    
                    if(targlist.length == 0)
                    {
                        targlist = target[1].pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                    }
                    if(targlist2.length == 0)
                    {
                        targlist2 = target[0].pos.findInRange(FIND_HOSTILE_POWER_CREEPS, 3);
                    }
                    
                    
                    
                    if(targlist2.length == 0)
                    {
                        targlist2 = target[0].pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                    }
                    
                    
                    
                }
                 // creep.rangedMassAttack();
                // moveAvoidingThe damage areas
                if(targlist.length != 0)
                {
                    var range = creep.pos.getRangeTo(targlist[0]);
                    if(range < 2)
                    {
                        creep.rangedMassAttack();
                    }
                    else if(range < 4)
                    {
                        creep.rangedAttack(targlist[0]);
                    }else{
                  
                    }
                    
                    
                    
                    creep.heal(creep);
                    if(creep.memory.memstruct.tasklist.length == 0)
                    {
                        creep.memory.memstruct.tasklist.push(["moveToLooseinterRoom", targlist[0].pos.x, targlist[0].pos.y, creep.room.name]);
                    }
                }
                else if(targlist2.length != 0)
                {
                    
                    
                     var range = creep.pos.getRangeTo(targlist2[0]);
                    if(range < 2)
                    {
                        creep.rangedMassAttack();
                    }
                    else if(range < 4)
                    {
                        creep.rangedAttack(targlist2[0]);
                    }else{
                    creep.rangedMassAttack();
                    }
                    
                    
                    
                    
                    creep.heal(creep);
                    if(creep.memory.memstruct.tasklist.length == 0)
                    {
                        creep.memory.memstruct.tasklist.push(["moveToLooseinterRoom", targlist2[0].pos.x, targlist2[0].pos.y, creep.room.name]);
                    }
                }
                else{
                       var closestDuded = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                       if(closestDuded != undefined){
                           creep.moveTo(closestDuded);
                           
                       }
                        var range = creep.pos.getRangeTo(closestDuded);
                    if(range < 2)
                    {
                        creep.rangedMassAttack();
                    }
                    else if(range < 4)
                    {
                        creep.rangedAttack(closestDuded);
                    }
                       
                       
                }
                
                
                
                
                creepfunctions.allowSlave(creep);
            }
            if(creep.memory.attackrole == "basicRoomDIS")
            {
                 creep.rangedMassAttack();
                var target = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1,
                {
                    filter: (res) =>
                    {
                        return (res.structureType != STRUCTURE_STORAGE && res.structureType != STRUCTURE_TERMINAL && res.structureType != STRUCTURE_FACTORY);
                    }
                });
                if(target.length != 0)
                {
                    creep.dismantle(target[0]);
                }
                var found = [];
                var flagsinrange = creep.pos.findClosestByPath(FIND_FLAGS);
                if(flagsinrange  != undefined)
                {
                    found = creep.room.lookForAt(LOOK_STRUCTURES, flagsinrange.pos);
                    
                    
                    if( flagsinrange.pos.x == creep.pos.x   &&  flagsinrange.pos.x == creep.pos.x    &&  flagsinrange.pos.y  == creep.pos.y  &&  flagsinrange.pos.y == creep.pos.y){
                        flagsinrange.remove();
                    }else{
                        creep.moveTo(flagsinrange);
                    }
                    
                    
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
                            return (res.structureType == STRUCTURE_TOWER);
                        }
                    });
                    if(target == undefined)
                    {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (res) =>
                            {
                                return (res.structureType == STRUCTURE_SPAWN);
                            }
                        });
                    }
                    if(target == undefined)
                    {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (res) =>
                            {
                                return (res.structureType == STRUCTURE_NUKER);
                            }
                        });
                    }
                    if(target == undefined && 1 == 2)
                    {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (res) =>
                            {
                                return (res.structureType == STRUCTURE_TERMINAL);
                            }
                        });
                    }
                    if(target == undefined && 1 == 2)
                    {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (res) =>
                            {
                                return (res.structureType == STRUCTURE_STORAGE);
                            }
                        });
                    }
                    if(target == undefined && 1 == 2)
                    {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (res) =>
                            {
                                return (res.structureType == STRUCTURE_FACTORY);
                            }
                        });
                    }
                    if(target == undefined)
                    {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (res) =>
                            {
                                return (res.structureType == STRUCTURE_LAB);
                            }
                        });
                    }
                    if(target == undefined)
                    {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (res) =>
                            {
                                return (res.structureType == STRUCTURE_EXTENSION);
                            }
                        });
                    }
                    if(target == undefined)
                    {
                        //  var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                    }
                    if(target != undefined)
                    {
                        if(creep.dismantle(target) == ERR_NOT_IN_RANGE)
                        {
                           // creep.say("f");
                           // var findNewtarget = creep.moveTo(target);
                           // if(findNewtarget == -2)
                            //{
                            //    var target = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                          //      if(target.length != 0)
                         //  //     {
                         //           creep.dismantle(target[0]);
                         //       }
                         //   }
                          //   creep.moveTo(target);
                        }
                        
                    }
                }
                creepfunctions.allowSlave(creep);
            }
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
            if(creep.memory.attackrole == "basicRoomAttacker")
            {
                creep.heal(creep);
                var found = [];
                var flagsinrange = creep.pos.findInRange(FIND_FLAGS, 3);
                if(flagsinrange.length != 0)
                {
                    found = creep.room.lookForAt(LOOK_STRUCTURES, flagsinrange[0].pos);
                    if(found.length != 0)
                    {
                        found = creep.room.lookForAt(FIND_HOSTILE_STRUCTURES, flagsinrange[0].pos);
                    }
                }
                if(found.length != 0)
                {
                    creep.say(found);
                    creep.rangedAttack(found[0]);
                }
                else
                {
                    creep.rangedMassAttack();
                }
                var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (res) =>
                    {
                        return (res.structureType == STRUCTURE_TOWER);
                    }
                });
                if(target == undefined)
                {
                    var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_SPAWN);
                        }
                    });
                }
                if(target == undefined)
                {
                    var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_NUKER);
                        }
                    });
                }
                if(target == undefined && 1 == 2)
                {
                    var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_TERMINAL);
                        }
                    });
                }
                if(target == undefined && 1 == 2)
                {
                    var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_STORAGE);
                        }
                    });
                }
                if(target == undefined && 1 == 2)
                {
                    var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_FACTORY);
                        }
                    });
                }
                if(target == undefined)
                {
                    var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_LAB);
                        }
                    });
                }
                if(target == undefined)
                {
                    var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_EXTENSION);
                        }
                    });
                }
                if(target == undefined)
                {
                    //             var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                }
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
                        creep.say("?");
                        path = creep.room.findPath(creep.pos, targetPos,
                        {
                            maxOps: 1000,
                            ignoreDestructibleStructures: true,
                            ignoreCreeps: true
                        });
                    }
                    creep.say(path.length);
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
                creepfunctions.allowSlave(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            else if(creep.memory.attackrole == "attacker")
            {
                this.attacker(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            else if(creep.memory.attackrole == "ranger")
            {
                this.ranger(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            else if(creep.memory.attackrole == "healer")
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
            else if(creep.memory.attackrole == "roomAbuser")
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
                if(targets.length > 0)
                {
                    creep.say("attack");
                    //creep.rangedAttack(targets[0]);
                }
                if(targetst.length != 0 && creep.hits == creep.hitsMax)
                {
                    creep.say("position 1");
                    creep.moveTo(new RoomPosition(48, 25, creep.room.name));
                }
                if(creep.hits != creep.hitsMax)
                {
                    if(targetst.length == 0)
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
                else if(creep.hits == creep.hitsMax && targetst.length == 0)
                {
                    creep.moveTo(new RoomPosition(0, 25, creep.room.name));
                }
                //  creep.rangedMassAttack();
                creep.say(targets.length);
                if(targets.length > 0)
                {
                    creep.say("attack");
                    creep.rangedAttack(targets[0]);
                }
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(creep.memory.attackrole == "rangerhealer")
            {
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                const targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                if(targets.length > 0)
                {
                    creep.rangedAttack(targets[0]);
                }
                if(creep.hits < creep.hitsMax)
                {
                    creep.heal(creep);
                }
                const range = creep.pos.getRangeTo(target);
                if(range > 2 && creep.hits + 300 > creep.hitsMax)
                {
                    creep.moveTo(target);
                }
                if(range < 3 || (creep.hits + 300 < creep.hitsMax && range < 5))
                {
                    creepfunctions.combatMove(creep, targetArr, target);
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
        }
        creepfunctions.allowSlave(creep);
    },
    ranger: function(creep)
    {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
        const targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        if(targets.length > 0)
        {
            creep.rangedAttack(targets[0]);
        }
        const range = creep.pos.getRangeTo(target);
        if(range > 2)
        {
            creep.moveTo(target);
        }
        if(range < 3)
        {
            creepfunctions.combatMove(creep, targetArr, target);
        }
        try
        {
            creep.heal(creep);
        }
        catch (e)
        {}
    },
    attacker: function(creep)
    {
        if(creep.room.controller != undefined && creep.room.controller.owner != undefined && creep.room.controller.owner.username == "Q13214")
        {
            var mainflag = Game.flags[creep.room.name];
            var target = mainflag.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        }
        else
        {
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        }
        var range = creep.pos.getRangeTo(target);
        creep.say(range);
        if(target != undefined)
        {
            creep.moveTo(target);
            if(creep.attack(target) == ERR_NOT_IN_RANGE)
            {}
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
            var targetst = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
            if(targetst.length > 0)
            {
                creep.attack(targetst[0]);
            }
        }
        var targetst = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
        var targetst2 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
        if(targetst.length > 0 && targetst2.length == 0)
        {
            creep.attack(targetst[0]);
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