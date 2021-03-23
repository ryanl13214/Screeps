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
    initializeSquad: function(squadID, arrayOfSquadGoals, squadIsBoosted, squadType, squadHomeRoom, SquadMembers)
    {
        console.log("creating squad");
        Memory.squadObject[squadID] = {
            arrayOfSquadGoals: arrayOfSquadGoals,
            squadIsBoosted: squadIsBoosted,
            squadType: squadType,
            squadHomeRoom: squadHomeRoom,
            SquadMembersCurrent: [],
            squadposition: [25, 25],
            SquadMembersGoal: SquadMembers,
            squadisready: false,
            squadcreationtime: Game.time,
            squaddisolvetime: Game.time + 1500
        };
    },
    combatMove: function(creep, avoidarray, avoidclosest) // check if creep has damage parts
    {
        let goals = _.map(avoidarray, function(host)
        {
            return {
                pos: host.pos,
                range: 3
            };
        });
        let patha = PathFinder.search(creep.pos, goals,
        {
            flee: true
        }).path;
        creep.moveByPath(patha);
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
    checkglobaltasks: function(creep)
    {
        
        
        if(creep.memory.memstruct.tasklist.length == 0)
        {
            return true;
        }
        else
        if(creep.memory.memstruct.tasklist[0] != undefined)
        {
            

            
            if(creep.memory.memstruct.tasklist[0][0] == "joinSquad")
            {
                if(creep.ticksToLive < 1500)
                {
                    var tempid = creep.id;
                    //  console.log("adding creep to squad - " + tempid);
                    try
                    {
                        Memory.squadObject[creep.memory.memstruct.tasklist[0][1]].SquadMembersCurrent.push(tempid);
                        this.loopTasks(creep);
                    }
                    catch (e)
                    {
                        //     console.log("missing squad");
                    }
                    //  creep.say(creep.memory.memstruct.tasklist[0][1]);
                    // creep.say(creep.id);
                    // creep.memory.memstruct.tasklist.splice(0, 1);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "withdraw")
            {
                
                 if(creep.store.getFreeCapacity() == 0 || creep.ticksToLive < 200  )
                    {
                        this.loopTasks(creep);
                    }
                
                
           //     ["withdraw" , "5f4e3d6138522b1096393b7d","tissue",optional value]
           
           // ad factory terminal storoage indicators
         
           
           
           
           
           
           
           
           
           
                const targ = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                
                if(creep.memory.memstruct.tasklist[0].length == 3){
               var a = creep.withdraw(targ, creep.memory.memstruct.tasklist[0][2]);
                }else{
                    
                    if( creep.memory.memstruct.tasklist[0][3] > creep.store.getFreeCapacity()){
                         creep.memory.memstruct.tasklist[0][3] = creep.store.getFreeCapacity();
                    }
                    
                    
                    
                    
                    
                     var a = creep.withdraw(targ, creep.memory.memstruct.tasklist[0][2] , creep.memory.memstruct.tasklist[0][3] );
                }
               
               
               
                if(a == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targ);
                }else if(a == 0){
                       this.loopTasks(creep);
                }else if(a == -6){ 
                      this.loopTasks(creep); 
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "transfer")
            {
                
          
                
           //     ["withdraw" , "5f4e3d6138522b1096393b7d","tissue"]
                const targ = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                
                
                
                              if(creep.memory.memstruct.tasklist[0].length == 3){
              var a = creep.transfer(targ, creep.memory.memstruct.tasklist[0][2]);
                }else{
                    var a = creep.transfer(targ, creep.memory.memstruct.tasklist[0][2], creep.memory.memstruct.tasklist[0][3] );
                }
               
                
                
                 
                if(a == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targ);
                }else if(a == 0){
                       this.loopTasks(creep);
                }else if(a == -6){ 
                      this.loopTasks(creep); 
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "steal")
            {
                
                 if(creep.store.getFreeCapacity() == 0 || creep.ticksToLive < 200  )
                    {
                        this.loopTasks(creep);
                    }
                /*
                
                
                           var     storagemain = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_STORAGE ||  structure.structureType == STRUCTURE_TERMINAL           || structure.structureType == STRUCTURE_FACTORY  ) && structure.store.getUsedCapacity() > 100;
                    }
                });
                
                
                */
                
                
                
                
                
                
                
                
                
                
                
           //     ["withdraw" , "5f4e3d6138522b1096393b7d","tissue"]////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                const targ = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                
                
        
    var resourcesToSteal = Object.keys(targ.store);
    var listvalues = Object.values(targ.store);
    var steal=  ["XGHO2", "XUH2O", "XLHO2", "XZH2O", "XZHO2",  "XKHO2" ,"X","power", 'utrium_bar','lemergium_bar','zynthium_bar','keanium_bar','ghodium_melt','oxidant','reductant','purifier','battery','composite','crystal','liquid','wire','switch','transistor','microchip','circuit','cell','phlegm','tissue','muscle','organoid','alloy','tube','fixtures','frame','hydraulics','condensate','concentrate','extract','spirit','emanation'];    
        var index=0;
                 for(a = 0; a < resourcesToSteal.length;a++)
                         {
             
                
                  var found = false;
                         for(q = 0; q < steal.length; q++)
                         {
                             if(steal[q] == resourcesToSteal[a])
                             {
                                 found = true;
                             }
                         }
                            if(found == true){
                               index=a; 
                            }
                            
                         }
                
                
                
               var a = creep.withdraw(targ, resourcesToSteal[index]);
                if(a == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targ);
                }else if(a == 0){
                    creep.say("YOINK");
                  
                }else if(a == -6){ 
                      
                }
                
                
                
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "basicrenew")
            {
                var spawnss = creep.room.find(FIND_MY_SPAWNS);
                creep.moveTo(spawnss[0],
                {
                    visualizePathStyle:
                    {
                        stroke: '#ffaa00'
                    }
                });
                try
                {
                    spawnss[0].renewCreep(creep);
                }
                catch (e)
                {}
                console.log(spawnss[0].renewCreep(creep));
                var found = false;
                for(var ik = 0; ik < creep.body.length; ik++)
                {
                    if(creep.body[ik] == CLAIM)
                    {
                        found = true;
                    }
                }
                var tmp = 1450;
                if(found == true)
                {
                    tmp = 590;
                }
                if(creep.ticksToLive > tmp)
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "deposit")
            {
                if(creep.store.getUsedCapacity() > 0)
                {
                    if(creep.room.terminal != undefined)
                    {
                        var targ = creep.room.terminal;
                    }
                    else if(creep.room.storage != undefined)
                    {
                        var targ = creep.room.storage;
                    }
                    else
                    {}
                    const resourcevalues = Object.values(creep.store);
                    const resourcekeys = Object.keys(creep.store);
                    var range = creep.pos.getRangeTo(targ);
                    if(range <= 1)
                    {
                        creep.transfer(targ, resourcekeys[0], resourcevalues[0]);
                    }
                    else
                    {
                        creep.moveTo(targ,
                        {
                            reusePath: 20,
                            visualizePathStyle:
                            {
                                stroke: '#ffaa00'
                            },
                            maxRooms: 0
                        });
                    }
                }
                else
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "mineCoridor")
            {
                var deposoits = creep.room.find(FIND_DEPOSITS);
                var droppedresources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
                {
                    filter: (res) =>
                    {
                        return (res.resourceType != RESOURCE_ENERGY);
                    }
                });
                var tombstones = creep.pos.findClosestByPath(FIND_TOMBSTONES,
                {
                    filter: (tomb) =>
                    {
                        return (tomb.store.getUsedCapacity() != tomb.store.getUsedCapacity(RESOURCE_ENERGY)) || (tomb.store.getUsedCapacity(
                            RESOURCE_ENERGY) > 30000000);
                    }
                });
                if(creep.store.getUsedCapacity(RESOURCE_ENERGY) != 0)
                {
                    creep.drop(RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY));
                }
                if(droppedresources != undefined)
                {
                    var range = creep.pos.getRangeTo(droppedresources);
                    if(range <= 1)
                    {
                        creep.pickup(droppedresources);
                    }
                    else
                    {
                        creep.moveTo(droppedresources,
                        {
                            reusePath: range,
                            visualizePathStyle:
                            {
                                stroke: '#ffaa00'
                            }
                        });
                    }
                }
                else if(tombstones != undefined)
                {
                    creep.say("tomb");
                    var object = Game.getObjectById(tombstones);
                    var resourcekeys = [RESOURCE_ENERGY];
                    var range = creep.pos.getRangeTo(tombstones);
                    if(range <= 1)
                    {
                        creep.withdraw(tombstones, resourcekeys[0]);
                    }
                    else
                    {
                        creep.moveTo(tombstones,
                        {
                            reusePath: range,
                            visualizePathStyle:
                            {
                                stroke: '#ffaa00'
                            }
                        });
                    }
                }
                else
                {
                    if(deposoits.length != 0)
                    {
                        if(creep.harvest(deposoits[0]) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(deposoits[0]);
                        }
                    }
                    if(deposoits.length > 1)
                    {
                        if(deposoits[0].cooldown > 25)
                        {
                            if(creep.harvest(deposoits[1]) == ERR_NOT_IN_RANGE)
                            {
                                creep.moveTo(deposoits[1]);
                            }
                        }
                    }
                    var hostile = creep.room.find(FIND_HOSTILE_CREEPS);
                    if(creep.store.getFreeCapacity() == 0 || creep.ticksToLive < 200 || hostile.length != 0 && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
                    {
                        this.loopTasks(creep);
                    }
                }
                if(creep.store.getFreeCapacity() == 0 && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "createslave") // used by master
            {
                creep.say("create healer");
                var bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]; // add a function to caUTOBUILD
                Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(bgodyparts, creep.name + "'s heal slave",
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: creep.memory.memstruct.spawnRoom,
                            tasklist: [
                                ["findMaster", creep.id]
                            ],
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: false,
                            hastask: false
                        }
                    }
                });
                if(creep.memory.duoId == undefined)
                {}
                else
                {
                    creep.say("a");
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "createslaveBOOST") // used by master// only rcl8
            {
                creep.say("create healer");
                var bgodyparts = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]; // add a function to caUTOBUILD
                Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(bgodyparts, creep.name + "'s heal slave",
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: creep.memory.memstruct.spawnRoom,
                            tasklist: [
                                ["boosAllMax"],
                                ["findMaster", creep.id]
                            ],
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: false,
                            hastask: false
                        }
                    }
                });
                if(creep.memory.duoId == undefined)
                {}
                else
                {
                    creep.say("a");
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "findMaster") // used by slave
            {
                const master = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                if(master == null)
                {
                    creep.suicide();
                }
                try
                {
                    creep.moveTo(master);
                }
                catch (e)
                {}
                if(master != undefined && master != null)
                {
                    if(master.memory.duoId == undefined)
                    {
                        master.memory.duoId = creep.id;
                    }
                    else
                    {
                        if(creep.hits == creep.hitsMax)
                        {
                            creep.heal(master);
                        }
                        else
                        {
                            if(Game.time & 2 == 0)
                            {
                                creep.heal(master);
                            }
                            else
                            {
                                creep.heal(creep);
                            }
                        }
                    }
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "patrolroom")
            {
                creep.say("patrolroom");
                var targets = creep.room.find(FIND_HOSTILE_CREEPS);
                var targposition = new RoomPosition(25, 25, creep.memory.memstruct.tasklist[0][1]);
                var pos1 = creep.pos;
                var pos2 = targposition;
                const range = creep.pos.getRangeTo(targposition);
                if(range > 23 && targets.length == 0)
                {
                    creep.say("moveTo");
                    creep.moveTo(targposition);
                    Game.map.visual.line(creep.pos, targposition,
                    {
                        color: '#090900',
                        lineStyle: 'solid'
                    });
                }
                else
                {
                    if(targets.length != 0)
                    {
                        creep.say("hostile");
                        return true;
                    }
                    else
                    {
                        creep.say("repeat");
                        this.loopTasks(creep);
                    }
                }
                var tombstones = creep.pos.findClosestByPath(FIND_TOMBSTONES,
                {
                    filter: (tomb) =>
                    {
                        return (tomb.store.getUsedCapacity() != tomb.store.getUsedCapacity(RESOURCE_ENERGY)) || (tomb.store.getUsedCapacity(
                            RESOURCE_ENERGY) > 300);
                    }
                });
                var droppedresources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
                {
                    filter: (res) =>
                    {
                        return (res.resourceType != RESOURCE_ENERGY) || (res.amount > 200);
                    }
                });
                if(droppedresources != undefined || tombstones != undefined)
                {
                    this.summonHauler(creep.room.name, creep.memory.memstruct.spawnRoom);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "gatherLooseResources")
            {
                if(creep.store.getFreeCapacity() == 0)
                {
                    this.loopTasks(creep);
                }
                else
                {
                    var droppedresources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                    var tombstones = creep.pos.findClosestByRange(FIND_TOMBSTONES);
                    if(droppedresources != undefined)
                    {
                        var range = creep.pos.getRangeTo(droppedresources);
                        if(range <= 1)
                        {
                            creep.pickup(droppedresources);
                        }
                        else
                        {
                            creep.moveTo(droppedresources,
                            {
                                reusePath: range,
                                visualizePathStyle:
                                {
                                    stroke: '#ffaa00'
                                }
                            });
                        }
                    }
                    else if(tombstones != undefined)
                    {
                        creep.say("tomb");
                        var object = Game.getObjectById(tombstones);
                        var resourcekeys = Object.keys(tombstones.store);
                        var range = creep.pos.getRangeTo(tombstones);
                        if(range <= 1)
                        {
                            creep.withdraw(tombstones, resourcekeys[0]);
                        }
                        else
                        {
                            creep.moveTo(tombstones,
                            {
                                reusePath: range,
                                visualizePathStyle:
                                {
                                    stroke: '#ffaa00'
                                }
                            });
                        }
                    }
                    else
                    {
                        this.loopTasks(creep);
                    }
                    ////////////////
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "gatherstoredResources") /////////////////////////////////////////////////////////////////////////
            {
                if(creep.store.getFreeCapacity() == 0)
                {
                    this.loopTasks(creep);
                }
                else
                {
                    var targ = creep.pos.findClosestByPath(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_STORAGE) && structure.store.getUsedCapacity() > 0;
                        }
                    });
                    if(targ == undefined)
                    {
                        targ = creep.pos.findClosestByRange(FIND_STRUCTURES,
                        {
                            filter: (structure) =>
                            {
                                return ((structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity() > 0);
                            }
                        });
                    }
                    if(targ != undefined)
                    {
                        var resourcekeys = Object.keys(targ.store);
                        var range = creep.pos.getRangeTo(targ);
                        if(range <= 1)
                        {
                            creep.withdraw(targ, resourcekeys[0]);
                        }
                        else
                        {
                            creep.moveTo(targ,
                            {
                                reusePath: range,
                                visualizePathStyle:
                                {
                                    stroke: '#ffaa00'
                                }
                            });
                        }
                    }
                    else
                    {
                        this.loopTasks(creep);
                    }
                    ////////////////
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "downgrade")
            {
                if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(creep.room.controller,
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "claim")
            {
                if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(creep.room.controller,
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "boost") // [0][0] boost [0][1] boosy mineral typ3e [0][2]number of bodyparts
            {
                try
                {
                    var flagmid = Game.flags[creep.room.name];
                    var boosisready = false;
                    var boostlab;
                    creep.memory.memstruct.boosted = true;
                    var creeper = Game.creeps["resourcemover" + creep.room.name];
                    if((creep.pos.x == flagmid.pos.x - 2 && creep.pos.y == flagmid.pos.y - 3) || (creep.pos.x == flagmid.pos.x - 1 && creep.pos.y == flagmid.pos.y - 3) || (creep.pos.x == flagmid.pos.x - 3 && creep.pos.y == flagmid.pos.y - 3) || (creep.pos.x == flagmid.pos.x - 3 && creep.pos.y == flagmid.pos.y - 2))
                    {
                        if(creeper != undefined)
                        {
                            if(creeper.memory.neededBoost != "cleanup")
                            {
                                var temp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, flagmid.pos.x - 2, flagmid.pos.y - 2);
                                var creeper = Game.creeps["resourcemover" + creep.room.name];
                                for(var i = 0; i < temp.length; i++)
                                {
                                    if(temp[i].structureType == STRUCTURE_LAB)
                                    {
                                        boostlab = temp[i];
                                        if(boostlab.store.getUsedCapacity("energy") < 1500)
                                        {
                                            creeper.memory.neededBoost = "";
                                            creeper.say("lab E");
                                        }
                                        else if(boostlab.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][1]) > creep.memory.memstruct.tasklist[0][2] * 30)
                                        {
                                            // lab boos creep here
                                            creep.say("hasboost");
                                            boostlab.boostCreep(creep, creep.memory.memstruct.tasklist[0][2])
                                            this.loopTasks(creep);
                                            creeper.memory.neededBoost = "cleanup";
                                        }
                                        else if(boostlab.store.getUsedCapacity() - boostlab.store.getUsedCapacity("energy") == 0 && Game.creeps["resourcemover" + creep.room.name].store.getUsedCapacity("power") == 0) // minus energy mayby
                                        {
                                            var creeper = Game.creeps["resourcemover" + creep.room.name];
                                            creeper.say("fi1ll");
                                            if(creeper != undefined)
                                            {
                                                if(creeper.memory.neededBoost == "" || creeper.memory.neededBoost == undefined || creeper.memory.neededBoost == null)
                                                {
                                                    creeper.memory.neededBoost += creep.memory.memstruct.tasklist[0][1];
                                                }
                                            }
                                        }
                                        else if(boostlab.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][1]) < creep.memory.memstruct.tasklist[0][2] * 30 && creeper.memory.neededBoost != "cleanup" && creeper.store.getUsedCapacity("power") == 0) // minus energy mayby
                                        {
                                            var creeper = Game.creeps["resourcemover" + creep.room.name];
                                            creeper.say("fill2");
                                            if(creeper != undefined)
                                            {
                                                if(creeper.memory.neededBoost == "" || creeper.memory.neededBoost == undefined || creeper.memory.neededBoost == null)
                                                {
                                                    creeper.memory.neededBoost += creep.memory.memstruct.tasklist[0][1];
                                                }
                                            }
                                        }
                                        else
                                        {
                                            creeper.memory.neededBoost = "";
                                            creeper.say("a");
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        var roompos = new RoomPosition(flagmid.pos.x - 2, flagmid.pos.y - 2, creep.room.name);
                        creep.moveTo(roompos);
                    }
                }
                catch (e)
                {
                    creep.say("boost fail");
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "moveToRoom")
            {
                //   var targetRoomFlag = Game.flags[creep.memory.memstruct.tasklist[0][1]];
                var targposition = new RoomPosition(25, 25, creep.memory.memstruct.tasklist[0][1]);
                try
                {
                    creep.heal(creep);
                }
                catch (e)
                {}
                try
                {
                    creep.rangedMassAttack();
                }
                catch (e)
                {}
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
                        this.combatMove(creep, targetArr, target);
                    }
                }
                else
                {
                    this.loopTasks(creep);
                }
            }
            
            else if(creep.memory.memstruct.tasklist[0][0] == "forcemoveToRoom")
            {
                //   var targetRoomFlag = Game.flags[creep.memory.memstruct.tasklist[0][1]];
                var targposition = new RoomPosition(25, 25, creep.memory.memstruct.tasklist[0][1]);
                try
                {
                    creep.heal(creep);
                }
                catch (e)
                {}
                try
                {
                    creep.rangedMassAttack();
                }
                catch (e)
                {}
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
            }
            
            
            
            else if(creep.memory.memstruct.tasklist[0][0] == "attackMoveToRoom")
            {
                var targetRoomFlag = Game.flags[creep.memory.memstruct.tasklist[0][1]];
                var pos1 = creep.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creep.pos.getRangeTo(targetRoomFlag.pos);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    var targets = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    var range2 = creep.pos.getRangeTo(targets);
                    if(range2 <= 4)
                    {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                        var targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                        var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                        if(targets.length > 0)
                        {
                            creep.rangedAttack(targets[0]);
                        }
                        if(creep.hits < creep.hitsMax)
                        {
                            creep.heal(creep);
                        }
                        if(creep.memory.attackrole == "ranger")
                        { // long range creeps here 
                            var range = creep.pos.getRangeTo(target);
                            if(range > 3)
                            {
                                creep.moveTo(target);
                            }
                            if(range < 3 || (creep.hits + 300 < creep.hitsMax && range < 5))
                            {
                                creepfunctions.combatMove(creep, targetArr, target);
                            }
                        }
                        else
                        {
                            if(range > 1)
                            {
                                creep.moveTo(target);
                            }
                        }
                    }
                    else
                    {
                        creep.moveTo(targetRoomFlag.pos);
                    }
                }
                else
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "moveTo")
            {
                try
                {
                    creep.heal(creep);
                }
                catch (e)
                {}
                var targetposition = new RoomPosition(creep.memory.memstruct.tasklist[0][1], creep.memory.memstruct.tasklist[0][2], creep.room.name);
                var range = creep.pos.getRangeTo(targetposition);
                if(range != 0)
                {
                    creep.moveTo(targetposition);
                    // creep.say(range);
                }
                else
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "moveToLoose")
            {
                var targetposition = new RoomPosition(creep.memory.memstruct.tasklist[0][1], creep.memory.memstruct.tasklist[0][2], creep.room.name);
                var range = creep.pos.getRangeTo(targetposition);
                if(range > 2)
                {
                    creep.moveTo(targetposition);
                    creep.say(range);
                }
                else
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "waituntil")
            {
                if(Game.time < creep.memory.memstruct.tasklist[0][1])
                {
                    creep.say("wait");
                }
                else
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "renewfull")
            {
                this.movehomeandrenew(creep);
                var found = false;
                for(var ik = 0; ik < creep.body.length; ik++)
                {
                    if(creep.body[ik] == CLAIM)
                    {
                        found = true;
                    }
                }
                var tmp = 1450;
                if(found == true)
                {
                    tmp = 590;
                }
                if(creep.ticksToLive > tmp)
                {
                    this.loopTasks(creep);
                }
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "createPatrolBetweenTwoRooms")
            {
                var a = creep.name;
                this.initializeSquad(a, [creep.memory.memstruct.tasklist[0][1], creep.memory.memstruct.tasklist[0][2]], false, "SoloPatrol", creep.memory.memstruct.spawnRoom,
                {
                    a: []
                });
                this.loopTasks(creep);
            }
            else if(creep.memory.memstruct.tasklist[0][0] == "boosAllMax") // used only by combat will deal with dismantel attack heal ranged_attack tough and move only 
            {
                var numberOfHealParts = 0;
                var numberOfAttackParts = 0;
                var numberOfRangedParts = 0;
                var numberOfMoveParts = 0;
                var numberOfWorkParts = 0;
                var numberOfToughParts = 0;
                var arraytopush = [];
                for(var j = 0; j < creep.body.length; j++)
                {
                    if(creep.body[j].type == HEAL)
                    {
                        numberOfHealParts++;
                    }
                    if(creep.body[j].type == ATTACK)
                    {
                        numberOfAttackParts++;
                    }
                    if(creep.body[j].type == RANGED_ATTACK)
                    {
                        numberOfRangedParts++;
                    }
                    if(creep.body[j].type == WORK)
                    {
                        numberOfWorkParts++;
                    }
                    if(creep.body[j].type == MOVE)
                    {
                        numberOfMoveParts++;
                    }
                    if(creep.body[j].type == TOUGH)
                    {
                        numberOfToughParts++;
                    }
                }
                if(numberOfHealParts != 0)
                {
                    arraytopush.push(["boost", "XLHO2", numberOfHealParts]);
                }
                if(numberOfAttackParts != 0)
                {
                    arraytopush.push(["boost", "XUH2O", numberOfAttackParts]);
                }
                if(numberOfRangedParts != 0)
                {
                    arraytopush.push(["boost", "XKHO2", numberOfRangedParts]);
                }
                if(numberOfWorkParts != 0)
                {
                    arraytopush.push(["boost", "XZH2O", numberOfWorkParts]);
                }
                if(numberOfMoveParts != 0)
                {
                    arraytopush.push(["boost", "XZHO2", numberOfMoveParts]);
                }
                if(numberOfToughParts != 0)
                {
                    arraytopush.push(["boost", "XGHO2", numberOfToughParts]);
                }
                this.loopTasks(creep);
                for(var i = 0; i < creep.memory.memstruct.tasklist.length; i++)
                {
                    arraytopush.push(creep.memory.memstruct.tasklist[i]);
                }
                creep.memory.memstruct.tasklist = arraytopush;
            }
            else     
        {
           creep.memory.memstruct.tasklist.splice(0, 1);
        }
        }
        else
        {
             creep.memory.memstruct.tasklist.splice(0, 1);
            return true;
        }
    },
    summonHauler: function(targroom, haulerHome)
    {
        var haulersFREE = Game.rooms[haulerHome].find(FIND_MY_CREEPS,
        {
            filter: (creep) =>
            {
                return (creep.memory.role == "mover" && creep.memory.memstruct.tasklist.length == 0);
            }
        });
        var homeflag = Game.flags[haulerHome];
        if(homeflag.memory.flagstruct.haulerOUT == undefined)
        {
            homeflag.memory.flagstruct.haulerOUT = Game.time;
        }
        if(Game.time - homeflag.memory.flagstruct.haulerOUT > 80 && haulersFREE.length != 0)
        { // if a mover was NOT recently sent out
            console.log("summoning hauler");
            haulersFREE[0].memory.memstruct.tasklist = [
                ["deposit"],
                ["moveToRoom", targroom],
                ["gatherLooseResources"],
                ["moveToRoom", haulerHome],
                ["deposit"]
            ];
            homeflag.memory.flagstruct.haulerOUT = Game.time;
        }
    },
    /*
    USED BY: 
        most eventually ranger primarily
    
    
    
    */
    findDroppedEnergy: function(creep)
    {
        var droppedresources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
        {
            filter: (res) =>
            {
                return (res.resourceType == RESOURCE_ENERGY) && (res.amount > creep.store.getFreeCapacity());
            }
        });
        if(droppedresources != undefined)
        {
            var range = creep.pos.getRangeTo(droppedresources);
            if(range <= 1)
            {
                creep.pickup(droppedresources);
            }
            else
            {
                creep.moveTo(droppedresources,
                {
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
    movehomeandrenew: function(creep, homeroom, timeer)
    {
        // check iff the renew spot is free and room is able to renew
        if(creep.memory.isrenweing == undefined)
        {
            creep.memory.isrenweing = false;
        }
        if(creep.ticksToLive < timeer)
        {
            creep.memory.isrenweing = true;
        }
        if(creep.ticksToLive > 1400)
        {
            creep.memory.isrenweing = false;
        }
        if(creep.memory.isrenweing)
        {
            if(creep.room.name == homeroom)
            {
                if(creep.memory.isrenweing)
                {
                    var spawnss = creep.room.find(FIND_MY_SPAWNS);
                    creep.moveTo(spawnss[0],
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
            }
            else
            {
                var targetRoomFlag = Game.flags[homeroom];
                var pos1 = creep.pos;
                var pos2 = targetRoomFlag.pos;
                const range = creep.pos.getRangeTo(targetRoomFlag.pos);
                if(range > 23)
                { // might cause bug on nxt room wall 
                    creep.moveTo(targetRoomFlag.pos);
                    Game.map.visual.line(creep.pos, targetRoomFlag.pos,
                    {
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
    stockstorage: function(creep)
    {
        var storageactual = creep.room.storage;
        if(storageactual != undefined)
        {
            if(storageactual.store.getUsedCapacity() < 20000)
            {
                var range = creep.pos.getRangeTo(storageactual);
                if(range <= 1)
                {
                    creep.transfer(storageactual, RESOURCE_ENERGY);
                }
                else
                {
                    creep.moveTo(storageactual,
                    {
                        reusePath: range
                    });
                }
                creep.memory.hastask = false;
            }
        }
    },
    /*
    USED BY: 
        jack
        mover
        repairer
    */
    findfullcontainers: function(creep, energyleveltodrawfrom)
    {
        var containers = creep.pos.findClosestByRange(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return s.structureType == STRUCTURE_CONTAINER && s.store.getUsedCapacity("energy") > energyleveltodrawfrom;
            }
        });
        if(containers == undefined)
        {
            containers = creep.pos.findClosestByRange(FIND_STRUCTURES,
            {
                filter: (s) =>
                {
                    return s.structureType == STRUCTURE_LINK && s.store.getUsedCapacity("energy") > 500;
                }
            });
        }
        if(containers != undefined && containers != null)
        {
            if(creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(containers,
                {
                    visualizePathStyle:
                    {
                        stroke: '#ffaa00'
                    }
                });
            }
            creep.memory.hastask = true;
        }
        else
        {
            var storageMain = creep.room.storage;
            if(storageMain != undefined && storageMain.store.getUsedCapacity() > 50000)
            {
                var range = creep.pos.getRangeTo(storageMain);
                if(range <= 1)
                {
                    creep.withdraw(storageMain, RESOURCE_ENERGY);
                }
                else
                {
                    creep.moveTo(storageMain,
                    {
                        reusePath: range,
                        visualizePathStyle:
                        {
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
    checklocaltasks: function(creep)
    {
        if(creep.memory.tasklist[0] == "moveto")
        {
            const path = creep.pos.findPathTo(creep.memory.targetroom);
            if(path.length > 0)
            {
                creep.move(path[0].direction);
            }
            else
            {
                creep.memory.tasklist[0].splice(0, 1);
            }
        }
    },
    /*
    USED BY: 
        jack
    
    
    
    */
    repairbuildings: function(creep)
    {
        var repairtarg = creep.pos.findClosestByRange(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return (s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_CONTAINER) && s.hits < s.hitsMax * 0.7;
            }
        });
        if(repairtarg)
        {
            var range = creep.pos.getRangeTo(repairtarg);
            if(range <= 3)
            {
                creep.repair(repairtarg);
            }
            else
            {
                creep.moveTo(repairtarg,
                {
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
    repairbuildingsfull: function(creep)
    {
        var repairtarg = creep.pos.findClosestByRange(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return (s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART) && s.hits < s.hitsMax * 0.99;
            }
        });
        if(repairtarg)
        {
            var range = creep.pos.getRangeTo(repairtarg);
            if(range <= 3)
            {
                creep.repair(repairtarg);
            }
            else
            {
                creep.moveTo(repairtarg,
                {
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
    upkeepwalls: function(creep)
    {
        var repairtarg = creep.pos.findClosestByRange(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return (s.structureType == STRUCTURE_WALL && s.hits < s.hitsMax * 0.1) || (s.structureType == STRUCTURE_RAMPART && s.hits < s.hitsMax * 0.5);
            }
        });
        if(repairtarg)
        {
            var range = creep.pos.getRangeTo(repairtarg);
            if(range <= 3)
            {
                creep.repair(repairtarg);
            }
            else
            {
                creep.moveTo(repairtarg,
                {
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
    upgradecontroller: function(creep)
    {
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(creep.room.controller,
            {
                visualizePathStyle:
                {
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
    stockbuildingswithenergy: function(creep)
    {
        var buildingsneedingenergy = creep.room.find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (
                    (structure.structureType == STRUCTURE_EXTENSION && structure.energy < 50) || (structure.structureType == STRUCTURE_CONTAINER && structure.store.energy < 500) || (structure.structureType == STRUCTURE_SPAWN && structure.energy < 300));
            }
        });
        creep.say(buildingsneedingenergy.length);
        if(buildingsneedingenergy.length > 0)
        {
            if(creep.transfer(creep.pos.findClosestByPath(buildingsneedingenergy), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(creep.pos.findClosestByPath(buildingsneedingenergy),
                {
                    visualizePathStyle:
                    {
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
    
    
    
    
        
    mineCorridor: function(creep)
    {
    
    
    
                             const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                         var deposoits = creep.room.find(FIND_DEPOSITS,
        {
            filter: (dep) =>
            {
                return (dep.cooldown <10 );
            }
        });
                         if(deposoits.length != 0 && Game.rooms[creep.memory.memstruct.spawnRoom].controller.level > 4)
                         {
                             if(!target)
                             {
                                 var bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
                                 Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(bgodyparts, 'coridor miner' + creep.room.name,
                                 {
                                     memory:
                                     {
                                         role: 'multi',
                                         memstruct:
                                         {
                                             spawnRoom: creep.memory.memstruct.spawnRoom,
                                             tasklist: [
                                                 ["moveToRoom", creep.room.name],
                                                 ["mineCoridor"],
                                                 ["moveToRoom", creep.memory.memstruct.spawnRoom],
                                                 ["deposit"],
                                                 ["repeat", 4]
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
                             else
                             {
                                 var bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK];
                                 var corridorRoomList = Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.corridorRooms;
                                 var tmptasklist = [];
                                 if(corridorRoomList == undefined){
                                      Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.corridorRooms=[];
                                 }
                                 tmptasklist.push(["createslave", "healer"]);
                                 for(var c = 0; c < corridorRoomList.length; c++)
                                 {
                                     tmptasklist.push(["patrolroom", corridorRoomList[c]]);
                                 }
                                 tmptasklist.push(["repeat", corridorRoomList.length]);
                                 Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(bgodyparts, 'coridor guard' + creep.memory.memstruct.spawnRoom,
                                 {
                                     memory:
                                     {
                                         role: 'guard',
                                         attackrole: "chasedown",
                                         memstruct:
                                         {
                                             spawnRoom: creep.memory.memstruct.spawnRoom,
                                             tasklist: tmptasklist,
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
    
    
    
    
    
 },
    
    
    
    
    
    
    
    
    
    
    
    
    
    buildstructs: function(creep)
    {
        var constructionsites = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if(constructionsites != undefined)
        {
            var range = creep.pos.getRangeTo(constructionsites);
            if(range <= 3)
            {
                creep.build(constructionsites);
            }
            else
            {
                creep.moveTo(constructionsites,
                {
                    reusePath: range
                });
            }
            creep.memory.hastask = true;
        }
    }
}
module.exports = creepfunctions;