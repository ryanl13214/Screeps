
var storageManager = {
    run: function(roomname,termin,strg)
    {
        var allResources = [ 'battery'  ];
        var allValues    = [ 2000    ];
                                                                      
            var temp = 0;
         // get sum of values 
         for(var i = 0; i < allValues.length; i++) // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL // SELL
         {
             temp += allValues[i];
         }
     
     
     
     
         var listOfResourcesInsideTerminal = strg.store;
         var resourcekeys = Object.keys(listOfResourcesInsideTerminal);
         var resourcevalues = Object.values(listOfResourcesInsideTerminal);
     
        var resmover = fact.pos.findInRange(FIND_MY_CREEPS, 1,
                        {
                            filter: (creep) => (creep.memory.role ==  "resmover")
                        });
           
          var  resmoveractual = resmover[0];
           
           
           if(resmoveractual){
           
           
          for(var i = 0; i < resourcekeys.length; i++) // transfer to terminal
         {
             var itemfound = false;
             for(var j = 0; j < allResources.length; j++)  
             {
              
                 if(resourcekeys[i] == allResources[j] && resourcevalues[i] > allValues[j] && resmoveractual.memory.memstruct.tasklist.length ==0)  
                 {//     ["withdraw" , "5f4e3d6138522b1096393b7d","tissue"]
                     resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                    resmoveractual.memory.memstruct.tasklist.push(["withdraw",strg.id   ,allResources[j] , (resourcevalues[i]-allValues[j]) ]);
                    resmoveractual.memory.memstruct.tasklist.push(["transfer",termin.id ,allResources[j] , (resourcevalues[i]-allValues[j]) ]);
                 }
             }
         }
     
     
     
           
 
             for(var j = 0; j < allResources.length; j++)   // transfer to strg
             {
              
                 if(    allValues[j] >  strg.store.getUsedCapacity(allResources[j])  && resmoveractual.memory.memstruct.tasklist.length ==0       && termin.store.getUsedCapacity(allResources[j]) > 100  )  
                 {//     ["withdraw" , "5f4e3d6138522b1096393b7d","tissue"]
           
                     resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                   resmoveractual.memory.memstruct.tasklist.push(["withdraw",termin.id   ,allResources[j] , (allValues[j]) - strg.store.getUsedCapacity(allResources[j])    ]);
                    resmoveractual.memory.memstruct.tasklist.push(["transfer",strg.id ,allResources[j] ]);
                 }
             }
        
     
     
     
     
     
     
     
           }
      
     
     
     
      
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
    }
}
module.exports = storageManager;