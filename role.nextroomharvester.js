var rolenextroomHarvester = {
    /** @param {Creep} creep **/
    run: function(creep)
    {
        const startCpu = Game.cpu.getUsed();
        if (creep.ticksToLive == 1)
        {
            var costOfCreep = 0;
            var arr = creep.body;
            for (partNo in arr)
            {
                if (arr[partNo].type == "carry" || arr[partNo].type == "move")
                {
                    costOfCreep += 50;
                }
                else
                {
                    costOfCreep += 100;
                }
            }
            console.log('Creep from ', creep.memory.target, ' has harvested ', creep.memory.totalharvested + "  and cost " + costOfCreep +
                "   and had average cpu use of :" + (creep.memory.cpuUsed / 1500));
        }
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (creep.memory.full == true && creep.carry.energy == 0)
        {
            creep.memory.full = false;
            creep.memory.totalharvested += creep.carryCapacity;
        }
        if (creep.memory.full == false && creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.full = true;
        }
        if (creep.memory.full == false)
        {
            if (creep.room.name == creep.memory.target) // IF CREEP IS IN TARGET ROOM AND HAS NO ENERGY
            {
                var target = creep.room.find(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_ROAD);
                    }
                });
                if (target.length < 25 && target.length < 25)
                {
                    //   creep.pos.createConstructionSite(STRUCTURE_ROAD);
                }
                var sources = creep.room.find(FIND_SOURCES_ACTIVE);
                if (creep.harvest(creep.pos.findClosestByPath(sources)) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(creep.pos.findClosestByPath(sources),
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
            }
            else
            { // IF CREEP IS NOT IN TARGET ROOM AND HAS NO ENERRGY
                const exitDir = Game.map.findExit(creep.room, creep.memory.target);
                const exit = creep.pos.findClosestByRange(exitDir);
                creep.moveTo(exit);
            }
        }
        if (creep.memory.full == true)
        {
            if (creep.room.name == creep.memory.home)
            {
                var targets = creep.room.storage;
                if(targets != undefined){
                
                
                if (creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targets,
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ffffff'
                        }
                    });
                } 
                }else{
                    
                     if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
                    
                    
                }
                
                
                
                
                
                
                
                
            }
            else
            {
                const exitDir = Game.map.findExit(creep.room, creep.memory.home);
                const exit = creep.pos.findClosestByRange(exitDir);
                Game.map.visual.line(creep.pos, exit,
                {
                    color: '#ff0000',
                    lineStyle: 'dashed'
                });
                creep.moveTo(exit);
            }
        }
        creep.memory.cpuUsed = creep.memory.cpuUsed + (Game.cpu.getUsed() - startCpu);
    }
};
module.exports = rolenextroomHarvester;