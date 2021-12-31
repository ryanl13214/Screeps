var squadmanage = require('squadManager');
var creepfunctions = require('prototype.creepfunctions');
var powercreepManager = {
    checkShield: function(creep)
    {
        //creep.say("PWR_SHIELD");
        if(creep.powers[PWR_SHIELD] != undefined &&  creep.powers[PWR_SHIELD].cooldown == 0)
        {
            creep.usePower(PWR_SHIELD);
        }
    },
    checkForcorpses: function(creep)
    {
             var droppedresources = creep.pos.findInRange(FIND_DROPPED_RESOURCES,1,
                 {
                     filter: (res) =>
                     {
                         return (res.resourceType == RESOURCE_OPS)   ;
                     }
                 });
    if(droppedresources.length != 0 ){
       creep.pickup(droppedresources[0]);
    }
    
    },
    loopTasks: function(creep)
    {
        //     console.log(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0]);
        if(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0] == "repeat")
        {
            //   creep.say(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0]);
            if(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][1] + 1 == creep.memory.memstruct.tasklist.length)
            {
                var tmpstore = creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1]
                var back = creep.memory.memstruct.tasklist.splice(0, 1);
                creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1] = back[0];
                creep.memory.memstruct.tasklist.push(tmpstore);
            }
            else
            {
                creep.memory.memstruct.tasklist.splice(0, 1);
            }
        }
        else
        {
            creep.memory.memstruct.tasklist.splice(0, 1);
        }
    },
    allowSlave: function(creep)
    {
        try
        {
            if(creep.memory.duoId != undefined)
            {
                var slave = Game.getObjectById(creep.memory.duoId);
                if(slave)
                {
                    var targets = slave.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
if(targets.length > 0) {
    slave.rangedAttack(targets[0]);
}
                     
                    
                    
                    
                    const range = creep.pos.getRangeTo(slave);
                    var counter = 1;
                    if(slave.pos.x == 50 || slave.pos.x == 0 || slave.pos.y == 50 || slave.pos.y == 0)
                    {
                        counter = 3;
                    }
                    if(range > counter && creep.room.name == slave.room.name && Game.time % 3 == 0)
                    {
                        creep.say("come");
                        creep.moveTo(slave);
                    }
                }
            }
        }
        catch (e)
        {}
    },
    checkPowerCreepTasks: function(powerCreep)
    {
        creep = powerCreep;
        if(creep.memory.memstruct.tasklist.length == 0)
        {
            return true;
        }
        else
        if(creep.memory.memstruct.tasklist[0] != undefined)
        {
            if(creep.memory.memstruct.tasklist[0][0] == "moveToRoom")
            {
                var targposition = new RoomPosition(25, 25, creep.memory.memstruct.tasklist[0][1]);
                var pos1 = creep.pos;
                var pos2 = targposition;
                const range = creep.pos.getRangeTo(targposition);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creep.moveTo(targposition);
                    Game.map.visual.line(creep.pos, targposition,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                    var targets = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    var range2 = creep.pos.getRangeTo(targets);
                    if(range2 <= 5)
                    {
                        const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                        target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                        //     this.combatMove(creep, targetArr, target);
                    }
                }
                else
                {
                    this.loopTasks(creep);
                }
                this.allowSlave(creep);
            }
            if(creep.memory.memstruct.tasklist[0][0] == "attackRoom111")
            {
                //this.Lvl5StrongohldCotroller(creep);
                creep.say("attackRoom");
                var renewPoint = 1800;
                /////////////////////////////////////////////////
                if(creep.memory.duoId != undefined)
                {
                    if(!Game.creeps['powerspawnSupport' + creep.name])
                    {
                        delete Memory.creeps['powerspawnSupport' + creep.name];
                        creep.memory.duoId = undefined;
                    }
                }
                if(creep.memory.duoId != undefined && creep.memory.duoId != "erer")
                {
                    creep.say("got carry");
                    var slave = Game.getObjectById(creep.memory.duoId);
                    if(slave != undefined)
                    {
                        if(creep.store.getFreeCapacity() > 10)
                        {
                            slave.transfer(creep, "ops", 10);
                        }
                    }
                }
                else
                {
                    creep.say("spawning");
                    Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(
                        [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, HEAL, HEAL, HEAL, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL], 'powerspawnSupport' + creep.name,
                        {
                            memory:
                            {
                                role: 'multi',
                                memstruct:
                                {
                                    spawnRoom: creep.memory.memstruct.spawnRoom,
                                    tasklist: [
                                        ["boosAllMax"],
                                        ["withdraw", "storage", "ops"], //["withdraw", strg.id, "energy", moveAmount]);
                                        ["findMaster", creep.id]
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
                   
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if(powerCreep.ticksToLive < renewPoint)
                {
                    // go home and renew
                    if(creep.room.name != creep.memory.memstruct.spawnRoom)
                    {
                        creep.moveTo(new RoomPosition(25, 25, creep.memory.memstruct.spawnRoom));
                    }
                    else
                    {
                        var myPowerspawn = powerCreep.room.find(FIND_MY_STRUCTURES,
                        {
                            filter: (structure) =>
                            {
                                return (structure.structureType == STRUCTURE_POWER_SPAWN);
                            }
                        });
                        creep.moveTo(myPowerspawn[0]);
                        var range = powerCreep.pos.getRangeTo(myPowerspawn[0]);
                        if(range < 2)
                        {
                            powerCreep.renew(myPowerspawn[0]);
                        }
                    }
                }
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
                if(creep.memory.memstruct.spawnRoom == creep.room.name && creep.store.getUsedCapacity(RESOURCE_OPS) < creep.store.getCapacity() && powerCreep.ticksToLive > renewPoint)
                {
                    powerCreep.moveTo(creep.room.storage);
                    powerCreep.withdraw(powerCreep.room.storage, RESOURCE_OPS);
                }
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                else if(powerCreep.ticksToLive > renewPoint && creep.memory.memstruct.tasklist[0][1] == creep.room.name)
                {
                    if(creep.store.getUsedCapacity() < creep.store.getCapacity()/2)
                    {
                          Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(
                        [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]
                      , 'powerspawnSupportcarry' + creep.name,
                        {
                            memory:
                            {
                                role: 'multi',
                                memstruct:
                                {
                                    spawnRoom: creep.memory.memstruct.spawnRoom,
                                    tasklist: [
                                      
                                        ["withdraw", "storage", "ops"], //["withdraw", strg.id, "energy", moveAmount]);
                                        ["moveToRoom", creep.room.name],
                                        ["transfer", creep.id,"ops"],
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
                    
                    
                    
                    var range = powerCreep.pos.getRangeTo(new RoomPosition(25, 25, creep.room.name));
                    if(range > 23)
                    {
                        creep.moveTo(new RoomPosition(25, 25, creep.room.name))
                    }
                    ///////////////////
                    var targetst = creep.room.find(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_TOWER && structure.energy < 20);
                        }
                    });
                    if(targetst.length > 4 && creep.ticksToLive > 2000)
                    {
                        for(var q = 0; q < 4; q++)
                        {
                            Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(
                                [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK], 'clear dismantler' + q,
                                {
                                    memory:
                                    {
                                        role: 'guard',
                                        attackrole: "basicRoomDIS",
                                        memstruct:
                                        {
                                            spawnRoom: creep.memory.memstruct.spawnRoom,
                                            tasklist: [
                                                ["createslaveBOOST"],
                                                ["boosAllMax"],
                                                ["forcemoveToRoom", creep.room.name]
                                            ],
                                            objectIDStorage: "",
                                            boosted: false,
                                            moveToRenew: false,
                                            opportuniticRenew: false,
                                            hastask: false
                                        }
                                    }
                                });
                        }
                        for(var q = 0; q < 0; q++)
                        {
                            Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(
                                [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK], 'clear dismantlera' + q,
                                {
                                    memory:
                                    {
                                        role: 'guard',
                                        attackrole: "basicRoomDIS",
                                        memstruct:
                                        {
                                            spawnRoom: creep.memory.memstruct.spawnRoom,
                                            tasklist: [
                                                ["boosAllMax"],
                                                ["forcemoveToRoom", creep.room.name]
                                            ],
                                            objectIDStorage: "",
                                            boosted: false,
                                            moveToRenew: false,
                                            opportuniticRenew: false,
                                            hastask: false
                                        }
                                    }
                                });
                        }
                    }
                    //////////////
                    if(powerCreep.powers[PWR_DISRUPT_TERMINAL] != undefined)
                    {
                        var enemyTerminal = powerCreep.room.find(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (structure) =>
                            {
                                return (structure.structureType == STRUCTURE_TERMINAL);
                            }
                        });
                        if(enemyTerminal.length != 0)
                        {
                            var range = powerCreep.pos.getRangeTo(enemyTerminal);
                            if(range > 35)
                            {
                                powerCreep.moveTo(enemyTerminal[0]);
                            }
                            else
                            {
                                this.checkShield(powerCreep);
                                var enemyLogisticCreeps = enemyTerminal[0].pos.findInRange(FIND_HOSTILE_CREEPS, 2);
                                if(enemyLogisticCreeps.length != 0) //cooldown
                                {
                                    powerCreep.usePower(PWR_DISRUPT_TERMINAL, enemyTerminal[0]);
                                }
                            }
                        }
                    }
                    if(powerCreep.powers[PWR_DISRUPT_TOWER] != undefined)
                    {
                        var enTowers = powerCreep.room.find(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (structure) =>
                            {
                                return (structure.structureType == STRUCTURE_TOWER  );
                            }
                        });
                        console.log(enTowers);
                        if(enTowers.length != 0 && Game.time % 6 ==0)
                        {
                            var range = powerCreep.pos.getRangeTo(enTowers[0]);
                            if(range >  35)
                            {
                                powerCreep.moveTo(enTowers[0]);
                            }
                            else
                            {
                                powerCreep.usePower(PWR_DISRUPT_TOWER, enTowers[0]);
                            }
                        }
                        if(enTowers.length > 1 && Game.time % 6 ==1)
                        {
                            var range = powerCreep.pos.getRangeTo(enTowers[1]);
                            if(range > 35)
                            {
                                powerCreep.moveTo(enTowers[1]);
                            }
                            else
                            {
                                powerCreep.usePower(PWR_DISRUPT_TOWER, enTowers[1]);
                            }
                        }
                        if(enTowers.length > 2  && Game.time % 6 ==2)
                        {
                            var range = powerCreep.pos.getRangeTo(enTowers[2]);
                            if(range >  35)
                            {
                                powerCreep.moveTo(enTowers[2]);
                            }
                            else
                            {
                                powerCreep.usePower(PWR_DISRUPT_TOWER, enTowers[2]);
                            }
                        }
                        if(enTowers.length > 3  && Game.time % 6 ==3)
                        {
                            var range = powerCreep.pos.getRangeTo(enTowers[3]);
                            if(range >  35)
                            {
                                powerCreep.moveTo(enTowers[3]);
                            }
                            else
                            {
                                powerCreep.usePower(PWR_DISRUPT_TOWER, enTowers[3]);
                            }
                        }
                        if(enTowers.length > 4 && Game.time % 6 ==4)
                        {
                            var range = powerCreep.pos.getRangeTo(enTowers[4]);
                            if(range >  35)
                            {
                                powerCreep.moveTo(enTowers[4]);
                            }
                            else
                            {
                                powerCreep.usePower(PWR_DISRUPT_TOWER, enTowers[4]);
                            }
                        }
                       
                    }
                    /*
                    if(powerCreep.powers[PWR_DISRUPT_SPAWN] != undefined && 1 == 2)
                    {
                        var enSPAWNS = powerCreep.room.find(FIND_HOSTILE_STRUCTURES,
                        {
                            filter: (structure) =>
                            {
                                return (structure.structureType == STRUCTURE_SPAWN);
                            }
                        });
                        if(enSPAWNS.length != 0)
                        {
                            var range = powerCreep.pos.getRangeTo(enSPAWNS[0]);
                            if(range < 20)
                            {
                                powerCreep.moveTo(enSPAWNS[0]);
                            }
                            else
                            {
                                var enemyLogisticCreeps = enSPAWNS[0].pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                                if(enemyLogisticCreeps.length != 0 && 1 == 2) //cooldown
                                {
                                    powerCreep.usePower(PWR_DISRUPT_SPAWN, enSPAWNS[0]);
                                }
                            }
                        }
                    }
                    */
                }
                var range = powerCreep.pos.getRangeTo(new RoomPosition(25, 25, creep.memory.memstruct.tasklist[0][1]));
                var healer = creep.pos.findInRange(FIND_MY_CREEPS, 1);
            
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if(powerCreep.ticksToLive > renewPoint && range > 23 && creep.memory.duoId != undefined && healer.length != 0)
                {
                    creep.say("dfghj");
                    creep.moveTo(new RoomPosition(25, 25, creep.memory.memstruct.tasklist[0][1]));
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                this.allowSlave(powerCreep);
                this.checkShield(powerCreep);
                this.checkForcorpses(powerCreep);
                return false;
            }
        }
    },
    run: function(powerCreep)
    {
        
        
                if (Memory.empire == undefined)
        {
            Memory.empire = {};
        }
                if (Memory.empire.powercreeps == undefined)
        {
            Memory.empire.powercreeps = {
                attackers:[],
                defenders:[],
                outriders:[]
            };
        }
        
        
        var r;
        if(powerCreep.memory.memstruct == undefined)
        {
            powerCreep.memory.memstruct = {
                spawnRoom: "",
                tasklist: [],
                objectIDStorage: "",
                boosted: false,
                moveToRenew: false,
                opportuniticRenew: true,
                hastask: false,
                full: false,
                wantsToJoinSquad: false,
                isInSquad: false,
                SquadID: "0",
                SquadRole: false
            };
        }
        // for the ops gens move to some position and gen ops and transfer them into storage.
        // spawn only in a stronhold.
        //   console.log(powerCreep.spawnCooldownTime );
        if(powerCreep.room == undefined) // creep is not in the world
        {
            
   
      
            if(!(powerCreep.spawnCooldownTime > Date.now()) )
            {
                try
                {
                  var  myArray = powerCreep.name.split("-");
                  
 
                  
                    var pwrspawn = Game.rooms[myArray[0]].find(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_POWER_SPAWN);
                        }
                    });
                 
                    if(pwrspawn.length != 0)
                    {
                        
                        
                                          if(myArray.length == 3)
                  {
                      if(myArray[1] == "atk")
                      {
                //        Memory.empire.powercreeps.attackers.push(powerCreep.id)
                      }
                       if(myArray[1] == "def")
                      {
              //          Memory.empire.powercreeps.defenders.push(powerCreep.id) 
                      }
                      
                      
                  }
                   if(myArray.length == 1)// contains outrider
                  {
                   //  Memory.empire.powercreeps.outriders.push(powerCreep.id)    
                  }
                        
                        
                        
                        
                        
                        
                          powerCreep.memory.memstruct.spawnRoom = myArray[0];
                        powerCreep.spawn(pwrspawn[0]);
                    }
                }
                catch (e)
                {}
            }
            
      
            
        }
        else // creep is in the world
        {
            var check = this.checkPowerCreepTasks(powerCreep);
            //powerCreep.say(check);
            if(check && powerCreep.room.name != powerCreep.memory.memstruct.spawnRoom)
            {
                powerCreep.memory.memstruct.tasklist = [
                    ["moveToRoom", powerCreep.memory.memstruct.spawnRoom]
                ]
            }
            if(check)
            {
                if(powerCreep.room.controller.isPowerEnabled == false)
                {
                    if(powerCreep.enableRoom(powerCreep.room.controller) == -9)
                    {
                        powerCreep.moveTo(powerCreep.room.controller,
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ff0000'
                            }
                        });
                    }
                }
                else
                {
                    var powerList = powerCreep.powers;
                    var powerkeys = Object.keys(powerList);
                    var powervalues = Object.values(powerList);
                    var creepid = powerCreep.name.substring(0, 7);
                    
                    if( powerCreep.name == "defender1"){
                        this.defence(powerCreep);
                    }else{
                    this.roomManager(powerCreep); // add limiters on when it should run check defcon and game time to operate only when needed
                    }
                    
                }
            }
        }
    },
    
    
      defence: function(powerCreep)
    { 
        var mainflag = Game.flags[powerCreep.room.name];
            if(Game.time % 50 == 0)
        {
            powerCreep.usePower(PWR_GENERATE_OPS);
        }
        
        
                if(powerCreep.store.getFreeCapacity() < 5) // creep is full
        {
            var range = powerCreep.pos.getRangeTo(powerCreep.room.storage);
            if(range > 1)
            {
                powerCreep.moveTo(powerCreep.room.storage,
                {
                    visualizePathStyle:
                    {
                        stroke: '#ff0000'
                    }
                });
            }
            else
            {
                powerCreep.transfer(powerCreep.room.storage, RESOURCE_OPS, powerCreep.store.getUsedCapacity("ops"));
            }
        }
        else
        {
            var mainflag = Game.flags[powerCreep.room.name];
            var range = powerCreep.pos.getRangeTo(new RoomPosition(mainflag.pos.x - 1, mainflag.pos.y + 1, mainflag.room.name));
            if(range > 0)
            {
                powerCreep.moveTo(new RoomPosition(mainflag.pos.x  -  1 , mainflag.pos.y + 1, mainflag.room.name),
                {
                    visualizePathStyle:
                    {
                        stroke: '#ff0000'
                    }
                });
            }
        }
      var enBodyparts=  mainflag.memory.totalEnemyBodyParts ;
        
        
          if(powerCreep.powers[PWR_OPERATE_TOWER] != undefined && powerCreep.powers[PWR_OPERATE_EXTENSION].cooldown <1 && enBodyparts > 49)
            {
        
        
        
         if(powerCreep.store.getUsedCapacity("ops") > 110) // creep is full
                {
                    var towers = powerCreep.room.find(FIND_MY_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_TOWER);
                        }
                    });
                    for(var i = 0 ; i < towers.length ; i++){
                    if(towers[i].effects == undefined || towers[i].effects.length == 0) ///////////////////////////////////////////////
                    {
                        powerCreep.usePower(PWR_OPERATE_TOWER, towers[i]);
                    }
                }
        
                }
        
            }
        
        
        
        
        
        
        
     if(powerCreep.store.getUsedCapacity("ops") < 210 && powerCreep.room.storage.store.getUsedCapacity("ops") > 5000) // todo add in capacity check
                {
                    if(powerCreep.withdraw(powerCreep.room.storage, RESOURCE_OPS, powerCreep.store.getFreeCapacity() / 2) == ERR_NOT_IN_RANGE)
                    {
                        powerCreep.moveTo(powerCreep.room.storage);
                        powerCreep.say("wit storage");
                    }
                }
                
                
                
                
                
                
                
    
    },
    
    
    
    
    roomManager: function(powerCreep)
    {
        ////////////////////////////////////gen ops//////////////////////////////////////////////////////////////////////////////////////////
        if(Game.time % 50 == 0)
        {
            powerCreep.usePower(PWR_GENERATE_OPS);
        }
        ////////////////////////////////////store ops//////////////////////////////////////////////////////////////////////////////////////////
        if(powerCreep.store.getFreeCapacity() < 5) // creep is full
        {
            var range = powerCreep.pos.getRangeTo(powerCreep.room.storage);
            if(range > 1)
            {
                powerCreep.moveTo(powerCreep.room.storage,
                {
                    visualizePathStyle:
                    {
                        stroke: '#ff0000'
                    }
                });
            }
            else
            {
                powerCreep.transfer(powerCreep.room.storage, RESOURCE_OPS, powerCreep.store.getUsedCapacity("ops"));
            }
        }
        else
        {
            var mainflag = Game.flags[powerCreep.room.name];
            var range = powerCreep.pos.getRangeTo(new RoomPosition(mainflag.pos.x + 7, mainflag.pos.y + 7, mainflag.room.name));
            if(range > 2)
            {
                powerCreep.moveTo(new RoomPosition(mainflag.pos.x + 7, mainflag.pos.y + 7, mainflag.room.name),
                {
                    visualizePathStyle:
                    {
                        stroke: '#ff0000'
                    }
                });
            }
        }
        /////////////////////////////////renew //////////////////////////////////////////////////////////////////////////////////////////////
        var pwrspawn = powerCreep.room.find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_POWER_SPAWN);
            }
        })[0];
        var range = powerCreep.pos.getRangeTo(pwrspawn);
        if(range < 2)
        {
            powerCreep.renew(pwrspawn);
        }
        if(powerCreep.ticksToLive < 500)
        {
            powerCreep.moveTo(pwrspawn,
            {
                visualizePathStyle:
                {
                    stroke: '#ff0000'
                },
                reusePath: 50
            });
        }
        if(powerCreep.ticksToLive > 500)
        {
            ////////////////////////////////////  PWR_OPERATE_FACTORY//////////////////////////////////////////////////////////////////////////////////////////
            if(powerCreep.powers[PWR_OPERATE_FACTORY] != undefined)
            {
                if(powerCreep.store.getUsedCapacity("ops") > 110) // creep is full
                {
                    var FACTORY = powerCreep.room.find(FIND_MY_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_FACTORY);
                        }
                    })[0];
                    if(FACTORY.effects == undefined || FACTORY.effects.length == 0) ///////////////////////////////////////////////
                    {
                        powerCreep.moveTo(FACTORY,
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ff0000'
                            }
                        });
                        powerCreep.usePower(PWR_OPERATE_FACTORY, FACTORY);
                    }
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
            if(powerCreep.powers[PWR_REGEN_SOURCE] != undefined)
            {
                powerCreep.say("REGEN_SOURCE");
                var target = powerCreep.room.find(FIND_SOURCES);
                var boolchecker = false;
                powerCreep.say(target[0].effects.length);
                if(target[0].effects.length != 0)
                {
                    if(target[0].effects.length == 1)
                    { // source has an effect on it
                        if(target[0].effects[0].ticksRemaining < 20 || target[0].effects.length == 0)
                        {
                            powerCreep.moveTo(target[0],
                            {
                                visualizePathStyle:
                                {
                                    stroke: '#ff0000'
                                }
                            });
                            boolchecker = true;
                        }
                    }
                }
                else if(target[0].effects.length == 0)
                {
                    powerCreep.moveTo(target[0],
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ff0000'
                        }
                    });
                }
                if(target[1].effects.length != 0 && !boolchecker)
                {
                    if(target[1].effects.length == 1)
                    { // source has an effect on it
                        if(target[1].effects[0].ticksRemaining < 20 || target[1].effects.length == 0)
                        {
                            powerCreep.moveTo(target[1],
                            {
                                visualizePathStyle:
                                {
                                    stroke: '#ff0000'
                                }
                            });
                        }
                    }
                }
                else if(target[1].effects.length == 0)
                {
                    powerCreep.moveTo(target[1],
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ff0000'
                        }
                    });
                }
                ////////////////   
                var targets = powerCreep.pos.findInRange(FIND_SOURCES, 3);
                if(targets.length != 0)
                {
                    powerCreep.usePower(PWR_REGEN_SOURCE, targets[0]);
                }
            }
            ////////////////////////////////////stock with energy//////////////////////////////////////////////////////////////////////////////////////////
            if(powerCreep.powers[PWR_OPERATE_EXTENSION] != undefined && powerCreep.powers[PWR_OPERATE_EXTENSION].cooldown < 5)
            {
                powerCreep.say("PWR_EXTENSION");
                var strongroom = powerCreep.room;
                if(strongroom.energyAvailable * 1.15 < strongroom.energyCapacityAvailable)
                { // add cooldown check and storage full check else termianl
                    if(strongroom.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 15000)
                    {
                        var range = powerCreep.pos.getRangeTo(strongroom.storage);
                        if(range <= 3)
                        {
                            powerCreep.usePower(PWR_OPERATE_EXTENSION, strongroom.storage);
                        }
                        else
                        {
                            powerCreep.moveTo(strongroom.storage,
                            {
                                visualizePathStyle:
                                {
                                    stroke: '#ff0000'
                                }
                            });
                        }
                    }
                    else if(strongroom.terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 15000)
                    {
                        var range = powerCreep.pos.getRangeTo(strongroom.terminal);
                        if(range <= 3)
                        {
                            powerCreep.usePower(PWR_OPERATE_EXTENSION, strongroom.terminal);
                        }
                        else
                        {
                            powerCreep.moveTo(strongroom.terminal,
                            {
                                visualizePathStyle:
                                {
                                    stroke: '#ff0000'
                                }
                            });
                        }
                    }
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
            if(powerCreep.powers[PWR_REGEN_MINERAL] != undefined)
            {
                powerCreep.say("PWR_MINERAL");
                powerCreep.say("ee");
                var target = powerCreep.room.find(FIND_MINERALS);
                var boolchecker = false;
                powerCreep.say(target[0].effects);
                var extractorneeded;
                var minerals = powerCreep.room.find(FIND_MINERALS)[0].mineralAmount;
                if(minerals > 0)
                {
                    extractorneeded = true;
                }
                if(extractorneeded)
                {
                    if(target[0].effects == undefined)
                    {
                        powerCreep.say("dee");
                        powerCreep.moveTo(target[0],
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ff0000'
                            }
                        });
                    }
                    else if(target[0].effects.length != 0)
                    {
                        powerCreep.say("dfee");
                        if(target[0].effects.length == 1)
                        {
                            if(target[0].effects[0].ticksRemaining < 20 || target[0].effects.length == 0)
                            {
                                powerCreep.moveTo(target[0],
                                {
                                    visualizePathStyle:
                                    {
                                        stroke: '#ff0000'
                                    }
                                });
                                boolchecker = true;
                            }
                        }
                    }
                    else if(target[0].effects.length == 0 || target[0].effects == undefined)
                    {
                        powerCreep.say("dee");
                        powerCreep.moveTo(target[0],
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ff0000'
                            }
                        });
                    }
                    ////////////////   
                    var targets = powerCreep.pos.findInRange(FIND_MINERALS, 3);
                    if(targets.length != 0)
                    {
                        powerCreep.usePower(PWR_REGEN_MINERAL, targets[0]);
                    }
                }
            }
            //////////////////////////////////// operate power//////////////////////////////////////////////////////////////////////////////////////////
            if(powerCreep.powers[PWR_OPERATE_POWER] != undefined && powerCreep.powers[PWR_OPERATE_POWER].cooldown < 15)
            {
                powerCreep.say("PWR_POWER");
                if(powerCreep.store.getUsedCapacity("ops") > 210) // creep is full
                {
                    var pwrspawn = powerCreep.room.find(FIND_MY_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_POWER_SPAWN);
                        }
                    })[0];
                    if(pwrspawn.effects == undefined || pwrspawn.effects.length == 0)
                    {
                        powerCreep.moveTo(pwrspawn,
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ff0000'
                            }
                        });
                        powerCreep.usePower(PWR_OPERATE_POWER, pwrspawn);
                    }
                }
                else if(powerCreep.store.getUsedCapacity("ops") < 210 && powerCreep.room.storage.store.getUsedCapacity("ops") > 5000)
                {
                    if(powerCreep.withdraw(powerCreep.room.storage, RESOURCE_OPS, powerCreep.store.getFreeCapacity() / 2) == ERR_NOT_IN_RANGE)
                    {
                        powerCreep.moveTo(powerCreep.room.storage);
                        powerCreep.say("wit storage");
                    }
                }
            }
            /////////////////////////////////////////////////
            if(powerCreep.powers[PWR_OPERATE_SPAWN] != undefined && powerCreep.powers[PWR_OPERATE_SPAWN].cooldown < 15)
            {
                powerCreep.say("PWR_SPAWN");
                if(powerCreep.store.getUsedCapacity("ops") > 310) // creep is full
                {
                    var Spawns = Game.spawns[powerCreep.room.name];
                    if(Spawns != undefined && Spawns.effects == undefined || Spawns.effects.length == 0 && Spawns.spawning) ///////////////////////////////////////////////
                    {
                        powerCreep.moveTo(Spawns,
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ff0000'
                            }
                        });
                        powerCreep.usePower(PWR_OPERATE_SPAWN, Spawns);
                    }
                    var Spawns = Game.spawns[powerCreep.room.name + "1"];
                    if(Spawns != undefined && Spawns.effects == undefined || Spawns.effects.length == 0 && Spawns.spawning) ///////////////////////////////////////////////
                    {
                        powerCreep.moveTo(Spawns,
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ff0000'
                            }
                        });
                        powerCreep.usePower(PWR_OPERATE_SPAWN, Spawns);
                    }
                    var Spawns = Game.spawns[powerCreep.room.name + "2"];
                    if(Spawns != undefined && Spawns.effects == undefined || Spawns.effects.length == 0 && Spawns.spawning) ///////////////////////////////////////////////
                    {
                        powerCreep.moveTo(Spawns,
                        {
                            visualizePathStyle:
                            {
                                stroke: '#ff0000'
                            }
                        });
                        powerCreep.usePower(PWR_OPERATE_SPAWN, Spawns);
                    }
                }
              if(powerCreep.store.getUsedCapacity("ops") < 210 && powerCreep.room.storage.store.getUsedCapacity("ops") > 5000) // todo add in capacity check
                {
                    if(powerCreep.withdraw(powerCreep.room.storage, RESOURCE_OPS, powerCreep.store.getFreeCapacity() / 2) == ERR_NOT_IN_RANGE)
                    {
                        powerCreep.moveTo(powerCreep.room.storage);
                        powerCreep.say("wit storage");
                    }
                }
            }
        }
    },
}
module.exports = powercreepManager;