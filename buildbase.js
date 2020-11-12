/*
0	  5 Containers
1     5 Containers, 1 Spawn
2	  5 Containers, 1 Spawn , 5  Extensions (50 capacity) , Ramparts (300K max hits), Walls
3     5 Containers, 1 Spawn , 10 Extensions (50 capacity) , Ramparts (1M max hits), Walls, 1 Tower
4	  5 Containers, 1 Spawn , 20 Extensions (50 capacity) , Ramparts (3M max hits), Walls, 1 Tower, Storage
5	  5 Containers, 1 Spawn , 30 Extensions (50 capacity) , Ramparts (10M max hits), Walls, 2 Towers, Storage, 2 Links
6	  5 Containers, 1 Spawn , 40 Extensions (50 capacity) , Ramparts (30M max hits), Walls, 2 Towers, Storage, 3 Links, Extractor, 3 Labs, Terminal
7	  5 Containers, 2 Spawns, 50 Extensions (100 capacity), Ramparts (100M max hits), Walls, 3 Towers, Storage, 4 Links, Extractor, 6 Labs, Terminal
8	  5 Containers, 3 Spawns, 60 Extensions (200 capacity), Ramparts (300M max hits), Walls, 6 Towers, Storage, 6 Links, Extractor, 10 Labs, Terminal, Observer, Power Spawn
*/
//total structures = 3 60 6 2 10 1 1 1 1 =85
// all positions are from storage
var core = [
    [1, -3],
    [-2, -2],
    [-1, -2],
    [0, -2],
    [1, -2],
    [2, -2],
    [3, -2],
    [-3, -1],
    [-2, -1],
    [-1, -1],
    [0, -1],
    [1, -1],
    [2, -1],
    [3, -1],
    [-3, 0],
    [-2, 0],
    [-1, 0],
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [-3, 1],
    [-2, 1],
    [-1, 1],
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [-1, 2],
    [0, 2],
    [-2, 2],
    [-1, -4],
    [0, -4],
    [-1, -3],
    [0, -3],
    [-3, -2],
    [-3, 1],
    [-4, -1],
    [-3, -2],
    [0, 2],
    [1, 2],
    [2, 2],
    [1, 3],
    [4, 1],
    [4, 2],
    [3, 3],
    [3, 2],
    [-3, 2],
    [-4, 0],
    [3, 3],
    [4, 2],
    [3, 2]
];
var arrayofextensionpositions = [
    [-5, -5],
    [-4, -5],
    [-3, -5],
    [-2, -5],
    [1, -5],
    [2, -5],
    [3, -5],
    [4, -5],
    [-5, -4],
    [-3, -4],
    [-1, -4],
    [0, -4],
    [2, -4],
    [3, -4],
    [5, -4],
    [-5, -3],
    [-4, -3],
    [-1, -3],
    [0, -3],
    [4, -3],
    [5, -3],
    [-5, -2],
    [-4, -2],
     
     
    [1, -3],
    [1, -2],
    [2, -2],
    [3, -2],
    [5, -2],
    [-5, -1],
    [-3, -1],
    [3, -1],
    [5, -1],
    [-5, 0],
    [-3, 0],
    [4, 0],
    [-5, 1],
    [-5, 2],
    [-4, 1],
    [-5, 5],
    [-3, 5],
    [-2, 5],
    [3, 1],
    [5, 1],
    [5, 2],
    [5, 3],
    [5, 4],
    [4, 3],
    [4, 5],
    [3, 5],
    [2, 5],
    [1, 5],
    [0, 4],
    [0, 3],
    [1, 2],
    [3, 2],
    [2, 3],
    [2, 4],
    [3, 4]
];
var arrayoftowers = [
    [0, -1],
    [1, -1],
    [2, -1],
    [0, 1],
    [1, 1],
    [2, 1]
];
var containers = [
    [1, -4],
    [3, 3]
];
var observer = [0, -2];
var spawnlocations =[ [-2, -1 ],[5, 5]];
 
var powerspawn = [5, 0];
var nuker = [-1, -1];
var arrayoflabs = [
    [-2, -2],
    [-4, 4],
    [-3, 2],
    [-3, 3],
    [-3, 4],
    [-2, 2],
    [-2, 3],
    [-2, 4],
    [-1, 3],
    [-1, 4]
];
var roads = [
    [-5, -6],
    [-4, -6],
    [-3, -6],
    [-2, -6],
    [1, -6],
    [2, -6],
    [3, -6],
    [4, -6],
    [-6, -5],
    [-1, -5],
    [0, -5],
    [-6, -4],
    [-4, -4],
    [-2, -4],
    [1, -4],
    [4, -4],
    [6, -4],
    [-6, -3],
    [-3, -3],
    [-2, -3],
    [5, -5],
    [2, -3],
    [3, -3],
    [6, -3],
    [-6, -2],
    [-3, -2],
    [4, -2],
    [6, -2],
    [-6, -1],
    [-4, -1],
    [4, -1],
    [6, -1],
    [-6, 0],
    [-4, 0],
    [3, 0],
    [6, 0],
    [-6, 1],
    [-3, 1],
    [-2, 1],
    [4, 1],
    [6, 1],
    [-6, 2],
    [-4, 2],
    [-1, 2],
    [0, 2],
    [2, 2],
    [4, 2],
    [6, 2],
    [-5, 3],
    [1, 3],
    [3, 3],
    [6, 3],
    [-5, 4],
    [1, 4],
    [4, 4],
    [6, 4],
    [-4, 5],
    [-1, 5],
    [0, 5],
    [6, 5],
    [-3, 6],
    [-2, 6],
    [1, 6],
    [2, 6],
    [3, 6],
    [4, 6],
    [5, 6]
];
var basebuild = {
    run: function(roomname, storage_xpos, storage_ypos)
    {
        for (var i = 0; i < arrayofextensionpositions.length; i++)
        {
            try
            {
                Game.rooms[roomname].createConstructionSite(storage_xpos + arrayofextensionpositions[i][0], storage_ypos + arrayofextensionpositions[i][1], STRUCTURE_EXTENSION);
            }
            catch (e)
            {
                console.log(e);
            }
        }
        for (var i = 0; i < arrayoftowers.length; i++)
        {
            try
            {
                Game.rooms[roomname].createConstructionSite(storage_xpos + arrayoftowers[i][0], storage_ypos + arrayoftowers[i][1], STRUCTURE_TOWER);
            }
            catch (e)
            {
                console.log(e);
            }
        }
        try
        {
            Game.rooms[roomname].createConstructionSite(storage_xpos, storage_ypos, STRUCTURE_STORAGE);
        }
        catch (e)
        {
            console.log(e);
        }
        if (Game.rooms[roomname].controller.level > 3)
        {
            Game.rooms[roomname].createConstructionSite(storage_xpos, storage_ypos, STRUCTURE_STORAGE);
            for (var i = 0; i < arrayoflabs.length; i++)
            {
                try
                {
                    Game.rooms[roomname].createConstructionSite(storage_xpos + arrayoflabs[i][0], storage_ypos + arrayoflabs[i][1], STRUCTURE_LAB);
                }
                catch (e)
                {
                    console.log(e);
                }
            }
            for (var i = 0; i < spawnlocations.length; i++)
            {
                try
                {
                    Game.rooms[roomname].createConstructionSite(storage_xpos + spawnlocations[i][0], storage_ypos + spawnlocations[i][1], STRUCTURE_SPAWN);
                }
                catch (e)
                {
                    console.log(e);
                }
            }
            for (var i = 0; i < containers.length; i++)
            {
                try
                {
                    Game.rooms[roomname].createConstructionSite(storage_xpos + containers[i][0], storage_ypos + containers[i][1], STRUCTURE_CONTAINER);
                }
                catch (e)
                {
                    console.log(e);
                }
            }
            for (var i = 0; i < roads.length; i++)
            {
                try
                {
               //     Game.rooms[roomname].createConstructionSite(storage_xpos + roads[i][0], storage_ypos + roads[i][1], STRUCTURE_ROAD);
                }
                catch (e)
                {
                    console.log(e);
                }
            }
            try
            {
                Game.rooms[roomname].createConstructionSite(storage_xpos + -2, storage_ypos , STRUCTURE_LINK);
            }
            catch (e)
            {
                console.log(e);
            }
            try
            {
                Game.rooms[roomname].createConstructionSite(storage_xpos - 2, storage_ypos - 1 , STRUCTURE_TERMINAL);
            }
            catch (e)
            {
                console.log(e);
            }
            try
            {
                var temp = Game.rooms[roomname].find(FIND_MINERALS)[0].pos;
                Game.rooms[roomname].createConstructionSite(temp.x, temp.y, STRUCTURE_EXTRACTOR);
            }
            catch (e)
            {
                console.log(e);
            }
            if (Game.rooms[roomname].controller.level >= 6)
            {
                for (var i = 0; i < core.length; i++)
                {
                    try
                    {
                        Game.rooms[roomname].createConstructionSite(storage_xpos + core[i][0], storage_ypos + core[i][1], STRUCTURE_RAMPART);
                    }
                    catch (e)
                    {
                        console.log(e);
                    }
                }
            }
            if (Game.rooms[roomname].controller.level > 5)
            {
                var flag1 = Game.flags[roomname + "container1"];
                var flag0 = Game.flags[roomname + "container0"];
                const found = Game.rooms[roomname].lookForAt(LOOK_STRUCTURES, flag1.pos,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_CONTAINER);
                    }
                });
                const found1 = Game.rooms[roomname].lookForAt(LOOK_STRUCTURES, flag0.pos,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_CONTAINER);
                    }
                });
                if (found1.length != 0)
                {
                    if (found1[0].structureType == STRUCTURE_CONTAINER)
                    {
                        found1[0].destroy();
                    }
                }
                if (found.length != 0)
                {
                    if (found[0].structureType == STRUCTURE_CONTAINER)
                    {
                        found[0].destroy();
                    }
                }
                Game.rooms[roomname].createConstructionSite(flag1.pos.x, flag1.pos.y, STRUCTURE_RAMPART);
                Game.rooms[roomname].createConstructionSite(flag1.pos.x, flag1.pos.y, STRUCTURE_LINK);
                Game.rooms[roomname].createConstructionSite(flag0.pos.x, flag0.pos.y, STRUCTURE_RAMPART);
                Game.rooms[roomname].createConstructionSite(flag0.pos.x, flag0.pos.y, STRUCTURE_LINK);
                Game.rooms[roomname].createConstructionSite(storage_xpos - 1, storage_ypos , STRUCTURE_CONTAINER);
                //    Game.rooms[roomname].createConstructionSite(storage_xpos + core[i][0], storage_ypos + core[i][1], STRUCTURE_RAMPART);
                //    Game.rooms[roomname].createConstructionSite(storage_xpos + core[i][0], storage_ypos + core[i][1], STRUCTURE_RAMPART);
            }
            for (var i = 0; i < 18; i++)
            {
                if (i % 3 == 0)
                {
                    Game.rooms[roomname].createConstructionSite((storage_xpos - i) + 9, storage_ypos - 9, STRUCTURE_RAMPART);
                }
                else
                {
                    Game.rooms[roomname].createConstructionSite((storage_xpos  - i) + 9, storage_ypos - 9, STRUCTURE_WALL);
                }
            }
            for (var i = 0; i < 18; i++)
            {
               
               
               
              
               
                   if (i % 3 == 0)
                {
                    Game.rooms[roomname].createConstructionSite((storage_xpos - i) + 9, storage_ypos + 9, STRUCTURE_RAMPART);
                }
                else
                {
                    Game.rooms[roomname].createConstructionSite((storage_xpos  - i) + 9, storage_ypos + 9, STRUCTURE_WALL);
                }
               
               
               
               
               
               
               
            }
            for (var i = 0; i < 18; i++)
            {
                if (i % 3 == 0)
                {
                    Game.rooms[roomname].createConstructionSite((storage_xpos  ) + 9, (storage_ypos - i) + 9, STRUCTURE_RAMPART);
                }
                else
                {
                    Game.rooms[roomname].createConstructionSite((storage_xpos   ) + 9, (storage_ypos - i) + 9, STRUCTURE_WALL);
                }
               
            }
            for (var i = 0; i < 19; i++)
            {
                if (i % 3 == 0)
                {
                    Game.rooms[roomname].createConstructionSite((storage_xpos  ) - 9, (storage_ypos - i) + 9, STRUCTURE_RAMPART);
                }
                else
                {
                    Game.rooms[roomname].createConstructionSite((storage_xpos   ) - 9, (storage_ypos - i) + 9, STRUCTURE_WALL);
                }
               
            }
            
            
            
            
            if ( Game.rooms[roomname].controller.level > 2)
                {
                     Game.rooms[roomname].createConstructionSite((storage_xpos  ) + 2, storage_ypos  , STRUCTURE_RAMPART);
                    
                     Game.rooms[roomname].createConstructionSite((storage_xpos  )  , storage_ypos - 1, STRUCTURE_RAMPART);
                    
                    
                }
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
        }
    }
}
module.exports = basebuild;