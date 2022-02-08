var creepfunctions = require('prototype.creepfunctions');
var roleMover = {
    //      ["withdraw" , "5f4e3d6138522b1096393b7d","tissue",optional value]

    MaterialGathereing: function(creep)
    {

        var droppedresources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES,
        {
            filter: (res) =>
            {
                return (res.resourceType != RESOURCE_ENERGY) || (res.amount > creep.store.getCapacity());
            }
        });

        var tombstones = creep.pos.findClosestByPath(FIND_TOMBSTONES,
        {
            filter: (tomb) =>
            {
                return (tomb.store.getUsedCapacity() != tomb.store.getUsedCapacity(RESOURCE_ENERGY)) || (tomb.store.getUsedCapacity(RESOURCE_ENERGY) > 300);
            }
        });

        var target = creep.room.find(FIND_HOSTILE_CREEPS);

        //pcik up from recycle lab point
        var containers = creep.pos.findClosestByPath(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) < structure.store.getUsedCapacity());
            }
        });

        if (containers != undefined)
        {

            var input = Object.keys(containers.store);

            for (var i = 0; i < input.length; i++)
            {
                creep.memory.memstruct.tasklist.push(["withdraw", containers.id, input[i]]);
            }

        }

        if (tombstones != undefined && target.length == 0)
        {

            var input = Object.keys(tombstones.store);

            for (var i = 0; i < input.length; i++)
            {
                creep.memory.memstruct.tasklist.push(["withdraw", tombstones.id, input[i]]);
            }

        }

        if (droppedresources != undefined && target.length == 0)
        {

            creep.memory.memstruct.tasklist.push(["gatherLooseResources"]);

        }

        return false;
    },
    lowRClEnergyGather: function(creep)
    {

        var containers = [];
        var roomname = creep.room.name;

        var container1 = Game.flags[creep.memory.memstruct.spawnRoom + "container1"];
var cont1volume=0;

    if(container1){
        var input = Game.rooms[creep.memory.memstruct.spawnRoom].lookForAt(LOOK_STRUCTURES, container1.pos);

        for (var i = 0; i < input.length; i++)
        {
            if (input[i].structureType == STRUCTURE_CONTAINER)
            {
                if (input[i].store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity())
                {
                    cont1volume = input[i].store.getUsedCapacity(RESOURCE_ENERGY)
                    containers.push(input[i]);
                }
            }
        }
    }
        
        
         

        var container0 = Game.flags[creep.memory.memstruct.spawnRoom + "container0"];
  if(container0){
        var input = Game.rooms[creep.memory.memstruct.spawnRoom].lookForAt(LOOK_STRUCTURES, container0.pos);

        for (var i = 0; i < input.length; i++)
        {
            if (input[i].structureType == STRUCTURE_CONTAINER)
            {
                if (input[i].store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity())
                {
                    if(cont1volume < input[i].store.getUsedCapacity(RESOURCE_ENERGY)){
                        containers = [];
                        containers.push(input[i]);
                    }
                    
                }
            }
        }
}
        if (containers.length != 0)
        {
            
            
            creep.memory.memstruct.tasklist.push(["withdraw", containers[0].id, "energy"]);
            
            
            
        }

        else
        {

    //        var listofrooms = Memory.empire.roomsobj[creep.memory.memstruct.spawnRoom].centerroomsinrange.concat(Memory.empire.roomsobj[creep.memory.memstruct.spawnRoom].MineRooms)

            var target = creep.room.find(FIND_HOSTILE_CREEPS);

            if (creep.memory.memstruct.tasklist.length == 0)
            {
                var storagemain = creep.room.storage;
                if (storagemain && storagemain.store.getUsedCapacity(RESOURCE_ENERGY) > 2500)
                {
                    creep.memory.memstruct.tasklist.push(["withdraw", "storage", "energy"]);
                }
                else
                {
                    this.getLink(creep);
                }
            }

        }
    },

    getLink: function(creep)
    {
        var links = creep.room.find(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_LINK && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 200);
            }
        });

        if (links.length != 0)
        {

            var hostiles = links[0].pos.findInRange(FIND_HOSTILE_CREEPS, 5)
            if (hostiles.length == 0)
            {
                creep.say("link");
                creep.memory.memstruct.tasklist.push(["withdraw", links[0].id, "energy"]);
            }

        }
    },

    HighRClEnergyGather: function(creep)
    {
        var storagemain = creep.room.storage;

            var target = creep.room.find(FIND_HOSTILE_CREEPS);

        if (storagemain && storagemain.store.getUsedCapacity(RESOURCE_ENERGY) > 2500 )
        {

            creep.say("storeW");
            creep.memory.memstruct.tasklist.push(["withdraw", "storage", "energy"]);

        }
        else if (creep.memory.memstruct.tasklist.length == 0 )
        {
            this.getLink(creep);
        }

    },
    fillExtension: function(creep)
    {
        creep.say("fillExtension");
        var ex = creep.pos.findClosestByPath(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_EXTENSION && structure.store.getFreeCapacity("energy") != 0);
            }
        });
        creep.say(ex);
        if (ex)
        {
            creep.say("ex");
            if (creep.transfer(ex, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(ex);
            }
            return false;
        }
        return true;
    },
    filllabs: function(creep)
    {
        creep.say("lab");
        var lab = creep.pos.findClosestByPath(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_LAB && structure.store.getFreeCapacity("energy") != 0);
            }
        });
        if (lab)
        {
            if (creep.transfer(lab, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(lab);
            }
            return false;
        }
        return true;
    },
    fillcontainers: function(creep)
    {
        creep.say("fillcontainers");
        var roomname = creep.room.name;
        var arrOfcontainers = [];
        var controllerFlag = Game.flags[roomname + "controllerposcontainer"];

        var rep1 = Game.flags[roomname + "Rep"];
        var rep2 = Game.flags[roomname + "Rep2"];
        var rep3 = Game.flags[roomname + "Rep3"];
        var rep4 = Game.flags[roomname + "Rep4"];

        if (controllerFlag)
        {

            var input = Game.rooms[roomname].lookForAt(LOOK_STRUCTURES, controllerFlag.pos);
            var controllerFlagActual = [];

            for (var i = 0; i < input.length; i++)
            {
                if (input[i].structureType == STRUCTURE_CONTAINER)
                {
                    controllerFlagActual.push(input[i]);
                }
            }

            if (controllerFlagActual.length != 0 && controllerFlagActual[0].store.getUsedCapacity("energy") < 1000)
            {
                creep.say("fdgh");
                creep.memory.memstruct.tasklist.push(["transfer", controllerFlagActual[0].id, "energy"]);
                return false;
            }

        }

        if (rep1)
        {

            var input = Game.rooms[roomname].lookForAt(LOOK_STRUCTURES, rep1.pos);
            var rep1FlagActual = [];

            for (var i = 0; i < input.length; i++)
            {
                if (input[i].structureType == STRUCTURE_CONTAINER)
                {
                    rep1FlagActual.push(input[i]);
                }
            }

            creep.say(rep1FlagActual.length);
            if (rep1FlagActual.length != 0)
            {
                creep.memory.memstruct.tasklist.push(["transfer", rep1FlagActual[0].id, "energy"]);
                return false;
            }

        }

        if (rep2)
        {

            var rep2FlagActual = Game.rooms[roomname].lookForAt(LOOK_STRUCTURES, rep2.pos,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity() < 1000);
                }
            });

            if (rep2FlagActual.length != 0)
            {
                creep.memory.memstruct.tasklist.push(["transfer", rep2FlagActual[0].id, "energy"]);
                return false;
            }

        }

        return true;
    },
    fillSpawn: function(creep)
    {
        creep.say("spawn");
        var lab = creep.pos.findClosestByPath(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_SPAWN && structure.store.getFreeCapacity("energy") != 0);
            }
        });
        if (lab)
        {
            if (creep.transfer(lab, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(lab);
            }
            return false;
        }
        return true;
    },

    fillTower: function(creep)
    {
        creep.say("twr");
        var lab = creep.pos.findClosestByPath(FIND_STRUCTURES,
        {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_TOWER && structure.store.getUsedCapacity("energy") < 300);
            }
        });
        if (lab)
        {
            if (creep.transfer(lab, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(lab);
            }
            return false;
        }
        return true;
    },

    run: function(creep)
    {
        var check = creepfunctions.checkglobaltasks(creep);

        if (creep.memory.memstruct.countlife == undefined)
        {
            creep.memory.memstruct.countlife = 0
        }
        else if (creep.memory.memstruct.countlife > 5000 && creep.store.getUsedCapacity() == 0)
        {
            creep.suicide();
        }

        else
        {
            creep.memory.memstruct.countlife++
        }

        if (creep.room.controller)
        {
            var roomLevel = creep.room.controller.level;
        }
        else
        {
            var roomLevel = 0;
        }

        if (check)
        {

            if (creep.store.getUsedCapacity() == 0)
            {
                creep.memory.memstruct.full = false;
            }
            //////////////////////////////////////////////////////////////////////////
            if (creep.memory.memstruct.full == false && creep.store.getFreeCapacity() == 0)
            {
                creep.memory.memstruct.full = true;
            }
            //////////////////////////////////////////////////////////////////////////
            if (creep.memory.memstruct.full == false)
            {
                var target = creep.room.find(FIND_HOSTILE_CREEPS);

                if (target.length != 0 || roomLevel < 6)
                {
                    var valuablematerialsTogather = false
                }
                else
                {
                    var valuablematerialsTogather = this.MaterialGathereing(creep);
                }

                if (!valuablematerialsTogather)
                {
                    if (roomLevel < 6)
                    {
                        this.lowRClEnergyGather(creep);
                    }
                    else
                    {
                        this.HighRClEnergyGather(creep);
                    }
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////
            if (creep.memory.memstruct.full == true)
            {
                if (creep.store.getUsedCapacity("energy") != creep.store.getUsedCapacity())
                {
                    if (creep.room.storage || creep.room.terminal)
                    {
                        creep.memory.memstruct.tasklist.push(["deposit", "nonEnergy"]);
                    }
                }
                else
                { // fill extensions
                    // fill labs 
                    // fill certain containers
                    // fill spawns 
                    var extensionsFull = this.fillExtension(creep);
                    if (extensionsFull)
                    {
                        var labsFull = this.filllabs(creep)
                        if (labsFull)
                        {
                            var containersFull = this.fillcontainers(creep)
                            if (containersFull)
                            {
                                var spawnsFull = this.fillSpawn(creep)
                                if (spawnsFull)
                                {
                                    var towerfull = this.fillTower(creep)
                                    if (towerfull)
                                    {

                                        if (Game.time % 5 == 0)
                                        {
                                            creep.memory.memstruct.tasklist.push(["deposit"]);
                                        }
                                    }

                                }

                            }
                        }
                    }
                }
            }

            if (creep.memory.memstruct.tasklist.length != 0)
            {
                var check = creepfunctions.checkglobaltasks(creep);
            }

        }
    }
};
module.exports = roleMover;