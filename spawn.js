/*
    BODYPART_COST: {
        "move": 50,
        "work": 100,
        "attack": 80,
        "carry": 50,
        "heal": 250,
        "ranged_attack": 150,
        "tough": 10,
        "claim": 600
    },
*/
//Game.spawns['w35s8'].spawnCreep([MOVE], 'flager' + Game.time, {memory: {role: 'flagger' , target:"source0"}});
 
var spwan = 
{
    run: function(roomname,defconlevel) 
    {
        
   
        
        if(Game.spawns['W35S8'].spawning){
            if(    Game.spawns['W35S8'].spawning.name =='towermover' + roomname) {
                Game.spawns['W35S8'].spawning.setDirections([LEFT ]);
                
            }
            else{
                    Game.spawns['W35S8'].spawning.setDirections([RIGHT ]);
                
            }
        }
        
        
        
        
        
 
        
        
        
        
        
        
        
        
        
        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
        var creepsinroom= Game.rooms[roomname].find(FIND_MY_CREEPS);
        
        var jacks       = _.filter(creepsinroom, (creep) => creep.memory.role == 'jack'      );
        var repairers   = _.filter(creepsinroom, (creep) => creep.memory.role == 'repair'    );
        var towermover  = _.filter(creepsinroom, (creep) => creep.memory.role == 'towermover');
        var harvesters  = _.filter(creepsinroom, (creep) => creep.memory.role == 'harvester' );
        var movers      = _.filter(creepsinroom, (creep) => creep.memory.role == 'mover'     );
        var upgraders   = _.filter(creepsinroom, (creep) => creep.memory.role == 'upgrader'  );

        
        var storagevalue =0;
        if(Game.rooms[roomname].storage != undefined){
            
            storagevalue = Game.rooms[roomname].storage.store.energy;
        }
        
     
        var requiredJacks =5;
        
        if(Game.rooms[roomname].controller.level > 3 && storagevalue >10000 && creepsinroom.length !=0 ){
            requiredJacks=0;
        }
         
    
    /*
    CREEPS WITH MEMSTRUCTS
        jack 
        mover
        attackcreeps
        scout
        claimer
    */
       //standard creep memory
    var  memstruct={
        pickuptarget:"",
        pickupitem:"",
        transfertargroom:"",
        transfercontainer:""
    };
       
       
       
       
       var claim=false;
       var claimroomtarg;
       var routetotargroom ;
       if (Game.flags[roomname+"claim"]){
           claim=true;
           claimroomtarg=Game.flags[roomname+"claim"].memory;
           
 
       }
      
       
       
       
       
     //  console.log(claim && Game.time%200   <10);
       
       
       
       
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        for( var i =0;i<spawnss.length;i++)
        {
            if(jacks.length ==0 && requiredJacks !=0) 
            {
                spawnss[i].spawnCreep([WORK,CARRY,MOVE,CARRY,MOVE ], 'jack' + Game.time, {memory: {role: 'jack',cpuUsed:0,roomtarg: roomname,sourcetarget:Game.time%2,tasklist:[],full:false,memstruct:memstruct}});
            }
            else if(jacks.length < requiredJacks && energyavailable >349) 
            {
                var numberofparts = Math.floor(energyavailable/350);
                var bodyparts = [];
                for(let i=0;i<numberofparts;i++)
                {
                    bodyparts.push(WORK);
                    bodyparts.push(CARRY);
                    bodyparts.push(CARRY);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                } 
                spawnss[i].spawnCreep(bodyparts, 'jack' + Game.time, {memory: {role: 'jack',cpuUsed:0,roomtarg: roomname,sourcetarget:Game.time%2,tasklist:[],full:false,memstruct:memstruct}});
            }
            else if(movers.length == 0  ) 
            {
               spawnss[i].spawnCreep([CARRY,CARRY,MOVE,CARRY,MOVE,MOVE], 'mover' + Game.time, {memory: {role: 'mover',cpuUsed:0,roomtarg: roomname,target:"a",tasklist:[],full:false,memstruct:memstruct}});
            }
            else if(towermover==0 && spawnss[i].name ==roomname  )
            {
                spawnss[i].spawnCreep([WORK,CARRY,CARRY,MOVE ], 'towermover' + roomname, {memory: {role: 'towermover',working:false}});
            }
            else if(harvesters.length <2 && energyavailable > 850) 
            {
                if(harvesters.length==0)
                {
                    spawnss[i].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE  ], 'harvester1' + roomname, {memory: {role: 'harvester',sourcetarget:1}});
                }
                else
                {
                   spawnss[i].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE ], 'harvester'+(harvesters[0].memory.sourcetarget+1)%2 + roomname, {memory: {role: 'harvester',sourcetarget:(harvesters[0].memory.sourcetarget+1)%2}});
                }
            }
            else if(movers.length <4 && requiredJacks==0) 
            {
               spawnss[i].spawnCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], 'mover' + Game.time, {memory: {role: 'mover',cpuUsed:0,roomtarg: roomname ,target:"a",tasklist:[],full:false,memstruct:memstruct}});
            }
            
            else if(upgraders.length ==0 && requiredJacks==0) 
            {
               spawnss[i].spawnCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE  ], 'upgrader' + Game.time, {memory: {role: 'upgrader',cpuUsed:0,tasklist:[],full:false}});
            }
            
            else if(upgraders.length <3 && requiredJacks==0 && storagevalue >700000 ) 
            {
                                var numberofparts = Math.floor(energyavailable/300);
                var bodyparts = [];
                for(let i=0;i<numberofparts;i++)
                {
                    bodyparts.push(WORK);
                       bodyparts.push(WORK);
                    bodyparts.push(CARRY);
 
                    bodyparts.push(MOVE);
       
                } 
                
               spawnss[i].spawnCreep(bodyparts, 'upgrader' + Game.time, {memory: {role: 'upgrader',cpuUsed:0,roomtarg: roomname,sourcetarget:Game.time%2,tasklist:[],full:false, memstruct:memstruct}});
            }
            else if(repairers.length ==0) 
            {
                spawnss[i].spawnCreep([WORK,CARRY,MOVE,MOVE ], 'repair' + Game.time, {memory: {role: 'repair',cpuUsed:0,roomtarg: roomname,sourcetarget:Game.time%2,tasklist:[],full:false,memstruct:memstruct}});
            }
          
            else if(claim && Game.time%900   <15 ) 
            {
                 var  memstruct={
           pickuptarget:"",
           pickupitem:"",
           transfertargroom:"",
           transfercontainer:"",
            
       };
       
       
           //     spawnss[i].spawnCreep([CLAIM,MOVE,MOVE,MOVE,MOVE], 'claim' + Game.time, {memory: {role: 'claim',cpuUsed:0,roomtarg: claimroomtarg ,sourcetarget:Game.time%2,tasklist:[["moveToRoom","W36S12"]["moveToRoom","W33S12"]["moveToRoom","W33S13"]["moveToRoom","W31S13"]],full:false ,memstruct:memstruct,route:routetotargroom}});
            }
            else if(claim && Game.time%200   <25) 
            {
                      var  memstruct={
           pickuptarget:"",
           pickupitem:"",
           transfertargroom:"",
           transfercontainer:"",
           
       };
       
       
                
                var numberofparts = Math.floor(energyavailable/350);
                var bodyparts = [];
                for(let i=0;i<numberofparts;i++)
                {
                    bodyparts.push(WORK);
                    bodyparts.push(CARRY);
                    bodyparts.push(CARRY);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                } 
            //   spawnss[i].spawnCreep(bodyparts, 'jackclaim' + Game.time, {memory: {role: 'jack',cpuUsed:0,roomtarg: claimroomtarg ,sourcetarget:Game.time%2,tasklist:[["moveToRoom","W36S12"]["moveToRoom","W33S12"]["moveToRoom","W33S13"]["moveToRoom","W31S13"]],full:false,memstruct:memstruct ,route:routetotargroom}});
            }
 
        
        
     //   console.log(Game.time%200);
        
        }// end of spawns loop
        
        
        
        
        
    }
}
module.exports = spwan;



