var creepfunctions = {
    //  :mover2-E28N5E29N5MiningSquad*[joinSquad,E28N5E29N5MiningSquad];$
    getcombattagets: function(creep)
    {
           var whitelist = ["slowmotionghost","MarvinTMB","marvintmb"]
        if (creep.body.length != 50)
        {
            var targets = creep.room.find(FIND_HOSTILE_CREEPS,
            {
                filter: (targ) =>
                {
                    return ((
                        (targ.body.filter(x => x === "ranged_attack").length - 5 < (creep.body.filter(x => x === "ranged_attack").length * 3) && targ.body.filter(x => x === "heal").length < creep.body.filter(x => x === "ranged_attack").length * 0.8) ||
                        (targ.body.find(elem => elem.type === "work") != undefined) ||
                        (targ.body.filter(x => x === "attack").length < creep.body.filter(x => x === "attack").length)
                )&& whitelist.indexOf(object.owner.username) == -1
                    );
                }
            });
        }
        else
        {
            var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        }
        return targets;
    },

    repairLowestRampartInRange: function(creep)
    {
        var LowestRamparts = creep.pos.findInRange(FIND_STRUCTURES, 3,
        {
            filter: (structure) => (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART)
        });
        var tmp = 0;
        var tmprakmpat;
        if (LowestRamparts.length != 0)
        {
            var value = 9999999999999999999;
            for (var i = 0; i < LowestRamparts.length; i++)
            {
                if (LowestRamparts[i].hits < value)
                {
                    tmprakmpat = LowestRamparts[i];
                    value = LowestRamparts[i].hits
                }
            }
            creep.repair(tmprakmpat);
        }
    },
    getcombattagetsclosest: function(creep)
    {
             var whitelist = ["slowmotionghost","MarvinTMB","marvintmb"] 
        if (creep.body.length != 50)
        {
            var targets = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS,
            {
                filter: (targ) =>
                {
                    return ((
                        (targ.body.filter(x => x === "ranged_attack").length - 5 < (creep.body.filter(x => x === "ranged_attack").length * 3) && targ.body.filter(x => x === "heal").length < creep.body.filter(x => x === "ranged_attack").length * 0.8) ||
                        (targ.body.find(elem => elem.type === "work") != undefined) ||
                        (targ.body.filter(x => x === "attack").length < creep.body.filter(x => x === "attack").length)
                        )&& whitelist.indexOf(object.owner.username) == -1
                    );
                }
            });
        }
        else
        {
            var targets = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        }
        return targets;
    },
    getHostilesInRange: function(creep, range)
    {
        var whitelist = ["slowmotionghost","MarvinTMB","marvintmb"]
        return targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, range,
        {
            filter: function(object)
            {
                return whitelist.indexOf(object.owner.username) == -1;
            }
        });
    },
    findHostiles: function(creep)
    {
            var whitelist = ["slowmotionghost","MarvinTMB","marvintmb"]
        return targets = creep.room.find(FIND_HOSTILE_CREEPS,
        {
            filter: function(object)
            {
                return (whitelist.indexOf(object.owner.username) == -1);
            }
        });
    },
    findCloseHostiles: function(creep)
    {
         var whitelist = ["slowmotionghost","MarvinTMB","marvintmb"]
        return creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS,
        {
            filter: function(object)
            {
                return whitelist.indexOf(object.owner.username) == -1;
            }
        });
    },
    convertToString: function(creep)
    {
        var mainString = ":" + creep.name + "*";
        for (var i = 0; i < creep.memory.memstruct.tasklist.length; i++)
        {
            mainString += '[';
            for (var j = 0; j < creep.memory.memstruct.tasklist[i].length; j++)
            {
                mainString += creep.memory.memstruct.tasklist[i][j].toString();
                if (j != creep.memory.memstruct.tasklist[i].length - 1)
                {
                    mainString += ",";
                }
                else
                {
                    mainString += ']';
                }
            }
            mainString += ';';
        }
        mainString += '$';
        return mainString;
    },
    convertFromString: function(string) // [repair,5fd7e06bf5fef76aca211482]
    {
        console.log("convertFromString:", string);
        var mainString = string.split(''); // not NAme included 
        var outputArr = [];
        var outputArrl = string.split(',').length;
        for (var i = 0; i < outputArrl; i++)
        {
            outputArr.push("a");
        }
        console.log("outputArr.length s", outputArr.length);
        var cound = 0;
        if (mainString[0] == "[")
        {
            var tempString = "";
            for (var i = 1; i < mainString.length; i++)
            {
                if (mainString[i] == ",")
                {
                    outputArr[cound] = tempString.toString(); // check for int vs string   
                    tempString = "";
                    cound++;
                }
                else if (mainString[i] == "]")
                {
                    outputArr[cound] = tempString.toString(); // check for int vs string   
                    cound++;
                }
                else
                {
                    tempString += mainString[i].toString();
                }
            }
            console.log("outputArr.length", outputArr.length);
            return outputArr;
        }
    },
    getStartAndEnd: function(string, creep)
    {
        console.log("string", string);
        if (string == undefined || string == "")
        {
            creep.say(")");
            return "a";
        }
        creep.say("aaaa");
        var creepname = creep.name.split('');
        creep.say("b");
        var mainString = string.split('');
        creep.say("bb");
        var startofname = 999999;
        var endofname = 999999;
        creep.say("bbb");
        startofname = string.indexOf(creep.name);
        if (startofname == -1)
        {
            creep.say(")");
            return "a";
        }
        endofname = startofname + creepname.length;
        var endOfStringTasklist = 999999;
        for (var j = endofname; j < mainString.length; j++)
        {
            if (mainString[j] == "$" && endOfStringTasklist == 999999)
            {
                endOfStringTasklist = j;
            }
        }
        var fullList = string.substring(endofname + 1, endOfStringTasklist - 1);
        var fullReturn = [];
        var returnarr = [];
        if (startofname != 999999 && endofname != 999999)
        {
            var tmp = fullList.split(';');
            for (var i = 0; i < tmp.length; i++)
            {
                fullReturn.push(["a"]);
            }
            for (var i = 0; i < tmp.length; i++)
            {
                fullReturn[i] = this.convertFromString(tmp[i]);
            }
            return fullReturn;
        }
        return fullReturn;
    },
    addTaskListToInterShardMemory: function(shard, creep)
    {
        var data = JSON.parse(InterShardMemory.getLocal() || "{}");
        if (data.creepsAndTasks != undefined)
        {
            var startofname = data.creepsAndTasks.indexOf(creep.name);
            if (startofname == -1)
            {
                data.creepsAndTasks += this.convertToString(creep);
                console.log("adding to data.creepsAndTasks", data.creepsAndTasks);
                InterShardMemory.setLocal(JSON.stringify(data));
            }
            else
            {}
        }
        else
        {
            data.creepsAndTasks = "";
            InterShardMemory.setLocal(JSON.stringify(data));
        }
    },
    getTaskListToInterShardMemory: function(shardNo, creep)
    {
        var data = JSON.parse(InterShardMemory.getRemote('shard' + shardNo) || "{}");
        //  console.log("sffgggfs");
        if (data.creepsAndTasks != undefined)
        {
            var startofname = data.creepsAndTasks.lastIndexOf(creep.name);
            console.log(shardNo, "startofname", startofname);
            if (startofname == -1)
            {
                return "a";
            }
            //  console.log("s ds s");
            // if(data.creepsAndTasks == undefined)
            //  {
            //      data.creepsAndTasks = "";
            //      console.log("reset intershard memory");
            //  }
            console.log("s s s");
            var returnArr = this.getStartAndEnd(data.creepsAndTasks, creep);
            // console.log("12data.message",data.creepsAndTasks);
            if (returnArr == "a")
            {
                return "a";
            }
            else
            {
                return returnArr;
            }
            return returnArr;
        }
        else
        {
            console.log("creepsAndTasks undefined", shardNo);
            return "a";
        }
    },
    combatMove: function(creep, avoidarray, avoidclosest) // check if creep has damage parts
    {
        let goals = _.map(avoidarray, function(host)
        {
            return {
                pos: host.pos,
                range: 5
            };
        });
        let patha = PathFinder.search(creep.pos, goals,
        {
            flee: true
        }).path;
        creep.moveByPath(patha);
    },
    noncombatMove: function(creep, avoidarray, avoidclosest) // check if creep has damage parts
    {
        let goals = _.map(avoidarray, function(host)
        {
            return {
                pos: host.pos,
                range: 5
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
        //   try
        //   {
        //     console.log(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0]);
        if (creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1] != undefined)
        {
            if (creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0] == "repeat")
            {
                //   creep.say(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0]);
                if (creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][1] + 1 == creep.memory.memstruct.tasklist.length)
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
        }
        //  }
        //   catch(e)
        //    {
        //     console.log("repeat error");
        //     console.log("creep name",creep.name);
        //    console.log("e",e);
        //         console.log("  creep.memory.memstruct.tasklist",  creep.memory.memstruct.tasklist);
        //   }
    },
    allowSlave: function(creep)
    {
        try
        {
            if (creep.memory.duoId != undefined)
            {
                var slave = Game.getObjectById(creep.memory.duoId);
                const range = creep.pos.getRangeTo(slave);
                var counter = 1;
                if (slave.pos.x == 50 || slave.pos.x == 0 || slave.pos.y == 50 || slave.pos.y == 0)
                {
                    counter = 3;
                }
                if (range > counter && creep.room.name == slave.room.name && Game.time % 3 == 0)
                {
                    creep.say("come");
                    creep.moveTo(slave);
                }
            }
            if (creep.memory.duoId2 != undefined)
            {
                var slave = Game.getObjectById(creep.memory.duoId2);
                const range = creep.pos.getRangeTo(slave);
                var counter = 2;
                if (creep.room.controller != undefined && creep.room.controller.level > 3 && creep.room.name != creep.memory.memstruct.spawnRoom)
                {
                    var counter = 2;
                }
                if (slave.pos.x == 50 || slave.pos.x == 0 || slave.pos.y == 50 || slave.pos.y == 0)
                {
                    counter = 3;
                }
                if (range > counter && creep.room.name == slave.room.name && Game.time % 2 == 0)
                {
                    creep.say("WAIT");
                    creep.cancelOrder('move');
                }
            }
        }
        catch (e)
        {}
    },
    checkglobaltasks: function(creep)
    {
        if (creep.memory.memstruct.tasklist.length == 0)
        {
            return true;
        }
        else
        if (creep.memory.memstruct.tasklist[0] != undefined)
        {
            //    creep.memory.memstruct.tasklist = this.getStartAndEnd(this.convertToString(creep),creep);
            if (creep.memory.memstruct.tasklist[0][0] == "getDataFromOldShard")
            {
                creep.memory.intershard = true;
                creep.say("£");
                // go through all shards and check them 
                var shard0 = this.getTaskListToInterShardMemory(0, creep);
                console.log("shard0", shard0);
                if (shard0 == "a")
                {
                    creep.say("n0");
                    var shard1 = this.getTaskListToInterShardMemory(1, creep);
                    if (shard1 == "a")
                    {
                        creep.say("n1");
                        var shard2 = this.getTaskListToInterShardMemory(2, creep);
                        if (shard2 == "a")
                        {
                            creep.say("n2");
                            var shard3 = this.getTaskListToInterShardMemory(3, creep);
                            if (shard3 == "a")
                            {
                                creep.say("n3");
                            }
                            else
                            {
                                creep.say("3");
                                creep.memory.memstruct.tasklist = shard3;
                            }
                        }
                        else
                        {
                            creep.say("2");
                            creep.memory.memstruct.tasklist = shard2;
                        }
                    }
                    else
                    {
                        creep.say("1");
                        creep.memory.memstruct.tasklist = shard1;
                    }
                }
                else
                {
                    creep.say("0");
                    creep.memory.memstruct.tasklist = shard0;
                }
            }

            else if (creep.memory.memstruct.tasklist[0][0] == "upgrade")
            {
                if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
                {
                    creep.say("g");
                    this.loopTasks(creep);
                }
                else
                {
                    if (creep.room.controller)
                    {
                        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(creep.room.controller);
                        }
                    }
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "findPathBetweenRooms") // ["","goalRoom","starroom",dangerlevel]
            {

                var finalPath = [];

                var goalRoom = creep.memory.memstruct.tasklist[0][1]
                var starroom = creep.memory.memstruct.tasklist[0][2]
                var dangerlevel = creep.memory.memstruct.tasklist[0][3]

                var rawPath = roompathfind.run(goalRoom, starroom, dangerlevel);
                for (var q = 0; q < rawPath.length; q++)
                {
                    finalPath.push(["forcemoveToRoom", rawPath[q]])
                }

                creep.memory.memstruct.tasklist.splice(0, 1);

                for (var q = 0; q < creep.memory.memstruct.tasklist.length; q++)
                {
                    finalPath.push(creep.memory.memstruct.tasklist[q]);
                }
                creep.memory.memstruct.tasklist = finalPath
            }

            else if (creep.memory.memstruct.tasklist[0][0] == "buildGeneral")
            {
                creep.say("buildGeneral");
                if (creep.store[RESOURCE_ENERGY] == 0)
                {
                    creep.say("ge");
                    this.loopTasks(creep);
                }
                else
                {
                    var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                    if (target)
                    {
                        if (creep.build(target) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(target);
                        }
                    }
                }
            }

            else if (creep.memory.memstruct.tasklist[0][0] == "templeUP")
            {
                var tewers = creep.pos.findInRange(FIND_MY_STRUCTURES, 1,
                {
                    filter: (structure) => (structure.structureType == STRUCTURE_TOWER && structure.store.getUsedCapacity() < 500)
                });
                creep.memory.timer = 0;
                var positiongoal;
                var goalflag = Game.flags["temple" + creep.memory.memstruct.tasklist[0][1]]
                if (creep.name == creep.memory.memstruct.tasklist[0][1] + "up-temple" + "-0")
                {
                    positiongoal = new RoomPosition(goalflag.pos.x - 1, goalflag.pos.y - 1, creep.memory.memstruct.tasklist[0][1])
                }
                if (creep.name == creep.memory.memstruct.tasklist[0][1] + "up-temple" + "-1")
                {
                    positiongoal = new RoomPosition(goalflag.pos.x, goalflag.pos.y - 1, creep.memory.memstruct.tasklist[0][1])
                }
                if (creep.name == creep.memory.memstruct.tasklist[0][1] + "up-temple" + "-2")
                {
                    positiongoal = new RoomPosition(goalflag.pos.x + 1, goalflag.pos.y - 1, creep.memory.memstruct.tasklist[0][1])
                }
                if (creep.name == creep.memory.memstruct.tasklist[0][1] + "up-temple" + "-3")
                {
                    positiongoal = new RoomPosition(goalflag.pos.x + 1, goalflag.pos.y + 1, creep.memory.memstruct.tasklist[0][1])
                }
                creep.moveTo(positiongoal)

                var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
                //  var hostiles = creep.room.find(FIND_STRUCTURES);
                var spawnns = creep.pos.findInRange(FIND_STRUCTURES, 1,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_SPAWN && structure.store.energy > 100);
                    }
                });
                var term = creep.pos.findInRange(FIND_STRUCTURES, 1,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_TERMINAL && structure.store.energy > 1000);
                    }
                });

                if (creep.store.getFreeCapacity() >= 100 && term.length != 0)
                {
                    creep.withdraw(term[0], RESOURCE_ENERGY)
                }

                else if (creep.store.getFreeCapacity() >= 100 && spawnns.length != 0)
                {
                    creep.withdraw(spawnns[0], RESOURCE_ENERGY)
                }

                if (hostiles.length != 0)
                {

                    if (creep.name == creep.memory.memstruct.tasklist[0][1] + "up-temple-3")
                    {
                        creep.say("3")

                        if (tewers.length != 0 && creep.store.getUsedCapacity() >= 100)
                        {
                            creep.transfer(tewers[0], RESOURCE_ENERGY)
                        }

                    }
                    else
                    {

                        var LowestRamparts = creep.pos.findInRange(FIND_STRUCTURES, 3,
                        {
                            filter: (structure) => (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART)
                        });
                        var tmp = 0;
                        if (LowestRamparts.length != 0)
                        {
                            var value = 9999999999999999999;
                            for (var i = 0; i < LowestRamparts.length; i++)
                            {
                                if (LowestRamparts[i].hits < value)
                                {
                                    value = LowestRamparts[i].hits;
                                    tmp = i;
                                }
                            }
                            creep.repair(LowestRamparts[tmp])
                        }
                    }

                }
                else if (creep.store.getUsedCapacity() >= 100)
                {
                    creep.moveTo(positiongoal)
                    creep.upgradeController(creep.room.controller);
                }

                if (creep.ticksToLive < 1000)
                {

                    var spawnns = creep.pos.findInRange(FIND_STRUCTURES, 1,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_SPAWN && structure.store.energy > 100);
                        }
                    });

                    if (spawnns.length != 0)
                    {
                        spawnns[0].renewCreep(creep)
                    }

                }

            }
            else if (creep.memory.memstruct.tasklist[0][0] == "templeBuild")
            {
                creep.memory.timer = 0;
                var goalflag = Game.flags["temple" + creep.memory.memstruct.tasklist[0][1]]
                var roomname = creep.room.name
                var positiongoal = new RoomPosition(goalflag.pos.x - 1, goalflag.pos.y + 1, creep.memory.memstruct.tasklist[0][1])

                creep.moveTo(positiongoal)

                var term = creep.pos.findInRange(FIND_STRUCTURES, 1,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_TERMINAL && structure.store.energy > 1000);
                    }
                });

                if (creep.store.getFreeCapacity() >= 100 && term.length != 0)
                {
                    creep.withdraw(term[0], RESOURCE_ENERGY)
                }

                Game.rooms[roomname].createConstructionSite(goalflag.pos.x - 1, goalflag.pos.y - 1, STRUCTURE_RAMPART);
                Game.rooms[roomname].createConstructionSite(goalflag.pos.x - 1, goalflag.pos.y, STRUCTURE_RAMPART);
                Game.rooms[roomname].createConstructionSite(goalflag.pos.x - 1, goalflag.pos.y + 1, STRUCTURE_RAMPART);

                Game.rooms[roomname].createConstructionSite(goalflag.pos.x, goalflag.pos.y - 1, STRUCTURE_RAMPART);
                Game.rooms[roomname].createConstructionSite(goalflag.pos.x, goalflag.pos.y, STRUCTURE_RAMPART);
                Game.rooms[roomname].createConstructionSite(goalflag.pos.x, goalflag.pos.y + 1, STRUCTURE_RAMPART);

                Game.rooms[roomname].createConstructionSite(goalflag.pos.x + 1, goalflag.pos.y - 1, STRUCTURE_RAMPART);
                Game.rooms[roomname].createConstructionSite(goalflag.pos.x + 1, goalflag.pos.y, STRUCTURE_RAMPART);
                Game.rooms[roomname].createConstructionSite(goalflag.pos.x + 1, goalflag.pos.y + 1, STRUCTURE_RAMPART);

                var spawnns = creep.pos.findInRange(FIND_STRUCTURES, 1,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_SPAWN && structure.store.energy < 150);
                    }
                });
                if (spawnns.length != 0)
                {

                    creep.transfer(spawnns[0], RESOURCE_ENERGY)

                }

                var target = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3);
                if (target.length != 0)
                {
                    creep.build(target[0])

                }

                else
                {

                    var LowestRamparts = creep.pos.findInRange(FIND_STRUCTURES, 3,
                    {
                        filter: (structure) => (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART)
                    });
                    var tmp = 0;
                    if (LowestRamparts.length != 0)
                    {
                        var value = 9999999999999999999;
                        for (var i = 0; i < LowestRamparts.length; i++)
                        {
                            if (LowestRamparts[i].hits < value)
                            {
                                value = LowestRamparts[i].hits;
                                tmp = i;
                            }
                        }
                        creep.repair(LowestRamparts[tmp])
                    }

                }

                if (creep.ticksToLive < 1000)
                {

                    var spawnns = creep.pos.findInRange(FIND_STRUCTURES, 1,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_SPAWN && structure.store.energy > 100);
                        }
                    });

                    if (spawnns.length != 0)
                    {
                        spawnns[0].renewCreep(creep)
                    }

                }

            }

            else if (creep.memory.memstruct.tasklist[0][0] == "build")
            {
                if (creep.store.getUsedCapacity() == 0)
                {
                    this.loopTasks(creep);
                }
                else
                {
                    var target = Game.getObjectById(creep.memory.memstruct.tasklist[0][0]);
                    if (target)
                    {
                        if (creep.build(target) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(target);
                        }
                    }
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "buildconsites")
            {
                if (creep.store.getUsedCapacity() == 0)
                {
                    this.loopTasks(creep);
                }
                else
                {
                    const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                    if (target)
                    {
                        if (creep.build(target) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(target);
                        }
                    }
                    else
                    {
                        this.loopTasks(creep);
                    }
                }
            }

            else if (creep.memory.memstruct.tasklist[0][0] == "harvest")
            {
                creep.say(creep.store[RESOURCE_ENERGY])
                if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity())
                {

                    this.loopTasks(creep);
                }
                else
                {
                    var target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                    if (target)
                    {
                        if (creep.harvest(target) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(target);
                        }
                    }
                }
            }

            else if (creep.memory.memstruct.tasklist[0][0] == "guardRoom")
            {

                var targposition = new RoomPosition(25, 25, creep.memory.memstruct.tasklist[0][1]);

                const range = creep.pos.getRangeTo(targposition);

                var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

                if (target == undefined && range > 20 && creep.room.name == creep.memory.memstruct.tasklist[0][1])
                {
                    creep.moveTo(targposition);
                }

                if (range > 23)
                {

                    creep.moveTo(targposition);
                    return true;
                }
                else
                {
                    return true;
                }

            }
            else if (creep.memory.memstruct.tasklist[0][0] == "joinSquad")
            {
                if (creep.ticksToLive < 1500)
                {
                    var tempid = creep.id;
                    //  console.log("adding creep to squad - " + tempid);
                    try
                    {
                        var listOfSquadMembers = Memory.squadObject[creep.memory.memstruct.tasklist[0][1]].SquadMembersCurrent
                        var itemfound = 0;
                        for (var i = 0; i < listOfSquadMembers.length; i++)
                        {
                            if (listOfSquadMembers[i] == creep.id)
                            {
                                itemfound = 1;
                            }
                        }
                        if (itemfound == 0)
                        {
                            Memory.squadObject[creep.memory.memstruct.tasklist[0][1]].SquadMembersCurrent.push(tempid);
                            return true;
                        }
                        // this.loopTasks(creep);
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
            else if (creep.memory.memstruct.tasklist[0][0] == "changerole")
            {
                creep.memory.role = creep.memory.memstruct.tasklist[0][1];
                this.loopTasks(creep);
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "holdrepair")
            {
                if (creep.store.getFreeCapacity("energy") > 0)
                {
                    var containers = creep.pos.findInRange(FIND_STRUCTURES, 1,
                    {
                        filter: (structure) =>
                        {
                            return ((structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 20) || (structure.structureType == STRUCTURE_LINK && structure.store.energy > 700));
                        }
                    });
                    var containers2 = creep.pos.findInRange(FIND_STRUCTURES, 1,
                    {
                        filter: (structure) =>
                        {
                            return ((structure.structureType == STRUCTURE_CONTAINER));
                        }
                    });

                    if (containers.length != 0)
                    {
                        creep.withdraw(containers[0], RESOURCE_ENERGY)
                    }
                    else if (containers.length == 0 && containers2.length != 0)
                    {
                        Game.spawns[creep.room.name].spawnCreep(
                            [MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY], creep.room.name + 'linkerrep1',
                            {
                                memory:
                                {
                                    role: 'multi',
                                    memstruct:
                                    {
                                        spawnRoom: creep.room.name,
                                        tasklist: [
                                            ["withdraw", "storage", "energy", 800],
                                            ["transfer", containers2[0].id, "energy"],
                                            ["repeat", 2]
                                        ],
                                        objectIDStorage: "",
                                        boosted: false,
                                        moveToRenew: false,
                                        opportuniticRenew: true,
                                        hastask: false
                                    }
                                }
                            });
                    }
                }
                this.repairLowestRampartInRange(creep)
            }

            else if (creep.memory.memstruct.tasklist[0][0] == "fillTowers")
            {

                var targets = creep.room.find(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_TOWER && structure.energy < 500);
                    }
                });

                if (targets.length != 0 && creep.store.getUsedCapacity() != 0)
                {

                    var a = [
                        ["transfer", targets[0].id, "energy"]
                    ]
                    a = a.concat(creep.memory.memstruct.tasklist)
                    creep.memory.memstruct.tasklist = a
                }
                else
                {
                    this.loopTasks(creep);
                }

            }

            else if (creep.memory.memstruct.tasklist[0][0] == "travelThroughPortal")
            {
                // ["travelThroughPortal" , origin shard  , portalID]
                var originshard = creep.memory.memstruct.tasklist[0][1];
                creep.say(Game.shard.name);
                //  
                if (Game.shard.name == "shard" + originshard)
                {
                    this.addTaskListToInterShardMemory(originshard, creep);
                    creep.say("originshard");
                    var targPortal = Game.getObjectById(creep.memory.memstruct.tasklist[0][2]);
                    creep.moveTo(targPortal.pos);
                }
                else
                {
                    creep.move(RIGHT);
                    this.loopTasks(creep);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "downgrade")
            {
                if (creep.room.controller && !creep.room.controller.my)
                {
                    if (creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(Game.rooms[creep.memory.memstruct.tasklist[0][1]].controller);
                    }
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "waitForCreepsToSpawn")
            {

                var spawnss = creep.pos.findClosestByRange(FIND_MY_SPAWNS,
                {
                    filter: (structure) =>
                    {
                        return (structure.spawning == undefined);
                    }
                });
                try
                {
                    creep.moveTo(spawnss,
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                    var range = creep.pos.getRangeTo(spawnss);
                    if (range == 1)
                    {
                        spawnss.renewCreep(creep);
                    }
                }
                catch (e)
                {}

                var creepsSpawnedin2 = true;
                for (var i = 0; i < creep.memory.memstruct.tasklist[0][1].length; i++)
                {
                    if (Game.creeps[creep.memory.memstruct.tasklist[0][1][i]] != undefined && Game.creeps[creep.memory.memstruct.tasklist[0][1][i]].spawning == false)
                    {
                        creep.say("crfe ", Game.creeps[creep.memory.memstruct.tasklist[0][1][i]]);
                    }
                    else
                    {
                        creepsSpawnedin2 = false;
                        creep.say("cre ", Game.creeps[creep.memory.memstruct.tasklist[0][1][i]]);
                    }
                }
                if (creepsSpawnedin2)
                {
                    creep.say("creepsSpawnedin");
                    this.loopTasks(creep);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "withdraw")
            {
                try
                {
                    if (creep.store.getFreeCapacity() == 0)
                    {
                        creep.say("breakwithdraw");
                        this.loopTasks(creep);
                    }
                    else
                    {
                        //     ["withdraw" , "5f4e3d6138522b1096393b7d","tissue",optional value]
                        // ad factory terminal storoage indicators
                        if (creep.memory.memstruct.tasklist[0][1] == "terminal" && creep.room.terminal)
                        {
                            creep.memory.memstruct.tasklist[0][1] = creep.room.terminal.id;
                        }
                        if (creep.memory.memstruct.tasklist[0][1] == "storage" && creep.room.storage)
                        {
                            creep.memory.memstruct.tasklist[0][1] = creep.room.storage.id;
                        }
                        var targ = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);

                        if (targ != null && targ.structureType == STRUCTURE_CONTROLLER)
                        {
                            console.log("controller withdraw eerr");
                            this.loopTasks(creep);
                        }
                        else if (!targ)
                        {

                            this.loopTasks(creep);
                        }

                        else
                        {

                            //  creep.say(targ.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][2]));
                            if (creep.memory.memstruct.tasklist[0].length == 3 && (targ.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][2]) < creep.memory.memstruct.tasklist[0][3]))
                            {
                                var a = creep.withdraw(targ, creep.memory.memstruct.tasklist[0][2]);
                            }
                            else
                            {
                                var tempa = creep.memory.memstruct.tasklist[0][3];
                                if (tempa > creep.store.getFreeCapacity())
                                {
                                    tempa = creep.store.getFreeCapacity();
                                }
                                var a = creep.withdraw(targ, creep.memory.memstruct.tasklist[0][2], tempa);
                            }
                            if (a == ERR_NOT_IN_RANGE)
                            {
                                creep.moveTo(targ); // todo change this to task move to range 1 
                            }
                            else if (a == 0)
                            {
                                new RoomVisual(creep.room.name).line(targ.pos.x, targ.pos.y, creep.pos.x, creep.pos.y);
                                new RoomVisual(creep.room.name).text(creep.memory.memstruct.tasklist[0][2], creep.pos.x, creep.pos.y,
                                {
                                    color: 'white',
                                    font: 0.3
                                });
                                this.loopTasks(creep);
                            }
                            else if (a == -6)
                            {
                                this.loopTasks(creep);
                            }

                        }
                    }
                }
                catch (e)
                {
                    console.log("controller withdraw eerrtry");
                    this.loopTasks(creep);
                }

            }
            else if (creep.memory.memstruct.tasklist[0][0] == "transfer")
            {

                //     ["transfer" , "5f4e3d6138522b1096393b7d","tissue",50]
                var targ = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);

                if (creep.memory.role == "mover" && targ.structureType == STRUCTURE_CONTAINER)
                {
                    if (targ.store.getFreeCapacity() < 300)
                    {
                        this.loopTasks(creep);
                        return true
                    }
                }

                if (creep.memory.memstruct.tasklist[0] == undefined)
                {
                    this.loopTasks(creep);
                }
                else if (creep.memory.memstruct.tasklist[0].length < 3)
                {
                    this.loopTasks(creep);
                }

                if (creep.memory.memstruct.tasklist[0].length == 4)
                {
                    var a = creep.transfer(targ, creep.memory.memstruct.tasklist[0][2], creep.memory.memstruct.tasklist[0][3]);
                }
                else
                {
                    var a = creep.transfer(targ, creep.memory.memstruct.tasklist[0][2]);
                }

                new RoomVisual(creep.room.name).line(targ.pos.x, targ.pos.y, creep.pos.x, creep.pos.y);

                new RoomVisual(creep.room.name).text(creep.memory.memstruct.tasklist[0][2], creep.pos.x, creep.pos.y,
                {
                    color: 'green',
                    font: 0.3
                });

                if (a == ERR_NOT_IN_RANGE)
                {
                    creep.say("a");
                    creep.moveTo(targ);
                }
                else if (a == 0)
                {
                    this.loopTasks(creep);
                }
                else if (a == -6)
                {
                    this.loopTasks(creep);
                }
                else if (a == -7)
                {
                    this.loopTasks(creep);
                }
                else if (a == -8)
                {
                    this.loopTasks(creep);
                }
                else if (creep.store.getUsedCapacity() == 0)
                {
                    this.loopTasks(creep);
                }

            }
            else if (creep.memory.memstruct.tasklist[0][0] == "renewsafemode")
            {

                if (creep.generateSafeMode(Game.rooms[creep.memory.memstruct.tasklist[0][1]].controller) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(Game.rooms[creep.memory.memstruct.tasklist[0][1]].controller);
                }

            }

            else if (creep.memory.memstruct.tasklist[0][0] == "withdrawBoost")
            {
                if (creep.store.getFreeCapacity() == 0 || creep.ticksToLive < 200)
                {
                    this.loopTasks(creep);
                }
                const targ = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                var a = creep.withdraw(targ, creep.memory.memstruct.tasklist[0][2], creep.memory.memstruct.tasklist[0][3]);
                var b = creep.withdraw(targ, "energy", ((creep.memory.memstruct.tasklist[0][3] / 3) * 2));
                if (a == 0)
                {
                    new RoomVisual(creep.room.name).line(targ.pos.x, targ.pos.y, creep.pos.x, creep.pos.y);
                    new RoomVisual(creep.room.name).text(creep.memory.memstruct.tasklist[0][2], creep.pos.x, creep.pos.y,
                    {
                        color: 'white',
                        font: 0.3
                    });
                    this.loopTasks(creep);
                }
                else if (a == -6)
                {
                    this.loopTasks(creep);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "transferBoost")
            {
                //     ["withdraw" , "5f4e3d6138522b1096393b7d","tissue"]
                const targ = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                var a = creep.transfer(targ, creep.memory.memstruct.tasklist[0][2], creep.memory.memstruct.tasklist[0][3]);
                var b = creep.transfer(targ, "energy", ((creep.memory.memstruct.tasklist[0][3] / 3) * 2));
                new RoomVisual(creep.room.name).line(targ.pos.x, targ.pos.y, creep.pos.x, creep.pos.y);
                new RoomVisual(creep.room.name).text(creep.memory.memstruct.tasklist[0][2], creep.pos.x, creep.pos.y,
                {
                    color: 'green',
                    font: 0.3
                });
                if (a == 0)
                {
                    this.loopTasks(creep);
                }
                else if (a == -6)
                {
                    this.loopTasks(creep);
                }
                else if (a == -8)
                {
                    this.loopTasks(creep);
                }
                else if (creep.store.getUsedCapacity() == 0)
                {
                    this.loopTasks(creep);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "drop")
            {
                //     ["drop" , "what to drop"]
                var a = creep.drop(creep.memory.memstruct.tasklist[0][1]);
                if (a == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targ);
                }
                else if (a == 0)
                {
                    this.loopTasks(creep);
                }
                else if (creep.store.getUsedCapacity() == 0)
                {
                    this.loopTasks(creep);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "reserve")
            {
                //      if((roomObj.controller.reservation != undefined && roomObj.controller.reservation.ticksToEnd < 1000) || roomObj.controller.reservation == undefined    || roomObj.controller.reservation.username != "Q13214"  )
                var range = creep.pos.getRangeTo(creep.room.controller);
                if (range > 1)
                {
                    creep.moveTo(creep.room.controller,
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
                if (creep.room.controller.reservation != undefined && creep.room.controller.reservation.username == "Q13214")
                {
                    creep.reserveController(creep.room.controller)
                }
                if (creep.room.controller.reservation != undefined && creep.room.controller.reservation.username != "Q13214")
                {
                    creep.attackController(creep.room.controller)
                }
                if (creep.room.controller.reservation == undefined)
                {
                    creep.reserveController(creep.room.controller)
                }
                creep.signController(creep.room.controller, "Q's room");
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "steal")
            {
                if (creep.store.getFreeCapacity() == 0 || creep.ticksToLive < 200)
                {
                    this.loopTasks(creep);
                }
                if (creep.memory.memstruct.tasklist[0][1] == "terminal")
                {
                    creep.say(creep.memory.memstruct.tasklist[0][1]);
                    var targ = creep.room.find(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return structure.structureType == STRUCTURE_TERMINAL;
                        }
                    })[0];
                    var resourcesToSteal = Object.keys(targ.store);
                    var listvalues = Object.values(targ.store);
                }
                else if (creep.memory.memstruct.tasklist[0][1] == "factory")
                {
                    var targ = creep.room.find(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return structure.structureType == STRUCTURE_FACTORY;
                        }
                    })[0];
                    var resourcesToSteal = Object.keys(targ.store);
                    var listvalues = Object.values(targ.store);
                }
                else if (creep.memory.memstruct.tasklist[0][1] == "storage")
                {
                    var targ = creep.room.storage;
                    var resourcesToSteal = Object.keys(targ.store);
                    var listvalues = Object.values(targ.store);
                }
                else
                {
                    var targ = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                    var resourcesToSteal = Object.keys(targ.store);
                    var listvalues = Object.values(targ.store);
                }
                creep.say(targ);
                var steal = ["XGHO2", "XUH2O", "XLHO2", "XZH2O", "XZHO2", "XKHO2", "X", "power", 'utrium_bar', 'lemergium_bar', 'zynthium_bar', 'keanium_bar', 'ghodium_melt', 'oxidant', 'reductant', 'purifier', 'battery', 'composite', 'crystal', 'liquid', 'wire', 'switch', 'transistor', 'microchip', 'circuit', 'cell', 'phlegm', 'tissue', 'muscle', 'organoid', 'alloy', 'tube', 'fixtures', 'frame', 'hydraulics', 'condensate', 'concentrate', 'extract', 'spirit', 'emanation'];
                var index = 0;
                for (a = 0; a < resourcesToSteal.length; a++)
                {
                    var found = false;
                    for (q = 0; q < steal.length; q++)
                    {
                        if (steal[q] == resourcesToSteal[a])
                        {
                            found = true;
                        }
                    }
                    if (found == true)
                    {
                        index = a;
                    }
                }
                var a = creep.withdraw(targ, resourcesToSteal[index]);
                if (a == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targ);
                }
                else if (a == 0)
                {
                    creep.say("YOINK");
                }
                else if (a == -6)
                {}
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "basicrenew")
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
                var found = false;
                for (var ik = 0; ik < creep.body.length; ik++)
                {
                    if (creep.body[ik] == CLAIM)
                    {
                        found = true;
                    }
                }
                var tmp = 1450;
                if (found == true)
                {
                    tmp = 590;
                }
                if (creep.ticksToLive > tmp)
                {
                    this.loopTasks(creep);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "deposit")
            {
                if (creep.room.terminal == undefined && creep.room.storage == undefined)
                {
                    this.loopTasks(creep);
                    
                }
                if (creep.store.getUsedCapacity() > 0)
                {

                    if (creep.room.storage != undefined && creep.room.storage.store.getFreeCapacity() > 1500)
                    {
                        var targ = creep.room.storage;
                    }
                    else if (creep.room.terminal != undefined && creep.room.terminal.store.getFreeCapacity() > 1500)
                    {
                        var targ = creep.room.terminal;
                    }

                    else
                    {
                        this.loopTasks(creep);
                    }
                    const resourcevalues = Object.values(creep.store);
                    const resourcekeys = Object.keys(creep.store);
                    var range = creep.pos.getRangeTo(targ);
                    if (range <= 1)
                    {
                        creep.transfer(targ, resourcekeys[0], resourcevalues[0]);
                    }
                    else
                    {

                        creep.moveTo(targ,
                        {
                            reusePath: 1,
                            maxRooms: 0
                        });
                    }
                }
                else
                {
                    this.loopTasks(creep);
                    this.checkglobaltasks(creep);
                    
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "mineCoridor")
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
                if (creep.store.getUsedCapacity(RESOURCE_ENERGY) != 0)
                {
                    creep.drop(RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY));
                }
                if (droppedresources != undefined)
                {
                    var range = creep.pos.getRangeTo(droppedresources);
                    if (range <= 1)
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
                else if (tombstones != undefined)
                {
                    creep.say("tomb");
                    var object = Game.getObjectById(tombstones);
                    var resourcekeys = [RESOURCE_ENERGY];
                    var range = creep.pos.getRangeTo(tombstones);
                    if (range <= 1)
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
                    if (deposoits.length != 0)
                    {
                        if (creep.harvest(deposoits[0]) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(deposoits[0]);
                        }
                    }
                    if (deposoits.length > 1)
                    {
                        if (deposoits[0].cooldown > 25)
                        {
                            if (creep.harvest(deposoits[1]) == ERR_NOT_IN_RANGE)
                            {
                                creep.moveTo(deposoits[1]);
                            }
                        }
                    }
                    var hostile = creep.room.find(FIND_HOSTILE_CREEPS);
                    if (creep.store.getFreeCapacity() == 0 || creep.ticksToLive < 200 || hostile.length != 0 && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
                    {
                        this.loopTasks(creep);
                    }
                }
                if (creep.store.getFreeCapacity() == 0 && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
                {
                    this.loopTasks(creep);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "clearRoomPassive")
            {
                var invaders = this.findHostiles(creep);
                var hostileStructs = creep.room.find(FIND_HOSTILE_STRUCTURES);
                if (invaders != undefined && invaders.length == 0 && hostileStructs.length == 0)
                {
                    this.loopTasks(creep);
                }
                else
                {
                    return true;
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "createslave") // used by master
            {
                creep.say("create healer");
                var bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]; // add a function to caUTOBUILD
                var lvl = Game.rooms[creep.memory.memstruct.spawnRoom].controller.level;
                if (lvl == 6)
                {
                    var bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL];
                }
                if (lvl == 7)
                {
                    var bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL];
                }
                if (lvl == 8)
                {
                    var bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL];
                }
                Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(bgodyparts, creep.name + "'s healer",
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
                if (creep.memory.duoId == undefined)
                {}
                else
                {
                    creep.say("a");
                    this.loopTasks(creep);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "createslaveBOOST") // used by master// only rcl8
            {
                creep.say("create healer");
                var mainflag = Game.flags[creep.room.name];
                if (creep.pos.x == mainflag.pos.x - 1 && creep.pos.y == mainflag.pos.y - 3)
                {
                    creep.move(LEFT);
                }
                var bgodyparts = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]; // add a function to caUTOBUILD
                if (creep.room.controller.level == 7)
                {
                    var bgodyparts = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL];
                }
                if (creep.room.controller.level == 6)
                {
                    var bgodyparts = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL];
                }
                Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(bgodyparts, creep.name + "'s healer",
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
                if (creep.memory.duoId == undefined)
                {}
                else
                {
                    creep.say("a");
                    this.loopTasks(creep);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "createslaveBOOST2") // used by master// only rcl8
            {
                creep.say("create healer");
                var mainflag = Game.flags[creep.room.name];
                if (creep.pos.x == mainflag.pos.x - 1 && creep.pos.y == mainflag.pos.y - 3)
                {
                    creep.move(LEFT);
                }
                var bgodyparts = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]; // add a function to caUTOBUILD
                Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(bgodyparts, creep.name + "'s healer",
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: creep.memory.memstruct.spawnRoom,
                            tasklist: [
                                ["boosAllMax"],
                                ["findMaster2", creep.id]
                            ],
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: false,
                            hastask: false
                        }
                    }
                });
                if (creep.memory.duoId2 == undefined)
                {}
                else
                {
                    creep.say("a");
                    this.loopTasks(creep);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "findMaster") // used by slave
            {
                const master = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                if (master == null)
                {
                    creep.suicide();
                }
                try
                {
                    creep.moveTo(master);
                }
                catch (e)
                {}
                if (master != undefined && master != null)
                {
                    if (master.memory.duoId == undefined || master.memory.duoId == "erer")
                    {
                        master.memory.duoId = creep.id;
                    }
                    else
                    {
                        if (creep.hits == creep.hitsMax)
                        {
                            creep.heal(master);
                        }
                        else
                        {
                            if (Game.time & 2 == 0)
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
            else if (creep.memory.memstruct.tasklist[0][0] == "findMaster2") // used by slave
            {
                const master = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                if (master == null)
                {
                    creep.suicide();
                }
                try
                {
                    creep.moveTo(master);
                }
                catch (e)
                {}
                if (master != undefined && master != null)
                {
                    if (master.memory.duoId2 == undefined)
                    {
                        master.memory.duoId2 = creep.id;
                    }
                    else
                    {
                        if (creep.hits == creep.hitsMax)
                        {
                            creep.heal(master);
                        }
                        else
                        {
                            if (Game.time & 2 == 0)
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
            else if (creep.memory.memstruct.tasklist[0][0] == "waitTick")
            {
                this.loopTasks(creep);
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "GuardCenterRoom") // ["GuardCenterRoom","roomname]
            {
                var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var targets = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS,
                {
                    filter: function(object)
                    {
                        return object.body.length > 1;
                    }
                });
                var range = creep.pos.getRangeTo(targets);
                var meletargets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 2);
                var melefound = false;
                for (var c = 0; c < meletargets.length; c++)
                {
                    for (var a = 0; a < meletargets[c].body.length; a++)
                    {
                        if (meletargets[c].body[a].type == ATTACK)
                        {
                            melefound = true;
                        }
                    }
                }
                if (!melefound)
                {
                    creep.moveTo(targets);
                }
                if (creep.room.name != creep.memory.memstruct.tasklist[0][1])
                {
                    creep.moveTo(new RoomPosition(25, 25, creep.memory.memstruct.tasklist[0][1]));
                }
                else if (range > 3 && creep.hits == creep.hitsMax)
                {
                    creep.moveTo(targets);
                }
                else if (creep.hits + 300 < creep.hitsMax || melefound)
                {
                    const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                    var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    if (target != undefined)
                    {
                        creepfunctions.combatMove(creep, targetArr, target);
                    }
                }
                if (range <= 3)
                {
                    creep.rangedAttack(targets);
                }
                if (range == 1)
                {
                    creep.rangedMassAttack();
                }
                if (targets == undefined)
                {
                    var targets = creep.room.find(FIND_HOSTILE_STRUCTURES,
                    {
                        filter: function(object)
                        {
                            return object.structureType == STRUCTURE_KEEPER_LAIR;
                        }
                    });
                    var temp = 9;
                    var counter = 9999;
                    if (targets.length != 0)
                    {
                        creep.say(targets.length);
                        for (var k = 0; k < targets.length; k++)
                        {
                            if (targets[k].ticksToSpawn < counter)
                            {
                                counter = targets[k].ticksToSpawn;
                                temp = k;
                            }
                        }
                        var range = creep.pos.getRangeTo(targets[temp]);
                        if (range > 3)
                        {
                            creep.say("no one to fighhtr");
                            creep.moveTo(targets[temp]);
                        }
                    }
                }
                creep.heal(creep);
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "patrolroom")
            {
                creep.say("patrolroom");
                var targets = this.getcombattagets(creep);
                var targposition = new RoomPosition(25, 25, creep.memory.memstruct.tasklist[0][1]);
                var pos1 = creep.pos;
                var pos2 = targposition;
                const range = creep.pos.getRangeTo(targposition);
                var targe2t = creepfunctions.getcombattagets(creep);
                var targcomparison = target = creep.room.find(FIND_HOSTILE_CREEPS);
                if (targe2t.length < targcomparison)
                {
                    this.loopTasks(creep); // avoid rooms with big defenders
                }
                if (range > 23 && targets.length == 0)
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
                    if (targets.length != 0)
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
                if (droppedresources != undefined || tombstones != undefined)
                {
                    this.summonHauler(creep.room.name, creep.memory.memstruct.spawnRoom);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "gatherLooseResources")
            {

                if (creep.store.getFreeCapacity() == 0)
                {
                    this.loopTasks(creep);
                }
                else
                {
                    var droppedresources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                    var tombstones = creep.pos.findClosestByRange(FIND_TOMBSTONES,
                    {
                        filter: (res) =>
                        {
                            return (res.amount > 0);
                        }
                    });
                    if (droppedresources != undefined)
                    {
                        var range = creep.pos.getRangeTo(droppedresources);
                        if (range <= 1)
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
                    else if (tombstones != undefined)
                    {
                        creep.say("tomb");
                        var object = Game.getObjectById(tombstones);
                        var resourcekeys = Object.keys(tombstones.store);
                        var range = creep.pos.getRangeTo(tombstones);
                        if (range <= 1)
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
            else if (creep.memory.memstruct.tasklist[0][0] == "gathermine") /////////////////////////////////////////////////////////////////////////
            {
                   var targets = creep.room.find(FIND_HOSTILE_CREEPS);
                
                    
                if (targets.length !=0)
                {
                   this.loopTasks(creep);
                }
                
                
                if (creep.store.getFreeCapacity() == 0)
                {

                    if (Memory.roomlist[creep.room.name].movercontrol != undefined && Memory.roomlist[creep.room.name].movercontrol.moveCap != undefined)
                    {
                        Memory.roomlist[creep.room.name].movercontrol.moveCap = Memory.roomlist[creep.room.name].movercontrol.moveCap - creep.store.getCapacity();
                    }

                 
                }
                else
                {
                    var targ = creep.pos.findClosestByRange(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return ((structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity() > 500);
                        }
                    });

                    var droppedresources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.amount > 500);
                        }
                    });

                    var tombstones = creep.pos.findClosestByRange(FIND_TOMBSTONES,
                    {
                        filter: (res) =>
                        {
                            return (res.store.getUsedCapacity() > 500);
                        }
                    });
                    if (droppedresources != undefined)
                    {
                        var range = creep.pos.getRangeTo(droppedresources);
                        if (range <= 1)
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
                    else if (tombstones != undefined)
                    {
                        creep.say("tomb");
                        var object = Game.getObjectById(tombstones);
                        var resourcekeys = Object.keys(tombstones.store);
                        var range = creep.pos.getRangeTo(tombstones);
                        if (range <= 1)
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
                    else if (targ != undefined)
                    {
                        var resourcekeys = Object.keys(targ.store);
                        var range = creep.pos.getRangeTo(targ);
                        if (range <= 1)
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
                        //  this.loopTasks(creep);
                    }
                    ////////////////
                }

                var targets = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                var range2 = creep.pos.getRangeTo(targets);
                if (range2 <= 6)
                {
                    const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                    target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    this.noncombatMove(creep, targetArr, target);
                }

            }
            else if (creep.memory.memstruct.tasklist[0][0] == "gatherstoredResources") /////////////////////////////////////////////////////////////////////////
            {
                if (creep.body.find(elem => elem.type === "heal") != undefined)
                {
                    creep.heal(creep);
                }
                if (creep.store.getFreeCapacity() == 0)
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
                    if (targ == undefined)
                    {
                        targ = creep.pos.findClosestByRange(FIND_STRUCTURES,
                        {
                            filter: (structure) =>
                            {
                                return ((structure.structureType == STRUCTURE_TERMINAL) && structure.store.getUsedCapacity() > 0);
                            }
                        });
                    }
                    if (targ == undefined)
                    {
                        targ = creep.pos.findClosestByRange(FIND_RUINS,
                        {
                            filter: (structure) =>
                            {
                                return (structure.store.getUsedCapacity() > 0);
                            }
                        });
                    }
                    if (targ == undefined)
                    {
                        targ = creep.pos.findClosestByRange(FIND_STRUCTURES,
                        {
                            filter: (structure) =>
                            {
                                return ((structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity() > 0);
                            }
                        });
                    }
                    if (targ != undefined)
                    {
                        var resourcekeys = Object.keys(targ.store);
                        var range = creep.pos.getRangeTo(targ);
                        if (range <= 1)
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
            else if (creep.memory.memstruct.tasklist[0][0] == "downgrade")
            {
                if (creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE)
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
            else if (creep.memory.memstruct.tasklist[0][0] == "claim")
            {
                if (creep.room.controller.reservation != undefined && creep.room.controller.reservation.username != "Q13214")
                {
                    creep.attackController(creep.room.controller)
                }
                if (creep.room.controller.reservation == undefined)
                {
                    if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE)
                    {}
                }
                creep.moveTo(creep.room.controller,
                {
                    visualizePathStyle:
                    {
                        stroke: '#ffaa00'
                    }
                });
                if (creep.body.find(elem => elem.type === "claim") == undefined)
                {
                    this.loopTasks(creep);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "boost") // [0][0] boost [0][1] boosy mineral typ3e [0][2]number of bodyparts
            {

                if (creep.room.controller.level < 6)
                {
                    this.loopTasks(creep);
                }

                var boostlab;
                var flagmid = Game.flags[creep.room.name];
                var temp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, flagmid.pos.x - 2, flagmid.pos.y - 2);
                for (var i = 0; i < temp.length; i++)
                {
                    if (temp[i].structureType == STRUCTURE_LAB)
                    {
                        boostlab = temp[i];
                    }
                }
                if (boostlab == undefined)
                {

                }
                else
                {

                    var boostID = boostlab.id;
                    if (creep.pos.x == flagmid.pos.x - 1 && creep.pos.y == flagmid.pos.y - 3)
                    {
                        // if the terminal has less then use storage vice versa
                        if (boostlab != undefined)
                        {
                            creep.memory.memstruct.boosted = true;
                            var temp2 = Object.keys(boostlab.store);
                            var excesRes;
                            for (var i = 0; i < temp2.length; i++)
                            {
                                if (temp2 != "energy")
                                {
                                    //   console.log(temp2);
                                    excesRes = temp2[i];
                                }
                            }
                            var resmoveractual = Game.creeps["resourcemover" + creep.room.name];
                            if (resmoveractual != undefined && resmoveractual.memory.memstruct.tasklist.length == 0)
                            {
                                if (boostlab.store.getUsedCapacity("energy") < 1000) // stock e
                                {
                                    resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                                    resmoveractual.memory.memstruct.tasklist.push(["withdraw", resmoveractual.room.terminal.id, "energy", Math.min(2000 - boostlab.store.getUsedCapacity("energy"), resmoveractual.store.getCapacity())]);
                                    resmoveractual.memory.memstruct.tasklist.push(["transfer", boostID, "energy", Math.min(2000 - boostlab.store.getUsedCapacity("energy"), resmoveractual.store.getCapacity())]);
                                    resmoveractual.memory.memstruct.tasklist.push(["waitTick"]);
                                    // trNSFER ENERGY
                                    resmoveractual.say("lab E");
                                }
                                else if (excesRes != creep.memory.memstruct.tasklist[0][1] && temp2.length == 2) // clean resourtce
                                {
                                    // console.log(excesRes + " " + creep.memory.memstruct.tasklist[0][1]);
                                    var temp = Object.keys(boostlab.store);
                                    var excesRes;
                                    for (var i = 0; i < temp.length; i++)
                                    {
                                        if (temp != "energy")
                                        {
                                            excesRes = temp[i];
                                        }
                                    }
                                    resmoveractual.say("clean" + excesRes);
                                    resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                                    resmoveractual.memory.memstruct.tasklist.push(["withdraw", boostID, excesRes, boostlab.store.getUsedCapacity(excesRes)]);
                                    resmoveractual.memory.memstruct.tasklist.push(["transfer", resmoveractual.room.storage.id, excesRes, boostlab.store.getUsedCapacity(excesRes)]);
                                    resmoveractual.memory.memstruct.tasklist.push(["waitTick"]);
                                }
                                else if (boostlab.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][1]) >= creep.memory.memstruct.tasklist[0][2] * 30) // boost
                                {
                                    // lab boos creep here
                                    creep.say("hasboost");
                                    boostlab.boostCreep(creep, creep.memory.memstruct.tasklist[0][2])
                                    if (creep.memory.memstruct.tasklist.length > 1 && creep.memory.memstruct.tasklist[1][0] != "boost")
                                    {
                                        creep.move(TOP);
                                    }
                                    this.loopTasks(creep);
                                }
                                else if (boostlab.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][1]) < creep.memory.memstruct.tasklist[0][2] * 30) // stock resourtce
                                {
                                    var resmoveractual = Game.creeps["resourcemover" + creep.room.name];
                                    resmoveractual.say("fill2");
                                    if (resmoveractual != undefined)
                                    {
                                        var tempa = resmoveractual.room.terminal.id;
                                        if (resmoveractual.room.terminal.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][1]) < creep.memory.memstruct.tasklist[0][2] * 30)
                                        {
                                            if (resmoveractual.room.storage.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][1]) > creep.memory.memstruct.tasklist[0][2] * 30)
                                            {
                                                tempa = resmoveractual.room.storage.id;
                                            }
                                            else
                                            {

                                                var products = [
                                                    ["GHO2", "GO"],
                                                    ["UH2O", "UH"],
                                                    ["LH2O", "LH"],
                                                    ["LHO2", "LO"],
                                                    ["ZH2O", "ZH"],
                                                    ["ZHO2", "ZO"],
                                                    ["KHO2", "KO"],
                                                    ["KH2O", "KH"],
                                                    ["GH2O", "GH"],
                                                    ["XGHO2", "GHO2"],
                                                    ["XUH2O", "UH2O"],
                                                    ["XLH2O", "LH2O"],
                                                    ["XLHO2", "LHO2"],
                                                    ["XZH2O", "ZH2O"],
                                                    ["XZHO2", "ZHO2"],
                                                    ["XKHO2", "KHO2"],
                                                    ["XGH2O", "GH2O"]
                                                ];
                                                var found = false;
                                                for (qw = 0; qw < products.length; qw++)
                                                {
                                                    if (products[qw][0] == creep.memory.memstruct.tasklist[0][1])
                                                    {
                                                        creep.memory.memstruct.tasklist[0][1] = products[qw][1]
                                                        found = true;
                                                    }
                                                }

                                                if (found == false)
                                                {
                                                    resmoveractual.say("nb ", creep.memory.memstruct.tasklist[0][1]);
                                                    this.loopTasks(creep); // todo add flag to stop spawning boost creeps       
                                                }

                                            }
                                        }
                                        console.log("boost bug ",JSON.stringify(creep.memory.memstruct.tasklist[0]))
                                        var transferAmount = (creep.memory.memstruct.tasklist[0][2] * 30) - boostlab.store.getUsedCapacity(creep.memory.memstruct.tasklist[0][1]);
                                        if (transferAmount)
                                        {
                                            resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                                            resmoveractual.memory.memstruct.tasklist.push(["withdraw", tempa, creep.memory.memstruct.tasklist[0][1], transferAmount]);
                                            resmoveractual.memory.memstruct.tasklist.push(["transfer", boostID, creep.memory.memstruct.tasklist[0][1], transferAmount]);
                                            resmoveractual.memory.memstruct.tasklist.push(["waitTick"]);
                                        }
                                        
                                        
                                        
                                    }
                                }
                            }
                            // cleanup
                        } //. BOOSTLAB UNDEFINED 
                    }
                    else
                    {
                        creep.say("movetb");
                        var roompos = new RoomPosition(creep.room.storage.pos.x - 1, creep.room.storage.pos.y - 3, creep.room.name);
                        var pathh = creep.pos.findPathTo(roompos,
                        {
                            ignoreCreeps: true
                        });
                        creep.say(pathh.length);
                        creep.say(pathh[0].y);
                        var nextPosition = new RoomPosition(pathh[0].x, pathh[0].y, creep.room.name);
                        // var blockingcreep = nextPosition.findInRange(FIND_MY_CREEPS);
                        var targets2 = nextPosition.findInRange(FIND_MY_CREEPS, 0);
                        var a = creep.moveByPath(pathh);
                        //creep.say(a);
                        if (targets2.length != 0 && (pathh.length > 1 || (targets2[0].memory.memstruct.tasklist.length == 0 || targets2[0].memory.memstruct.tasklist[0][0] != "boost")))
                        {
                            creep.say("blocked");
                            var blockingCreeps = creep.pos.findInRange(FIND_MY_CREEPS, 1);
                            for (var ii = 0; ii < blockingCreeps.length; ii++)
                            {
                                blockingCreeps[ii].moveTo(creep);
                            }
                            creep.moveByPath(pathh);
                        }
                    }
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "moveToflag")
            {
                creep.say("moveToflag");
                var targobject = Game.flags[creep.memory.memstruct.tasklist[0][1]];
                if (!targobject)
                {
                    //         this.loopTasks(creep);
                }
                else
                {
                    var range = creep.pos.getRangeTo(targobject);
                    if (range > 0)
                    {
                        creep.say("a");
                        creep.moveTo(targobject);
                    }
                    else if (range == 0)
                    {
                        this.loopTasks(creep);
                    }
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "moveToObjectLoose")
            {
                creep.say("e");
                var targobject = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]).pos;
                if (!targobject)
                {
                    this.loopTasks(creep);
                }
                //   var targetRoomFlag = Game.flags[creep.memory.memstruct.tasklist[0][1]];
                try
                {
                    var targobject = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]).pos;
                    var range = creep.pos.getRangeTo(targobject);
                    creep.say("t-" + targobject.pos);
                    if (range > 3)
                    {
                        creep.moveTo(targobject);
                        creep.say("r-" + range);
                    }
                    else if (range < 4)
                    {
                        creep.say("in range");
                        // this.loopTasks(creep);
                        return false;
                    }
                }
                catch (e)
                { // losing visual on object
                    //     creep.say("error");
                    this.loopTasks(creep);
                }
                this.allowSlave(creep);
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "moveToRoom")
            {
                if (creep.body.find(elem => elem.type === "heal") != undefined && creep.hits < creep.hitsMax)
                {
                    creep.heal(creep);
                }
                //   var targetRoomFlag = Game.flags[creep.memory.memstruct.tasklist[0][1]];
                var targposition = new RoomPosition(25, 25, creep.memory.memstruct.tasklist[0][1]);
                var pos1 = creep.pos;
                var pos2 = targposition;
                const range = creep.pos.getRangeTo(targposition);
                if (range > 24)
                { // might cause bug on nxt room wall 
                    creep.moveTo(targposition);
                    Game.map.visual.line(creep.pos, targposition,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                    var targets = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    var range2 = creep.pos.getRangeTo(targets);
                    if (range2 <= 5)
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
                this.allowSlave(creep);
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "forcemoveToRoom")
            {
                if (creep.body.find(elem => elem.type === "heal") != undefined && creep.hits < creep.hitsMax)
                {
                    creep.heal(creep);
                }
                var targetsa = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);

                if (targetsa.length != 0)
                {
                    Memory.roomlist[creep.room.name].dangerLevel = 8;

                }

                if (creep.body.find(elem => elem.type === "ranged_attack") != undefined && targetsa.length != 0)
                {

                    //         creep.rangedMassAttack();
                }
                //   var targetRoomFlag = Game.flags[creep.memory.memstruct.tasklist[0][1]];
                var targposition = new RoomPosition(25, 25, creep.memory.memstruct.tasklist[0][1]);
                var pos1 = creep.pos;
                var pos2 = targposition;
                const range = creep.pos.getRangeTo(targposition);
                if (range > 23)
                { // might cause bug on nxt room wall 
                    creep.moveTo(targposition);
                    Game.map.visual.line(creep.pos, targposition,
                    {
                        color: '#000000',
                        lineStyle: 'solid'
                    });
                    var targets = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    var range2 = creep.pos.getRangeTo(targets);
                    if (range2 <= 5)
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
            else if (creep.memory.memstruct.tasklist[0][0] == "attackMoveToRoom")
            {
                var targetRoomFlag = Game.flags[creep.memory.memstruct.tasklist[0][1]];
                var pos1 = creep.pos;
                var pos2 = targetRoomFlag.pos;
                var range = creep.pos.getRangeTo(targetRoomFlag.pos);
                if (range > 23)
                { // might cause bug on nxt room wall 
                    var targets = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    var range2 = creep.pos.getRangeTo(targets);
                    if (range2 <= 4)
                    {
                        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                        var targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                        var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                        if (targets.length > 0)
                        {
                            creep.rangedAttack(targets[0]);
                        }
                        if (creep.hits < creep.hitsMax)
                        {
                            creep.heal(creep);
                        }
                        if (creep.memory.attackrole == "ranger")
                        { // long range creeps here 
                            var range = creep.pos.getRangeTo(target);
                            if (range > 3)
                            {
                                creep.moveTo(target);
                            }
                            if (range < 3 || (creep.hits + 300 < creep.hitsMax && range < 5))
                            {
                                creepfunctions.combatMove(creep, targetArr, target);
                            }
                        }
                        else
                        {
                            if (range > 1)
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
            else if (creep.memory.memstruct.tasklist[0][0] == "moveTo")
            {
                try
                {
                    creep.heal(creep);
                }
                catch (e)
                {}
                var targetposition = new RoomPosition(creep.memory.memstruct.tasklist[0][1], creep.memory.memstruct.tasklist[0][2], creep.room.name);
                var range = creep.pos.getRangeTo(targetposition);
                if (range != 0)
                {
                    creep.moveTo(targetposition);
                    // creep.say(range);
                }
                else
                {
                    this.loopTasks(creep);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "moveToLoose")
            {
                var targetposition = new RoomPosition(creep.memory.memstruct.tasklist[0][1], creep.memory.memstruct.tasklist[0][2], creep.room.name);
                var range = creep.pos.getRangeTo(targetposition);
                if (range > 2)
                {
                    creep.moveTo(targetposition);
                    creep.say(range);
                }
                else
                {
                    this.loopTasks(creep);
                }
                this.allowSlave(creep);
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "moveToLooseinterRoom")
            {
                creep.rangedMassAttack();
                var targetposition = new RoomPosition(creep.memory.memstruct.tasklist[0][1], creep.memory.memstruct.tasklist[0][2], creep.memory.memstruct.tasklist[0][3]);
                var d = new RoomPosition(creep.memory.memstruct.tasklist[0][1], creep.memory.memstruct.tasklist[0][2], creep.room.name);
                var ranged = creep.pos.getRangeTo(d);
                var range = creep.pos.getRangeTo(targetposition);
                if (range > 2)
                {
                    creep.moveTo(targetposition);
                    creep.say(range);
                }
                else if (creep.room.name == creep.memory.memstruct.tasklist[0][3] && ranged < 24)
                {
                    this.loopTasks(creep);
                }
                this.allowSlave(creep);
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "waituntil")
            {
                if (Game.time < creep.memory.memstruct.tasklist[0][1])
                {
                    creep.say("wait");
                }
                else
                {
                    this.loopTasks(creep);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "repair")
            {
                try
                {
                    var target = Game.getObjectById(creep.memory.memstruct.tasklist[0][1]);
                    if (target.hits + 800 > target.hitsMax)
                    {
                        this.loopTasks(creep);
                    }
                    if (creep.store.getUsedCapacity("energy") != 0)
                    {
                        if (creep.repair(target) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(target);
                        }
                    }
                    else
                    {
                        this.loopTasks(creep);
                    }
                }
                catch (e)
                {
                    this.loopTasks(creep);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "renewfull")
            {
                var spawnss = creep.pos.findClosestByPath(FIND_MY_SPAWNS,
                {
                    filter: (structure) =>
                    {
                        return (structure.spawning == undefined);
                    }
                });
                try
                {
                    creep.moveTo(spawnss,
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                    var range = creep.pos.getRangeTo(spawnss);
                    if (range == 1)
                    {
                        spawnss.renewCreep(creep);
                    }
                }
                catch (e)
                {}
                var found = false;
                for (var ik = 0; ik < creep.body.length; ik++)
                {
                    if (creep.body[ik] == CLAIM)
                    {
                        found = true;
                    }
                }
                var tmp = 1480;
                if (found == true)
                {
                    tmp = 0;
                }
                if (creep.ticksToLive > tmp)
                {
                    this.loopTasks(creep);
                }
            }
            else if (creep.memory.memstruct.tasklist[0][0] == "boosAllMax") // used only by combat will deal with dismantel attack heal ranged_attack tough and move only 
            {
                var numberOfHealParts = 0;
                var numberOfAttackParts = 0;
                var numberOfRangedParts = 0;
                var numberOfMoveParts = 0;
                var numberOfWorkParts = 0;
                var numberOfToughParts = 0;
                var numberOfcarryParts = 0;
                var arraytopush = [];
                for (var j = 0; j < creep.body.length; j++)
                {
                    if (creep.body[j].type == HEAL)
                    {
                        numberOfHealParts++;
                    }
                    if (creep.body[j].type == ATTACK)
                    {
                        numberOfAttackParts++;
                    }
                    if (creep.body[j].type == RANGED_ATTACK)
                    {
                        numberOfRangedParts++;
                    }
                    if (creep.body[j].type == WORK)
                    {
                        numberOfWorkParts++;
                    }
                    if (creep.body[j].type == MOVE)
                    {
                        numberOfMoveParts++;
                    }
                    if (creep.body[j].type == TOUGH)
                    {
                        numberOfToughParts++;
                    }
                    if (creep.body[j].type == CARRY)
                    {
                        numberOfcarryParts++;
                    }
                }
                if (numberOfHealParts != 0)
                {
                    arraytopush.push(["boost", "XLHO2", numberOfHealParts]);
                }
                if (numberOfcarryParts != 0)
                {
                    arraytopush.push(["boost", "XKH2O", numberOfcarryParts]);
                }
                if (numberOfAttackParts != 0)
                {
                    arraytopush.push(["boost", "XUH2O", numberOfAttackParts]);
                }
                if (numberOfRangedParts != 0)
                {
                    arraytopush.push(["boost", "XKHO2", numberOfRangedParts]);
                }
                if (numberOfWorkParts != 0)
                {
                    arraytopush.push(["boost", "XZH2O", numberOfWorkParts]);
                }
                if (numberOfMoveParts != 0)
                {
                    arraytopush.push(["boost", "XZHO2", numberOfMoveParts]);
                }
                if (numberOfToughParts != 0)
                {
                    arraytopush.push(["boost", "XGHO2", numberOfToughParts]);
                }
                this.loopTasks(creep);
                for (var i = 0; i < creep.memory.memstruct.tasklist.length; i++)
                {
                    arraytopush.push(creep.memory.memstruct.tasklist[i]);
                }
                creep.memory.memstruct.tasklist = arraytopush;
            }
            else
            {
                this.loopTasks(creep);
            }
        }
        else
        {
            this.loopTasks(creep);
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
        if (homeflag.memory.flagstruct.haulerOUT == undefined)
        {
            homeflag.memory.flagstruct.haulerOUT = Game.time;
        }
        if (Game.time - homeflag.memory.flagstruct.haulerOUT > 80 && haulersFREE.length != 0)
        { // if a mover was NOT recently sent out
            console.log("summoning hauler");
            haulersFREE[0].memory.memstruct.tasklist = [
                ["deposit"],
                ["moveToRoom", targroom],
                ["gatherLooseResources"],
                ["gatherstoredResources"],
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
        if (droppedresources != undefined)
        {
            var range = creep.pos.getRangeTo(droppedresources);
            if (range <= 1)
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
        if (creep.memory.isrenweing == undefined)
        {
            creep.memory.isrenweing = false;
        }
        if (creep.ticksToLive < timeer)
        {
            creep.memory.isrenweing = true;
        }
        if (creep.ticksToLive > 1400)
        {
            creep.memory.isrenweing = false;
        }
        if (creep.memory.isrenweing)
        {
            if (creep.room.name == homeroom)
            {
                if (creep.memory.isrenweing)
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
                if (range > 23)
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
        if (storageactual != undefined)
        {
            if (storageactual.store.getUsedCapacity() < 20000)
            {
                var range = creep.pos.getRangeTo(storageactual);
                if (range <= 1)
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
        if (containers == undefined)
        {
            containers = creep.pos.findClosestByRange(FIND_STRUCTURES,
            {
                filter: (s) =>
                {
                    return s.structureType == STRUCTURE_LINK && s.store.getUsedCapacity("energy") > 500;
                }
            });
        }
        if (containers != undefined && containers != null)
        {
            if (creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
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
            if (storageMain != undefined && storageMain.store.getUsedCapacity() > 50000)
            {
                var range = creep.pos.getRangeTo(storageMain);
                if (range <= 1)
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
        if (creep.memory.tasklist[0] == "moveto")
        {
            const path = creep.pos.findPathTo(creep.memory.targetroom);
            if (path.length > 0)
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
        if (repairtarg)
        {
            var range = creep.pos.getRangeTo(repairtarg);
            if (range <= 3)
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
        if (repairtarg)
        {
            var range = creep.pos.getRangeTo(repairtarg);
            if (range <= 3)
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
    upkeepwalls: function(creep)
    {
        var repairtarg = creep.pos.findClosestByRange(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return (s.structureType == STRUCTURE_WALL && s.hits < s.hitsMax * 0.1) || (s.structureType == STRUCTURE_RAMPART && s.hits < s.hitsMax * 0.5);
            }
        });
        if (repairtarg)
        {
            var range = creep.pos.getRangeTo(repairtarg);
            if (range <= 3)
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
    upgradecontroller: function(creep)
    {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
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
        if (buildingsneedingenergy.length > 0)
        {
            if (creep.transfer(creep.pos.findClosestByPath(buildingsneedingenergy), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
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
    mineCorridor: function(creep)
    {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var deposoits = creep.room.find(FIND_DEPOSITS,
        {
            filter: (dep) =>
            {
                return (dep.lastCooldown < 120);
            }
        });
        if (deposoits.length != 0 && Game.rooms[creep.memory.memstruct.spawnRoom].controller.level > 4)
        {
            if (!target)
            {
                if (Game.rooms[creep.memory.memstruct.spawnRoom].controller.level == 5)
                {
                    var bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY];
                }
                else if (Game.rooms[creep.memory.memstruct.spawnRoom].controller.level == 6)
                {
                    var bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY];
                }
                else if (Game.rooms[creep.memory.memstruct.spawnRoom].controller.level > 6)
                {
                    var bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY];
                }
                Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(bgodyparts, 'coridor miner' + creep.room.name,
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: creep.memory.memstruct.spawnRoom,
                            tasklist: [
                                ["forcemoveToRoom", creep.room.name],
                                ["mineCoridor"],
                                ["forcemoveToRoom", creep.memory.memstruct.spawnRoom],
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
                var lvl = Game.rooms[creep.memory.memstruct.spawnRoom].controller.level;
                var bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK];
                if (lvl == 6)
                {
                    bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK]
                }
                if (lvl > 6)
                {
                    bgodyparts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK]
                }
                var corridorRoomList = Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.corridorRooms;
                var tmptasklist = [];
                if (corridorRoomList == undefined)
                {
                    Game.flags[creep.memory.memstruct.spawnRoom].memory.flagstruct.claimedroomstuct.corridorRooms = [];
                }
                tmptasklist.push(["createslave", "healer"]);
                for (var c = 0; c < corridorRoomList.length; c++)
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
        if (constructionsites != undefined)
        {
            var range = creep.pos.getRangeTo(constructionsites);
            if (range <= 3)
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