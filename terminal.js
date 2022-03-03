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
        buyItemsFromResourceList: function(roomname, allCondensedResources, terminalActual)
        {
            var neverBuy = ["energy", 'wire', 'switch', 'transistor', 'microchip', 'circuit', 'cell', 'phlegm', 'tissue', 'muscle', 'organoid', 'alloy', 'tube', 'fixtures', "biomass", 'frame', 'hydraulics', 'condensate', 'concentrate', 'extract', 'spirit', 'emanation'];
     
         
            for (var i = 0; i < allCondensedResources.length; i++)
            {
                let sellOrders = Game.market.getAllOrders(
                {
                    resourceType: allCondensedResources[i][0],
                    type: ORDER_SELL
                });
                var resourceInNeverBuyList = false;
                for (q = 0; q < neverBuy.length; q++)
                {
                    if (neverBuy[q] == allCondensedResources[i][0])
                    {
                        resourceInNeverBuyList = true;
                    }
                }
                var excessResources = allCondensedResources[i][1] - terminalActual.store.getUsedCapacity(allCondensedResources[i][0]);
                //   console.log("excessResources-",excessResources);
                if (excessResources > 1 && resourceInNeverBuyList == false && terminalActual.store.getUsedCapacity(allCondensedResources[i][0]) < allCondensedResources[i][1] / 2)
                {
                    var tmpresourcekeys = Object.keys(sellOrders);
                    var tmpresourcevalues = Object.values(sellOrders);
                    var maxvalue = 9999900999990;
                    var index = 999999;
                    for (var q = 0; q < tmpresourcekeys.length; q++)
                    {
                        if (sellOrders[tmpresourcekeys[q]].price < maxvalue)
                        {
                            index = q;
                            maxvalue = sellOrders[tmpresourcekeys[q]].price;
                        }
                    }
                    ///////////////// check price is withging hoistprical margin 
                    var hist = Game.market.getHistory(allCondensedResources[i][0]);
                    var tmp = 0;
                    var totalPrice = 0;
                    for (let object of hist)
                    {
                        //   console.log(JSON.stringify(object));   
                        totalPrice += object.avgPrice;
                        tmp++;
                    }
                    let avg = totalPrice / tmp;
                    /////////////////////
                    //     console.log("buying--", excessResources, "--", allCondensedResources[i][0], " comparing prices", sellOrders[index].price, "=<<=", (avg + (avg * allCondensedResources[i][2])));
                    if (index != 999999 && sellOrders[index].price < avg + (avg * allCondensedResources[i][2]) && terminalActual.store.getUsedCapacity("energy") > 1500)
                    {
                        if (excessResources + terminalActual.store.getUsedCapacity(allCondensedResources[i][0]) > allCondensedResources[i][1] / 2)
                        {
                            excessResources = allCondensedResources[i][1] / 2 - terminalActual.store.getUsedCapacity(allCondensedResources[i][0]);
                        }
                        if (excessResources > sellOrders[index].remainingAmount)
                        {
                            excessResources = sellOrders[index].remainingAmount;
                        }
                        if (excessResources > allCondensedResources[i][1] * 0.1)
                        {
                            console.log(roomname, " is buying--", excessResources, "--", allCondensedResources[i][0], " comparing prices - buying for:", sellOrders[index].price, "=<<= : max PRice", (avg + (avg * allCondensedResources[i][2])));
                            var a = Game.market.deal(sellOrders[index].id, excessResources, roomname);
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        sellItemsFromResourceList: function(roomname, allCondensedResources, terminalActual)
        {
            var neverSell = ["energy", 'power', 'wire', 'cell', 'alloy', 'condensate', "silicon", "metal", "mist", "biomass", 'utrium_bar', 'lemergium_bar', 'zynthium_bar', 'keanium_bar', 'ghodium_melt', 'oxidant', 'reductant', 'purifier', 'battery', 'composite', 'crystal', 'liquid'];
            
            
            
            // -----------------------   ["XGHO2",8000,0.2]https://screeps.com/a/#!/market/history
            for (var i = 0; i < allCondensedResources.length; i++)
            {
                let buyOrders = Game.market.getAllOrders(
                {
                    resourceType: allCondensedResources[i][0],
                    type: ORDER_BUY
                });
                var resourceInNeverSellList = false;
                for (q = 0; q < neverSell.length; q++)
                {
                    if (neverSell[q] == allCondensedResources[i][0])
                    {
                        resourceInNeverSellList = true;
                    }
                }
                var excessResources = terminalActual.store.getUsedCapacity(allCondensedResources[i][0]) - allCondensedResources[i][1];
                
                
            
                
                if (buyOrders.length > 1 && excessResources > 1 && resourceInNeverSellList == false && terminalActual.store.getUsedCapacity(allCondensedResources[i][0]) != 0)
                {
                    var hist = Game.market.getHistory(allCondensedResources[i][0]);
                    //// find best current deal
                    var tmpresourcekeys = Object.keys(buyOrders);
                    var tmpresourcevalues = Object.values(buyOrders);
                    var maxvalue = 0;
                    var index = 999999;
                    for (var q = 0; q < tmpresourcekeys.length; q++)
                    {
                        if (buyOrders[tmpresourcekeys[q]].price > maxvalue)
                        {
                            index = q;
                            maxvalue = buyOrders[tmpresourcekeys[q]].price;
                        }
                    }
                    ///////////////// check price is withging hoistprical margin 
                    ///
                    if (excessResources > buyOrders[index].remainingAmount)
                    {
                        
                        excessResources = buyOrders[index].remainingAmount;
                    }
                   
                   if(excessResources < 1)
                   {
                        return false
                   }
                   
                   
                   
                    console.log(roomname, " is selling--", excessResources, "--", allCondensedResources[i][0], " comparing prices - selling  for:", buyOrders[index].price);
                    Game.market.deal(buyOrders[index].id, excessResources, roomname);
                    return true;
                }
            }
            return false;
        },
        transferNonEnergy: function(roomname, allCondensedResources, terminalActual, roominrange)
        {
            var neverTransfer = ["power"];
            for (var i = 0; i < allCondensedResources.length; i++)
            {
                var nevertrnasfer = false;
                for (q = 0; q < neverTransfer.length; q++)
                {
                    if (neverTransfer[q] == allCondensedResources[i][0])
                    {
                        nevertrnasfer = true;
                    }
                }
                if (!nevertrnasfer)
                {
                    for (var j = 0; j < roominrange.length; j++)
                    {
                        if (Game.rooms[roominrange[j]])
                        {
                            var roomwithTerminal = Game.rooms[roominrange[j]].terminal;
                            if (terminalActual.store.getUsedCapacity(allCondensedResources[i][0]) > roomwithTerminal.store.getUsedCapacity(allCondensedResources[i][0]) && allCondensedResources[i][0] != "energy")
                            {
                                var transferAmou8nt = (terminalActual.store.getUsedCapacity(allCondensedResources[i][0]) - roomwithTerminal.store.getUsedCapacity(allCondensedResources[i][0])) / 2;
                                if (transferAmou8nt > 5000)
                                {
                                    transferAmou8nt = 5000;
                                }
                                if ((transferAmou8nt > 5 && allCondensedResources[i][1] < 200) || (transferAmou8nt > 150 && allCondensedResources[i][1] > 200))
                                {
                                    console.log("transfer-", allCondensedResources[i][0], "--", transferAmou8nt);
                                   terminalActual.send(allCondensedResources[i][0], transferAmou8nt, roominrange[j], '0');
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;
        },
        averageEnergy: function(roomname, allCondensedResources, terminalActual, roominrange)
        {
            var differenceFactor = 1.3;
            var trandferDirrefence = 0.4;

            for (var j = 0; j < roominrange.length; j++)
            {
                if (terminalActual != undefined)
                {
                    if (terminalActual.store.getUsedCapacity("energy") > 10000 && Game.rooms[roominrange[j]].terminal.store.getUsedCapacity("energy") * differenceFactor < terminalActual.store.getUsedCapacity("energy"))
                    {
                        console.log("averageEnergy");
                        var transferAmount = (terminalActual.store.getUsedCapacity("energy") - Game.rooms[roominrange[j]].terminal.store.getUsedCapacity("energy")) / 2;
                        //   const cost = Game.market.calcTransactionCost(1000, 'W0N0', 'W10N5');
                        terminalActual.send("energy", transferAmount, roominrange[j], '0');
                        return true;
                    }
                }
            }
        },
 
        run: function(roomname, terminalActual, storagevalue)
        {
            var allCondensedResources = [
                ["XGHO2", 8000,  1.4],
                ["XUH2O", 8000,  1.2],
                ["XLH2O", 8000,  1.2],
                ["XLHO2", 8000,  1.2],
                ["XZH2O", 8000,  1.4],
                ["XZHO2", 8000,  1.4],
                ["XKHO2", 8000, 1.4],
                ["KH2O", 4000,  1.2],
                ["XGH2O", 4000, 1.4],
                ['ops', 6000, 0.6],
                ["H", 7000, 0.6],
                ["O", 7000, 0.6],
                ["U", 7000, 0.6],
                ["L", 7000, 0.6],
                ["Z", 7000, 0.6],
                ["X", 7000, 0.6],
                ["G", 7000, 1.2],
                ["energy", 80000, 0.3],
                ['utrium_bar', 5000, 0.4],
                ['lemergium_bar', 5000, 0.4],
                ['zynthium_bar', 5000, 0.4],
                ['keanium_bar', 5000, 0.4],
                ['ghodium_melt', 5000, 0.4],
                ['oxidant', 5000, 0.4],
                ['reductant', 5000, 0.4],
                ['purifier', 5000, 0.4],
                ['battery', 9000, 0.4],
                ['composite', 7000, 1],
                ['crystal', 4000, 0.4],
                ['liquid', 4000, 0.4],
                ["silicon", 5000, 0.4],
                ['wire', 2000, 0.4],
                ['switch', 5, 0.2], ////////////////////////////////
                ['transistor', 0, 0.1],
                ['microchip', 0, 0.1],
                ['circuit', 0, 0.1],
                ["device", 0, 0.2],
                ["biomass", 5000, 0.4],
                ['cell', 2000, 0.4],
                ['phlegm', 30, 0.2],
                ['tissue', 0, 0.1],
                ['muscle', 0, 0.1],
                ['organoid', 0, 0.1],
                ["organism", 0, 0.2],
                ["mist", 5000, 0.4],
                ['condensate', 2000, 0.2],
                ['concentrate', 30, 0.2],
                ['extract', 30, 0.1],
                ['spirit', 0, 0.1],
                ['emanation', 0, 0.1],
                ["essence", 0, 0.2],
                ["metal", 5000, 0.3],
                ['alloy', 2000, 0.2],
                ['tube', 5, 0.2], ////////////////////////////////
                ['fixtures', 5, 0.1], ////////////////////////////////
                ['frame', 0, 0.1],
                ['hydraulics', 0, 0.1],
                ["power", 15000, 0.6],
                ["machine", 0, 0.2],
          //       ["ops", 2000, 0.2]
                ];


 
 
            ////////////////////////////////////////////////////////////////////////////////////
 
            /////////////////////////////////////////////////

            /////////////////////////////////////////////////////////////////////////////////////
            var allResources = [];
            var allValues = [];
            var count = 0;
            for (var i = 0; i < allCondensedResources.length; i++)
            {
                allResources.push(allCondensedResources[i][0]);
                allValues.push(allCondensedResources[i][1]);
                count += allCondensedResources[i][1];
            }
            var neverSell = ['power', 'wire', 'cell', 'alloy', 'condensate', "silicon", "metal", "mist", "biomass", 'utrium_bar', 'lemergium_bar', 'zynthium_bar', 'keanium_bar', 'ghodium_melt', 'oxidant', 'reductant', 'purifier', 'battery', 'composite', 'crystal', 'liquid'];
            var neverBuy = [ 'wire', 'switch', 'transistor', 'microchip', 'circuit', 'cell', 'phlegm', 'tissue', 'muscle', 'organoid', 'alloy', 'tube', 'fixtures', "biomass", 'frame', 'hydraulics', 'condensate', 'concentrate', 'extract', 'spirit', 'emanation'];
            var allspawns = Game.rooms[roomname].find(FIND_MY_SPAWNS);
            if (allspawns.length == 0)
            {
                for (var i = 0; i < allValues.length; i++)
                {
                    allValues[i] = 0;
                }
            }
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (allspawns.length != 0)
            {
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            
                var terminalInUse = false;
                var roominrange = [];
                var roomsall = Object.keys(Game.rooms);
                var roomsobj = Game.rooms;
                for (var i = 0; i < roomsall.length; i++)
                {
                    if (roomsobj[roomsall[i]].controller != undefined)
                    {
                        if (roomsobj[roomsall[i]].controller.owner != undefined)
                        {
                            if ((roomsobj[roomsall[i]]).controller.owner.username === "Q13214" && (roomsobj[roomsall[i]]).terminal != undefined)
                            {
                                if (Game.map.getRoomLinearDistance(roomname, roomsall[i]) < 10 && Game.map.getRoomLinearDistance(roomname, roomsall[i]) != 0)
                                {
                                    roominrange.push(roomsall[i]);
                                }
                            }
                        }
                    }
                    
                    
                } 
                  ////////////////////////////////////////////////////////////
                
                
                
                
                              ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            
                     if (terminalInUse == false )
                {
                terminalInUse = this.sellItemsFromResourceList(roomname, allCondensedResources, terminalActual)
                }  
                 if (terminalInUse == false)
                {
              //      terminalInUse = this.buyItemsFromResourceList(roomname, allCondensedResources, terminalActual)
                } 
         
                if (terminalInUse == false  && Game.rooms[roomname].controller.level == 8  )
                {
//terminalInUse = this.transferNonEnergy(roomname, allCondensedResources, terminalActual, roominrange)
                }
                
                      
                ////////////////////////////////////////////////////////////
            
                if (terminalInUse == false)
                {
        //             terminalInUse =   this.averageEnergy(roomname, allCondensedResources, terminalActual,roominrange)
                }
           
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              

                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            

                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////            
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                var ownedrooms = [];
                var roomsall = Object.keys(Game.rooms);
                var roomsobj = Game.rooms;
                for (var i = 0; i < roomsall.length; i++)
                {
                    if (roomsobj[roomsall[i]].controller != undefined && roomsobj[roomsall[i]].controller.owner != undefined && (roomsobj[roomsall[i]]).controller.owner.username === "Q13214")
                    {
                        ownedrooms.push(roomsall[i]);
                    }
                }
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                var roomOrders = [];
                for (const id in Game.market.orders)
                {
                    if (Game.market.orders[id].roomName == roomname && Game.market.orders[id].resourceType == RESOURCE_ENERGY)
                    {
                        roomOrders.push(Game.market.orders[id]);
                    }

                }
                ////////////////////////////////////////////////////////// BUY ENERGY ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                var q = 0;
                for (const id in Game.market.orders)
                {
                    if (Game.market.orders[id].remainingAmount == 0)
                    {
                        Game.market.cancelOrder(id);
                    }
                    q++;
                }
                
                
                                    var hist = Game.market.getHistory( "energy");
                    var tmp = 0;
                    var totalPrice = 0;
                    for (let object of hist)
                    {
                        //   console.log(JSON.stringify(object));   
                        totalPrice += object.avgPrice;
                        tmp++;
                    }
                    let avgPriceOfenergy = totalPrice / tmp;
                
                
                
                
                
                
                if(avgPriceOfenergy > 9){
                    
                }
                else     if ( Game.rooms[roomname].storage &&    Game.rooms[roomname].storage.store.getUsedCapacity(RESOURCE_ENERGY) < 50000 && roomOrders.length < 3)
                {
                     
                    
                    if (avgPriceOfenergy * 1.1 < 9)
                    {
                        Game.market.createOrder(
                        {
                            type: ORDER_BUY,
                            resourceType: RESOURCE_ENERGY,
                            price: (avgPriceOfenergy * 1.2),
                            totalAmount: 175000,
                            roomName: roomname
                        });
                    }
                    else
                    {
                        Game.market.createOrder(
                        {
                            type: ORDER_BUY,
                            resourceType: RESOURCE_ENERGY,
                            price: 9,
                            totalAmount: 175000,
                            roomName: roomname
                        });
                    }
                }
                else  if(  Game.rooms[roomname].storage &&    Game.rooms[roomname].storage.store.getUsedCapacity(RESOURCE_ENERGY) < 50000 && roomOrders.length > 2)// keep the cost updated
                {
                       var hist = Game.market.getHistory(RESOURCE_ENERGY)
                    for (var i = 0; i < roomOrders.length; i++)
                    {
                     Game.market.changeOrderPrice(roomOrders[i].id, (avgPriceOfenergy * 1.4)); 
                    }
                }
                
                
                
                
                
                
                
                
                
                
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }
}
module.exports = terminalManager;