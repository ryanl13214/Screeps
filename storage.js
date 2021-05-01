var storageManager = {
    run: function(roomname)
    {
        var allResources = ["XGHO2", "XUH2O", "XLHO2", "XZH2O", "XZHO2", "XKHO2"];
        var allValues = [40000, 40000, 40000, 40000, 40000, 40000];
        
        
        var allspawns = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        
        if(allspawns.length == 0){
            
            for(var i = 0; i < allValues.length; i++){
                allValues[i] = 0 ;
            }
            
            
            
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        var termin = Game.rooms[roomname].terminal;
        var strg = Game.rooms[roomname].storage;
        var temp = 0;
        // get sum of values 
        for(var i = 0; i < allValues.length; i++) // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL
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
        var resmoveractual = resmover[0];
        if(resmoveractual)
        {
            
            
            
            
                
                var listOfResourcesInsideTerminal = termin.store;
        var resourcekeys = Object.keys(listOfResourcesInsideTerminal);
        var resourcevalues = Object.values(listOfResourcesInsideTerminal);
        if(termin.store.getFreeCapacity() < 8000 & strg.store.getFreeCapacity() > 30000){
            
             for(var j = 0; j < resourcekeys.length; j++) // transfer to strg
            {
             if(  termin.store.getUsedCapacity(resourcekeys[j]) >resmoveractual.store.getCapacity()  && resmoveractual.memory.memstruct.tasklist.length == 0)
                {
                    resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                    resmoveractual.memory.memstruct.tasklist.push(["withdraw", termin.id, resourcekeys[j],  resmoveractual.store.getCapacity()  ]);
                    resmoveractual.memory.memstruct.tasklist.push(["transfer", strg.id, resourcekeys[j]]);
                }
            
            }
            
            
        }
            
            
            
            
            
            
            
            
            
            
            
            
            // RESOURCE    manager      
            for(var i = 0; i < resourcekeys.length; i++) // transfer to terminal
            {
                var itemfound = false;
                for(var j = 0; j < allResources.length; j++)
                {
                    if(resourcekeys[i] == allResources[j] && resourcevalues[i] > allValues[j] && resmoveractual.memory.memstruct.tasklist.length == 0)
                    {  
                        resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                        resmoveractual.memory.memstruct.tasklist.push(["withdraw", strg.id, allResources[j], Math.min((resourcevalues[i] - allValues[j]), resmoveractual.store.getCapacity())]);
                        resmoveractual.memory.memstruct.tasklist.push(["transfer", termin.id, allResources[j], Math.min((resourcevalues[i] - allValues[j]), resmoveractual.store.getCapacity())]);
                    }
                }
            }
            
            
            for(var j = 0; j < allResources.length; j++) // transfer to strg
            {
                if(allValues[j] > strg.store.getUsedCapacity(allResources[j])  && termin.store.getUsedCapacity(allResources[j]) > 1000 && resmoveractual.memory.memstruct.tasklist.length == 0)
                {
                    resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                    resmoveractual.memory.memstruct.tasklist.push(["withdraw", termin.id, allResources[j], Math.min((allValues[j]) - strg.store.getUsedCapacity(allResources[j]), resmoveractual.store.getCapacity())]);
                    resmoveractual.memory.memstruct.tasklist.push(["transfer", strg.id, allResources[j]]);
                }
            }
            
         
              
            
            
            
            //    Math.min((allValues[j]) - strg.store.getUsedCapacity(allResources[j]) , resmoveractual.store.getCapacity())
            // enegy manager
            if(strg.store.getUsedCapacity("energy") > (10 * termin.store.getUsedCapacity("energy")) && strg.store.getUsedCapacity("energy") > 10000 && resmoveractual.memory.memstruct.tasklist.length == 0)
            {
                resmoveractual.say("e to trm ");
                resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                resmoveractual.memory.memstruct.tasklist.push(["withdraw", strg.id, "energy", Math.min((allValues[j]) - strg.store.getUsedCapacity(allResources[j]), resmoveractual.store.getCapacity())]);
                resmoveractual.memory.memstruct.tasklist.push(["transfer", termin.id, "energy"]);
            }
            if(strg.store.getUsedCapacity("energy") < 10 * termin.store.getUsedCapacity("energy") && termin.store.getUsedCapacity("energy") > 10000 && resmoveractual.memory.memstruct.tasklist.length == 0)
            {
                resmoveractual.say("e to strg ");
                resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                resmoveractual.memory.memstruct.tasklist.push(["withdraw", termin.id, "energy", Math.min((allValues[j]) - strg.store.getUsedCapacity(allResources[j]), resmoveractual.store.getCapacity())]);
                resmoveractual.memory.memstruct.tasklist.push(["transfer", strg.id, "energy"]);
            }
        }
    }
}
module.exports = storageManager;