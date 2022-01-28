var roompathfind = require('roompathfinder');
var squadmanage = require('squadManager');
var roles = require('roles');
var tower = require('tower');
var roomClaimer = {
    run: function(roomID)
    {
        var roomname = roomID
        var creepsInRoom = _.filter(Game.creeps, (creep) => (creep.memory.memstruct != undefined && creep.memory.memstruct.spawnRoom === roomname));
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            roles
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
        roles.run(creepsInRoom);
        for (var O = 0; O < creepsInRoom.length; O++)
        {
            if (creepsInRoom[O].room.name != roomID && (creepsInRoom[O].memory.memstruct.tasklist.length == 0 || (creepsInRoom[O].memory.memstruct.tasklist[0][0] != "forcemoveToRoom" && creepsInRoom[O].memory.memstruct.tasklist[0][0] != "boost")))
            {
                creepsInRoom[O].moveTo(new RoomPosition(25, 25, roomID))
            }

        }

        var roomss = this.selectRooms(roomID);

        var spawingingroom = Game.rooms[roomss[0]];


        if (roomss.length != 0 && Game.rooms[roomID] == undefined)
        {
            this.sendClaimSquad(roomID, roomss[0]);
            return 0
        }
        if (roomss.length == 0 || Game.rooms[roomID] == undefined)
        {

            return 0
        }

        var storeage = Game.rooms[roomID].storage;




/////////////////////////////// deal with hostiles /////////////////////////////////////////////////////////////////////////




        var hostilesInHomeRoom =spawingingroom.find(FIND_HOSTILE_CREEPS,
        {
            filter: (s) =>
            {
                return (s.body.length == 50); // contans attack parts
            }
        });
        
        if (hostilesInHomeRoom.length != 0)
        {
           return 0;
        }
        
        var doretos = Game.rooms[roomID].find(FIND_HOSTILE_CREEPS,
        {
            filter: (s) =>
            {
                return (s.body.length == 50); // contans attack parts
            }
        });

        if (doretos.length != 0)
        {
            this.creepsFleeHostiles(creepsInRoom,roomname)
       //     this.controlReinforcements(roomID, roomss[0]);
            
        }

        ///////////////////////////////         SPAWNING              ///////////////////////////////////////
        if (roomss.length != 0 && storeage == undefined && (doretos.length == 0 || Game.rooms[roomID].controller.safeMode != undefined))
        {

            if (Game.rooms[roomID].controller.level >= 5)
            {
                this.renewSafemodes(roomss[0], roomID)
            }

            var templeflag = Game.flags["temple" + roomID]
            if (Game.rooms[roomID].terminal == undefined || templeflag == undefined)// standard claiming withj group 200k per day
            {

                this.sendClaimSquad(roomID, roomss[0]);

            }
            else // standard temple
            {

                this.sendClaimSquad(roomID, roomss[0]);

                this.sendTempleSquad(roomID, roomss[0]);
                this.manageTempleEnergy(roomID)
            }

        }
        else if (roomss.length != 0 && (doretos.length == 0 || Game.rooms[roomID].controller.safeMode != undefined) && storeage != undefined) // storage temple
        {
            this.sendClaimSquad(roomID, roomss[0]);
            this.sendTempleSquad(roomID, roomss[0]);
            this.sendChainOfMovers(roomID, roomss[0]);
        }
        ///////////////////////////////         towers              ///////////////////////////////////////
        if (doretos.length != 0)
        {

            var towers = Game.rooms[roomID].find(FIND_STRUCTURES,
            {
                filter: (s) =>
                {
                    return (s.structureType == STRUCTURE_TOWER);
                }
            });
            for (var i = 0; i < towers.length; i++)
            {
                var target;
                var hp = 99999;
                for (var q = 0; q < doretos.length; q++)
                {
                    if (doretos[q].hits < hp)
                    {
                        hp = doretos.hits
                        target = doretos[q]
                    }
                }

                if (target != undefined) // make limiter to ensure tower draining doesnt work 
                {
                    towers[i].attack(target);
                }

            }

        }
        else
        {

            tower.run(roomname, 99590000);
        }
        var storeage = Game.rooms[roomID].storage;

        /////////////////           end cases 
        if (Game.rooms[roomID].controller.level == 8)
        {
            delete Memory.claimManager[roomID];
        }

    },
    combatMove: function(creep, avoidarray) // check if creep has damage parts
    {
        let goals = _.map(avoidarray, function(host)
        {
            return {
                pos: host.pos,
                range: 10
            };
        });
        let patha = PathFinder.search(creep.pos, goals,
        {
            flee: true
        }).path;
        creep.moveByPath(patha);
    },
    creepsFleeHostiles: function(creepsInRoom,roomname)
    {

        for (var q = 0; q < creepsInRoom.length; q++)
        {

            var CloseHostiles = creepsInRoom[q].pos.findInRange(FIND_HOSTILE_CREEPS, 6);

            if (creepsInRoom[q].memory.attackrole != "guard" && roomname == creep.room.name)
            {
                this.combatMove(creepsInRoom[q], CloseHostiles);
            }

        }

    },
    renewSafemodes: function(homeRoom, targRoom)
    {
        if (Game.rooms[homeRoom].controller.safeModeAvailable == 0)
        {

            var finalPath = [];
            finalPath.push(["boosAllMax"])
            finalPath.push(["withdraw", "terminal", "G", 3000])
            var rawPath = roompathfind.run(targRoom, homeRoom, 0);

            for (var q = 0; q < rawPath.length; q++)
            {
                finalPath.push(["forcemoveToRoom", rawPath[q]])
            }
            finalPath.push(["renewsafemode"]);
            finalPath.push(["renewsafemode"]);
            finalPath.push(["renewsafemode"]);

            Game.spawns[homeRoom].spawnCreep([TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                targRoom + 'safeRenew',
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: homeRoom,
                            tasklist: finalPath,
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
    sendChainOfMovers: function(roomID, homeroom)
    {

        var creepsInRoom = _.filter(Game.creeps, (creep) => (creep.memory.memstruct != undefined && creep.memory.memstruct.spawnRoom === homeroom && creep.memory.role == "mover"));
        if (creepsInRoom.length < 15)
        {
            var spawnss = Game.rooms[homeroom].find(FIND_STRUCTURES,
            {
                filter: (s) =>
                {
                    return (s.structureType == STRUCTURE_SPAWN);
                }
            });

            var bodyparts = [];
            var numberofparts = Math.floor(Game.rooms[homeroom].energyCapacityAvailable / 100);
            if (numberofparts * 2 > 50)
            {
                numberofparts = Math.floor(50 / 2);
            }
            var bodyparts = [];
            for (let q = 0; q < numberofparts; q++)
            {
                bodyparts.push(CARRY);
                bodyparts.push(MOVE);
            }
            for (let q = 0; q < 15; q++)
            {
                for (let i = 0; i < spawnss.length; i++)
                {
                    spawnss[i].spawnCreep(bodyparts, 'mover' + homeroom + q,
                    {
                        memory:
                        {
                            role: 'mover',
                            cpuUsed: 0,
                            roomtarg: homeroom,

                            full: false,
                            memstruct:
                            {
                                spawnRoom: homeroom,
                                tasklist: [],
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

        for (var O = 0; O < creepsInRoom.length; O++)
        {
            if (creepsInRoom[O].memory.memstruct.tasklist.length == 0)
            {

                creepsInRoom[O].memory.memstruct.tasklist.push(["deposit"]);
                creepsInRoom[O].memory.memstruct.tasklist.push(["withdraw", Game.rooms[homeroom].storage.id, "energy", creepsInRoom[O].store.getCapacity()]);
                creepsInRoom[O].memory.memstruct.tasklist.push(["moveToRoom", roomID]);
                creepsInRoom[O].memory.memstruct.tasklist.push(["transfer", Game.rooms[roomID].storage.id, "energy"]);
                creepsInRoom[O].memory.memstruct.tasklist.push(["moveToRoom", homeroom]);

            }

        }

    },
    manageTempleEnergy: function(roomID)
    {

        var roomname = roomID;

        var roomOrders = [];
        for (const id in Game.market.orders)
        {
            if (Game.market.orders[id].roomName == roomname && Game.market.orders[id].resourceType == RESOURCE_ENERGY)
            {
                roomOrders.push(Game.market.orders[id]);
            }

        }
        ////////////////////////////////////////////////////////// BUY ENERGY ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var q = 0;
        for (const id in Game.market.orders)
        {
            if (Game.market.orders[id].remainingAmount == 0)
            {
                Game.market.cancelOrder(id);
            }
            q++;
        }

        var hist = Game.market.getHistory("energy");
        var tmp = 0;
        var totalPrice = 0;
        for (let object of hist)
        {
            //   console.log(JSON.stringify(object));   
            totalPrice += object.avgPrice;
            tmp++;
        }
        let avgPriceOfenergy = totalPrice / tmp;

        if (avgPriceOfenergy > 9)
        {

        }
        else if (Game.rooms[roomname].terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 100000 && roomOrders.length < 3)
        {

            if (avgPriceOfenergy * 1.5 < 9)
            {
                Game.market.createOrder(
                {
                    type: ORDER_BUY,
                    resourceType: RESOURCE_ENERGY,
                    price: (avgPriceOfenergy * 1.7),
                    totalAmount: 175000,
                    roomName: roomname
                });
            }
            else
            {
                Game.market.createOrder(
                {
                    type: ORDER_BUY,
                    resourceType: RESOURCE_ENERGY,
                    price: 9,
                    totalAmount: 175000,
                    roomName: roomname
                });
            }
        }
        else if (Game.rooms[roomname].terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 100000 && roomOrders.length > 2) // keep the cost updated
        {
            var hist = Game.market.getHistory(RESOURCE_ENERGY)
            for (var i = 0; i < roomOrders.length; i++)
            {
                Game.market.changeOrderPrice(roomOrders[i].id, (avgPriceOfenergy * 1.5));
            }
        }

    },
    sendTempleSquad: function(targetRoom, HomeRoom)
    {
        var rawPath = roompathfind.run(targetRoom, HomeRoom, 5);
        var PathUps = [

        ];

        var pathBuild = [

        ];
        pathBuild.push(["boost", "XZHO2", 10])
        PathUps.push(["boost", "XGH2O", 35]);
        PathUps.push(["boost", "XZHO2", 10])
        for (var q = 0; q < rawPath.length; q++)
        {
            PathUps.push(["forcemoveToRoom", rawPath[q]])
            pathBuild.push(["forcemoveToRoom", rawPath[q]])
        }

        if (PathUps.length == 0)
        {
            return 0;
        }

        PathUps.push(["forcemoveToRoom", targetRoom])
        pathBuild.push(["forcemoveToRoom", targetRoom])

        PathUps.push(["templeUP", targetRoom])
        PathUps.push(["templeBuild", targetRoom])

        Game.spawns[HomeRoom].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY],
            targetRoom + 'repair-temple',
            {
                memory:
                {
                    role: 'repair',
                    memstruct:
                    {
                        spawnRoom: targetRoom,
                        tasklist: pathBuild,
                        objectIDStorage: "",
                        boosted: false,
                        moveToRenew: false,
                        opportuniticRenew: true,
                        hastask: false
                    }
                }
            });

        for (var c = 0; c < 4; c++)
        {
            Game.spawns[HomeRoom].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY],
                targetRoom + 'up-temple-' + c,
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: targetRoom,
                            tasklist: PathUps,
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
    selectRooms: function(roomID)
    {
        var ownedrooms = [];
        var roomsa = [];
        if (Memory.empire != undefined && Memory.empire.roomsobj != undefined)
        {
            ownedrooms = Object.keys(Memory.empire.roomsobj);
        }

        var returnList = [];
        var counter = 99;
        for (var i = 0; i < ownedrooms.length; i++)
        {
            if (Game.map.getRoomLinearDistance(roomID, ownedrooms[i]) < counter && Game.map.getRoomLinearDistance(roomID, ownedrooms[i]) > 0) // check that room has good amount of boosts
            {
                counter = Game.map.getRoomLinearDistance(roomID, ownedrooms[i]);
                returnList = [];
                returnList.push(ownedrooms[i]);

            }
        }

        return returnList
    },
    sendClaimSquad: function(targetRoom, HomeRoom)
    {
        var rawPath = roompathfind.run(targetRoom, HomeRoom, 5);
        var Path = [

        ];

        var path2 = [

        ];
        for (var q = 0; q < rawPath.length; q++)
        {
            Path.push(["forcemoveToRoom", rawPath[q]])
            path2.push(["forcemoveToRoom", rawPath[q]])
        }

        if (Path.length == 0)
        {
            return 0;
        }

        Path.push(["forcemoveToRoom", targetRoom])
        path2.push(["forcemoveToRoom", targetRoom])

        for (var c = 0; c < 2; c++)
        {
            Game.spawns[HomeRoom].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
                targetRoom + 'repair-' + c,
                {
                    memory:
                    {
                        role: 'repair',
                        memstruct:
                        {
                            spawnRoom: targetRoom,
                            tasklist: path2,
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: true,
                            hastask: false
                        }
                    }
                });
        }
        var temp = Path

        temp.push(["harvest"])
        temp.push(["buildconsites"])
        temp.push(["fillTowers"])

        temp.push(["upgrade"])

        temp.push(["repeat", 4])

        for (var c = 0; c < 4; c++)
        {
            Game.spawns[HomeRoom].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
                targetRoom + 'up' + c,
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: targetRoom,
                            tasklist: temp,
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: true,
                            hastask: false
                        }
                    }
                });
        }

        Game.spawns[HomeRoom].spawnCreep([MOVE, HEAL],
            targetRoom + 'heal',
            {
                memory:
                {
                    role: 'guard',
                    attackrole: "healer",
                    memstruct:
                    {
                        spawnRoom: targetRoom,
                        tasklist: path2,
                        objectIDStorage: "",
                        boosted: false,
                        moveToRenew: false,
                        opportuniticRenew: true,
                        hastask: false
                    }
                }
            });

        if (Game.rooms[targetRoom] == undefined)
        {

            path2.push(["claim"]);
            Game.spawns[HomeRoom].spawnCreep([MOVE, MOVE, MOVE, MOVE, CLAIM],
                'claimer',
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: HomeRoom,
                            tasklist: path2,
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: true,
                            hastask: false
                        }
                    }
                });
        }
        else

        if (Game.rooms[targetRoom].controller.level > 0)
        {

        }
        else
        {

            path2.push(["claim"]);
            Game.spawns[HomeRoom].spawnCreep([MOVE, MOVE, MOVE, MOVE, CLAIM],
                'claimer',
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: HomeRoom,
                            tasklist: path2,
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
    controlReinforcements: function(targetRoom, HomeRoom)
    {
        
        return 0
        
    var spawingingroom = Game.rooms[targetRoom];


        var hostilestargetRoom =spawingingroom.find(FIND_HOSTILE_CREEPS,
        {
            filter: (s) =>
            {
                return (s.body.length == 50); // contans attack parts
            }
        });
        
        if(hostilestargetRoom.length > 2)
        {
        if (Memory.squadObject['quad-Aid-'+targetRoom] == undefined  )
        {
            var finalPath = [];
            var rawPath = roompathfind.run(targetRoom, HomeRoom, 0);
            for (var q = 0; q < rawPath.length; q++)
            {
                finalPath.push(["forcemoveToRoom", rawPath[q]])
            }
            finalPath.push(["killcreeps", targetRoom]);
          
            var bodypartshead = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL]
            var bodypartstail = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL]

              
                 
                 
                 
                    squadmanage.initializeSquad('quad-Aid-'+targetRoom, finalPath, true, "quad", HomeRoom,
                    {
                        "head1": bodypartshead,
                        "tail1": bodypartstail,
                        "head2": bodypartshead,
                        "tail2": bodypartstail
                    }, "blinky");




        }
        }else{
        
        
        
        
        
        
        if (Memory.squadObject['duo-Aid-'+targetRoom] == undefined  )
        {
            var finalPath = [];
            var rawPath = roompathfind.run(targetRoom, HomeRoom, 0);
            for (var q = 0; q < rawPath.length; q++)
            {
                finalPath.push(["forcemoveToRoom", rawPath[q]])
            }
            finalPath.push(["guardRoom", targetRoom]);
          
            var bodypartshead = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
            var bodypartstail = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]

            squadmanage.initializeSquad('duo-Aid-'+targetRoom,
                finalPath, true, "duo", HomeRoom,
                {
                    "head": bodypartshead,
                    "tail": bodypartstail,
                }, "chasedown");
        }
        }
        
        
        
    }

}
module.exports = roomClaimer;