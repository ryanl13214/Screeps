var squadmanage = require('squadManager');
var tickcode = {
    run: function()
    {
  // walkaround room is E21N5
       
       
       
        // name target room, boosted,typeofsquad,homeroom
        
                        
       
       
       
       
                    Game.spawns["E24N3" ].spawnCreep(
           [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK]
           , 'lastHope2' ,{memory:{role: 'guard', attackrole :"attacker",  memstruct:{spawnRoom: "E24N3", tasklist: [["createslaveBOOST"] ,["createslaveBOOST2"] ,["boosAllMax"],["moveToRoom",   "E21N5"],["moveToRoom",   "E20N4"],["moveToRoom",   "E20S4"],["moveToRoom",   "E19S4"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

        
       
       
       
       
       
       
       if(Memory.squadObject.testQuad == undefined && 1==2 ){
                squadmanage.initializeSquad(  "testQuad", ["E20S12"], false, "quad", "E21S12", {
                                    "head1": [RANGED_ATTACK ,MOVE],                                
                                    "tail1": [HEAL, MOVE],
                                    "head2": [RANGED_ATTACK ,MOVE],
                                    "tail2": [HEAL, MOVE ]
                                    });
       }
       
       
 

 

      //  Game.rooms['E19N2'].terminal.send("energy", 10000, 'E25N2',    'trade contract #1');
        
        
        
    
   
   
                   Game.spawns["E21S12" ].spawnCreep(
        [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH, RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL]
           , 'remoteDefence'  ,{memory:{role: 'guard', attackrole :"ranger",  memstruct:{spawnRoom: "E24N3", tasklist: [ ["moveToRoom",   "E19S4"] ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
   
   
   /*
   
   
        
   
   
   
   */
       
            /*
       
       
        
                   Game.spawns["E24N3" ].spawnCreep(
          [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL]
           , 'remoteDefence'+Game.time ,{memory:{role: 'guard', attackrole :"ranger",  memstruct:{spawnRoom: "E24N3", tasklist: [ ["moveToRoom",   "E21N5"],["moveToRoom",   "E19N2"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
   
       
           
        
                   Game.spawns["E24N31" ].spawnCreep(
          [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL]
           , 'remoteDefence1'+Game.time ,{memory:{role: 'guard', attackrole :"ranger",  memstruct:{spawnRoom: "E24N3", tasklist: [ ["moveToRoom",   "E21N5"],["moveToRoom",   "E19N2"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
   
       
       
       
       
       
       
       
        
       
       
       
       
       
       
       
        
       
        
           
       
       
       
                   Game.spawns["E19S4" ].spawnCreep(
          [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL]
           , 'basicroomdis2' ,{memory:{role: 'guard', attackrole :"ranger",  memstruct:{spawnRoom: "E19S4", tasklist: [ ["moveToRoom",   "E14S3"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

        
       
       
       
       
       
       
                  Game.spawns["E19S1" ].spawnCreep(
          [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL]
           , 'basicroomdis2' ,{memory:{role: 'guard', attackrole :"ranger",  memstruct:{spawnRoom: "E24N3", tasklist: [ ["moveToRoom",   "E12N1"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

        
        
       
       
       
       
             Game.spawns["E19S1" ].spawnCreep(
           [MOVE,MOVE,MOVE,WORK,WORK,WORK]
           , 'basicroomdis1' ,{memory:{role: 'guard', attackrole :"basicRoomDIS",  memstruct:{spawnRoom: "E24N3", tasklist: [ ["moveToRoom",   "E12N1"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

        
       
                       Game.spawns["E24N31" ].spawnCreep(
           [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK]
           , 'defeceduo' ,{memory:{role: 'guard', attackrole :"chasedown",  memstruct:{spawnRoom: "E24N3", tasklist: [["createslaveBOOST"]  ,["boosAllMax"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

        
        
           



   
        // tripple
        
        
                  Game.spawns["E24N31" ].spawnCreep(
           [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK]
           , 'basicroomdis2' ,{memory:{role: 'guard', attackrole :"basicRoomDIS",  memstruct:{spawnRoom: "E24N3", tasklist: [["createslaveBOOST"] ,["createslaveBOOST2"] ,["boosAllMax"],["moveToRoom",   "E21N5"],["moveToRoom",   "E19N0"],["moveToRoom",   "E17S1"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

        
        
           





        
                    
       
       
       
            
            squadmanage.initializeSquad(  "testQuad", ["E19S0"], false, "quad", "E19S1", {
                                    "head1": [RANGED_ATTACK ,MOVE],                                
                                    "tail1": [HEAL, MOVE],
                                    "head2": [RANGED_ATTACK ,MOVE],
                                    "tail2": [HEAL, MOVE ]
                                    });
        
                               Game.spawns["E19S4"].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
            'E19S4theiftal2l',
            {
                memory:
                {
                    role: 'multi',
                    memstruct:
                    {
                        spawnRoom: "E19S4",
                        tasklist: [
                            ["moveToRoom", "E21S4"],
                            ["steal", "terminal"],
                            ["steal", "factory"],
                            ["steal", "storage"],
                            ["forcemoveToRoom", "E19S4"],
                            ["deposit"],
                            ["repeat", 6]
                        ],
                        objectIDStorage: "",
                        boosted: false,
                        moveToRenew: false,
                        opportuniticRenew: true,
                        hastask: false
                    }
                }
            });
            
            
            
            
            
                   Game.spawns["E19S4" ].spawnCreep(
                  [TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL]
                   
                   , 
  'basicroomdis1' ,{memory:{role: 'guard', attackrole :"chasedown",  memstruct:{spawnRoom: "E19S4", tasklist: [["moveToRoom",   "E20S4"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

            
            
            
            
            
            */
            
         
   //          Game.spawns["E24N32" ].spawnCreep([MOVE,RANGED_ATTACK,ATTACK], 'basic2roomattack1'    ,{memory:{role: 'guard', attackrole :"basicRoomAttacker",  memstruct:{spawnRoom: "E24N3", tasklist: [["boosAllMax"]    ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

            
            
            
            
// Game.spawns["E21S121" ].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK], 'basicroomattack1'    ,{memory:{role: 'guard', attackrole :"basicRoomDIS",  memstruct:{spawnRoom: "E21S12", tasklist: [["boosAllMax"],["moveToRoom",   "E18S9"]   ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
 //       Game.spawns["E21S121" ].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK], 'basicroomattack2'    ,{memory:{role: 'guard', attackrole :"basicRoomDIS",  memstruct:{spawnRoom: "E21S12", tasklist: [["boosAllMax"],["moveToRoom",   "E18S9"]   ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
  //   Game.spawns["E21S121" ].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK], 'basicroomattack3'    ,{memory:{role: 'guard', attackrole :"basicRoomDIS",  memstruct:{spawnRoom: "E21S12", tasklist: [["boosAllMax"],["moveToRoom",   "E18S9"]   ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
           
            
            
            
            
             
            
            
            
             
    }
}
module.exports = tickcode;