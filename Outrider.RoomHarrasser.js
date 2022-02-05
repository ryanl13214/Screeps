var outriderRoomHarraser = {
   
    pickTargets: function(creep)
    {
    
   //    todo. kill keeps with a valid path that are no0t under ramparts 
       
    //   if no creeps to target then attack ramparts outside of close tower range. 
    
    
 
             var roomsall = Object.keys(Game.rooms);
         for(var i = 0; i < warList.length; i++)
    {
        if (Memory.hostileempires[warList[i]] != undefined)
        {
            Memory.hostileempires[warList[i]].currentRelationship = "war";
            
    
    
        }  
    }
       
        
        
        
    },
    decideToRetreatFromRoomAnjdMoveToAnotherRoom: function(creep)
    {
        
    },
    
        leaveRoomToHeal: function(creep)
    {
        
    },
    
    
    
    run: function(creep)
    {
  
       
       
       
       
       
       
       this.leaveRoomToHeal(creep);
      this.decideToRetreatFromRoomAnjdMoveToAnotherRoom(creep);
    } 
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
};
module.exports = outriderRoomHarraser;