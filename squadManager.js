var squadmanager = {
    run: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var numberOfLivingSqaudMembers = [];
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            if (Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]))
            {
                numberOfLivingSqaudMembers.push(mainMemoryObject.SquadMembersCurrent[c]);
            }
        }
         
        mainMemoryObject.SquadMembersCurrent = numberOfLivingSqaudMembers;
         
        if (mainMemoryObject.squadcreationtime + 500 < Game.time && numberOfLivingSqaudMembers.length ==0 )
        {
            delete Memory.squadObject[squadID];
        }
        else
        {
             mainMemoryObject.squadisready=false;
            const resourcevalues = Object.values(mainMemoryObject.SquadMembersGoal);
            //    console.log("squad goald length "+ resourcevalues.length );
            //    console.log("squad d length "+ mainMemoryObject.SquadMembersCurrent.length );  
            if (mainMemoryObject.SquadMembersCurrent.length < resourcevalues.length)
            {
                // console.log(squadID +" needs spanging ");
                this.spawnnewcreep(squadID, mainMemoryObject.squadHomeRoom);
            }
            else if (1==2)
            {
                ///boosting
            }else if (mainMemoryObject.SquadMembersCurrent.length == resourcevalues.length)
            {
                mainMemoryObject.squadisready=true;
            }
            
                  if(mainMemoryObject.squadisready)
         {
            if(mainMemoryObject.squadType=="centerroomattacksquad")
            {
                 this.centtersquad_controlFunction(squadID);
            }
                
        }
            
            
        }
        
 
        
        
    },
    initializeSquad: function(squadID, arrayOfSquadGoals, squadIsBoosted, squadType, squadHomeRoom, SquadMembers)
    {
        console.log("creating squad");
        Memory.squadObject[squadID] = {
            arrayOfSquadGoals: arrayOfSquadGoals,
            squadIsBoosted: squadIsBoosted,
            squadType: squadType,
            squadHomeRoom: squadHomeRoom,
            SquadMembersCurrent: [],
            squadposition: [25,25],
            SquadMembersGoal: SquadMembers,
            squadisready:false,
            squadcreationtime: Game.time,
            squaddisolvetime: Game.time + 1500
        };
    },
    planMovement: function(data) {},
    spawnnewcreep: function(squadID, squadHomeRoom)
    {
        // find the missing members 
        var memstruct = {
            spawnRoom: squadHomeRoom,
            tasklist: [
                ["joinSquad", squadID]
            ], // add in go to muster room.
            objectIDStorage: "",
            boosted: false,
            moveToRenew: false,
            opportuniticRenew: true,
            hastask: false,
            full: false,
            wantsToJoinSquad: false,
            isInSquad: false,
            SquadID: "0",
            SquadRole: false
        };
        var spawnss = Game.spawns[squadHomeRoom];
        var mainMemoryObject = Memory.squadObject[squadID];
        const number = Object.values(mainMemoryObject.SquadMembersCurrent).length;
        const resourcevalues = Object.values(mainMemoryObject.SquadMembersGoal);
        const names = Object.keys(mainMemoryObject.SquadMembersGoal);
        spawnss.spawnCreep(resourcevalues[number], names[number] + "-" + squadID,
        {
            memory:
            {
                role: 'multi',
                cpuUsed: 0,
                memstruct: memstruct
            }
        });
    },
    centtersquad_controlFunction: function(squadID) {
      //  console.log("centtersquad_controlFunction");
              var mainMemoryObject = Memory.squadObject[squadID];
       var newroomposition= new RoomPosition(mainMemoryObject.squadposition[0],mainMemoryObject.squadposition[1],mainMemoryObject.arrayOfSquadGoals[0])
       
           var target = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        if(target != undefined)
        {
            mainMemoryObject.squadposition=[target.pos.x,target.pos.y];
        }else if( Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).room.name == mainMemoryObject.arrayOfSquadGoals[0]){
            if(mainMemoryObject.arrayOfSquadGoals.length > 1){
                console.log("before splice",  mainMemoryObject.arrayOfSquadGoals);
                var tmp=  mainMemoryObject.arrayOfSquadGoals.splice(0, 1);
                mainMemoryObject.arrayOfSquadGoals.push(tmp);
                console.log("after splice",  mainMemoryObject.arrayOfSquadGoals);
            }
        }
        
        
   
   
        for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
          var creeper = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]);
          var targets = creeper.pos.findInRange(FIND_MY_CREEPS,3);
          if(targets.length >= mainMemoryObject.SquadMembersCurrent.length  ||  creeper.pos.x==0||  creeper.pos.x==49||  creeper.pos.y==0||  creeper.pos.y==49)
          {// if all the creps are close together 
                creeper.moveTo(newroomposition);
                 Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).say("close");
          }
          else
          {
              creeper.moveTo(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[0]).pos);  
             Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).say("far");
          }
        }
        
         for (var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
          var target = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).pos.findClosestByRange(FIND_HOSTILE_CREEPS);
         Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).attack(target);
        }
        
        
       /* 
         if (creep.memory.attackrole == "rangerhealer")
            {
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                const targetArr = creep.room.find(FIND_HOSTILE_CREEPS);
                const targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                if (targets.length > 0)
                {
                    creep.rangedAttack(targets[0]);
                }
                
                if (creep.hits < creep.hitsMax )
                {
                    creep.heal(creep);
                }
                
                
                const range = creep.pos.getRangeTo(target);
                if (range > 2 && creep.hits + 300 > creep.hitsMax)
                {
                    creep.moveTo(target);
                }
                if (range < 3 || (creep.hits + 300 < creep.hitsMax && range < 5) )
                {
                    creepfunctions.combatMove(creep, targetArr, target);
                }
        
                
                
            }        
        */
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
         
         
     },
    
    
    
    
    
    
    
}
module.exports = squadmanager;
/*
        
    var towerdamage= C.TOWER_POWER_ATTACK * C.TOWER_FALLOFF * (14 - C.TOWER_OPTIMAL_RANGE) / (C.TOWER_FALLOFF_RANGE - C.TOWER_OPTIMAL_RANGE);

        var towerdamage= C.TOWER_POWER_ATTACK * C.TOWER_FALLOFF * (range - C.TOWER_OPTIMAL_RANGE) / (C.TOWER_FALLOFF_RANGE - C.TOWER_OPTIMAL_RANGE);
    }
        console.log( TOWER_POWER_ATTACK * TOWER_FALLOFF * (14 - TOWER_OPTIMAL_RANGE) / (TOWER_FALLOFF_RANGE - TOWER_OPTIMAL_RANGE));
        //        amount -= amount * C.TOWER_FALLOFF * (range - C.TOWER_OPTIMAL_RANGE) / (C.TOWER_FALLOFF_RANGE - C.TOWER_OPTIMAL_RANGE);
        
         var towerdamage= C.TOWER_POWER_ATTACK * C.TOWER_FALLOFF * (14 - C.TOWER_OPTIMAL_RANGE) / (C.TOWER_FALLOFF_RANGE - C.TOWER_OPTIMAL_RANGE);

        */