 
     
  
    // if an attack is happening it is given prioruty if they are fufilled then the next stage is also done ie in a siege then we will also harrase the mining opperations if they exist .   
    var defcon = {
        run: function(roomname,creepsinroom)
        {
            const target = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS);
            var defconstuct = {
                defenceLevel: 10,
                attackLevel: 10
            };
            
            var numberofguardingcreeps = _.filter(creepsinroom, (creep) => creep.memory.role == 'guard');
            var numberOfHealParts = 0;
            var numberOfAttackParts = 0;
            var numberOfRangedParts = 0;
            var totalBodyParts = 0;
            for(var i = 0; i < target.length; i++)
            {
                for(var j = 0; j < target[i].body.length; j++)
                {
                    if(target[i].body[j].type == HEAL)
                    {
                        numberOfHealParts++;
                    }
                    if(target[i].body[j].type == ATTACK)
                    {
                        numberOfAttackParts++;
                    }
                    if(target[i].body[j].type == RANGED_ATTACK)
                    {
                        numberOfRangedParts++;
                    }
                    totalBodyParts++;
                }
            }
            var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
            
            
            if(totalBodyParts > 50)
            {
                
                if(Game.rooms[roomname].controller.level == 7){
                           Game.spawns[roomname].spawnCreep([ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                             'guard3' + roomname, {
                            memory: {
                                role: 'guard',
                                attackrole: "cavalry",
                                memstruct: {
                                    spawnRoom: roomname,
                                    tasklist: [
                                        ["boosAllMax"] ,
                                       
                                    ],
                                    objectIDStorage: "",
                                    boosted: false,
                                    moveToRenew: false,
                                    opportuniticRenew: false,
                                    hastask: false
                                }
                            }}); 
                             Game.spawns[roomname].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK],
                             'guard2' + roomname, {
                            memory: {
                                role: 'guard',
                                attackrole: "archer",
                                memstruct: {
                                    spawnRoom: roomname,
                                    tasklist: [
                                        ["boosAllMax"] ,
                                       
                                    ],
                                    objectIDStorage: "",
                                    boosted: false,
                                    moveToRenew: false,
                                    opportuniticRenew: false,
                                    hastask: false
                                }
                            }});
                           Game.spawns[roomname].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK],
                              'guard1' + roomname, {
                            memory: {
                                role: 'guard',
                                attackrole: "archer",
                                memstruct: {
                                    spawnRoom: roomname,
                                    tasklist: [
                                        ["boosAllMax"] ,
                                       
                                    ],
                                    objectIDStorage: "",
                                    boosted: false,
                                    moveToRenew: false,
                                    opportuniticRenew: false,
                                    hastask: false
                                }
                            }});
            }// 7
             if(Game.rooms[roomname].controller.level == 67){
                 
           
                                      Game.spawns[roomname].spawnCreep([MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK],
                              'guard1' + roomname, {
                            memory: {
                                role: 'guard',
                                attackrole: "archer",
                                memstruct: {
                                    spawnRoom: roomname,
                                    tasklist: [
                                        ["boosAllMax"] ,
                                       
                                    ],
                                    objectIDStorage: "",
                                    boosted: false,
                                    moveToRenew: false,
                                    opportuniticRenew: false,
                                    hastask: false
                                }
                            }});
           
                                      Game.spawns[roomname].spawnCreep([MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK],
                              'guard2' + roomname, {
                            memory: {
                                role: 'guard',
                                attackrole: "archer",
                                memstruct: {
                                    spawnRoom: roomname,
                                    tasklist: [
                                        ["boosAllMax"] ,
                                       
                                    ],
                                    objectIDStorage: "",
                                    boosted: false,
                                    moveToRenew: false,
                                    opportuniticRenew: false,
                                    hastask: false
                                }
                            }});
                                      Game.spawns[roomname].spawnCreep([MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK],
                              'guard3' + roomname, {
                            memory: {
                                role: 'guard',
                                attackrole: "archer",
                                memstruct: {
                                    spawnRoom: roomname,
                                    tasklist: [
                                        ["boosAllMax"] ,
                                       
                                    ],
                                    objectIDStorage: "",
                                    boosted: false,
                                    moveToRenew: false,
                                    opportuniticRenew: false,
                                    hastask: false
                                }
                            }});
                 
             }
             
             
             
            
            
            
            }
            
            
            if(spawnss[0].hits < 1000 && target.length != 0)
            {
                Game.rooms[roomname].controller.activateSafeMode()
            }
          
          
          
          
          
          
          
            return defconstuct;
        }
    }
    module.exports = defcon;