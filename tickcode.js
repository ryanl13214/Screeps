 var tickcode = {
    run: function( )
    {
 
/*
 
  var mehmstruct = {
                spawnRoom: roomname,
                tasklist: [
                  
                ],
                objectIDStorage: "",
                boosted: false,
                moveToRenew: false,
                opportuniticRenew: false,
                hastask: false,
                full: false,
                wantsToJoinSquad: false,
                spawntime: Game.time,
                isInSquad: false,
                SquadID: "claimer",
                SquadRole: false
            };
 
 
try{
Game.spawns["E19S1"].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE], 'jack1' ,{memory:{role: 'jack',  memstruct: {spawnRoom: "E19S1",  tasklist: [["moveToRoom",   "E19S4"] ],objectIDStorage: "",boosted: true, moveToRenew: false, opportuniticRenew: false, hastask: false}} });
}catch(e){}
 try{
Game.spawns["E19S1"].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE], 'jack12' ,{memory:{role: 'jack',  memstruct: {spawnRoom: "E19S1",  tasklist: [["moveToRoom",   "E19S4"] ],objectIDStorage: "",boosted: true, moveToRenew: false, opportuniticRenew: false, hastask: false}} });
}catch(e){}
 try{
Game.spawns["E19S1"].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE], 'jack13' ,{memory:{role: 'jack',  memstruct: {spawnRoom: "E19S1",  tasklist: [["moveToRoom",   "E19S4"] ],objectIDStorage: "",boosted: true, moveToRenew: false, opportuniticRenew: false, hastask: false}} });
}catch(e){}
 try{
Game.spawns["E19S1"].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE], 'jack14' ,{memory:{role: 'jack',  memstruct: {spawnRoom: "E19S1",  tasklist: [["moveToRoom",   "E19S4"] ],objectIDStorage: "",boosted: true, moveToRenew: false, opportuniticRenew: false, hastask: false}} });
}catch(e){}
 
 
try{
Game.spawns["E24N31" ].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL], 'Guard2'  ,{memory:{role: 'guard', attackrole: "ranger", memstruct: {spawnRoom: "E24N3",  tasklist: [["moveToRoom",   "E21N5"],["moveToRoom",   "E20N4"],["moveToRoom",   "E20S3"] ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
}catch(e){}
try{
Game.spawns["E24N3" ].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL], 'guard3'  ,{memory:{role: 'guard', attackrole: "ranger", memstruct: {spawnRoom: "E24N3",  tasklist: [["moveToRoom",   "E21N5"],["moveToRoom",   "E20N4"],["moveToRoom",   "E20S2"] ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
}catch(e){}
try{
Game.spawns["E24N31"].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL], 'guard1'  ,{memory:{role: 'guard', attackrole: "ranger", memstruct: {spawnRoom: "E24N3",  tasklist: [["moveToRoom",   "E21N5"],["moveToRoom",   "E20N4"],["moveToRoom",   "E20S1"] ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
}catch(e){}
try{
Game.spawns["E24N31"].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL], 'guard4'  ,{memory:{role: 'guard', attackrole: "ranger", memstruct: {spawnRoom: "E24N3",  tasklist: [["moveToRoom",   "E21N5"],["moveToRoom",   "E20N4"],["moveToRoom",   "E20S4"] ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
}catch(e){}
 
try{
Game.spawns["E24N3"].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE], 'jackc'  ,{memory:{role: 'jack',  memstruct: {spawnRoom: "E19S1",  tasklist: [["moveToRoom",   "E21N5"],["moveToRoom",   "E20N4"],["moveToRoom",   "E19S1"] ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
}catch(e){}


try{
Game.spawns["E24N3"].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE], 'jackc2'  ,{memory:{role: 'jack',  memstruct: {spawnRoom: "E19S1",  tasklist: [["moveToRoom",   "E21N5"],["moveToRoom",   "E20N4"],["moveToRoom",   "E19S8"] ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
}catch(e){}



 






      //                        squadmanage.initializeSquad(creep.name + "_stronghold_SERPENT", [firstPatrolRoom,secondPatrolRoom], false, "SoloPatrol", creep.memory.memstruct.spawnRoom,
     //                         {
     //                            creep.name: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
   //                      });





 

try{
Game.spawns["E24N3"].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE], 'jackc'  ,{memory:{role: 'jack',  memstruct: {spawnRoom: "E19S1",  tasklist: [["moveToRoom",   "E21N5"],["moveToRoom",   "E20N4"],["moveToRoom",   "E19S1"] ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
}catch(e){}


try{
Game.spawns["E24N3"].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE], 'jackc2'  ,{memory:{role: 'jack',  memstruct: {spawnRoom: "E19S1",  tasklist: [["moveToRoom",   "E21N5"],["moveToRoom",   "E20N4"],["moveToRoom",   "E19S8"] ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
}catch(e){}


 
 
 
try{
Game.spawns["E24N3"].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE], 'jackc2'  ,{memory:{role: 'jack',  memstruct: {spawnRoom: "E19S1",  tasklist: [["moveToRoom",   "E21N5"],["moveToRoom",   "E20N4"],["moveToRoom",   "E19S4"] ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
}catch(e){}


try{
Game.spawns["E24N3"].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE,WORK,CARRY,CARRY,MOVE,MOVE], 'jackc22'  ,{memory:{role: 'jack',  memstruct: {spawnRoom: "E19S1",  tasklist: [["moveToRoom",   "E21N5"],["moveToRoom",   "E20N4"],["moveToRoom",   "E19S8"] ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
}catch(e){}

 
 
 

*/

 
 
 
 
 
 
 
 
 try{
Game.spawns["E19S1"].spawnCreep([ CLAIM,MOVE], 'claimerr'  ,{memory:{role: 'jack',  memstruct: {spawnRoom: "E19S1",  tasklist: [["moveToRoom",   "E19S4"],["" ],["moveToRoom",   "E21S12"] ,["claim"]],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
}catch(e){}
 
 
 
 
 
 
Game.spawns["E24N31"].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL], 'patrolvertical'  ,{memory:{role: 'multi',  memstruct:{spawnRoom: "E24N3", tasklist: [["moveToRoom",   "E21N5"],["moveToRoom",   "E20N4"],["moveToRoom",   "E20S0"],["createPatrolBetweenTwoRooms", "E20S1", "E20S6"],["joinSquad","patrolvertical"] ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

 
























    }
}
module.exports = tickcode;