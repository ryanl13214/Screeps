var roles = require('roles');
var spawnmain = require('spawn');
var buildbase = require('buildbase');
var tower = require('tower');
var defcon = require('defcon');
var terminalManager = require('terminal');
var linkManager = require('links');
var ownedrooms = ["E24N3"];
var squadmanage = require('squadManager');
var storecpu = 0;
var ticks = 0;
module.exports.loop = function()
{
    var mainstartCpu = Game.cpu.getUsed();
    var gametime = Game.time;
    //------------------------------------------------------------------------------------------------
    //                                    ROLES
    //------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------
    //                          deleting memory
    //------------------------------------------------------------------------------------------------
    if (gametime % 1000 ==0)
    {
        for (var name in Memory.creeps)
        {
            if (!Game.creeps[name])
            {
                delete Memory.creeps[name];
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
    //------------------------------------------------------------------------------------------------
    if (Game.cpu.bucket > 9000)
    {
        Game.cpu.generatePixel()
    }
    ///////////////////////////////////////////////
    var testingsquads = Memory.squadObject;
    if (testingsquads == undefined)
    {
        Memory.squadObject = {};
    }
    const resourcevalues = Object.values(testingsquads);
    const resourcekeys = Object.keys(testingsquads);
    if (resourcekeys.length == 0)
    {
        squadmanage.initializeSquad("squadID", [], false, "test", "W16S52",
        {
            "heal1": [MOVE],
            "heal2": [MOVE],
            "attack1": [MOVE]
        });
    }
    for (var i = 0; i < resourcekeys.length; i++)
    {
        //squadmanage.run(resourcekeys[0]);
    }
    //------------------------------------------------------------------------------------------------
    //                    flag reset
    //------------------------------------------------------------------------------------------------
    if (false)
    {
        var allflags = Game.flags;
        console.log(JSON.stringify(allflags));
        const flagvalues = Object.values(allflags);
        const flagkeys = Object.keys(allflags);
        for (var v = 0; v < flagkeys.length; v++)
        {
            if (flagvalues[v].pos.roomName != ownedrooms[0])
            {
                Game.flags[flagkeys[v]].remove();
            }
        }
    }
    //------------------------------------------------------------------------------------------------
    //                    START OF ROOMS LOOP
    //------------------------------------------------------------------------------------------------
    for (var i = 0; i < ownedrooms.length; i++)
    {
        var roomname = ownedrooms[i];
        var mainflag = Game.flags[roomname];
        if (mainflag == undefined)
        {
            var flagstruct = {
                roomissafe: false,
                roomsuitableforClaiming: false,
                numberOfSourcesInRoom: 0,
                roomisSuitableForMainRoomMining: false,
                roomIsFightTeritory: false,
                roomIsMyTeritory: false,
                distancefromoom: 9999,
                claimedroomstuct:
                {
                    MineRooms: [],
                    mineroomsProfitmargin: [],
                    cpuUsedlastTick: 99,
                    roomdefconstruct:
                    {}
                }
            };
            var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
            console.log(spawnss);
            Game.rooms[roomname].createFlag(spawnss[0].pos.x - 2, spawnss[0].pos.y, roomname);
            var mainflags = Game.flags[roomname];
            mainflags.memory.flagstruct = flagstruct;
        }
        var creepsInRoom = _.filter(Game.creeps, (creep) => creep.memory.memstruct.spawnRoom === ownedrooms[i]);
        var startCpu = Game.cpu.getUsed();
        roles.run(creepsInRoom);
        var roles_cpu_used = +Game.cpu.getUsed() - startCpu;
        var roomExits = [0, 0, 0, 0];
        roomExits[0] = Game.rooms[roomname].find(FIND_EXIT_TOP);
        roomExits[1] = Game.rooms[roomname].find(FIND_EXIT_RIGHT);
        roomExits[2] = Game.rooms[roomname].find(FIND_EXIT_BOTTOM);
        roomExits[3] = Game.rooms[roomname].find(FIND_EXIT_LEFT);
        Game.map.visual.circle(new RoomPosition(25, 25, roomname), 500);
        var storagevalue = 0;
        var defconlevel;
        if (Game.rooms[roomname].storage != undefined)
        {
            storagevalue = Game.rooms[roomname].storage.store.energy;
        }
        var startCpu = Game.cpu.getUsed();
        defconlevel = defcon.run(roomname);
        var defcon_cpu_used = +Game.cpu.getUsed() - startCpu;
        if (Game.time % 4 == 0)
        {
            var startCpu = Game.cpu.getUsed();
            spawnmain.run(roomname, defconlevel, storagevalue, roomExits, creepsInRoom);
            var spawnmain_cpu_used = +Game.cpu.getUsed() - startCpu;
        }
        if (Game.time % 1000 == 0)
        {
            var startCpu = Game.cpu.getUsed();
            buildbase.run(roomname, mainflag.pos.x, mainflag.pos.y); /////////////////////////////////////////////////////////////////
            var buildbase_cpu_used = +Game.cpu.getUsed() - startCpu;
        }
        var startCpu = Game.cpu.getUsed();
        tower.run(roomname);
        var tower_cpu_used = +Game.cpu.getUsed() - startCpu;
        if (Game.time % 100 == 0 || (storagevalue < 10000 && Game.rooms[roomname].terminal != undefined))
        {
            //markets here
            var startCpu = Game.cpu.getUsed();
            //  terminalManager.run(roomname,Game.rooms[roomname].terminal,defconlevel,storagevalue); 
            var Terminal_cpu_used = +Game.cpu.getUsed() - startCpu;
        }
        var startCpu = Game.cpu.getUsed();
        linkManager.run(roomname, 25, 13);
        var Link_cpu_used = +Game.cpu.getUsed() - startCpu;
        //labs here
        //}catch(e){}
    } //end of rooms loop 
    var all_cpu_used = +Game.cpu.getUsed() - mainstartCpu;
    ticks += 1;
    storecpu += all_cpu_used;
    //  console.log(storecpu/ticks);
    if (false)
    {
        storecpu = 0;
        ticks = 0;
    }
    if (false)
    {
        console.log("link cpu: " + Link_cpu_used);
        console.log("Terminal_cpu_used : " + Terminal_cpu_used);
        console.log("tower_cpu_used  : " + tower_cpu_used);
        console.log("spawnmain_cpu_used cpu: " + spawnmain_cpu_used);
    }
}