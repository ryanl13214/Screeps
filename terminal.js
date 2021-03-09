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





XUH2O   catalyzed utrium acid	            ATTACK	        +300% attack effectiveness                                                                                                   
XUHO2   catalyzed utrium alkalide        	WORK	        +600% harvest effectiveness                                                                                                   
XKH2O   catalyzed keanium acid	        	CARRY	        +150 capacity                                                                                                   
XKHO2   catalyzed keanium alkalide	        RANGED_ATTACK	+300% rangedAttack and rangedMassAttack effectiveness                                                                                                   
XLH2O   catalyzed lemergium acid	        WORK	        +100% repair and build effectiveness without increasing the energy cost                                                                                                   
XLHO2   catalyzed lemergium alkalide    	HEAL            +300% heal and rangedHeal effectiveness                                                                                                   
XZH20   catalyzed zynthium acid	        	WORK	        +300% dismantle effectiveness                                                                                                   
XZHO2   catalyzed zynthium alkalide	     	MOVE	        +300% fatigue decrease speed                                                                                                   
XGH2O   catalyzed ghodium acid	        	WORK        	+100% upgradeController effectiveness without increasing the energy cost                                                                                                   
XGHO2   catalyzed ghodium alkalide	    	TOUGH	        -70% damage taken                                                                                                   






 
*/
var terminalManager = {
    run: function(roomname, terminalActual, defcon, storagevalue)
    {
        var allResources = ["XGHO2", "XUH2O", "XLHO2", "XZH2O", "XZHO2", "H"  , "O"  , "U" , "L" , "Z" , "X"  , "G" , "energy",  "XKHO2", "power","silicon","metal","mist","biomass","machine","organism","essence","device","ops"]; // power and facory resources
        var allValues    = [20000  , 20000  , 20000  , 5000   , 5000   , 10000, 10000, 4000, 4000, 8000, 10000, 8000, 60000   , 20000   ,  10000 ,3000     ,3000   ,3000  ,3000 ,0,0,0,0,10000    ];
        var neverSell = ["power", 'utrium_bar','lemergium_bar','zynthium_bar','keanium_bar','ghodium_melt','oxidant','reductant','purifier','battery','composite','crystal','liquid','wire','switch','transistor','microchip','circuit','cell','phlegm','tissue','muscle','organoid','alloy','tube','fixtures','frame','hydraulics','condensate','concentrate','extract','spirit','emanation'];        
        var neverBuy = [ "ops","silicon","metal","mist","biomass"];        
       
        
        
        
        var listOfResourcesInsideTerminal = Game.rooms[roomname].terminal.store;
        var resourcekeys = Object.keys(listOfResourcesInsideTerminal);
        var resourcevalues = Object.values(listOfResourcesInsideTerminal);
         
         
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        for(var i = 0; i < resourcekeys.length; i++) // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL
        {
            var itemfound = false;
            for(var j = 0; j < allResources.length; j++) // resource in terminal but under half od goal amount                    // SELL
            {
                if(resourcekeys[i] == allResources[j])
                {
                    itemfound = true;
                }
                if(resourcekeys[i] == allResources[j] && resourcevalues[i] > allValues[j]) // if terminal has more than required 
                {
                    let buyOrders = Game.market.getAllOrders(
                    {
                        resourceType: resourcekeys[i],
                        type: ORDER_BUY
                    });
                    _.sortBy(buyOrders, ['price']);
                    var excessResources = resourcevalues[i] - allValues[j];
                    if(buyOrders.length > 1 && (excessResources > 200 || allValues[j] ==0))
                    {
                        if(resourcekeys[i] != "energy") // sell excess level   // ignores energy as it is handeled elsehwere
                        {
                            var hist = Game.market.getHistory(resourcekeys[i]);
                            
                            
                            
                            
                            // check if the item is on the never sell list
                         var found = false;
                         for(q = 0; q < neverSell.length; q++)
                         {
                             if(neverSell[q] == resourcekeys[i])
                             {
                                 found = true;
                             }
                         }
                            
                            
                            
                            
                          
                            
                            if(!found)
                            {
                                Game.market.deal(buyOrders[buyOrders.length - 1].id, excessResources, roomname); ////////////////////////////////////////
                            }
                        }
                        //  console.log(JSON.stringify(buyOrders[buyOrders.length - 1]));
                    }
                }
            }
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        for(var j = 0; j < allResources.length; j++) // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY
        {
            var itemfound = false;
            var valueneede = 0;
            for(var i = 0; i < resourcekeys.length; i++) // check iff the resoure is here 
            {
                if(resourcekeys[i] == allResources[j])
                {
                    itemfound = true;
                    //  console.log("curr res ",resourcevalues[i] ,"  des res  ", allValues[j] );
                    if(resourcevalues[i] < allValues[j] * 0.5)
                    { // if we are low on this resource
                        if(terminalActual.store.getFreeCapacity() != 0)
                        {
                            // buy resources
                            let SellOrders = Game.market.getAllOrders(
                            {
                                resourceType: allResources[j],
                                type: ORDER_SELL
                            });
                            var tmpresourcekeys = Object.keys(SellOrders);
                            var tmpresourcevalues = Object.values(SellOrders);
                            var maxvalue = 9999999;
                            var index = 999999;
                            for(var q = 0; q < tmpresourcekeys.length; q++)
                            {
                                if(SellOrders[tmpresourcekeys[q]].price < maxvalue)
                                {
                                    index = q;
                                    maxvalue = SellOrders[tmpresourcekeys[0]].price;
                                }
                            }
                            
                            
                            
                            
                            
                                                     var found = false;
                         for(q = 0; q < neverBuy.length; q++)
                         {
                             if(neverBuy[q] == resourcekeys[i])
                             {
                                 found = true;
                             }
                         }
                            
                            
                            
                            
                            
                            
                            
                            
                            
                            
                            
                            if(tmpresourcekeys.length != 0 && !found)
                            {
                                Game.market.deal(SellOrders[index].id, allValues[j] * 0.1, roomname)
                            }
                        }
                    }
                }
            }
            if(!itemfound  && allValues[j] != 0 )
            {
                let SellOrders = Game.market.getAllOrders(
                {
                    resourceType: allResources[j],
                    type: ORDER_SELL
                });
                var tmpresourcekeys = Object.keys(SellOrders);
                var tmpresourcevalues = Object.values(SellOrders);
                var maxvalue = 9999999;
                var index = 999999;
                for(var q = 0; q < tmpresourcekeys.length; q++)
                {
                    if(SellOrders[tmpresourcekeys[q]].price < maxvalue)
                    {
                        index = q;
                        maxvalue = SellOrders[tmpresourcekeys[0]].price;
                    }
                }
                if(index != 999999){
       Game.market.deal(SellOrders[index].id, 1, roomname);
                }
            }
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(storagevalue > 999000 && Game.rooms[roomname].controller.level ==8) // sell energy
        {
            let buyOrders = Game.market.getAllOrders(
            {
                resourceType: RESOURCE_ENERGY,
                type: ORDER_BUY
            });
            _.sortBy(buyOrders, ['price']);
            if(buyOrders.length != 0)
            {
                Game.market.deal(buyOrders[buyOrders.length - 1].id, 1000, roomname); ///////////////////////////////////////////////////
                // console.log(JSON.stringify(buyOrders[buyOrders.length - 1]));
            }
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////// BUY ENERGY ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(storagevalue < 50000 && terminalActual.store.getUsedCapacity(RESOURCE_ENERGY) < 65000 && Game.time % (2000) == 0)
        {
            var hist = Game.market.getHistory(RESOURCE_ENERGY)
            for(const id in Game.market.orders)
            {
                if(Game.market.orders[id].remainingAmount == 0)
                {
                    Game.market.cancelOrder(id);
                }
                Game.market.createOrder(
                {
                    type: ORDER_BUY,
                    resourceType: RESOURCE_ENERGY,
                    price: (hist[0].avgPrice + (hist[0].stddevPrice * 1.6)),
                    totalAmount: 200000,
                    roomName: roomname
                });
            }
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    }
}
module.exports = terminalManager;