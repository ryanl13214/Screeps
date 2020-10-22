var creepfunctions = {

    /*
    USED BY: 
        jack
    
    
    
    */
    checkglobaltasks: function(creep) {
        if(creep.memory.tasklist[0]){
            if (creep.memory.tasklist[0][0] == "moveto") {
                const path = creep.pos.findPathTo(creep.memory.targetroom);
                if (path.length > 0) {
                    creep.move(path[0].direction);
                } else {
                    creep.memory.tasklist[0].splice(0, 1);
                }
            }
            if (creep.memory.tasklist[0][0] == "moveToRoom") {
    
    
    
    
    
    
    
    
    
    
    
    
    
            }
            if (creep.memory.tasklist[0][0] == "pickup") {
                const path = creep.pos.findPathTo(creep.memory.targetroom);
                if (path.length > 0) {
                    creep.move(path[0].direction);
                } else {
                    creep.memory.tasklist[0].splice(0, 1);
                }
            }
    
            if (creep.memory.tasklist[0][0] == "dropoff") {
                const path = creep.pos.findPathTo(creep.memory.targetroom);
                if (path.length > 0) {
                    creep.move(path[0].direction);
                } else {
                    creep.memory.tasklist[0].splice(0, 1);
                }
            }
        }
    },



    /*
    USED BY: 
        jack
        mover
        repairer
    */
    findfullcontainers: function(creep,energyleveltodrawfrom) 
    {
        var containers = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => {
                return s.structureType == STRUCTURE_CONTAINER && s.store.energy > energyleveltodrawfrom;
            }
        });
        if (containers != undefined) 
        {
            if (creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(containers, { visualizePathStyle: { stroke: '#ffaa00' }});
            }
            creep.memory.hastask = true;
        }
    },




    /*
    USED BY: 
        jack
    
    
    
    */
    checklocaltasks: function(creep) {
        if (creep.memory.tasklist[0] == "moveto") {
            const path = creep.pos.findPathTo(creep.memory.targetroom);
            if (path.length > 0) {
                creep.move(path[0].direction);
            } else {
                creep.memory.tasklist[0].splice(0, 1);
            }
        }
    },

    /*
    USED BY: 
        jack
    
    
    
    */
    repairbuildings: function(creep) {
        var repairtarg = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_CONTAINER) && s.hits < s.hitsMax * 0.7;
            }
        });
        if (repairtarg) {
            if (creep.repair(repairtarg) == ERR_NOT_IN_RANGE) {
                creep.moveTo(repairtarg, {
                    reusePath: 5
                });
            }
            creep.memory.hastask = true;
        }
    },
    /*
    USED BY: 
        repairer
    
    
    
    */
    repairbuildingsfull: function(creep) {
        var repairtarg = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_CONTAINER) && s.hits < s.hitsMax * 0.99;
            }
        });
        if (repairtarg) {
            if (creep.repair(repairtarg) == ERR_NOT_IN_RANGE) {
                creep.moveTo(repairtarg, {
                    reusePath: 5
                });
            }
            creep.memory.hastask = true;
        }
    },
    /*
    USED BY: 
        jack
    
    
    
    */
    upgradecontroller: function(creep) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {
                visualizePathStyle: {
                    stroke: '#ffffff'
                }
            });
        }
        creep.memory.hastask = true;
    },

    /*
    USED BY: 
        jack
    
    
    
    */
    stockbuildingswithenergy: function(creep) {
        
        
        var buildingsneedingenergy = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return  (
                    (structure.structureType == STRUCTURE_EXTENSION && structure.energy       < 50)  ||  
                    (structure.structureType == STRUCTURE_TOWER     && structure .energy      < 500) || 
                    (structure.structureType == STRUCTURE_CONTAINER && structure.store.energy < 500) || 
                    (structure.structureType == STRUCTURE_SPAWN     && structure.energy       < 300) ||
                    (structure.structureType == STRUCTURE_STORAGE   && structure.store.energy < 10000)   
                );
            }
        });
  
         creep.say(buildingsneedingenergy.length);
        if (buildingsneedingenergy.length > 0) {
            if (creep.transfer(creep.pos.findClosestByPath(buildingsneedingenergy), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.pos.findClosestByPath(buildingsneedingenergy), {
                    visualizePathStyle: {
                        stroke: '#ffffff'
                    }
                });
            }
            creep.memory.hastask = true;
        }
    },

    /*
    USED BY: 
        jack
    
    
    
    */
    buildstructs: function(creep) {
        var constructionsites = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (constructionsites.length != 0) {
            if (creep.build(constructionsites[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(constructionsites[0], {
                    reusePath: 5
                });
            }
            creep.memory.hastask = true;
        }
    }

}

module.exports = creepfunctions;