var roles = require('roles');
var spawnmain = require('spawn');
var buildbase = require('buildbase');
var tower = require('tower');
var defcon = require('defcon');
var terminalManager = require('terminal');
var squadgenerate = require('squadgenerator'); 
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                        SQUAD MANAGER
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var testingsquads = Memory.squadObject;
    if (testingsquads == undefined)
    {
        Memory.squadObject = {};
    }
    const resourcevalues = Object.values(testingsquads);
    const resourcekeys = Object.keys(testingsquads);


    for (var i = 0; i < resourcekeys.length; i++)
    {
      //  squadmanage.run(resourcekeys[i]);
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
        if(Game.time % 1500 ==0 ){
            Game.flags[roomname].memory.flagstruct.squadspawning ="";
        }
        
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
                    centerroomsinrange:[],
                    mineroomsProfitmargin: [],
                    cpuUsedlastTick: 99,
                    roomdefconstruct:
                    {}
                }
            };
        if(Game.time % 1500 ==0 ){
            mainflag.memory.flagstruct.squadspawning ="";
        }
            var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
          
          
            Game.rooms[roomname].createFlag(spawnss[0].pos.x - 2, spawnss[0].pos.y, roomname);
            var mainflags = Game.flags[roomname];
            mainflags.memory.flagstruct = flagstruct;
        }
        
        var creepsInRoom = _.filter(Game.creeps, (creep) =>  (creep.memory.memstruct != undefined &&    creep.memory.memstruct.spawnRoom === ownedrooms[i]));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                            SQUAD CREATION
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
        var startCpu = Game.cpu.getUsed();
        squadgenerate.run(roomname);
        var squadgenerator_cpu_used = +Game.cpu.getUsed() - startCpu;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                            roles
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
        var startCpu = Game.cpu.getUsed();
        roles.run(creepsInRoom);
        var roles_cpu_used = +Game.cpu.getUsed() - startCpu;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var roomExits = [0, 0, 0, 0];
        roomExits[0] = Game.rooms[roomname].find(FIND_EXIT_TOP);
        roomExits[1] = Game.rooms[roomname].find(FIND_EXIT_RIGHT);
        roomExits[2] = Game.rooms[roomname].find(FIND_EXIT_BOTTOM);
        roomExits[3] = Game.rooms[roomname].find(FIND_EXIT_LEFT);
        Game.map.visual.circle(new RoomPosition(25, 25, roomname), 500);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var storagevalue = 0;
        var defconlevel;
        if (Game.rooms[roomname].storage != undefined)
        {
            storagevalue = Game.rooms[roomname].storage.store.energy;
        }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                            defcon
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
        var startCpu = Game.cpu.getUsed();
        defconlevel = defcon.run(roomname);
        var defcon_cpu_used = +Game.cpu.getUsed() - startCpu;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                            spawning
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
      
      
            var startCpu = Game.cpu.getUsed();
            spawnmain.run(roomname, defconlevel, storagevalue, roomExits, creepsInRoom);
            var spawnmain_cpu_used = +Game.cpu.getUsed() - startCpu;
   
   
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                            basebuild
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
        if (Game.time % 1000 == 0)
        {
            var startCpu = Game.cpu.getUsed();
            buildbase.run(roomname, mainflag.pos.x, mainflag.pos.y);
            var buildbase_cpu_used = +Game.cpu.getUsed() - startCpu;
        }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                            towers
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            
        var startCpu = Game.cpu.getUsed();
        if (Game.time % 10 == 0 || defconlevel.defenceLevel < 10)
        {
            tower.run(roomname);
        }
        var tower_cpu_used = +Game.cpu.getUsed() - startCpu;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                            terminals
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (Game.time % 100 == 0 || (storagevalue < 10000 && Game.rooms[roomname].terminal != undefined))
        {
            //markets here
            var startCpu = Game.cpu.getUsed();
            //  terminalManager.run(roomname,Game.rooms[roomname].terminal,defconlevel,storagevalue); 
            var Terminal_cpu_used = +Game.cpu.getUsed() - startCpu;
        }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                            LINKS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
        var startCpu = Game.cpu.getUsed();
        var linkto = Game.rooms[roomname].lookForAt('structure', mainflag.pos.x - 2  , mainflag.pos.y  ) ;
        linkto = _.filter(linkto, (structure) => structure.structureType == STRUCTURE_LINK);
        var links = Game.rooms[roomname].find(FIND_MY_STRUCTURES, {
            filter: {
                structureType: STRUCTURE_LINK
            }
        });
        for (var i = 0; i < links.length; i++) {
            if (links[i].energy > 300) {
                links[i].transferEnergy(linkto[0]);
            }
        }
        var Link_cpu_used = +Game.cpu.getUsed() - startCpu;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    } //end of rooms loop 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
}














