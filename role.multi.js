var creepfunctions = require('prototype.creepfunctions');
var multi = {
    /** @param {Creep} creep **/
    run: function(creep)
    {
     if(creep.memory.timer == undefined){
         creep.memory.timer =0;
     }
     creep.memory.timer ++;
         if(creep.memory.timer >10000){
         creep.suicide();
     }
       
     
   
     
       creepfunctions.checkglobaltasks(creep);
       
  
 
       
    }
};
module.exports = multi;