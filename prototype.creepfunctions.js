var creepfunctions = {
    /*
    USED BY: 
        memstruct function
    milti
    
    if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
            }
    */
    checkglobaltasks: function(creep) {
        if (creep.memory.memstruct.tasklist.length == 0) {
            return true;
        } else
        if (creep.memory.memstruct.tasklist[0] != undefined) {
            if (creep.memory.memstruct.tasklist[0][0] == "joinSquad") {
                  if (creep.ticksToLive < 1500) {
                    var tempid = creep.id;
                  //  console.log("adding creep to squad - " + tempid);
                    try{
                    Memory.squadObject[creep.memory.memstruct.tasklist[0][1]].SquadMembersCurrent.push(tempid);
                       creep.memory.memstruct.tasklist.splice(0, 1);
                       
                    }catch(e){
                       console.log("missing squad");
                    }
                    //  creep.say(creep.memory.memstruct.tasklist[0][1]);
                     // creep.say(creep.id);
                   // creep.memory.memstruct.tasklist.splice(0, 1);
                  }
            } else if (creep.memory.memstruct.tasklist[0][0] == "claim") {
                if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
            } else if (creep.memory.memstruct.tasklist[0][0] == "boost") // [0][0] boost [0][1] boosy mineral typ3e [0][2]number of bodyparts
            {
                var flagmid = Game.flags[creep.room.name];
                var boosisready = false;
                var boostlab;
                creep.memory.memstruct.boosted=true;
                 
                var creeper = Game.creeps["resourcemover" + creep.room.name];
                if (creep.pos.x == flagmid.pos.x - 2 && creep.pos.y == flagmid.pos.y - 3) {
                    if (creeper != undefined) {
                        if (creeper.memory.neededBoost != "cleanup") {
                            var temp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, flagmid.pos.x - 2, flagmid.pos.y - 2);
                            var creeper = Game.creeps["resourcemover" + creep.room.name];
                            for (var i = 0; i < temp.length; i++) {
                                if (temp[i].structureType == STRUCTURE_LAB) {
                                    boostlab = temp[i];
                                    if (boostlab.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][1]) > creep.memory.memstruct.tasklist[0][2] * 30) {
                                        // lab boos creep here
                                        creep.say("hasboost");
                                        boostlab.boostCreep(creep, creep.memory.memstruct.tasklist[0][2])
                                        creep.memory.memstruct.tasklist.splice(0, 1);
                                        creeper.memory.neededBoost = "cleanup";
                                    } else if (boostlab.store.getUsedCapacity() - boostlab.store.getUsedCapacity("energy") == 0) // minus energy mayby
                                    {
                                        var creeper = Game.creeps["resourcemover" + creep.room.name];
                                        creeper.say("fill");
                                        if (creeper != undefined) {
                                            if (creeper.memory.neededBoost == "" || creeper.memory.neededBoost == undefined || creeper.memory.neededBoost == null) {
                                                creeper.memory.neededBoost += creep.memory.memstruct.tasklist[0][1];
                                            }
                                        }
                                    } else if (boostlab.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][1]) < creep.memory.memstruct.tasklist[0][2] * 30 && creeper.memory.neededBoost != "cleanup") // minus energy mayby
                                    {
                                        var creeper = Game.creeps["resourcemover" + creep.room.name];
                                        creeper.say("fill");
                                        if (creeper != undefined) {
                                            if (creeper.memory.neededBoost == "" || creeper.memory.neededBoost == undefined || creeper.memory.neededBoost == null) {
                                                creeper.memory.neededBoost += creep.memory.memstruct.tasklist[0][1];
                                            }
                                        }
                                    } else {
                                        creeper.memory.neededBoost = "";
                                        creeper.say("a");
                                    }
                                }
                            }
                        }
                    }
                } else {
                    var roompos = new RoomPosition(flagmid.pos.x - 2, flagmid.pos.y - 3, creep.room.name);
                    creep.moveTo(roompos);
                }
            } else if (creep.memory.memstruct.tasklist[0][0] == "moveToRoom") {
                
             //   var targetRoomFlag = Game.flags[creep.memory.memstruct.tasklist[0][1]];
                var targposition = new RoomPosition(25,25, creep.memory.memstruct.tasklist[0][1]);
              
                 try{creep.heal(creep);}catch(e){}
                  try{creep.rangedMassAttack();}catch(e){}
                var pos1 = creep.pos;
                var pos2 = targposition;
                const range = creep.pos.getRangeTo(targposition);
                if (range > 23) { // might cause bug on nxt room wall 
                    creep.moveTo(targposition);
                    Game.map.visual.line(creep.pos, targposition, {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                    var targets = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    var range2 = creep.pos.getRangeTo(targets);
                    if (range2 <= 5) {
                        const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                        target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                        this.combatMove(creep, targetArr, target);
                    }
                } else {
                    creep.memory.memstruct.tasklist.splice(0, 1);
                }
            } else if (creep.memory.memstruct.tasklist[0][0] == "attackMoveToRoom") {
                var targetRoomFlag = Game.flags[creep.memory.memstruct.tasklist[0][1]];
                var pos1 = creep.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creep.pos.getRangeTo(targetRoomFlag.pos);
                if (range > 23) { // might cause bug on nxt room wall 
                    var targets = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    var range2 = creep.pos.getRangeTo(targets);
                    if (range2 <= 4) {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                        var targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                        var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                        if (targets.length > 0) {
                            creep.rangedAttack(targets[0]);
                        }
                        if (creep.hits < creep.hitsMax) {
                            creep.heal(creep);
                        }
                        if (creep.memory.attackrole == "ranger") {// long range creeps here 
                            var range = creep.pos.getRangeTo(target);
                            if (range > 3) {
                                creep.moveTo(target);
                            }
                            if (range < 3 || (creep.hits + 300 < creep.hitsMax && range < 5)) {
                                creepfunctions.combatMove(creep, targetArr, target);
                            }
                        } else {
                            if (range > 1) {
                                creep.moveTo(target);
                            }
                        }
                    } else {
                        creep.moveTo(targetRoomFlag.pos);
                    }
                } else {
                    creep.memory.memstruct.tasklist.splice(0, 1);
                }
            } else if (creep.memory.memstruct.tasklist[0][0] == "moveTo") {
                 try{creep.heal(creep);}catch(e){}
                var targetposition = new RoomPosition(creep.memory.memstruct.tasklist[0][1], creep.memory.memstruct.tasklist[0][2], creep.room.name);
                var range = creep.pos.getRangeTo(targetposition);
                if (range != 0) {
                    creep.moveTo(targetposition);
                   // creep.say(range);
                } else {
                    creep.memory.memstruct.tasklist.splice(0, 1);
                }
            } else if (creep.memory.memstruct.tasklist[0][0] == "moveToLoose") {
                var targetposition = new RoomPosition(creep.memory.memstruct.tasklist[0][1], creep.memory.memstruct.tasklist[0][2], creep.room.name);
                var range = creep.pos.getRangeTo(targetposition);
                if (range> 2) {
                    creep.moveTo(targetposition);
                    creep.say(range);
                } else {
                    creep.memory.memstruct.tasklist.splice(0, 1);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "waituntil") {
               
                if (Game.time < creep.memory.memstruct.tasklist[0][1] ) {
                    
                    creep.say("wait");
                } else {
                    creep.memory.memstruct.tasklist.splice(0, 1);
                }
               
               
            }
            
              else if (creep.memory.memstruct.tasklist[0][0] == "renewfull") {
               
               
               this.movehomeandrenew(creep);
               
                if (creep.ticksToLive > 1400) {
                     creep.memory.memstruct.tasklist.splice(0, 1);
                }
               
               
            }     
            
                        else if (creep.memory.memstruct.tasklist[0][0] == "boosAllMax") // used only by combat will deal with dismantel attack heal ranged_attack tough and move only 
                        {
               
               
               
                var numberOfHealParts =0;
        var numberOfAttackParts=0;
        var numberOfRangedParts = 0;
        var numberOfMoveParts = 0;
        var numberOfWorkParts = 0;
        var numberOfToughParts = 0;   
          var arraytopush = [] ;
                for(var j = 0 ; j < creep.body.length ; j++)
                {
                    if(creep.body[j].type == HEAL){numberOfHealParts++;}
                    if(creep.body[j].type == ATTACK){numberOfAttackParts++;}
                    if(creep.body[j].type == RANGED_ATTACK){numberOfRangedParts++;}
                    if(creep.body[j].type == WORK){numberOfWorkParts++;}
                    if(creep.body[j].type == MOVE){numberOfMoveParts++;}     
                    if(creep.body[j].type == TOUGH){numberOfToughParts++;}           
                }
               
               
               if(numberOfHealParts != 0){
                   arraytopush.push(["boost","XLHO2",numberOfHealParts]);
               }
               
               if(numberOfAttackParts != 0){
                   arraytopush.push(["boost","XUH2O",numberOfAttackParts]);
               }   
               
               
               if(numberOfRangedParts != 0){
                   arraytopush.push(["boost","XKHO2",numberOfRangedParts]);
               }  
               
               if(numberOfWorkParts != 0){
                   arraytopush.push(["boost","XZH2O",numberOfWorkParts]);
               }   
               if(numberOfMoveParts != 0){
                   arraytopush.push(["boost","XZHO2",numberOfMoveParts]);
               } 
               if(numberOfToughParts != 0){
                   arraytopush.push(["boost","XGHO2",numberOfToughParts]);
               } 
               
               
               
                creep.memory.memstruct.tasklist.splice(0, 1);
                
                 for (var i = 0; i < creep.memory.memstruct.tasklist.length; i++) 
                 {
           
           
             arraytopush.push(creep.memory.memstruct.tasklist[i]);
           
                    
                }
                creep.memory.memstruct.tasklist=arraytopush;
                
               
            }
            
            
            
            
            
            
            
            
            
            
            
        } else {
            return true;
        }
    },
    /*
    USED BY: 
        most eventually ranger primarily
    
    
    
    */
    findDroppedEnergy: function(creep) {
        var droppedresources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: (res) => {
                return (res.resourceType == RESOURCE_ENERGY) && (res.amount > creep.store.getFreeCapacity());
            }
        });
        if (droppedresources != undefined) {
            var range = creep.pos.getRangeTo(droppedresources);
            if (range <= 1) {
                creep.pickup(droppedresources);
            } else {
                creep.moveTo(droppedresources, {
                    reusePath: range
                });
            }
            creep.memory.hastask = false;
        }
    },
    /*
     USED BY: 
         most eventually ranger primarily
     
     
     
     */
    movehomeandrenew: function(creep, homeroom, timeer) {
        
        
        
        // check iff the renew spot is free and room is able to renew
        
        
        
        
        
        if (creep.memory.isrenweing == undefined) {
            creep.memory.isrenweing = false;
        }
        if (creep.ticksToLive < timeer) {
            creep.memory.isrenweing = true;
        }
        if (creep.ticksToLive > 1400) {
            creep.memory.isrenweing = false;
        }
        if (creep.memory.isrenweing) {
            if (creep.room.name == homeroom) {
                if (creep.memory.isrenweing) {
                    var spawnss = creep.room.find(FIND_MY_SPAWNS);
                    creep.moveTo(spawnss[0], {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
            } else {
                var targetRoomFlag = Game.flags[homeroom];
                var pos1 = creep.pos;
                var pos2 = targetRoomFlag.pos;
                const range = creep.pos.getRangeTo(targetRoomFlag.pos);
                if (range > 23) { // might cause bug on nxt room wall 
                    creep.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creep.pos, targetRoomFlag.pos, {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                }
            }
        }
    },
    /*
    USED BY: 
        most eventually ranger primarily
    
    
    
    */
    stockstorage: function(creep) {
        var storageactual = creep.room.storage;
        if (storageactual != undefined) {
            if (storageactual.store.getUsedCapacity() < 20000) {
                var range = creep.pos.getRangeTo(storageactual);
                if (range <= 1) {
                    creep.transfer(storageactual, RESOURCE_ENERGY);
                } else {
                    creep.moveTo(storageactual, {
                        reusePath: range
                    });
                }
                creep.memory.hastask = false;
            }
        }
    },
    /*
    USED BY: 
        most eventually ranger primarily
    
    
    
    */
    combatMove: function(creep, avoidarray, avoidclosest) {
        
        
        let patha = PathFinder.search(creep.pos, avoidarray.map(c=>{return{pos:c.pos,range:6}},{flee:true})).path;
        
        
        
        creep.moveByPath(patha);
        
         
        
        
        
        
        
    },
    /*
    USED BY: 
        jack
        mover
        repairer
    */
    findfullcontainers: function(creep, energyleveltodrawfrom) {
        var containers = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => {
                return s.structureType == STRUCTURE_CONTAINER && s.store.getUsedCapacity("energy") > energyleveltodrawfrom;
            }
        });
        if (containers == undefined) {
            containers = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => {
                    return s.structureType == STRUCTURE_LINK && s.store.getUsedCapacity("energy") > 500;
                }
            });
        }
        if (containers != undefined && containers != null) {
            if (creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containers, {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
            }
            creep.memory.hastask = true;
        } else {
            var storageMain = creep.room.storage;
            if (storageMain != undefined && storageMain.store.getUsedCapacity() > 50000) {
                var range = creep.pos.getRangeTo(storageMain);
                if (range <= 1) {
                    creep.withdraw(storageMain, RESOURCE_ENERGY);
                } else {
                    creep.moveTo(storageMain, {
                        reusePath: range,
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
                creep.memory.hastask = true;
            }
        }
    },
    /*
    USED BY: 
        jack
    
    
    
    */
    checklocaltasks: function(creep) {
        if (creep.memory.tasklist[0] == "moveto") {
            const path = creep.pos.findPathTo(creep.memory.targetroom);
            if (path.length > 0) {
                creep.move(path[0].direction);
            } else {
                creep.memory.tasklist[0].splice(0, 1);
            }
        }
    },
    /*
    USED BY: 
        jack
    
    
    
    */
    repairbuildings: function(creep) {
        var repairtarg = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_CONTAINER) && s.hits < s.hitsMax * 0.7;
            }
        });
        if (repairtarg) {
            var range = creep.pos.getRangeTo(repairtarg);
            if (range <= 3) {
                creep.repair(repairtarg);
            } else {
                creep.moveTo(repairtarg, {
                    reusePath: 5
                });
            }
            creep.memory.hastask = true;
        }
    },
    /*
    USED BY: 
        repairer
    
    
    
    */
    repairbuildingsfull: function(creep) {
        var repairtarg = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART) && s.hits < s.hitsMax * 0.99;
            }
        });
        if (repairtarg) {
            var range = creep.pos.getRangeTo(repairtarg);
            if (range <= 3) {
                creep.repair(repairtarg);
            } else {
                creep.moveTo(repairtarg, {
                    reusePath: 5
                });
            }
            creep.memory.hastask = true;
        }
    },
    /*
    USED BY: 
        repairer
    
    
    
    */
    upkeepwalls: function(creep) {
        var repairtarg = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_WALL && s.hits < s.hitsMax * 0.01) || (s.structureType == STRUCTURE_RAMPART && s.hits < s.hitsMax * 0.15);
            }
        });
        if (repairtarg) {
            var range = creep.pos.getRangeTo(repairtarg);
            if (range <= 3) {
                creep.repair(repairtarg);
            } else {
                creep.moveTo(repairtarg, {
                    reusePath: 5
                });
            }
            creep.memory.hastask = true;
        }
    },
    /*
    USED BY: 
        jack
    
    
    
    */
    upgradecontroller: function(creep) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {
                visualizePathStyle: {
                    stroke: '#ffffff'
                }
            });
        }
        creep.memory.hastask = true;
    },
    /*
    USED BY: 
        jack
    
    
    
    */
    stockbuildingswithenergy: function(creep) {
        var buildingsneedingenergy = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    (structure.structureType == STRUCTURE_EXTENSION && structure.energy < 50) || (structure.structureType == STRUCTURE_CONTAINER && structure.store.energy < 500) || (structure.structureType == STRUCTURE_SPAWN && structure.energy < 300));
            }
        });
        creep.say(buildingsneedingenergy.length);
        if (buildingsneedingenergy.length > 0) {
            if (creep.transfer(creep.pos.findClosestByPath(buildingsneedingenergy), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.pos.findClosestByPath(buildingsneedingenergy), {
                    visualizePathStyle: {
                        stroke: '#ffffff'
                    }
                });
            }
            creep.memory.hastask = true;
        }
    },
    stocktowerswithenergy: function(creep) {},
    /*
    USED BY: 
        jack
    
    
    
    */
    buildstructs: function(creep) {
        var constructionsites = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (constructionsites != undefined) {
            var range = creep.pos.getRangeTo(constructionsites);
            if (range <= 3) {
                creep.build(constructionsites);
            } else {
                creep.moveTo(constructionsites, {
                    reusePath: range
                });
            }
            creep.memory.hastask = true;
        }
    }
}
module.exports = creepfunctions;