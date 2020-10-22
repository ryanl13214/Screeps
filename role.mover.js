var roleMover = {

    //     this role is for moving energy from full containers to other areas within the same room    



    run: function(creep) {


        const startCpu = Game.cpu.getUsed();

        // creep logic goes here

        if (creep.carry.energy == 0) 
        {
            creep.memory.full = false;
        } 
        else if (creep.memory.full == false && _.sum(creep.carry) == creep.carryCapacity) 
        {
            creep.memory.full = true;
              creep.memory.target = "a";
        }

 

        if (creep.memory.full == false) {
            var storagemain;
            var links ;
            var containers ;
                
            var droppedresources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{filter: (res) => {return   res.amount > 150;}});// filter by distance to ssee if it is actually worth picking up
    
            if(droppedresources == undefined && creep.memory.target == "a"  )
            { 
                storagemain = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE) && structure.store.energy > 700000;}});
                links = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => {return (structure.structureType == STRUCTURE_LINK) && structure.energy > 400;  }});
                containers = creep.pos.findClosestByRange(FIND_STRUCTURES, {  filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy > 1600;}});
             
                if (containers != undefined) 
                {
                    creep.memory.target=containers.id;
                }
                else if (links!= undefined) 
                { 
                    creep.memory.target=links.id;
                }
                else if(storagemain != undefined)
                {
                    creep.memory.target=storagemain.id;
                } 
            
            }
          
            if (droppedresources != undefined) {
                 
                if (creep.pickup(droppedresources) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(droppedresources, {reusePath: 10});
                }
            }
            else if(  creep.memory.target != undefined)
            { 
                var object = Game.getObjectById(creep.memory.target);
                var errorcode = creep.withdraw(object, RESOURCE_ENERGY);
                if (errorcode  != 0) 
                {  
                    var moveerrorcode =  creep.moveTo(object  , {reusePath: 10});
                }
                else if(errorcode ==0 || errorcode == -7 )
                {  
                    creep.memory.target = "a";
                }
            }
        }
        
        
        
/////////////////////////////////////////////////////////////////////////////////////////////////////
        if (creep.memory.full == true) {
             
            var targets2 = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy != structure.energyCapacity;
                }
            });
            var targets4 = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy < 1000;
                }
            });
            var targets5 = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE);
                }
            });
            var terminal = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TERMINAL) && structure.store.energy < 50000;
                }
            });
            var targ;
            if (targets2 != undefined) {
                targ = targets2;
            } else if (terminal != undefined) {
                targ = terminal;
            } else if (targets4 != undefined) {
                targ = targets4;
            } else if (targets5 != undefined) {
                targ = targets5;
            } 
 
            
            
            
            if (creep.transfer(targ, RESOURCE_ENERGY, creep.energyAvailable) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targ, {
                    reusePath: 50
                });
            }
        }
        creep.memory.cpuUsed = creep.memory.cpuUsed + (Game.cpu.getUsed() - startCpu);
        if (creep.ticksToLive == 1) {
            console.log("mover cpu avg-" + (creep.memory.cpuUsed / 1500));
        }
    }
};
module.exports = roleMover;