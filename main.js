var roles = require('roles');
var spawnmain = require('spawn');
var buildbase = require('buildbase');
var tower = require('tower');
var defcon = require('defcon');
var terminalManager = require('terminal');
var factoryManager = require('factory');
var storageManager = require('storage');
var pwrspawnManager = require('powerspawn');
var squadgenerate = require('squadgenerator');
var squadmanage = require('squadManager');
var visuals = require('visuals');
var powerManager = require('powercreepManager');
var tickcode = require('tickcode');
var storecpu = 0;
var ticks = 0;
var counter = 0;
var debug = false;
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
        try{
       powerManager.run(listvalues[i]);
        }catch(e){
            console.log("pwer err",e);
    }
    }
    var powerManager_cpu_used = +Game.cpu.getUsed() - startCpu;
    if(debug)
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

    
        if(Game.cpu.bucket == 10000)
    {
        Game.cpu.generatePixel()
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
        
        for(var name in Memory.powerCreeps)
        {
            if(!Game.powerCreeps[name])
            {
                delete Memory.powerCreeps[name];
            }
        }
        
        for(var name in Memory.flags)
        {
            if(!Game.flags[name])
            {
                delete Memory.flags[name];
            }
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                       INTERSHARD 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var inteshardCreeps = _.filter(Game.creeps, (creep) => ( creep.memory.role == undefined || creep.memory.intershard==true ));
  
    for(var i = 0; i < inteshardCreeps.length; i++)
    {
        if(inteshardCreeps[i].memory.role ==undefined )
        {
            inteshardCreeps[i].memory.role = "multi";
            
            
            
            inteshardCreeps[i].memory.memstruct = {
                tasklist:[]
            }
            inteshardCreeps[i].memory.memstruct.tasklist = [["getDataFromOldShard"]]
        }
        
  
    }
   
        
      roles.run(inteshardCreeps);  
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
     //  try{
        squadmanage.run(resourcekeys[i]);
      //  }catch(e){
     //       console.log( "squadmanage err",e);
    //    }
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
                squadspawning: "",
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
            //  console.log(roomname);
            if(spawnss.length > 0){
                 Game.rooms[roomname].createFlag(Game.spawns[roomname].pos.x - 2, Game.spawns[roomname].pos.y - 2, roomname);
            }else{
                 Game.rooms[roomname].createFlag(25, 25, roomname);
                 Game.rooms[roomname].createFlag(25, 25, roomname+"noTemplate");
            }
            
            
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
            storagevalue = Game.rooms[roomname].storage.store.getUsedCapacity();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var startCpu = Game.cpu.getUsed();
        if(Game.rooms[roomname].controller.level > 3)
        {
            var defconlevel = {
                defenceLevel: 10,
                attackLevel: 10
            };
            //
            try
            {
                defconlevel = defcon.run(roomname, creepsInRoom);
            }
            catch (e)
            {
                console.log("defconbroke-", roomname);
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
                squadgenerate.run(roomname);
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
        var spawnmain_cpu_used = +Game.cpu.getUsed() - startCpu;
        if(debug)
        {
            Memory.cpuUsage.spawnin += spawnmain_cpu_used;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            basebuild
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
        if(Game.time % (1500 + i) == 0)
        {
                var checkflag = Game.flags[roomname+"noTemplate"];
                try{
       
            
            var startCpu = Game.cpu.getUsed();
            if(checkflag == undefined){
            buildbase.run(roomname, mainflag.pos.x, mainflag.pos.y);
            }
            var buildbase_cpu_used = +Game.cpu.getUsed() - startCpu;
               }catch(e){
           console.log( "basebuild err");
        }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            towers
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            
        var startCpu = Game.cpu.getUsed();
        if(Game.time % (8) == 0 || defconlevel.defenceLevel < 10 || storagevalue > 990000)
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
        if((Game.time % (10) == 0 && Game.rooms[roomname].terminal != undefined))
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
        //                                       storageManager
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
        if(Game.rooms[roomname].terminal != undefined && Game.rooms[roomname].storage != undefined && Game.time % (15) < 2)
        {
            storageManager.run(roomname);
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                       factroy
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var factorys = Game.rooms[roomname].find(FIND_MY_STRUCTURES,
        {
            filter:
            {
                structureType: STRUCTURE_FACTORY
            }
        });
        if(factorys.length != 0 && factorys[0].cooldown < 1)
        {
            factoryManager.run(roomname, Game.rooms[roomname].terminal, factorys[0]);
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                       pwrspawnManager
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
        const pwrspawn = Game.rooms[roomname].find(FIND_MY_STRUCTURES,
        {
            filter:
            {
                structureType: STRUCTURE_POWER_SPAWN
            }
        });
        var g = 4;
        if(Game.market.credits > 75000000)
        {
            g = 1;
        }
        
        if(Game.rooms[roomname].terminal != undefined && Game.rooms[roomname].storage != undefined && Game.rooms[roomname].storage.store.getUsedCapacity("energy") > 600000 && pwrspawn.length != 0 && Game.time % (g) == 0)
        {
            pwrspawnManager.run(roomname, Game.rooms[roomname].terminal, pwrspawn[0]);
        }
        else if(Game.rooms[roomname].terminal != undefined && Game.rooms[roomname].storage != undefined  && pwrspawn.length != 0 &&     g == 1)
        {   
            pwrspawnManager.run(roomname, Game.rooms[roomname].terminal, pwrspawn[0]);
            
        }
        
        
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            LINKS
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(Game.rooms[roomname].controller.level > 3)
        {
            try{
            var mainflags = Game.flags[roomname];
            var flag1 = Game.flags[roomname + "container1"];
            var flag0 = Game.flags[roomname + "container0"];
            var controllerflag = Game.flags[roomname + "controllerposcontainer"];
            var startCpu = Game.cpu.getUsed();
            var linkto = mainflags.pos.findInRange(FIND_STRUCTURES, 2,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_LINK);
                }
            });
            var controllerlink = controllerflag.pos.findInRange(FIND_STRUCTURES, 1,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_LINK);
                }
            });
            var harvesterlink0 = flag1.pos.findInRange(FIND_STRUCTURES, 1,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_LINK);
                }
            });
            var harvesterlink1 = flag0.pos.findInRange(FIND_STRUCTURES, 1,
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
            if( harvesterlink0[0] != undefined &&   harvesterlink0[0].store.getUsedCapacity("energy") > 300)
            {
                if(controllerlink[0] != undefined && controllerlink[0].store.getUsedCapacity("energy") < 400)
                {
                    harvesterlink0[0].transferEnergy(controllerlink[0]);
                }
                else
                {
                    harvesterlink0[0].transferEnergy(linkto[0]);
                }
            }
            if( harvesterlink1[0] != undefined && harvesterlink1[0].store.getUsedCapacity("energy") > 300)
            {
                if(controllerlink[0] != undefined && controllerlink[0].store.getUsedCapacity("energy") < 400)
                {
                    harvesterlink1[0].transferEnergy(controllerlink[0]);
                }
                else
                {
                    harvesterlink1[0].transferEnergy(linkto[0]);
                }
            }
            
            
            
            for(var o = 0; o < links.length; o++)
            {
                if(links[o].store.getUsedCapacity("energy") > 0 && linkto[0].store.getUsedCapacity("energy") == 0)
                {
                   if(controllerlink[0] != undefined && controllerlink[0].store.getUsedCapacity("energy") < 400)
                    {
                        links[o].transferEnergy(controllerlink[0]);
                    }
                    else if(linkto[0] != undefined && ( controllerlink[0] == undefined        ||  (controllerlink[0] != undefined && links[o].id !=   controllerlink[0].id )  ))
                    {
                        links[o].transferEnergy(linkto[0]);
                    }
                }
            }
            var Link_cpu_used = +Game.cpu.getUsed() - startCpu;
            } catch (e)        {              }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(Game.time % 4500 == 0)
        {
            var mainflags = Game.flags[roomname];
            console.log("room ", roomname, " has harvested ", mainflags.memory.flagstruct.mineroomsProfitmargin, " |   and used ", mainflags.memory.flagstruct.mineroomsCPU, " CPU  | and cost ", mainflags.memory.flagstruct.mineroomsCost, " energy-- ", counter);
            mainflags.memory.flagstruct.mineroomsProfitmargin = 0;
            mainflags.memory.flagstruct.mineroomsCPU = 0;
            mainflags.memory.flagstruct.mineroomsCost = 0;
            counter = 0;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
        // } catch (e)        {            console.log("error in room : ", roomname, " ", e);        }
    } //end of rooms loop 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    counter++;
}