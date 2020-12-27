/*
    total resouce distribution is 
    104,000  raw resources 
    105k finished resources
    50k energy =234,000
    40,000 free space
    above this sell all
    
catalyzed zynthium alkalide	   	+300% fatigue decrease speed   
catalyzed ghodium alkalide  	-70% damage taken                                                      
catalyzed utrium acid        	+300% attack effectiveness                                             
catalyzed lemergium alkalide    +300% heal and rangedHeal effectiveness                                        
catalyzed keanium alkalide	 + 	60	RANGED_ATTACK	+300% rangedAttack and rangedMassAttack effectiveness                             





    
*/
var terminalManager = {
    run: function(roomname, terminalActual, defcon, storagevalue)
    {
        var allResources = ["XGHO2", "XUH2O", "XLHO2", "XZH2O", "XZHO2", "H", "O", "U", "L", "Z", "X", "G", "energy", "GO", "XKHO2"]; // power and facory resources
        var allValues = [20000, 20000, 20000, 5000, 5000, 36000, 28000, 4000, 4000, 8000, 20000, 4000, 60000, 3000, 25000];

        var listOfResourcesInsideTerminal = Game.rooms[roomname].terminal.store;
        var resourcekeys = Object.keys(listOfResourcesInsideTerminal);
        var resourcevalues = Object.values(listOfResourcesInsideTerminal);
        if (1 == 1) // defcon controll
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
                            if (resourcekeys[i] == "energy")
                            {
                                if (storagevalue > 999000 )
                                {
                                    Game.market.deal(buyOrders[buyOrders.length - 1].id, excessResources, roomname);
                                }
                            }
                            else
                            {
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
                        if (storagevalue > 999000 && resourcekeys[i] == "energy")
                        {

                            Game.market.deal(buyOrders[buyOrders.length - 1].id, excessResources, roomname);

                        }
                        else
                        {
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

            if (storagevalue < 50000 && terminalActual.store.getUsedCapacity("energy") < 65000)
            {

                var hist = Game.market.getHistory(RESOURCE_ENERGY)

                Game.market.createOrder(
                {
                    type: ORDER_BUY,
                    resourceType: RESOURCE_ENERGY,
                    price: (hist[0].avgPrice + (hist[0].stddevPrice)),
                    totalAmount: 5000,
                    roomName: roomname
                });

            }

        }
    }
}
module.exports = terminalManager;