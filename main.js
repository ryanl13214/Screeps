var squadmanage = require('squadManager');
var attackManager = require('attackManager');
var claimManager = require('roomClaimer');
var visuals = require('visuals');
var powerManager = require('powercreepManager');
var tickcode = require('tickcode');
var roles = require('roles');
var roomController = require('roomController');
var roomControllerBotArena = require('roomControllerBotArena');
var roomControllerOutrider = require('roomControllerOutrider');
var OutriderManager = require('Outrider.manager');
var debug = false;

module.exports.loop = function()
{

    if (Memory.empire == undefined)
    {
        Memory.empire = {
            roomsobj:
            {}
        }
    }
    if (Memory.hostileempires == undefined)
    {
        Memory.hostileempires = {}

    }
    if (Memory.roomlist == undefined)
    {
        Memory.roomlist = {};
    }

    var roomsall = Object.keys(Game.rooms);
    if (roomsall.length == 1 && Game.rooms[roomsall[0]].controller.safeMode > 19990)
    {
        Memory.roomlist = {};
    }

    var ownedrooms = [];

    var roomsobj = Game.rooms;
    for (var i = 0; i < roomsall.length; i++)
    {

        if (roomsobj[roomsall[i]].controller != undefined)
        {
            if (roomsobj[roomsall[i]].controller.owner != undefined)
            {
                if ((roomsobj[roomsall[i]]).controller.owner.username === "Q13214" && (roomsobj[roomsall[i]]).controller.level > 0)
                {

                    ownedrooms.push(roomsall[i]);
                }
            }
        }
    }

    var roomsall2 = Object.keys(Memory.empire.roomsobj);

    for (var i = 0; i < roomsall2.length; i++)
    {
        var roomobj = Game.rooms[roomsall2[i]];

        if (!roomobj || !roomobj.controller || !roomobj.controller.owner || roomobj.controller.owner.username !== "Q13214")
        {
            console.log("deleting room from memory-", roomsall2[i]);
            delete Memory.empire.roomsobj[roomsall2[i]]
        }
    }

    OutriderManager.run();

    var mainstartCpu = Game.cpu.getUsed();
    var gametime = Game.time;
    //------------------------------------------------------------------------------------------------
    //                                  
    //------------------------------------------------------------------------------------------------
    var startCpu = Game.cpu.getUsed();
    var powerCreepList = Game.powerCreeps;
    var listnumbers = Object.keys(powerCreepList);
    var listvalues = Object.values(powerCreepList);
    for (var i = 0; i < listnumbers.length; i++)
    {
        try
        {
            powerManager.run(listvalues[i]);
        }
        catch (e)
        {}
    }
    var powerManager_cpu_used = Game.cpu.getUsed() - startCpu;
    if (debug)
    {
        Memory.cpuUsage.powercreeps += powerManager_cpu_used;
    }
    //------------------------------------------------------------------------------------------------//////////////////////////////
    //             
    // console.log(Game.market.credits*0.00000005);
    //------------------------------------------------------------------------------------------------
    tickcode.run();

    visuals.run();

    //------------------------------------------------------------------------------------------------
    //                                  
    //------------------------------------------------------------------------------------------------
    if (gametime % 1000 == 0)
    {
        for (const id in Game.market.orders)
        {
            if (Game.market.orders[id].remainingAmount == 0)
            {
                Game.market.cancelOrder(id);
            }
        }
    }

    //------------------------------------------------------------------------------------------------
    //                                  
    //------------------------------------------------------------------------------------------------
    if (Game.cpu.bucket == 10000)
    {
        try
        {
            //  Game.cpu.generatePixel()
        }
        catch (e)
        {}
    }
    //------------------------------------------------------------------------------------------------
    //                          deleting memory
    //------------------------------------------------------------------------------------------------
    if (gametime % 10 == 0)
    {
        for (var name in Memory.creeps)
        {
            if (!Game.creeps[name])
            {
                delete Memory.creeps[name];
            }
        }
        for (var name in Memory.powerCreeps)
        {
            if (!Game.powerCreeps[name])
            {
                delete Memory.powerCreeps[name];
            }
        }
        for (var name in Memory.flags)
        {
            if (!Game.flags[name])
            {
                delete Memory.flags[name];
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                        SQUAD MANAGER
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var startCpu = Game.cpu.getUsed();
    var squads = Memory.squadObject;
    if (squads == undefined)
    {
        Memory.squadObject = {};
        squads = {};
    }
    var resourcevalues = Object.values(squads);
    var resourcekeys = Object.keys(squads);
    for (var i = 0; i < resourcekeys.length; i++)
    {
        squadmanage.run(resourcekeys[i]);
    }
    var squads_cpu_used = Game.cpu.getUsed() - startCpu;
    if (debug)
    {
        Memory.cpuUsage.squads += squads_cpu_used;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                        attack MANAGER
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var startCpu = Game.cpu.getUsed();
    var attacks = Memory.attackManager;
    if (attacks == undefined)
    {
        Memory.attackManager = {};
        attacks = {};
    }
    var resourcevalues = Object.values(attacks);
    var resourcekeys = Object.keys(attacks);
    for (var i = 0; i < resourcekeys.length; i++)
    {
        //      attackManager.run(resourcekeys[i]);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                        claim MANAGER
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var startCpu = Game.cpu.getUsed();
    var claims = Memory.claimManager;
    if (claims == undefined)
    {
        Memory.claimManager = {};
        claims = {};
    }
    var resourcevalues = Object.values(claims);
    var claimsys = Object.keys(claims);
    for (var i = 0; i < claimsys.length; i++)
    {
        claimManager.run(claimsys[i]);
    }
    //------------------------------------------------------------------------------------------------
    //                    START OF ROOMS LOOP
    //------------------------------------------------------------------------------------------------
    for (var i = 0; i < ownedrooms.length; i++)
    {
        var roomobj = Game.rooms[ownedrooms[i]];

        if (!roomobj || !roomobj.controller || !roomobj.controller.owner || roomobj.controller.owner.username !== "Q13214")
        {
            console.log("deleting room from memory-", ownedrooms[i]);
            delete Memory.empire.roomsobj[ownedrooms[i]]
        }

        if (Game.rooms[ownedrooms[i]].controller.level <= 4  && Game.spawns["OR" + ownedrooms[i]] != undefined)
        {

            new RoomVisual(ownedrooms[i]).text("roomtype - Outrider", 23, 1,
            {
                color: 'green',
                font: 0.8,
                align: 'centre'
            });
            roomControllerOutrider.run(ownedrooms[i]);
        }
        else if (Game.rooms[ownedrooms[i]].controller.level <= 4 && Game.spawns[ownedrooms[i]] != undefined)
        {
            new RoomVisual(ownedrooms[i]).text("roomtype - BA", 23, 1,
            {
                color: 'green',
                font: 0.8,
                align: 'centre'
            });
            roomControllerBotArena.run(ownedrooms[i]);
        }
        else if (claimsys.indexOf(ownedrooms[i]) == -1)
        {
            new RoomVisual(ownedrooms[i]).text("roomtype - STD", 23, 1,
            {
                color: 'green',
                font: 0.8,
                align: 'centre'
            });
            roomController.run(ownedrooms[i]);
        }

    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    

}