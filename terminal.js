3 /*
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
         var allResources = ["XGHO2", "XUH2O", "XLHO2", "XZH2O", "XZHO2", "H", "O", "U", "L", "Z", "X", "G", "energy", "GO", "XKHO2","GH2O","power"]; // power and facory resources
         var allValues = [20000, 20000, 20000, 5000, 5000, 36000, 28000, 4000, 4000, 8000, 20000, 4000, 60000, 3000, 25000,10000,8000];

         var listOfResourcesInsideTerminal = Game.rooms[roomname].terminal.store;
         var resourcekeys = Object.keys(listOfResourcesInsideTerminal);
         var resourcevalues = Object.values(listOfResourcesInsideTerminal);
         
         
         /*
         
         
         for(const id in Game.market.orders) {
             if(Game.market.orders[id].remainingAmount ==0){
    Game.market.cancelOrder(id);
    console.log("cancellimng orders");
             }
}
         */
         
          
         
         
         
         
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
                                 if (storagevalue > 999000)
                                 {
                                     Game.market.deal(buyOrders[buyOrders.length - 1].id, excessResources, roomname); ////////////////////////////////////////
                                 }
                             }
                             else
                             {
                                 Game.market.deal(buyOrders[buyOrders.length - 1].id, excessResources, roomname); /////////////////////////////////
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
 
                             Game.market.deal(buyOrders[buyOrders.length - 1].id, excessResources, roomname); ///////////////////////////////////////////////////

                         }
                         else
                         {
                             Game.market.deal(buyOrders[buyOrders.length - 1].id, excessResources, roomname); /////////////////////////////////////////////////////////////////////////////////////////
                         }
                          
                     }
                 }
             }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             for (var j = 0; j < allResources.length; j++) // fro all desired reources
             {
                 var itemfound = false;
                 var valueneede = 0;
                 for (var i = 0; i < resourcekeys.length; i++) // check iff the resoure is here 
                 {

                     if (resourcekeys[i] == allResources[j])
                     {
                         itemfound = true;
                         //  console.log("curr res ",resourcevalues[i] ,"  des res  ", allValues[j] );
                         if (resourcevalues[i] < allValues[j] * 0.5)
                         { // if we are low on this resource
                             if (terminalActual.store.getFreeCapacity() != 0)
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

                                 for (var q = 0; q < tmpresourcekeys.length; q++)
                                 {

                                     if (SellOrders[tmpresourcekeys[q]].price < maxvalue)
                                     {
                                         index = q;
                                         maxvalue = SellOrders[tmpresourcekeys[0]].price;
                                     }

                                 }
                                 if (tmpresourcekeys.length != 0)
                                 {
                                     Game.market.deal(SellOrders[index].id, allValues[j] * 0.1, roomname)
                                 }

                             }
                         }
                     }

                 }

                 if (!itemfound)
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

                     for (var q = 0; q < tmpresourcekeys.length; q++)
                     {

                         if (SellOrders[tmpresourcekeys[q]].price < maxvalue)
                         {
                             index = q;
                             maxvalue = SellOrders[tmpresourcekeys[0]].price;
                         }

                     }

                     Game.market.deal(SellOrders[index].id, 100, roomname)

                  
                 }

             }

             if (storagevalue > 999000)// sell energy
             {
                 let buyOrders = Game.market.getAllOrders(
                 {
                     resourceType: RESOURCE_ENERGY,
                     type: ORDER_BUY
                 });
                 _.sortBy(buyOrders, ['price']);
                 if (buyOrders.length != 0)
                 {
                           Game.market.deal(buyOrders[buyOrders.length - 1].id, 1000, roomname);///////////////////////////////////////////////////
                      // console.log(JSON.stringify(buyOrders[buyOrders.length - 1]));
                 }
             }

             if (storagevalue < 50000 && terminalActual.store.getUsedCapacity(RESOURCE_ENERGY) < 65000 && Game.time % 2000 == 0)
             {
 
                 var hist = Game.market.getHistory(RESOURCE_ENERGY)

                 Game.market.createOrder(
                 {
                     type: ORDER_BUY,
                     resourceType: RESOURCE_ENERGY,
                     price: (hist[0].avgPrice + (hist[0].stddevPrice) ),
                     totalAmount: 100000,
                     roomName: roomname
                 });

             }
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             

         }
     }
 }
 module.exports = terminalManager;