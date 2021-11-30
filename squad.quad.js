var quadsquad = {

    gradePositoion: function(posision, squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var posx = posision.x;
        var posy = posision.y;
        var posroom = posision.roomName;

        var squadType = Memory.squadObject[squadID].squadSubType;

        var leader = Game.getObjectById(Memory.squadObject[squadID].leader);

        // todo do not do this step for attack quads
        var positionBeingchecked = new RoomPosition(posision.x, posision.y, posroom);
        var enemiesInRangeOfTarget1 = positionBeingchecked.findInRange(FIND_HOSTILE_CREEPS, 1); // filter for combat 
         

        var positionBeingchecked = new RoomPosition(posision.x - 1, posision.y, posroom);
        var enemiesInRangeOfTarget2 = positionBeingchecked.findInRange(FIND_HOSTILE_CREEPS, 1); // filter for combat 
        
        var positionBeingchecked = new RoomPosition(posision.x- 1, posision.y + 1, posroom);
        var enemiesInRangeOfTarget3 = positionBeingchecked.findInRange(FIND_HOSTILE_CREEPS, 1); // filter for combat 
        

        var positionBeingchecked = new RoomPosition(posision.x, posision.y + 1, posroom);
        var enemiesInRangeOfTarget4 = positionBeingchecked.findInRange(FIND_HOSTILE_CREEPS, 1); // filter for combat 
        

        if (enemiesInRangeOfTarget1.length != 0 || enemiesInRangeOfTarget2.length != 0 || enemiesInRangeOfTarget3.length != 0 || enemiesInRangeOfTarget4.length != 0 )
        {
            return false;
        }
 
        
        
        
        
        
        

        return true;
    },

    initPosition: function(posision, squadID, rank, costs)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var posx = posision.x;
        var posy = posision.y;
        var posroom = posision.roomName;
        var leader = Game.getObjectById(Memory.squadObject[squadID].leader);
        var returnValue = {
            booll: true,
            posit: {
                targetx:posx,
                targety:posy
            },
            rank: rank,
            cost: costs
        }

        //check costs are fine 

        if (costs > 15)
        {
            returnValue.booll = false;
        }

        // check there is a valid path 

        var path = leader.room.findPath(leader.pos, posision);

        if (path && path.length != 0 && path[path.length - 1] != null && path[path.length - 1].x == posision.x && path[path.length - 1].y == posision.y)
        { // valid path

        }
        else
        {
            returnValue.booll = false;
        }

        return returnValue;
    },

    getProperPositionForQuadSquad: function(posision, creep, squadID)
    {
                Game.rooms[posision.roomName].visual.circle(posision,
                {
                    fill: 'solid',
                    radius: 0.19,
                    stroke: 'white'
                });
        var mainMemoryObject = Memory.squadObject[squadID];
        var posx = posision.x;
        var posy = posision.y;
        var posroom = posision.roomName;
        if (Memory.squadObject[squadID].currentPositionsobj == undefined)
        {
            Memory.squadObject[squadID].currentPositionsobj = {
                targetx: posx,
                targety: posy,
                candidates: []
            };
        }
        var squadType = Memory.squadObject[squadID].squadType;
        var leader = Game.getObjectById(Memory.squadObject[squadID].leader);
        if (leader.pos.x < 2 || leader.pos.x > 47 || leader.pos.y < 2 || leader.pos.y > 47)
        {
            return new RoomPosition(25, 25, leader.room.name);
        }

        var posArrayCQB = [
            [-1, 0],
            [-1, -1],
            [0, -2],
            [1, -2],
            [0, 1],
            [1, 1],
            [2, 0],
            [2, -1]
        ];

        var posArrayRanged = [
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
            [2, 2],
            [3, -3]
        ];
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // if squad is damaged check for position far way

        if (Memory.squadObject[squadID].currentPositionsobj.targetx == posision.x && Memory.squadObject[squadID].currentPositionsobj.targety == posision.y && Memory.squadObject[squadID].currentPositionsobj.candidates.length != 0 )
        {
    
            var enemiesInRangeOfTarget2 = leader.pos.findInRange(FIND_HOSTILE_CREEPS, 3); // filter for combat 

            if (enemiesInRangeOfTarget2.length != 0 )
            {
                for (var c = 0; c < Memory.squadObject[squadID].currentPositionsobj.candidates.length; c++)
                {
                    var posxx = Memory.squadObject[squadID].currentPositionsobj.candidates[c].posit.targetx;
                    var posyy = Memory.squadObject[squadID].currentPositionsobj.candidates[c].posit.targety;

                    var checkpos = new RoomPosition(posxx, posyy, leader.room.name);

                    Memory.squadObject[squadID].currentPositionsobj.candidates[c].booll = this.gradePositoion(checkpos, squadID) // change to a position in room 

                }
            }
        }
        else
        {
            if (Memory.squadObject[squadID].costsroom == posroom)
            {

                Memory.squadObject[squadID].currentPositionsobj.targetx = posision.x;
                Memory.squadObject[squadID].currentPositionsobj.targety = posision.y;
                Memory.squadObject[squadID].currentPositionsobj.candidates = [];

                var costs = PathFinder.CostMatrix.deserialize(Memory.squadObject[squadID].costscurr);
                ////////////// close range 

                for (var c = 0; c < posArrayCQB.length; c++)
                {
                    var positionBeingchecked = new RoomPosition(posx + posArrayCQB[c][0], posy + posArrayCQB[c][1], posroom)
                    Memory.squadObject[squadID].currentPositionsobj.candidates.push(this.initPosition(positionBeingchecked, squadID, 1, costs.get(posx + posArrayCQB[c][0], posy + posArrayCQB[c][1])));
                }

                ////////////// longerRange 

                for (var c = 0; c < posArrayRanged.length; c++)
                {
                    var positionBeingchecked = new RoomPosition(posx + posArrayRanged[c][0], posy + posArrayRanged[c][1], posroom)
                    Memory.squadObject[squadID].currentPositionsobj.candidates.push(this.initPosition(positionBeingchecked, squadID, 2, costs.get(posx + posArrayRanged[c][0], posy + posArrayRanged[c][1])));
                }

            }
            else
            {
                Memory.squadObject[squadID].quadVitalBool = true; // force quad
                // get the costs for the room witha  move to center order 
                return new RoomPosition(25, 25, posroom);
            }

        }

        // loop thoiguh candidates find the one with a true booll and a low rank

        var cuurentRank = 444;
        var currentPosition = leader.pos;
        for (var c = 0; c < Memory.squadObject[squadID].currentPositionsobj.candidates.length; c++)
        {

            if (Memory.squadObject[squadID].currentPositionsobj.candidates[c].booll == true   && Memory.squadObject[squadID].currentPositionsobj.candidates[c].cost < 10)
            {



 


                var posxx = Memory.squadObject[squadID].currentPositionsobj.candidates[c].posit.targetx;
                var posyy = Memory.squadObject[squadID].currentPositionsobj.candidates[c].posit.targety;
                Game.rooms[leader.room.name].visual.circle(new RoomPosition(posxx, posyy, leader.room.name),
                {
                    fill: 'solid',
                    radius: 0.15,
                    stroke: 'blue'
                });
                if (cuurentRank > Memory.squadObject[squadID].currentPositionsobj.candidates[c].rank)
                {
                    cuurentRank = Memory.squadObject[squadID].currentPositionsobj.candidates[c].rank;
                    currentPosition = new RoomPosition(posxx, posyy, leader.room.name);
                }

            }
            else  
            {

                var posxx = Memory.squadObject[squadID].currentPositionsobj.candidates[c].posit.targetx;
                var posyy = Memory.squadObject[squadID].currentPositionsobj.candidates[c].posit.targety;
                Game.rooms[leader.room.name].visual.circle(new RoomPosition(posxx, posyy, leader.room.name),
                {
                    fill: 'solid',
                    radius: 0.15,
                    stroke: 'red'
                });

            }

        }

        Game.rooms[leader.room.name].visual.circle(currentPosition,
        {
            fill: 'solid',
            radius: 0.25,
            stroke: 'green'
        });

        return currentPosition;
    },

    moveIntoFormation: function(leaderid, squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            if (mainMemoryObject.SquadMembersCurrent[c] != leaderid)
            {
                all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
        }
        var leader = Game.getObjectById(leaderid);
        var found1 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(leader.pos.x - 1, leader.pos.y, leader.room.name));
        var found2 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(leader.pos.x - 1, leader.pos.y + 1, leader.room.name));
        var found3 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(leader.pos.x, leader.pos.y + 1, leader.room.name));
        for (var c = 0; c < all.length; c++)
        {
            var alreadyInCube = false;
            if (all[c].pos.x == leader.pos.x - 1 && all[c].pos.y == leader.pos.y)
            {
                all[c].say("tl");
                alreadyInCube = true;
            }
            if (all[c].pos.x == leader.pos.x - 1 && all[c].pos.y == leader.pos.y + 1)
            {
                all[c].say("bl");
                alreadyInCube = true;
            }
            if (all[c].pos.x == leader.pos.x && all[c].pos.y == leader.pos.y + 1)
            {
                all[c].say("br");
                alreadyInCube = true;
            }
            if (!alreadyInCube)
            {
                all[c].say("ftr");
                if (found1.length == 0)
                {
                    var targpos = new RoomPosition(leader.pos.x - 1, leader.pos.y, leader.room.name);
                    all[c].moveTo(targpos);
                }
                else if (found2.length == 0)
                {
                    var targpos = new RoomPosition(leader.pos.x - 1, leader.pos.y + 1, leader.room.name);
                    all[c].moveTo(targpos);
                }
                else if (found3.length == 0)
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
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        for (var c = 0; c < all.length; c++)
        {
            if (all[c].pos.x == leader.pos.x - 1 && all[c].pos.y == leader.pos.y)
            {
                InCube++;
            }
            if (all[c].pos.x == leader.pos.x - 1 && all[c].pos.y == leader.pos.y + 1)
            {
                InCube++;
            }
            if (all[c].pos.x == leader.pos.x && all[c].pos.y == leader.pos.y + 1)
            {
                InCube++;
            }
        }
        if (InCube == 3)
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
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        var terrain = new Room.Terrain(all[0].room.name);
        for (var c = 0; c < all.length; c++)
        {
            var squadNearBorder = false;
            if (all[c].pos.x < 2 || all[c].pos.x > 47 || all[c].pos.y < 2 || all[c].pos.y > 47)
            {
                squadNearBorder = true;
            }
            var leader = all[c]
            if (!squadNearBorder)
            {
                var foundS = all[c].room.lookForAt(LOOK_STRUCTURES, new RoomPosition(all[c].pos.x - 1, all[c].pos.y, all[c].room.name));

                if (foundS.length == 0 && terrain.get(leader.pos.x - 1, leader.pos.y) != TERRAIN_MASK_WALL)
                {
                    var foundS = all[c].room.lookForAt(LOOK_STRUCTURES, new RoomPosition(all[c].pos.x - 1, all[c].pos.y + 1, all[c].room.name));

                    if (foundS.length == 0 && terrain.get(leader.pos.x - 1, leader.pos.y + 1) != TERRAIN_MASK_WALL)
                    {
                        var foundS = all[c].room.lookForAt(LOOK_STRUCTURES, new RoomPosition(all[c].pos.x, all[c].pos.y + 1, all[c].room.name));

                        if (foundS.length == 0 && terrain.get(leader.pos.x, leader.pos.y + 1) != TERRAIN_MASK_WALL)
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
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        var fatigueAll = 0;
        for (var c = 0; c < all.length; c++)
        {
            fatigueAll += all[c].fatigue;
        }
        if (fatigueAll == 0)
        {
            for (var c = 0; c < all.length; c++)
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

        if (leader == undefined)
        {
            Memory.squadObject[squadID].leader = this.decideLeader(squadID);
        }

        if (leader.pos.x < 2 || leader.pos.x > 47 || leader.pos.y < 2 || leader.pos.y > 47)
        {
            return true;
        }
        else
        {

            var found1 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(leader.pos.x - 1, leader.pos.y, leader.room.name));
            var found2 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(leader.pos.x - 1, leader.pos.y + 1, leader.room.name));
            var found3 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(leader.pos.x, leader.pos.y + 1, leader.room.name));
            if (found1.length == 0 && found2.length == 0 && found3.length == 0)
            {

                return false;
            }
            else
            {

                return true;
            }
        }
    },

    leaderBlocked2: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var leader = Game.getObjectById(mainMemoryObject.leader);
        // leader.say("check");
        if (leader.pos.x < 2 || leader.pos.x > 47 || leader.pos.y < 2 || leader.pos.y > 47)
        {
            return true;
        }
        else
        {

            var terrain = new Room.Terrain(leader.room.name);
            if (terrain.get(leader.pos.x - 1, leader.pos.y) == TERRAIN_MASK_WALL) // costs avoid 
            {
                //    leader.say("blocked");
                return true;
            }
            if (terrain.get(leader.pos.x - 1, leader.pos.y + 1) == TERRAIN_MASK_WALL) // costs avoid 
            {
                //   leader.say("blocked");
                return true;
            }
            if (terrain.get(leader.pos.x, leader.pos.y + 1) == TERRAIN_MASK_WALL) // costs avoid 
            {
                //    leader.say("blocked");
                return true;
            }

            var found1 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(leader.pos.x - 1, leader.pos.y, leader.room.name));
            var found2 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(leader.pos.x - 1, leader.pos.y + 1, leader.room.name));
            var found3 = leader.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(leader.pos.x, leader.pos.y + 1, leader.room.name));
            if (found1.length == 0 && found2.length == 0 && found3.length == 0)
            {
                //     leader.say("clear");
                return false;
            }
            else
            {
                //     leader.say("blocked");
                return true;
            }
        }
    },

    getDirectionToTarget: function(squadID, leaderid, target)
    {

        if (Memory.squadObject[squadID].costsroom == undefined)
        {
            Memory.squadObject[squadID].costsroom = ""
        }

        var leader = Game.getObjectById(leaderid); // pathfinding here
        var path = leader.pos.findPathTo(target);
        // use the target finder for the displaced targets
        let goals = {
            pos: target,
            range: 0
        };
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
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
                    if (!room) return;
                    let costs = new PathFinder.CostMatrix;
                    var terrain = new Room.Terrain(roomName);
                    // set costs 
                    if (Memory.squadObject[squadID].costscurr == undefined || Memory.squadObject[squadID].costsroom != room.name)
                    {

                        for (var xx = 2; xx < 48; xx++)
                        {
                            for (var yy = 2; yy < 48; yy++)
                            {
                                if (terrain.get(xx, yy) == TERRAIN_MASK_SWAMP)
                                {
                                    //  Game.rooms[roomName].visual.circle(xx, yy,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                    costs.set(xx, yy, 5);
                                }
                                if (terrain.get(xx - 1, yy) == TERRAIN_MASK_SWAMP)
                                {
                                    //  Game.rooms[roomName].visual.circle(xx , yy,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                    costs.set(xx, yy, 5);
                                }
                                if (terrain.get(xx, yy + 1) == TERRAIN_MASK_SWAMP)
                                {
                                    // Game.rooms[roomName].visual.circle(xx, yy ,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                    costs.set(xx, yy, 5);
                                }
                                if (terrain.get(xx - 1, yy + 1) == TERRAIN_MASK_SWAMP)
                                {
                                    // Game.rooms[roomName].visual.circle(xx, yy ,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                    costs.set(xx, yy, 5);
                                }
                            }
                        }
                        for (var xx = 0; xx < 50; xx++)
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

                        room.find(FIND_STRUCTURES).forEach(function(struct)
                        {
                            if (struct.structureType !== STRUCTURE_CONTAINER && struct.structureType !== STRUCTURE_ROAD && (struct.structureType !== STRUCTURE_RAMPART || !struct.my))
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
                        for (var xx = 0; xx < 50; xx++)
                        {
                            for (var yy = 0; yy < 50; yy++)
                            {
                                if (terrain.get(xx, yy) == TERRAIN_MASK_WALL)
                                {
                                    //  Game.rooms[roomName].visual.circle(xx, yy,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                    costs.set(xx, yy, 0xff);
                                }
                                if (terrain.get(xx - 1, yy) == TERRAIN_MASK_WALL)
                                {
                                    //  Game.rooms[roomName].visual.circle(xx , yy,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                    costs.set(xx, yy, 0xff);
                                }
                                if (terrain.get(xx, yy + 1) == TERRAIN_MASK_WALL)
                                {
                                    // Game.rooms[roomName].visual.circle(xx, yy ,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                    costs.set(xx, yy, 0xff);
                                }
                                if (terrain.get(xx - 1, yy + 1) == TERRAIN_MASK_WALL)
                                {
                                    // Game.rooms[roomName].visual.circle(xx, yy ,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                    costs.set(xx, yy, 0xff);
                                }
                            }
                        }

                        Memory.squadObject[squadID].costscurr = costs.serialize();
                        Memory.squadObject[squadID].costsroom = room.name;

                    }
                    else
                    {
                        costs = PathFinder.CostMatrix.deserialize(Memory.squadObject[squadID].costscurr)
                    }

                    // variable 
                    room.find(FIND_MY_CREEPS).forEach(function(struct)
                    {
                        var tmp = 0;
                        for (var xx = 0; xx < all.length; xx++)
                        {
                            if (all[xx].pos.x == struct.pos.x && all[xx].pos.y == struct.pos.y)
                            {
                                tmp = 1;
                            }
                        }
                        if (tmp == 0)
                        {
                            room.visual.circle(struct.pos.x, struct.pos.y,
                            {
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
                    room.find(FIND_MY_POWER_CREEPS).forEach(function(struct)
                    {
                        room.visual.circle(struct.pos.x, struct.pos.y,
                        {
                            fill: 'transparent',
                            radius: 0.08,
                            stroke: 'black'
                        });
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                        costs.set(struct.pos.x + 1, struct.pos.y, 0xff);
                        costs.set(struct.pos.x + 1, struct.pos.y - 1, 0xff);
                        costs.set(struct.pos.x, struct.pos.y - 1, 0xff);
                    });
                    return costs;
                },
            }
        );
        var pos = ret.path[0];
        if (ret.path.length == 0)
        {
            var path = leader.pos.findPathTo(target);
            var pos = path[0];
        }
        else
        {
            var pos = ret.path[0];
        }
        for (var xx = 0; xx < ret.path.length; xx++)
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

    linemoveDirection: function(squadID, leaderid, target)
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
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
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
                maxRooms: 1,
                roomCallback: function(roomName)
                {
                    let room = leader.room;
                    // In this example `room` will always exist, but since 
                    // PathFinder supports searches which span multiple rooms 
                    // you should be careful!
                    if (!room) return;
                    let costs = new PathFinder.CostMatrix;
                    var terrain = new Room.Terrain(roomName);
                    for (var xx = 2; xx < 48; xx++)
                    {
                        for (var yy = 2; yy < 48; yy++)
                        {
                            if (terrain.get(xx, yy) == TERRAIN_MASK_SWAMP)
                            {
                                costs.set(xx, yy, 5);
                            }
                        }
                    }

                    for (var xx = 0; xx < 49; xx++)
                    {
                        costs.set(xx, 0, 52);
                        costs.set(0, xx, 52);
                        costs.set(xx, 49, 52);
                        costs.set(49, xx, 52);

                    }

                    costs.set(target.x, target.y, 0);
                    room.find(FIND_MY_CREEPS).forEach(function(struct)
                    {
                        var tmp = 0;
                        for (var xx = 0; xx < all.length; xx++)
                        {
                            if (all[xx].pos.x == struct.pos.x && all[xx].pos.y == struct.pos.y)
                            {
                                tmp = 1;
                            }
                        }
                        if (tmp == 0)
                        {
                            room.visual.circle(struct.pos.x, struct.pos.y,
                            {
                                fill: 'transparent',
                                radius: 0.08,
                                stroke: 'black'
                            });
                            costs.set(struct.pos.x, struct.pos.y, 80);
                            costs.set(struct.pos.x + 1, struct.pos.y, 80);
                            costs.set(struct.pos.x + 1, struct.pos.y - 1, 80);
                            costs.set(struct.pos.x, struct.pos.y - 1, 80);
                        }
                    });

                    room.find(FIND_MY_POWER_CREEPS).forEach(function(struct)
                    {
                        room.visual.circle(struct.pos.x, struct.pos.y,
                        {
                            fill: 'transparent',
                            radius: 0.08,
                            stroke: 'black'
                        });
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                        costs.set(struct.pos.x + 1, struct.pos.y, 0xff);
                        costs.set(struct.pos.x + 1, struct.pos.y - 1, 0xff);
                        costs.set(struct.pos.x, struct.pos.y - 1, 0xff);
                    });

                    room.find(FIND_STRUCTURES).forEach(function(struct)
                    {
                        if (struct.structureType !== STRUCTURE_CONTAINER && struct.structureType !== STRUCTURE_ROAD && (struct.structureType !== STRUCTURE_RAMPART || !struct.my))
                        {
                            costs.set(struct.pos.x, struct.pos.y, 0xff);

                            //    costs.set(struct.pos.x, struct.pos.y - 1, 20);

                            //     costs.set(struct.pos.x + 1, struct.pos.y - 1, 20);

                            //    costs.set(struct.pos.x + 1, struct.pos.y, 20);
                        }
                    });

                    for (var xx = 0; xx < 50; xx++)
                    {
                        for (var yy = 0; yy < 50; yy++)
                        {
                            if (terrain.get(xx, yy) == TERRAIN_MASK_WALL)
                            {
                                //  Game.rooms[20].visual.circle(xx, yy,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 0xff);
                            }
                            if (terrain.get(xx - 1, yy) == TERRAIN_MASK_WALL)
                            {
                                //  Game.rooms[roomName].visual.circle(xx , yy,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 200);
                            }
                            if (terrain.get(xx, yy + 1) == TERRAIN_MASK_WALL)
                            {
                                // Game.rooms[roomName].visual.circle(xx, yy ,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 200);
                            }
                            if (terrain.get(xx - 1, yy + 1) == TERRAIN_MASK_WALL)
                            {
                                // Game.rooms[roomName].visual.circle(xx, yy ,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 200);
                            }
                        }
                    }

                    return costs;
                },
            }
        );
        var pos = ret.path[0];
        if (ret.path.length == 0)
        {
            var path = leader.pos.findPathTo(target);
            var pos = path[0];
        }
        else
        {
            var pos = ret.path[0];
        }
        for (var xx = 0; xx < ret.path.length; xx++)
        {
            Game.rooms[leader.room.name].visual.circle(ret.path[xx].x, ret.path[xx].y,
            {
                fill: 'transparent',
                radius: 0.15,
                stroke: 'red'
            });
        }

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
        if (target != undefined)
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

        var target2 = leader.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES,
        {
            filter: function(object)
            {
                return (object.structureType != STRUCTURE_KEEPER_LAIR && object.structureType != STRUCTURE_PORTAL && object.structureType != STRUCTURE_POWER_BANK && object.structureType != STRUCTURE_EXTRACTOR && object.structureType != STRUCTURE_RAMPART && object.structureType != STRUCTURE_WALL);
            }
        });

        if (target2 != undefined)
        {

            Game.rooms[leader.room.name].visual.circle(target2.pos.x, target2.pos.y,
            {
                fill: 'green',
                radius: 0.35,
                stroke: 'green'
            });
            return new RoomPosition(target2.pos.x, target2.pos.y, target2.room.name);

        }
        else if (target != undefined)
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
        if (tasklist[tasklist.length - 1][0] == "repeat")
        {
            //   creep.say(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0]);
            if (tasklist[tasklist.length - 1][1] + 1 == tasklist.length)
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
        if (tasklist.length != 0 && tasklist[0] != undefined)
        {
            if (tasklist[0][0] == "clearroom")
            {
                if (Memory.squadObject[squadID].leader != undefined)
                {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    if (Memory.squadObject[squadID].leader != undefined)
                    {
                        // deteck hostile creeps and room match 
                        var leader = Game.getObjectById(leaderid);
                        var range = leader.pos.getRangeTo(new RoomPosition(25, 25, tasklist[0][1]));
                        if (range < 23)
                        {
                            var targetTmp = this.targetAquisitionPURECOMBAT(squadID, leaderid);
                            if (targetTmp == 000)
                            {
                                this.loopTasks(squadID, tasklist);
                            }
                            else
                            {
                                return this.getProperPositionForQuadSquad(targetTmp, leader, squadID);
                            }
                        }
                        else
                        {

                            return new RoomPosition(25, 25, tasklist[0][1]);
                        }
                    }
                }
            }

            if (tasklist[0][0] == "test1")
            {

                Memory.squadObject[squadID].quadVitalBool = true;
                return this.getProperPositionForQuadSquad(Game.flags["Flag2"].pos, leader, squadID);

            }
             if (tasklist[0][0] == "test2")
            {

                Memory.squadObject[squadID].quadVitalBool = true;
                return this.getProperPositionForQuadSquad(Game.flags["Flag6"].pos, leader, squadID);

            }
            if (tasklist[0][0] == "joinAttack")
            {

                var leader = Game.getObjectById(leaderid);

                //  finalPath.push("joinAttack",attackID,ListOfsquads[i][0]);
                /*
                       Memory.attackManager[attackID].vectors[i].
                       
                        Memory.attackManager[attackID]
                          var vec = {
                           currentlyAssignedSquad: "",
                           targets: vectorTargets,
                           ticksWhereSquadIsCloseToRamparts: 0,
                           desiredSquad:"blinky",
                           squadTravelTime:0
                       };
                       */
                var arrtemp = Memory.attackManager[tasklist[0][1]].vectors[tasklist[0][2]].targets;
            //    console.log(JSON.stringify(arrtemp));
                var foundtarg = false; 
                for(var xx = 0; xx < arrtemp.length; xx++)
                {
                    var containers = new RoomPosition(arrtemp[xx][0], arrtemp[xx][1],leader.room.name ).findInRange(FIND_STRUCTURES,0,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType != STRUCTURE_CONTAINER && structure.structureType != STRUCTURE_ROAD )  ;
                        }
                    });
                if(containers.length != 0 )
                {
                   arrtemp =  Memory.attackManager[tasklist[0][1]].vectors[tasklist[0][2]].targets[xx];
                   foundtarg=true;
                }
        
                }
                
                
                if(!foundtarg)
                {
                    // change to the general attack
                }
                
                
                
                
                var targetpos = new RoomPosition(arrtemp[0], arrtemp[1], tasklist[0][1]);

                var a = Memory.attackManager[tasklist[0][1]].vectors[tasklist[0][2]].currentlyAssignedSquad;

                if (a == "" || a == "transit")
                {
                    Memory.attackManager[tasklist[0][1]].vectors[tasklist[0][2]].currentlyAssignedSquad = squadID;
                }

                if (Memory.attackManager[tasklist[0][1]].vectors[tasklist[0][2]].squadTravelTime == 0)
                {
                    Memory.attackManager[tasklist[0][1]].vectors[tasklist[0][2]].squadTravelTime = 1350 - leader.ticksToLive;
                }
                return this.getProperPositionForQuadSquad(targetpos, leader, squadID);

            }

            if (tasklist[0][0] == "movetoRoom" || tasklist[0][0] == "moveToRoom" || tasklist[0][0] == "forcemoveToRoom")
            {
                var leader = Game.getObjectById(leaderid);

                if (leader.room.name == tasklist[0][1])
                {
                    leader.say("loop");
                    this.loopTasks(squadID, tasklist);
                    leader.moveTo(new RoomPosition(25, 25, leader.room.name));

                }

                var roomExits = Game.map.describeExits(leader.room.name);
                var roomnames = Object.values(roomExits);
                var roomkeys = Object.keys(roomExits);
                var exitNumber;
                for (var i = 0; i < roomnames.length; i++)
                {
                    if (roomnames[i] == tasklist[0][1])
                    {
                        exitNumber = roomkeys[i];
                    }
                }

                if (exitNumber != undefined)
                {
                    leader.say("suc move");
                    var exitDir = Game.map.findExit(leader.room, tasklist[0][1]);
                    var exit = leader.pos.findClosestByRange(exitDir);
                    leader.say(exit.x + "-" + exit.y);
                    if (exit)
                    {

                        new RoomVisual(leader.room).line(leader.pos, exit,
                        {
                            color: '#ffffff',
                            lineStyle: 'solid'
                        });
                        Game.map.visual.line(leader.pos, exit,
                        {
                            color: '#ffffff',
                            lineStyle: 'dashed'
                        });

                        return new RoomPosition(exit.x, exit.y, tasklist[0][1]);
                    }
                }

                if (exitNumber == undefined && tasklist[0].length != 0 && tasklist[0][1] != undefined)
                {
                    // deteck hostile creeps and room match 

                    leader.say("fail move");
                    // return new RoomPosition(25, 25, leader);

                }

            }

            if (tasklist[0][0] == "guardroom")
            {
                if (Memory.squadObject[squadID].leader != undefined)
                {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    if (Memory.squadObject[squadID].leader != undefined)
                    {
                        // deteck hostile creeps and room match 
                        var leader = Game.getObjectById(leaderid);
                        var targRoomPosition = new RoomPosition(25, 25, tasklist[0][1]);
                        var range = leader.pos.getRangeTo(targRoomPosition);
                        if (range < 23)
                        {
                            var targetTmp = this.targetAquisitionPURECOMBAT(squadID, leaderid);
                            if (targetTmp == 0 || targetTmp == null || targetTmp == undefined)
                            {
                                return new RoomPosition(25, 25, tasklist[0][1]); // stay in room and move to mid
                            }
                            else
                            {
                                return this.getProperPositionForQuadSquad(targetTmp, leader, squadID);
                            }
                        }
                        else
                        {
                            return new RoomPosition(25, 25, tasklist[0][1]);
                        }
                    }
                }
            }
            if (tasklist[0][0] == "flagAttack")
            {
                if (Memory.squadObject[squadID].leader != undefined)
                {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    if (leader.room.name == tasklist[0][1])
                    {

                        var targetTmp = 0;
                        var flagsinrange = leader.pos.findClosestByPath(FIND_FLAGS);

                        if (flagsinrange != undefined && targetTmp == 0)
                        {
                            Game.rooms[leader.room.name].visual.circle(flagsinrange.pos.x, flagsinrange.pos.y,
                            {
                                fill: 'transparent',
                                radius: 0.55,
                                stroke: 'blue'
                            });

                            if (flagsinrange != undefined)
                            {

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
                        if (targetTmp == 0 || targetTmp == null || targetTmp == undefined)
                        {
                            //   flags are clear general room attack   
                        }
                        else
                        {
                            return this.getProperPositionForQuadSquad(targetTmp, leader, squadID);
                        }
                    }
                    else
                    {
                        return new RoomPosition(25, 25, tasklist[0][1]);
                    }
                }
            }
            if (tasklist[0][0] == "killCreeps")
            {}
            if (tasklist[0][0] == "HoldAttack") // tot reset hold flag // 
            {
                if (leaderid != undefined)
                {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    if (leader != undefined)
                    {
                        // deteck hostile creeps and room match 
                        var leader = Game.getObjectById(leaderid);
                        var range = leader.pos.getRangeTo(new RoomPosition(25, 25, tasklist[0][1]));
                        if (range < 23)
                        {
                            var gameflags = leader.room.find(FIND_FLAGS);
                            if (gameflags.length != 0)
                            {
                                for (var c = 0; c < gameflags.length; c++)
                                {
                                    if (gameflags[c].name.substring(0, 8) == "QuadHold")
                                    {
                                        var flagtemp = gameflags[c];
                                        return new RoomPosition(flagtemp.pos.x, flagtemp.pos.y, flagtemp.pos.roomName)
                                    }
                                }
                            }
                        }
                        else
                        {
                            return new RoomPosition(25, 25, tasklist[0][1]);
                        }
                    }
                }
            }
            if (tasklist[0][0] == "GeneralAttack" || tasklist[0][0] == "generalAttack")
            {
                if (Memory.squadObject[squadID].leader != undefined)
                {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    if (Memory.squadObject[squadID].leader != undefined)
                    {
                        // deteck hostile creeps and room match 
                        var leader = Game.getObjectById(leaderid);
                        var range = leader.pos.getRangeTo(new RoomPosition(25, 25, tasklist[0][1]));
                        if (range < 25)
                        {
                            var targetTmp = this.targetAquisitionRoomAttack(squadID, leaderid);
                            if (targetTmp == 000)
                            {
                                //     this.loopTasks(squadID, tasklist);
                            }
                            else
                            {
                                var QuadVital = this.DecideIfQuadIsVital(squadID);
                                if (QuadVital == true)
                                {

                                    return this.getProperPositionForQuadSquad(targetTmp, leader, squadID);
                                }
                                else
                                {
                                    return targetTmp;
                                }
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
    decideMassAttack: function(creep)
    {
        var enemiesInRange = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
        var structuresInRange = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
        var enemiesInRange2 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 2);
        var structuresInRange2 = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 2);
        var enemiesInRange3 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        var structuresInRange3 = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
        if (enemiesInRange.length != 0 || structuresInRange.length != 0)
        {
            return true;
        }
        else
        {
            var counter = 0;
            counter += enemiesInRange2.length * 4;
            counter += structuresInRange2.length * 4;
            counter += enemiesInRange3.length;
            counter += structuresInRange3.length;
            if (counter > 10)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        return true;
    },
    handleattacks: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        var target;
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            // cound how many have rsanged
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        ////////////////////
        var value = 10000;
        var index = 99;
        for (var c = 0; c < all.length; c++)
        {
            if (all[c].hits < value && all[c].hits != all[c].hitsMax)
            {
                value = all[c].hits;
                index = c;
            }
            creep = all[c];
            var target = all[c].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var targetArr = all[c].room.find(FIND_HOSTILE_CREEPS);
            var targets = all[c].pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            var tempTargs = [];
            for (var q = 0; q < targets.length; q++)
            {
                var tempdftg = targets[q].pos.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                {
                    filter: function(object)
                    {
                        return (object.structureType == STRUCTURE_RAMPART);
                    }
                });
                if (tempdftg.length == 0)
                {
                    tempTargs.push(targets[q]);
                }
            }
            targets = tempTargs;
            if (targets.length == 0)
            {
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
            if (flagsInRange.length != 0 && 1 == 1)
            {
                for (var q = 0; q < flagsInRange.length; q++)
                {

                    var found = all[c].room.lookForAt(LOOK_CREEPS, flagsInRange[q].pos);
                    var found2 = all[c].room.lookForAt(FIND_HOSTILE_STRUCTURES, flagsInRange[q].pos);
                    if (found.length != 0)
                    {
                        targetFromflag = found[0];
                    }
                    else if (found2.length != 0)
                    {
                        targetFromflag = found2[0];
                    }

                }
            }
            var decideMassAttack = this.decideMassAttack(all[c]);
            if (targetFromflag != 0)
            {
                all[c].rangedAttack(targetFromflag);
            }
            else if (decideMassAttack)
            {
                all[c].rangedMassAttack();
            }
            else if (targets.length > 0)
            {
                all[c].rangedAttack(targets[0]);
            }
            else if (targetsTRUCTURES.length > 0)
            {
                all[c].rangedAttack(targetsTRUCTURES[0]);
            }
            else
            {
                all[c].rangedMassAttack();
            }

            if (all[c].body.find(elem => elem.type === WORK) != undefined)
            {

                var flagsInRange = all[c].pos.findInRange(FIND_FLAGS, 1);
                var targetFromflag;
                var targetsTRUCTURES = all[c].pos.findInRange(FIND_HOSTILE_STRUCTURES, 1,
                {
                    filter: function(object)
                    {
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
        for (var c = 0; c < all.length; c++)
        {

            if (all[c].body.find(elem => elem.type === HEAL) != undefined)
            {

                if (index != 99)
                {
                    var range = all[c].pos.getRangeTo(all[index]);

                    if (range > 1)
                    {
                        all[c].rangedHeal(all[index]);
                    }
                    else
                    {
                        all[c].heal(all[index]);
                    }

                }
                else
                {
                    all[c].heal(all[c]);
                }

            }

        }
    },
    DecideIfQuadIsVital: function(squadID)
    {

        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        var leaderid = mainMemoryObject.leader;
        var leader = Game.getObjectById(leaderid);
        var squadIsNearEdge = false;
        if (leader.pos.x < 2 || leader.pos.x > 47 || leader.pos.y < 2 || leader.pos.y > 47) // and tower now here
        {

            squadIsNearEdge = true;
            return false;
        }

        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        var homeroomFlag = Game.flags[mainMemoryObject.squadHomeRoom];
        var target = leader.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var targetArr = leader.room.find(FIND_HOSTILE_CREEPS);
        var creepsInRnage = leader.pos.findInRange(FIND_HOSTILE_CREEPS, 6);
        if (homeroomFlag != undefined && leader.pos.getRangeTo(homeroomFlag) < 10 && targetArr.length < 1)
        {
            return false;
        }

        if (targetArr.length < 1)
        {
            return false;
        }
        var targets = leader.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_TOWER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 10);
            }
        });

        var targets2 = leader.room.find(FIND_HOSTILE_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_TOWER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 10);
            }
        });

        if (targets != undefined && leader.room.controller && leader.room.controller.level > 1)
        {
            if (targets2.length == 6 && squadIsNearEdge == false)
            {
                return true;
            }
            var range = leader.pos.getRangeTo(targets);
            if (range > 12)
            {
                return false;
            }
            else if (squadIsNearEdge == false)
            {
                return true;
            }
        }
        if (creepsInRnage.length < 4)
        {
            return false;
        }
        else
        {
            return true;
        }
        return true;
    },
    lineMove: function(squadID, target)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        var leaderid = mainMemoryObject.leader;
        var leader = Game.getObjectById(leaderid);
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            if (mainMemoryObject.SquadMembersCurrent[c] != leaderid)
            {
                all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
        }
        // myArray.splice (all.indexOf('c'), 2);
        var cohesion = leader.pos.findInRange(FIND_MY_CREEPS, 3);
        if (cohesion.length > 2 || Game.time % 3 != 0) // or squadClose to edge
        {
            try
            {
                var dir = this.linemoveDirection(squadID, leaderid, target);

                // leader.say(dir);
                if (dir)
                {

                    leader.move(dir);
                }
                else
                {
                    leader.say("bgl");
                    leader.moveTo(target);
                }

            }
            catch (e)
            {}
        }
        try
        {
            all[0].moveTo(leader);
        }
        catch (e)
        {}
        try
        {
            all[1].moveTo(all[0]);
        }
        catch (e)
        {}
        try
        {
            all[2].moveTo(all[1]);
        }
        catch (e)
        {}
    },
    calculateDamage: function(creep)
    {
        var tempamopunt = 0;
        for (var xx = -3; xx < 3; xx++)
        {
            for (var yy = -3; yy < 3; yy++)
            {
                var tempx = creep.pos.x + xx;
                var tempy = creep.pos.y + yy;
                var newpos = new RoomPosition(tempx, tempy, creep.room.name);
                var found = newpos.findInRange(FIND_HOSTILE_CREEPS, 0);

                var found2 = creep.room.lookForAt(LOOK_STRUCTURES, new RoomPosition(tempx, tempy, creep.room.name));
                if (found.length != 0 || found2.length != 0)
                {
                    if (creep.body.find(elem => elem.type === RANGED_ATTACK) != undefined)
                    {
                        tempamopunt = tempamopunt + 10;
                    }
                }
            }
        }
        return tempamopunt;
    },

    internalRearange: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var leader = Game.getObjectById(Memory.squadObject[squadID].leader);
        leader.say("internalRearange");
        var all = [];
        var target;
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        var fatigueAll = 0;
        for (var c = 0; c < all.length; c++)
        {
            fatigueAll += all[c].fatigue;
        }

        var heads = [];
        var tails = [];
        for (var c = 0; c < all.length; c++)
        {
            var creepername = all[c].name.substring(0, 4);
            if (creepername == "head")
            {
                heads.push(all[c]);
            }
            else
            {
                tails.push(all[c]);
            }

            for (var a = 0; a < heads.length; a++)
            {

                var dampot = 0;

                if (heads[a].body.find(elem => elem.type === WORK) != undefined || heads[a].body.find(elem => elem.type === ATTACK) != undefined)
                {
                    var found = heads[a].pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                    found += heads[a].pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                    for (var b = 0; b < tails.length; b++)
                    {

                        var found2 = tails[b].pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                        found2 += tails[b].pos.findInRange(FIND_HOSTILE_CREEPS, 1);

                        if (found.length < found2.length)
                        {
                            heads[a].moveTo(tails[b]);
                            tails[b].moveTo(heads[a]);
                        }

                    }
                }
                else if (heads[a].body.find(elem => elem.type === RANGED_ATTACK) != undefined)
                {
                    var found = heads[a].pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
                    found += heads[a].pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                    for (var b = 0; b < tails.length; b++)
                    {

                        var found2 = tails[b].pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
                        found2 += tails[b].pos.findInRange(FIND_HOSTILE_CREEPS, 3);

                        if (found.length < found2.length)
                        {
                            heads[a].moveTo(tails[b]);
                            tails[b].moveTo(heads[a]);
                        }

                    }
                }

            }

        }

        this.reAssignLeader(squadID);

    },

    reAssignLeader: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        var target;
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }

        for (var c = 0; c < all.length; c++)
        {
            var found1 = all[c].room.lookForAt(LOOK_CREEPS, new RoomPosition(all[c].pos.x - 1, all[c].pos.y, all[c].room.name));
            var found2 = all[c].room.lookForAt(LOOK_CREEPS, new RoomPosition(all[c].pos.x - 1, all[c].pos.y + 1, all[c].room.name));
            var found3 = all[c].room.lookForAt(LOOK_CREEPS, new RoomPosition(all[c].pos.x, all[c].pos.y + 1, all[c].room.name));

            if (found1.length != 0 && found1.length != 0 && found1.length != 0)
            {
                Memory.squadObject[squadID].leader = all[c].id;
            }

        }

    },
    run: function(squadID)
    {
        this.handleattacks(squadID);
        var mainMemoryObject = Memory.squadObject[squadID];
        Memory.squadObject[squadID].quadVitalBool = false;
        var all = [];
        var target;
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }

        if (Memory.squadObject[squadID].leader == undefined)
        {
            Memory.squadObject[squadID].leader = this.decideLeader(squadID);
        }
        var leader = Game.getObjectById(Memory.squadObject[squadID].leader);
        if (leader == null)
        {
            Memory.squadObject[squadID].leader = this.decideLeader(squadID);
        }
        if (leader != null && leader != undefined && leader)
        {

            /////////////////////////////////////////////////      
            //                   decide targets 

            target = this.TaskList(squadID);

            var QuadVital = this.DecideIfQuadIsVital(squadID);
            var SquadIsInFormation = this.checkIfInCube(squadID, Memory.squadObject[squadID].leader);

            var rangeToTarget = leader.pos.getRangeTo(target);

            if (Memory.squadObject[squadID].leader == undefined || (this.leaderBlocked2(squadID) && QuadVital == true && SquadIsInFormation == false))
            {
                Memory.squadObject[squadID].leader = this.decideLeader(squadID);
            }

            if (Memory.squadObject[squadID].quadVitalBool == true)
            {
                QuadVital = true;
            }

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //      leader.say(target);
            // leader.say(QuadVital);
            if (target != undefined)
            {
              leader.say("T-" + target.x + "," + target.y);
            }
                
            if (QuadVital == false && target != undefined)
            {
                leader.say("lineMove1");
                this.lineMove(squadID, target);
            }
            else if (QuadVital == true && !SquadIsInFormation)
            {
                leader.say("moveIntoFormation");
                if (Memory.squadObject[squadID].leader != undefined)
                {
                    this.moveIntoFormation(Memory.squadObject[squadID].leader, squadID);
                }
            }
            else if (SquadIsInFormation && target != undefined && (leader.pos.x != target.x || leader.pos.y != target.y))
            {
                leader.say("moveAsOne");
                var Direction = this.getDirectionToTarget(squadID, Memory.squadObject[squadID].leader, target);
                this.moveAsOne(squadID, Direction);
            }
            else if (leader != undefined && target != undefined && SquadIsInFormation && Memory.squadObject[squadID].squadSubType != "blinky")
            {
                if (leader.pos.x == target.x && leader.pos.y == target.y)
                {
                    this.internalRearange(squadID);
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