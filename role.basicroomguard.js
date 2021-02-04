var creepfunctions = require('prototype.creepfunctions');
var roleguard = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creepfunctions.checkglobaltasks(creep)) {
            if (creep.memory.attackrole == "archer") {
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var targetlist = creep.room.find(FIND_HOSTILE_CREEPS);
                var rangedpartsround = false;
                for (var i = 0; i < targetlist.length; i++) {
                    for (var j = 0; j < targetlist.length; j++) {
                        if (targetlist[i].body[j].type == RANGED_ATTACK) {
                            rangedpartsround = true;
                        }
                    }
                }
                if (target != undefined) {
                    var ramparts = target.pos.findInRange(FIND_STRUCTURES, 5, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_RAMPART);
                        }
                    });
                    var freeRamparts = [];
                    for (var i = 0; i < ramparts.length; i++) {
                        var psotiontaken = false;
                        var targets2 = ramparts[i].pos.findInRange(FIND_MY_CREEPS, 0);
                        if (targets2.length != 0) {
                            psotiontaken = true
                        } else {
                            freeRamparts.push(ramparts[i]);
                        }
                    }
                    var distance = 999999;
                    var index = 9999;
                    for (var i = 0; i < freeRamparts.length; i++) {
                        var range = freeRamparts[i].pos.getRangeTo(target);
                        if (range < distance) {
                            distance = range;
                            index = i;
                           // console.log(distance);
                        }
                    }
                    creep.say(distance);
                    const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                    var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                    var targetsformove = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
                    var targets3 = creep.pos.findInRange(FIND_STRUCTURES, 0, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_RAMPART);
                        }
                    });
                    if (freeRamparts.length != 0) {
                        if (targets3.length == 0 || targetsformove.length == 0) { // need to move to closest rampart this stops when in range 
                            creep.moveTo(freeRamparts[index].pos);
                        }
                    }
                    var targetsclose = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                    if (targetsclose.length > 0) {
                        creep.attack(targets[0]);
                    }
                    var targetscloseby = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                    try{
                    if (targets.length > 0 && targetscloseby < 2) {
                        creep.rangedAttack(targets[0]);
                    } else {
                        creep.rangedMassAttack();
                    }
                    }catch(e){
                        creep.say("attack");
                        this.attacker(creep);
                    }
                    
                }
                if (rangedpartsround == false || freeRamparts.length == 0) { // add a distance from main flag
                    //    creep.say("im a ranger baby");
                    //    this.ranger(creep);
                }
                if (creep.room.name != creep.memory.memstruct.spawnRoom) {
                    var targetRoomFlag = Game.flags[creep.memory.memstruct.spawnRoom];
                    var pos1 = creep.pos;
                    var pos2 = targetRoomFlag.pos;
                    const range = creep.pos.getRangeTo(targetRoomFlag.pos);
                    if (range > 23) { // might cause bug on nxt room wall 
                        creep.moveTo(targetRoomFlag.pos);
                    }
                }
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (creep.memory.attackrole == "cavalry") 
            {
     //  creep.say("f.length");
    // console.log("d");
      const closetarget = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var targetlist = creep.room.find(FIND_HOSTILE_CREEPS);
    
                if (closetarget != undefined) {
                    var ramparts = closetarget.pos.findInRange(FIND_STRUCTURES, 2, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_RAMPART);
                        }
                    });
     
                    var freeRamparts = [];
                    for (var i = 0; i < ramparts.length; i++) 
                    {
                        var psotiontaken = false;
                        var targets2 = ramparts[i].pos.findInRange(FIND_MY_CREEPS, 0);// not itself
                       // console.log(targets2);
                        //  console.log(creep);
                        //  creep.say(targets2 == creep);
                        if (targets2.length != 0 && targets2 != creep) 
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
                    for (var i = 0; i < freeRamparts.length; i++) {
                        var range = freeRamparts[i].pos.getRangeTo(closetarget);
                        if (range < distance) {
                            distance = range;
                            index = i;
                            //console.log(distance);
                        }
                    }
     
      if(freeRamparts.length != 0){
     
      
                    var targetsincurrrange = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                    var targetsformove = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 2);
                    
                 var creepRangeToClosestsFreeRampart =    freeRamparts[index].pos.getRangeTo(creep);
                 
                      if ( targetsformove.length == 0 || creep.hits < creep.hitsMax) { // need to move to closest rampart this stops when in range 
                            creep.moveTo(freeRamparts[index].pos);
                        }
                
     
                    
     if(creep.hits == creep.hitsMax && creepRangeToClosestsFreeRampart<1){
         creep.moveTo(closetarget);
     }else{
       creep.say("else");  
     }
     
      if (targetsincurrrange != undefined) {
       creep.attack(targetsincurrrange[0]);
     
      }
      }
     
     
     
     
     
     
     
     
     
     
     
                }
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
               if (creep.room.name != creep.memory.memstruct.spawnRoom) {
                    var targetRoomFlag = Game.flags[creep.memory.memstruct.spawnRoom];
                    var pos1 = creep.pos;
                    var pos2 = targetRoomFlag.pos;
                    const range = creep.pos.getRangeTo(targetRoomFlag.pos);
                    if (range > 23) { // might cause bug on nxt room wall 
                        creep.moveTo(targetRoomFlag.pos);
                    }
                }
     
     
     
     
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (creep.memory.attackrole == "attacker") {
                   this.attacker(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (creep.memory.attackrole == "ranger") {
                this.ranger(creep);
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (creep.memory.attackrole == "roomAbuser") {
                var targetsinsquare = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, {
                    filter: (s) => {
                        return (s.structureType == STRUCTURE_SPAWN);
                    }
                }, 4);
                var targets = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, {
                    filter: (s) => {
                        return (s.structureType == STRUCTURE_SPAWN);
                    }
                }, 3);
                var targetst = creep.room.find(FIND_HOSTILE_STRUCTURES);
                if (targets.length > 0) {
                    creep.say("attack");
                    //creep.rangedAttack(targets[0]);
                }
                if (targetst.length != 0 && creep.hits == creep.hitsMax) {
                    creep.say("position 1");
                    creep.moveTo(new RoomPosition(48, 25, creep.room.name));
                }
                if (creep.hits != creep.hitsMax) {
                    if (targetst.length == 0) {
                        creep.say("heal");
                        creep.moveTo(Game.flags["roomAbusePoint"].pos);
                    } else {
                        creep.say("back");
                        creep.moveTo(new RoomPosition(49, 25, creep.room.name));
                    }
                } else if (creep.hits == creep.hitsMax && targetst.length == 0) {
                    creep.moveTo(new RoomPosition(0, 25, creep.room.name));
                }
                //  creep.rangedMassAttack();
                creep.say(targets.length);
                if (targets.length > 0) {
                    creep.say("attack");
                    creep.rangedAttack(targets[0]);
                }
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (creep.memory.attackrole == "rangerhealer") {
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                const targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                if (targets.length > 0) {
                    creep.rangedAttack(targets[0]);
                }
                if (creep.hits < creep.hitsMax) {
                    creep.heal(creep);
                }
                const range = creep.pos.getRangeTo(target);
                if (range > 2 && creep.hits + 300 > creep.hitsMax) {
                    creep.moveTo(target);
                }
                if (range < 3 || (creep.hits + 300 < creep.hitsMax && range < 5)) {
                    creepfunctions.combatMove(creep, targetArr, target);
                }
                if (creep.room.name != creep.memory.memstruct.spawnRoom) {
                    var targetRoomFlag = Game.flags[creep.memory.memstruct.spawnRoom];
                    var pos1 = creep.pos;
                    var pos2 = targetRoomFlag.pos;
                    const range = creep.pos.getRangeTo(targetRoomFlag.pos);
                    if (range > 23) { // might cause bug on nxt room wall 
                        creep.moveTo(targetRoomFlag.pos);
                    }
                }
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    },
    ranger: function(creep) {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
        const targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        if (targets.length > 0) {
            creep.rangedAttack(targets[0]);
        }
        const range = creep.pos.getRangeTo(target);
        if (range > 2) {
            creep.moveTo(target);
        }
        if (range < 3) {
            creepfunctions.combatMove(creep, targetArr, target);
        }
        
        
        try{creep.heal(creep);}catch(e){}
        
        
        
    },
    attacker: function(creep) {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (target) {
                    if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    var targetst = creep.room.find(FIND_HOSTILE_STRUCTURES, {
                        filter: (s) => {
                            return (s.structureType == STRUCTURE_SPAWN);
                        }
                    });
                    if (targetst.length > 0) {
                        if (creep.attack(targetst[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targetst[0]);
                        }
                    }
                }

    }
};
module.exports = roleguard;