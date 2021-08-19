var factoryManager = {
         simpleVisualiser: function(roomname,topos,frompos,textActual,number)
    {
     
    
          new RoomVisual(roomname).line(topos.x,topos.y,frompos.x,frompos.y);
                    new RoomVisual(roomname).text(textActual + number, frompos.x,frompos.y, {color: 'red', font: 0.3}); 
    
    },
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
                    var moveAmount =  (resourcevalues[i] - allValues[j]);
                    
                    
                        resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                        resmoveractual.memory.memstruct.tasklist.push(["withdraw", fact.id, allResources[j], moveAmount]);
                        resmoveractual.memory.memstruct.tasklist.push(["transfer", termin.id, allResources[j], moveAmount]);
                        this.simpleVisualiser(roomname,termin.pos,fact.pos,allResources[j],moveAmount);
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
                    
                      this.simpleVisualiser(roomname,fact.pos,termin.pos,allResources[j],moveAmount);
                }
            }
        }
        
        
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     var globalBreak = false;
     
     
     
        if(fact.level == 1 )
        {
           
                if(fact.store.getUsedCapacity('composite') < 720 )
                {
                    fact.produce('composite');
                    new RoomVisual(roomname).text('composite', fact.pos.x,fact.pos.y, {color: 'black', font: 0.3});  
                    globalBreak=true;
                }
            
        }
        if(fact.level == 2 && globalBreak == false)
        {
            var basic = ['crystal'];
  
                if(fact.store.getUsedCapacity(basic[0]) < 720)
                {
                    fact.produce(basic[0]);
                    new RoomVisual(roomname).text(basic[0], fact.pos.x,fact.pos.y, {color: 'black', font: 0.3});  
                    globalBreak=true;
                }
            
        }   
        if(fact.level == 3 && globalBreak == false )
        {
            var basic = ['liquid'];
            
                if(fact.store.getUsedCapacity(basic[0]) < 720)
                {
                    fact.produce(basic[0]);
                    new RoomVisual(roomname).text(basic[0], fact.pos.x,fact.pos.y, {color: 'black', font: 0.3});  
                    globalBreak=true;
                }
            
        }
        ////////////////////////////////////////////////////////
        if(fact.level == 2  && globalBreak == false )
        {
                   
            var basic = ['fixtures', 'tissue', 'transistor', 'extract'];
            var basicamounts = [90, 90, 90, 90];
            var tmp = 0;
            for(var i = 0; i < basic.length; i++)
            {
                if(fact.store.getUsedCapacity(basic[i]) < 90 || termin.store.getUsedCapacity(basic[i]) < 90 && tmp ==0)
                {
                      
                var a =    fact.produce(basic[i]);
                
                if(a == 0 ){
                   new RoomVisual(roomname).text(basic[i], fact.pos.x,fact.pos.y, {color: 'black', font: 0.3});  
                 tmp=1;   
                 globalBreak=true;
                }
                
                
                }
            }
        }
     
     
             if(fact.level ==1  && globalBreak == false )
        {
                   
            var basic = ['tube' ];
            var basicamounts = [90 ];
        
            for(var i = 0; i < basic.length; i++)
            {
                if(fact.store.getUsedCapacity(basic[i]) < 90 )
                {
                      
                 fact.produce(basic[i]);
                
               
                   new RoomVisual(roomname).text(basic[i], fact.pos.x,fact.pos.y, {color: 'black', font: 0.3});  
               
                 globalBreak=true;
              
                
                }
            }
        }
     
     
     
     
     
     
     
     
     
     
     
        if( globalBreak == false  )
        {
 
            var basic = ['alloy', 'cell', 'wire', 'condensate'];
          
            var breaks = false;
 
            for(var i = 0; i < basic.length; i++)
            {
                if(fact.store.getUsedCapacity(basic[i]) < 980  || (   termin.store.getUsedCapacity(basic[i]) < 1900 &&  fact.level != 2  ) && globalBreak == false   )
                {
                    fact.produce(basic[i]);
                    globalBreak = true;
                }
            }
            
              
         var basic2 =    ['lemergium_bar', 'zynthium_bar', 'keanium_bar', 'ghodium_melt', 'oxidant', 'reductant', 'purifier'];
             
    
            
            for(var i = 0; i < basic2.length; i++)
            {
                if(fact.store.getUsedCapacity(basic2[i]) < 720  ||  ( termin.store.getUsedCapacity(basic2[i]) < 1900 &&  fact.level != 2  ) && globalBreak == false   )
                {
                    fact.produce(basic2[i]);
                    globalBreak = true;
                }
            }  
            
            
            
            
            
            
        }
        
        
        
        
      
    }
}
module.exports = factoryManager;