/*
    BODYPART_COST: {
        "move": 50,
        "work": 100,
        "attack": 80,
        "carry": 50,
        "heal": 250,
        "ranged_attack": 150,
        "tough": 10,
        "claim": 600
    },
*/
//Game.spawns['w35s8'].spawnCreep([MOVE], 'flager' + Game.time, {memory: {role: 'flagger' , target:"source0"}});
var standardspawning = require('prototype.standardspawning');
var spwan = {
    run: function(roomname, defconstruct, storagevalue, roomExits, creepsinroom)
    {
        ///////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////
        if(Game.spawns[roomname + "1"] != undefined)
        {
            if(Game.spawns[roomname + "1"].spawning)
            {
                if(Game.spawns[roomname + "1"].spawning.name == 'resourcemover' + roomname)
                {
                    Game.spawns[roomname + "1"].spawning.setDirections([BOTTOM]);
                }
                else
                {
                    Game.spawns[roomname + "1"].spawning.setDirections([TOP_LEFT, TOP]);
                }
            }
        }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(Game.spawns[roomname].spawning)
        {
            if(Game.spawns[roomname].spawning.name == 'towermover' + roomname)
            {
                Game.spawns[roomname].spawning.setDirections([TOP_LEFT]);
            }
            else
            {
                Game.spawns[roomname].spawning.setDirections([RIGHT, BOTTOM_RIGHT, BOTTOM]);
            }
        }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        for(var i = 0; i < spawnss.length; i++)
        {
            //       try{
            var ajacentcreepstorenew = spawnss[i].pos.findInRange(FIND_MY_CREEPS, 1,
            {
                filter: (creep) =>
                {
                    return (creep.memory.memstruct.boosted == false && (creep.memory.memstruct.opportuniticRenew == true || creep.memory.memstruct.moveToRenew == true) && creep.ticksToLive < 1450);
                }
            });
            if(ajacentcreepstorenew.length != 0 && storagevalue != 0)
            {
                spawnss[i].renewCreep(ajacentcreepstorenew[0]);
            }
        }
        var harvesters = _.filter(creepsinroom, (creep) => creep.memory.role == 'harvester');
        var movers = _.filter(creepsinroom, (creep) => creep.memory.role == 'mover');
        
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(Game.time % 25 == 0 || defconstruct.defenceLevel < 10)
        {
            var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
            var energycurrentlyavailable = Game.rooms[roomname].energyAvailable;
            var repairers = _.filter(creepsinroom, (creep) => creep.memory.role == 'repair');
            var towermover = _.filter(creepsinroom, (creep) => creep.memory.role == 'towermover');
            var upgraders = _.filter(creepsinroom, (creep) => creep.memory.role == 'upgrader');
            var resourcemover = _.filter(creepsinroom, (creep) => creep.memory.role == 'resmover');
            var extractor = _.filter(creepsinroom, (creep) => creep.memory.role == 'extractor');
            var nextroomharvester = _.filter(creepsinroom, (creep) => creep.memory.role == 'nextroom');
            var scouts = _.filter(creepsinroom, (creep) => creep.memory.role == 'scout');
            var numberofguardingcreeps = _.filter(creepsinroom, (creep) => creep.memory.role == 'guard');
            //standard creep memory
            var memstruct = {
                spawnRoom: roomname,
                tasklist: [],
                objectIDStorage: "",
                boosted: false,
                moveToRenew: true,
                opportuniticRenew: true,
                hastask: false,
                full: false,
                wantsToJoinSquad: false,
                isInSquad: false,
                SquadID: "0",
                SquadRole: false
            };
            if(movers.length != 0 && harvesters.length == 2)
            {
                Game.flags[roomname].memory.flagstruct.spawnfree = true;
            }
            else
            {
                Game.flags[roomname].memory.flagstruct.spawnfree = false;
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       
            var jacks = _.filter(creepsinroom, (creep) => creep.memory.role == 'jack');
            if(((movers.length == 0 || harvesters.length == 0) && jacks.length < 6) || (Game.rooms[roomname].controller.level < 3 && jacks.length < 8))
            {
                
                if(jacks.length < 4)
                {
                    var numberofparts = Math.floor(energycurrentlyavailable / 350);
                }
                else
                {
                    var numberofparts = Math.floor(energycurrentlyavailable / 350);
                }
                if(numberofparts > 8)
                {
                    numberofparts = 8;
                }
                var bodyparts = [];
                for(let i = 0; i < numberofparts; i++)
                {
                    bodyparts.push(WORK);
                    bodyparts.push(CARRY);
                    bodyparts.push(CARRY);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                }
                if(numberofparts == 0)
                {
                    bodyparts = [WORK, MOVE, CARRY];
                }
                Game.spawns[roomname].spawnCreep(bodyparts, 'jack' + Game.time+" "+roomname,
                {
                    memory:
                    {
                        role: 'jack',
                        cpuUsed: 0,
                        roomtarg: roomname,
                        sourcetarget: Game.time % 2,
                        full: false,
                        memstruct: memstruct
                    }
                });
            }
            if(defconstruct.defenceLevel == 10)
            {
                standardspawning.run(roomname, defconstruct, storagevalue, roomExits, creepsinroom, energyavailable, energycurrentlyavailable, jacks, repairers, towermover, harvesters, movers, upgraders, resourcemover, extractor, nextroomharvester, scouts, numberofguardingcreeps, memstruct);
            }
            else
            {
                standardspawning.run(roomname, defconstruct, storagevalue, roomExits, creepsinroom, energyavailable, energycurrentlyavailable, jacks, repairers, towermover, harvesters, movers, upgraders, resourcemover, extractor, nextroomharvester, scouts, numberofguardingcreeps, memstruct);

               
            }
        }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }
}
module.exports = spwan;