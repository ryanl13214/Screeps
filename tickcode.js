 var tickcode = {
    run: function( )
    {
 
 
 
 

 
  
  
   
   
    
     /*
  
           Game.spawns["E19N2" ].spawnCreep( [MOVE,MOVE,MOVE,MOVE,MOVE, CARRY ,CARRY ,WORK ,WORK ,WORK ,WORK], 
  'downgrade2d3dfvdd' ,{memory:{role: 'upgrader',   memstruct:{spawnRoom: "E18N4", tasklist: [["moveToRoom",   "E18N4"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
  
  
  
  
       Game.spawns["E28N51" ].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL], 
  'basicroomdis' ,{memory:{role: 'guard', attackrole :"ranger",  memstruct:{spawnRoom: "E24N3", tasklist: [["moveToRoom",   "E28N2"],["moveToRoom",   "E27N1"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

   
         Game.spawns["E19N2" ].spawnCreep( [MOVE,MOVE,MOVE,MOVE,MOVE, CLAIM], 
  'downgrade2dddd1' ,{memory:{role: 'guard', attackrole :"ranger",  memstruct:{spawnRoom: "E24N3", tasklist: [["moveToRoom",   "E18N4"],["claim"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
  
  
   
     Game.spawns["E28N51" ].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL], 
  'basicroomdis' ,{memory:{role: 'guard', attackrole :"ranger",  memstruct:{spawnRoom: "E24N3", tasklist: [["moveToRoom",   "E28N2"],["moveToRoom",   "E27N1"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
   Game.spawns["E28N5" ].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL], 
  'basicroomdis1' ,{memory:{role: 'guard', attackrole :"ranger",  memstruct:{spawnRoom: "E24N3", tasklist: [["moveToRoom",   "E28N2"],["moveToRoom",   "E27N1"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
  
     Game.spawns["E28N5" ].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL], 
  'basicroomdis21' ,{memory:{role: 'guard', attackrole :"ranger",  memstruct:{spawnRoom: "E24N3", tasklist: [["moveToRoom",   "E28N2"],["moveToRoom",   "E26N1"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
  
  
   
   
   
   
   
   
   
  Game.spawns["E24N31" ].spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK], 
  'basicroomdis1' ,{memory:{role: 'guard', attackrole :"basicRoomRangedAttacker",  memstruct:{spawnRoom: "E24N3", tasklist: [["createslaveBOOST"],["boosAllMax"],["moveToRoom",   "E21N5"],["moveToRoom",   "E19N4"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
  
  
  Game.spawns["E24N31" ].spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK], 
  'basicroomdis2' ,{memory:{role: 'guard', attackrole :"basicRoomRangedAttacker",  memstruct:{spawnRoom: "E24N3", tasklist: [["createslaveBOOST"],["boosAllMax"],["moveToRoom",   "E21N5"],["moveToRoom",   "E19N4"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
  
  
  */

    }
}
module.exports = tickcode;