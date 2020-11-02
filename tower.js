var tower = {
    run: function(roomname)
    {
        var towers = Game.flags[roomname].room.find(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return (s.structureType == STRUCTURE_TOWER);
            }
        });
        for (var i = 0; i < towers.length; i++)
        {
            var closestHostile = towers[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
              var closestDamagedStructure = towers[i].pos.findInRange(FIND_STRUCTURES,5,
            {   filter: (structure) => (structure.hits < structure.hitsMax * 0.1) && structure.structureType != STRUCTURE_WALL 
            });
            
          
            
            
            if (closestHostile != undefined)
            { 
                towers[i].attack(closestHostile);
            }
            else if (closestDamagedStructure.length != 0  )
            {
                towers[i].repair(closestDamagedStructure[0]);
            }
        }
    }
}
module.exports = tower;