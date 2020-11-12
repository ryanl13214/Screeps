/*
    total resouce distribution is 
    104,000  raw resources 
    80k finished resources
    50k energy =234,000
    65,000 free space
    above this sell all
*/
var terminalManager = {
    run: function(roomname, terminalActual, defcon, storagevalue)
    {
        var allResources = ["XGHO2", "XUH2O", "XLHO2", "XZH2O", "XZHO2", "H", "O", "U", "L", "Z", "X", "G", "energy", "GO"];// power and facory resources
        var allValues = [20000, 20000, 20000, 5000, 5000, 36000, 28000, 4000, 4000, 8000, 20000, 4000, 60000, 3000];
        var listOfResourcesInsideTerminal = terminalActual.store;
        var resourcekeys = Object.keys(listOfResourcesInsideTerminal);
        var resourcevalues = Object.values(listOfResourcesInsideTerminal);
        if (defcon > 5)
        {
            for (var i = 0; i < resourcekeys.length; i++)
            {
                var itemfound = false;
                for (var j = 0; j < allResources.length; j++)
                {
                    if (resourcekeys[i] == allResources[j])
                    {
                        itemfound = true;
                    }
                    if (resourcekeys[i] == allResources[j] && resourcevalues[i] > allValues[j])
                    {
                        let buyOrders = Game.market.getAllOrders(
                        {
                            resourceType: resourcekeys[i],
                            type: ORDER_BUY
                        });
                        _.sortBy(buyOrders, ['price']);
                        var excessResources = resourcevalues[i] - allValues[j];
                        if (buyOrders.length > 1 && excessResources > 200)
                        {
                             if (storagevalue > 999000 && resourcekeys[i] == "energy" )
            {
                
                  Game.market.deal(buyOrders[buyOrders.length - 1].id, excessResources, roomname);
                
            }else{
                  Game.market.deal(buyOrders[buyOrders.length - 1].id, excessResources, roomname);
            }
                           
                            //  console.log(JSON.stringify(buyOrders[buyOrders.length - 1]));
                        }
                    }
                }
                if (!itemfound)
                {
                    let buyOrders = Game.market.getAllOrders(
                    {
                        resourceType: resourcekeys[i],
                        type: ORDER_BUY
                    });
                    _.sortBy(buyOrders, ['price']);
                    var excessResources = resourcevalues[i];
                    //console.log("item not found-"        +resourcekeys[i]+" " +buyOrders.length+"    "+resourcevalues[i]);
                    if (buyOrders.length != 0)
                    {
                                                    if (storagevalue > 999000 && resourcekeys[i] == "energy" )
            {
                
                  Game.market.deal(buyOrders[buyOrders.length - 1].id, excessResources, roomname);
                
            }else{
                  Game.market.deal(buyOrders[buyOrders.length - 1].id, excessResources, roomname);
            }
                        // console.log(JSON.stringify(buyOrders[buyOrders.length - 1]));
                    }
                }
            }
            if (storagevalue > 999000)
            {
                let buyOrders = Game.market.getAllOrders(
                {
                    resourceType: RESOURCE_ENERGY,
                    type: ORDER_BUY
                });
                _.sortBy(buyOrders, ['price']);
                if (buyOrders.length != 0)
                {
                    Game.market.deal(buyOrders[buyOrders.length - 1].id, 1000, roomname);
                    // console.log(JSON.stringify(buyOrders[buyOrders.length - 1]));
                }
            }
             
            if (storagevalue < 50000 && terminalActual.store.getUsedCapacity("energy") <70000)
            {
                let buyOrders = Game.market.getAllOrders(
                {
                    resourceType: RESOURCE_ENERGY,
                    type: ORDER_SELL
                });
                _.sortBy(buyOrders, ['price']);
                if (buyOrders.length != 0)
                {
                 
                   
                    Game.market.deal(buyOrders[0].id, 10000, roomname);
                    
                }
            } 
            
            
            
            
            
            
            
            
        }
    }
}
module.exports = terminalManager;