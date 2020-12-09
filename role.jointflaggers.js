var rolecontrollerflagger = {

 run: function(creep) {



    if(creep.memory.target=="source1")
    {
       
        creep.moveTo(creep.room.find(FIND_SOURCES)[0], {visualizePathStyle: {stroke: '#ffffff'}});
      
      
        if(creep.pos.inRangeTo(creep.room.find(FIND_SOURCES)[0], 1)) 
        {
           creep.room.createFlag(creep.pos.x, creep.pos.y, creep.room.name+'source0');
        }
        else if(creep.pos.inRangeTo(creep.room.find(FIND_SOURCES)[0], 2)) 
        {
           creep.room.createFlag(creep.pos.x, creep.pos.y, creep.room.name+'container0');
        }
 
        
 
    }
    
    
    
    if(creep.memory.target=="source2")
    {
        creep.moveTo(creep.room.find(FIND_SOURCES)[1], {visualizePathStyle: {stroke: '#ffffff'}});
      
        if(creep.pos.inRangeTo(creep.room.find(FIND_SOURCES)[1], 1)) 
        {
           creep.room.createFlag(creep.pos.x, creep.pos.y, creep.room.name+'source1');//
        }
        
        if(creep.pos.inRangeTo(creep.room.find(FIND_SOURCES)[1], 2)) 
        {
          creep.room.createFlag(creep.pos.x, creep.pos.y, creep.room.name+'container1');
        }
    }

    if(creep.memory.target=="mins")
    {
        creep.moveTo(creep.room.find(FIND_SOURCES)[1], {visualizePathStyle: {stroke: '#ffffff'}});
      
        if(creep.pos.inRangeTo(creep.room.find(FIND_SOURCES)[1], 1)) 
        {
           creep.room.createFlag(creep.pos.x, creep.pos.y, creep.room.name+'source1');
        }
        
        if(creep.pos.inRangeTo(creep.room.find(FIND_SOURCES)[1], 2)) 
        {
          creep.room.createFlag(creep.pos.x, creep.pos.y, creep.room.name+'container1');
        }
    }
    
    if(creep.memory.target=="controller")
    {
        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
      
        if(creep.pos.inRangeTo(creep.room.controller, 1)) 
        {
           creep.room.createFlag(creep.pos.x, creep.pos.y, creep.room.name+'controllerpos');
        }
        
        if(creep.pos.inRangeTo(creep.room.controller, 2)) 
        {
          creep.room.createFlag(creep.pos.x, creep.pos.y, creep.room.name+'controllercontainer');
        }
    }





}


};
module.exports = rolecontrollerflagger;


























