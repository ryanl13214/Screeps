var spwan = {
    run: function(roomname, defconstruct, storagevalue, roomExits, creepsinroom)
    {
        ///////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        if(Game.spawns[roomname + "1"] != undefined)
        {
            if(Game.spawns[roomname + "1"].spawning)
            {
                if(Game.spawns[roomname + "1"].spawning.name == 'resourcemover' + roomname)
                {
                    Game.spawns[roomname + "1"].spawning.setDirections([BOTTOM]);
                }
                else
                {
                    Game.spawns[roomname + "1"].spawning.setDirections([TOP, TOP_LEFT]);
                }
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(Game.spawns[roomname] != undefined && Game.spawns[roomname].spawning)
        {
            if(Game.spawns[roomname].spawning.name == 'towermover' + roomname)
            {
                Game.spawns[roomname].spawning.setDirections([TOP_LEFT]);
            }
            else if(Game.rooms[roomname].controller.level < 8)
            {
                Game.spawns[roomname].spawning.setDirections([RIGHT, LEFT, TOP, BOTTOM_RIGHT, BOTTOM]);
            }
            else
            {
                Game.spawns[roomname].spawning.setDirections([RIGHT, BOTTOM_RIGHT, BOTTOM]);
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(Game.spawns[roomname + "2"] != undefined)
        {
            if(Game.spawns[roomname + "2"].spawning)
            {
                Game.spawns[roomname + "2"].spawning.setDirections([TOP_LEFT, BOTTOM_RIGHT]);
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        for(var i = 0; i < spawnss.length; i++)
        {
            //       try{
            var ajacentcreepstorenew = spawnss[i].pos.findInRange(FIND_MY_CREEPS, 1,
            {
                filter: (creep) =>
                {
                    return (creep.memory.memstruct.boosted == false && (creep.memory.memstruct.opportuniticRenew == true || creep.memory.memstruct.moveToRenew == true) && creep.ticksToLive < 1480);
                }
            });
            if(ajacentcreepstorenew.length != 0 && storagevalue != 0)
            {
                spawnss[i].renewCreep(ajacentcreepstorenew[0]);
            }
        }
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(Game.time % 30 == 0)
        {
            var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
            var energycurrentlyavailable = Game.rooms[roomname].energyAvailable;
            var repairers = _.filter(creepsinroom, (creep) => creep.memory.role == 'repair');
            var towermover = _.filter(creepsinroom, (creep) => creep.memory.role == 'towermover');
            var upgraders = _.filter(creepsinroom, (creep) => creep.memory.role == 'upgrader');
            var resourcemover = _.filter(creepsinroom, (creep) => creep.memory.role == 'resmover');
            var extractor = _.filter(creepsinroom, (creep) => creep.memory.role == 'extractor');
            var nextroomharvester = _.filter(creepsinroom, (creep) => creep.memory.role == 'nextroom');
            var scouts = _.filter(creepsinroom, (creep) => creep.memory.role == 'scout');
            var numberofguardingcreeps = _.filter(creepsinroom, (creep) => creep.memory.role == 'guard');
            var harvesters = _.filter(creepsinroom, (creep) => creep.memory.role == 'harvester');
            var movers = _.filter(creepsinroom, (creep) => creep.memory.role == 'mover');
            var moveralt = _.filter(creepsinroom, (creep) => creep.memory.role == 'moveralt');
            //standard creep memory
            var memstruct = {
                spawnRoom: roomname,
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
            Game.flags[roomname].memory.flagstruct.spawnfree = false;
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        
        
        
        
        
        
        
        
        var wallsBreeched = false; 
        var targetsInsideWalls = Game.flags[roomname].pos.findInRange(FIND_HOSTILE_CREEPS,7);
        if(targetsInsideWalls.length != 0){
            wallsBreeched=true;
        }
        
        
        
        
        
        
        
        
        
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
            var extractorneeded = false;
            if(spawnss.length != 0)
            {
                var minerals = Game.rooms[roomname].find(FIND_MINERALS)[0].mineralAmount;
                if(minerals > 0)
                {
                    extractorneeded = true;
                }
            }
            var levelOfController = Game.rooms[roomname].controller.level;
            var moversneeded = 1;
            if(levelOfController < 6)
            {
                moversneeded = 4;
            }
            if(levelOfController == 6)
            {
                moversneeded = 2;
            }
            if(levelOfController == 7)
            {
                moversneeded = 2;
            }
            if(levelOfController > 7)
            {
                moversneeded = 1;
            }
            var multiplyrepairerrs = 1;
      
            var ups = 0;
           
            if(storagevalue > 800000 || defconstruct.defenceLevel != 10)
            {
                multiplyrepairerrs=5;
            }
            
             
            if(wallsBreeched){
                    multiplyrepairerrs=1;
                   moversneeded = 1; 
            }
            
            
            
            
    var brokenspawnstructure=false;
         var spawnmain =        Game.spawns[roomname];
            if(spawnmain= undefined){
                brokenspawnstructure=true;
          //      console.log(brokenspawnstructure);
             spawnmain=Game.rooms[roomname].find(FIND_MY_SPAWNS)[0];   
            }
               spawnmain=Game.rooms[roomname].find(FIND_MY_SPAWNS)[0];   
             //    console.log(brokenspawnstructure);
            
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////low energy management/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(storagevalue > 10000 && movers.length == 0 && moveralt.length < 2 && (energycurrentlyavailable != energyavailable && energycurrentlyavailable < 3500) )
            {
               spawnmain.spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY], 'moverMIN' + roomname,
                {
                    memory:
                    {
                        role: 'moveralt',
                        cpuUsed: 0,
                        roomtarg: roomname,
                        target: "a",
                        full: false,
                        memstruct: memstruct
                    }
                });
            }
            else if(storagevalue < 10000 && ((movers.length == 0 && moveralt.length < 2) || harvesters.length < 1) && (energycurrentlyavailable != energyavailable && energycurrentlyavailable < 3500) || brokenspawnstructure)
            {
               
               spawnmain.spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY], 'moverMIN' + roomname,
                {
                    memory:
                    {
                        role: 'moveralt',
                        cpuUsed: 0,
                        roomtarg: roomname,
                        target: "a",
                        full: false,
                        memstruct: memstruct
                    }
                });
                spawnmain.spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY], 'moverMIN2' + roomname,
                {
                    memory:
                    {
                        role: 'moveralt',
                        cpuUsed: 0,
                        roomtarg: roomname,
                        target: "a",
                        full: false,
                        memstruct: memstruct
                    }
                });
                if(movers.length > 0 || moveralt.length > 0)
                {
                    var numberofparts = Math.floor((energycurrentlyavailable - 550) / 150);
                    var bodyparts = [MOVE, MOVE, WORK, CARRY];
                    if(numberofparts > 6)
                    {
                        numberofparts = 6;
                    }
                    for(let j = 0; j < numberofparts; j++)
                    {
                        bodyparts.push(WORK);
                        bodyparts.push(MOVE);
                    }
                    var numberofparts = Math.floor((energycurrentlyavailable - 550) / 200);
                    var bpodypartsMOBILE = [MOVE, MOVE, WORK, CARRY];
                    if(numberofparts > 6)
                    {
                        numberofparts = 6;
                    }
                    for(let j = 0; j < numberofparts; j++)
                    {
                        bpodypartsMOBILE.push(WORK);
                        bpodypartsMOBILE.push(MOVE);
                        bpodypartsMOBILE.push(CARRY);
                    }
                    if(harvesters.length > 1)
                    {
                        spawnmain.spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY], 'moverMIN3' + roomname,
                        {
                            memory:
                            {
                                role: 'moveralt',
                                cpuUsed: 0,
                                roomtarg: roomname,
                                target: "a",
                                full: false,
                                memstruct: memstruct
                            }
                        });
                        spawnmain.spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY], 'moverMIN1' + roomname,
                        {
                            memory:
                            {
                                role: 'moveralt',
                                cpuUsed: 0,
                                roomtarg: roomname,
                                target: "a",
                                full: false,
                                memstruct: memstruct
                            }
                        });
                        spawnmain.spawnCreep(bodyparts, 'up1' + roomname,
                        {
                            memory:
                            {
                                role: 'upgrader',
                                sourcetarget: 0,
                                memstruct: memstruct
                            }
                        });
                        spawnmain.spawnCreep(bpodypartsMOBILE, 'rep' + roomname,
                        {
                            memory:
                            {
                                role: 'repair',
                                sourcetarget: 0,
                                memstruct: memstruct
                            }
                        });
                    }
                    if(harvesters.length == 0)
                    {
                        spawnmain.spawnCreep(bodyparts, 'harvester1' + roomname,
                        {
                            memory:
                            {
                                role: 'harvester',
                                sourcetarget: 1,
                                memstruct: memstruct
                            }
                        });
                    }
                    else
                    {
                        spawnmain.spawnCreep(bodyparts, 'harvester' + (harvesters[0].memory.sourcetarget + 1) % 2 + roomname,
                        {
                            memory:
                            {
                                role: 'harvester',
                                sourcetarget: (harvesters[0].memory.sourcetarget + 1) % 2,
                                memstruct: memstruct
                            }
                        });
                    }
                }
            }
           if(levelOfController > 3)
            {  
                //////////////////////end low energy management/////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                for(var i = 0; i < spawnss.length; i++)
                {
                    if(towermover.length  == 0 && spawnss[i].name == roomname && levelOfController >= 4 && storagevalue != 0)
                    {   
                    
                      var nukeIncoming =    Game.rooms[roomname].find(FIND_NUKES);
    
                    
                     var bpodyparts = [CARRY, CARRY, WORK, CARRY, CARRY];
                      
                                 if(storagevalue > 900000 && levelOfController < 6)
                        {
                         bpodyparts=[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY];
                        }
                            
                      
                        if(storagevalue > 900000 && levelOfController > 5 || nukeIncoming.length != 0)
                        {
                            bpodyparts= [CARRY, CARRY,  CARRY, CARRY,  CARRY, CARRY,  CARRY, CARRY ];
                          
                           var numberofparts = Math.floor((energyavailable - 700) / 100);
                           if(numberofparts > 40){numberofparts=40;}
                            
                            for(let j = 0; j < numberofparts; j++)
                            {
                            
                                bpodyparts.push(WORK);
                            }
                          
                          
                        }
             
                        
                        if(nukeIncoming.length != 0 && !wallsBreeched ){
                            
                            
                              if( Game.rooms[roomname].controller.level > 6){
                                    bpodyparts= [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY];
                                }
                                 if( Game.rooms[roomname].controller.level == 6 ){
                                         bpodyparts= [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY];
                                }
                                if( Game.rooms[roomname].controller.level == 5 ){
                                          bpodyparts= [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY];
                                }
                            
                            
                            
                            
                        }
                        
                        
                        
                        
                        
                        
                        spawnss[i].spawnCreep(bpodyparts, 'towermover' + roomname,
                        {
                            memory:
                            {
                                memstruct: memstruct,
                                role: 'towermover',
                                working: false
                            }
                        });
                        
                        
                        
                        
                        
                        
                    }
                    else if(resourcemover.length  == 0 && levelOfController > 5 && Game.rooms[roomname].terminal != undefined)
                    {
                        if(levelOfController == 8 && spawnss[i].name == roomname + "1")
                        {
                            spawnss[i].spawnCreep( [MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'resourcemover' + roomname,
                            {
                                memory:
                                {
                                    role: 'resmover',
                                    memstruct: memstruct
                                }
                            });
                        }
                        else if(levelOfController < 8)
                        {
                              spawnss[i].spawnCreep( [MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'resourcemover' + roomname,
                         {
                                memory:
                                {
                                    role: 'resmover',
                                    memstruct: memstruct
                                }
                            });
                        }
                    }
                    else if(harvesters.length < 2 && !wallsBreeched)
                    {
                        var numberofparts = Math.floor((energyavailable - 350) / 150);
                        if(levelOfController > 4)
                        {
                            var bodyparts = [CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                            var numberofparts = Math.floor((energyavailable - 350) / 150);
                        }
                        else
                        {
                            var bodyparts = [CARRY, MOVE, MOVE];
                            var numberofparts = Math.floor((energyavailable - 150) / 100);
                        }
                        if(numberofparts > 6)
                        {
                            numberofparts = 6;
                        }
                        // find power creeps with boost source
                        var boostharvesters = false;
                        var powerCreepList = Game.rooms[roomname].powerCreeps;
                        if(powerCreepList != undefined)
                        {
                            var listvalues = Object.values(powerCreepList);
                            for(var i = 0; i < listnumbers.length; i++)
                            {
                                if(listvalues[i].powers[PWR_REGEN_SOURCE] != undefined)
                                {
                                    boostharvesters = true;
                                }
                            }
                        }
                        if(roomname == "E24N3") //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        {
                            numberofparts = 12;
                            bodyparts.push(MOVE);
                            bodyparts.push(MOVE);
                            bodyparts.push(MOVE);
                            bodyparts.push(MOVE);
                        }
                        for(let j = 0; j < numberofparts; j++)
                        {
                            bodyparts.push(WORK);
                        }
                        if(harvesters.length == 0)
                        {
                            spawnss[i].spawnCreep(bodyparts, 'harvester1' + roomname,
                            {
                                memory:
                                {
                                    role: 'harvester',
                                    sourcetarget: 1,
                                    memstruct: memstruct
                                }
                            });
                        }
                        else
                        {
                            spawnss[i].spawnCreep(bodyparts, 'harvester' + (harvesters[0].memory.sourcetarget + 1) % 2 + roomname,
                            {
                                memory:
                                {
                                    role: 'harvester',
                                    sourcetarget: (harvesters[0].memory.sourcetarget + 1) % 2,
                                    memstruct: memstruct
                                }
                            });
                        }
                    }
                    else if(movers.length < moversneeded && levelOfController >= 3)
                    {
                        if(levelOfController < 8)
                        {
                            var bodyparts = Math.floor((energyavailable) / 100);
                            if(bodyparts > 25)
                            {
                                bodyparts = 25;
                            }
                            var bodypartsMOVER = [];
                            for(let j = 0; j < bodyparts; j++)
                            {
                                bodypartsMOVER.push(MOVE);
                                bodypartsMOVER.push(CARRY);
                            }
                        }
                        else
                        {
                            var bodypartsMOVER = [];
                            for(let j = 0; j < 16; j++)
                            {
                                bodypartsMOVER.push(MOVE);
                                bodypartsMOVER.push(CARRY);
                                bodypartsMOVER.push(CARRY);
                            }
                        }
                        spawnss[i].spawnCreep(bodypartsMOVER, 'mover' + Game.time,
                        {
                            memory:
                            {
                                role: 'mover',
                                cpuUsed: 0,
                                roomtarg: roomname,
                                target: "a",
                                full: false,
                                memstruct: memstruct
                            }
                        });
                    }
              
                    else if(repairers.length < 1 * multiplyrepairerrs && levelOfController > 2)
                    {
                        var bodyparts = [];
                        var numberofparts = Math.floor(energyavailable / 350);
                        if(numberofparts * 6 > 50)
                        {
                            numberofparts = Math.floor(50 / 6);
                        }
                        var bodyparts = [];
                        for(let i = 0; i < numberofparts; i++)
                        {
                            bodyparts.push(WORK);
                            bodyparts.push(CARRY);
                            bodyparts.push(CARRY);
                            bodyparts.push(MOVE);
                            bodyparts.push(MOVE);
                            bodyparts.push(MOVE);
                        }
                        spawnss[i].spawnCreep(bodyparts, 'repair' + Game.time,
                        {
                            memory:
                            {
                                role: 'repair',
                                cpuUsed: 0,
                                roomtarg: roomname,
                                sourcetarget: Game.time % 2,
                                full: false,
                                memstruct: memstruct
                            }
                        });
                    }
                    else if(extractor.length < 1 && extractorneeded && levelOfController >= 6 && 1==2)
                    {
                        var numberofparts = Math.floor(energyavailable / 350);
                        if(numberofparts > 8)
                        {
                            numberofparts = 8;
                        }
                        var bodyparts = [];
                        for(let i = 0; i < numberofparts; i++)
                        {
                            bodyparts.push(WORK);
                            bodyparts.push(CARRY);
                            bodyparts.push(CARRY);
                            bodyparts.push(MOVE);
                            bodyparts.push(MOVE);
                            bodyparts.push(MOVE);
                        }
                        spawnss[i].spawnCreep(bodyparts, 'extractor' + Game.time,
                        {
                            memory:
                            {
                                role: 'extractor',
                                cpuUsed: 0,
                                depositId: false,
                                mineralType: "",
                                roomtarg: roomname,
                                sourcetarget: Game.time % 2,
                                full: false,
                                memstruct: memstruct
                            }
                        });
                    }
                    else if(upgraders.length < 1 + ups && levelOfController > 3 && !wallsBreeched) // add condition that ensures the source and controller are close together
                    {
                        var numberofparts = Math.floor((energyavailable - 600) / 100);
                        var bodyparts = [];
                        if(numberofparts > 4 && storagevalue > 400000)
                        {
                            numberofparts = 4;
                        }
                        else if(numberofparts > 4 && storagevalue < 400000)
                        {
                            numberofparts = 3;
                        }
                        if(levelOfController < 8)
                        {
                            for(let i = 0; i < numberofparts; i++)
                            {
                                bodyparts.push(WORK);
                            }
                        }
                        else
                        {
                            bodyparts.push(WORK);
                        }
                        bodyparts.push(CARRY);
                        bodyparts.push(CARRY);
                        bodyparts.push(CARRY);
                        bodyparts.push(CARRY);
                        bodyparts.push(MOVE);
                        bodyparts.push(MOVE);
                        bodyparts.push(MOVE);
                        bodyparts.push(MOVE);
                        bodyparts.push(MOVE);
                        bodyparts.push(MOVE);
                        bodyparts.push(MOVE);
                        bodyparts.push(MOVE);
                        bodyparts.push(MOVE);
                        if(levelOfController == 6 && storagevalue > 900000)
                        {
                            console.log("boosted up");
                            bodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY];
                        }
                        if(levelOfController == 7 && storagevalue > 900000)
                        {
                            bodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY];
                        }
                        if(levelOfController < 3)
                        {
                            bodyparts = [MOVE, WORK, WORK, CARRY];
                        }
                        spawnss[i].spawnCreep(bodyparts, 'upgrader' + Game.time,
                        {
                            memory:
                            {
                                role: 'upgrader',
                                cpuUsed: 0,
                                full: false,
                                memstruct: memstruct
                            }
                        });
                    }       else if(scouts.length < 1 && levelOfController > 3) ///////////////////////////////////
                    {
                        spawnss[i].spawnCreep([MOVE], 'scout' + roomname,
                        {
                            memory:
                            {
                                memstruct: memstruct,
                                role: 'scout',
                                exitchosen: "a",
                                prevRoom: roomname
                            }
                        });
                    }
                    else
                    {
                        //
                        Game.flags[roomname].memory.flagstruct.spawnfree = true;
                        // 
                    }
                }
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }
}
module.exports = spwan;