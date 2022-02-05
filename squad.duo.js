var creepfunctions = require('prototype.creepfunctions');
var guardCode = require('role.basicroomguard');
var attackerCode = require('role.basicattacker');
/*

var bodypartshead = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK];
 var bodypartstail = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL];
    if(Memory.squadObject.testDuo == undefined)
    {
        squadmanage.initializeSquad("testDuo", [["moveToRoom", "E25N4"]], false, "duo", "E24N3",
        {
            "head": bodypartshead,
            "tail": bodypartstail,
        },"chasedown");
    }

*/
var Duo = {

    run: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        var target;
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        var tail;
        var head;
        if (all.length == 0 && mainMemoryObject.squadisready == true)
        {

            delete Memory.squadObject[squadID];
        }
        for (var c = 0; c < all.length; c++)
        {
            var creepername = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).name.substring(0, 4);
            if (creepername == "tail")
            {
                tail = all[c];
            }
            if (creepername != "tail")
            {
                head = all[c];
            }
        }

        if (head && head.memory.memstruct.tasklist.length != 0 && head.memory.memstruct.tasklist[0].length > 1 && head.memory.memstruct.tasklist[0][0] == "joinSquad")
        {
            head.memory.memstruct.tasklist = mainMemoryObject.arrayOfSquadGoals;
            head.memory.role = "squadmember"
        }
        ///////////////////////////////////////////////////////////////////////////////
        if (head)
        {

            if (tail && head)
            {

                var range = head.pos.getRangeTo(tail);
                /////////////////////////////
                if (range > 1 && Game.time % 3 == 0)
                {
                    var check = false;
                }
                else
                {
                    var check = creepfunctions.checkglobaltasks(head);
                }

            }
            else
            {
                var check = creepfunctions.checkglobaltasks(head);
            }

            if (check)
            {
                if (mainMemoryObject.squadSubType == "chasedown")
                {
                    head.say("a");
                    this.chaseDown(head, tail, squadID);
                }
                if (mainMemoryObject.squadSubType == "DismantleOuterBunker")
                {
                    this.chaseDown(head, tail, squadID);
                }
                if (mainMemoryObject.squadSubType == "dis")
                {
                    this.flagDismantle(head, tail, squadID);
                }
                if (mainMemoryObject.squadSubType == "roomDefence")
                {
                    this.chaseDown(head, tail, squadID);
                }
            }

        }
        if (tail)
        {

            ///////////////////////////////////
            var slave = tail;
            var master = head;
            tail.heal(tail);

            var target = tail.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

            ///////////////////////////////////////////   

            if (tail.body.find(elem => elem.type === RANGED_ATTACK) != undefined && target)
            {
                tail.rangedAttack(target);
            }

            if (master == null) // and not a blinky 
            {
                tail.suicide();
            }
            tail.moveTo(master);
            if (head != undefined && head != null)
            {
                if (head.hits != head.hitsMax)
                {
                    tail.heal(head);
                }
                else
                {
                    tail.heal(tail);
                }

            }

            if (head.room.name == tail.room.name)
            {
                if (tail.pos.x == 0 || tail.pos.x == 49 || tail.pos.y == 0 || tail.pos.y == 49)
                {
                    tail.moveTo(new RoomPosition(25, 25, tail.room.name))
                }

            }

        }
    },

    decideToFlee: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];

        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }

        var fleeList = [];
        for (var c = 0; c < all.length; c++)
        {

            var tmppppp = all[c].pos.findInRange(FIND_HOSTILE_CREEPS, 2);
            for (var i = 0; i < tmppppp.length; i++)
            {
                var coutner = 0;
                for (var q = 0; q < tmppppp[i].body.length; q++)
                {
                    if (tmppppp[i].body[q].type == ATTACK)
                    {
                        coutner++
                    }
                }

                if (coutner > 20)
                {
                    fleeList.push(tmppppp[i]);
                }

            }
        }

        return fleeList

    },
    fleeDirection: function(squadID, avoidarray, leaderid)
    {

        var leader = Game.getObjectById(leaderid); // pathfinding here
        //    var path = leader.pos.findPathTo(avoidarray[0]);
        // use the target finder for the displaced targets
        let goals = _.map(avoidarray, function(host)
        {
            return {
                pos: host.pos,
                range: 5
            };
        });
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            // cound how many have rsanged
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }

        let ret = PathFinder.search(
            leader.pos, goals,
            {
                flee: true,
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

                    for (var xx = 2; xx < 48; xx++)
                    {
                        for (var yy = 2; yy < 48; yy++)
                        {
                            if (terrain.get(xx, yy) == TERRAIN_MASK_SWAMP)
                            {
                                //  Game.rooms[roomName].visual.circle(xx, yy,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                                costs.set(xx, yy, 15);
                            }

                        }
                    }

                    room.find(FIND_STRUCTURES).forEach(function(struct)
                    {
                        if (struct.structureType !== STRUCTURE_CONTAINER && struct.structureType !== STRUCTURE_ROAD && (struct.structureType !== STRUCTURE_RAMPART || !struct.my))
                        {
                            //  Game.rooms[roomName].visual.circle(struct.pos.x, struct.pos.y,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
                            costs.set(struct.pos.x, struct.pos.y, 0xff);

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

                        }
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

                    });
                    room.find(FIND_HOSTILE_CREEPS).forEach(function(struct)
                    {
                        room.visual.circle(struct.pos.x, struct.pos.y,
                        {
                            fill: 'transparent',
                            radius: 0.08,
                            stroke: 'black'
                        });
                        costs.set(struct.pos.x, struct.pos.y, 0xff);

                    });

                    return costs;
                },
            }

        );

        var pos = ret.path[0];

        for (var xx = 0; xx < ret.path.length; xx++)
        {
            Game.rooms[leader.room.name].visual.circle(ret.path[xx].x, ret.path[xx].y,
            {
                fill: 'transparent',
                radius: 0.15,
                stroke: 'yellow'
            });
        }

        //     creep.move(leader.pos.getDirectionTo(pos));
        return leader.pos.getDirectionTo(pos);

    },
    chaseDown: function(creep, Healer, squadID)
    {

        var towers = Game.rooms[creep.room.name].find(FIND_MY_STRUCTURES,
        {
            filter: (s) =>
            {
                return (s.structureType == STRUCTURE_TOWER);
            }
        });
        if (towers.length != 0)
        {
            var target = towers[0].pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        }
        else
        {

            var target = creepfunctions.getcombattagetsclosest(creep);

        }

        if (target == undefined)
        {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS,
            {
                filter:
                {
                    owner:
                    {
                        username: 'Invader'
                    }
                }
            });
        }
        //////////////// attack strucrtures 
        if (target == undefined)
        {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_INVADER_CORE || structure.structureType == STRUCTURE_TOWER);
                }
            });
            if (target == undefined)
            {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_TOWER);
                    }
                });
                if (target == undefined)
                {
                    target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_RAMPART);
                        }
                    });
                }
            }
        }
        //////////////// 
        var range = creep.pos.getRangeTo(target);
        if (range == 1)
        {
            creep.rangedMassAttack();
            creep.attack(target);
        }
        else if (range < 4)
        {
            if (creep.body.find(elem => elem.type === "heal") != undefined) // pre-heal
            {
                creep.heal(creep);
            }
            creep.rangedAttack(target);
        }
        else if (creep.body.find(elem => elem.type === "heal") != undefined && creep.hits < creep.hitsMax)
        {

            creep.heal(creep);

        }

        if (Healer != "a")
        {
            var range = creep.pos.getRangeTo(Healer);
            /////////////////////////////
            if ((range == 1 || Game.time % 5 != 0) && Healer.fatigue == 0)
            {
                creep.moveTo(target);
            }
            else
            {
                if (creep.room.name == Healer.room.name)
                {
                    creep.moveTo(Healer);
                    creep.say("come");
                }
            }

        }
        else
        {
            creep.moveTo(target);
        }

        ////////////////////////////
    },
    flagDismantle: function(creep, Healer, squadID)
    {

        var movetarg;
        creep.rangedMassAttack();
        var a = false;
        if (creep.body.find(elem => elem.type === "work") != undefined)
        {
            a = true;
        }

        var target = creep.pos.findInRange(FIND_STRUCTURES, 1,
        {
            filter: (res) =>
            {
                return (res.structureType != STRUCTURE_STORAGE && res.structureType != STRUCTURE_TERMINAL && res.structureType != STRUCTURE_STORAGE);
            }
        });

        var found = [];
        var flagsinrange = creep.pos.findClosestByPath(FIND_FLAGS);
        if (flagsinrange != undefined)
        {

            var found2 = flagsinrange.pos.findInRange(FIND_STRUCTURES, 1)

            if (flagsinrange.pos.x == creep.pos.x && flagsinrange.pos.x == creep.pos.x && flagsinrange.pos.y == creep.pos.y && flagsinrange.pos.y == creep.pos.y)
            {
                flagsinrange.remove();
            }
            else
            {
                movetarg = flagsinrange;
            }
            if (found2.length != 0)
            {
                found = creep.room.lookForAt(FIND_STRUCTURES, flagsinrange.pos);

                creep.room.visual.line(creep.pos, found.pos,
                {
                    color: 'red',
                    lineStyle: 'dashed'
                });

            }
        }
        if (target.length != 0 && a)
        {
            creep.dismantle(target[0]);
        }
        console.log("found", found);
        if (found.length != 0 && a)
        {
            if (creep.dismantle(found[0]) == ERR_NOT_IN_RANGE)
            {
                var findNewtarget = creep.moveTo(found[0]);
                movetarg = found[0];
                if (findNewtarget == -2)
                {
                    var target = creep.pos.findInRange(FIND_STRUCTURES, 1);
                    if (target.length != 0)
                    {
                        creep.dismantle(target[0]);
                    }
                }
            }
        }
        else if (target.length != 0 && a)
        {
            creep.dismantle(target[0]);
        }

        if (Healer != "a")
        {
            //   creep.say(Healer.hits == false)
            var range = creep.pos.getRangeTo(Healer);
            /////////////////////////////
            if ((range == 1) && Healer.fatigue == 0 || Game.time % 3 == 0)
            {
                creep.moveTo(movetarg);
            }

        }
        else
        {
            creep.moveTo(movetarg);
        }

        // only iff there is a VALID PATH TO MY CREEP iE NOT THOUGH A WALL

        var creepsNeedToFlee = this.decideToFlee(squadID);

        if (creepsNeedToFlee.length != 0)
        {

            var aaada = this.fleeDirection(squadID, creepsNeedToFlee, creep.id);

            //      creep.move(aaada);

        }

    }
}
module.exports = Duo;