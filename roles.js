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
var debug = true;
var roles = {
    run: function(creepsglobal)
    {
        for(var i = 0; i < creepsglobal.length; i++)
        {
            var startCpu = Game.cpu.getUsed();
            var creep = Game.creeps[creepsglobal[i].name];
            if(creep.spawning == false)
            {
                if(creep.memory.role == "repair")
                {
                    rolerepair.run(creep);
                    var powerManager_cpu_used = +Game.cpu.getUsed() - startCpu;
                    if(debug)
                    {
                        Memory.roleCPU.repairer += powerManager_cpu_used;
                    }
                }
                else if(creep.memory.role == "harvester")
                {
                    roleHarvester.run(creep);
                    var powerManager_cpu_used = +Game.cpu.getUsed() - startCpu;
                    if(debug)
                    {
                        Memory.roleCPU.harvester += powerManager_cpu_used;
                    }
                }
                else if(creep.memory.role == "harvesteralt")
                {
                    roleHarvester.run(creep);
                    var powerManager_cpu_used = +Game.cpu.getUsed() - startCpu;
                    if(debug)
                    {
                        Memory.roleCPU.harvester += powerManager_cpu_used;
                    }
                }
                else if(creep.memory.role == "mover" ||creep.memory.role == "moveralt"  )
                {
                    rolemover.run(creep);
                    var powerManager_cpu_used = +Game.cpu.getUsed() - startCpu;
                    if(debug)
                    {
                        Memory.roleCPU.mover += powerManager_cpu_used;
                    }
                }
                else if(creep.memory.role == "towermover")
                {
                    roletowermover.run(creep);
                    var powerManager_cpu_used = +Game.cpu.getUsed() - startCpu;
                    if(debug)
                    {
                        Memory.roleCPU.towerMover += powerManager_cpu_used;
                    }
                }
                else if(creep.memory.role == "upgrader")
                {
                    roleupgrader.run(creep);
                    var powerManager_cpu_used = +Game.cpu.getUsed() - startCpu;
                    if(debug)
                    {
                        Memory.roleCPU.upgrader += powerManager_cpu_used;
                    }
                }
                else if(creep.memory.role == "resmover")
                {
                    
                    roleresourcemover.run(creep);
                    var powerManager_cpu_used = +Game.cpu.getUsed() - startCpu;
                    if(debug)
                    {
                        Memory.roleCPU.resourceMover += powerManager_cpu_used;
                    }
                   
                }
                else if(creep.memory.role == "extractor")
                {
                    roleextractor.run(creep);
                    var powerManager_cpu_used = +Game.cpu.getUsed() - startCpu;
                    if(debug)
                    {
                        Memory.roleCPU.extractor += powerManager_cpu_used;
                    }
                }
                else if(creep.memory.role == "guard")
                {
                 //   try{
                    roleguard.run(creep);
                        
             //       }catch(e){}
                }
                else if(creep.memory.role == "scout")
                {
                    rolescout.run(creep);
                    var powerManager_cpu_used = +Game.cpu.getUsed() - startCpu;
                    if(debug)
                    {
                        Memory.roleCPU.scout += powerManager_cpu_used;
                    }
                }
                else if(creep.memory.role == "multi")
                {
                    rolemulti.run(creep);
                }
            }
        }
    }
}
module.exports = roles;