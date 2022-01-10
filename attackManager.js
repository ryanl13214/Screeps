var roompathfind = require('roompathfinder');
var squadmanage = require('squadManager');
var attackManager = {
    checkRuins: function(attackID)
    {
        var resourcesPot = Game.rooms[attackID].find(FIND_RUINS,
        {
            filter: (res) =>
            {
                return (res.resourceType != RESOURCE_ENERGY);
            }
        });
        var target = Game.rooms[attackID].find(FIND_HOSTILE_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_TOWER);
            }
        });
        var target2 = Game.rooms[attackID].find(FIND_HOSTILE_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_INVADER_CORE);
            }
        });
        if ((resourcesPot.length != 0 && target.length == 0) || (resourcesPot.length != 0 && target2.length == 0 && Game.rooms[attackID].controller == undefined))
        {
            //  creepfunctions.summonHauler(creep.room.name, creep.memory.memstruct.spawnRoom);
            Game.spawns["E24N3"].spawnCreep(
                [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL], attackID + 'Support',
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: "E24N3",
                            tasklist: [

                                ["forcemoveToRoom", attackID],
                                ["gatherLooseResources"],
                                ["gatherstoredResources"],
                                ["forcemoveToRoom", "E24N3"],
                                ["deposit"],
                                ["repeat", 6]
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
    },
    getRoomdata: function(attackID) // get visuial of the room
    {

        var mainMemoryObject = Memory.attackManager[attackID];

        var allRooms = Object.keys(Memory.attackManager[attackID].attackingRooms);
        var selectedRoom = "";
        for (var i = 0; i < allRooms.length; i++)
        {
            if (selectedRoom == "")
            {
                if (Memory.empire.roomsobj[allRooms[i]].oberverobj.tasklist.length == 0 || Memory.empire.roomsobj[allRooms[i]].oberverobj.tasklist[0] == attackID)
                {
                    selectedRoom = allRooms[i];
                }
            }
        }

        if (selectedRoom != "")
        {
            console.log("attack requesting vision ", attackID, " from room  ", selectedRoom);
            Memory.empire.roomsobj[selectedRoom].oberverobj.tasklist = [attackID];
        }

    },
    // check if the room is A) part of another attack B) has enough Resources to launch an attack C) is not under attack   // once checked this room is assigned to this attack until one of the conditions fails
    selectAttackingRoms: function(attackID)
    {
        var ownedrooms = [];
        if (Memory.empire != undefined && Memory.empire.roomsobj != undefined)
        {
            ownedrooms = Object.keys(Memory.empire.roomsobj);
        }
        //  console.log("ownedrooms", ownedrooms);
        var returnList = [];
        for (var i = 0; i < ownedrooms.length; i++)
        {
            if (Game.map.getRoomLinearDistance(attackID, ownedrooms[i]) < 10 && Game.rooms[ownedrooms[i]].controller.level == 8) // check that room has good amount of boosts
            {

                var pathacc = roompathfind.run(attackID, ownedrooms[i], 0); // 0 means allow through hostile rooms
                pathacc.push(attackID);
                Memory.attackManager[attackID].attackingRooms[ownedrooms[i]] = {};
                Memory.attackManager[attackID].attackingRooms[ownedrooms[i]] = // "a"
                    {
                        Path: pathacc
                    }

            }
        }
    },
    getCenterTarg: function(attackID)
    {

        var enemyTargets = Game.rooms[attackID].find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_TERMINAL);
            }
        });

        var xcount = 0;
        var ycount = 0;

        for (var i = 0; i < enemyTargets.length; i++)
        {
            xcount += enemyTargets[i].pos.x;
            ycount += enemyTargets[i].pos.y;
        }

        return new RoomPosition(xcount / enemyTargets.length, ycount / enemyTargets.length, attackID);

    },

    getPath: function(attackID, fromRoom, centerTarget, blockedPositions)
    {

        var exit = centerTarget.findClosestByRange(FIND_EXIT_LEFT);

        if (exit == -10)
        {
            var exit = centerTarget.findClosestByRange(FIND_EXIT_BOTTOM);
        }
        if (exit == -10)
        {
            var exit = centerTarget.findClosestByRange(FIND_EXIT_RIGHT);
        }
        if (exit == -10)
        {
            var exit = centerTarget.findClosestByRange(FIND_EXIT_TOP);
        }

        var exit = new RoomPosition(exit.x, exit.y, attackID);

        let ret = PathFinder.search(
            exit,
            new RoomPosition(centerTarget.x, centerTarget.y, attackID),
            {
                // We need to set the defaults costs higher so that we
                // can set the road cost lower in `roomCallback`
                plainCost: 1,
                swampCost: 1,
                roomCallback: function(roomName)
                {

                    let costs = new PathFinder.CostMatrix;
                    var terrain = new Room.Terrain(attackID);

                    Game.rooms[attackID].find(FIND_STRUCTURES).forEach(function(struct)
                    {
                        if (struct.structureType === STRUCTURE_RAMPART || struct.structureType === STRUCTURE_WALL)
                        {
                            var costcalc = struct.hits / 1000000;
                            if (costcalc < 1)
                            {
                                costcalc = 1
                            }
                            if (costcalc > 80)
                            {
                                costcalc = 80
                            }
                            costs.set(struct.pos.x, struct.pos.y, costcalc);
                        }
                    });

                    for (var qq = 0; qq < blockedPositions.length; qq++)
                    {
                        for (var xx = -3; xx < 3; xx++)
                        {
                            for (var yy = -3; yy < 3; yy++)
                            {
                                //   console.log(blockedPositions[qq]);

                                if (blockedPositions[qq] != undefined)
                                {
                                    costs.set(blockedPositions[qq].x + xx, blockedPositions[qq].y + yy, 0xff);
                                }
                                else
                                {
                                    //      console.log("s");
                                }

                            }
                        }
                    }

                    for (var xx = 0; xx < 50; xx++)
                    {
                        for (var yy = 0; yy < 50; yy++)
                        {
                            if (terrain.get(xx, yy) == TERRAIN_MASK_WALL)
                            {
                                costs.set(xx, yy, 0xff);
                            }
                            if (terrain.get(xx - 1, yy) == TERRAIN_MASK_WALL)
                            {
                                costs.set(xx, yy, 0xff);
                            }
                            if (terrain.get(xx, yy + 1) == TERRAIN_MASK_WALL)
                            {
                                costs.set(xx, yy, 0xff);
                            }
                            if (terrain.get(xx - 1, yy + 1) == TERRAIN_MASK_WALL)
                            {
                                costs.set(xx, yy, 0xff);
                            }
                        }
                    }

                    return costs;
                },
            }
        );

        if (ret.path.length == 0)
        {
            console.log("NOpATH");
            return "NOpATH";
        }

        var endPosition2 = new RoomPosition(centerTarget.x, centerTarget.y, attackID);
        var endPosition = new RoomPosition(ret.path[ret.path.length - 1].x, ret.path[ret.path.length - 1].y, attackID);
        var range = endPosition.getRangeTo(endPosition2);
        if (range > 4)
        {
            //          console.log("path ends early");
            return "NOpATH";
        }

        for (var xx = 0; xx < ret.path.length; xx++)
        {
            Game.rooms[attackID].visual.circle(ret.path[xx].x, ret.path[xx].y,
            {
                fill: 'red',
                radius: 0.15,
                stroke: 'red'
            });
        }

        return ret.path;

    },

    createphalanx: function(attackID) // does not do a path check    // TURN ALL THAT REPEATED SHIT INTO A FDUCKING FUCKTION
    {
        var terrain = new Room.Terrain(attackID);
        var roomCenter = new RoomPosition(25, 25, attackID)

        var roomobj = Game.rooms[attackID]
        var usernameacc = roomobj.controller.owner.username;
      
        if (roomobj.controller != undefined && roomobj.controller.owner != undefined && roomobj.controller.owner.username != undefined)
        {

            var allramparts = roomCenter.findInRange(FIND_HOSTILE_STRUCTURES, 20,
            {
                filter: (res) =>
                {
                    return (res.structureType == STRUCTURE_RAMPART && res.owner.username == usernameacc);
                }
            });
        }

        else
        {

            var allramparts = roomCenter.findInRange(FIND_HOSTILE_STRUCTURES, 20,
            {
                filter: (res) =>
                {
                    return (res.structureType == STRUCTURE_RAMPART);
                }
            });

        }

        var allrampartsreturnobj = {
            positionData:
            {}
        }

        for (var i = 0; i < allramparts.length; i++)
        {

            var rampX = allramparts[i].pos.x;
            var rampY = allramparts[i].pos.y;
            var label = String(rampX) + "-" + String(rampY);
            var positionA = new RoomPosition(rampX, rampY, attackID)
            var allrampartsNear = positionA.findInRange(FIND_HOSTILE_STRUCTURES, 1,
            {
                filter: (res) =>
                {
                    return (res.structureType == STRUCTURE_RAMPART);
                }
            });
            var positionAbove = new RoomPosition(rampX, rampY - 1, attackID)
            // var positionabove 

            var topacc = 0;
            ///////////////////////////////////////////////////////////////////////////////////////////
            var current = positionAbove.findInRange(FIND_HOSTILE_STRUCTURES, 0,
            {
                filter: (res) =>
                {
                    return (res.structureType == STRUCTURE_RAMPART);
                }
            });

            if (allrampartsNear.length < 7 && current.length == 1)
            {
                topacc = 1;
                // check rampart has a viable position 
                try
                {
                    var positionAbove1 = new RoomPosition(rampX, rampY - 1, attackID)
                    var current1 = positionAbove1.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX, rampY - 1) == TERRAIN_MASK_WALL && current1.length == 0) // remove the positive figure if any of these trigger
                    {
                        topacc = 0;
                    }

                    var positionAbove2 = new RoomPosition(rampX, rampY - 2, attackID)
                    var current2 = positionAbove2.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX, rampY - 2) == TERRAIN_MASK_WALL && current2.length == 0) // remove the positive figure if any of these trigger
                    {
                        topacc = 0;
                    }

                    var positionAbove3 = new RoomPosition(rampX, rampY - 3, attackID)
                    var current3 = positionAbove3.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX, rampY - 3) == TERRAIN_MASK_WALL && current3.length == 0) // remove the positive figure if any of these trigger
                    {
                        topacc = 0;
                    }

                    var positionAbove4 = new RoomPosition(rampX, rampY - 4, attackID)
                    var current4 = positionAbove3.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX, rampY - 4) == TERRAIN_MASK_WALL && current4.length == 0) // remove the positive figure if any of these trigger
                    {
                        topacc = 0;
                    }

                }
                catch (e)
                {}

            }

            var positionbellow = new RoomPosition(rampX, rampY + 1, attackID)
            var bottomacc = 0;
            ///////////////////////////////////////////////////////////////////////////////////////////
            var current = positionbellow.findInRange(FIND_HOSTILE_STRUCTURES, 0,
            {
                filter: (res) =>
                {
                    return (res.structureType == STRUCTURE_RAMPART);
                }
            });

            if (allrampartsNear.length < 7 && current.length == 1)
            {
                bottomacc = 1;
                // check rampart has a viable position 
                try
                {
                    var positionAbove1 = new RoomPosition(rampX, rampY + 1, attackID)
                    var current1 = positionAbove1.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX, rampY + 1) == TERRAIN_MASK_WALL && current1.length == 0) // remove the positive figure if any of these trigger
                    {
                        bottomacc = 0;
                    }

                    var positionAbove2 = new RoomPosition(rampX, rampY + 2, attackID)
                    var current2 = positionAbove2.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX, rampY + 2) == TERRAIN_MASK_WALL && current2.length == 0) // remove the positive figure if any of these trigger
                    {
                        bottomacc = 0;
                    }

                    var positionAbove3 = new RoomPosition(rampX, rampY + 3, attackID)
                    var current3 = positionAbove3.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX, rampY + 3) == TERRAIN_MASK_WALL && current3.length == 0) // remove the positive figure if any of these trigger
                    {
                        bottomacc = 0;
                    }

                    var positionAbove4 = new RoomPosition(rampX, rampY + 4, attackID)
                    var current4 = positionAbove3.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX, rampY + 4) == TERRAIN_MASK_WALL && current4.length == 0) // remove the positive figure if any of these trigger
                    {
                        bottomacc = 0;
                    }

                }
                catch (e)
                {}

            }

            var positionleft = new RoomPosition(rampX - 1, rampY, attackID)
            var leftacc = 0;
            ///////////////////////////////////////////////////////////////////////////////////////////
            var current = positionleft.findInRange(FIND_HOSTILE_STRUCTURES, 0,
            {
                filter: (res) =>
                {
                    return (res.structureType == STRUCTURE_RAMPART);
                }
            });

            if (allrampartsNear.length < 7 && current.length == 1)
            {
                leftacc = 1;
                // check rampart has a viable position 
                try
                {
                    var positionAbove1 = new RoomPosition(rampX - 1, rampY, attackID)
                    var current1 = positionAbove1.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX - 1, rampY) == TERRAIN_MASK_WALL && current1.length == 0) // remove the positive figure if any of these trigger
                    {
                        leftacc = 0;
                    }

                    var positionAbove2 = new RoomPosition(rampX - 2, rampY, attackID)
                    var current2 = positionAbove2.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX - 2, rampY) == TERRAIN_MASK_WALL && current2.length == 0) // remove the positive figure if any of these trigger
                    {
                        leftacc = 0;
                    }

                    var positionAbove3 = new RoomPosition(rampX - 3, rampY, attackID)
                    var current3 = positionAbove3.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX - 3, rampY) == TERRAIN_MASK_WALL && current3.length == 0) // remove the positive figure if any of these trigger
                    {
                        leftacc = 0;
                    }

                    var positionAbove4 = new RoomPosition(rampX - 4, rampY, attackID)
                    var current4 = positionAbove3.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX - 4, rampY) == TERRAIN_MASK_WALL && current4.length == 0) // remove the positive figure if any of these trigger
                    {
                        leftacc = 0;
                    }

                }
                catch (e)
                {}

            }

            var positionright = new RoomPosition(rampX, rampY, attackID)
            var rightacc = 0;
            ///////////////////////////////////////////////////////////////////////////////////////////
            var current = positionright.findInRange(FIND_HOSTILE_STRUCTURES, 0,
            {
                filter: (res) =>
                {
                    return (res.structureType == STRUCTURE_RAMPART);
                }
            });

            if (allrampartsNear.length < 7 && current.length == 1)
            {
                rightacc = 1;
                // check rampart has a viable position 
                try
                {

                    var positionAbove1 = new RoomPosition(rampX + 1, rampY, attackID)
                    var current1 = positionAbove1.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });
                    if (terrain.get(rampX + 1, rampY) == TERRAIN_MASK_WALL || current1.length != 0) // remove the positive figure if any of these trigger
                    {
                        rightacc = 0;
                    }

                    var positionAbove2 = new RoomPosition(rampX + 2, rampY, attackID)
                    var current2 = positionAbove2.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });
                    if (terrain.get(rampX + 2, rampY) == TERRAIN_MASK_WALL || current2.length != 0) // remove the positive figure if any of these trigger
                    {
                        rightacc = 0;
                    }

                    var positionAbove3 = new RoomPosition(rampX + 3, rampY, attackID)
                    var current3 = positionAbove3.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });
                    if (terrain.get(rampX + 3, rampY) == TERRAIN_MASK_WALL || current3.length != 0) // remove the positive figure if any of these trigger
                    {
                        rightacc = 0;
                    }

                    var positionAbove4 = new RoomPosition(rampX + 4, rampY, attackID)
                    var current4 = positionAbove3.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });
                    if (terrain.get(rampX + 4, rampY) == TERRAIN_MASK_WALL || current4.length != 0) // remove the positive figure if any of these trigger
                    {
                        rightacc = 0;
                    }

                }
                catch (e)
                {}
            }

            if (topacc + bottomacc + leftacc + rightacc != 0)
            {
                allrampartsreturnobj.positionData[String(label)] = {

                    rampX: rampX,
                    rampY: rampY,
                    topq: topacc,
                    bottomq: bottomacc,
                    leftq: leftacc,
                    rightq: rightacc
                };
            }

        } // END OF FOOR LOOP

        console.log("aaaaaaq", JSON.stringify(allrampartsreturnobj.positionData["32-16"]));
        console.log("bbbbbbb", JSON.stringify(allrampartsreturnobj.positionData["33-16"]));

        this.findBestOpporunityForPalanx(attackID, allrampartsreturnobj.positionData)

        var returnobj = {
            // numberOfSquads:
            //   positionsOfSquads:
        }

        return returnobj;

    },
    findBestOpporunityForPalanx: function(attackID, allrampartsreturnobj)
    {

        var listofnames = Object.keys(allrampartsreturnobj);
        var listofvalues = Object.values(allrampartsreturnobj);

        //  on the right 
        for (var i = 0; i < listofnames.length; i++)
        {

            var currentrampartobj = allrampartsreturnobj[listofnames[i]];

            if (currentrampartobj.rightq != 0)
            {

                var breaker = false;
                var counter = 1;
                while (!breaker)
                {

                    var thisx = currentrampartobj.rampX;
                    //   console.log("1-",thisx );
                    var thisy = currentrampartobj.rampY;
                    var thisy2 = currentrampartobj.rampY + counter;
                    var belowlabel = String(thisx) + "-" + String(thisy2);

                    if (allrampartsreturnobj[belowlabel] == undefined)
                    { // no rampart below this one 
                        //    console.log(listofnames[i]+"-q-",belowlabel );
                        breaker = true;
                    }
                    else if (allrampartsreturnobj[belowlabel].rightq == 0)
                    { // rampart below this one is not part of the phalanx
                        //   console.log("-qq" );

                        //  Game.rooms[attackID].visual.circle(new RoomPosition(currentrampartobj.rampX + counter,currentrampartobj.rampY ,attackID ),{fill: 'red', radius: 0.55, stroke: 'red'});

                        breaker = true;
                    }
                    else
                    {
                        allrampartsreturnobj[listofnames[i]].rightq += allrampartsreturnobj[belowlabel].rightq;
                        allrampartsreturnobj[belowlabel].rightq = 0;
                        console.log("---", allrampartsreturnobj[listofnames[i]].rightq);
                        counter++;
                    }

                };
                //    console.log("-c-",counter);
            }

            if (allrampartsreturnobj[listofnames[i]].rightq > 5)
            {
                console.log("-2-", allrampartsreturnobj[listofnames[i]].rightq);
                var thisx = allrampartsreturnobj[listofnames[i]].rampX;
                var thisy = allrampartsreturnobj[listofnames[i]].rampY;

                var pos1 = new RoomPosition(thisx + 1, thisy, attackID)
                var pos2 = new RoomPosition(thisx + 1, thisy + allrampartsreturnobj[listofnames[i]].rightq, attackID)
                Game.rooms[attackID].visual.line(pos1, pos2,
                {
                    color: 'green',
                    width: 1,
                    lineStyle: 'green'
                });

                var pos1 = new RoomPosition(thisx + 2, thisy, attackID)
                var pos2 = new RoomPosition(thisx + 2, thisy + allrampartsreturnobj[listofnames[i]].rightq, attackID)
                Game.rooms[attackID].visual.line(pos1, pos2,
                {
                    color: 'orange',
                    width: 1,
                    lineStyle: 'orange'
                });

                var pos1 = new RoomPosition(thisx + 3, thisy, attackID)
                var pos2 = new RoomPosition(thisx + 3, thisy + allrampartsreturnobj[listofnames[i]].rightq, attackID)
                Game.rooms[attackID].visual.line(pos1, pos2,
                {
                    color: 'red',
                    width: 1,
                    lineStyle: 'red'
                });
            }

        }

    },
    getRoomStarts: function(attackID)
    {

        return ["E24N3"]; // obsolete
    },
    getVectors: function(attackID, centerTarget)
    {

        if (Game.rooms[attackID] == undefined)
        {
            // console.log("getVectorsbreak");
            return false
        }
        // loop through all the rooms that the attacks come from
        // look through the vector calculatior marking off 
        var vectorReturnObject = [];
        //   each vectors shopuld be
        /*
         {
             currently assigned squad:
             positions of targets:
             time when the vector is suitablke for dismantleing:
         }
         */
        var blockedPoslist = [];
        var breaker = false;
        var counter = 0;
        var roomstarts = this.getRoomStarts(attackID);
        for (var i = 0; i < roomstarts.length; i++)
        {

            while (breaker == false)
            {
                var vectorTargets = [];
                var pathOBJ = this.getPath(attackID, roomstarts, centerTarget, blockedPoslist);

                if (pathOBJ == "NOpATH")
                {
                    breaker = true;
                }
                else
                {
                    for (var q = 2; q < pathOBJ.length; q++)
                    {
                        var position = new RoomPosition(pathOBJ[q].x, pathOBJ[q].y, attackID);

                        var targets = position.findInRange(FIND_STRUCTURES, 0,
                        {
                            filter: (structure) =>
                            {
                                return (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART);
                            }
                        });

                        if (targets.length != 0)
                        {
                            blockedPoslist.push(position);
                            var positionchanges = [
                                [0, 0],
                                [0, 1],
                                [-1, 0],
                                [-1, 1]

                            ];
                            for (var qq = 0; qq < positionchanges.length; qq++)
                            {
                                var position2 = new RoomPosition(position.x + positionchanges[qq][0], position.y + positionchanges[qq][1], attackID);
                                var targets2 = position2.findInRange(FIND_STRUCTURES, 0,
                                {
                                    filter: (structure) =>
                                    {
                                        return (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART);
                                    }
                                });

                                if (vectorTargets.indexOf([position.x + positionchanges[qq][0], position.y + positionchanges[qq][1]]) == -1 && targets2.length != 0)
                                {
                                    Game.rooms[attackID].visual.circle(position.x + positionchanges[qq][0], position.y + positionchanges[qq][1],
                                    {
                                        fill: 'white',
                                        radius: 0.25,
                                        stroke: 'white'
                                    });
                                    vectorTargets.push([position.x + positionchanges[qq][0], position.y + positionchanges[qq][1]]);
                                }

                            }

                        }
                    }

                    var vec = {
                        currentlyAssignedSquad: "",
                        targets: vectorTargets,
                        ticksWhereSquadIsCloseToRamparts: 0,
                        desiredSquad: "blinky",
                        squadTravelTime: 0
                    };

                    vectorReturnObject.push(vec);

                }
                if (counter > 9)
                {
                    //   console.log("count break");
                    breaker = true;
                }

                counter++;
            }

        }
        //console.log(JSON.stringify(vectorReturnObject));

        return vectorReturnObject;
    },

    run: function(attackID)
    {
        var mainMemoryObject = Memory.attackManager[attackID];
        if (Game.time % 5 == 0)
        {
       //     Memory.attackManager[attackID] = {} ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
        /////////////////////////////////////////////////////////////
        //                             decide what rooms are part oif the attack and the path to get to them.
        ///////////////////////////////////////////////////////////////////////////////////

        if (Memory.attackManager[attackID].attackingRooms == undefined)
        {
            Memory.attackManager[attackID].attackingRooms = {};
        }

        var numberOfattackingRooms = Object.keys(Memory.attackManager[attackID].attackingRooms).length;
        // console.log(" ng rooms", numberOfattackingRooms);
        if (numberOfattackingRooms == 0)
        {

            this.selectAttackingRoms(attackID);
        }
        //   console.log(JSON.stringify(Memory.attackManager[attackID]));
        ////////////////////////////////////////////////////////////////////////
        //                  visualise the path to the room
        ////////////////////////////////////////////////////////////////////////
        var attckrooms = Object.keys(Memory.attackManager[attackID].attackingRooms);
        var pathacc;
        for (var i = 0; i < attckrooms.length; i++)
        {
            pathacc = Memory.attackManager[attackID].attackingRooms[attckrooms[i]].Path;
            for (var q = 0; q < pathacc.length; q++)
            {
                if (q > 0)
                {
                    Game.map.visual.line(new RoomPosition(25, 25, pathacc[q]), new RoomPosition(25, 25, pathacc[q - 1]),
                    {
                        width: 5,
                        color: '#ffffff',
                        lineStyle: 'solid'
                    });
                }
              
            }

        }

        ////////////////////////////////////////////////////////////////////////
        //                 get vision of the room
        ////////////////////////////////////////////////////////////////////////

        if (Game.rooms[attackID] == undefined)
        {
            this.getRoomdata(attackID);
            return false
        }
        
        ////////////////////////////////////////////////////////////////////////////
        //               creqate phalanx
        ////////////////////////////////////////////////////////////////////////////
        if (mainMemoryObject.phalanx == undefined)
        {

            var a = this.createphalanx(attackID);
            Memory.attackManager[attackID].phalanx = a;

        }

        ////////////////////////////////////////////////////////////////////////////
        //               creqate the vectors 
        ////////////////////////////////////////////////////////////////////////////

        if (mainMemoryObject.vectors == undefined)
        {
            var centerTarget = this.getCenterTarg(attackID);
            var vectors = this.getVectors(attackID, centerTarget);
            Memory.attackManager[attackID].vectors = vectors;

        }
        ////////////////////////////////////////////////////////////////////////////
        //               manage the plan 
        ////////////////////////////////////////////////////////////////////////////
        var basicStart = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL];

        if (Memory.attackManager[attackID].plan == undefined && Memory.attackManager[attackID].vectors != undefined)
        {

            Memory.attackManager[attackID].plan = {
                standardQuadComposition: basicStart,
                numberOfStandardQUads: Memory.attackManager[attackID].vectors.length, // equal the number of vectors 
                overRampartArcher: false,
                overRamparttargets: [],
                outerRoomDis: false,
                nextRoomMines: this.GetAllRoomsMineRooms(attackID),
                roomDowngrade: false,
                contollerDefencesAttacker: false,
                nukesNeeded:
                {},
                powerCreepsDesired: false,
                phalanxNeeded: false,
                DuoDismantlersNeeded: 0,
                NakedDismantlersneeded: 0,
                EnemyWallsBreached: false
            }
        }
        // ckeeck for plunder
        this.checkRuins(attackID);
        if (Memory.attackManager[attackID].vectors != undefined)
        {
            // kee- vectors updated
            this.updateVectors(attackID);
        }
        // spawnblinkys
              this.ManageGenericSpawning(attackID);//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // control the phalanc
        // power control 

    },

    updateVectors: function(attackID)
    {
        var foundtarg = false;
        for (var i = 0; i < Memory.attackManager[attackID].vectors.length; i++)
        {
            if (Memory.attackManager[attackID].vectors[i].currentlyAssignedSquad != "" && Memory.attackManager[attackID].vectors[i].currentlyAssignedSquad != "transit")
            {
                if (Memory.squadObject[Memory.attackManager[attackID].vectors[i].currentlyAssignedSquad] == undefined)
                {
                    Memory.attackManager[attackID].vectors[i].currentlyAssignedSquad = "";
                }
            }

            if (Memory.attackManager[attackID].vectors[i].currentlyAssignedSquad == "transit")
            {
                if (Memory.squadObject["am-" + attackID + "-v-" + i] == undefined && Memory.squadObject["am-" + attackID + "-v-" + i + "alt"] == undefined)
                {
                    Memory.attackManager[attackID].vectors[i].currentlyAssignedSquad = "";
                }
            }

            //////  handle destroying completed vectors 

            var arrtemp = Memory.attackManager[attackID].vectors[i].targets;
            //    console.log(JSON.stringify(arrtemp));

            for (var xx = 0; xx < arrtemp.length; xx++)
            {
                var containers = new RoomPosition(arrtemp[xx][0], arrtemp[xx][1], attackID).findInRange(FIND_STRUCTURES, 0,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType != STRUCTURE_CONTAINER && structure.structureType != STRUCTURE_ROAD);
                    }
                });
                if (containers.length != 0)
                {
                    foundtarg = true;
                }

            }

        }

        if (foundtarg == false)
        {
            console.log("delete");
            //delete Memory.attackManager[attackID];
        }

    },

    ManageGenericSpawning: function(attackID)
    {
        var ListOfsquads = [];





        for (var i = 0; i < Memory.attackManager[attackID].vectors.length; i++)
        {
            if (Memory.attackManager[attackID].vectors[i].currentlyAssignedSquad == "")
            {
                ListOfsquads.push([i, Memory.attackManager[attackID].vectors[i].desiredSquad]);

            }
        }

        var listOfAvailableRooms = [];
        var participatingRooms = Object.keys(Memory.attackManager[attackID].attackingRooms)
        
    //    console.log("participatingRooms",participatingRooms);
        //     Memory.attackManager[attackID].attackingRooms
        for (var i = 0; i < participatingRooms.length; i++)
        {

            if (Memory.empire.roomsobj[participatingRooms[i]].squadSpawning == "" && Memory.empire.roomsobj[participatingRooms[i]].boostsLow == false)
            {
                listOfAvailableRooms.push(participatingRooms[i])
            }

        }

        if (listOfAvailableRooms.length != 0 && ListOfsquads.length != 0)
        {
            var break1 = false;
            for (var i = 0; i < listOfAvailableRooms.length; i++)
            {
                if (i == ListOfsquads.length)
                {
                    break1 = true;
                }

                if (break1 == false)
                {

                    var finalPath = [];
                    var rawPath = Memory.attackManager[attackID].attackingRooms[listOfAvailableRooms[i]].Path;
                    for (var q = 0; q < rawPath.length; q++)
                    {
                        finalPath.push(["forcemoveToRoom", rawPath[q]])
                    }

                    finalPath.push(["joinAttack", attackID, ListOfsquads[i][0]]);

                    //console.log("listOfAvailableRooms", listOfAvailableRooms[i]);
                    //console.log("ListOfsquads", ListOfsquads[i]);

                    var bodyp1 = [];
                    var bodyp2 = [];

                    if (ListOfsquads[i][1] == "blinky")
                    {
                        bodyp1 = Memory.attackManager[attackID].plan.standardQuadComposition;
                        bodyp2 = Memory.attackManager[attackID].plan.standardQuadComposition;
                    }

                    if (ListOfsquads[i][1] == "dis")
                    {
                        bodyp1 = Memory.attackManager[attackID].plan.standardQuadComposition;
                        bodyp2 = Memory.attackManager[attackID].plan.standardQuadComposition;
                    }

                    if (Memory.squadObject["am-" + attackID + "-v-" + ListOfsquads[i][0]] == undefined)
                    {

                        Memory.empire.roomsobj[participatingRooms[i]].squadSpawning = "am-" + attackID + "-v-" + ListOfsquads[i][0];
                      
                         Memory.empire.roomsobj[listOfAvailableRooms[i]].squadSpawning =""
                        squadmanage.initializeSquad("am-" + attackID + "-v-" + ListOfsquads[i][0], finalPath, true, "quad", listOfAvailableRooms[i],
                        {
                            "head1": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                            "tail1": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                            "head2": bodyp2,
                            "tail2": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
                        }, ListOfsquads[i][1]);

                        Memory.attackManager[attackID].vectors[ListOfsquads[i][0]].currentlyAssignedSquad = "transit";

                    }

                }
            }
        }

    },

    GetAllRoomsMineRooms: function(attackID)
    {
        return [];
    }

}
module.exports = attackManager;