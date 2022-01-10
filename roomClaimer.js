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



 
        //  var pathacc = roompathfind.run(attackID, ownedrooms[i], 0); // 0 means allow through hostile rooms

        var roomss = this.selectRooms(roomID);
        //   console.log("roomss".roomss);
        var storeage = Game.rooms[roomID].storage;
        if (roomss.length != 0 && storeage == undefined)
        {
            var templeflag = Game.flags["temple" + roomID]
            if (Game.rooms[roomID].terminal == undefined || templeflag == undefined)
            {
                this.sendClaimSquad(roomID, roomss[0]);
            }
            else
            {
                this.sendClaimSquad(roomID, roomss[0]);
                this.sendTempleSquad(roomID, roomss[0]);
                this.manageTempleEnergy(roomID)
            }

        }
     var doretos = Game.rooms[roomID].find (FIND_HOSTILE_CREEPS ,
        {
            filter: (s) =>
            {
                return (s.body.length == 50);// contans attack parts
            }
        });


if(doretos.length != 0 ){
    
    
    if(doretos.length > 1)
    {
        
        
        
        
               var finalPath = [];

                var deathBlinker = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK] 
                var rawPath = roompathfind.run(roomID,roomss[0], 0);
                for (var q = 0; q < rawPath.length; q++)
                {
                    finalPath.push(["forcemoveToRoom", rawPath[q]])
                }
        for(var O = 0; O < 0; O++)
        {
        
        
          Game.spawns[roomss[0]].spawnCreep(deathBlinker,
                    'archer'  + O,
                    {
                        memory:
                        {
                            role: 'guard',
                            attackrole: "archer",
                            memstruct:
                            {
                                spawnRoom:  roomss[0],
                                tasklist: finalPath,
                                objectIDStorage: "",
                                boosted: false,
                                moveToRenew: false,
                                opportuniticRenew: false,
                                hastask: false
                            }
                        }
                    });
        
        
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
           var squadname = "TempleGuard"

            if (Memory.squadObject[squadname] == undefined && roomss.length  != 0 && 1==2)
            {

                var finalPath = [];

                var deathBlinker = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]

                var rawPath = roompathfind.run(roomID,roomss[0], 0);
                for (var q = 0; q < rawPath.length; q++)
                {
                    finalPath.push(["forcemoveToRoom", rawPath[q]])
                }
                finalPath.push(["killcreeps",roomID]);

                squadmanage.initializeSquad(squadname, finalPath, true, "quad", roomss[0],
                {
                    "head1": deathBlinker,
                    "tail1": deathBlinker,
                    "head2": deathBlinker,
                    "tail2": deathBlinker
                }, "blinky");

            }
        
        
        
        
        
        
        
        
        
        
    }
    
    
    
    
    
    
    
    
    
    
    
   var towers = Game.rooms[roomID].find(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return (s.structureType == STRUCTURE_TOWER);
            }
        });
  for(var i = 0; i < towers.length; i++)
        {
            var target ;
            var hp= 99999;
             for(var q = 0; q < doretos.length; q++)
            {
                if(doretos[q].hits <hp )
                {
                    hp = doretos.hits
                    target = doretos[q]
                }
            }
            
          if(target != undefined) // make limiter to ensure tower draining doesnt work 
            {
                towers[i].attack(target);
            }
       
             
        }



}else{









        tower.run(roomname, 99590000);
}
        var storeage = Game.rooms[roomID].storage;

        if (Game.rooms[roomID].controller.level == 8)
        {
            delete Memory.claimManager[roomID];
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

        Game.spawns[HomeRoom].spawnCreep([MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
            targetRoom + 'heal',
            {
                memory:
                {
                    role: 'mover',
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
        /*         */

        if (Memory.squadObject['Gondor Calls For Aid-E28N5'] == undefined && 1==2)
        {
            var finalPath = [];
            var rawPath = roompathfind.run("E33N8", "E28N5", 0);
            for (var q = 0; q < rawPath.length; q++)
            {
                finalPath.push(["forcemoveToRoom", rawPath[q]])
            }
            finalPath.push(["guardRoom", "E33N8"]);
            var targroom = "E33N8"
            var bodypartshead = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
            var bodypartstail = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]

            squadmanage.initializeSquad('Gondor Calls For Aid-E28N5',
                finalPath, true, "duo", "E28N5",
                {
                    "head": bodypartshead,
                    "tail": bodypartstail,
                }, "chasedown");
        }

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

}
module.exports = roomClaimer;