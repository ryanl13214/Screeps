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
var debug = true;
var debugTime = 1500;
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
    var startCpu = Game.cpu.getUsed();
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
    var powerManager_cpu_used = +Game.cpu.getUsed() - startCpu;
    if(debug)
    {
        Memory.cpuUsage.powercreeps += powerManager_cpu_used;
    }
    //------------------------------------------------------------------------------------------------//////////////////////////////
    //                                  
    //------------------------------------------------------------------------------------------------
    //  tickcode.run();
    visuals.run();
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
            }
        }
    }
    //------------------------------------------------------------------------------------------------
    //                                  
    //------------------------------------------------------------------------------------------------
    if(Memory.cpuUsage == undefined)
    {
        Memory.cpuUsage = {
            roles: 0,
            towers: 0,
            spawnin: 0,
            terminals: 0,
            defcon: 0,
            squads: 0,
            powercreeps: 0,
            generatingsquads: 0
        }
    }
    if(Memory.roleCPU == undefined)
    {
        Memory.roleCPU = {
            mover: 0,
            multi: 0,
            harvester: 0,
            repairer: 0,
            scout: 0,
            upgrader: 0,
            resourceMover: 0,
            towerMover: 0,
            extractor: 0
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
    if(gametime % 10 == 0)
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
    var startCpu = Game.cpu.getUsed();
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
       //     squadmanage.run(resourcekeys[i]);
        }
        catch (e)
        {}
    }
    var squads_cpu_used = Game.cpu.getUsed() - startCpu;
    if(debug)
    {
        Memory.cpuUsage.squads += squads_cpu_used;
    }
    //------------------------------------------------------------------------------------------------
    //                    START OF ROOMS LOOP
    //------------------------------------------------------------------------------------------------
    for(var i = 0; i < ownedrooms.length; i++)
    {
        //       try{
        var roomname = ownedrooms[i];
        var creepsInRoom = _.filter(Game.creeps, (creep) => (creep.memory.memstruct != undefined && creep.memory.memstruct.spawnRoom === ownedrooms[i]));
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            roles
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
        var startCpu = Game.cpu.getUsed();
        roles.run(creepsInRoom);
        var roles_cpu_used = +Game.cpu.getUsed() - startCpu;
        if(debug)
        {
            Memory.cpuUsage.roles += roles_cpu_used;
        }
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
            Game.rooms[roomname].createFlag(Game.spawns[roomname].pos.x - 2, Game.spawns[roomname].pos.y - 2, roomname);
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
        if(debug)
        {
            Memory.cpuUsage.defcon += defcon_cpu_used;
        }
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
        if(debug)
        {
            Memory.cpuUsage.generatingsquads += squadgenerator_cpu_used;
        }
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
        spawnmain.run(roomname, defconlevel, storagevalue, roomExits, creepsInRoom);
        try
        {
            //    spawnmain.run(roomname, defconlevel, storagevalue, roomExits, creepsInRoom);
        }
        catch (e)
        {}
        var spawnmain_cpu_used = +Game.cpu.getUsed() - startCpu;
        if(debug)
        {
            Memory.cpuUsage.spawnin += spawnmain_cpu_used;
        }
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
        if(debug)
        {
            Memory.cpuUsage.towers += tower_cpu_used;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            terminals
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if((Game.time % (20) == 0 && Game.rooms[roomname].terminal != undefined))
        {
            //markets here
            var startCpu = Game.cpu.getUsed();
            terminalManager.run(roomname, Game.rooms[roomname].terminal, defconlevel, storagevalue);
            var Terminal_cpu_used = +Game.cpu.getUsed() - startCpu;
            if(debug)
            {
                Memory.cpuUsage.terminals += Terminal_cpu_used;
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            LINKS
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(Game.rooms[roomname].controller.level > 3 && Game.time % 9 ==0)
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
    if(debug && Game.time % debugTime == 0)
    {
        console.log("spent ", Memory.cpuUsage.roles / debugTime, " cpu on creeps");
        Memory.cpuUsage.roles = 0;
        console.log("spent ", Memory.cpuUsage.towers / debugTime, " cpu on towers");
        Memory.cpuUsage.towers = 0;
        console.log("spent ", Memory.cpuUsage.terminals / debugTime, " cpu on terminals");
        Memory.cpuUsage.terminals = 0;
        console.log("spent ", Memory.cpuUsage.defcon / debugTime, " cpu on defcon");
        Memory.cpuUsage.defcon = 0;
        console.log("spent ", Memory.cpuUsage.squads / debugTime, " cpu on squads");
        Memory.cpuUsage.squads = 0;
        console.log("spent ", Memory.cpuUsage.powercreeps / debugTime, " cpu on powercreeps");
        Memory.cpuUsage.powercreeps = 0;
        console.log("spent ", Memory.cpuUsage.generatingsquads / debugTime, " cpu on generatingsquads");
        Memory.cpuUsage.generatingsquads = 0;
        ////////////////////////////////////////////
        console.log("roles ", Memory.roleCPU.mover / debugTime, " cpu on movers");
        Memory.roleCPU.mover = 0;
        console.log("roles ", Memory.roleCPU.harvester / debugTime, " cpu on harvester");
        Memory.roleCPU.harvester = 0;
        console.log("roles ", Memory.roleCPU.repairer / debugTime, " cpu on repairer");
        Memory.roleCPU.repairer = 0;
        console.log("roles ", Memory.roleCPU.scout / debugTime, " cpu on scout");
        Memory.roleCPU.scout = 0;
        console.log("roles ", Memory.roleCPU.upgrader / debugTime, " cpu on upgrader");
        Memory.roleCPU.upgrader = 0;
        console.log("roles ", Memory.roleCPU.resourceMover / debugTime, " cpu on resourceMover");
        Memory.roleCPU.resourceMover = 0;
        console.log("roles ", Memory.roleCPU.towerMover / debugTime, " cpu on towerMover");
        Memory.roleCPU.towerMover = 0;
        console.log("roles ", Memory.roleCPU.extractor / debugTime, " cpu on extractor");
        Memory.roleCPU.extractor = 0;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    counter++;
}