

var linkManager = 
{
    run: function(roomname, storage_xpos, storage_ypos ) 
    {
 
 
 
        var linkto = Game.rooms[roomname].lookForAt('structure', storage_xpos - 2  , storage_ypos -1 )[0];
        var links = Game.rooms[roomname].find(FIND_MY_STRUCTURES, {
            filter: {
                structureType: STRUCTURE_LINK
            }
        });
 
 
 
        for (var i = 0; i < links.length; i++) {
            if (links[i].energy > 300) {
                links[i].transferEnergy(linkto);
            }
        }
 
 
 
 
    }
}

module.exports = linkManager;

























 

