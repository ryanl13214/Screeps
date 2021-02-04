/*

if full of energy then do tasks in following order
1 stockbuildingswithenergy
2 repairbuildings
3 buildstructs
4 upgradecontroller
 
if not do the following oin order
1 withdraw from containser with more than 1000 energy 
2 harvet energy 
 

*/
var creepfunctions = require('prototype.creepfunctions');
var rolejack = {
    run: function(creep)
    {
         
        var startCpujack = Game.cpu.getUsed();
        var check = creepfunctions.checkglobaltasks(creep);
        //   checklocaltasks(creep);
        if(check)
        { //move the global takslis t check here
       
         
          if(creep.memory.full  == undefined)// only runs after taslkist is empty sdo it can go to room and rthen set opperatrional room.
          {
             creep.memory.full =false;
             creep.memory.sourcetarget=0;
             creep.memory.roomtarg = creep.room.name;
          }
         
         
            if(creep.memory.full == true && creep.carry.energy == 0)
            {
                creep.memory.full = false;
            }
            if(creep.memory.full != true && creep.carry.energy == creep.carryCapacity)
            {
                creep.memory.full = true;
                creep.memory.sourcetarget = (creep.memory.sourcetarget + 1) % 2;
            }
            if(creep.memory.full == false)
            {
                creep.memory.hastask = false;
                if(!creep.memory.hastask)
                {
                  //  creepfunctions.findDroppedEnergy(creep);
                }
                if(!creep.memory.hastask)
                {
                    var containers = creep.pos.findClosestByRange(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (((structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy > 1800) || ((structure.structureType == STRUCTURE_LINK) && structure.store.energy > 500) || ((structure.structureType == STRUCTURE_STORAGE) && structure.store.energy > 500));
                        }
                    });
                    if(containers != undefined)
                    {
                        var range = creep.pos.getRangeTo(containers);
                        if(range <= 1)
                        {
                            creep.withdraw(containers, RESOURCE_ENERGY);
                        }
                        else
                        {
                            creep.say("a");
                            creep.moveTo(containers,
                            {
                                reusePath: range,
                                visualizePathStyle:
                                {
                                    stroke: '#ffaa00'
                                }
                            });
                        }
                        creep.memory.hastask = true;
                    }
                }
                if(!creep.memory.hastask)
                {
                    var sources = creep.room.find(FIND_SOURCES);
                    
                      var range = creep.pos.getRangeTo(sources[creep.memory.sourcetarget]);
                        if(range <= 1)
                        {
                           creep.harvest(sources[creep.memory.sourcetarget]);
                        }
                        else
                        {
                            creep.moveTo(sources[creep.memory.sourcetarget],
                            {
                                visualizePathStyle:
                                {
                                    stroke: '#ffaa00'
                                }
                            });
                        }
              
                }
            }
            if(creep.memory.full == true)
            {
                creep.memory.lastpos = creep.room.pos;
                creep.memory.hastask = false;
                if(!creep.memory.hastask)
                {
                    //    if (!creep.memory.hastask) {
                    //      creepfunctions.stocktowerswithenergy(creep);
                    //     }
                    if(!creep.memory.hastask)
                    {
                        creepfunctions.stockbuildingswithenergy(creep);
                    }
                    if(!creep.memory.hastask)
                    {
                        creepfunctions.repairbuildings(creep);
                    }
                    if(!creep.memory.hastask)
                    {
                        creepfunctions.buildstructs(creep);
                    }
                    if(!creep.memory.hastask && creep.room.controller.ticksToDowngrade > 3000 && creep.room.controller.level > 4)
                    {
                        creepfunctions.stockstorage(creep);
                    }
                    if(!creep.memory.hastask)
                    {
                        creepfunctions.upgradecontroller(creep);
                    }
                }
            }
        }
        creep.memory.cpuUsed = creep.memory.cpuUsed + (Game.cpu.getUsed() - startCpujack);
        if(creep.ticksToLive == 1)
        {
            // ?       console.log("jack cpu avg-" + (creep.memory.cpuUsed / 1500));
        }
        var target = creep.room.find(FIND_MY_CREEPS);
        try
        {
            if(creep.room.storage.store.getUsedCapacity("energy") > 10000 && target.length > 8 && creep.memory.memstruct.tasklist.length == 0)
            {
                creep.suicide();
            }
        }
        catch (e)
        {}
      //  creep.say(creep.memory.full);
        try
        {
            //   creepfunctions.movehomeandrenew(creep,creep.room.name,100);
        }
        catch (e)
        {}
    }
};
module.exports = rolejack;