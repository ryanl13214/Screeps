var creepfunctions = require('prototype.creepfunctions');
var multi = {
    /** @param {Creep} creep **/
    run: function(creep)
    {
     if(creep.memory.timer == undefined){
         creep.memory.timer =0;
     }
     creep.memory.timer ++;
     
     
     
   //  try{   creep.heal(creep);}catch(e){}
     
     
       creepfunctions.checkglobaltasks(creep);
       
     //  creepfunctions.movehomeandrenew(creep,creep.memory.memstruct.spawnRoom,180);
       
       
     if(creep.memory.timer >10000){
         creep.suicide();
     }
       
       
    }
};
module.exports = multi;