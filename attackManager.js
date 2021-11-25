var roompathfind = require('roompathfinder');
var squadmanage = require('squadManager');
var attackManager = {

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
                console.log("a", i);
                var pathacc = roompathfind.run(attackID, ownedrooms[i]);
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

        var exit = new RoomPosition(29, 0, attackID);

        //   console.log("centerTarget", centerTarget);
        //   console.log("exit", exit);

        let ret = PathFinder.search(
            new RoomPosition(29, 0, attackID),
            new RoomPosition(32, 17, attackID),
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
        if (range > 2)
        {
            console.log("path ends early");
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
    getRoomStarts: function(attackID)
    {

        return ["E23S0"];
    },
    getVectors: function(attackID, centerTarget)
    {

        if (Game.rooms[attackID] == undefined)
        {
            console.log("getVectorsbreak");
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
                    for (var q = 0; q < pathOBJ.length; q++)
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
                    console.log("count break");
                    breaker = true;
                }

                counter++;
            }

        }
        console.log(JSON.stringify(vectorReturnObject));

        return vectorReturnObject;
    },

    run: function(attackID)
    {
        var mainMemoryObject = Memory.attackManager[attackID];
        //   Memory.attackManager[attackID].attackingRooms = {};
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
            console.log("selecting attacking rooms");
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
                //     Game.map.visual.text("PATH"+ q , new RoomPosition(25,25,pathacc[q]), {color: '#FF0000', fontSize: 10}); 
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
        // console.log("has vision");
        ////////////////////////////////////////////////////////////////////////////
        //               manage the vectors 
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
        var basicStart = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL];

        if (Memory.attackManager[attackID].plan == undefined)
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

        this.updateVectors(attackID);

        this.ManageGenericSpawning(attackID);

        // kee- vectors updated
        // control the phalanc
        // power control 

    },

    updateVectors: function(attackID)
    {

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

                    console.log("listOfAvailableRooms", listOfAvailableRooms[i]);
                    console.log("ListOfsquads", ListOfsquads[i]);

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
                        Game.flags[listOfAvailableRooms[i]].memory.flagstruct.squadspawning == ""
                        squadmanage.initializeSquad("am-" + attackID + "-v-" + ListOfsquads[i][0], finalPath, true, "quad", listOfAvailableRooms[i],
                        {
                            "head1": bodyp1,
                            "tail1": bodyp1,
                            "head2": bodyp2,
                            "tail2": bodyp2
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