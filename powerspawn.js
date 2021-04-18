var pwrspawnManager = {
    run: function(roomname, termin, pwrspawn)
    {
        
        
        
      
           
               pwrspawn.processPower();
   
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        var allResources = ['power', "energy"];
        var allValues = [100, 5000];
        var temp = 0;
        // get sum of values 
        for(var i = 0; i < allValues.length; i++) // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL
        {
            temp += allValues[i];
        }
        var listOfResourcesInsideTerminal = termin.store;
        var resourcekeys = Object.keys(listOfResourcesInsideTerminal);
        var resourcevalues = Object.values(listOfResourcesInsideTerminal);
        var resmover = pwrspawn.pos.findInRange(FIND_MY_CREEPS, 1,
        {
            filter: (creep) => (creep.memory.role == "resmover")
        });
        var resmoveractual = resmover[0];
        if(resmoveractual)
        {
            for(var j = 0; j < allResources.length; j++) // transfer to strg
            {
                if(allValues[j] > pwrspawn.store.getUsedCapacity(allResources[j])*2 && termin.store.getUsedCapacity(allResources[j]) > 100 && resmoveractual.memory.memstruct.tasklist.length == 0)
                { 
                    resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                    resmoveractual.memory.memstruct.tasklist.push(["withdraw", termin.id, allResources[j], (allValues[j]) - pwrspawn.store.getUsedCapacity(allResources[j])]);
                    resmoveractual.memory.memstruct.tasklist.push(["transfer", pwrspawn.id, allResources[j]]);
                }
            }
        }
    }
}
module.exports = pwrspawnManager;