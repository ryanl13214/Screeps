// if an attack is happening it is given prioruty if they are fufilled then the next stage is also done ie in a siege then we will also harrase the mining opperations if they exist .   
var squadmanage = require('squadManager');
var roompathfind = require('roompathfinder');
var defcon = {

    getDAMAGEpOTENTIAL: function(roomname)
    {

        var damagePotentialOfEnemysInROom = 0;
        var EnCreeps = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS,
        {
            filter: (res) =>
            {
                return (res.ticksToLive > 250);
            }
        });
        for (var j = 0; j < EnCreeps.length; j++)
        {
            for (var q = 0; q < EnCreeps[j].body.length; q++)
            {
                if (EnCreeps[j].body[q].type == RANGED_ATTACK)
                {

                    if (EnCreeps[j].body[q].boost == "XKHO2")
                    {
                        damagePotentialOfEnemysInROom += 40;
                    }
                    else
                    {
                        damagePotentialOfEnemysInROom += 10;
                    }

                }
                if (EnCreeps[j].body[q].type == ATTACK)
                {

                    if (EnCreeps[j].body[q].boost == "XUH2O")
                    {
                        damagePotentialOfEnemysInROom += 120;
                    }
                    else
                    {
                        damagePotentialOfEnemysInROom += 30;
                    }

                }
            }
        }

        return damagePotentialOfEnemysInROom
    },

    manageStarickRepairCreeps: function(roomname, creepsinroom)
    {

        var numberofpartsHARVESTER = Math.floor((Game.rooms[roomname].energyCapacityAvailable - 600) / 100);
        var fullbody = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY]
        if (numberofpartsHARVESTER > 38)
        {
            numberofpartsHARVESTER = 38;
        }
        for (let j = 0; j < numberofpartsHARVESTER; j++)
        {
            fullbody.push(WORK);
        }

        for (let q = 0; q < 5; q++)
        {

            var flagsMain = Game.flags[roomname + "Rep" + q]

            var tasklistarr = [
                ["boost", "XLH2O", numberofpartsHARVESTER],
                ["moveToflag", roomname + "Rep" + q],
                ["holdrepair"]
            ];

            if (flagsMain != undefined)
            {
                var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
                for (let i = 0; i < spawnss.length; i++)
                {
                    spawnss[i].spawnCreep(
                        fullbody, roomname + "Rep" + q,
                        {
                            memory:
                            {
                                role: 'multi',
                                memstruct:
                                {
                                    spawnRoom: roomname,
                                    tasklist: tasklistarr,
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

        }

    },
    detectCreepsAttackignBorderWall: function(roomname)
    {
        var target = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS);
        var mainflag = Game.flags[roomname];

        var CreepsAtRoomEdge = true;
        for (var i = 0; i < target.length; i++)
        {

            var pos2 = new RoomPosition(25, 25, roomname);
            var range = target[i].pos.getRangeTo(pos2);
            if (range < 24)
            {

                CreepsAtRoomEdge = false;

            }

        }

        return CreepsAtRoomEdge;

    },
    defendTheBorder: function(roomname)
    {

        this.spawnBasicedattacker(roomname, 2);
        // this.spawnBoostedarcher(roomname, 1);
    },

    unboostedManager: function(roomname)
    {
        var target = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS);

        if (target < 3)
        {
            this.spawnunboostedarcher(roomname, target.length * 3);

            return true
        }

        return false
    },
    spawnsolochaser: function(roomname, damagePotential)
    {
        var bodyparts = []
        var numberOfToughParts = Math.floor(damagePotential / 333) + 1
        if (numberOfToughParts > 14)
        {
            numberOfToughParts = 14
        }
        if (numberOfToughParts < 8)
        {
            numberOfToughParts = 8
        }
        var numberOfATTACKParts = 38 - numberOfToughParts
        for (let o = 0; o < numberOfToughParts; o++)
        {
            bodyparts.push(TOUGH)
        }
        bodyparts.push(RANGED_ATTACK)
        bodyparts.push(RANGED_ATTACK)
        for (let o = 0; o < numberOfATTACKParts; o++)
        {
            bodyparts.push(ATTACK)
        }
        for (let o = 0; o < 10; o++)
        {
            bodyparts.push(MOVE)
        }
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        for (let i = 0; i < spawnss.length; i++)
        {
            spawnss[i].spawnCreep(bodyparts,
            'solochaser' + roomname,
            {
                memory:
                {
                    role: 'guard',
                    attackrole: "solochaser",
                    memstruct:
                    {
                        spawnRoom: roomname,
                        tasklist: [
                            ["boosAllMax"],
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
    },
    solochaser: function(roomname)
    {
       
       

        if (roomname == "E25N1")
        {
            return false
        }

        var posa = new RoomPosition(25, 25, creep.room.name)

        var targetrange = posa.findClosestByRange(FIND_HOSTILE_CREEPS,
        {
            filter: (res) =>
            {
                return (res.body.length > 1);
            }
        });
        if (targetrange)
        {
            var range2 = targetrange.pos.getRangeTo(posa);

        }
        else
        {
            var range2 = 55;
        }

        var damagePotential = this.getDAMAGEpOTENTIAL(roomname)

        if (damagePotential < 4001 && range2 <= 23) // within tough terlerance and not at room edge
        {
            this.spawnsolochaser(roomname, damagePotential);
            return true
        }

        return false
    },

    run: function(roomname, creepsinroom)
    {
        var target = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS,
        {
            filter: (res) =>
            {
                return (res.body.length > 1);
            }
        });


        if (target.length != 0)// && Game.rooms[roomname].controller.safeMode == undefined)
        {

            ////////////////////////////////////////////////////////////////////////////////
            var targetswithattack = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS,
            {
                filter: (targ) =>
                {
                    return (

                        (targ.body.filter(x => x === "attack").length > 8)
                    );
                }
            });

            if (targetswithattack.length > 0)
            {
                this.spawnunboostedRanger(roomname, 4);
            }

            //////////////////////////////////////////////////////////////////////////////////////////

            var creepsAttackingRoomBorderWall = this.detectCreepsAttackignBorderWall(roomname); // add tick counter to prevent the creeps triggering this as soon as they ender 
            if (creepsAttackingRoomBorderWall == true)
            {
                this.defendTheBorder(roomname);
            }

            var unboostedManager = this.unboostedManager(roomname);
            if (unboostedManager == false)
            {
                var solochaser = this.solochaser(roomname);

                if (solochaser == false)
                {
                    this.spawnBoostedarcher(roomname, Math.floor(target.length / 2));
                }

            } // end of boosted creeps needed

        } // end of targets

    },
    CallForAid: function(roomname)
    {

        var roominrange = [];
        var roomsall = Object.keys(Game.rooms);
        var roomsobj = Game.rooms;
        for (var i = 0; i < roomsall.length; i++)
        {
            if (roomsobj[roomsall[i]].controller != undefined)
            {
                if (roomsobj[roomsall[i]].controller.owner != undefined)
                {
                    if (roomsobj[roomsall[i]].controller.owner.username === "Q13214" && roomsobj[roomsall[i]].controller.level == 8)
                    {
                        if (Game.map.getRoomLinearDistance(roomname, roomsall[i]) < 6 && Game.map.getRoomLinearDistance(roomname, roomsall[i]) != 0)
                        {
                            roominrange.push(roomsall[i]);
                        }
                    }
                }
            }
        }

        var target = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS);

        if (roominrange.length != 0 && target.length > 2)
        {

            var finalPath = [];

            var rawPath = roompathfind.run(roomname, roominrange[0], 0);
            for (var q = 0; q < rawPath.length; q++)
            {
                finalPath.push(["forcemoveToRoom", rawPath[q]])
            }

            finalPath.push(["killcreeps", roomname]);

            //console.log("listOfAvailableRooms", listOfAvailableRooms[i]);
            //console.log("ListOfsquads", ListOfsquads[i]);

            var bodyp1 = [];
            var bodyp2 = [];

            bodyp2 = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]

            if (Memory.squadObject["aid-" + roomname] == undefined)
            {

                Memory.empire.roomsobj[roominrange[0]].squadSpawning = "aid-" + roomname;
                Game.flags[roominrange[0]].memory.flagstruct.squadspawning == "aid-" + roomname
                squadmanage.initializeSquad("aid-" + roomname, finalPath, true, "quad", roominrange[0],
                {
                    "head1": bodyp2,

                    "tail1": bodyp2,

                    "head2": bodyp2,

                    "tail2": bodyp2

                }, "blinky");

            }

        }
        else
        {
            this.spawnBoostedarcher(roomname, 5);
        }

    },
    spawnBasicsquad: function(roomname)
    {
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        for (let i = 0; i < spawnss.length; i++)
        {
            spawnss[i].spawnCreep(
                [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], 'defenceduo' + roomname,
                {
                    memory:
                    {
                        role: 'guard',
                        attackrole: "chasedown",
                        memstruct:
                        {
                            spawnRoom: roomname,
                            tasklist: [
                                ["createslaveBOOST"],
                                ["boosAllMax"]
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
    },
    boostedBasicDefenders: function(roomname)
    {
        this.spawnBoostedattacker(roomname, 3);
        this.spawnBoostedarcher(roomname, 3);
    },
    spawnBoostedattacker: function(roomname, number)
    {
        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
        var numberofparts = Math.floor((energyavailable - 550) / 80);
        var bodyparts = [];
        if (numberofparts > 40)
        {
            numberofparts = 40;
        }
        for (let j = 0; j < numberofparts; j++)
        {
            bodyparts.push(ATTACK);
        }
        for (let j = 0; j < 10; j++)
        {
            bodyparts.push(MOVE);
        }
               var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
         
        for (let o = 0; o < 2; o++)
        {
          for (let i = 0; i < spawnss.length; i++)
            {
                spawnss[i].spawnCreep(bodyparts,
                'sword' + roomname + number,
                {
                    memory:
                    {
                        role: 'guard',
                        attackrole: "sword",
                        memstruct:
                        {
                            spawnRoom: roomname,
                            tasklist: [
                                ["boosAllMax"],
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
                
        }
    },
    spawnBasicedattacker: function(roomname, number)
    {
        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
        var numberofparts = Math.floor((energyavailable) / 130);
        var bodyparts = [];
        if (numberofparts > 25)
        {
            numberofparts = 25;
        }
        for (let j = 0; j < numberofparts; j++)
        {
            bodyparts.push(ATTACK);
            bodyparts.push(MOVE);
        }
   var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
         
        for (let o = 0; o < number; o++)
        {
            for (let i = 0; i < spawnss.length; i++)
            {
                spawnss[i].spawnCreep(bodyparts,
                    'sword' + roomname + number,
                    {
                        memory:
                        {
                            role: 'guard',
                            attackrole: "sword",
                            memstruct:
                            {
                                spawnRoom: roomname,
                                tasklist: [],
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
    spawnBoostedarcher: function(roomname, number)
    {
        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
        var numberofparts = Math.floor((energyavailable - 650) / 150);
        var bodyparts = [];
        if (numberofparts > 40)
        {
            numberofparts = 40;
        }
        for (let j = 0; j < numberofparts; j++)
        {
            bodyparts.push(RANGED_ATTACK);
        }
        for (let j = 0; j < 10; j++)
        {
            bodyparts.push(MOVE);
        }
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        for (let i = 0; i < spawnss.length; i++)
        {
            for (let o = 0; o < number; o++)
            {
                 spawnss[i].spawnCreep(bodyparts,
                    'archer' + roomname + o,
                    {
                        memory:
                        {
                            role: 'guard',
                            attackrole: "archer",
                            memstruct:
                            {
                                spawnRoom: roomname,
                                tasklist: [
                                    ["boosAllMax"],
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
        }

    },
    spawnunboostedarcher: function(roomname, number)
    {
        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
        var numberofparts = Math.floor((energyavailable) / 250);
        var bodyparts = [];
        if (numberofparts > 25)
        {
            numberofparts = 25;
        }
        for (let j = 0; j < numberofparts; j++)
        {
            bodyparts.push(RANGED_ATTACK);
        }
        for (let j = 0; j < numberofparts; j++)
        {
            bodyparts.push(MOVE);
        }
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        for (let i = 0; i < spawnss.length; i++)
        {
            for (let o = 0; o < number; o++)
            {
                var q = spawnss[i].spawnCreep(bodyparts,
                    'archeru' + roomname + o,
                    {
                        memory:
                        {
                            role: 'guard',
                            attackrole: "archer",
                            memstruct:
                            {
                                spawnRoom: roomname,
                                tasklist: [],
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

    spawnunboostedRanger: function(roomname, number)
    {
        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
        var numberofparts = Math.floor((energyavailable) / 200);
        var bodyparts = [];
        if (numberofparts > 25)
        {
            numberofparts = 25;
        }
        for (let j = 0; j < numberofparts; j++)
        {
            bodyparts.push(RANGED_ATTACK);
        }
        for (let j = 0; j < numberofparts; j++)
        {
            bodyparts.push(MOVE);
        }
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        for (let i = 0; i < spawnss.length; i++)
        {
            for (let o = 0; o < number; o++)
            {
                var q = spawnss[i].spawnCreep(bodyparts,
                    'archeru' + roomname + o,
                    {
                        memory:
                        {
                            role: 'guard',
                            attackrole: "ranger",
                            memstruct:
                            {
                                spawnRoom: roomname,
                                tasklist: [],
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

    }

}
module.exports = defcon;