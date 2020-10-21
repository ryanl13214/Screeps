var rolejack = require('role.jack');
var roleflag = require('role.jointflaggers');
var rolerepair = require('role.repairer');
var roleHarvester = require('role.harvester');
var rolemover = require('role.mover');
var roleupgrader = require('role.upgrader');
var roletowermover = require('role.towermover');
var roleclaimer = require('role.claimer');



var roles = 
{
    run: function() 
    {
        
         
 
        var creepsglobal =Game.creeps;
 
        
        for(var name in creepsglobal)
        {
            var creep = Game.creeps[name];
            if(creep.memory.role=="jack"){
                rolejack.run(creep);
            }
            
            if(creep.memory.role=="flagger"){
                roleflag.run(creep);
            }
            if(creep.memory.role=="repair"){
                rolerepair.run(creep);
            }
            if(creep.memory.role=="harvester"){
                roleHarvester.run(creep);
            }
            if(creep.memory.role=="harvesteralt"){
                roleHarvester.run(creep);
            }         
            if(creep.memory.role=="claimer"){
                roleclaimer.run(creep);
            }  
            if(creep.memory.role=="mover"){
                rolemover.run(creep);
            }
            if(creep.memory.role=="towermover"){
                roletowermover.run(creep);
            }
            if(creep.memory.role=="upgrader"){
                roleupgrader.run(creep);
            }
            if(creep.memory.role=="attacker"){
                roleflag.run(creep);/////////////////////////////////////////////////////////
            }
            
        }
    }
}

module.exports = roles;



