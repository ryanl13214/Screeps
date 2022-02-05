var outriderRoomHarraser = {
   
    pickTargetRoom: function(creep)
    {
    
   //    todo. kill keeps with a valid path that are no0t under ramparts 
       
    //   if no creeps to target then attack ramparts outside of close tower range. 
    
    
 var targets = [];
             var warList = Object.keys(Memory.hostileempires[warList[i]]);
         for(var i = 0; i < warList.length; i++)
    {
        if (Memory.hostileempires[warList[i]].currentRelationship == "war")
        {
        
            for(var ii = 0; ii < Memory.hostileempires[warList[i]].listOFminingRooms.length; ii++)
            {
                if(Memory.hostileempires[warList[i]].listOFminingRooms[ii] != creep.room.name)
                {
                     targets.push(Memory.hostileempires[warList[i]].listOFminingRooms[ii])// add list of rooms with confirmed hositiles in them and 
                }
                   
            }
    
        }  
    }
       
        
        
        
    },
    decideToRetreatFromRoomAnjdMoveToAnotherRoom: function(creep)
    {
        
    },
 
      attacker: function(creep)
    {
        
        
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
if(target) {
    if(creep.attack(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
}else{
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES);
if(target) {
    if(creep.attack(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
}

    
    
    
    
    
}




        
        
    },
    
    run: function(creep)
    {
  if(!creep){
      return 0;
  }
       
                   if (creep.memory.attackrole == "ranger")
                        {
                            
                           
                        }
               if (creep.memory.attackrole == "dis")
                        {
                            
                           
                        }
              if (creep.memory.attackrole == "atk")
                        {
                            this.attacker(creep)
                           
                        }
                           if (creep.memory.attackrole == "drop")
                        {
                            
                           
                        }
      this.decideToRetreatFromRoomAnjdMoveToAnotherRoom(creep);
    } 
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
};
module.exports = outriderRoomHarraser;