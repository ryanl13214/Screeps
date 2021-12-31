 var roles = require('roles');
var spawnmain = require('spawn');
var buildbase = require('buildbase');
var tower = require('tower');
var defcon = require('defcon');
var terminalManager = require('terminal');
var factoryManager = require('factory');
var pwrspawnManager = require('powerspawn');
var squadgenerate = require('squadgenerator');
var squadmanage = require('squadManager');
var attackManager = require('attackManager');
var claimManager = require('roomClaimer');
var labs = require('labs');
var visuals = require('visuals');
var powerManager = require('powercreepManager');
var tickcode = require('tickcode');
var observer = require('observer');
var debug = false;
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
                if((roomsobj[roomsall[i]]).controller.owner.username === "Q13214"   &&  (roomsobj[roomsall[i]]).controller.level > 0)
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
        powerManager.run(listvalues[i]);
    }
    var powerManager_cpu_used = Game.cpu.getUsed() - startCpu;
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
   //     Game.cpu.generatePixel()
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
    var inteshardCreeps = _.filter(Game.creeps, (creep) => (creep.memory.role == undefined || creep.memory.intershard == true));
    for(var i = 0; i < inteshardCreeps.length; i++)
    {
        if(inteshardCreeps[i].memory.role == undefined)
        {
            inteshardCreeps[i].memory.role = "multi";
            inteshardCreeps[i].memory.memstruct = {
                tasklist: []
            }
            inteshardCreeps[i].memory.memstruct.tasklist = [
                ["getDataFromOldShard"]
            ]
        }
    }
    roles.run(inteshardCreeps);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                        SQUAD MANAGER
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var startCpu = Game.cpu.getUsed();
    var  squads = Memory.squadObject;
    if(squads == undefined)
    {
        Memory.squadObject = {};
       squads = {};
    }
    var resourcevalues = Object.values(squads);
    var resourcekeys = Object.keys(squads);
    for(var i = 0; i < resourcekeys.length; i++)
    {
      squadmanage.run(resourcekeys[i]);
    }
    var squads_cpu_used = Game.cpu.getUsed() - startCpu;
    if(debug)
    {
        Memory.cpuUsage.squads += squads_cpu_used;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                        attack MANAGER
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var startCpu = Game.cpu.getUsed();
    var attacks = Memory.attackManager;
    if(attacks == undefined)
    {
        Memory.attackManager = {};
         attacks = {};
    }
    var resourcevalues = Object.values(attacks);
    var resourcekeys = Object.keys(attacks);
    for(var i = 0; i < resourcekeys.length; i++)
    {
          // attackManager.run(resourcekeys[i]);
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                        claim MANAGER
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var startCpu = Game.cpu.getUsed();
    var claims = Memory.claimManager;
    if(claims == undefined)
    {
        Memory.claimManager = {};
        claims = {};
    }
    var resourcevalues = Object.values(claims);
    var resourcekeys = Object.keys(claims);
    for(var i = 0; i < resourcekeys.length; i++)
    {
           claimManager.run(resourcekeys[i]);
    }
    
    
    
    
    
    
    
    
    
    
    
    
    //------------------------------------------------------------------------------------------------
    //                    START OF ROOMS LOOP
    //------------------------------------------------------------------------------------------------
    for(var i = 0; i < ownedrooms.length; i++)
    {
        var roomname = ownedrooms[i];
        
        
        if (Memory.empire == undefined)
        {
            Memory.empire = {};
        }
        if (Memory.empire.roomsobj == undefined)
        {
            Memory.empire.roomsobj = {};
        }
        if (Memory.empire.roomsobj[roomname] == undefined ||  Memory.empire.roomsobj[roomname].centerroomsinrange == undefined    || Memory.empire.roomsobj[roomname].MineRooms == undefined )
        {
            Memory.empire.roomsobj[roomname] = {
                centerroomsinrange:[],
                MineRooms:[]

                
            }
        }
        
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
        if(Game.time % 50 == 0)
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
            if(spawnss.length > 0)
            {
                Game.rooms[roomname].createFlag(Game.spawns[roomname].pos.x - 2, Game.spawns[roomname].pos.y - 2, roomname);
            }
            else
            {
                Game.rooms[roomname].createFlag(25, 25, roomname);
                Game.rooms[roomname].createFlag(25, 25, roomname + "noTemplate");
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
            defconlevel = defcon.run(roomname, creepsInRoom);
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
            if(Game.time % 99  == 0 || defconlevel.defenceLevel < 10)
            {
               // squadgenerate.run(roomname);
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
            var checkflag = Game.flags[roomname + "noTemplate"];
            try
            {
                var startCpu = Game.cpu.getUsed();
                if(checkflag == undefined)
                {
                    buildbase.run(roomname, mainflag.pos.x, mainflag.pos.y);
                }
                var buildbase_cpu_used = +Game.cpu.getUsed() - startCpu;
            }
            catch (e)
            {
                console.log("basebuild err");
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            towers
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            
        var startCpu = Game.cpu.getUsed();
        if(Game.time % (16) == 0 || defconlevel.defenceLevel < 10 || storagevalue > 900000)
        {
            tower.run(roomname, storagevalue);
        }
        var tower_cpu_used = +Game.cpu.getUsed() - startCpu;
        if(debug)
        {
            Memory.cpuUsage.towers += tower_cpu_used;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            labs
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        if(Game.rooms[roomname].controller.level > 6){
          //  labs.run(roomname);
        }
      
        
        
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            terminals
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if((Game.time % (10 + i) == 0 && Game.rooms[roomname].terminal != undefined))
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
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            nuker 
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var nuker = Game.rooms[roomname].find(FIND_MY_STRUCTURES,
        {
            filter:
            {
                structureType: STRUCTURE_NUKER
            }
        });
        try
        {
            if(nuker.length == 1)
            {
                if(nuker[0].store.getFreeCapacity("energy") != 0)
                {
                    Game.spawns[roomname].spawnCreep(
                        [MOVE, CARRY, CARRY, CARRY, CARRY, CARRY], roomname + 'nukerenergy',
                        {
                            memory:
                            {
                                role: 'multi',
                                memstruct:
                                {
                                    spawnRoom: roomname,
                                    tasklist: [
                                        ["withdraw", Game.rooms[roomname].storage.id, "energy", 250],
                                        ["transfer", nuker[0].id, "energy"],
                                        ["repeat", 2]
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
                if(nuker[0].store.getFreeCapacity("G") != 0)
                {
                    Game.spawns[roomname].spawnCreep(
                        [MOVE, CARRY, CARRY, CARRY, CARRY, CARRY], roomname + 'nukerg',
                        {
                            memory:
                            {
                                role: 'multi',
                                memstruct:
                                {
                                    spawnRoom: roomname,
                                    tasklist: [
                                        ["withdraw", Game.rooms[roomname].storage.id, "G", 250],
                                        ["transfer", nuker[0].id, "G"],
                                        ["repeat", 2]
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
            }
        }
        catch (e)
        {}
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
        //                                       observer
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var obs = Game.rooms[roomname].find(FIND_MY_STRUCTURES,
        {
            filter:
            {
                structureType: STRUCTURE_OBSERVER
            }
        });
        if(obs.length != 0)
        {
           observer.run(roomname, obs[0]);
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                       pwrspawnManager
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
        var pwrspawn = Game.rooms[roomname].find(FIND_MY_STRUCTURES,
        {
            filter:
            {
                structureType: STRUCTURE_POWER_SPAWN
            }
        });
        var g = 4;

        if(pwrspawn.length != 0){
        if(Game.rooms[roomname].terminal   && Game.rooms[roomname].storage   && Game.rooms[roomname].storage.store.getUsedCapacity("energy") > 500000 && pwrspawn.length != 0 && Game.time % (g) == 0  )
        {
            pwrspawnManager.run(roomname, Game.rooms[roomname].terminal, pwrspawn[0]);
        }}
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            LINKS
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(Game.rooms[roomname].controller.level > 3)
        {
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
            if(flag1)
            {
                var harvesterlink0 = flag1.pos.findInRange(FIND_STRUCTURES, 1,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_LINK);
                    }
                });
                if(harvesterlink0[0] != undefined && harvesterlink0[0].store.getUsedCapacity("energy") > 300)
                {
                    if(controllerlink[0] != undefined && controllerlink[0].store.getUsedCapacity("energy") < 400 && Game.rooms[roomname].storage.store.getUsedCapacity("energy") > 60000)
                    {
                        harvesterlink0[0].transferEnergy(controllerlink[0]);
                    }
                    else
                    {
                        harvesterlink0[0].transferEnergy(linkto[0]);
                    }
                }
            }
            if(flag0)
            {
                var harvesterlink1 = flag0.pos.findInRange(FIND_STRUCTURES, 1,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_LINK);
                    }
                });
                if(harvesterlink1[0] != undefined && harvesterlink1[0].store.getUsedCapacity("energy") > 300)
                {
                    if(controllerlink[0] != undefined && controllerlink[0].store.getUsedCapacity("energy") < 400   && Game.rooms[roomname].storage.store.getUsedCapacity("energy") > 60000)
                    {
                        harvesterlink1[0].transferEnergy(controllerlink[0]);
                    }
                    else
                    {
                        harvesterlink1[0].transferEnergy(linkto[0]);
                    }
                }
            }
            var links = Game.rooms[roomname].find(FIND_MY_STRUCTURES,
            {
                filter:
                {
                    structureType: STRUCTURE_LINK
                }
            });
            if(linkto.length != 0)
            {
                for(var o = 0; o < links.length; o++)
                {
                    if(links[o].store.getUsedCapacity("energy") > 0 && linkto[0].store.getUsedCapacity("energy") == 0)
                    {
                        if(controllerlink[0] != undefined && controllerlink[0].store.getUsedCapacity("energy") < 400 )
                        {
                            links[o].transferEnergy(controllerlink[0]);
                        }
                        else if(linkto[0] != undefined && (controllerlink[0] == undefined || (controllerlink[0] != undefined && links[o].id != controllerlink[0].id)))
                        {
                            links[o].transferEnergy(linkto[0]);
                        }
                    }
                }
            }
            var Link_cpu_used = +Game.cpu.getUsed() - startCpu;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
        // } catch (e)        {            console.log("error in room : ", roomname, " ", e);        }
    } //end of rooms loop 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
   
}