var roompathfinder = {

    getCurrent: function(openNodes, goalRoom)
    {
        var currentLowestF_value = 999999999;
        var openroomKeys = Object.keys(openNodes);
        var returnTmp = "";

        for (var i = 0; i < openroomKeys.length; i++)
        {
            if (openNodes[openroomKeys[i]] != undefined && openNodes[openroomKeys[i]].F_cost < currentLowestF_value)
            {
                currentLowestF_value = openNodes[openroomKeys[i]].F_cost;
                returnTmp = openroomKeys[i];
            }
        }

        return returnTmp;

    },

    aStar: function(roomlist, startroom, targetRoom)
    {

        //OPEN //the set of nodes to be evaluated
        //CLOSED //the set of nodes already evaluated
        //add the start node to OPEN

        var openNodes = {};
        var closedNodes = {};

        roomlist[startroom].travelCost = 0;
        roomlist[startroom].F_cost = 0;
        roomlist[startroom].H_cost = 0;

        openNodes[startroom] = roomlist[startroom];

        var breakLoop = false

        do {

            var openroomKeys = Object.keys(openNodes);
            if (openroomKeys.length == 0)
            {
                breakLoop = true;
            }

            var currentNodeName = this.getCurrent(openNodes, targetRoom) //current = node in OPEN with the lowest f_cost
            var currentNodeobj = openNodes[currentNodeName];

            //   console.log("-b-",openroomKeys.length);
            //    console.log("-a-",currentNodeName);
            //console.log("---",JSON.stringify(currentNodeobj));

            delete openNodes[currentNodeName]; //remove current from OPEN
            closedNodes[currentNodeName] = currentNodeobj //add current to CLOSED

            //if current is the target node //path has been found
            //        return
            if (currentNodeName == targetRoom)
            {

                breakLoop = true;
            }

            if (breakLoop == false)
            {
                var neighbours = currentNodeobj.conections;

                for (var i = 0; i < neighbours.length; i++) //foreach neighbour of the current node
                {
                    var skip = false;
                    var neighbourobj = roomlist[neighbours[i]];
                    //        if neighbour is in CLOSED
                    //                skip to the next neighbour
                    if (closedNodes[neighbours[i]] != undefined)
                    {

                        skip = true;
                    }

                    //        if neighbour is not traversable
                    //                skip to the next neighbour

                    else if (neighbourobj == undefined)
                    {

                        skip = true;
                    }
                    else if (neighbourobj.travelCost == 5)
                    {

                        //    skip = true; 
                    }

                    if (skip == false)
                    {

                        // if neighbour is not in OPEN
                        //   set f_cost of neighbour
                        //   set parent of neighbour to current
                        //   if neighbour is not in OPEN
                        //       add neighbour to OPEN

                        if (openNodes[neighbours[i]] == undefined && roomlist[neighbours[i]] != undefined)
                        {
                            neighbourobj.F_cost = currentNodeobj.F_cost + neighbourobj.travelCost;
                            neighbourobj.parentt = currentNodeName;
                            openNodes[neighbours[i]] = neighbourobj;
                        }
                        else if (roomlist[neighbours[i]] != undefined && openNodes[neighbours[i]].F_cost > neighbourobj.F_cost + openNodes[neighbours[i]].travelCost)
                        {
                            //        if new path to neighbour is shorter  
                            //                set f_cost of neighbour
                            //                set parent of neighbour to current

                            openNodes[neighbours[i]].F_cost = currentNodeobj.F_cost + openNodes[neighbours[i]].travelCost;
                            openNodes[neighbours[i]].parentt = currentNodeName;
                            //  console.log("d c d ");  
                        }

                    }

                }
            }

            //  breakLoop = true;

        }
        while (!breakLoop);

        var closedNodesroomKeys = Object.keys(closedNodes);
/*
        for (var i = 0; i < closedNodesroomKeys.length; i++)
        {
            //    console.log("a", closedNodes[closedNodesroomKeys[i]].parentt );
            if (closedNodes[closedNodesroomKeys[i]] && closedNodes[closedNodesroomKeys[i]].parentt != "")
            {
                Game.map.visual.line(new RoomPosition(25, 25, closedNodesroomKeys[i]), new RoomPosition(25, 25, closedNodes[closedNodesroomKeys[i]].parentt),
                {
                    width: 5,
                    color: '#ffffff',
                    lineStyle: 'solid'
                });
            }
        }
*/
        var roomlistEnd = [];
        var current = targetRoom;

        if (closedNodes[current] == undefined)
        {
            console.log("no path1");
            return false;
        }
        if (closedNodes[current].parentt == undefined)
        {
            console.log("no path2");
            return false;
        }

        for (var i = 0; i < 500; i++)
        {

            if (current != startroom)
            {
                roomlistEnd.push(current);
                current = closedNodes[current].parentt;
            }
            else
            {
                i = 501
            }

        }

        roomlistEnd.push(startroom);

        // roomlistEnd.push(startroom);
        return roomlistEnd.splice(1, roomlistEnd.length);

    },
    createTheCostMatrix: function(startroom, goalRoom, distancebetwenRooms, allowRooms)
    {

        Game.map.visual.line(new RoomPosition(25, 25, goalRoom), new RoomPosition(25, 25, startroom),
        {
            width: 5,
            color: '#ffff00',
            lineStyle: 'dashed'
        });

        var extraBuffer = 3;

        var roomlista = {};

        var widthOfCost = distancebetwenRooms;
        var heightOfCost = distancebetwenRooms;

        if (Memory.roomlist === undefined)
        {
            Memory.roomlist = {};
       
        }

        for (var xx = -15; xx < 15; xx++)
        {
            for (var yy = -15; yy < 15; yy++)
            {

                var roomname = this.getRoomname(startroom, xx, yy);

                var roomObj = Memory.roomlist[roomname];

                var allConnections = [];

                if (roomname != undefined && roomObj != undefined)
                {

                    var exits = Game.map.describeExits(roomname);

                    if (roomObj.ExitTop)
                    {
                        allConnections.push(exits["1"]); //// top toom get roomname
                    }

                    if (roomObj.ExitRight)
                    {
                        allConnections.push(exits["3"]); //// top toom get roomname
                    }

                    if (roomObj.ExitBottom)
                    {
                        allConnections.push(exits["5"]); //// top toom get roomname
                    }

                    if (roomObj.ExitLeft)
                    {
                        allConnections.push(exits["7"]); //// top toom get roomname
                    }

                    if (roomObj.dangerLevel >= allowRooms)
                    {
                        var dangerlvl = 250
                        
                   
                        
                    }
                    else
                    {
                        var dangerlvl = roomObj.dangerLevel
                    }

                    roomlista[roomname] = {
                        travelCost: dangerlvl,
                        conections: allConnections,
                        H_cost: 9999,
                        F_cost: 9999,
                        parentt: ""
                    };

                }
                else
                {

                    var exits = Game.map.describeExits(roomname);
if(exits != undefined){
                    allConnections.push(exits["1"]); //// top toom get roomname

                    allConnections.push(exits["3"]); //// top toom get roomname

                    allConnections.push(exits["5"]); //// top toom get roomname

                    allConnections.push(exits["7"]); //// top toom get roomname

                    roomlista[roomname] = {
                        travelCost: 355,
                        conections: allConnections,
                        H_cost: 9999,
                        F_cost: 9999,
                        parentt: ""
                    };
                
                }
                
                
                
                }

            }
        }

        return this.aStar(roomlista, startroom, goalRoom);

    },
    run: function(startroom, goalRoom, allowRooms)
    {

        var roomlist = [];
        var distancebetwenRooms = Game.map.getRoomLinearDistance(startroom, goalRoom);

        var roomlist = this.createTheCostMatrix(startroom, goalRoom, distancebetwenRooms, allowRooms);

        return roomlist;
    },

    getRoomname: function(center, xx, yy)
    {
        var xxString = "";
        var yyString = "";
        var xletter = center.substring(0, 1);
        var yletter = "";
        if (center.indexOf("S") != -1)
        {
            yletter = "S";
        }
        if (center.indexOf("N") != -1)
        {
            yletter = "N";
        }
        var yyposition = center.indexOf(yletter);
        //console.log("yyposition",yyposition);
        if (yyposition == 2)
        {
            xxString = center.substring(1, 2);
            yyString = center.substring(3, center.length);
        }
        if (yyposition == 3)
        {
            xxString = center.substring(1, 4);
            yyString = center.substring(4, center.length);
        }
        var xxint = parseInt(xxString);
        var yyint = parseInt(yyString);
        if (xxint < Math.abs(xx) && xx < 0 && xletter == "E")
        {
            xxint = Math.abs((Math.abs(xx) - xxint));
            xletter = "W";
            //    console.log("e to w");
        }
        else if (xxint < Math.abs(xx) && xx < 0 && xletter == "W")
        {
            xxint = Math.abs((Math.abs(xx) - xxint));
            xletter = "E";
            //      console.log("w to e");
        }
        else
        {
            xxint = Math.abs((xxint + xx));
        }
        if (yyint < Math.abs(yy) && yy < 0 && yletter == "N")
        {
            yyint = Math.abs((Math.abs(yy) - yyint));
            yletter = "S";
        }
        else if (yyint < Math.abs(yy) && yy < 0 && yletter == "S")
        {
            yyint = Math.abs((Math.abs(yy) - yyint));
            yletter = "N";
        }
        else
        {
            yyint = Math.abs((yyint + yy));
        }

        /// if crossing north to south - 1 from the y to accoutn for two 0  this is likly the case for all directions 
        if (yletter == "S" && center.indexOf("S") == -1) // if the new letter is s and the old one wasnt 
        {
            yyint--;
        }

        /// if crossing north to south - 1 from the y to accoutn for two 0  this is likly the case for all directions 
        if (yletter == "N" && center.indexOf("N") == -1) // if the new letter is s and the old one wasnt 
        {
            yyint--;
        }

        /// if crossing north to south - 1 from the y to accoutn for two 0  this is likly the case for all directions 
        if (yletter == "E" && center.indexOf("E") == -1) // if the new letter is s and the old one wasnt 
        {
            xxint--;
        }

        /// if crossing north to south - 1 from the y to accoutn for two 0  this is likly the case for all directions 
        if (yletter == "W" && center.indexOf("W") == -1) // if the new letter is s and the old one wasnt 
        {
            xxint--;
        }

        return xletter + xxint + yletter + yyint;
    }

}
module.exports = roompathfinder;