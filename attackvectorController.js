var roompathfind = require('roompathfinder');
var squadmanage = require('squadManager');
var attackVectorManager = {
   
 
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

    getPath: function(attackID,  centerTarget, blockedPositions)
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
      
      

            while (breaker == false)
            {
                var vectorTargets = [];
                var pathOBJ = this.getPath(attackID,  centerTarget, blockedPoslist);

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
        var basicStart =  [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL]
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

    } 
}
module.exports = attackVectorManager;