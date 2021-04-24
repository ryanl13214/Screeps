
var factoryManager = {
    run: function(roomname,termin,fact)
    {
        var allResources = [ 'battery','energy',"H"  , "O", "U", "L", "Z", "X", "G",  'utrium_bar', 'lemergium_bar', 'zynthium_bar', 'keanium_bar', 'ghodium_melt', 'oxidant', 'reductant', 'purifier', 'composite', 'crystal', 'liquid',  'wire', 'cell',  'alloy', 'condensate', "silicon", "metal", "mist", "biomass",'switch', 'transistor', 'microchip', 'circuit',  'phlegm', 'tissue', 'muscle', 'organoid', 'tube', 'fixtures', 'frame', 'hydraulics','concentrate', 'extract', 'spirit', 'emanation' ,'machine','organism','device','essence'];
        var allValues    = [ 2000     ,8000    ,2000 ,2000,2000,2000,2000,2000,2000,    800       , 800            , 800           ,800           ,  800          ,800       , 800        , 800       ,   800      ,   800    ,     800 , 1000   , 1000  , 1000    , 1000        , 1000     , 1000   , 1000  , 1000     ,50      ,30           ,10          ,10        ,30        ,30       ,10       ,5          ,30     ,30         ,10      ,10           ,50           ,30        ,20       ,5           , 0        ,0        ,0        ,     0  ];
                                                                      
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
                    resmoveractual.memory.memstruct.tasklist.push(["withdraw",fact.id   ,allResources[j] , (resourcevalues[i]-allValues[j]) ]);
                    resmoveractual.memory.memstruct.tasklist.push(["transfer",termin.id ,allResources[j] , (resourcevalues[i]-allValues[j]) ]);
                 }
             }
         }
     
     
     
           
 
             for(var j = 0; j < allResources.length; j++)   // transfer to fact
             {
              
                 if(    allValues[j] >  fact.store.getUsedCapacity(allResources[j])  && resmoveractual.memory.memstruct.tasklist.length ==0       && termin.store.getUsedCapacity(allResources[j]) > 100  )  
                 { 
           
                     resmoveractual.memory.memstruct.tasklist.push(["deposit"]);
                  resmoveractual.memory.memstruct.tasklist.push(["withdraw",termin.id   ,allResources[j] , (allValues[j]) - fact.store.getUsedCapacity(allResources[j])    ]);
                    resmoveractual.memory.memstruct.tasklist.push(["transfer",fact.id ,allResources[j] ]);
                 }
             }
        
     
     
     
     
     
     
     
           }
     
     
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       if(fact.level !=2){
     // if level ==0 or no power
  //   lvl 0 resources
  var basic =    ['wire', 'cell',  'alloy', 'condensate'];
  var basicamounts =[1000,1000,  1000, 1000];
     var breaks=false;
          for(var i = 0; i < basic.length; i++) 
         {  
             if( fact.store.getUsedCapacity(basic[i]) < basicamounts[i] || termin.store.getUsedCapacity(basic[i]) < basicamounts[i] *1.9){
                 
                 
             var a =      fact.produce(basic[i]);
                 
                 if(a == 0 ){
                      breaks=true;
                 }
             }
     
         }
    
         
     
     
     
       var basic =    [ 'lemergium_bar', 'zynthium_bar', 'keanium_bar', 'ghodium_melt', 'oxidant', 'reductant', 'purifier'];
  var basicamounts =[2000,2000,2000,2000,2000,2000,2000,2000];
     var breaks=false;
          for(var i = 0; i < basic.length; i++) 
         {  
             if(   termin.store.getUsedCapacity(basic[i]) < basicamounts[i]  ){
                 
                 
                  fact.produce(basic[i]);
                 
          
             }
     
         }
     
     
     
     
     
     
     
       }
     
     
     
     
     
     
     
     
     
     
     
     if(fact.level ==2  ){
      
         
           var basic =    ['fixtures', 'tissue',  'transistor', 'extract'];
           var basicamounts =[90,90,  90, 90];
  
          for(var i = 0; i < basic.length; i++) 
         {  
                 if( fact.store.getUsedCapacity(basic[i]) < basicamounts[i] || termin.store.getUsedCapacity(basic[i]) < basicamounts[i]  ){
            
                  
                fact.produce(basic[i]) ;
                
                 
                 }
     
         }
     
     
         
         
         
     }
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
    }
}
module.exports = factoryManager;