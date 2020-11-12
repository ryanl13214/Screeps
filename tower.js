var tower = {
    run: function(roomname)
    {
        var towers = Game.rooms[roomname].find(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return (s.structureType == STRUCTURE_TOWER);
            }
        });
        for (var i = 0; i < towers.length; i++)
        {
            
            
            Game.map.visual.rect(new RoomPosition(towers[i].pos.x - 5, towers[i].pos.y - 5, towers[i].pos.roomName),     11, 11,    {fill: 'transparent', stroke: '#ff0000'});
            
            
            
            var closestHostile = towers[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var closestDamagedStructure = towers[i].pos.findInRange(FIND_STRUCTURES, 5,
            {
                filter: (structure) => (structure.hits < structure.hitsMax * 0.1) && structure.structureType != STRUCTURE_WALL
            });
            var initalbuild = towers[i].room.find(FIND_MY_STRUCTURES, 
            {
                filter: (structure) => (structure.hits < 300) && structure.structureType == STRUCTURE_RAMPART    
            });
            var woundedCreeps = Game.rooms[roomname].find(FIND_MY_CREEPS,
            {
                filter: (structure) => (structure.hits < structure.hitsMax) 
            });
            
            if (closestHostile != undefined)
            {
                towers[i].attack(closestHostile);
            }
            else if (woundedCreeps.length != 0)
            {
                towers[i].heal(woundedCreeps[0]);
            }
            else if (closestDamagedStructure.length != 0 && towers[i].store.getUsedCapacity() > 200)
            {
                towers[i].repair(closestDamagedStructure[0]);
            }
            else if (initalbuild.length != 0  )
            {
                towers[i].repair(initalbuild[0]);
            }
        }
    }
}
module.exports = tower;