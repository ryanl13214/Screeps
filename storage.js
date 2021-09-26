var storageManager = {
    
    
      simpleVisualiser: function(roomname,topos,frompos,textActual,number)
    {
     
    
          new RoomVisual(roomname).line(topos.x,topos.y,frompos.x,frompos.y);
                    new RoomVisual(roomname).text(textActual + number, frompos.x,frompos.y, {color: 'red', font: 0.8}); 
    
    },
    run: function(roomname)
    {             
        var allResources = ["XGHO2", "XUH2O", "XLHO2", "XZH2O", "XZHO2", "XKHO2", "power","G","XKH2O"];
        var allValues = [20000, 20000, 20000, 20000, 20000, 20000, 0,5000,5000];
        if(Game.rooms[roomname].controller.isPowerEnabled)
        {
            allResources.push("ops");
            allValues.push(100000);
            //  console.log(roomname + "--" + Game.rooms[roomname].controller.isPowerEnabled);
        }
        else
        {
            allResources.push("ops");
            allValues.push(0);
        }
        var allspawns = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        if(allspawns.length == 0)
        {
            for(var i = 0; i < allValues.length; i++)
            {
                allValues[i] = 0;
            }
        }
        var termin = Game.rooms[roomname].terminal;
        var strg = Game.rooms[roomname].storage;
        var temp = 0;
        // get sum of values 
        for(var i = 0; i < allValues.length; i++)
        {
            temp += allValues[i];
        }
        var listOfResourcesInsideTerminal = strg.store;
        var resourcekeys = Object.keys(listOfResourcesInsideTerminal);
        var resourcevalues = Object.values(listOfResourcesInsideTerminal);
        var resmover = strg.pos.findInRange(FIND_MY_CREEPS, 1,
        {
            filter: (creep) => (creep.memory.role == "resmover")
        });
        ////////////////////////////////////////////
        var resmoveractual = resmover[0];
        if(resmoveractual  )
        {
            if(strg.store.getUsedCapacity("energy") > (10 * termin.store.getUsedCapacity("energy")) && strg.store.getUsedCapacity("energy") > 10000 && resmoveractual.memory.memstruct.tasklist.length == 0 && termin.store.getFreeCapacity() > 5000)
            {
                var moveAmount = Math.min(strg.store.getUsedCapacity("energy") - 10 * termin.store.getUsedCapacity("energy"), resmoveractual.store.getCapacity()  );
                //   console.log(moveAmount);
                if(moveAmount == resmoveractual.store.getCapacity())
                {
                    resmoveractual.say("e to trm ");
                    resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                    resmoveractual.memory.memstruct.tasklist.push(["withdraw", strg.id, "energy", moveAmount]);
                    resmoveractual.memory.memstruct.tasklist.push(["transfer", termin.id, "energy"]);
                     this.simpleVisualiser(roomname,termin.pos,strg.pos ,"energy" ,moveAmount);
                }
            }
            if(strg.store.getUsedCapacity("energy") < 10 * termin.store.getUsedCapacity("energy") && termin.store.getUsedCapacity("energy") > 10000 && resmoveractual.memory.memstruct.tasklist.length  == 0 && strg.store.getFreeCapacity() > 5000)
            {
                var moveAmount = Math.min(10 * termin.store.getUsedCapacity("energy") - strg.store.getUsedCapacity("energy"), resmoveractual.store.getCapacity());
                //    console.log(moveAmount);
                if(moveAmount == resmoveractual.store.getCapacity())
                {
                    
                    resmoveractual.say("e to strg ");
                    resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                    resmoveractual.memory.memstruct.tasklist.push(["withdraw", termin.id, "energy", moveAmount]);
                    resmoveractual.memory.memstruct.tasklist.push(["transfer", strg.id, "energy"]);
                     this.simpleVisualiser(roomname,strg.pos,termin.pos ,"energy" ,moveAmount);
                    
                }
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // RESOURCE    manager  
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var listOfResourcesInsideStorage = strg.store;
            var resourcekeys = Object.keys(listOfResourcesInsideStorage);
            var resourcevalues = Object.values(listOfResourcesInsideStorage);
            // RESOURCE    manager     
            for(var i = 0; i < resourcekeys.length; i++) // transfer to terminal
            {
                var itemfound = false;
                if(resourcekeys[i] != "energy") // energy handled on its own 
                {
                   
                    for(var j = 0; j < allResources.length; j++)
                    {
                        if(resourcekeys[i] == allResources[j])
                        {
                            itemfound = true;
                        }
                        if(resourcekeys[i] == allResources[j] && resourcevalues[i] > allValues[j] && resmoveractual.memory.memstruct.tasklist.length < 0 && allResources[j] != "energy" && termin.store.getFreeCapacity() > 5000)
                        {
                                 var transferAmount = Math.min((resourcevalues[i] - allValues[j]), resmoveractual.store.getCapacity());
                            itemfound = true;
                            resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                            resmoveractual.memory.memstruct.tasklist.push(["withdraw", strg.id, allResources[j],  transferAmount]);
                            resmoveractual.memory.memstruct.tasklist.push(["transfer", termin.id, allResources[j],transferAmount]);
                               this.simpleVisualiser(roomname,termin.pos,strg.pos ,  allResources[j] ,transferAmount);
                            
                        }
                    }
                    ////////////////////////
                    if(!itemfound && resmoveractual.memory.memstruct.tasklist.length < 3)
                    { // item not on the i want in storage list
                        if(termin.store.getFreeCapacity() > 5000)
                        {
                            var transferAmount = Math.min(strg.store.getUsedCapacity(resourcekeys[i]), resmoveractual.store.getCapacity());
                            resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                            resmoveractual.memory.memstruct.tasklist.push(["withdraw", strg.id, resourcekeys[i],transferAmount]);
                            resmoveractual.memory.memstruct.tasklist.push(["transfer", termin.id, resourcekeys[i], transferAmount]);
                            this.simpleVisualiser(roomname,termin.pos,strg.pos ,  allResources[j] ,transferAmount);
                        }
                    }
                }
            }
            //////////////////////// 
            for(var j = 0; j < allResources.length; j++) // transfer to strg
            {
                if(allValues[j] > strg.store.getUsedCapacity(allResources[j]) && termin.store.getUsedCapacity(allResources[j]) > 1000 && resmoveractual.memory.memstruct.tasklist.length == 0)
                {
                    var transferAmount = Math.min((allValues[j]) - strg.store.getUsedCapacity(allResources[j]), resmoveractual.store.getCapacity());
                    resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                    resmoveractual.memory.memstruct.tasklist.push(["withdraw", termin.id, allResources[j], transferAmount ]);
                    resmoveractual.memory.memstruct.tasklist.push(["transfer", strg.id, allResources[j]]);
                    
    
         
                   this.simpleVisualiser(roomname,strg.pos,termin.pos ,  allResources[j] ,transferAmount);
                }
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // enegy manager
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
        }
    }
}
module.exports = storageManager;