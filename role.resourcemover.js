var roleresourcemover = {

    
    run: function(creep) {
        
    
 
    
    
    
    
    
   //     var sources = creep.room.find(FIND_STRUCTURES, { filter: (structure) =>{return (structure.structureType == STRUCTURE_CONTAINER);}}); 
      // creep.say(sources.length); 
	  var sources = creep.room.find(FIND_STRUCTURES, { filter: (structure) =>{return (structure.structureType == STRUCTURE_STORAGE);}}); 
	
    if(creep.carry.energy == 0  )
    {
    creep.memory.working = false;
    } else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) 
    {
    creep.memory.working = true;
    }
	
	if(creep.memory.working == false)
	{	    

        if(creep.withdraw(creep.pos.findClosestByRange(sources), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        {
        creep.moveTo(creep.pos.findClosestByRange(sources), {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
           
    if(creep.memory.working == true)
    {   
       var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) =>{return (structure.structureType == STRUCTURE_TOWER    ) && structure.energy <500;}});
    
    if(targets == null){   var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) =>{return (structure.structureType == STRUCTURE_SPAWN   ) && structure.store.energy <300;}});}
      
      
        if(creep.transfer(targets[0] ,RESOURCE_ENERGY, creep.energyAvailable) == ERR_NOT_IN_RANGE) 
        {
        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
    
        
}};
module.exports = roleresourcemover;

