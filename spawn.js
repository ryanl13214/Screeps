var spwan = {
    createBiggestsChasedown: function(roomname)
    {
        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
        var numberofparts = Math.floor((energyavailable - 310) / 880);
        var bodyparts = [MOVE, MOVE, MOVE, ATTACK, ATTACK];
        if (numberofparts > 5)
        {
            numberofparts = 5;
        }
        for (let j = 0; j < numberofparts; j++)
        {
            bodyparts.push(MOVE);
            bodyparts.push(MOVE);
            bodyparts.push(MOVE);
            bodyparts.push(MOVE);
            bodyparts.push(MOVE);
            bodyparts.push(ATTACK);
            bodyparts.push(RANGED_ATTACK);
            bodyparts.push(RANGED_ATTACK);
            bodyparts.push(HEAL);
        }
        return bodyparts;
    },
    run: function(roomname, defconstruct, storagevalue, roomExits, creepsinroom)
    {
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        ///////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        if (Game.spawns[roomname + "1"] != undefined)
        {
            if (Game.spawns[roomname + "1"].spawning)
            {
                if (Game.spawns[roomname + "1"].spawning.name == 'resourcemover' + roomname)
                {
                    Game.spawns[roomname + "1"].spawning.setDirections([BOTTOM]);
                }
                else
                {
                    Game.spawns[roomname + "1"].spawning.setDirections([TOP, TOP_LEFT, TOP_RIGHT]);
                }
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (Game.spawns[roomname] != undefined && Game.spawns[roomname].spawning)
        {
            if (Game.spawns[roomname].spawning.name == 'towermover' + roomname)
            {
                Game.spawns[roomname].spawning.setDirections([TOP_LEFT]);
            }
            else if (Game.rooms[roomname].controller.level < 8)
            {
                Game.spawns[roomname].spawning.setDirections([RIGHT, LEFT, TOP, BOTTOM_RIGHT, BOTTOM]);
            }
            else
            {
                Game.spawns[roomname].spawning.setDirections([RIGHT, BOTTOM_RIGHT, BOTTOM]);
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (Game.spawns[roomname + "2"] != undefined)
        {
            if (Game.spawns[roomname + "2"].spawning)
            {
                Game.spawns[roomname + "2"].spawning.setDirections([TOP_LEFT, BOTTOM_RIGHT, RIGHT]);
            }
        }

        for (var i = 0; i < spawnss.length; i++)
        {
            if (spawnss[i].spawning && spawnss[i].spawning.remainingTime < 2)
            {
                var ajacentcreepstorenew = spawnss[i].pos.findInRange(FIND_MY_CREEPS, 1,
                {
                    filter: (creep) =>
                    {
                        return (creep.memory.memstruct.boosted == false && (creep.memory.memstruct.opportuniticRenew == true || creep.memory.memstruct.moveToRenew == true) && creep.ticksToLive < 1480);
                    }
                });
                for (var q = 0; q < ajacentcreepstorenew.length; q++)
                {
                    ajacentcreepstorenew[q].moveTo(new RoomPosition(0, 0, roomname));
                }

            }

        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;

        for (var i = 0; i < spawnss.length; i++)
        {
            //       try{
            var ajacentcreepstorenew = spawnss[i].pos.findInRange(FIND_MY_CREEPS, 1,
            {
                filter: (creep) =>
                {
                    return (creep.memory.memstruct.boosted == false && (creep.memory.memstruct.opportuniticRenew == true || creep.memory.memstruct.moveToRenew == true) && creep.ticksToLive < 1480);
                }
            });
            if (ajacentcreepstorenew.length != 0 && storagevalue != 0 && energyavailable > 1000)
            {
                spawnss[i].renewCreep(ajacentcreepstorenew[0]);
            }
        }
        var levelOfController = Game.rooms[roomname].controller.level;
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (Game.time % 30 == 0 || levelOfController < 4)
        {

            var energycurrentlyavailable = Game.rooms[roomname].energyAvailable;
            var repairers = _.filter(creepsinroom, (creep) => creep.memory.role == 'repair');
            var towermover = _.filter(creepsinroom, (creep) => creep.memory.role == 'towermover');
            var upgraders = _.filter(creepsinroom, (creep) => creep.memory.role == 'upgrader');
            var resourcemover = _.filter(creepsinroom, (creep) => creep.memory.role == 'resmover');

            var nextroomharvester = _.filter(creepsinroom, (creep) => creep.memory.role == 'nextroom');
            var scouts = _.filter(creepsinroom, (creep) => creep.memory.role == 'scout');
            var numberofguardingcreeps = _.filter(creepsinroom, (creep) => creep.memory.role == 'guard');
            var harvesters = _.filter(creepsinroom, (creep) => creep.memory.role == 'harvester');
            var movers = _.filter(creepsinroom, (creep) => creep.memory.role == 'mover');
            var moveralt = _.filter(creepsinroom, (creep) => creep.memory.role == 'moveralt');
            var numberOfMineRooms = Game.flags[roomname].memory.flagstruct.claimedroomstuct.MineRooms.length;
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
            Game.flags[roomname].memory.flagstruct.spawnfree = true;
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var wallsBreeched = false;
            var targetsInsideWalls = Game.flags[roomname].pos.findInRange(FIND_HOSTILE_CREEPS, 7);
            if (targetsInsideWalls.length != 0)
            {
                wallsBreeched = true;
                // console.log("walls breeched");
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
            var extractorneeded = false;
            if (spawnss.length != 0)
            {
                var minerals = Game.rooms[roomname].find(FIND_MINERALS)[0].mineralAmount;
                if (minerals > 0)
                {
                    extractorneeded = true;
                }
            }

            var moversneeded = 1;
            if (levelOfController < 6)
            {
                moversneeded = 4;
            }
            if (levelOfController == 6)
            {
                moversneeded = 2;
            }
            if (levelOfController == 7)
            {
                moversneeded = 2;
            }
            if (levelOfController > 7)
            {
                moversneeded = 1;
            }
            var twemp = Game.rooms[roomname].find(FIND_SOURCES);

            if (twemp.length == 2)
            {
                var harvestersneeded = 2;

            }
            if (twemp.length == 1)
            {
                var harvestersneeded = 1;
                if (levelOfController < 6)
                {
                    moversneeded = 1;
                }
                if (levelOfController == 6)
                {
                    moversneeded = 1;
                }
            }

            var multiplyrepairerrs = 1;
            var ups = 0;

            if (wallsBreeched)
            {
                multiplyrepairerrs = 1;
                moversneeded = 1;
            }
            var brokenspawnstructure = false;
            var spawnmain = Game.spawns[roomname];
            if (spawnmain != undefined && Game.spawns[roomname].length == 3)
            {
                Game.flags[roomname].memory.flagstruct.spawnfree = true;
            }
            if (spawnmain = undefined)
            {
                brokenspawnstructure = true;
                //      console.log(brokenspawnstructure);
                spawnmain = Game.rooms[roomname].find(FIND_MY_SPAWNS)[0];
            }
            spawnmain = Game.rooms[roomname].find(FIND_MY_SPAWNS)[0];

            //    console.log(brokenspawnstructure);
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////low energy management/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (spawnmain != undefined && (Game.rooms[roomname].storage != undefined && Game.rooms[roomname].storage.store.getUsedCapacity("energy") > 10000) && movers.length == 0 && moveralt.length < 2 && energycurrentlyavailable < 3500)
            {

                var fullbody = [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY];
                var numberofpartsHARVESTER = Math.floor((energycurrentlyavailable - 300) / 100);
                if (numberofpartsHARVESTER > 22)
                {
                    numberofpartsHARVESTER = 22;
                }
                for (let j = 0; j < numberofpartsHARVESTER; j++)
                {
                    fullbody.push(MOVE);
                    fullbody.push(CARRY);
                }

                spawnmain.spawnCreep(fullbody, 'moverMIN' + roomname,
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
            else if (spawnmain != undefined && (levelOfController < 4 || (((movers.length == 0 && moveralt.length < 2) || harvesters.length < harvestersneeded)) || energyavailable < 500))
            {

                spawnmain.spawnCreep([MOVE, MOVE, CARRY, CARRY], 'moverMIN' + roomname,
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
                if (movers.length > 0 || moveralt.length > 0)
                {
                    var fullbody = [MOVE, MOVE, WORK, CARRY];
                    var numberofpartsHARVESTER = Math.floor((energyavailable - 300) / 100);
                    if (numberofpartsHARVESTER > 6)
                    {
                        numberofpartsHARVESTER = 6;
                    }
                    for (let j = 0; j < numberofpartsHARVESTER; j++)
                    {
                        fullbody.push(WORK);

                    }
                    var numberofparts = Math.floor((energyavailable - 300) / 150);
                    var bodyparts = [MOVE, MOVE, WORK, CARRY];
                    if (numberofparts > 6)
                    {
                        numberofparts = 6;
                    }
                    for (let j = 0; j < numberofparts; j++)
                    {
                        bodyparts.push(WORK);
                        bodyparts.push(MOVE);
                    }
                    var numberofparts = Math.floor((energyavailable - 250) / 250);
                    var bpodypartsMOBILE = [MOVE, MOVE, WORK, CARRY];
                    if (numberofparts > 6)
                    {
                        numberofparts = 6;
                    }
                    for (let j = 0; j < numberofparts; j++)
                    {
                        bpodypartsMOBILE.push(WORK);
                        bpodypartsMOBILE.push(MOVE);
                        bpodypartsMOBILE.push(MOVE);
                        bpodypartsMOBILE.push(CARRY);
                    }

                    if ((harvesters.length > 1 && Game.rooms[roomname].find(FIND_MY_SPAWNS).length == 2) || (harvesters.length > 0 && Game.rooms[roomname].find(FIND_MY_SPAWNS).length == 1))
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
                        spawnmain.spawnCreep(fullbody, 'up1' + roomname,
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

                    var parts = [MOVE, WORK, WORK, CARRY]
                    if (levelOfController == 2 && energycurrentlyavailable > 549)
                    {
                        parts = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY]
                    }
                    if (levelOfController == 2 && energycurrentlyavailable < 550 && energycurrentlyavailable >= 450)
                    {
                        parts = [MOVE, MOVE, WORK, WORK, WORK, CARRY]
                    }
                    if (levelOfController == 2 && energycurrentlyavailable < 450 && energycurrentlyavailable >= 350)
                    {
                        parts = [MOVE, MOVE, WORK, WORK, CARRY]
                    }

                    if (levelOfController == 3 && energycurrentlyavailable >= 650)
                    {
                        parts = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY]
                    }
                    if (levelOfController == 3 && energycurrentlyavailable >= 750)
                    {
                        parts = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY]
                    }

                    if (harvesters.length == 0)
                    {

                        spawnmain.spawnCreep(parts, 'minharvester0' + roomname,
                        {
                            memory:
                            {
                                role: 'harvester',
                                sourcetarget: 0,
                                memstruct: memstruct
                            }
                        });

                    }
                    if (harvestersneeded != 1 && harvesters.length == 1)
                    {
                        spawnmain.spawnCreep(parts, 'minharvester1' + roomname,
                        {
                            memory:
                            {
                                role: 'harvester',
                                sourcetarget: 1,
                                memstruct: memstruct
                            }
                        });
                    }
                }
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (levelOfController > 3)
            {
                //////////////////////end low energy management/////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                for (var i = 0; i < spawnss.length; i++)
                {
                    if (towermover.length == 0 && spawnss[i].name == roomname && levelOfController >= 4 && storagevalue != 0)
                    {
                        var nukeIncoming = Game.rooms[roomname].find(FIND_NUKES);
                        var bpodyparts = [CARRY, CARRY, WORK, CARRY, CARRY, WORK];
                        if (storagevalue > 950000 && levelOfController < 6)
                        {
                            bpodyparts = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
                        }
                        if (storagevalue > 950000 && levelOfController > 5 || nukeIncoming.length != 0)
                        {
                            bpodyparts = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
                            var numberofparts = Math.floor((energyavailable - 700) / 100);
                            if (numberofparts > 40)
                            {
                                numberofparts = 40;
                            }
                            for (let j = 0; j < numberofparts; j++)
                            {
                                bpodyparts.push(WORK);
                            }
                        }
                        if (nukeIncoming.length != 0 && !wallsBreeched)
                        {
                            if (Game.rooms[roomname].controller.level > 6)
                            {
                                bpodyparts = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
                            }
                            if (Game.rooms[roomname].controller.level == 6)
                            {
                                bpodyparts = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
                            }
                            if (Game.rooms[roomname].controller.level == 5)
                            {
                                bpodyparts = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY];
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
                    else if (resourcemover.length == 0 && levelOfController > 5 && Game.rooms[roomname].terminal != undefined)
                    {
                        if (levelOfController == 8 && spawnss[i].name == roomname + "1")
                        {
                            var bodyparts = [MOVE];
                            for (let j = 0; j < 35; j++)
                            {
                                bodyparts.push(CARRY);
                            }

                            spawnss[i].spawnCreep(bodyparts, 'resourcemover' + roomname,
                            {
                                memory:
                                {
                                    role: 'resmover',
                                    memstruct: memstruct
                                }
                            });
                        }
                        else if (levelOfController < 8)
                        {
                            spawnss[i].spawnCreep([MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], 'resourcemover' + roomname,
                            {
                                memory:
                                {
                                    role: 'resmover',
                                    memstruct: memstruct
                                }
                            });
                        }
                    }
                    else if (upgraders.length == 0 && harvesters.length != 0 && repairers.length != 0)
                    {

                        var bodyparts = [];

                        if (levelOfController < 3)
                        {
                            bodyparts = [MOVE, WORK, WORK, CARRY];
                        }

                        if (levelOfController == 4)
                        {
                            bodyparts = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY];
                        }
                        if (levelOfController == 5)
                        {
                            bodyparts = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY];
                        }

                        var term = Game.rooms[roomname].terminal;

                        if (levelOfController == 6)
                        {
                            bodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];

                            if (term != undefined && term.store.getUsedCapacity("XGH2O") > 500)
                            {
                                memstruct.tasklist.push(["boost", "XGH2O", 15]);
                            }

                        }
                        if (levelOfController == 7)
                        {
                            bodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];

                            if (term != undefined && term.store.getUsedCapacity("XGH2O") > 900)
                            {
                                memstruct.tasklist.push(["boost", "XGH2O", 25]);
                            }

                        }
                        if (levelOfController == 8)
                        {
                            bodyparts = [MOVE, MOVE, WORK, CARRY];
                        }

                        //  memstruct.tasklist = [["booost", "GH2O", ]];

                        spawnss[i].spawnCreep(bodyparts, 'upgrader' + roomname + Game.time,
                        {
                            memory:
                            {
                                role: 'upgrader',
                                cpuUsed: 0,
                                full: false,
                                memstruct: memstruct
                            }
                        });
                    }
                    else if (harvesters.length < harvestersneeded && !wallsBreeched)
                    {
                        var numberofparts = Math.floor((energyavailable - 350) / 150);
                        if (levelOfController > 4)
                        {
                            var bodyparts = [CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                            var numberofparts = Math.floor((energyavailable - 350) / 150);
                        }
                        else
                        {
                            var bodyparts = [CARRY, MOVE, MOVE];
                            var numberofparts = Math.floor((energyavailable - 150) / 100);
                        }
                        if (numberofparts > 6)
                        {
                            numberofparts = 6;
                        }
                        // find power creeps with boost source
                        var boostharvesters = false;
                        var powerCreepList = Game.rooms[roomname].find(FIND_MY_POWER_CREEPS);
                        if (powerCreepList != undefined)
                        {
                            for (var PP = 0; PP < powerCreepList.length; PP++)
                            {
                                if (powerCreepList[PP].powers[PWR_REGEN_SOURCE] != undefined)
                                {
                                    boostharvesters = true;
                                }
                            }
                        }
                        if (boostharvesters)
                        {
                            numberofparts = 14;
                        }
                        for (let j = 0; j < numberofparts; j++)
                        {
                            bodyparts.push(WORK);
                        }

                        if (!Game.creeps['harvester0' + roomname])
                        {
                            delete Memory.creeps['harvester0' + roomname];
                        }

                        if (!Game.creeps['harvester1' + roomname])
                        {
                            delete Memory.creeps['harvester1' + roomname];
                        }

                        spawnss[i].spawnCreep(bodyparts, 'harvester0' + roomname,
                        {
                            memory:
                            {
                                role: 'harvester',
                                sourcetarget: 0,
                                memstruct: memstruct
                            }
                        });

                        if (harvestersneeded == 2)
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

                    }
                    else if (movers.length < moversneeded && levelOfController >= 3)
                    {
                        if (levelOfController < 8)
                        {
                            var bodyparts = Math.floor((energyavailable) / 100);
                            if (bodyparts > 25)
                            {
                                bodyparts = 25;
                            }
                            var bodypartsMOVER = [];
                            for (let j = 0; j < bodyparts; j++)
                            {
                                bodypartsMOVER.push(MOVE);
                                bodypartsMOVER.push(CARRY);
                            }
                        }
                        else
                        {
                            var bodypartsMOVER = [];
                            for (let j = 0; j < 16; j++)
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
                    else if (repairers.length < 1 * multiplyrepairerrs)
                    {
                        var bodyparts = [];
                        var numberofparts = Math.floor(energyavailable / 350);
                        if (numberofparts * 6 > 50)
                        {
                            numberofparts = Math.floor(50 / 6);
                        }
                        var bodyparts = [];
                        for (let q = 0; q < numberofparts; q++)
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
                    else if (!Game.creeps['extractor' + roomname] && extractorneeded && levelOfController >= 6)
                    {
                        var numberofparts = Math.floor(energyavailable / 350);
                        if (numberofparts > 8)
                        {
                            numberofparts = 8;
                        }
                        var bodyparts = [];
                        for (let q = 0; q < numberofparts; q++)
                        {
                            bodyparts.push(WORK);
                            bodyparts.push(CARRY);
                            bodyparts.push(CARRY);
                            bodyparts.push(MOVE);
                            bodyparts.push(MOVE);
                            bodyparts.push(MOVE);
                        }
                        spawnss[i].spawnCreep(bodyparts, 'extractor' + roomname,
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
                    else if (scouts.length < 1 && levelOfController > 3)
                    {
                        Game.flags[roomname].memory.flagstruct.spawnfree = true;
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
                    else if (numberofguardingcreeps.length < 1 && numberOfMineRooms > 2)
                    {
                        spawnss[i].spawnCreep(this.createBiggestsChasedown(roomname), 'mineGuardChasedown' + roomname,
                        {
                            memory:
                            {
                                memstruct: memstruct,
                                role: 'guard',
                                attackrole: "chasedown"
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