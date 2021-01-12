var roletowermover = {
    run: function(creep)
    {
        //     var sources = creep.room.find(FIND_STRUCTURES, { filter: (structure) =>{return (structure.structureType == STRUCTURE_CONTAINER);}}); 
        // creep.say(sources.length); 
        var sources = creep.room.find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_STORAGE);
            }
        });
        if (creep.carry.energy == 0)
        {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.working = true;
        }
        if (creep.memory.working == false)
        {
            if (creep.withdraw(creep.pos.findClosestByRange(sources), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(creep.pos.findClosestByRange(sources),
                {
                    visualizePathStyle:
                    {
                        stroke: '#ffaa00'
                    }
                });
            }
        }
        if (creep.memory.working == true)
        {
            var constructionsites = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3);
            
            if (constructionsites.length != 0)
            {
                creep.build(constructionsites[0]);
            }
            else
            {
                var targets = creep.pos.findInRange(FIND_STRUCTURES, 1,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_TOWER && structure.energy < 800) ;
                    }
                });

             if (targets.length != 0)
            {
                 
                var transverAmount=200 ;
                
                if(transverAmount> creep.store.getUsedCapacity())
                {
                    transverAmount = creep.store.getUsedCapacity();
                }
                 
                 
               creep.transfer(targets[0], RESOURCE_ENERGY,transverAmount);
            }
                
                
                else
                {
                    var closestDamagedStructure = creep.pos.findInRange(FIND_STRUCTURES, 3,
                    {
                        filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL
                    });
            
                    var tmp=0;
                    var  value=9999999999999999999;
                      
                    for (var i = 0; i < closestDamagedStructure.length; i++)
                    {
                        if(closestDamagedStructure[i].hits <value)
                        {
                            value = closestDamagedStructure[i].hits;
                            tmp = i ;
                        }
                    }
                   



                    if (closestDamagedStructure.length != 0)
                    {
                        creep.repair(closestDamagedStructure[tmp]);
                    }
                }

            }

        }
    }
};
module.exports = roletowermover;