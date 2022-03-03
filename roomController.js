var observer = require('observer');
var roles = require('roles');
var spawnmain = require('spawn');
var buildbase = require('buildbase');
var tower = require('tower');
var defcon = require('defcon');
var terminalManager = require('terminal');
var factoryManager = require('factory');
var pwrspawnManager = require('powerspawn');
var squadgenerate = require('squadgenerator');

var labs = require('labs');

var roomController = {
    run: function(roomname)
    {

        var debug = false;

        if (Memory.empire == undefined)
        {
            Memory.empire = {};
        }
        if (Memory.empire.roomsobj == undefined)
        {
            Memory.empire.roomsobj = {};
        }
        if (Memory.empire.roomsobj[roomname] == undefined || Memory.empire.roomsobj[roomname].centerroomsinrange == undefined || Memory.empire.roomsobj[roomname].MineRooms == undefined || Game.time % 150000 == 0 )
        {
            Memory.empire.roomsobj[roomname] = {
                centerroomsinrange: [],
                MineRooms: []

            }
        }

        var creepsInRoom = _.filter(Game.creeps, (creep) => (creep.memory.memstruct != undefined && creep.memory.memstruct.spawnRoom === roomname));
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            roles
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
        
        roles.run(creepsInRoom);
       
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var mainflag = Game.flags[roomname];
        if (Game.time % 50 == 0)
        {
            mainflag.memory.flagstruct.squadspawning = "";
        }
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        if (mainflag == undefined)
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

            //  console.log(roomname);
            if (spawnss.length > 0)
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

        if (Game.rooms[roomname].storage != undefined)
        {
            storagevalue = Game.rooms[roomname].storage.store.getUsedCapacity("energy");
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       
        if (Game.rooms[roomname].controller.level > 3   ) 
        {
        defcon.run(roomname, creepsInRoom);
        }

     
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            SQUAD CREATION
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
     
        if (Game.rooms[roomname].controller.level > 3 && storagevalue > 10000)
        {
            if (Game.time % 99 == 0)
            {
                 squadgenerate.run(roomname);
            }
        }
 
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       
  
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            spawning
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  
        spawnmain.run(roomname, storagevalue, creepsInRoom);
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            basebuild
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
        if (Game.time % (3500) == 0)
        {
            var checkflag = Game.flags[roomname + "noTemplate"];
            try
            {
                var startCpu = Game.cpu.getUsed();
                if (checkflag == undefined)
                {
                    //      buildbase.run(roomname, mainflag.pos.x, mainflag.pos.y);
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
  
      
    
      tower.run(roomname, storagevalue);
       
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            labs
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (Game.rooms[roomname].controller.level > 6)
        {
            labs.run(roomname);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            terminals
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if ((Game.time % (10) == 0 && Game.rooms[roomname].terminal != undefined)  )
        {
            //markets here
            var startCpu = Game.cpu.getUsed();
            terminalManager.run(roomname, Game.rooms[roomname].terminal, storagevalue);
            var Terminal_cpu_used = +Game.cpu.getUsed() - startCpu;
            if (debug)
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
            if (nuker.length == 1)
            {
                if (nuker[0].store.getFreeCapacity("energy") != 0)
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
                if (nuker[0].store.getFreeCapacity("G") != 0)
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
                                        ["withdraw", Game.rooms[roomname].terminal.id, "G", 250],
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
        if (factorys.length != 0 && factorys[0].cooldown < 1)
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
        if (obs.length != 0)
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
       

        if (pwrspawn.length != 0)
        {
            if (Game.rooms[roomname].terminal && Game.rooms[roomname].storage && Game.rooms[roomname].storage.store.getUsedCapacity("energy") > 250000 && pwrspawn.length != 0 )
            {
                pwrspawnManager.run(roomname, Game.rooms[roomname].terminal, pwrspawn[0]);
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                            LINKS
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (Game.rooms[roomname].controller.level > 3)
        {

            var altflag = Game.flags[roomname + "AltTower"]

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
            if(controllerflag){
            var controllerlink = controllerflag.pos.findInRange(FIND_STRUCTURES, 1,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_LINK);
                }
            });
            }

            var alttower = [];

            if (altflag)
            {
                alttower = altflag.pos.findInRange(FIND_STRUCTURES, 1,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_LINK && structure.store.getUsedCapacity() < 500);
                    }
                });
            }

            if (flag1)
            {
                var harvesterlink0 = flag1.pos.findInRange(FIND_STRUCTURES, 1,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_LINK);
                    }
                });

                if (harvesterlink0[0] != undefined && harvesterlink0[0].store.getUsedCapacity("energy") > 300)
                {

              if (controllerlink && controllerlink[0] != undefined && controllerlink[0].store.getUsedCapacity("energy") < 400 && Game.rooms[roomname].storage.store.getUsedCapacity("energy") > 60000)
                    {
                        harvesterlink0[0].transferEnergy(controllerlink[0]);
                    }
                         else  if (alttower.length != 0  && alttower[0].store.getUsedCapacity("energy") < 400)
                    {
                        harvesterlink0[0].transferEnergy(alttower[0]);

                    }
                    else
                    {
                        harvesterlink0[0].transferEnergy(linkto[0]);
                    }
                }
            }
            if (flag0)
            {
                var harvesterlink1 = flag0.pos.findInRange(FIND_STRUCTURES, 1,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_LINK);
                    }
                });
                if (harvesterlink1[0] != undefined && harvesterlink1[0].store.getUsedCapacity("energy") > 300)
                {
               
                if (controllerlink && controllerlink[0] != undefined && controllerlink[0].store.getUsedCapacity("energy") < 400 && Game.rooms[roomname].storage.store.getUsedCapacity("energy") > 60000)
                    {
                        harvesterlink1[0].transferEnergy(controllerlink[0]);
                    }  
                    else       if (alttower.length != 0  && alttower[0].store.getUsedCapacity("energy") < 400)
                    {
                        harvesterlink1[0].transferEnergy(alttower[0]);

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
            if (linkto.length != 0)
            {
                for (var o = 0; o < links.length; o++)
                {
                    if (links[o].store.getUsedCapacity("energy") > 0 && linkto[0].store.getUsedCapacity("energy") == 0)
                    {
                       
                      if (controllerlink[0] != undefined && controllerlink[0].store.getUsedCapacity("energy") < 400)
                        {
                            links[o].transferEnergy(controllerlink[0]);
                        }
  else   if (alttower.length != 0      && alttower[0].store.getUsedCapacity("energy") < 400)
                        {
                            links[0].transferEnergy(alttower[0]);

                        }
                        else if (alttower.length != 0 && links[o].id == alttower[0].id)
                        {
                           
                        }

                        else if (linkto[0] != undefined && (controllerlink[0] == undefined || (controllerlink[0] != undefined && links[o].id != controllerlink[0].id)))
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

    }
}
module.exports = roomController;