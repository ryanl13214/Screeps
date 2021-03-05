var roles = require('roles');
var spawnmain = require('spawn');
var buildbase = require('buildbase');
var tower = require('tower');
var defcon = require('defcon');
var terminalManager = require('terminal');
var squadgenerate = require('squadgenerator');
var squadmanage = require('squadManager');
var visuals = require('visuals');
var powerManager = require('powercreepManager');
var tickcode = require('tickcode');
var storecpu = 0;
var ticks = 0;
var counter = 0;
module.exports.loop = function()
{
    var ownedrooms = [];
    var roomsall = Object.keys(Game.rooms);
    var roomsobj = Game.rooms;
    for(var i = 0; i < roomsall.length; i++)
    {
        if(roomsobj[roomsall[i]].controller != undefined)
        {
            if(roomsobj[roomsall[i]].controller.owner != undefined)
            {
                if((roomsobj[roomsall[i]]).controller.owner.username === "Q13214")
                {
                    ownedrooms.push(roomsall[i]);
                }
            }
        }
    }
    var mainstartCpu = Game.cpu.getUsed();
    var gametime = Game.time;
    //------------------------------------------------------------------------------------------------
    //                                  
    //------------------------------------------------------------------------------------------------
    var powerCreepList = Game.powerCreeps;
    var listnumbers = Object.keys(powerCreepList);
    var listvalues = Object.values(powerCreepList);
    for(var i = 0; i < listnumbers.length; i++)
    {
     
        try
        {   
            powerManager.run(listvalues[i]); 
        }
        catch (e)
        {}
    }
    //------------------------------------------------------------------------------------------------//////////////////////////////
    //                                  
    //------------------------------------------------------------------------------------------------
     tickcode.run();
    visuals.run();
    try
    {}
    catch (e)
    {}
    //------------------------------------------------------------------------------------------------
    //                                  
    //------------------------------------------------------------------------------------------------
    if(gametime % 1000 == 0)
    {
        for(const id in Game.market.orders)
        {
            if(Game.market.orders[id].remainingAmount == 0)
            {
                Game.market.cancelOrder(id);
                //console.log("cancellimng orders");
            }
        }
    }
    //------------------------------------------------------------------------------------------------
    //                                  
    //------------------------------------------------------------------------------------------------
    var mainflag = Game.flags;
    var flaglist = Object.keys(Game.flags);
    var redflags = [];
    for(var i = 0; i < flaglist.length; i++)
    {
        //console.log( mainflag[flaglist[i]].secondaryColor);
        if(mainflag[flaglist[i]].color == 1)
        {
            redflags.push(mainflag[flaglist[i]]);
        }
    }
    //------------------------------------------------------------------------------------------------
    //                          deleting memory
    //------------------------------------------------------------------------------------------------
    if(gametime % 1000 == 0)
    {
        for(var name in Memory.creeps)
        {
            if(!Game.creeps[name])
            {
                delete Memory.creeps[name];
            }
        }
        for(var name in Memory.flags)
        {
            if(!Game.flags[name])
            {
                //delete Memory.flags[name];
            }
        }
    }
    //------------------------------------------------------------------------------------------------
    if(Game.cpu.bucket == 10000)
    {
        Game.cpu.generatePixel()
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                        SQUAD MANAGER
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var testingsquads = Memory.squadObject;
    if(testingsquads == undefined)
    {
        Memory.squadObject = {};
    }
    const resourcevalues = Object.values(testingsquads);
    const resourcekeys = Object.keys(testingsquads);
    for(var i = 0; i < resourcekeys.length; i++)
    {
        try
        {
           squadmanage.run(resourcekeys[i]);
        }
        catch (e)
        {}
    }
    //------------------------------------------------------------------------------------------------
    //                    flag reset
    //------------------------------------------------------------------------------------------------
    if(false)
    {
        var allflags = Game.flags;
        const flagvalues = Object.values(allflags);
        const flagkeys = Object.keys(allflags);
        for(var v = 0; v < flagkeys.length; v++)
        {
            if(flagvalues[v].pos.roomName != ownedrooms[0])
            {
                Game.flags[flagkeys[v]].remove();
            }
        }
    }
    //------------------------------------------------------------------------------------------------
    //                    START OF ROOMS LOOP
    //------------------------------------------------------------------------------------------------
    for(var i = 0; i < ownedrooms.length; i++)
    {
  //       try{
            if(Game.time % 15 == 0)
            {
                //  if(Game.flags[roomname].memory.flagstruct.squadspawning  == undefined )
                //   { 
                //      Game.flags[roomname].memory.flagstruct["squadspawning"] ="";
                //  }
                //   Game.flags[roomname].memory.flagstruct.squadspawning ="";
            }
            var roomname = ownedrooms[i];
            var creepsInRoom = _.filter(Game.creeps, (creep) => (creep.memory.memstruct != undefined && creep.memory.memstruct.spawnRoom === ownedrooms[i]));
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //                                            roles
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
            var startCpu = Game.cpu.getUsed();
            roles.run(creepsInRoom);
            var roles_cpu_used = +Game.cpu.getUsed() - startCpu;
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var mainflag = Game.flags[roomname];
            if(Game.time % 1500 == 0)
            {
                mainflag.memory.flagstruct.squadspawning = "";
            }
            if(mainflag == undefined)
            {
                var flagstruct = {
                    roomissafe: false,
                    roomsuitableforClaiming: false,
                    numberOfSourcesInRoom: 0,
                    roomisSuitableForMainRoomMining: false,
                    roomIsFightTeritory: false,
                    roomIsMyTeritory: false,
                    distancefromoom: 9999,
                    squadspawning: "",
                    remoteMine: false,
                    mineroomsProfitmargin: 0,
                    mineroomsCPU: 0,
                    mineroomsCost: 0,
                    claimedroomstuct:
                    {
                        roomIsStronghold: false,
                        allyRoomsInRange: [],
                        MineRooms: [],
                        centerroomsinrange: [],
                        mineroomsProfitmargin: [],
                        cpuUsedlastTick: 99,
                        roomdefconstruct:
                        {},
                        dismantelrooms: []
                    }
                };
                var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
                Game.rooms[roomname].createFlag(Game.spawns[roomname].pos.x - 2,Game.spawns[roomname].pos.y - 2, roomname);
                var mainflags = Game.flags[roomname];
                mainflags.memory.flagstruct = flagstruct;
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //                                            defcon
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
            
            
                         
            var storagevalue = 0;
            var defconlevel;
            if(Game.rooms[roomname].storage != undefined)
            {
                storagevalue = Game.rooms[roomname].storage.store.energy;
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var startCpu = Game.cpu.getUsed();
            if(Game.rooms[roomname].controller.level > 3)
            {
                try
                {
                    defconlevel = defcon.run(roomname);
                }
                catch (e)
                {
                    var defconlevel = {
                        defenceLevel: 10,
                        attackLevel: 10
                    };
                }
            }
            else
            {
                var defconlevel = {
                    defenceLevel: 10,
                    attackLevel: 10
                };
            }
            var defcon_cpu_used = +Game.cpu.getUsed() - startCpu;
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //                                            SQUAD CREATION
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
            var startCpu = Game.cpu.getUsed();
            if(Game.rooms[roomname].controller.level > 3 && storagevalue > 10000)
            {
                if(Game.time % 150 == 0 || defconlevel.defenceLevel < 10)
                {
                    squadgenerate.run(roomname, redflags);
                }
            }
            var squadgenerator_cpu_used = +Game.cpu.getUsed() - startCpu;
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var roomExits = [0, 0, 0, 0];
            roomExits[0] = Game.rooms[roomname].find(FIND_EXIT_TOP);
            roomExits[1] = Game.rooms[roomname].find(FIND_EXIT_RIGHT);
            roomExits[2] = Game.rooms[roomname].find(FIND_EXIT_BOTTOM);
            roomExits[3] = Game.rooms[roomname].find(FIND_EXIT_LEFT);
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //                                            spawning
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
            var startCpu = Game.cpu.getUsed();
            try
            {
                spawnmain.run(roomname, defconlevel, storagevalue, roomExits, creepsInRoom);
            }
            catch (e)
            {
                if(Game.time % 5 == 0)
                {
                    Game.flags[roomname].remove();
                }
            }
            var spawnmain_cpu_used = +Game.cpu.getUsed() - startCpu;
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //                                            basebuild
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
            if(Game.time % (9999 + i) == 0)
            {
                var startCpu = Game.cpu.getUsed();
                buildbase.run(roomname, mainflag.pos.x, mainflag.pos.y);
                var buildbase_cpu_used = +Game.cpu.getUsed() - startCpu;
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //                                            towers
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            
            var startCpu = Game.cpu.getUsed();
            if(Game.time % (5) == 0 || defconlevel.defenceLevel < 10 || storagevalue > 700000)
            {
                tower.run(roomname, storagevalue);
            }
            var tower_cpu_used = +Game.cpu.getUsed() - startCpu;
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //                                            terminals
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if((Game.time % (20) == 0 && Game.rooms[roomname].terminal != undefined))
            {
                //markets here
                var startCpu = Game.cpu.getUsed();
                terminalManager.run(roomname, Game.rooms[roomname].terminal, defconlevel, storagevalue);
                var Terminal_cpu_used = +Game.cpu.getUsed() - startCpu;
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //                                            LINKS
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(Game.rooms[roomname].controller.level > 3)
            {
                try
                {
                    var mainflags = Game.flags[roomname];
                    var flag1 = Game.flags[roomname + "container1"];
                    var flag0 = Game.flags[roomname + "container0"];
                    var startCpu = Game.cpu.getUsed();
                    var linkto = Game.rooms[roomname].storage.pos.findClosestByRange(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_LINK);
                        }
                    });
                    var harvesterlink0 = flag1.pos.findClosestByRange(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_LINK);
                        }
                    });
                    var harvesterlink1 = flag0.pos.findClosestByRange(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_LINK);
                        }
                    });
                    var links = Game.rooms[roomname].find(FIND_MY_STRUCTURES,
                    {
                        filter:
                        {
                            structureType: STRUCTURE_LINK
                        }
                    });
                    if(harvesterlink0.store.getUsedCapacity("energy") > 300)
                    {
                        harvesterlink0.transferEnergy(linkto);
                    }
                    if(harvesterlink1.store.getUsedCapacity("energy") > 300)
                    {
                        harvesterlink1.transferEnergy(linkto);
                    }
                    for(var o = 0; o < links.length; o++)
                    {
                        if(links[o].id != harvesterlink0.id && links[o].id != harvesterlink1.id && links[o].id != linkto.id)
                        {
                            if(links[o].store.getUsedCapacity("energy") > 0 && linkto.store.getUsedCapacity("energy") == 0)
                            {
                                var suc = links[o].transferEnergy(linkto);
                                if(suc == 0)
                                {
                                    mainflags.memory.flagstruct.mineroomsProfitmargin += links[o].energy;
                                }
                            }
                        }
                    }
                    var Link_cpu_used = +Game.cpu.getUsed() - startCpu;
                }
                catch (e)
                {}
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var powerspawn = Game.rooms[roomname].find(FIND_MY_STRUCTURES,
            {
                filter:
                {
                    structureType: STRUCTURE_POWER_SPAWN
                }
            });
            if(powerspawn.length == 1)
            {
                if(Game.time % 1 == 0)
                {
                    powerspawn[0].processPower();
                }
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(Game.time % 111111 == 0)
            {
                var mainflags = Game.flags[roomname];
                console.log("room ", roomname, " has harvested ", mainflags.memory.flagstruct.mineroomsProfitmargin, " and used ", mainflags.memory.flagstruct.mineroomsCPU, " and cost ", mainflags.memory.flagstruct.mineroomsCost, " energy-- ", counter);
                mainflags.memory.flagstruct.mineroomsProfitmargin = 0;
                mainflags.memory.flagstruct.mineroomsCPU = 0;
                mainflags.memory.flagstruct.mineroomsCost = 0;
                counter = 0;
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
   //   } catch (e)        {            console.log("error in room : ", roomname, " ", e);        }
    } //end of rooms loop 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    counter++;
}