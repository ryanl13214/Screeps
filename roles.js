var rolejack = require('role.jack');
var rolerepair = require('role.repairer');
var roleHarvester = require('role.harvester');
var rolemover = require('role.mover');
var roleupgrader = require('role.upgrader');
var roletowermover = require('role.towermover');
var roleresourcemover = require('role.resourcemover');
var roleextractor = require('role.extractor');
var roleguard = require('role.basicroomguard');
var rolescout = require('role.scout');
var rolemulti = require('role.multi');
var roles = {
    run: function(creepsglobal)
    {
        for(var i = 0; i < creepsglobal.length; i++)
        {
            var creep = Game.creeps[creepsglobal[i].name];
            if(creep.spawning == false)
            {
                if(creep.memory.role == "jack")
                {
                    try
                    {
                        rolejack.run(creep);
                    } 
                    catch (e)
                    {
                        if(Game.time % 1000 == 0)
                        {
                            console.log("jack error");
                        }
                    }
                }
                else
                if(creep.memory.role == "repair")
                {
                    rolerepair.run(creep);
                }
                else
                if(creep.memory.role == "harvester")
                {
                    roleHarvester.run(creep);
                }
                else
                if(creep.memory.role == "harvesteralt")
                {
                    roleHarvester.run(creep);
                }
                else
                if(creep.memory.role == "mover")
                {
                    rolemover.run(creep);
                }
                else
                if(creep.memory.role == "towermover")
                {
                    roletowermover.run(creep);
                }
                else
                if(creep.memory.role == "upgrader")
                {
                    roleupgrader.run(creep);
                }
                else
                if(creep.memory.role == "resmover")
                {
                    try
                    {
                        roleresourcemover.run(creep);
                    }
                    catch (e)
                    {
                        if(Game.time % 1000 == 0)
                        {
                            console.log("res mover error");
                        }
                    }
                }
                else
                if(creep.memory.role == "extractor")
                {
                    roleextractor.run(creep);
                }
                else
                if(creep.memory.role == "guard")
                {
                    roleguard.run(creep);
                }
                else
                if(creep.memory.role == "scout")
                {
                    rolescout.run(creep);
                }
                if(creep.memory.role == "multi")
                {
                    rolemulti.run(creep);
                }
            }
        }
    }
}
module.exports = roles;