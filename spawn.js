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
var attackspawning   = require('prototype.attackspawning');
var spwan = {
    run: function(roomname, defconstruct, storagevalue, roomExits, creepsinroom)
    {
        if (Game.spawns[roomname].spawning)
        {
            
            if (Game.spawns[roomname].spawning.name == 'towermover' + roomname)
            {
                Game.spawns[roomname].spawning.setDirections([LEFT]);
            }
            else if( Game.rooms[roomname].controller.level >4)
            {
                Game.spawns[roomname].spawning.setDirections([RIGHT,TOP_RIGHT,BOTTOM_RIGHT]);
                
            }
            
        }
      
        if (Game.time % 5 == 0  || defconstruct.defenceLevel < 10)
        {
            var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
            var energycurrentlyavailable = Game.rooms[roomname].energyAvailable;
           
            var repairers = _.filter(creepsinroom, (creep) => creep.memory.role == 'repair');
            var towermover = _.filter(creepsinroom, (creep) => creep.memory.role == 'towermover');
            var harvesters = _.filter(creepsinroom, (creep) => creep.memory.role == 'harvester');
            var movers = _.filter(creepsinroom, (creep) => creep.memory.role == 'mover');
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
                moveToRenew: false,
                opportuniticRenew: true,
                hastask: false,
                full:false,
                wantsToJoinSquad:false,
                isInSquad:false,
                SquadID:"0",
                SquadRole:false
            };
            
            
        if(defconstruct.defenceLevel == 9 || ( movers.length ==0 || harvesters.length ==0) && creepsinroom.length < 5){
            var jacks = _.filter(creepsinroom, (creep) => creep.memory.role == 'jack');
                     if (jacks.length < 5  )
                    {  
                        var numberofparts = Math.floor(energycurrentlyavailable / 350);//bugged
                        var bodyparts = [];
                        for (let i = 0; i < numberofparts; i++)
                        {
                            bodyparts.push(WORK);
                            bodyparts.push(CARRY);
                            bodyparts.push(CARRY);
                            bodyparts.push(MOVE);
                            bodyparts.push(MOVE);
                            bodyparts.push(MOVE);
                        }
                         
                        
                        if(numberofparts ==0 ){bodyparts=[WORK,MOVE,CARRY];}
                        Game.spawns[roomname].spawnCreep(bodyparts, 'jack' + Game.time,
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
                     
            
            
            
        }else if(defconstruct.defenceLevel  > 10) {
            // support spawning here
            
            
        }else if(defconstruct.defenceLevel  ==10){
            standardspawning.run(roomname, defconstruct, storagevalue, roomExits, creepsinroom,energyavailable,energycurrentlyavailable,jacks,repairers,towermover,harvesters,movers,upgraders,resourcemover,extractor,nextroomharvester,scouts,numberofguardingcreeps,memstruct);
            
            
        }else if(defconstruct.defenceLevel  < 10){
            attackspawning.run(roomname, defconstruct, storagevalue , creepsinroom,energyavailable,energycurrentlyavailable,jacks,repairers,towermover,harvesters,movers,upgraders,resourcemover,extractor,nextroomharvester,scouts,numberofguardingcreeps,memstruct);
            
            
            
            
        }
        
        
        
        
        
         
            
            
            
            
            
            
            
            
        }
    }
}
module.exports = spwan;