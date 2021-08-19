var GlobalFunctions = require('GlobalCreepFuntions');
var quadsquad = {
    createCostmatric: function(posision, creep, combatRange) {},
    getProperPositionForQuadSquad: function(posision, creep, combatRange, squadID)
    {
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
        if(combatRange = 10)
        {
            var array = posArray;
        }
        else
        {
            var array = posArray2;
        }
        var array = posArray2;
        var returnPos = new RoomPosition(25, 25, leader.room.name);
        for(var c = 0; c < array.length; c++)
        {
            var skip = false;
            try
            {
                var newpos = new RoomPosition(posx + array[c][0], posy + array[c][1], posroom);
                var terrain = new Room.Terrain(leader.room.name);
                if(terrain.get(newpos.x, newpos.y) == TERRAIN_MASK_WALL || newpos.x == 50 || newpos.x == 0 || newpos.y == 0 || newpos.y == 50) // costs avoid 
                {
                    skip = true;
                }
                  if(terrain.get(newpos.x-1, newpos.y) == TERRAIN_MASK_WALL ) // costs avoid 
                {
                    skip = true;
                }
                  if(terrain.get(newpos.x-1, newpos.y+1) == TERRAIN_MASK_WALL ) // costs avoid 
                {
                    skip = true;
                }
                
                  if(terrain.get(newpos.x, newpos.y+1) == TERRAIN_MASK_WALL) // costs avoid 
                {
                    skip = true;
                }
                var xx = newpos.x;
                var yy = newpos.y;
                
               var found11 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(newpos.x, newpos.y, leader.room.name));
                var found22 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(newpos.x - 1, newpos.y, leader.room.name));
                var found33 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(newpos.x - 1, newpos.y + 1, leader.room.name));
                var found44 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(newpos.x, newpos.y + 1, leader.room.name));
                       if((found11.length != 0 || found22.length != 0 || found33.length != 0 || found44.length != 0)  ) // costs avoid 
                { 
                    
                   skip = true;
                }
          
                        
                var found1 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(newpos.x, newpos.y, leader.room.name));
                var found2 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(newpos.x - 1, newpos.y, leader.room.name));
                var found3 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(newpos.x - 1, newpos.y + 1, leader.room.name));
                var found4 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(newpos.x, newpos.y + 1, leader.room.name));
                
                
                
                
                if((found1.length != 0 || found2.length != 0 || found3.length != 0 || found4.length != 0) && leader.pos.x != newpos.x && leader.pos.y != newpos.y) // costs avoid 
                { 
                    skip = true;
                    Game.rooms[leader.room.name].visual.circle(newpos.x, newpos.y,
                    {
                        fill: 'solid',
                        radius: 0.15,
                        stroke: 'grey'
                    });
                }
            }
            catch (e)
            {
                skip = true;
            }
            var possave;
            if(skip == false)
            {
                var path = leader.room.findPath(leader.pos, newpos);
                if(leader.pos.x == newpos.x && leader.pos.y == newpos.y)
                {
                    return newpos;
                }
                if(path && path.length != 0 && path[path.length - 1] != null && path[path.length - 1].x == newpos.x && path[path.length - 1].y == newpos.y)
                {
                    if(leader.pos.x == newpos.x && leader.pos.y == newpos.y)
                    {
                        Game.rooms[leader.room.name].visual.circle(newpos.x, newpos.y,
                        {
                            fill: 'solid',
                            radius: 0.55,
                            stroke: 'black'
                        });
                        return newpos;
                    }
                    else
                    {
                        Game.rooms[leader.room.name].visual.circle(newpos.x, newpos.y,
                        {
                            fill: 'solid',
                            radius: 0.55,
                            stroke: 'white'
                        });
                        returnPos = newpos;
                    }
                }
                else if(leader.pos.x != newpos.x && leader.pos.y != newpos.y)
                {
                    Game.rooms[leader.room.name].visual.circle(newpos.x, newpos.y,
                    {
                        fill: 'solid',
                        radius: 0.55,
                        stroke: 'blue'
                    });
                }
            }
        }
        leader.room.visual.line(leader.pos,returnPos,
    {color: 'red', lineStyle: 'dashed',width:0.4});
        
        
        
        
        return returnPos;
    },
    moveIntoFormation: function(leaderid, squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            if(mainMemoryObject.SquadMembersCurrent[c] != leaderid)
            {
                all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
        }
        var leader = Game.getObjectById(leaderid);
        var found1 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(leader.pos.x - 1, leader.pos.y, leader.room.name));
        var found2 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(leader.pos.x - 1, leader.pos.y + 1, leader.room.name));
        var found3 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(leader.pos.x, leader.pos.y + 1, leader.room.name));
        for(var c = 0; c < all.length; c++)
        {
            var alreadyInCube = false;
            if(all[c].pos.x == leader.pos.x - 1 && all[c].pos.y == leader.pos.y)
            {
                all[c].say("tl");
                alreadyInCube = true;
            }
            if(all[c].pos.x == leader.pos.x - 1 && all[c].pos.y == leader.pos.y + 1)
            {
                all[c].say("bl");
                alreadyInCube = true;
            }
            if(all[c].pos.x == leader.pos.x && all[c].pos.y == leader.pos.y + 1)
            {
                all[c].say("br");
                alreadyInCube = true;
            }
            if(!alreadyInCube)
            {
                all[c].say("ftr");
                if(found1.length == 0)
                {
                    var targpos = new RoomPosition(leader.pos.x - 1, leader.pos.y, leader.room.name);
                    all[c].moveTo(targpos);
                }
                else if(found2.length == 0)
                {
                    var targpos = new RoomPosition(leader.pos.x - 1, leader.pos.y + 1, leader.room.name);
                    all[c].moveTo(targpos);
                }
                else if(found3.length == 0)
                {
                    var targpos = new RoomPosition(leader.pos.x, leader.pos.y + 1, leader.room.name);
                    all[c].moveTo(targpos);
                }
            }
        }
    },
    checkIfInCube: function(squadID, leaderid)
    {
        var InCube = 0;
        var mainMemoryObject = Memory.squadObject[squadID];
        var leader = Game.getObjectById(leaderid);
        var all = [];
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        for(var c = 0; c < all.length; c++)
        {
            if(all[c].pos.x == leader.pos.x - 1 && all[c].pos.y == leader.pos.y)
            {
                InCube++;
            }
            if(all[c].pos.x == leader.pos.x - 1 && all[c].pos.y == leader.pos.y + 1)
            {
                InCube++;
            }
            if(all[c].pos.x == leader.pos.x && all[c].pos.y == leader.pos.y + 1)
            {
                InCube++;
            }
        }
        if(InCube == 3)
        {
            return true;
        }
        return false;
    },
    decideLeader: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var allSpacesFree = false;
        var all = [];
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        for(var c = 0; c < all.length; c++)
        {
            var squadNearBorder = false;
            if(all[c].pos.x < 2 || all[c].pos.x > 47 || all[c].pos.y < 2 || all[c].pos.y > 47)
            {
                squadNearBorder = true;
            }
            if(!squadNearBorder)
            {
                var foundS = all[c].room.lookForAt(LOOK_STRUCTURES, new RoomPosition(all[c].pos.x - 1, all[c].pos.y, all[c].room.name));
                if(foundS.length == 0)
                {
                    var foundS = all[c].room.lookForAt(LOOK_STRUCTURES, new RoomPosition(all[c].pos.x - 1, all[c].pos.y + 1, all[c].room.name));
                    if(foundS.length == 0)
                    {
                        var foundS = all[c].room.lookForAt(LOOK_STRUCTURES, new RoomPosition(all[c].pos.x, all[c].pos.y + 1, all[c].room.name));
                        if(foundS.length == 0)
                        {
                            allSpacesFree = true;
                            return all[c].id;
                        }
                    }
                }
            }
        }
        return all[0].id; // leader is blocked
    },
    moveAsOne: function(squadID, diretion)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        var fatigueAll = 0;
        for(var c = 0; c < all.length; c++)
        {
            fatigueAll += all[c].fatigue;
        }
        if(fatigueAll == 0)
        {
            for(var c = 0; c < all.length; c++)
            {
                all[c].move(diretion);
            }
        }
    },
    CheckIfLeaderIsDead: function(squadID)
    {
        return false;
    },
    leaderBlocked: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var leader = Game.getObjectById(mainMemoryObject.leader);
        if(leader.pos.x < 2 || leader.pos.x > 47 || leader.pos.y < 2 || leader.pos.y > 47)
        {
            return true;
        }
        else
        {
            var found1 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(leader.pos.x - 1, leader.pos.y, leader.room.name));
            var found2 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(leader.pos.x - 1, leader.pos.y + 1, leader.room.name));
            var found3 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(leader.pos.x, leader.pos.y + 1, leader.room.name));
            if(found1.length == 0 && found2.length == 0 && found3.length == 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    },
    getDirectionToTarget: function(squadID, leaderid, target)
    {
        var leader = Game.getObjectById(leaderid); // pathfinding here
        var path = leader.pos.findPathTo(target);
        // use the target finder for the displaced targets
        let goals = {
            pos: target,
            range: 0
        };
          var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
       
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            // cound how many have rsanged
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        
        
        
        let ret = PathFinder.search(
            leader.pos, target,
            {
                // We need to set the defaults costs higher so that we
                // can set the road cost lower in `roomCallback`
                plainCost: 1,
                swampCost: 5,
                roomCallback: function(roomName)
                {
                    let room = leader.room;
                    // In this example `room` will always exist, but since 
                    // PathFinder supports searches which span multiple rooms 
                    // you should be careful!
                    if(!room) return;
                    let costs = new PathFinder.CostMatrix;
                    var terrain = new Room.Terrain(roomName);
                    for(var xx = 2; xx < 48; xx++)
                    {
                        for(var yy = 2; yy < 48; yy++)
                        {
                            if(terrain.get(xx, yy) == TERRAIN_MASK_SWAMP)
                            {
                                //  Game.rooms[roomName].visual.circle(xx, yy,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 5);
                            }
                            if(terrain.get(xx - 1, yy) == TERRAIN_MASK_SWAMP)
                            {
                                //  Game.rooms[roomName].visual.circle(xx , yy,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 5);
                            }
                            if(terrain.get(xx, yy + 1) == TERRAIN_MASK_SWAMP)
                            {
                                // Game.rooms[roomName].visual.circle(xx, yy ,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 5);
                            }
                            if(terrain.get(xx - 1, yy + 1) == TERRAIN_MASK_SWAMP)
                            {
                                // Game.rooms[roomName].visual.circle(xx, yy ,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 5);
                            }
                        }
                    }
                    for(var xx = 0; xx < 50; xx++)
                    {
                        costs.set(xx, 0, 49);
                        costs.set(0, xx, 49);
                        costs.set(xx, 50, 49);
                        costs.set(50, xx, 49);
                        costs.set(xx, 1, 49);
                        costs.set(1, xx, 49);
                        costs.set(xx, 49, 49);
                        costs.set(49, xx, 49);
                    }
                    room.find(FIND_MY_CREEPS).forEach(function(struct)
                    {
                        var tmp = 0;
                       for(var xx = 0; xx < all.length; xx++)
                       {
                           if(all[xx].pos.x == struct.pos.x&& all[xx].pos.y ==struct.pos.y){
                             tmp=1;  
                           }
                           
                       }
                              if(tmp ==0){
                                  room.visual.circle(struct.pos.x, struct.pos.y,    {fill: 'transparent', radius: 0.08, stroke: 'black'});
                                  costs.set(struct.pos.x , struct.pos.y , 0xff); 
                              }    
                           //     costs.set(struct.pos.x , struct.pos.y , 150);
                          
                        
                    });
                    room.find(FIND_STRUCTURES).forEach(function(struct)
                    {
                        if(struct.structureType !== STRUCTURE_CONTAINER && struct.structureType !== STRUCTURE_ROAD && (struct.structureType !== STRUCTURE_RAMPART || !struct.my))
                        {
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
                    for(var xx = 0; xx < 50; xx++)
                    {
                        for(var yy = 0; yy < 50; yy++)
                        {
                            if(terrain.get(xx, yy) == TERRAIN_MASK_WALL)
                            {
                                //  Game.rooms[roomName].visual.circle(xx, yy,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 0xff);
                            }
                            if(terrain.get(xx - 1, yy) == TERRAIN_MASK_WALL)
                            {
                                //  Game.rooms[roomName].visual.circle(xx , yy,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 0xff);
                            }
                            if(terrain.get(xx, yy + 1) == TERRAIN_MASK_WALL)
                            {
                                // Game.rooms[roomName].visual.circle(xx, yy ,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 0xff);
                            }
                            if(terrain.get(xx - 1, yy + 1) == TERRAIN_MASK_WALL)
                            {
                                // Game.rooms[roomName].visual.circle(xx, yy ,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 0xff);
                            }
                        }
                    }
                    return costs;
                },
            }
        );
        let pos = ret.path[0];
        for(var xx = 0; xx < ret.path.length; xx++)
        {
            Game.rooms[leader.room.name].visual.circle(ret.path[xx].x, ret.path[xx].y,
            {
                fill: 'transparent',
                radius: 0.15,
                stroke: 'red'
            });
        }
        //     creep.move(leader.pos.getDirectionTo(pos));
        return leader.pos.getDirectionTo(pos);
    },
    targetAquisitionPURECOMBAT: function(squadID, leaderid)
    {
        // depending on squad type 
        // deconstruct ----------------- pure structure targeting maybe avoid defencive creeps
        // blinky      ----------------- mainly creep vs creep combat 
        // attack      ----------------- squad hunter and structure 
        var mainMemoryObject = Memory.squadObject[squadID];
        var leader = Game.getObjectById(mainMemoryObject.leader);
        var target = leader.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target != undefined)
        {
            return new RoomPosition(target.pos.x, target.pos.y, target.room.name);
        }
        else
        {
            return 0;
        }
    },
    targetAquisitionRoomAttack: function(squadID, leaderid)
    {
        // depending on squad type 
        // deconstruct ----------------- pure structure targeting maybe avoid defencive creeps
        // blinky      ----------------- mainly creep vs creep combat 
        // attack      ----------------- squad hunter and structure 
        var mainMemoryObject = Memory.squadObject[squadID];
        var leader = Game.getObjectById(mainMemoryObject.leader);
        var target = leader.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
        {
            filter: function(object)
            {
                return (object.structureType != STRUCTURE_KEEPER_LAIR && object.structureType != STRUCTURE_PORTAL && object.structureType != STRUCTURE_POWER_BANK && object.structureType != STRUCTURE_EXTRACTOR);
            }
        });
        if(target != undefined)
        {
            Game.rooms[leader.room.name].visual.circle(target.pos.x, target.pos.y,
            {
                fill: 'blue',
                radius: 0.35,
                stroke: 'blue'
            });
            return new RoomPosition(target.pos.x, target.pos.y, target.room.name);
        }
        else
        {
            return 0;
        }
    },
    loopTasks: function(squadID, tasklist)
    {
        //     console.log(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0]);
        if(tasklist[tasklist.length - 1][0] == "repeat")
        {
            //   creep.say(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0]);
            if(tasklist[tasklist.length - 1][1] + 1 == tasklist.length)
            {
                var tmpstore = tasklist[tasklist.length - 1]
                var back = tasklist.splice(0, 1);
                tasklist[tasklist.length - 1] = back[0];
                tasklist.push(tmpstore);
            }
            else
            {
                tasklist.splice(0, 1);
            }
        }
        else
        {
            tasklist.splice(0, 1);
        }
        Memory.squadObject[squadID].arrayOfSquadGoals = tasklist;
    },
    TaskList: function(squadID)
    {
        //tasks 
        //clear room (kill all hostiles)
        //guard room
        // attack room
        // kill creep(Also used for squads so provide list of targety creeps)
        //arrayOfSquadGoals
        var mainMemoryObject = Memory.squadObject[squadID];
        var tasklist = mainMemoryObject.arrayOfSquadGoals;
        var leaderid = Memory.squadObject[squadID].leader;
        if(tasklist.length != 0 && tasklist[0] != undefined)
        {
            if(tasklist[0][0] == "clearroom")
            {
                if(Memory.squadObject[squadID].leader != undefined)
                {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    if(Memory.squadObject[squadID].leader != undefined)
                    {
                        // deteck hostile creeps and room match 
                        var leader = Game.getObjectById(leaderid);
                        var range = leader.pos.getRangeTo(new RoomPosition(25, 25, tasklist[0][1]));
                        if(range < 23)
                        {
                            var targetTmp = this.targetAquisitionPURECOMBAT(squadID, leaderid);
                            if(targetTmp == 000)
                            {
                                this.loopTasks(squadID, tasklist);
                            }
                            else
                            {
                                return this.getProperPositionForQuadSquad(targetTmp, leader, 3, squadID);
                            }
                        }
                        else
                        {
                            return new RoomPosition(25, 25, tasklist[0][1]);
                        }
                    }
                }
            }
            if(tasklist[0][0] == "movetoRoom" || tasklist[0][0] == "moveToRoom")
            {
                if(Memory.squadObject[squadID].leader != undefined)
                {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    var range = leader.pos.getRangeTo(new RoomPosition(25, 25, tasklist[0][1]));
                    if(range < 23)
                    {
                        this.loopTasks(squadID, tasklist);
                    }
                    else
                    {
                        return new RoomPosition(25, 25, tasklist[0][1]);
                    }
                }
            }
            if(tasklist[0][0] == "guardroom")
            {
                if(Memory.squadObject[squadID].leader != undefined)
                {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    if(Memory.squadObject[squadID].leader != undefined)
                    {
                        // deteck hostile creeps and room match 
                        var leader = Game.getObjectById(leaderid);
                        console.log(tasklist[0][1]);
                        var targRoomPosition = new RoomPosition(25, 25, tasklist[0][1]);
                        var range = leader.pos.getRangeTo(targRoomPosition);
                        if(range < 23)
                        {
                            var targetTmp = this.targetAquisitionPURECOMBAT(squadID, leaderid);
                            if(targetTmp == 0 || targetTmp == null || targetTmp == undefined)
                            {
                                return new RoomPosition(25, 25, tasklist[0][1]); // stay in room and move to mid
                            }
                            else
                            {
                                return this.getProperPositionForQuadSquad(targetTmp, leader, 3, squadID);
                            }
                        }
                        else
                        {
                            return new RoomPosition(25, 25, tasklist[0][1]);
                        }
                    }
                }
            }
            if(tasklist[0][0] == "flagAttack")
            {
                if(Memory.squadObject[squadID].leader != undefined)
                {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    if(leader.room.name == tasklist[0][1])
                    {
                        var flagnametarget = "quad" + squadID;
                        var targetTmp = 0;
                        for(var c = 0; c < 15; c++)
                        {
                            var tmpflaG = flagnametarget + "-" + c;
                            if(Game.flags[tmpflaG] != undefined && targetTmp == 0)
                            {
                                Game.rooms[leader.room.name].visual.circle(Game.flags[tmpflaG].pos.x, Game.flags[tmpflaG].pos.y,
                                {
                                    fill: 'transparent',
                                    radius: 0.55,
                                    stroke: 'blue'
                                });
                                targetTmp = Game.flags[tmpflaG].pos;
                            }
                        }
                        //  var targetTmp = this.targetAquisitionPURECOMBAT(squadID, leaderid);
                        if(targetTmp == 0 || targetTmp == null || targetTmp == undefined)
                        {
                            //   flags are clear general room attack   
                        }
                        else
                        {
                            return this.getProperPositionForQuadSquad(targetTmp, leader, 3, squadID);
                        }
                    }
                    else
                    {
                        return new RoomPosition(25, 25, tasklist[0][1]);
                    }
                }
            }
            if(tasklist[0][0] == "killCreeps")
            {}
            if(tasklist[0][0] == "GeneralAttack")
            {
                if(Memory.squadObject[squadID].leader != undefined)
                {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    if(Memory.squadObject[squadID].leader != undefined)
                    {
                        // deteck hostile creeps and room match 
                        var leader = Game.getObjectById(leaderid);
                        var range = leader.pos.getRangeTo(new RoomPosition(25, 25, tasklist[0][1]));
                        if(range < 25)
                        {
                            var targetTmp = this.targetAquisitionRoomAttack(squadID, leaderid);
                            if(targetTmp == 000)
                            {
                                //     this.loopTasks(squadID, tasklist);
                            }
                            else
                            {
                                return this.getProperPositionForQuadSquad(targetTmp, leader, 3, squadID);
                            }
                        }
                        else
                        {
                            return new RoomPosition(25, 25, tasklist[0][1]);
                        }
                    }
                }
            }
        }
    },
    handleattacks: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        var target;
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            // cound how many have rsanged
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        ////////////////////
        var value = 10000;
        var index = 99;
        for(var c = 0; c < all.length; c++)
        {
            if(all[c].hits < value && all[c].hits != all[c].hitsMax)
            {
                value = all[c].hits;
                index = c;
            }
            creep = all[c];
            var target = all[c].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var targetArr = all[c].room.find(FIND_HOSTILE_CREEPS);
            var targets = all[c].pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            var tempTargs = [];
            
            for(var q = 0; q < targets.length; q++)
            {
                    var tempdftg = targets[q].pos.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: function(object)
                        {
                            return (object.structureType == STRUCTURE_RAMPART);
                        }
                    });
                    if(tempdftg.length==0){
                        tempTargs.push(targets[q]);
                    }
            }
            
            targets=tempTargs;
            
            if(targets.length ==0){
                targets = all[c].pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            }
            
            
            
            var flagsInRange = all[c].pos.findInRange(FIND_FLAGS, 3);
            var targetFromflag = 0;
            var targetsTRUCTURES = all[c].pos.findInRange(FIND_HOSTILE_STRUCTURES, 3,
            {
                filter: function(object)
                {
                    return (object.structureType != STRUCTURE_KEEPER_LAIR && object.structureType != STRUCTURE_PORTAL && object.structureType != STRUCTURE_POWER_BANK);
                }
            });
            if(flagsInRange.length != 0 && 1 == 2)
            {
                for(var q = 0; q < flagsInRange.length; q++)
                {
                    var found = creep.room.lookForAt(LOOK_CREEPS, flagsInRange[q].pos);
                    var found2 = creep.room.lookForAt(LOOK_STRUCTURES, flagsInRange[q].pos);
                    if(found.length != 0)
                    {
                        targetFromflag = found[0];
                    }
                    else if(found2.length != 0)
                    {
                        targetFromflag = found2[0];
                    }
                }
            }
            if(targetFromflag != 0)
            {
                all[c].rangedAttack(targetFromflag);
            }
            else if(targets.length > 0)
            {
                all[c].rangedAttack(targets[0]);
            }
            else if(targetsTRUCTURES.length > 0)
            {
                all[c].rangedAttack(targetsTRUCTURES[0]);
            }
            else
            {
                all[c].rangedMassAttack();
            }
        }
        for(var c = 0; c < all.length; c++)
        {
            if(index != 99)
            {
                all[c].heal(all[index]);
            }
            else
            {
                all[c].heal(all[c]);
            }
        }
    },
    run: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        var target;
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            // cound how many have rsanged
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        if(Memory.squadObject[squadID].leader == undefined)
        {
            Memory.squadObject[squadID].leader = this.decideLeader(squadID);
        }
        var leader = Game.getObjectById(Memory.squadObject[squadID].leader);
        if(leader == null)
        {
            Memory.squadObject[squadID].leader = this.decideLeader(squadID);
        }
        if(leader != null && leader != undefined && leader)
        {
            /////////////////////////////////////////////////      
            //                   decide targets 
            target = this.TaskList(squadID);
            Memory.squadObject[squadID].target = target;
            ////////////////////////////////////////////////////        
            // border edge
            var squadNearBorder = false;
            for(var c = 0; c < all.length; c++)
            {
                if(all[c].pos.x < 2 || all[c].pos.x > 47 || all[c].pos.y < 2 || all[c].pos.y > 47)
                {
                    squadNearBorder = true;
                }
            }
            if(leader.pos.x < 2 || leader.pos.x > 47 || leader.pos.y < 2 || leader.pos.y > 47)
            {
                Memory.squadObject[squadID].squadCrossingBorder = true;
            }
            else
            {
                Memory.squadObject[squadID].squadCrossingBorder = false;
            }
            var leaderRoom = leader.room.name;
            Memory.squadObject[squadID].squadInSameRoom = true;
            for(var c = 0; c < all.length; c++)
            {
                if(all[c].room.name != leaderRoom)
                {
                    Memory.squadObject[squadID].squadInSameRoom = false;
                }
            }
            /////////////major break fixer//////////
            for(var c = 0; c < all.length; c++)
            {
                var range = leader.pos.getRangeTo(all[c]);
                if(range > 5 && Memory.squadObject[squadID].squadCrossingBorder != true)
                {
                    all[c].say("severe break");
                    all[c].moveTo(leader,
                    {
                        ignoreCreeps: true
                    });
                }
            }
            ///////////////////////
            // decicde if quad is vital
            var QuadVital = true;
            var targs = leader.room.find(FIND_HOSTILE_CREEPS);
            var targsclose = leader.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var rangeToClosestCreep = leader.pos.getRangeTo(targsclose);
            var homeroomFlag = Game.flags[leader.room.name];
            if(homeroomFlag != undefined && leader.pos.getRangeTo(homeroomFlag) < 10 && targs.length < 1)
            {
                QuadVital = false;
            }
            //////////////
            //   vistials
            // console.log("target quad", JSON.stringify(target));
            //   Game.rooms[target.roomName].visual.circle(target.x ,target.y,    {fill: 'red', radius: 0.55, stroke: 'red'});
            ///////////////////////
            // move 
            //  leader.say(this.checkIfInCube(squadID, Memory.squadObject[squadID].leader));
            var SquadIsInFormation = this.checkIfInCube(squadID, Memory.squadObject[squadID].leader);
            if(QuadVital == false && !SquadIsInFormation && target != undefined)
            {
                leader.say("move");
                // todo check average distance and iff its too high then all move towards the leader
                for(var c = 0; c < all.length; c++)
                {
                    all[c].moveTo(leader,
                    {
                        ignoreCreeps: true
                    });
                }
                leader.say("moveTo(target)");
                leader.moveTo(target);
            }
            else if(QuadVital && this.leaderBlocked(squadID) == false && !SquadIsInFormation && squadNearBorder == false && Memory.squadObject[squadID].squadCrossingBorder == false && Game.time % 17 != 0) // creeps not in cube
            {
                leader.say("moveIntoFormation");
                if(Memory.squadObject[squadID].leader != undefined)
                {
                    this.moveIntoFormation(Memory.squadObject[squadID].leader, squadID);
                }
            }
            else if(SquadIsInFormation || (!SquadIsInFormation && squadNearBorder == true && Game.time % 5 == 0))
            {
                if(target != undefined)
                {
                    leader.say("moveAsOne");
                    var Direction = this.getDirectionToTarget(squadID, Memory.squadObject[squadID].leader, target);
                    this.moveAsOne(squadID, Direction);
                }
            }
            else
            {
                if(target != undefined)
                {
                    leader.say("fixme");
                    for(var c = 0; c < all.length; c++)
                    {
                        all[c].moveTo(target,
                        {
                            ignoreCreeps: true
                        });
                    }
                }
            }
        }
        /////////////////////////////////////////////////////
        //                  deal damage / heal
        /////////////////////////////////////////
        this.handleattacks(squadID);
        /////
    }
}
module.exports = quadsquad;