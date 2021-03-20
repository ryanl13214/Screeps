var squadmanage = require('squadManager');
var tickcode = {
    run: function()
    {
 
       Game.spawns["E19S4"].spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY,MOVE, MOVE, MOVE, CARRY, CARRY, CARRY],
            'E19S4theift',
            {
                memory:
                {
                    role: 'multi',
                    memstruct:
                    {
                        spawnRoom: "E19S4",
                        tasklist: [
                            ["moveToRoom", "E21S4"],
                            ["withdraw", "5f458f760145028e098f70f2", "spirit"],
                            ["withdraw", "5f4e3d6138522b1096393b7d", "muscle"],
                            ["withdraw", "5f4e3d6138522b1096393b7d", "frame"],
                            ["withdraw", "5f4e3d6138522b1096393b7d", "microchip"],
                            ["withdraw", "5f4e3d6138522b1096393b7d", "tissue"],
                            ["withdraw", "5f4e3d6138522b1096393b7d", "fixtures"],
                            ["withdraw", "5f4e3d6138522b1096393b7d", "transistor"],
                            ["withdraw", "5f4e3d6138522b1096393b7d", "phlegm"],
                            ["withdraw", "5f4e3d6138522b1096393b7d", "tube"],
                            ["withdraw", "5f4e3d6138522b1096393b7d", "extract"],
                            ["withdraw", "5f4e3d6138522b1096393b7d", "concentrate"],
                            ["withdraw", "5f4e3d6138522b1096393b7d", "wire"],
                            ["withdraw", "5f458f760145028e098f70f2", "alloy"],
                            ["forcemoveToRoom", "E19S4"],
                            ["deposit"],
                            ["repeat", 16]
                        ],
                        objectIDStorage: "",
                        boosted: false,
                        moveToRenew: false,
                        opportuniticRenew: true,
                        hastask: false
                    }
                }
            });
            
            
            
            
            
            
                   Game.spawns["E19S4"].spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY,MOVE, MOVE, MOVE, CARRY, CARRY, CARRY],
            'E13S6theift',
            {
                memory:
                {
                    role: 'multi',
                    memstruct:
                    {
                        spawnRoom: "E19S4",
                        tasklist: [
                            ["moveToRoom", "E14S3"],
                            ["withdraw", "6001f6da051de0625375ca8c", "condensate"],
                            ["withdraw", "6001f6da051de0625375ca8c", "silicon"],
                            ["withdraw", "6001f6da051de0625375ca8c", "wire"],
                            ["withdraw", "6001f6da051de0625375ca8c", "alloy"],
                            ["withdraw", "6001f6da051de0625375ca8c", "XGH2O"],
                            ["forcemoveToRoom", "E19S4"],
                            ["deposit"],
                            ["repeat", 8]
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

            
            
            
            
            
                        
            
            
            Game.spawns["E19S1"].spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY,MOVE, MOVE, MOVE, CARRY, CARRY, CARRY,MOVE, MOVE, MOVE, CARRY, CARRY, CARRY],
            'E19S1theift',
            {
                memory:
                {
                    role: 'multi',
                    memstruct:
                    {
                        spawnRoom: "E19S1",
                        tasklist: [
                            ["moveToRoom", "E17S1"],
                            ["withdraw", "5f726fae88de43342519468f", "spirit"],
                            ["withdraw", "5f726fae88de43342519468f", "muscle"],
                            ["withdraw", "5f726fae88de43342519468f", "frame"],
                            ["withdraw", "5f726fae88de43342519468f", "microchip"],
                            ["withdraw", "5f726fae88de43342519468f", "tissue"],
                            ["withdraw", "5f726fae88de43342519468f", "fixtures"],
                            ["withdraw", "5f726fae88de43342519468f", "transistor"],
                            ["withdraw", "5f726fae88de43342519468f", "phlegm"],
                            ["withdraw", "5f726fae88de43342519468f", "tube"],
                            ["withdraw", "5f726fae88de43342519468f", "extract"],
                            ["withdraw", "5f726fae88de43342519468f", "concentrate"],
                            ["withdraw", "5f726fae88de43342519468f", "wire"],
                            ["withdraw", "5f726fae88de43342519468f", "cell"],
                            ["withdraw", "5f726fae88de43342519468f", "condensate"],
                            ["withdraw", "5f726fae88de43342519468f", "alloy"],
                            ["withdraw", "5f726fae88de43342519468f", "power"],
                            ["forcemoveToRoom", "E19S1"],
                            ["deposit"],
                            ["repeat", 19]
                        ],
                        objectIDStorage: "",
                        boosted: false,
                        moveToRenew: false,
                        opportuniticRenew: true,
                        hastask: false
                    }
                }
            });
            
            
            
            
            
            
            
            
            
            
             
    }
}
module.exports = tickcode;