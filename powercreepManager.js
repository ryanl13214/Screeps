var powercreepManager = {
    run: function(powerCreep)
    {
        // for the ops gens move to some position and gen ops and transfer them into storage.
        // spawn only in a stronhold.
        if(powerCreep.spawnCooldownTime != undefined) // creep is not in the world
        {
            if(!(powerCreep.spawnCooldownTime > Date.now()))
            {
                var pwrspawn = Game.rooms["E24N3"].find(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_POWER_SPAWN);
                    }
                });
                powerCreep.spawn(pwrspawn);
            }
        }
        else // creep is in the world
        {
            if(powerCreep.room.controller.isPowerEnabled == false)
            {
                if(powerCreep.enableRoom(powerCreep.room.controller) == -9)
                {
                    powerCreep.moveTo(powerCreep.room.controller,
                    {
                        visualizePathStyle:
                        {
                            stroke: '#ffaa00'
                        }
                    });
                }
            }
            var powerList = powerCreep.powers;
            var powerkeys = Object.keys(powerList);
            var powervalues = Object.values(powerList);
            var creepid = powerCreep.name.substring(0, 6)
            if(creepid == "opsHar")
            {
                this.opsharvester(powerCreep);// add limiters on when it should run check defcon and game time to operate only when needed
            }
        }
    },
    opsharvester: function(powerCreep)
    {
        if(Game.time % 50 == 0)
        {
            powerCreep.usePower(PWR_GENERATE_OPS);
        }
        if(powerCreep.store.getFreeCapacity() <5) // creep is full
        {
            var range = powerCreep.pos.getRangeTo(powerCreep.room.storage);
            if(range > 1)
            {
                powerCreep.moveTo(powerCreep.room.storage,
                {
                    visualizePathStyle:
                    {
                        stroke: '#ffaa00'
                    }
                });
            }
            else
            {
                powerCreep.transfer(powerCreep.room.storage, RESOURCE_OPS, powerCreep.store.getUsedCapacity("ops"));
            }
        }
        else
        {
            var mainflag = Game.flags[powerCreep.room.name];
            var range = powerCreep.pos.getRangeTo(new RoomPosition(mainflag.pos.x + 7, mainflag.pos.y + 7, mainflag.room.name));
            if(range > 2)
            {
                powerCreep.moveTo(new RoomPosition(mainflag.pos.x + 7, mainflag.pos.y + 7, mainflag.room.name),
                {
                    visualizePathStyle:
                    {
                        stroke: '#ffaa00'
                    }
                });
            }
        }
        
                   var pwrspawn = powerCreep.room.find(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_POWER_SPAWN);
                    }
                })[0];
        
         var range = powerCreep.pos.getRangeTo(pwrspawn);
        
         if(range <2)
            {
        
      powerCreep.renew(pwrspawn);
            }
        if(powerCreep.ticksToLive < 200){
              powerCreep.moveTo(pwrspawn,
                {
                    visualizePathStyle:
                    {
                        stroke: '#ffaa00'
                    }
                });
        }
        
        
        
        
        
        
        
        
        
        
    }
}
module.exports = powercreepManager;  