var roles = require('roles');
var spawnmain = require('spawn');
var buildbase = require('buildbase');
var tower = require('tower');
var defcon = require('defcon');
var terminalManager = require('terminal');
var ownedrooms=["W35S8"];
 
var storecpu=0;
 
var ticks=0;
module.exports.loop = function (){

         var mainstartCpu = Game.cpu.getUsed();
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
        var storagevalue = 0;
        var defconlevel;
        if (Game.rooms[roomname].storage != undefined)
        {
            storagevalue = Game.rooms[roomname].storage.store.energy;
        }
      
        var startCpu = Game.cpu.getUsed();
            defconlevel = defcon.run(roomname);
        var defcon_cpu_used =+ Game.cpu.getUsed() - startCpu;
      
      
      
        var startCpu = Game.cpu.getUsed();
            spawnmain.run(roomname,defconlevel,storagevalue);
        var spawnmain_cpu_used =+ Game.cpu.getUsed() - startCpu;
      
      
        
        if(Game.time%5==0)
        {
            var startCpu = Game.cpu.getUsed();
                buildbase.run(roomname,25,13);
            var buildbase_cpu_used =+ Game.cpu.getUsed() - startCpu;
        }    
        
        var startCpu = Game.cpu.getUsed();
            tower.run(roomname);
        var tower_cpu_used =+ Game.cpu.getUsed() - startCpu;
        
        
        //markets here
        var startCpu = Game.cpu.getUsed();
            terminalManager.run(roomname,0,defconlevel,storagevalue) 
        var tower_cpu_used =+ Game.cpu.getUsed() - startCpu;
        
        
        //labs here
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    //}catch(e){}
    }//end of rooms loop 
      var all_cpu_used =+ Game.cpu.getUsed() - mainstartCpu;
      ticks+=1;
        storecpu+=all_cpu_used;
   // console.log(storecpu/ticks);
   
    
    if(false){
        storecpu=0;
        ticks=0;
    }
    
    
    
}