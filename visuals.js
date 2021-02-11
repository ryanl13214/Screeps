var visuals = {
    run: function()
    {
        // every room needs towers outlined #
        // mark rooms with white
        //mark mine rooms with green
        //mark cener mine room with blue
        //for all creeps mark small blue circle if civilian 
        //small red circle if combar
        var powerCreepList = Game.powerCreeps;
        var ownedrooms = [];
        var roomsall = Object.keys(Game.rooms);
        var roomsobj = Game.rooms;
        for(var i = 0; i < roomsall.length; i++)
        {
            if(roomsobj[roomsall[i]].controller != undefined)
            {
                if(roomsobj[roomsall[i]].controller.owner != undefined)
                {
                    if((roomsobj[roomsall[i]]).controller.owner.username === "Q13214")
                    {
                        ownedrooms.push(roomsall[i]);
                    }
                }
            }
        }
   
        for(var i = 0; i < ownedrooms.length; i++)
        {
            try{
                
                 var roomname = ownedrooms[i];
             
                
                
            
            Game.map.visual.circle(new RoomPosition(25, 25, roomname), 25);
            var towers = Game.rooms[roomname].find(FIND_STRUCTURES,
            {
                filter: (s) =>
                {
                    return (s.structureType == STRUCTURE_TOWER);
                }
            });
            for(var iN = 0; iN < towers.length; iN++)
            {
                Game.map.visual.rect(new RoomPosition(towers[iN].pos.x - 5, towers[iN].pos.y - 5, towers[iN].pos.roomName), 11, 11,
                {
                    fill: 'transparent',
                    stroke: '#ff0000'
                });
            }
            }catch(e){}
                // nuker  
                Game.map.visual.rect(new RoomPosition(25  ,25  ,    ownedrooms[i]), 525, 525,
                {
                      fill:'#0000ff',
                    stroke: '#0000ff',
                    opacity:0.2
                });
                     Game.map.visual.rect(new RoomPosition(25  ,25  ,    ownedrooms[i]), -525, 525,
                {
                     fill:'#0000ff',
                    stroke: '#0000ff',
                    opacity:0.2
                });
                     Game.map.visual.rect(new RoomPosition(25  ,25  ,    ownedrooms[i]), 525, -525,
                {
                    fill:'#0000ff',
                    stroke: '#0000ff',
                    opacity:0.2
                });
                     Game.map.visual.rect(new RoomPosition(25  ,25  ,    ownedrooms[i]), -525, -525,
                {
                      fill:'#0000ff',
                    stroke: '#0000ff',
                    opacity:0.2
                });
                
                 
        }
        var allcreeps = Game.creeps;
        allcreeps = Object.keys(allcreeps);
        for(var i = 0; i < allcreeps.length; i++)
        {
            allcreeps[i] = Game.creeps[allcreeps[i]];
            var claimfound = false;
            var attackfound = false;
            var rangefound = false;
            var healfound = false;
            var workfound = false;
            for(var ik = 0; ik < allcreeps[i].body.length; ik++)
            {
                if(allcreeps[i].body[ik].type == CLAIM)
                {
                    claimfound = true;
                }
                if(allcreeps[i].body[ik].type == CLAIM)
                {
                    claimfound = true;
                }
                if(allcreeps[i].body[ik].type == HEAL)
                {
                    healfound = true;
                }
                if(allcreeps[i].body[ik].type == ATTACK)
                {
                    attackfound = true;
                }
                if(allcreeps[i].body[ik].type == RANGED_ATTACK)
                {
                    rangefound = true;
                }
                if(allcreeps[i].body[ik].type == WORK)
                {
                    workfound = true;
                }
            }
            if(claimfound)
            {
                Game.map.visual.circle(allcreeps[i].pos,
                {
                    fill: '#C600FF',
                    radius: 3,
                    stroke: '#C600FF'
                });
            }
            else
            if(rangefound)
            {
                Game.map.visual.circle(allcreeps[i].pos,
                {
                    fill: '#0015FF',
                    radius: 5,
                    stroke: '#0015FF'
                });
            }
            else
            if(attackfound)
            {
                Game.map.visual.circle(allcreeps[i].pos,
                {
                    fill: '#FF0000',
                    radius: 3,
                    stroke: '#FF0000'
                });
            }
            else
            if(workfound)
            {
                Game.map.visual.circle(allcreeps[i].pos,
                {
                    fill: '#EBFF00',
                    radius: 3,
                    stroke: '#EBFF00'
                });
            }
            else
            if(healfound)
            {
                Game.map.visual.circle(allcreeps[i].pos,
                {
                    fill: '#1DFF00',
                    radius: 5,
                    stroke: '#1DFF00'
                });
            }
            else
            {
                Game.map.visual.circle(allcreeps[i].pos,
                {
                    fill: '#FFFFFF',
                    radius: 3,
                    stroke: '#FFFFFF'
                });
            }
        }
    }
}
module.exports = visuals;