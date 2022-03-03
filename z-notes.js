 
       Game.market.changeOrderPrice('6113c2914e9e2a2f06a8749d', 1.95);
        
       Game.market.deal('61f6dbb194728f2c3c9773a6', 10, "E28N5");
      
      
      
       
                 var target = creep.room.find(FIND_HOSTILE_STRUCTURES,
                 {
                     filter: (structure) =>
                     {
                         return (structure.structureType == STRUCTURE_INVADER_CORE);
                     }
                 });
                 if(target.length != 0 && target[0].level == 2)
                 {
                     Game.spawns[creep.memory.memstruct.spawnRoom].spawnCreep(
                        [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK]
                        , 'stronglvl2' + creep.room.name,
                         {
                             memory:
                             {
                                 role: 'guard',
                                 attackrole: "chasedown",
                                 memstruct:
                                 {
                                     spawnRoom: creep.memory.memstruct.spawnRoom,
                                     tasklist: [
                                         ["createslaveBOOST"],
                                         ["boosAllMax"],
                                         ["forcemoveToRoom", creep.room.name]
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
         
      
      
      
      
      
      
      
      
      
      
      
      
      lvl 1 - 30,000  credits    cost  15k    single blinky 
      lvl 2 - 220,000 credits       - cost  30k  Duo
      lvl 3 - 1,359,000  credits- cost  30k      Duo
      lvl 4 - 5,500,000 credits    - cost  120k    Quad
      lvl 5 - 40,000,000 credits   - cost Lots    mutliple quads and power attack 
      
      
      
       
      
        Game.market.createOrder({
    type: ORDER_BUY,
    resourceType:  "energy",
    price: 50,
    totalAmount: 20000,
    roomName: "E28N5"   
});      
        
      
      
      
      
      
       // move
      
        Game.market.createOrder({
    type: ORDER_BUY,
    resourceType:  "XZHO2",
    price: 5,
    totalAmount: 1000000,
    roomName: "W29S52"   
});      
        
      
      // rnaged
       Game.market.createOrder({
    type: ORDER_BUY,
    resourceType:  "XKHO2",
    price: 75,
    totalAmount: 20000,
    roomName: "E28N5"   
});      
        
      
      
      // tough
       Game.market.createOrder({
    type: ORDER_BUY,
    resourceType:  "XGHO2",
    price: 75,
    totalAmount: 20000,
    roomName: "E28N5"   
});      
        
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
       
           
       
        Game.market.createOrder({
    type: ORDER_BUY,
    resourceType: "energy",
    price: 7,
    totalAmount: 100000,
    roomName: "E33N8"   
});      
        
        
        
        Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: "pixel",
    price: 10000,
    totalAmount: 10000,
    roomName: "E24N3"   
});      
        
        
       
       
        



visual storGE INDICATOR 

EMPIRE CONTROLLER FOR STRONGHOLDS AND FACTORYS 


power ops transfer to main creeeps






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
  



 REACTIONS: {
        H: {
            O: "OH",
            L: "LH",
            K: "KH",
            U: "UH",
            Z: "ZH",
            G: "GH"
        },
        O: {
            H: "OH",
            L: "LO",
            K: "KO",
            U: "UO",
            Z: "ZO",
            G: "GO"
        },
        Z: {
            K: "ZK",
            H: "ZH",
            O: "ZO"
        },
        L: {
            U: "UL",
            H: "LH",
            O: "LO"
        },
        K: {
            Z: "ZK",
            H: "KH",
            O: "KO"
        },
        G: {
            H: "GH",
            O: "GO"
        },
        U: {
            L: "UL",
            H: "UH",
            O: "UO"
        },
        OH: {
            UH: "UH2O",
            UO: "UHO2",
            ZH: "ZH2O",
            ZO: "ZHO2",
            KH: "KH2O",
            KO: "KHO2",
            LH: "LH2O",
            LO: "LHO2",
            GH: "GH2O",
            GO: "GHO2"
        },
        X: {
            UH2O: "XUH2O",
            UHO2: "XUHO2",
            LH2O: "XLH2O",
            LHO2: "XLHO2",
            KH2O: "XKH2O",
            KHO2: "XKHO2",
            ZH2O: "XZH2O",
            ZHO2: "XZHO2",
            GH2O: "XGH2O",
            GHO2: "XGHO2"
        },
        ZK: {
            UL: "G"
        },
        UL: {
            ZK: "G"
        },
        LH: {
            OH: "LH2O"
        },
        ZH: {
            OH: "ZH2O"
        },
        GH: {
            OH: "GH2O"
        },
        KH: {
            OH: "KH2O"
        },
        UH: {
            OH: "UH2O"
        },
        LO: {
            OH: "LHO2"
        },
        ZO: {
            OH: "ZHO2"
        },
        KO: {
            OH: "KHO2"
        },
        UO: {
            OH: "UHO2"
        },
        GO: {
            OH: "GHO2"
        },
        LH2O: {
            X: "XLH2O"
        },
        KH2O: {
            X: "XKH2O"
        },
        ZH2O: {
            X: "XZH2O"
        },
        UH2O: {
            X: "XUH2O"
        },
        GH2O: {
            X: "XGH2O"
        },
        LHO2: {
            X: "XLHO2"
        },
        UHO2: {
            X: "XUHO2"
        },
        KHO2: {
            X: "XKHO2"
        },
        ZHO2: {
            X: "XZHO2"
        },
        GHO2: {
            X: "XGHO2"
        }
    },




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
Game.spawns["E24N5"].spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,,RANGED_ATTACK,MOVE], 'guard' + Game.time,{memory:{role: 'guard', attackrole: "roomAbuser", memstruct: {spawnRoom: "W16S52",  tasklist: [["moveToRoom",   "W14S52"],["moveToRoom",   "W14S53"] ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });












attacking low spawn room 
Game.spawns["E24N3"].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK ,MOVE], 'guard' + Game.time,{memory:{role: 'guard', attackrole: "basicranger", memstruct: {spawnRoom: "E24N3",  tasklist: [["moveToRoom",   "E23N4"] ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });



 Game.spawns["W16S52"].spawnCreep([ATTACK ,MOVE], 'guard' + Game.time,{memory:{role: 'guard', attackrole: "basicattacker", memstruct: {spawnRoom: "W16S52",  tasklist: [["moveToRoom",   "W17S53"],["moveToRoom",   "W17S54"]],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });











// boost testing

Game.spawns["E28N5"].spawnCreep([TOUGH,ATTACK ,MOVE], 'guard' + Game.time,{memory:{role: 'guard', attackrole: "basicattacker", memstruct: {spawnRoom: "E28N5",  tasklist: [["boost",   "go",1]],objectIDStorage: "",boosted: true, moveToRenew: false, opportuniticRenew: false, hastask: false}} });





































Game.spawns["E24N3"].spawnCreep([RANGED_ATTACK ,MOVE,RANGED_ATTACK ,MOVE,RANGED_ATTACK ,MOVE,RANGED_ATTACK ,MOVE,RANGED_ATTACK ,MOVE,RANGED_ATTACK ,MOVE,RANGED_ATTACK ,MOVE,HEAL,HEAL], 'guard' + Game.time,{memory:{role: 'guard', attackrole: "basicranger", memstruct: {spawnRoom: "E24N3",  tasklist: [["attackMoveToRoom",   "E25N2"]],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });







































































var roleAttacker = {
    /** @param {Creep} creep **/
    run: function(creep)
    {
        creep.moveTo(new RoomPosition(2, 9, 'W3S27'));
        var  target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target  != undefined)
        {
            if(creep.attack(target) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target);
            }
        }
        else
        {
            var target = creep.room.find(FIND_HOSTILE_STRUCTURES,
            {
                filter: (s) =>
                {
                    return (s.structureType == STRUCTURE_SPAWN);
                }
            });
            if(target != undefined)
            {
                if(creep.attack(target) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
            }
        }
    }
}
module.exports = roleAttacker;





























