var roleclaimer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        //     this role is for moving energy from full containers to other areas within the same room    
         
if (creep.memory.targroom == creep.room.name) {  
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
            }
        }else{
    
    
    
    
  if(creep.memory.memstruct.route != ""){
        
        creep.moveByPath(creep.memory.memstruct.route);
    }else{
    
    
     creep.moveTo(Game.flags["W31S13"].pos, {
                            visualizePathStyle: {
                                stroke: '#ffaa00'
                            }
                        });
    }
    
}
    }
};
module.exports = roleclaimer;