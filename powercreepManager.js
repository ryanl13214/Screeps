var powercreepManager = {
    run: function(powerCreep)
    {
        // for the ops gens move to some position and gen ops and transfer them into storage.
        // spawn only in a stronhold.
        //   console.log(powerCreep.spawnCooldownTime );
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
           //     console.log(powerCreep.spawn(pwrspawn[0]));
                powerCreep.spawn(pwrspawn[0]);
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
            else
            {
                this.roomManager(powerCreep);// add limiters on when it should run check defcon and game time to operate only when needed
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
        
        
        
        
        
        
        
        
        
        
    },
    
       roomManager: function(powerCreep)
    {
////////////////////////////////////gen ops//////////////////////////////////////////////////////////////////////////////////////////
        if(Game.time % 50 == 0)
        {
            powerCreep.usePower(PWR_GENERATE_OPS);
        }
////////////////////////////////////store ops//////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////renew //////////////////////////////////////////////////////////////////////////////////////////////
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
        if(powerCreep.ticksToLive < 500){
              powerCreep.moveTo(pwrspawn,
                {
                    visualizePathStyle:
                    {
                        stroke: '#ffaa00'
                    }
                });
        }
 
////////////////////////////////////stock with energy//////////////////////////////////////////////////////////////////////////////////////////
        var strongroom = powerCreep.room;  
   //       powerCreep.say(strongroom.energyCapacityAvailable);
        if(strongroom.energyAvailable *1.15< strongroom.energyCapacityAvailable  ){// add cooldown check and storage full check else termianl
            powerCreep.say("a");
             var range = powerCreep.pos.getRangeTo(strongroom.storage);
        
         
              
            
            if(range <= 3){
               powerCreep.usePower(PWR_OPERATE_EXTENSION ,strongroom.storage);
            }else
            {
                 powerCreep.moveTo(strongroom.storage,
                {
                    visualizePathStyle:
                    {
                        stroke: '#ffaa00'
                    }
                });
                
            }
            
        }
        
        
        
        
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    }, 
    
}
module.exports = powercreepManager;  