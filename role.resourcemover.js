var roleresourcemover = {

    
    run: function(creep) {


 
    if(creep.carry.energy == 0  )
    {
        creep.memory.working = false;
    } 
    else if (creep.memory.working == false && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) 
    {
        creep.memory.working = true;
    }
	  var flagmid = Game.flags[creep.room.name];
	
    creep.moveTo(new RoomPosition(flagmid.pos.x-1, flagmid.pos.y, creep.room.name), {visualizePathStyle: {stroke: '#ffaa00'}});
 
	if(creep.memory.working == false)
	{	    
   var  storagemain = creep.pos.findClosestByPath(LOOK_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_STORAGE) && structure.store.getCapacity(RESOURCE_ENERGY) < structure.store.getCapacity();
                    }
                });
         var sourcelink = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_LINK)  ;
                    }
                });
        if(storagemain!=undefined){  
              
            const resourcekeys = Object.keys(storagemain.store);
            for(var i = 0 ; i < resourcekeys.length ; i++){ 
                if(resourcekeys[i] != "energy")
                { 
                    creep.withdraw(storagemain, resourcekeys[i]);
                }
            }
            
            
        }
        else
        {
                   creep.withdraw(sourcelink, RESOURCE_ENERGY) ;
          
            
            
        }
        
        
    }

    
      
    
    
    if(creep.memory.working == true)
    {    var  ofloadcontainer;
        var flagmain = Game.flags[creep.room.name];
        var temp = Game.rooms[creep.room.name].lookForAt(LOOK_STRUCTURES , flagmain.pos.x - 2  , flagmain.pos.y +1);
            for(var i = 0 ; i < temp.length ; i ++ )
            {
                 if(temp[i].structureType == STRUCTURE_CONTAINER){ofloadcontainer= temp[i];}
            }
  
      
    
       // var linkto = Game.rooms[roomname].lookForAt('structure', storage_xpos - 2  , storage_ypos -1 )[0];
      
      
   creep.transfer(ofloadcontainer, RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY));
                
      
      
    }












































 
    }
};
module.exports = roleresourcemover;

