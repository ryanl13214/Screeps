 
var quadsquad = {
    createCostmatric: function(posision, creep, combatRange) {},
    getProperPositionForQuadSquad: function(posision, creep, squadID) {
        var posx = posision.x;
        var posy = posision.y;
        var posroom = posision.roomName;
        var leaderid = Memory.squadObject[squadID].leader
        var leader = Game.getObjectById(leaderid);
        // close combat ranges
        var posArray = [
            [-1, 0],
            [-1, -1],
            [0, -2],
            [1, -2],
            [0, 1],
            [1, 1],
            [2, 0],
            [2, -1]
        ];
        // rangerd attack
        var posArray2 = [
            [-2, -2],
            [-2, -1],
            [-2, 0],
            [-2, 1],
            [3, -2],
            [3, -1],
            [3, 0],
            [3, 1],
            [-1, -3],
            [0, -3],
            [1, -3],
            [2, -3],
            [-1, 2],
            [0, 2],
            [1, 2],
            [2, 2]
        ];



        var targets = leader.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
        if (targets.length == 0) {
            var combatRange = 10;
        } else if (1 == 1 && targets.length != 0) // if quad is blinky 
        {
            var combatRange = 3;
        }
        var array;
        if (combatRange == 10) {
            var array = posArray;
        } else {
            var array = posArray2;
        }




        var returnPos = new RoomPosition(25, 25, leader.room.name);
        for (var c = 0; c < array.length; c++) {
            var skip = false;
            try {
                var newpos = new RoomPosition(posx + array[c][0], posy + array[c][1], posroom);
                var terrain = new Room.Terrain(leader.room.name);
                if (terrain.get(newpos.x, newpos.y) == TERRAIN_MASK_WALL || newpos.x == 50 || newpos.x == 0 || newpos.y == 0 || newpos.y == 50) // costs avoid 
                {
                    skip = true;
                }
                if (terrain.get(newpos.x - 1, newpos.y) == TERRAIN_MASK_WALL) // costs avoid 
                {
                    skip = true;
                }
                if (terrain.get(newpos.x - 1, newpos.y + 1) == TERRAIN_MASK_WALL) // costs avoid 
                {
                    skip = true;
                }
                if (terrain.get(newpos.x, newpos.y + 1) == TERRAIN_MASK_WALL) // costs avoid 
                {
                    skip = true;
                }
                var xx = newpos.x;
                var yy = newpos.y;
                var found11 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(newpos.x, newpos.y, leader.room.name));
                var found22 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(newpos.x - 1, newpos.y, leader.room.name));
                var found33 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(newpos.x - 1, newpos.y + 1, leader.room.name));
                var found44 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(newpos.x, newpos.y + 1, leader.room.name));
                if ((found11.length != 0 || found22.length != 0 || found33.length != 0 || found44.length != 0)) // costs avoid 
                {
                    skip = true;
                }
                var myCreeps = leader.pos.findInRange(FIND_MY_CREEPS, 3);
                if (myCreeps.length > 3) {
                    var found1 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(newpos.x, newpos.y, leader.room.name));
                    var found2 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(newpos.x - 1, newpos.y, leader.room.name));
                    var found3 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(newpos.x - 1, newpos.y + 1, leader.room.name));
                    var found4 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(newpos.x, newpos.y + 1, leader.room.name));
                } else {
                    var found1 = [];
                    var found2 = [];
                    var found3 = [];
                    var found4 = [];
                }
                if ((found1.length != 0 || found2.length != 0 || found3.length != 0 || found4.length != 0) && leader.pos.x != newpos.x && leader.pos.y != newpos.y) // costs avoid 
                {
                    skip = true;
                    Game.rooms[leader.room.name].visual.circle(newpos.x, newpos.y, {
                        fill: 'solid',
                        radius: 0.15,
                        stroke: 'grey'
                    });
                }
            } catch (e) {
                skip = true;
            }
            var possave;
            if (skip == false) {
                var path = leader.room.findPath(leader.pos, newpos);
                if (leader.pos.x == newpos.x && leader.pos.y == newpos.y) {
                    return newpos;
                }
                if (path && path.length != 0 && path[path.length - 1] != null && path[path.length - 1].x == newpos.x && path[path.length - 1].y == newpos.y) {
                    if (leader.pos.x == newpos.x && leader.pos.y == newpos.y) {
                        Game.rooms[leader.room.name].visual.circle(newpos.x, newpos.y, {
                            fill: 'solid',
                            radius: 0.55,
                            stroke: 'black'
                        });
                        return newpos;
                    } else {
                        Game.rooms[leader.room.name].visual.circle(newpos.x, newpos.y, {
                            fill: 'solid',
                            radius: 0.55,
                            stroke: 'white'
                        });
                        returnPos = newpos;
                    }
                } else if (leader.pos.x != newpos.x && leader.pos.y != newpos.y) {
                    Game.rooms[leader.room.name].visual.circle(newpos.x, newpos.y, {
                        fill: 'solid',
                        radius: 0.55,
                        stroke: 'blue'
                    });
                }
            }
        }
        leader.room.visual.line(leader.pos, returnPos, {
            color: 'red',
            lineStyle: 'dashed',
            width: 0.4
        });
        return returnPos;
    },
    moveIntoFormation: function(leaderid, squadID) {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++) {
            if (mainMemoryObject.SquadMembersCurrent[c] != leaderid) {
                all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
        }
        var leader = Game.getObjectById(leaderid);
        var found1 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(leader.pos.x - 1, leader.pos.y, leader.room.name));
        var found2 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(leader.pos.x - 1, leader.pos.y + 1, leader.room.name));
        var found3 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(leader.pos.x, leader.pos.y + 1, leader.room.name));
        for (var c = 0; c < all.length; c++) {
            var alreadyInCube = false;
            if (all[c].pos.x == leader.pos.x - 1 && all[c].pos.y == leader.pos.y) {
                all[c].say("tl");
                alreadyInCube = true;
            }
            if (all[c].pos.x == leader.pos.x - 1 && all[c].pos.y == leader.pos.y + 1) {
                all[c].say("bl");
                alreadyInCube = true;
            }
            if (all[c].pos.x == leader.pos.x && all[c].pos.y == leader.pos.y + 1) {
                all[c].say("br");
                alreadyInCube = true;
            }
            if (!alreadyInCube) {
                all[c].say("ftr");
                if (found1.length == 0) {
                    var targpos = new RoomPosition(leader.pos.x - 1, leader.pos.y, leader.room.name);
                    all[c].moveTo(targpos);
                } else if (found2.length == 0) {
                    var targpos = new RoomPosition(leader.pos.x - 1, leader.pos.y + 1, leader.room.name);
                    all[c].moveTo(targpos);
                } else if (found3.length == 0) {
                    var targpos = new RoomPosition(leader.pos.x, leader.pos.y + 1, leader.room.name);
                    all[c].moveTo(targpos);
                }
            }
        }
    },
    checkIfInCube: function(squadID, leaderid) {
        var InCube = 0;
        var mainMemoryObject = Memory.squadObject[squadID];
        var leader = Game.getObjectById(leaderid);
        var all = [];
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++) {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        for (var c = 0; c < all.length; c++) {
            if (all[c].pos.x == leader.pos.x - 1 && all[c].pos.y == leader.pos.y) {
                InCube++;
            }
            if (all[c].pos.x == leader.pos.x - 1 && all[c].pos.y == leader.pos.y + 1) {
                InCube++;
            }
            if (all[c].pos.x == leader.pos.x && all[c].pos.y == leader.pos.y + 1) {
                InCube++;
            }
        }
        if (InCube == 3) {
            return true;
        }
        return false;
    },
    decideLeader: function(squadID) {
        var mainMemoryObject = Memory.squadObject[squadID];
        var allSpacesFree = false;
        var all = [];
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++) {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        for (var c = 0; c < all.length; c++) {
            var squadNearBorder = false;
            if (all[c].pos.x < 2 || all[c].pos.x > 47 || all[c].pos.y < 2 || all[c].pos.y > 47) {
                squadNearBorder = true;
            }
            if (!squadNearBorder) {
                var foundS = all[c].room.lookForAt(LOOK_STRUCTURES, new RoomPosition(all[c].pos.x - 1, all[c].pos.y, all[c].room.name));
                if (foundS.length == 0) {
                    var foundS = all[c].room.lookForAt(LOOK_STRUCTURES, new RoomPosition(all[c].pos.x - 1, all[c].pos.y + 1, all[c].room.name));
                    if (foundS.length == 0) {
                        var foundS = all[c].room.lookForAt(LOOK_STRUCTURES, new RoomPosition(all[c].pos.x, all[c].pos.y + 1, all[c].room.name));
                        if (foundS.length == 0) {
                            allSpacesFree = true;
                            return all[c].id;
                        }
                    }
                }
            }
        }
        return all[0].id; // leader is blocked
    },
    moveAsOne: function(squadID, diretion) {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++) {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        var fatigueAll = 0;
        for (var c = 0; c < all.length; c++) {
            fatigueAll += all[c].fatigue;
        }
        if (fatigueAll == 0) {
            for (var c = 0; c < all.length; c++) {
                all[c].move(diretion);
            }
        }
    },
    CheckIfLeaderIsDead: function(squadID) {
        return false;
    },
    leaderBlocked: function(squadID) {
        var mainMemoryObject = Memory.squadObject[squadID];
        var leader = Game.getObjectById(mainMemoryObject.leader);
        leader.say("check");
        if (leader.pos.x < 2 || leader.pos.x > 47 || leader.pos.y < 2 || leader.pos.y > 47) {
            return true;
        } else {
            var found1 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(leader.pos.x - 1, leader.pos.y, leader.room.name));
            var found2 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(leader.pos.x - 1, leader.pos.y + 1, leader.room.name));
            var found3 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(leader.pos.x, leader.pos.y + 1, leader.room.name));
            if (found1.length == 0 && found2.length == 0 && found3.length == 0) {
                leader.say("clear");
                return false;
            } else {
                leader.say("blocked");
                return true;
            }
        }
    },
    getDirectionToTarget: function(squadID, leaderid, target) {
        var leader = Game.getObjectById(leaderid); // pathfinding here
        var path = leader.pos.findPathTo(target);
        // use the target finder for the displaced targets
        let goals = {
            pos: target,
            range: 0
        };
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++) {
            // cound how many have rsanged
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        let ret = PathFinder.search(
            leader.pos, target, {
                // We need to set the defaults costs higher so that we
                // can set the road cost lower in `roomCallback`
                plainCost: 1,
                swampCost: 5,
                roomCallback: function(roomName) {
                    let room = leader.room;
                    // In this example `room` will always exist, but since 
                    // PathFinder supports searches which span multiple rooms 
                    // you should be careful!
                    if (!room) return;
                    let costs = new PathFinder.CostMatrix;
                    var terrain = new Room.Terrain(roomName);
                    for (var xx = 2; xx < 48; xx++) {
                        for (var yy = 2; yy < 48; yy++) {
                            if (terrain.get(xx, yy) == TERRAIN_MASK_SWAMP) {
                                //  Game.rooms[roomName].visual.circle(xx, yy,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 5);
                            }
                            if (terrain.get(xx - 1, yy) == TERRAIN_MASK_SWAMP) {
                                //  Game.rooms[roomName].visual.circle(xx , yy,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 5);
                            }
                            if (terrain.get(xx, yy + 1) == TERRAIN_MASK_SWAMP) {
                                // Game.rooms[roomName].visual.circle(xx, yy ,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 5);
                            }
                            if (terrain.get(xx - 1, yy + 1) == TERRAIN_MASK_SWAMP) {
                                // Game.rooms[roomName].visual.circle(xx, yy ,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 5);
                            }
                        }
                    }
                    for (var xx = 0; xx < 50; xx++) {
                        costs.set(xx, 0, 49);
                        costs.set(0, xx, 49);
                        costs.set(xx, 50, 49);
                        costs.set(50, xx, 49);
                        costs.set(xx, 1, 49);
                        costs.set(1, xx, 49);
                        costs.set(xx, 49, 49);
                        costs.set(49, xx, 49);
                    }
                    room.find(FIND_MY_CREEPS).forEach(function(struct) {
                        var tmp = 0;
                        for (var xx = 0; xx < all.length; xx++) {
                            if (all[xx].pos.x == struct.pos.x && all[xx].pos.y == struct.pos.y) {
                                tmp = 1;
                            }
                        }
                        if (tmp == 0) {
                            room.visual.circle(struct.pos.x, struct.pos.y, {
                                fill: 'transparent',
                                radius: 0.08,
                                stroke: 'black'
                            });
                            costs.set(struct.pos.x, struct.pos.y, 0xff);
                            costs.set(struct.pos.x + 1, struct.pos.y, 0xff);
                            costs.set(struct.pos.x + 1, struct.pos.y - 1, 0xff);
                            costs.set(struct.pos.x, struct.pos.y - 1, 0xff);
                        }
                    });
                    room.find(FIND_MY_POWER_CREEPS).forEach(function(struct) {
                        room.visual.circle(struct.pos.x, struct.pos.y, {
                            fill: 'transparent',
                            radius: 0.08,
                            stroke: 'black'
                        });
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                        costs.set(struct.pos.x + 1, struct.pos.y, 0xff);
                        costs.set(struct.pos.x + 1, struct.pos.y - 1, 0xff);
                        costs.set(struct.pos.x, struct.pos.y - 1, 0xff);
                    });
                    room.find(FIND_STRUCTURES).forEach(function(struct) {
                        if (struct.structureType !== STRUCTURE_CONTAINER && struct.structureType !== STRUCTURE_ROAD && (struct.structureType !== STRUCTURE_RAMPART || !struct.my)) {
                            //  Game.rooms[roomName].visual.circle(struct.pos.x, struct.pos.y,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                            costs.set(struct.pos.x, struct.pos.y, 0xff);
                            //   Game.rooms[roomName].visual.circle(struct.pos.x, struct.pos.y-1,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                            costs.set(struct.pos.x, struct.pos.y - 1, 0xff);
                            //       Game.rooms[roomName].visual.circle(struct.pos.x-1, struct.pos.y-1,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                            costs.set(struct.pos.x + 1, struct.pos.y - 1, 0xff);
                            //     Game.rooms[roomName].visual.circle(struct.pos.x-1, struct.pos.y,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                            costs.set(struct.pos.x + 1, struct.pos.y, 0xff);
                        }
                    });
                    for (var xx = 0; xx < 50; xx++) {
                        for (var yy = 0; yy < 50; yy++) {
                            if (terrain.get(xx, yy) == TERRAIN_MASK_WALL) {
                                //  Game.rooms[roomName].visual.circle(xx, yy,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 0xff);
                            }
                            if (terrain.get(xx - 1, yy) == TERRAIN_MASK_WALL) {
                                //  Game.rooms[roomName].visual.circle(xx , yy,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 0xff);
                            }
                            if (terrain.get(xx, yy + 1) == TERRAIN_MASK_WALL) {
                                // Game.rooms[roomName].visual.circle(xx, yy ,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 0xff);
                            }
                            if (terrain.get(xx - 1, yy + 1) == TERRAIN_MASK_WALL) {
                                // Game.rooms[roomName].visual.circle(xx, yy ,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 0xff);
                            }
                        }
                    }
                    return costs;
                },
            }
        );
        var pos = ret.path[0];
        if (ret.path.length == 0) {
            var path = leader.pos.findPathTo(target);
            var pos = path[0];
        } else {
            var pos = ret.path[0];
        }
        for (var xx = 0; xx < ret.path.length; xx++) {
            Game.rooms[leader.room.name].visual.circle(ret.path[xx].x, ret.path[xx].y, {
                fill: 'transparent',
                radius: 0.15,
                stroke: 'red'
            });
        }
        //     creep.move(leader.pos.getDirectionTo(pos));
        return leader.pos.getDirectionTo(pos);
    },
    targetAquisitionPURECOMBAT: function(squadID, leaderid) {
        // depending on squad type 
        // deconstruct ----------------- pure structure targeting maybe avoid defencive creeps
        // blinky      ----------------- mainly creep vs creep combat 
        // attack      ----------------- squad hunter and structure 
        var mainMemoryObject = Memory.squadObject[squadID];
        var leader = Game.getObjectById(mainMemoryObject.leader);
        var target = leader.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined) {
            return new RoomPosition(target.pos.x, target.pos.y, target.room.name);
        } else {
            return 0;
        }
    },
    targetAquisitionRoomAttack: function(squadID, leaderid) {
        // depending on squad type 
        // deconstruct ----------------- pure structure targeting maybe avoid defencive creeps
        // blinky      ----------------- mainly creep vs creep combat 
        // attack      ----------------- squad hunter and structure 
        var mainMemoryObject = Memory.squadObject[squadID];
        var leader = Game.getObjectById(mainMemoryObject.leader);
        var target = leader.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
            filter: function(object) {
                return (object.structureType != STRUCTURE_KEEPER_LAIR && object.structureType != STRUCTURE_PORTAL && object.structureType != STRUCTURE_POWER_BANK && object.structureType != STRUCTURE_EXTRACTOR);
            }
        });



        var target2 = leader.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: function(object) {
                return (object.structureType != STRUCTURE_KEEPER_LAIR && object.structureType != STRUCTURE_PORTAL && object.structureType != STRUCTURE_POWER_BANK && object.structureType != STRUCTURE_EXTRACTOR && object.structureType != STRUCTURE_RAMPART && object.structureType != STRUCTURE_WALL);
            }
        });



        if (target2 != undefined) {

            Game.rooms[leader.room.name].visual.circle(target2.pos.x, target2.pos.y, {
                fill: 'green',
                radius: 0.35,
                stroke: 'green'
            });
            return new RoomPosition(target2.pos.x, target2.pos.y, target2.room.name);



        } else if (target != undefined) {
            Game.rooms[leader.room.name].visual.circle(target.pos.x, target.pos.y, {
                fill: 'blue',
                radius: 0.35,
                stroke: 'blue'
            });
            return new RoomPosition(target.pos.x, target.pos.y, target.room.name);
        } else {
            return 0;
        }
    },
    loopTasks: function(squadID, tasklist) {
        //     console.log(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0]);
        if (tasklist[tasklist.length - 1][0] == "repeat") {
            //   creep.say(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0]);
            if (tasklist[tasklist.length - 1][1] + 1 == tasklist.length) {
                var tmpstore = tasklist[tasklist.length - 1]
                var back = tasklist.splice(0, 1);
                tasklist[tasklist.length - 1] = back[0];
                tasklist.push(tmpstore);
            } else {
                tasklist.splice(0, 1);
            }
        } else {
            tasklist.splice(0, 1);
        }
        Memory.squadObject[squadID].arrayOfSquadGoals = tasklist;
    },
    TaskList: function(squadID) {
        //tasks 
        //clear room (kill all hostiles)
        //guard room
        // attack room
        // kill creep(Also used for squads so provide list of targety creeps)
        //arrayOfSquadGoals
        var mainMemoryObject = Memory.squadObject[squadID];
        var tasklist = mainMemoryObject.arrayOfSquadGoals;
        var leaderid = Memory.squadObject[squadID].leader;
        if (tasklist.length != 0 && tasklist[0] != undefined) {
            if (tasklist[0][0] == "clearroom") {
                if (Memory.squadObject[squadID].leader != undefined) {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    if (Memory.squadObject[squadID].leader != undefined) {
                        // deteck hostile creeps and room match 
                        var leader = Game.getObjectById(leaderid);
                        var range = leader.pos.getRangeTo(new RoomPosition(25, 25, tasklist[0][1]));
                        if (range < 23) {
                            var targetTmp = this.targetAquisitionPURECOMBAT(squadID, leaderid);
                            if (targetTmp == 000) {
                                this.loopTasks(squadID, tasklist);
                            } else {
                                return this.getProperPositionForQuadSquad(targetTmp, leader, squadID);
                            }
                        } else {
                            return new RoomPosition(25, 25, tasklist[0][1]);
                        }
                    }
                }
            }
            if (tasklist[0][0] == "movetoRoom" || tasklist[0][0] == "moveToRoom" || tasklist[0][0] == "forcemoveToRoom") {
                if (Memory.squadObject[squadID].leader != undefined) {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    var range = leader.pos.getRangeTo(new RoomPosition(25, 25, tasklist[0][1]));
                    if (range < 23) {
                        this.loopTasks(squadID, tasklist);
                    } else {
                        return new RoomPosition(25, 25, tasklist[0][1]);
                    }
                }
            }
            if (tasklist[0][0] == "guardroom") {
                if (Memory.squadObject[squadID].leader != undefined) {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    if (Memory.squadObject[squadID].leader != undefined) {
                        // deteck hostile creeps and room match 
                        var leader = Game.getObjectById(leaderid);
                        var targRoomPosition = new RoomPosition(25, 25, tasklist[0][1]);
                        var range = leader.pos.getRangeTo(targRoomPosition);
                        if (range < 23) {
                            var targetTmp = this.targetAquisitionPURECOMBAT(squadID, leaderid);
                            if (targetTmp == 0 || targetTmp == null || targetTmp == undefined) {
                                return new RoomPosition(25, 25, tasklist[0][1]); // stay in room and move to mid
                            } else {
                                return this.getProperPositionForQuadSquad(targetTmp, leader, squadID);
                            }
                        } else {
                            return new RoomPosition(25, 25, tasklist[0][1]);
                        }
                    }
                }
            }
            if (tasklist[0][0] == "flagAttack") {
                if (Memory.squadObject[squadID].leader != undefined) {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    if (leader.room.name == tasklist[0][1]) {

                        var targetTmp = 0;
                        var flagsinrange = leader.pos.findClosestByPath(FIND_FLAGS);

                        if (flagsinrange != undefined && targetTmp == 0) {
                            Game.rooms[leader.room.name].visual.circle(flagsinrange.pos.x, flagsinrange.pos.y, {
                                fill: 'transparent',
                                radius: 0.55,
                                stroke: 'blue'
                            });

                            if (flagsinrange != undefined) {

                                var found = flagsinrange.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                               
                                if (!found) 
                                {
                                    flagsinrange.remove();
                                }
                                else 
                                {
                                    targetTmp = found.pos;
                                }
                            }
                        }

                        //  var targetTmp = this.targetAquisitionPURECOMBAT(squadID, leaderid);
                        if (targetTmp == 0 || targetTmp == null || targetTmp == undefined) {
                            //   flags are clear general room attack   
                        } else {
                            return this.getProperPositionForQuadSquad(targetTmp, leader, squadID);
                        }
                    } else {
                        return new RoomPosition(25, 25, tasklist[0][1]);
                    }
                }
            }
            if (tasklist[0][0] == "killCreeps") {}
            if (tasklist[0][0] == "HoldAttack") // tot reset hold flag // 
            {
                if (leaderid != undefined) {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    if (leader != undefined) {
                        // deteck hostile creeps and room match 
                        var leader = Game.getObjectById(leaderid);
                        var range = leader.pos.getRangeTo(new RoomPosition(25, 25, tasklist[0][1]));
                        if (range < 23) {
                            var gameflags = leader.room.find(FIND_FLAGS);
                            if (gameflags.length != 0) {
                                for (var c = 0; c < gameflags.length; c++) {
                                    if (gameflags[c].name.substring(0, 8) == "QuadHold") {
                                        var flagtemp = gameflags[c];
                                        return new RoomPosition(flagtemp.pos.x, flagtemp.pos.y, flagtemp.pos.roomName)
                                    }
                                }
                            }
                        } else {
                            return new RoomPosition(25, 25, tasklist[0][1]);
                        }
                    }
                }
            }
            if (tasklist[0][0] == "GeneralAttack" || tasklist[0][0] == "generalAttack") {
                if (Memory.squadObject[squadID].leader != undefined) {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    if (Memory.squadObject[squadID].leader != undefined) {
                        // deteck hostile creeps and room match 
                        var leader = Game.getObjectById(leaderid);
                        var range = leader.pos.getRangeTo(new RoomPosition(25, 25, tasklist[0][1]));
                        if (range < 25) {
                            var targetTmp = this.targetAquisitionRoomAttack(squadID, leaderid);
                            if (targetTmp == 000) {
                                //     this.loopTasks(squadID, tasklist);
                            } else {
                                var QuadVital = this.DecideIfQuadIsVital(squadID);
                                if (QuadVital == true) {


                                    return this.getProperPositionForQuadSquad(targetTmp, leader, squadID);
                                } else {
                                    return targetTmp;
                                }
                            }
                        } else {
                            return new RoomPosition(25, 25, tasklist[0][1]);
                        }
                    }
                }
            }
        }
    },
    decideMassAttack: function(creep) {
        var enemiesInRange = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
        var structuresInRange = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
        var enemiesInRange2 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 2);
        var structuresInRange2 = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 2);
        var enemiesInRange3 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        var structuresInRange3 = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
        if (enemiesInRange.length != 0 || structuresInRange.length != 0) {
            return true;
        } else {
            var counter = 0;
            counter += enemiesInRange2.length * 4;
            counter += structuresInRange2.length * 4;
            counter += enemiesInRange3.length;
            counter += structuresInRange3.length;
            if (counter > 10) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    },
    handleattacks: function(squadID) {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        var target;
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++) {
            // cound how many have rsanged
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        ////////////////////
        var value = 10000;
        var index = 99;
        for (var c = 0; c < all.length; c++) {
            if (all[c].hits < value && all[c].hits != all[c].hitsMax) {
                value = all[c].hits;
                index = c;
            }
            creep = all[c];
            var target = all[c].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var targetArr = all[c].room.find(FIND_HOSTILE_CREEPS);
            var targets = all[c].pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            var tempTargs = [];
            for (var q = 0; q < targets.length; q++) {
                var tempdftg = targets[q].pos.findInRange(FIND_HOSTILE_STRUCTURES, 0, {
                    filter: function(object) {
                        return (object.structureType == STRUCTURE_RAMPART);
                    }
                });
                if (tempdftg.length == 0) {
                    tempTargs.push(targets[q]);
                }
            }
            targets = tempTargs;
            if (targets.length == 0) {
                targets = all[c].pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            }
            var flagsInRange = all[c].pos.findInRange(FIND_FLAGS, 3);
            var targetFromflag = 0;
            var targetsTRUCTURES = all[c].pos.findInRange(FIND_HOSTILE_STRUCTURES, 3, {
                filter: function(object) {
                    return (object.structureType != STRUCTURE_KEEPER_LAIR && object.structureType != STRUCTURE_PORTAL && object.structureType != STRUCTURE_POWER_BANK);
                }
            });
            if (flagsInRange.length != 0 && 1 == 1) {
                for (var q = 0; q < flagsInRange.length; q++) {
                   
                        var found = all[c].room.lookForAt(LOOK_CREEPS, flagsInRange[q].pos);
                        var found2 = all[c].room.lookForAt(LOOK_STRUCTURES, flagsInRange[q].pos);
                        if (found.length != 0) {
                            targetFromflag = found[0];
                        } else if (found2.length != 0) {
                            targetFromflag = found2[0];
                        }
                    
                }
            }
            var decideMassAttack = this.decideMassAttack(all[c]);
            if (targetFromflag != 0) {
                all[c].rangedAttack(targetFromflag);
            } else if (decideMassAttack) {
                all[c].rangedMassAttack();
            } else if (targets.length > 0) {
                all[c].rangedAttack(targets[0]);
            } else if (targetsTRUCTURES.length > 0) {
                all[c].rangedAttack(targetsTRUCTURES[0]);
            } else {
                all[c].rangedMassAttack();
            }

            if (all[c].body.find(elem => elem.type === WORK) != undefined) {

                var flagsInRange = all[c].pos.findInRange(FIND_FLAGS, 1);
                var targetFromflag;
                var targetsTRUCTURES = all[c].pos.findInRange(FIND_HOSTILE_STRUCTURES, 1, {
                    filter: function(object) {
                        return (object.structureType != STRUCTURE_KEEPER_LAIR && object.structureType != STRUCTURE_PORTAL && object.structureType != STRUCTURE_POWER_BANK);
                    }
                });
             
                for (var q = 0; q < flagsInRange.length; q++) 
                {
                    var found2 = all[c].room.lookForAt(LOOK_STRUCTURES, flagsInRange[q].pos);
                    if (found2.length != 0) 
                    {
                        targetFromflag = found2[0];
                    }
                }
                if (targetFromflag) 
                {
                    all[c].dismantle(targetFromflag);
                } 
                else if (targetsTRUCTURES.length != 0) 
                {
                    all[c].dismantle(targetsTRUCTURES[0]);
                }




            }




        }
        for (var c = 0; c < all.length; c++) {

if (all[c].body.find(elem => elem.type === HEAL) != undefined) {


            if (index != 99) {
                var range = all[c].pos.getRangeTo(all[index]);

                if (range > 1) {
                    all[c].rangedHeal(all[index]);
                } else {
                    all[c].heal(all[index]);
                }


            } else {
                all[c].heal(all[c]);
            }

}


        }
    },
    DecideIfQuadIsVital: function(squadID) {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        var leaderid = mainMemoryObject.leader;
        var leader = Game.getObjectById(leaderid);
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++) {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        var homeroomFlag = Game.flags[mainMemoryObject.squadHomeRoom];
        var target = leader.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var targetArr = leader.room.find(FIND_HOSTILE_CREEPS);
        var creepsInRnage = leader.pos.findInRange(FIND_HOSTILE_CREEPS, 6);
        if (homeroomFlag != undefined && leader.pos.getRangeTo(homeroomFlag) < 10 && targetArr.length < 1) {
            return false;
        }
        if (targetArr.length < 1) {
            return false;
        }
        var targets = leader.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 10);
            }
        });


        var targets2 = leader.room.find(FIND_HOSTILE_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 10);
            }
        });
        var squadIsNearEdge = false;
        if (leader.pos.x < 2 || leader.pos.x > 47 || leader.pos.y < 2 || leader.pos.y > 47) // and tower now here
        {
            squadIsNearEdge = true;
        }


        if (targets != undefined && leader.room.controller && leader.room.controller.level > 1) {
            if (targets2.length == 6 && squadIsNearEdge == false) {
                return true;
            }
            var range = leader.pos.getRangeTo(targets);
            if (range > 12) {
                return false;
            } else if (squadIsNearEdge == false) {
                return true;
            }
        }
        if (creepsInRnage.length < 4) {
            return false;
        } else {
            return true;
        }
        return true;
    },
    lineMove: function(squadID, target) {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        var leaderid = mainMemoryObject.leader;
        var leader = Game.getObjectById(leaderid);
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++) {
            if (mainMemoryObject.SquadMembersCurrent[c] != leaderid) {
                all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
        }
        // myArray.splice (all.indexOf('c'), 2);
        var cohesion = leader.pos.findInRange(FIND_MY_CREEPS, 3);
        if (cohesion.length > 2 || Game.time % 3 != 0) // or squadClose to edge
        {
            try {
                leader.moveTo(target);
            } catch (e) {}
        }
        try {
            all[0].moveTo(leader);
        } catch (e) {}
        try {
            all[1].moveTo(all[0]);
        } catch (e) {}
        try {
            all[2].moveTo(all[1]);
        } catch (e) {}
    },
    calculateDamage: function(creep) {
        var tempamopunt = 0;
        for (var xx = -3; xx < 3; xx++) {
            for (var yy = -3; yy < 3; yy++) {
                var tempx = creep.pos.x + xx;
                var tempy = creep.pos.y + yy;
                var newpos = new RoomPosition(tempx, tempy, creep.room.name);
                var found = newpos.findInRange(FIND_HOSTILE_CREEPS, 0);

                var found2 = creep.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(tempx, tempy, creep.room.name));
                if (found.length != 0 || found2.length != 0) {
                    if (creep.body.find(elem => elem.type === RANGED_ATTACK) != undefined) {
                        tempamopunt = tempamopunt + 10;
                    }
                }
            }
        }
        return tempamopunt;
    },



    internalRearange: function(squadID) {
        var mainMemoryObject = Memory.squadObject[squadID];
        var leader = Game.getObjectById(Memory.squadObject[squadID].leader);
        leader.say("internalRearange");
        var all = [];
        var target;
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++) {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        var fatigueAll = 0;
        for (var c = 0; c < all.length; c++) {
            fatigueAll += all[c].fatigue;
        }


        var heads = [];
        var tails = [];
        for (var c = 0; c < all.length; c++) {
            var creepername = all[c].name.substring(0, 4);
            if (creepername == "head") {
                heads.push(all[c]);
            } else {
                tails.push(all[c]);
            }




            for (var a = 0; a < heads.length; a++) {

                var dampot = 0;


                if (heads[a].body.find(elem => elem.type === WORK) != undefined || heads[a].body.find(elem => elem.type === ATTACK) != undefined) {
                    var found = heads[a].pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                    found += heads[a].pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                    for (var b = 0; b < tails.length; b++) {

                        var found2 = tails[b].pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                        found2 += tails[b].pos.findInRange(FIND_HOSTILE_CREEPS, 1);


                        if (found.length < found2.length) {
                            heads[a].moveTo(tails[b]);
                            tails[b].moveTo(heads[a]);
                        }


                    }
                } else if (heads[a].body.find(elem => elem.type === RANGED_ATTACK) != undefined) {
                    var found = heads[a].pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
                    found += heads[a].pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                    for (var b = 0; b < tails.length; b++) {

                        var found2 = tails[b].pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
                        found2 += tails[b].pos.findInRange(FIND_HOSTILE_CREEPS, 3);


                        if (found.length < found2.length) {
                            heads[a].moveTo(tails[b]);
                            tails[b].moveTo(heads[a]);
                        }


                    }
                }




            }




        }




        this.reAssignLeader(squadID);


    },

    reAssignLeader: function(squadID) {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        var target;
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++) {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }


        for (var c = 0; c < all.length; c++) {
            var found1 = all[c].room.lookForAt(LOOK_CREEPS, new RoomPosition(all[c].pos.x - 1, all[c].pos.y, all[c].room.name));
            var found2 = all[c].room.lookForAt(LOOK_CREEPS, new RoomPosition(all[c].pos.x - 1, all[c].pos.y + 1, all[c].room.name));
            var found3 = all[c].room.lookForAt(LOOK_CREEPS, new RoomPosition(all[c].pos.x, all[c].pos.y + 1, all[c].room.name));


            if (found1.length != 0 && found1.length != 0 && found1.length != 0) {
                Memory.squadObject[squadID].leader = all[c].id;
            }

        }




    },
    run: function(squadID) {
        this.handleattacks(squadID);
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        var target;
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++) {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        if (Memory.squadObject[squadID].leader == undefined) {
            Memory.squadObject[squadID].leader = this.decideLeader(squadID);
        }
        var leader = Game.getObjectById(Memory.squadObject[squadID].leader);
        if (leader == null) {
            Memory.squadObject[squadID].leader = this.decideLeader(squadID);
        }
        if (leader != null && leader != undefined && leader) {
            if (leader.pos.x < 2 || leader.pos.x > 47 || leader.pos.y < 2 || leader.pos.y > 47) // and tower now here
            {
                QuadVital = false;
            }
            /////////////////////////////////////////////////      
            //                   decide targets 
            target = this.TaskList(squadID);

            var QuadVital = this.DecideIfQuadIsVital(squadID);
            var SquadIsInFormation = this.checkIfInCube(squadID, Memory.squadObject[squadID].leader);
            var rangeToTarget = leader.pos.getRangeTo(target);

            if (rangeToTarget < 5) {
                QuadVital = true;
            }

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            leader.say(target);
            if (QuadVital == false && target != undefined) {
                leader.say("lineMove");
                this.lineMove(squadID, target);
            } else if (QuadVital == true && !SquadIsInFormation) {
                leader.say("moveIntoFormation");
                if (Memory.squadObject[squadID].leader != undefined) {
                    this.moveIntoFormation(Memory.squadObject[squadID].leader, squadID);
                }
                if (Game.time % 7 < 1) {
                    if (!SquadIsInFormation) {
                        this.lineMove(squadID, target);
                        //    Memory.squadObject[squadID].leader = undefined;
                    }
                }
            } else if (SquadIsInFormation && target != undefined && (leader.pos.x != target.x || leader.pos.y != target.y)) {
                leader.say("moveAsOne");
                var Direction = this.getDirectionToTarget(squadID, Memory.squadObject[squadID].leader, target);
                this.moveAsOne(squadID, Direction);
            } else if (leader != undefined && target != undefined && SquadIsInFormation) {
                if (leader.pos.x == target.x && leader.pos.y == target.y) {
                    this.internalRearange(squadID)
                }
            }
        }
        /////////////////////////////////////////////////////
        //                  deal damage / heal
        /////////////////////////////////////////

        /////
    }
}
module.exports = quadsquad;