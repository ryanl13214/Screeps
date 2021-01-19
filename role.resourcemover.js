 /*
if there is energy in the link then withdraw it 
if the energy level of the terminal is over 51,000 withdraw energy from it
*/
 var creepfunctions = require('prototype.creepfunctions');
 var roleresourcemover = {
     run: function(creep)
     {
         if (creep.store.getFreeCapacity() == creep.store.getCapacity())
         {
             creep.memory.creepIsFull = false;
         }
         else if (creep.memory.creepIsFull == false && creep.store.getFreeCapacity() == 0)
         {
             creep.memory.creepIsFull = true;
         }
         var flagmid = Game.flags[creep.room.name];
         creep.moveTo(new RoomPosition(flagmid.pos.x - 1, flagmid.pos.y - 1, creep.room.name),
         {
             visualizePathStyle:
             {
                 stroke: '#ffaa00'
             }
         });
         if (Game.time % 25 == 0 && creep.memory.neededBoost != "")
         {
             var flagmain = Game.flags[creep.room.name];
             var boostlab;
             var temp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, flagmain.pos.x - 2, flagmain.pos.y - 2);
             for (var i = 0; i < temp.length; i++)
             {
                 if (temp[i].structureType == STRUCTURE_LAB)
                 {
                     boostlab = temp[i];
                 }
             }
             var resourcekeys = Object.keys(boostlab.store);
             var creeplist = boostlab.pos.findInRange(FIND_MY_CREEPS, 1);
             if (creeplist[0] != undefined)
             {
                 if (creeplist[0].name == "resourcemover" + creep.room.name)
                 {
                     creeplist.splice(0, 1);
                 }
             }
             if (creeplist[0] != undefined)
             {
                 if(creeplist[0].memory.memstruct.tasklist.length !=0){
                 if (creeplist[0].memory.memstruct.tasklist[0][1] != resourcekeys[0])
                 {
                     creep.memory.neededBoost = "cleanup";
                     console.log("cleanup");
                 }
                 }
             }
             if (creeplist.length == 0 && resourcekeys.length != 0)
             {
                 creep.memory.neededBoost = "cleanup";
                 console.log("cleanup");
             }
         }
         if (creep.memory.neededBoost == "")
         {
             if (creep.memory.creepIsFull == false)
             {
                 var storagemain = creep.pos.findClosestByPath(FIND_STRUCTURES,
                 {
                     filter: (structure) =>
                     {
                         return (structure.structureType == STRUCTURE_STORAGE && structure.store.getUsedCapacity("energy") < structure.store.getUsedCapacity());
                     }
                 });
                 var overflowingterminal = creep.pos.findClosestByPath(FIND_STRUCTURES,
                 {
                     filter: (structure) =>
                     {
                         return (structure.structureType == STRUCTURE_TERMINAL && structure.store.getUsedCapacity("energy") > 60000);
                     }
                 });
                 if (storagemain != undefined && creep.room.terminal.store.getFreeCapacity() != 0)
                 {
                     const resourcekeys = Object.keys(storagemain.store);
                     for (var i = 0; i < resourcekeys.length; i++)
                     {
                         if (resourcekeys[i] != "energy")
                         { // creep.say(resourcekeys[i]);
                             creep.withdraw(storagemain, resourcekeys[i]);
                         }
                     }
                 }
                 else
                 {
                     var sourcelink = creep.pos.findClosestByPath(FIND_STRUCTURES,
                     {
                         filter: (structure) =>
                         {
                             return (structure.structureType == STRUCTURE_LINK);
                         }
                     });
                     var ofloadcontainer;
                     var flagmain = Game.flags[creep.room.name];
                     var temp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, flagmain.pos.x - 1, flagmain.pos.y);
                     for (var i = 0; i < temp.length; i++)
                     {
                         if (temp[i].structureType == STRUCTURE_CONTAINER)
                         {
                             ofloadcontainer = temp[i];
                         }
                     }
                     if (ofloadcontainer == undefined)
                     {
                         // build stucture
                     }
                     else
                     if (sourcelink.store.getUsedCapacity("energy") == 0 && overflowingterminal != undefined)
                     {
                         creep.withdraw(overflowingterminal, RESOURCE_ENERGY);
                     }
                     else if (ofloadcontainer.store.getUsedCapacity() != 2000 && sourcelink.store.getUsedCapacity("energy") == 0)
                     {
                         var storagemain = creep.pos.findClosestByPath(FIND_STRUCTURES,
                         {
                             filter: (structure) =>
                             {
                                 return (structure.structureType == STRUCTURE_STORAGE);
                             }
                         });
                         creep.withdraw(storagemain, RESOURCE_ENERGY);
                     }
                     else
                     {
                         creep.withdraw(sourcelink, RESOURCE_ENERGY);
                     }
                 }
             }
             if (creep.memory.creepIsFull == true)
             {
                 if (creep.store.getUsedCapacity("energy") < creep.store.getUsedCapacity() && creep.room.terminal.store.getFreeCapacity() > 500)
                 {
                     creep.say("term");
                     var ofloadcontainer;
                     var flagmain = Game.flags[creep.room.name];
                     var temp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, flagmain.pos.x - 2, flagmain.pos.y - 1);
                     for (var i = 0; i < temp.length; i++)
                     {
                         if (temp[i].structureType == STRUCTURE_TERMINAL)
                         {
                             ofloadcontainer = temp[i];
                         }
                     }
                     // var linkto = Game.rooms[roomname].lookForAt('structure', storage_xpos - 2  , storage_ypos -1 )[0];
                     const resourcevalues = Object.values(creep.store);
                     const resourcekeys = Object.keys(creep.store);
                     creep.transfer(ofloadcontainer, resourcekeys[0], resourcevalues[0]);
                 }
                 else if (creep.store.getUsedCapacity("energy") < creep.store.getUsedCapacity() && creep.room.terminal.store.getFreeCapacity() < 500)
                 {
                     var ofloadcontainer;
                     var flagmain = Game.flags[creep.room.name];
                     var temp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, flagmain.pos.x, flagmain.pos.y);
                     for (var i = 0; i < temp.length; i++)
                     {
                         if (temp[i].structureType == STRUCTURE_STORAGE)
                         {
                             ofloadcontainer = temp[i];
                         }
                     }
                     // var linkto = Game.rooms[roomname].lookForAt('structure', storage_xpos - 2  , storage_ypos -1 )[0];
                     const resourcevalues = Object.values(creep.store);
                     const resourcekeys = Object.keys(creep.store);
                     creep.transfer(ofloadcontainer, resourcekeys[0], resourcevalues[0]);
                 }
                 else
                 {
                     var lowEnergySpawns = creep.pos.findInRange(FIND_STRUCTURES, 1,
                     {
                         filter: (structure) =>
                         {
                             return (structure.structureType == STRUCTURE_SPAWN && structure.energy < 300);
                         }
                     });
                     var ofloadcontainer;
                     var flagmain = Game.flags[creep.room.name];
                     var temp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, flagmain.pos.x - 1, flagmain.pos.y);
                     for (var i = 0; i < temp.length; i++)
                     {
                         if (temp[i].structureType == STRUCTURE_CONTAINER)
                         {
                             ofloadcontainer = temp[i];
                         }
                     }
                     // var linkto = Game.rooms[roomname].lookForAt('structure', storage_xpos - 2  , storage_ypos -1 )[0];
                     if (ofloadcontainer.store.getUsedCapacity() < 2000)
                     {
                         var transfervalue;
                         if (ofloadcontainer.store.getFreeCapacity() - creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
                         {
                             transfervalue = creep.store.getUsedCapacity(RESOURCE_ENERGY);
                         }
                         else
                         {
                             transfervalue = ofloadcontainer.store.getFreeCapacity();
                         }
                         creep.transfer(ofloadcontainer, RESOURCE_ENERGY, transfervalue);
                     }
                     else if (lowEnergySpawns.length != 0)
                     {
                         var transverAmount = lowEnergySpawns[0].store.getFreeCapacity();
                         if (transverAmount > creep.store.getUsedCapacity())
                         {
                             transverAmount = creep.store.getUsedCapacity();
                         }
                         creep.transfer(lowEnergySpawns[0], RESOURCE_ENERGY, transverAmount);
                     }
                     else
                     {
                         var closestDamagedStructure = creep.pos.findInRange(FIND_STRUCTURES, 1,
                         {
                             filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL
                         });
                         var sourcelink = creep.pos.findInRange(FIND_STRUCTURES, 1,
                         {
                             filter: (structure) =>
                             {
                                 return (structure.structureType == STRUCTURE_LINK);
                             }
                         });
                         if (closestDamagedStructure.length != 0 && creep.room.storage.store.getUsedCapacity() > 995000 && sourcelink != undefined)
                         {
                             var tmp = 0;
                             var value = 9999999999999999999;
                             for (var i = 0; i < closestDamagedStructure.length; i++)
                             {
                                 if (closestDamagedStructure[i].hits < value)
                                 {
                                     value = closestDamagedStructure[i].hits;
                                     tmp = i;
                                 }
                             }
                             creep.repair(closestDamagedStructure[tmp]);
                         }
                         else
                         {
                             var storagemain = creep.room.storage;
                             creep.transfer(storagemain, RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY));
                         }
                     }
                 }
             }
         }
         else
         {
             if (creep.memory.neededBoost != "cleanup")
             {
                 if (creep.memory.creepIsFull == false)
                 {
                     creep.withdraw(creep.room.terminal, creep.memory.neededBoost);
                     // withdraw boost from terminal
                     creep.memory.creepIsFull = true;
                 }
                 if (creep.memory.creepIsFull == true)
                 {
                     if (creep.store.getUsedCapacity(creep.memory.neededBoost) != 0)
                     {
                         var flagmain = Game.flags[creep.room.name];
                         var boostlab;
                         var temp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, flagmain.pos.x - 2, flagmain.pos.y - 2);
                         for (var i = 0; i < temp.length; i++)
                         {
                             if (temp[i].structureType == STRUCTURE_LAB)
                             {
                                 boostlab = temp[i];
                             }
                         }
                         //creep.say(boostlab.id);
                         //transfer boost to lab
                         creep.transfer(boostlab, creep.memory.neededBoost, creep.store.getUsedCapacity(creep.memory.neededBoost));
                     }
                     else
                     {
                         //dump rest into storage
                         creep.transfer(creep.room.storage, RESOURCE_ENERGY);
                     }
                 }
             }
             else
             {
                 if (creep.memory.creepIsFull == false)
                 {
                     creep.say("q");
                     var flagmain = Game.flags[creep.room.name];
                     var boostlab;
                     var temp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, flagmain.pos.x - 2, flagmain.pos.y - 2);
                     for (var i = 0; i < temp.length; i++)
                     {
                         if (temp[i].structureType == STRUCTURE_LAB)
                         {
                             boostlab = temp[i];
                         }
                     }
                     const resourcekeys = Object.keys(boostlab.store);
                     for (var i = 0; i < resourcekeys.length; i++)
                     {
                         if (resourcekeys[i] != "energy")
                         { // creep.say(resourcekeys[i]);
                             creep.withdraw(boostlab, resourcekeys[i]);
                             creep.memory.creepIsFull = true;
                         }
                     }
                 }
                 if (creep.memory.creepIsFull == true)
                 {
                     creep.say("qo");
                     const resourcekeys = Object.keys(creep.store);
                     for (var i = 0; i < resourcekeys.length; i++)
                     {
                         if (resourcekeys[i] != "energy")
                         { // creep.say(resourcekeys[i]);
                             if (creep.room.terminal.store.getFreeCapacity() != 0)
                             {
                                 creep.transfer(creep.room.terminal, resourcekeys[i]);
                             }
                             else
                             {
                                 creep.transfer(creep.room.storage, resourcekeys[i]);
                             }
                         }
                     }
                 }
                 var flagmain = Game.flags[creep.room.name];
                 var boostlab;
                 var temp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES, flagmain.pos.x - 2, flagmain.pos.y - 2);
                 for (var i = 0; i < temp.length; i++)
                 {
                     if (temp[i].structureType == STRUCTURE_LAB)
                     {
                         boostlab = temp[i];
                     }
                 }
                 const resourcekeys = Object.keys(boostlab.store);
                 if (resourcekeys.length == 1)
                 {
                     creep.memory.neededBoost = "";
                 }
             }
         }
     }
 };
 module.exports = roleresourcemover;