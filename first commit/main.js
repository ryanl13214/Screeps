var roles = require('roles');
var spawnmain = require('spawn');
var buildbase = require('buildbase');
var tower = require('tower');
var defcon = require('defcon');
 var ownedrooms=["W35S8"];
module.exports.loop = function (){

 
//------------------------------------------------------------------------------------------------
//                                    ROLES
//------------------------------------------------------------------------------------------------
    var startCpu = Game.cpu.getUsed();
        roles.run();
    var roles_cpu_used =+ Game.cpu.getUsed() - startCpu;
 
//------------------------------------------------------------------------------------------------
//                          deleting memory
//------------------------------------------------------------------------------------------------
    for(var name in Memory.creeps)
    {
        if(!Game.creeps[name])
        {
            delete Memory.creeps[name];
        }
    }
//------------------------------------------------------------------------------------------------
 
    if(Game.cpu.bucket >9000){
        Game.cpu.generatePixel()
    }
    
//------------------------------------------------------------------------------------------------
//                    START OF ROOMS LOOP
//------------------------------------------------------------------------------------------------
    
    
    for (var i = 0 ; i <  ownedrooms.length ; i++)
    {
var  roomname= ownedrooms[i];
  
        var creepsInRoom =Game.rooms[roomname].creeps; 
     
      
        var startCpu = Game.cpu.getUsed();
            var defconlevel = defcon.run(roomname);
        var defcon_cpu_used =+ Game.cpu.getUsed() - startCpu;
      
      
        if(Game.time%2==0)
        {
            var startCpu = Game.cpu.getUsed();
                spawnmain.run(roomname,defconlevel);
            var spawnmain_cpu_used =+ Game.cpu.getUsed() - startCpu;
        }
      
        
        if(Game.time%500==0)
        {
            var startCpu = Game.cpu.getUsed();
                buildbase.run(roomname,25,13);
            var buildbase_cpu_used =+ Game.cpu.getUsed() - startCpu;
        }    
        
        var startCpu = Game.cpu.getUsed();
            tower.run(roomname);
        var tower_cpu_used =+ Game.cpu.getUsed() - startCpu;
        
        
        //markets here
        
        
         
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    //}catch(e){}
    }//end of rooms loop 
    
 
}