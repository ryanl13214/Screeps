types of rooms

undefended 
bunker  all structures under ramparts and close together
castle most structures not under ramparts but no path to any of them
wall same as above but walls / ramaprts within 3 blocks of the room edge





types of attacks 
    keep
        all the core structres in a box with the other structs outside and left mostly undefended. 
        box might be ramparts might be walls
    wall
        next room attack
        send creeps in to room to attack wall and then back out on low hp to the stationed heal creeps in next room. 
    castle
        breach and clear
        send in creeps to ram down wall in location with poor tower cover then run in with as much force as possible. 
        usually has sources inside the walls maybe the controller too
    bunker
        if all towers are in middle then use range creep to stay out of the effective range of towers and attack
        
        if the towers are all seperate and far from eachother swarm attack
        
        800 creeps with move bodypart and a single attack 
        drain the energy from the towers and hope they cannot replenish the energy quick enough
        takes 100 attacks to reduce energy to 0 
    undefended 
        single attack creep with healer creep
    


tertiary attacs
downgrading room          KEEP , BUNKER, WALL (if controller is outside and the walls are very high) 

cutting off harvesting    KEEP , BUNKER 

nuking                    KEEP , BUNKER                                                                                                                         



/*
        
    var towerdamage= C.TOWER_POWER_ATTACK * C.TOWER_FALLOFF * (14 - C.TOWER_OPTIMAL_RANGE) / (C.TOWER_FALLOFF_RANGE - C.TOWER_OPTIMAL_RANGE);

        var towerdamage= C.TOWER_POWER_ATTACK * C.TOWER_FALLOFF * (range - C.TOWER_OPTIMAL_RANGE) / (C.TOWER_FALLOFF_RANGE - C.TOWER_OPTIMAL_RANGE);
    }
        console.log( TOWER_POWER_ATTACK * TOWER_FALLOFF * (14 - TOWER_OPTIMAL_RANGE) / (TOWER_FALLOFF_RANGE - TOWER_OPTIMAL_RANGE));
        //        amount -= amount * C.TOWER_FALLOFF * (range - C.TOWER_OPTIMAL_RANGE) / (C.TOWER_FALLOFF_RANGE - C.TOWER_OPTIMAL_RANGE);
        
         var towerdamage= C.TOWER_POWER_ATTACK * C.TOWER_FALLOFF * (14 - C.TOWER_OPTIMAL_RANGE) / (C.TOWER_FALLOFF_RANGE - C.TOWER_OPTIMAL_RANGE);

        */
  








    3-4	    1 tower
    5-6	    2 towers
    7	    3 towers
    8	    6 towers
    Cost	5,000
    Hits	3,000
    Capacity	1,000
    Energy per action	10
    Attack effectiveness	600 hits at range ≤5 to 150 hits at range ≥20
    Heal effectiveness	400 hits at range ≤5 to 100 hits at range ≥20
    Repair effectiveness	800 hits at range ≤5 to 200 hits at range ≥20

6 towers putting out 150 each = 900 damage ----to overpower this damage 75 heal bodyparts are needed 
6 towers putting out 600 each = 3600 damage ----to overpower this damage 300 heal bodyparts are needed 

  
 


 

boosting each creep with  tough bodyparts with damage reducing  reduces damage by 70% meaning 270 damage is done needs 3 body parts worth of tough
needs 22 heal bodyparts 
    
    
    boosted jack attack
        7 tough boosted 30% damage
        15 attack boosted 
        15 heal boosted
        13 boosted move to give full move
    
    
    stats
        requires 2100 damage to get throguh tough
        attack dps is 30 * 4 * 15 1800
        heals 720 damage each tick     effectiely 2160 with tough bodyparts
        full move
    
    










attacker
    10 tough   boost for attacking castle or bunker
    15 attack
    25 move

healer  unboosted
    25 heal
    25 move

ranged 
    5 tough
    15 ranged
    5 heal
    25 move



















 

    BODYPART_COST: {
        "move": 50,
        "work": 100,
        "attack": 80,
        "carry": 50,
        "heal": 250,                         heal 12 close or 4 range 3   boost 36 close   12 rangd
        "ranged_attack": 150,
        "tough": 10,
        "claim": 600
    },



???


HEAL_POWER: 12,
RANGED_HEAL_POWER: 4,
RANGED_ATTACK_POWER: 10,
ATTACK_POWER: 30,










        
    //console.log( (RAMPART_DECAY_AMOUNT / REPAIR_POWER / RAMPART_DECAY_TIME)*169);//   0.5 energy per tick 
   // console.log(  ROAD_DECAY_AMOUNT / REPAIR_POWER /  ROAD_DECAY_TIME);// 
   // console.log(   ROAD_DECAY_AMOUNT * CONSTRUCTION_COST_ROAD_SWAMP_RATIO) / REPAIR_POWER /  ROAD_DECAY_TIME);// 
   // console.log(  CONTAINER_DECAY / REPAIR_POWER / CONTAINER_DECAY_TIME_OWNED);// 
    console.log(   CONTAINER_DECAY / REPAIR_POWER / CONTAINER_DECAY_TIME);// 
        
        
        
        












hydroxide	 + 	20	—	—
zynthium keanite	 + 	5	—	—
utrium lemergite	 + 	5	—	—
ghodium	 + 	5	—	—
Tier 1 compounds
utrium hydride	 + 	10	ATTACK	+100% attack effectiveness
utrium oxide	 + 	10	WORK	+200% harvest effectiveness
keanium hydride	 + 	10	CARRY	+50 capacity
keanium oxide	 + 	10	RANGED_ATTACK	+100% rangedAttack and rangedMassAttack effectiveness
lemergium hydride	 + 	15	WORK	+50% repair and build effectiveness without increasing the energy cost
lemergium oxide	 + 	10	HEAL	+100% heal and rangedHeal effectiveness
zynthium hydride	 + 	20	WORK	+100% dismantle effectiveness
zynthium oxide	 + 	10	MOVE	+100% fatigue decrease speed
ghodium hydride	 + 	10	WORK	+50% upgradeController effectiveness without increasing the energy cost
ghodium oxide	 + 	10	TOUGH	-30% damage taken
Tier 2 compounds
utrium acid	 + 	5	ATTACK	+200% attack effectiveness
utrium alkalide	 + 	5	WORK	+400% harvest effectiveness
keanium acid	 + 	5	CARRY	+100 capacity
keanium alkalide	 + 	5	RANGED_ATTACK	+200% rangedAttack and rangedMassAttack effectiveness
lemergium acid	 + 	10	WORK	+80% repair and build effectiveness without increasing the energy cost
lemergium alkalide	 + 	5	HEAL	+200% heal and rangedHeal effectiveness
zynthium acid	 + 	40	WORK	+200% dismantle effectiveness
zynthium alkalide	 + 	5	MOVE	+200% fatigue decrease speed
ghodium acid	 + 	15	WORK	+80% upgradeController effectiveness without increasing the energy cost
ghodium alkalide	 + 	30	TOUGH	-50% damage taken
Tier 3 compounds
catalyzed utrium acid	 + 	60	ATTACK	+300% attack effectiveness
catalyzed utrium alkalide	 + 	60	WORK	+600% harvest effectiveness
catalyzed keanium acid	 + 	60	CARRY	+150 capacity
catalyzed keanium alkalide	 + 	60	RANGED_ATTACK	+300% rangedAttack and rangedMassAttack effectiveness
catalyzed lemergium acid	 + 	65	WORK	+100% repair and build effectiveness without increasing the energy cost
catalyzed lemergium alkalide	 + 	60	HEAL	+300% heal and rangedHeal effectiveness
catalyzed zynthium acid	 + 	160	WORK	+300% dismantle effectiveness
catalyzed zynthium alkalide	 + 	60	MOVE	+300% fatigue decrease speed
catalyzed ghodium acid	 + 	80	WORK	+100% upgradeController effectiveness without increasing the energy cost
catalyzed ghodium alkalide	 + 	150	TOUGH	-70% damage taken



key mins

catalyzed zynthium alkalide	   	+300% fatigue decrease speed   
catalyzed ghodium alkalide  	-70% damage taken                                                      
catalyzed utrium acid        	+300% attack effectiveness                                             
catalyzed lemergium alkalide    +300% heal and rangedHeal effectiveness                                        
catalyzed keanium alkalide	 + 	60	RANGED_ATTACK	+300% rangedAttack and rangedMassAttack effectiveness                             





























questiosn 

can creeps attack through ramparts 





















room abuser 


all in one room abuser 

Game.spawns["W16S52"].spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE   ,MOVE,RANGED_ATTACK ,MOVE,MOVE,MOVE,HEAL], 'guard' + Game.time,{memory:{role: 'guard', attackrole: "roomAbuser", memstruct: {spawnRoom: "W16S52",  tasklist: [["moveToRoom",   "W14S52"],["moveToRoom",   "W14S53"],["moveTo",0,25]],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });



heal and attack pair 
Game.spawns["W16S52"].spawnCreep([MOVE,MOVE,HEAL,HEAL], 'guard' + Game.time,{memory:{role: 'guard', attackrole: "basicHealer", memstruct: {spawnRoom: "W16S52",  tasklist: [["moveToRoom",   "W14S52"],["moveToRoom",   "W14S53"] ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
Game.spawns["W16S52"].spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,MOVE], 'guard' + Game.time,{memory:{role: 'guard', attackrole: "roomAbuser", memstruct: {spawnRoom: "W16S52",  tasklist: [["moveToRoom",   "W14S52"],["moveToRoom",   "W14S53"] ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });












attacking low spawn room 
Game.spawns["W16S52"].spawnCreep([RANGED_ATTACK ,MOVE], 'guard' + Game.time,{memory:{role: 'guard', attackrole: "basicranger", memstruct: {spawnRoom: "W16S52",  tasklist: [["moveToRoom",   "W17S53"],["moveToRoom",   "W17S54"]],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
 Game.spawns["W16S52"].spawnCreep([ATTACK ,MOVE], 'guard' + Game.time,{memory:{role: 'guard', attackrole: "basicattacker", memstruct: {spawnRoom: "W16S52",  tasklist: [["moveToRoom",   "W17S53"],["moveToRoom",   "W17S54"]],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

















































Game.spawns["E24N3"].spawnCreep([RANGED_ATTACK ,MOVE,RANGED_ATTACK ,MOVE,RANGED_ATTACK ,MOVE,RANGED_ATTACK ,MOVE,RANGED_ATTACK ,MOVE,RANGED_ATTACK ,MOVE,RANGED_ATTACK ,MOVE,HEAL,HEAL], 'guard' + Game.time,{memory:{role: 'guard', attackrole: "basicranger", memstruct: {spawnRoom: "E24N3",  tasklist: [["attackMoveToRoom",   "E25N2"]],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });





































































































