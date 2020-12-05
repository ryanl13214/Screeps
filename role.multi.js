var creepfunctions = require('prototype.creepfunctions');
var multi = {
    /** @param {Creep} creep **/
    run: function(creep)
    {
     
       creepfunctions.checkglobaltasks(creep);
    }
};
module.exports = multi;