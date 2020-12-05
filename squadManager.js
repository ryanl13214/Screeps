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
         
        if (mainMemoryObject.squadcreationtime + 100 < Game.time && numberOfLivingSqaudMembers.length ==0 )
        {
            delete Memory.squadObject[squadID];
        }
        else
        {
            const resourcevalues = Object.values(mainMemoryObject.SquadMembersGoal);
            //    console.log("squad goald length "+ resourcevalues.length );
            //    console.log("squad d length "+ mainMemoryObject.SquadMembersCurrent.length );  
            if (mainMemoryObject.SquadMembersCurrent.length < resourcevalues.length)
            {
                // console.log(squadID +" needs spanging ");
                this.spawnnewcreep(squadID, mainMemoryObject.squadHomeRoom);
            }
            else if (1==2){///boosting
                
            }else{
                // handle movement
                //handle actions
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
            squadposition: [5,5],
            SquadMembersGoal: SquadMembers,
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