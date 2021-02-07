var tower = {
    run: function(roomname , storagevalue)
    {
        var towers = Game.rooms[roomname].find(FIND_STRUCTURES,
        {
            filter: (s) =>
            {
                return (s.structureType == STRUCTURE_TOWER);
            }
        });
    
            var woundedCreeps = Game.rooms[roomname].find(FIND_MY_CREEPS,
            {
                filter: (structure) => (structure.hits < structure.hitsMax) 
            });
            
            var fullbuild = Game.rooms[roomname].find(FIND_STRUCTURES, 
            {
                filter: (structure) => (structure.hits < structure.hitsMax  &&  structure.structureType == STRUCTURE_RAMPART)  || ( structure.hits < structure.hitsMax  &&    structure.structureType == STRUCTURE_WALL   )
            });
        
        var tmp=0;
        var  value=9999999999999999999;
          
        for (var i = 0; i < fullbuild.length; i++)
        {
            if(fullbuild[i].hits <value)
            {
                value = fullbuild[i].hits;
                tmp = i ;
            }
        }
       
        
        for (var i = 0; i < towers.length; i++)
        {
            
            
            var closestHostile = towers[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var closestDamagedStructure = towers[i].pos.findInRange(FIND_STRUCTURES, 5,
            {
                filter: (structure) => (structure.hits < structure.hitsMax * 0.1) && structure.structureType != STRUCTURE_WALL
            });
            var woundedPowerCreeps = Game.rooms[roomname].find(FIND_MY_POWER_CREEPS,
            {
                filter: (structure) => (structure.hits < structure.hitsMax) 
            });
            
            const range = towers[i].pos.getRangeTo(closestHostile);
             if (woundedCreeps.length != 0)
            {
                towers[i].heal(woundedCreeps[0]);
            }
            
         else    if (woundedPowerCreeps.length != 0)
            {
                towers[i].heal(woundedPowerCreeps[0]);
            }
            
            
            else   if (closestHostile != undefined  )// make limiter to ensure tower draining doesnt work 
            {
                towers[i].attack(closestHostile);
            }
            else if (closestDamagedStructure.length != 0 && towers[i].store.getUsedCapacity() > 200 && towers[i].room.controller.level >3 && Game.rooms[roomname].storage.store.getUsedCapacity("energy")>10000)
            {
                towers[i].repair(closestDamagedStructure[0]);
            }
            else if (fullbuild.length != 0   && towers[i].room.controller.level >3  && Game.rooms[roomname].storage != undefined && Game.rooms[roomname].storage.store.getUsedCapacity("energy")>10000)
            {
                towers[i].repair(fullbuild[tmp]);
            }
           
            
        }
    }
}
module.exports = tower;