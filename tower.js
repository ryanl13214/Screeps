var tower = {
    run: function(roomname) {
        
        
         
        var towers = Game.flags[roomname].room.find(FIND_STRUCTURES, 
        {
            filter: (s) => 
            {
                return (s.structureType == STRUCTURE_TOWER);
            }
        });
         
    
    for(var i =0 ; i < towers.length;i++){
     var closestHostile = towers[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    
        var closestDamagedStructure = towers[i].room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax * 0.2 && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART
        });
        if(closestDamagedStructure.length == 0 ) {
                   var closestDamagedStructure = towers[i].room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < 20000 && (structure.structureType == STRUCTURE_RAMPART)
            });
        }
   
        
        if(closestDamagedStructure.length != 0 && closestHostile== undefined) {
            towers[i].repair(closestDamagedStructure[0]);
        }

        
        if(closestHostile) {
            towers[i].attack(closestHostile);
        }
    }
        
        
        
        
        
    }
}

module.exports = tower;



