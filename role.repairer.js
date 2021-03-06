var creepfunctions = require('prototype.creepfunctions');


var rolerepair = {
  
    run: function(creep) {
        var startCpurepair = Game.cpu.getUsed();
        //checkglobaltasks(creep);
        //checklocaltasks(creep);
        if (creep.memory.memstruct.tasklist.length == 0) {
            
            if (creep.memory.full == true && creep.carry.energy == 0) {
                creep.memory.full = false;
            }
            
            if (creep.memory.full != true && creep.carry.energy == creep.carryCapacity) {
                creep.memory.full = true;
                creep.memory.sourcetarget= (creep.memory.sourcetarget+1)%2;
            }
            
            if (!creep.memory.full) {
                creep.memory.hastask = false;
                if (!creep.memory.hastask) {
                    creepfunctions.findfullcontainers(creep,500);
                }
                
                if (!creep.memory.hastask) {
                    creep.say("a");
                    var sources = creep.room.find(FIND_SOURCES);
                    if (creep.harvest(sources[creep.memory.sourcetarget]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[creep.memory.sourcetarget], {
                            visualizePathStyle: {
                                stroke: '#ffaa00'
                            }
                        });
                    }
                }
            }
            
            
            
            
            if (creep.memory.full) 
            {
                
       var target =creep.room.find(FIND_HOSTILE_CREEPS);
       
       
      var    targe2 = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var structuresclosetoenemys =[];
        if( targe2!=undefined  ){
                var structuresclosetoenemys = targe2.pos.findInRange(FIND_STRUCTURES, 3,
                        {
                            filter: (structure) => ( structure.structureType == STRUCTURE_WALL ||  structure.structureType == STRUCTURE_RAMPART)
                        });
                    
        }
       
       
       
                if(structuresclosetoenemys.length ==0){
                
                creep.memory.hastask = false;
                if (!creep.memory.hastask) 
                {
                    if (!creep.memory.hastask) 
                    {
                         creepfunctions.buildstructs(creep);
                    }
                    if (!creep.memory.hastask) 
                    {
                        creepfunctions.repairbuildingsfull(creep);
                    }
                    if (!creep.memory.hastask) 
                    {
                        creepfunctions.upkeepwalls(creep);
                    }
                }
                }else{
                    
                    
                  
                  
                      if (structuresclosetoenemys.length !=0 ) {
                          
                          
                          
                             var tmp=0;
        var  value=9999999999999999999;
          
        for (var i = 0; i < structuresclosetoenemys.length; i++)
        {
            if(structuresclosetoenemys[i].hits <value)
            {
                value = structuresclosetoenemys[i].hits;
                tmp = i ;
            }
        }
                          
                          
                          
            var range = creep.pos.getRangeTo(structuresclosetoenemys[tmp]);
            if (range <= 3) {
                creep.repair(structuresclosetoenemys[tmp]);
            } else {
                creep.moveTo(structuresclosetoenemys[tmp], {
                    reusePath: 5
                });
            }
                    
                
                
                
            }
        }
            }
        creep.memory.cpuUsed =    creep.memory.cpuUsed+ (Game.cpu.getUsed() - startCpurepair);
        if(creep.ticksToLive ==1)
        {
        //    console.log("repairer cpu avg-"+(creep.memory.cpuUsed/1500));
        }
  //      creepfunctions.movehomeandrenew(creep,creep.memory.memstruct.spawnRoom,100);
        
    }
    }
};
module.exports = rolerepair;


 







