var rolerepair = require('role.repairer');
var roleHarvester = require('role.harvester');
var rolemover = require('role.mover');
var roleupgrader = require('role.upgrader');
var roletowermover = require('role.towermover');
var roleresourcemover = require('role.resourcemover');
var roleextractor = require('role.extractor');
var rolescout = require('role.scout');
var rolemulti = require('role.multi');
/////////////////////////////////////////////////////
var attackerChasedown = require('Guard.Chasedown');
var attackerarcher = require('Guard.archer');
var attackersolo = require('Guard.solo');
var attackersword = require('Guard.sword');
/////////////////////////////////////////////////////
var attackerRoomattacker = require('Attacker.roomAttacker');
/////////////////////////////////////////////////////
var creepfunctions = require('prototype.creepfunctions');
var roles = {
    run: function(creepsglobal)
    {
        for (var i = 0; i < creepsglobal.length; i++)
        {
            var startCpu = Game.cpu.getUsed();
            var creep = Game.creeps[creepsglobal[i].name];
            if (creep.spawning == false)
            {
                        var check = creepfunctions.checkglobaltasks(creep);
                if(check)
                {
                  
                    if (creep.memory.role == "guard")
                    {
                        try{
                        if (creep.memory.attackrole == "solochaser")
                        {
                            attackersolo.run(creep);
                        }
                        if (creep.memory.attackrole == "chasedown")
                        {
                           // attackerChasedown.run(creep);
                        }
                        if (creep.memory.attackrole == "archer")
                        {
                            
                            attackerarcher.run(creep);
                        }
                        if (creep.memory.attackrole == "sword")
                        {
                    //        attackersword.run(creep);
                        }
                        }catch(e){
                            console.log("guard error")
                        }
                    }
                   
                    if (creep.memory.role == "repair")
                    {
                        rolerepair.run(creep);
                    }
                    else if (creep.memory.role == "harvester")
                    {
                        roleHarvester.run(creep);
                    }
                    else if (creep.memory.role == "harvesteralt")
                    {
                        roleHarvester.run(creep);
                    }
                    else if (creep.memory.role == "mover" || creep.memory.role == "moveralt")
                    {
                        rolemover.run(creep);
                    }
                    else if (creep.memory.role == "towermover")
                    {
                        roletowermover.run(creep);
                    }
                    else if (creep.memory.role == "upgrader")
                    {
                        roleupgrader.run(creep);
                    }
                    else if (creep.memory.role == "resmover")
                    {
                        roleresourcemover.run(creep);
                    }
                    else if (creep.memory.role == "extractor")
                    {
                        roleextractor.run(creep);
                    }
                    else if (creep.memory.role == "scout")
                    {
                        rolescout.run(creep);
                    }
                    else if (creep.memory.role == "multi")
                    {
                        rolemulti.run(creep);
                    }
                    
                } 
            }
        }
    }
}
module.exports = roles;