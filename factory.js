var factoryManager = {
    run: function(roomname, termin, fact)
    {
        var allResources = ['battery', 'energy', "H", "O", "U", "L", "Z", "X", "G", 'utrium_bar', 'lemergium_bar', 'zynthium_bar', 'keanium_bar', 'ghodium_melt', 'oxidant', 'reductant', 'purifier', 'composite', 'crystal', 'liquid', 'wire', 'cell', 'alloy', 'condensate', "silicon", "metal", "mist", "biomass", 'switch', 'transistor', 'microchip', 'circuit', 'phlegm', 'tissue', 'muscle', 'organoid', 'tube', 'fixtures', 'frame', 'hydraulics', 'concentrate', 'extract', 'spirit', 'emanation', 'machine', 'organism', 'device', 'essence'];
        var allValues = [2000, 8000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 50, 30, 10, 10, 30, 30, 10, 5, 30, 30, 10, 10, 50, 30, 20, 5, 0, 0, 0, 0];
        var temp = 0;
        // get sum of values 
        for(var i = 0; i < allValues.length; i++) // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL
        {
            temp += allValues[i];
        }
        var listOfResourcesInsideTerminal = fact.store;
        var resourcekeys = Object.keys(listOfResourcesInsideTerminal);
        var resourcevalues = Object.values(listOfResourcesInsideTerminal);
        var resmover = fact.pos.findInRange(FIND_MY_CREEPS, 1,
        {
            filter: (creep) => (creep.memory.role == "resmover")
        });
        var resmoveractual = resmover[0];
        if(resmoveractual &&   resmoveractual.memory.memstruct.tasklist.length == 0)
        {
            for(var i = 0; i < resourcekeys.length; i++) // transfer to terminal
            {
                var itemfound = false;
                for(var j = 0; j < allResources.length; j++)
                {
                    if(resourcekeys[i] == allResources[j] && resourcevalues[i] > allValues[j] && resmoveractual.memory.memstruct.tasklist.length == 0)
                    { //     ["withdraw" , "5f4e3d6138522b1096393b7d","tissue"]
                    
                    
                    
                        resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                        resmoveractual.memory.memstruct.tasklist.push(["withdraw", fact.id, allResources[j], (resourcevalues[i] - allValues[j])]);
                        resmoveractual.memory.memstruct.tasklist.push(["transfer", termin.id, allResources[j], (resourcevalues[i] - allValues[j])]);
                    }
                }
            }
            for(var j = 0; j < allResources.length; j++) // transfer to fact
            {
                if(allValues[j] > fact.store.getUsedCapacity(allResources[j]) && resmoveractual.memory.memstruct.tasklist.length == 0 && termin.store.getUsedCapacity(allResources[j]) > 800)
                {
                    var moveAmount = Math.min(termin.store.getUsedCapacity(allResources[j]), resmoveractual.store.getCapacity());
                     moveAmount = Math.min(moveAmount,  allValues[j] -      fact.store.getUsedCapacity(allResources[j]) );         
                    
                    resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                    resmoveractual.memory.memstruct.tasklist.push(["withdraw", termin.id, allResources[j],   moveAmount]);
                    resmoveractual.memory.memstruct.tasklist.push(["transfer", fact.id, allResources[j]]);
                }
            }
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(fact.level != 2 || (fact.level == 2 && fact.store.getUsedCapacity('alloy') < 200))
        {
            
           // console.log("room factory " ,roomname );
            // if level ==0 or no power
            //   lvl 0 resources
            var basic = ['alloy', 'cell', 'wire', 'condensate'];
            var basicamounts = [1000, 1000, 1000, 1000];
            var breaks = false;
 
            for(var i = 0; i < basic.length; i++)
            {
                if(fact.store.getUsedCapacity(basic[i]) < basicamounts[i]  ||   termin.store.getUsedCapacity(basic[i]) < 1900  && !breaks  )
                {
                    fact.produce(basic[i]);
                    breaks = true;
                }
            }
            
              
         var basic2 =    ['lemergium_bar', 'zynthium_bar', 'keanium_bar', 'ghodium_melt', 'oxidant', 'reductant', 'purifier'];
             
    
            
            for(var i = 0; i < basic2.length; i++)
            {
                if(fact.store.getUsedCapacity(basic2[i]) < 800  ||   termin.store.getUsedCapacity(basic2[i]) < 1900  && !breaks  )
                {
                    fact.produce(basic2[i]);
                    breaks = true;
                }
            }  
            
            
            
            
            
            
        }
        
        
        
        
        ////////////////////////////////////////////////////////
        if(fact.level == 2 &&  fact.store.getUsedCapacity('alloy') >  200 )
        {
            var basic = ['fixtures', 'tissue', 'transistor', 'extract'];
            var basicamounts = [90, 90, 90, 90];
            for(var i = 0; i < basic.length; i++)
            {
                if(fact.store.getUsedCapacity(basic[i]) < basicamounts[i] || termin.store.getUsedCapacity(basic[i]) < basicamounts[i])
                {
                    fact.produce(basic[i]);
                }
            }
        }
    }
}
module.exports = factoryManager;