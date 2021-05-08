 /*
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
         var allResources = ["XGHO2", "XUH2O", "XLH2O", "XLHO2", "XZH2O", "XZHO2", "H", "O", "U", "L", "Z", "X", "G", "energy", "XKHO2", "power", "silicon", "metal", "mist", "biomass", "machine", "organism", "essence", "device", 'utrium_bar', 'lemergium_bar', 'zynthium_bar', 'keanium_bar', 'ghodium_melt', 'oxidant', 'reductant', 'purifier', 'battery', 'composite', 'crystal', 'liquid', 'wire', 'switch', 'transistor', 'microchip', 'circuit', 'cell', 'phlegm', 'tissue', 'muscle', 'organoid', 'alloy', 'tube', 'fixtures', 'frame', 'hydraulics', 'condensate', 'concentrate', 'extract', 'spirit', 'emanation']; // power and facory resources
         var allValues = [20000, 10000, 10000, 20000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 80000, 20000, 5000, 2000, 2000, 2000, 2000, 0, 0, 0, 0, 1000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 1000, 10, 30, 10, 10, 1000, 100, 30, 10, 10, 1000, 100, 30, 10, 10, 1000, 30, 10, 10, 10];
         var neverSell = ["ops", 'condensate', 'alloy', 'cell', 'wire', 'condensate', 'wire', 'cell', 'alloy', "XGHO2", "XUH2O", "XLHO2", "XZH2O", "XZHO2", "XKHO2", 'utrium_bar', 'lemergium_bar', 'zynthium_bar', 'keanium_bar', 'ghodium_melt', 'oxidant', 'reductant', 'purifier', 'battery', 'composite', 'crystal', 'liquid'];
         var neverBuy = ["ops", 'wire', 'switch', 'transistor', 'microchip', 'circuit', 'cell', 'phlegm', 'tissue', 'muscle', 'organoid', 'alloy', 'tube', 'fixtures', "biomass", 'frame', 'hydraulics', 'condensate', 'concentrate', 'extract', 'spirit', 'emanation'];
         var allspawns = Game.rooms[roomname].find(FIND_MY_SPAWNS);
         if(allspawns.length == 0)
         {
             for(var i = 0; i < allValues.length; i++)
             {
                 allValues[i] = 0;
             }
         }
         var temp = 0;
         // get sum of values       280340
         for(var i = 0; i < allValues.length; i++) // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL
         {
             temp += allValues[i];
         }
         var listOfResourcesInsideTerminal = Game.rooms[roomname].terminal.store;
         var resourcekeys = Object.keys(listOfResourcesInsideTerminal);
         var resourcevalues = Object.values(listOfResourcesInsideTerminal);
         var roominrange = [];
         var roomsall = Object.keys(Game.rooms);
         var roomsobj = Game.rooms;
         for(var i = 0; i < roomsall.length; i++)
         {
             if(roomsobj[roomsall[i]].controller != undefined)
             {
                 if(roomsobj[roomsall[i]].controller.owner != undefined)
                 {
                     if((roomsobj[roomsall[i]]).controller.owner.username === "Q13214" && (roomsobj[roomsall[i]]).terminal != undefined)
                     {
                         if(Game.map.getRoomLinearDistance(roomname, roomsall[i]) < 10 && Game.map.getRoomLinearDistance(roomname, roomsall[i]) != 0)
                         {
                             roominrange.push(roomsall[i]);
                         }
                     }
                 }
             }
         }
         var breaker = false;
         for(var i = 0; i < allResources.length; i++)
         {
             if(breaker == false)
             {
                 for(var j = 0; j < roominrange.length; j++)
                 {
                     var transferin = Game.flags[roominrange[j]].memory.blocktranferIntoRoom;
                     var transferout = Game.flags[roomname].memory.blocktranferIntoRoom;
                     if(transferout)
                     {
                         if(Game.rooms[roomname].terminal != undefined && allResources[i] != "energy")
                         {
                             terminalActual.send(allResources[i], terminalActual.store.getUsedCapacity(allResources[i]), roominrange[j], '0');
                         }
                     }
                     else
                     {
                         if(Game.rooms[roomname].terminal != undefined && !transferin)
                         {
                             if((  Game.rooms[roominrange[j]].terminal.store.getFreeCapacity() > 10000  || Game.rooms[roominrange[j]].terminal.store.getUsedCapacity("energy") > 10000  ) &&             Game.rooms[roominrange[j]].terminal.store.getUsedCapacity(allResources[i]) * 1.3 < terminalActual.store.getUsedCapacity(allResources[i]) && (terminalActual.store.getUsedCapacity(allResources[i]) > allValues[i] * 0.5 || allResources[i] == "energy"))
                             {
                                 console.log(roomname+" transfwering-"+ Math.min(20000,terminalActual.store.getUsedCapacity(allResources[i]) - Game.rooms[roominrange[j]].terminal.store.getUsedCapacity(allResources[i])  / 2)+" "+ allResources[i]+"- into -"+roominrange[j] );
                                 
                                 terminalActual.send(allResources[i], Math.min(20000,terminalActual.store.getUsedCapacity(allResources[i]) - Game.rooms[roominrange[j]].terminal.store.getUsedCapacity(allResources[i])  / 2), roominrange[j], '0');
                                 breaker = true;
                             }
                         }
                     }
                 }
             }
         }
         if(allspawns.length != 0)
         {
             //                                                                          buy and sell from market 
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
                         var excessResources = resourcevalues[i] - allValues[j];
                         if(buyOrders.length > 1 && (excessResources > 1 || allValues[j] == 0))
                         {
                             if(resourcekeys[i] != "energy")
                             {
                                 var hist = Game.market.getHistory(resourcekeys[i]);
                                 var tmpresourcekeys = Object.keys(buyOrders);
                                 var tmpresourcevalues = Object.values(buyOrders);
                                 var maxvalue = 0;
                                 var index = 999999;
                                 for(var q = 0; q < tmpresourcekeys.length; q++)
                                 {
                                     if(buyOrders[tmpresourcekeys[q]].price > maxvalue)
                                     {
                                         index = q;
                                         maxvalue = buyOrders[tmpresourcekeys[q]].price;
                                     }
                                 }
                                 // check if the item is on the never sell list
                                 var found = false;
                                 for(q = 0; q < neverSell.length; q++)
                                 {
                                     if(neverSell[q] == resourcekeys[i])
                                     {
                                         found = true;
                                     }
                                 }
                                 if(!found || (found && terminalActual.store.getFreeCapacity() < 10000) && breaker == false) // stopped selling on full terminal
                                 {
                                     breaker = true;
                                     Game.market.deal(buyOrders[index].id, excessResources, roomname); ////////////////////////////////////////
                                 }
                             }
                         }
                     }
                 }
             }
             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            
             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             for(var j = 0; j < allResources.length; j++) // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY // BUY
             {
                 var breaker = false;
                 var itemfound = false;
                 var valueneede = 0;
                 for(var i = 0; i < resourcekeys.length; i++) // check iff the resoure is here 
                 {
                     if(resourcekeys[i] == allResources[j])
                     {
                         itemfound = true;
                         if(resourcekeys[i] != "energy")
                         {
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
                                             maxvalue = SellOrders[tmpresourcekeys[q]].price;
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
                                     var hist = Game.market.getHistory(resourcekeys[i])
                                     //  (hist[0].avgPrice ),
                                     if(tmpresourcekeys.length != 0 && !found && breaker == false)
                                     {
                                         breaker = true;
                                         Game.market.deal(SellOrders[index].id, allValues[j] * 0.1, roomname)
                                     }
                                 }
                             }
                         }
                     }
                 }
                 var found = false;
                 for(q = 0; q < neverBuy.length; q++)
                 {
                     if(neverBuy[q] == allResources[j])
                     {
                         found = true;
                     }
                 }
                 if(!itemfound && allValues[j] != 0 && breaker == false && found == false)
                 {
                     let SellOrders = Game.market.getAllOrders(
                     {
                         resourceType: allResources[j],
                         type: ORDER_SELL
                     });
                     var tmpresourcekeys = Object.keys(SellOrders);
                     var tmpresourcevalues = Object.values(SellOrders);
                     var maxvalue = 999999999;
                     var index = 999999;
                     for(var q = 0; q < tmpresourcekeys.length; q++)
                     {
                         if(SellOrders[tmpresourcekeys[q]].price < maxvalue)
                         {
                             index = q;
                             maxvalue = SellOrders[tmpresourcekeys[q]].price;
                         }
                     }
                     if(index != 999999 && maxvalue != 999999999)
                     {
                         breaker = true;
                         Game.market.deal(SellOrders[index].id, 1, roomname); //////// broken triggerimng when shouldnt
                     }
                 }
             }
             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            
             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            
             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             if(storagevalue > 999000 && Game.rooms[roomname].controller.level == 8) // sell energy
             {
                 let buyOrders = Game.market.getAllOrders(
                 {
                     resourceType: RESOURCE_ENERGY,
                     type: ORDER_BUY
                 });
                 _.sortBy(buyOrders, ['price']);
                 if(buyOrders.length != 0)
                 {
                     //    Game.market.deal(buyOrders[buyOrders.length - 1].id, 1000, roomname); ///////////////////////////////////////////////////
                     // console.log(JSON.stringify(buyOrders[buyOrders.length - 1]));
                 }
             }
             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             ////////////////////////////////////////////////////////// BUY ENERGY ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             var q = 0;
             for(const id in Game.market.orders)
             {
                 if(Game.market.orders[id].remainingAmount == 0)
                 {
                     Game.market.cancelOrder(id);
                 }
                 q++;
             }
             if(Game.rooms[roomname].storage.store.getUsedCapacity("energy") < 50000 && Game.time % (20000) == 0)
             {
                 var hist = Game.market.getHistory(RESOURCE_ENERGY)
                 Game.market.createOrder(
                 {
                     type: ORDER_BUY,
                     resourceType: RESOURCE_ENERGY,
                     price: (hist[0].avgPrice + (hist[0].stddevPrice * 1.3)),
                     totalAmount: 200000,
                     roomName: roomname
                 });
             }
             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             if(Game.rooms[roomname].storage.store.getUsedCapacity("energy") < 300000 && Game.market.credits > 30000000 && q < Game.gcl.level)
             {
                 console.log("buying energy");
                 var hist = Game.market.getHistory(RESOURCE_ENERGY)
                 Game.market.createOrder(
                 {
                     type: ORDER_BUY,
                     resourceType: RESOURCE_ENERGY,
                     price: (hist[0].avgPrice + (hist[0].stddevPrice * 1.3)),
                     totalAmount: 500000,
                     roomName: roomname
                 });
             }
             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
           
           
           
           
           
            
             
               
               
    //   ["drop" , "what to drop"]
            
               
          //        creep.drop(targ, creep.memory.memstruct.tasklist[0][1]);
       if(Game.rooms[roomname].storage.store.getUsedCapacity("energy") < 50000 && Game.time % (200) == 0)
             {
             for(var j = 0; j < allResources.length; j++) // transfer to strg
            {
             if(  Game.rooms[roomname].terminal.store.getUsedCapacity(allResources[j]) > allValues[j]  )
                {
                      var hist = Game.market.getHistory(allResources[j])
                      Game.market.createOrder(
                 {
                     type: ORDER_SELL,
                     resourceType: allResources[j],
                     price: (hist[0].avgPrice *0.7),
                     totalAmount: (allValues[j] - Game.rooms[roomname].terminal.store.getUsedCapacity(allResources[j]) ) /5,
                     roomName: roomname
                 });
                }
            
            }
             }
             ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         }
     }
 }
 module.exports = terminalManager;