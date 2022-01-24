var roompathfind = require('roompathfinder');
var squadmanage = require('squadManager');
var attackPhalanxController = {
 
 
     createphalanx: function(attackID) // does not do a path check    // TURN ALL THAT REPEATED SHIT INTO A FDUCKING FUCKTION
    {
        var terrain = new Room.Terrain(attackID);
        var roomCenter = new RoomPosition(25, 25, attackID)

        var roomobj = Game.rooms[attackID]
        var usernameacc = roomobj.controller.owner.username;
      
        if (roomobj.controller != undefined && roomobj.controller.owner != undefined && roomobj.controller.owner.username != undefined)
        {

            var allramparts = roomCenter.findInRange(FIND_HOSTILE_STRUCTURES, 20,
            {
                filter: (res) =>
                {
                    return (res.structureType == STRUCTURE_RAMPART && res.owner.username == usernameacc);
                }
            });
        }

        else
        {

            var allramparts = roomCenter.findInRange(FIND_HOSTILE_STRUCTURES, 20,
            {
                filter: (res) =>
                {
                    return (res.structureType == STRUCTURE_RAMPART);
                }
            });

        }

        var allrampartsreturnobj = {
            positionData:
            {}
        }

        for (var i = 0; i < allramparts.length; i++)
        {

            var rampX = allramparts[i].pos.x;
            var rampY = allramparts[i].pos.y;
            var label = String(rampX) + "-" + String(rampY);
            var positionA = new RoomPosition(rampX, rampY, attackID)
            var allrampartsNear = positionA.findInRange(FIND_HOSTILE_STRUCTURES, 1,
            {
                filter: (res) =>
                {
                    return (res.structureType == STRUCTURE_RAMPART);
                }
            });
            var positionAbove = new RoomPosition(rampX, rampY - 1, attackID)
            // var positionabove 

            var topacc = 0;
            ///////////////////////////////////////////////////////////////////////////////////////////
            var current = positionAbove.findInRange(FIND_HOSTILE_STRUCTURES, 0,
            {
                filter: (res) =>
                {
                    return (res.structureType == STRUCTURE_RAMPART);
                }
            });

            if (allrampartsNear.length < 7 && current.length == 1)
            {
                topacc = 1;
                // check rampart has a viable position 
                try
                {
                    var positionAbove1 = new RoomPosition(rampX, rampY - 1, attackID)
                    var current1 = positionAbove1.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX, rampY - 1) == TERRAIN_MASK_WALL && current1.length == 0) // remove the positive figure if any of these trigger
                    {
                        topacc = 0;
                    }

                    var positionAbove2 = new RoomPosition(rampX, rampY - 2, attackID)
                    var current2 = positionAbove2.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX, rampY - 2) == TERRAIN_MASK_WALL && current2.length == 0) // remove the positive figure if any of these trigger
                    {
                        topacc = 0;
                    }

                    var positionAbove3 = new RoomPosition(rampX, rampY - 3, attackID)
                    var current3 = positionAbove3.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX, rampY - 3) == TERRAIN_MASK_WALL && current3.length == 0) // remove the positive figure if any of these trigger
                    {
                        topacc = 0;
                    }

                    var positionAbove4 = new RoomPosition(rampX, rampY - 4, attackID)
                    var current4 = positionAbove3.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX, rampY - 4) == TERRAIN_MASK_WALL && current4.length == 0) // remove the positive figure if any of these trigger
                    {
                        topacc = 0;
                    }

                }
                catch (e)
                {}

            }

            var positionbellow = new RoomPosition(rampX, rampY + 1, attackID)
            var bottomacc = 0;
            ///////////////////////////////////////////////////////////////////////////////////////////
            var current = positionbellow.findInRange(FIND_HOSTILE_STRUCTURES, 0,
            {
                filter: (res) =>
                {
                    return (res.structureType == STRUCTURE_RAMPART);
                }
            });

            if (allrampartsNear.length < 7 && current.length == 1)
            {
                bottomacc = 1;
                // check rampart has a viable position 
                try
                {
                    var positionAbove1 = new RoomPosition(rampX, rampY + 1, attackID)
                    var current1 = positionAbove1.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX, rampY + 1) == TERRAIN_MASK_WALL && current1.length == 0) // remove the positive figure if any of these trigger
                    {
                        bottomacc = 0;
                    }

                    var positionAbove2 = new RoomPosition(rampX, rampY + 2, attackID)
                    var current2 = positionAbove2.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX, rampY + 2) == TERRAIN_MASK_WALL && current2.length == 0) // remove the positive figure if any of these trigger
                    {
                        bottomacc = 0;
                    }

                    var positionAbove3 = new RoomPosition(rampX, rampY + 3, attackID)
                    var current3 = positionAbove3.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX, rampY + 3) == TERRAIN_MASK_WALL && current3.length == 0) // remove the positive figure if any of these trigger
                    {
                        bottomacc = 0;
                    }

                    var positionAbove4 = new RoomPosition(rampX, rampY + 4, attackID)
                    var current4 = positionAbove3.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX, rampY + 4) == TERRAIN_MASK_WALL && current4.length == 0) // remove the positive figure if any of these trigger
                    {
                        bottomacc = 0;
                    }

                }
                catch (e)
                {}

            }

            var positionleft = new RoomPosition(rampX - 1, rampY, attackID)
            var leftacc = 0;
            ///////////////////////////////////////////////////////////////////////////////////////////
            var current = positionleft.findInRange(FIND_HOSTILE_STRUCTURES, 0,
            {
                filter: (res) =>
                {
                    return (res.structureType == STRUCTURE_RAMPART);
                }
            });

            if (allrampartsNear.length < 7 && current.length == 1)
            {
                leftacc = 1;
                // check rampart has a viable position 
                try
                {
                    var positionAbove1 = new RoomPosition(rampX - 1, rampY, attackID)
                    var current1 = positionAbove1.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX - 1, rampY) == TERRAIN_MASK_WALL && current1.length == 0) // remove the positive figure if any of these trigger
                    {
                        leftacc = 0;
                    }

                    var positionAbove2 = new RoomPosition(rampX - 2, rampY, attackID)
                    var current2 = positionAbove2.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX - 2, rampY) == TERRAIN_MASK_WALL && current2.length == 0) // remove the positive figure if any of these trigger
                    {
                        leftacc = 0;
                    }

                    var positionAbove3 = new RoomPosition(rampX - 3, rampY, attackID)
                    var current3 = positionAbove3.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX - 3, rampY) == TERRAIN_MASK_WALL && current3.length == 0) // remove the positive figure if any of these trigger
                    {
                        leftacc = 0;
                    }

                    var positionAbove4 = new RoomPosition(rampX - 4, rampY, attackID)
                    var current4 = positionAbove3.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });

                    if (terrain.get(rampX - 4, rampY) == TERRAIN_MASK_WALL && current4.length == 0) // remove the positive figure if any of these trigger
                    {
                        leftacc = 0;
                    }

                }
                catch (e)
                {}

            }

            var positionright = new RoomPosition(rampX, rampY, attackID)
            var rightacc = 0;
            ///////////////////////////////////////////////////////////////////////////////////////////
            var current = positionright.findInRange(FIND_HOSTILE_STRUCTURES, 0,
            {
                filter: (res) =>
                {
                    return (res.structureType == STRUCTURE_RAMPART);
                }
            });

            if (allrampartsNear.length < 7 && current.length == 1)
            {
                rightacc = 1;
                // check rampart has a viable position 
                try
                {

                    var positionAbove1 = new RoomPosition(rampX + 1, rampY, attackID)
                    var current1 = positionAbove1.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });
                    if (terrain.get(rampX + 1, rampY) == TERRAIN_MASK_WALL || current1.length != 0) // remove the positive figure if any of these trigger
                    {
                        rightacc = 0;
                    }

                    var positionAbove2 = new RoomPosition(rampX + 2, rampY, attackID)
                    var current2 = positionAbove2.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });
                    if (terrain.get(rampX + 2, rampY) == TERRAIN_MASK_WALL || current2.length != 0) // remove the positive figure if any of these trigger
                    {
                        rightacc = 0;
                    }

                    var positionAbove3 = new RoomPosition(rampX + 3, rampY, attackID)
                    var current3 = positionAbove3.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });
                    if (terrain.get(rampX + 3, rampY) == TERRAIN_MASK_WALL || current3.length != 0) // remove the positive figure if any of these trigger
                    {
                        rightacc = 0;
                    }

                    var positionAbove4 = new RoomPosition(rampX + 4, rampY, attackID)
                    var current4 = positionAbove3.findInRange(FIND_HOSTILE_STRUCTURES, 0,
                    {
                        filter: (res) =>
                        {
                            return (res.structureType == STRUCTURE_RAMPART);
                        }
                    });
                    if (terrain.get(rampX + 4, rampY) == TERRAIN_MASK_WALL || current4.length != 0) // remove the positive figure if any of these trigger
                    {
                        rightacc = 0;
                    }

                }
                catch (e)
                {}
            }

            if (topacc + bottomacc + leftacc + rightacc != 0)
            {
                allrampartsreturnobj.positionData[String(label)] = {

                    rampX: rampX,
                    rampY: rampY,
                    topq: topacc,
                    bottomq: bottomacc,
                    leftq: leftacc,
                    rightq: rightacc
                };
            }

        } // END OF FOOR LOOP

       // console.log("aaaaaaq", JSON.stringify(allrampartsreturnobj.positionData["32-16"]));
      //  console.log("bbbbbbb", JSON.stringify(allrampartsreturnobj.positionData["33-16"]));

        this.findBestOpporunityForPalanx(attackID, allrampartsreturnobj.positionData)

        var returnobj = {
            // numberOfSquads:
            //   positionsOfSquads:
        }

        return returnobj;

    },
    findBestOpporunityForPalanx: function(attackID, allrampartsreturnobj)
    {

        var listofnames = Object.keys(allrampartsreturnobj);
        var listofvalues = Object.values(allrampartsreturnobj);

        //  on the right 
        for (var i = 0; i < listofnames.length; i++)
        {

            var currentrampartobj = allrampartsreturnobj[listofnames[i]];

            if (currentrampartobj.rightq != 0)
            {

                var breaker = false;
                var counter = 1;
                while (!breaker)
                {

                    var thisx = currentrampartobj.rampX;
                    //   console.log("1-",thisx );
                    var thisy = currentrampartobj.rampY;
                    var thisy2 = currentrampartobj.rampY + counter;
                    var belowlabel = String(thisx) + "-" + String(thisy2);

                    if (allrampartsreturnobj[belowlabel] == undefined)
                    { // no rampart below this one 
                        //    console.log(listofnames[i]+"-q-",belowlabel );
                        breaker = true;
                    }
                    else if (allrampartsreturnobj[belowlabel].rightq == 0)
                    { // rampart below this one is not part of the phalanx
                        //   console.log("-qq" );

                        Game.rooms[attackID].visual.circle(new RoomPosition(currentrampartobj.rampX + counter,currentrampartobj.rampY ,attackID ),{fill: 'red', radius: 0.55, stroke: 'red'});

                        breaker = true;
                    }
                    else
                    {
                        allrampartsreturnobj[listofnames[i]].rightq += allrampartsreturnobj[belowlabel].rightq;
                        allrampartsreturnobj[belowlabel].rightq = 0;
                        console.log("---", allrampartsreturnobj[listofnames[i]].rightq);
                        counter++;
                    }

                };
                //    console.log("-c-",counter);
            }

            if (allrampartsreturnobj[listofnames[i]].rightq > 5)
            {
                console.log("-2-", allrampartsreturnobj[listofnames[i]].rightq);
                var thisx = allrampartsreturnobj[listofnames[i]].rampX;
                var thisy = allrampartsreturnobj[listofnames[i]].rampY;

                var pos1 = new RoomPosition(thisx + 1, thisy, attackID)
                var pos2 = new RoomPosition(thisx + 1, thisy + allrampartsreturnobj[listofnames[i]].rightq, attackID)
                Game.rooms[attackID].visual.line(pos1, pos2,
                {
                    color: 'green',
                    width: 1,
                    lineStyle: 'green'
                });

                var pos1 = new RoomPosition(thisx + 2, thisy, attackID)
                var pos2 = new RoomPosition(thisx + 2, thisy + allrampartsreturnobj[listofnames[i]].rightq, attackID)
                Game.rooms[attackID].visual.line(pos1, pos2,
                {
                    color: 'orange',
                    width: 1,
                    lineStyle: 'orange'
                });

                var pos1 = new RoomPosition(thisx + 3, thisy, attackID)
                var pos2 = new RoomPosition(thisx + 3, thisy + allrampartsreturnobj[listofnames[i]].rightq, attackID)
                Game.rooms[attackID].visual.line(pos1, pos2,
                {
                    color: 'red',
                    width: 1,
                    lineStyle: 'red'
                });
            }

        }

    },
 
 
 ControlPhalanx: function(attackID){
     
 },
 
 
    run: function(attackID)
    {
       
     
       
        
       
        ////////////////////////////////////////////////////////////////////////////
        //               creqate phalanx
        ////////////////////////////////////////////////////////////////////////////
         

            this.createphalanx(attackID);
          }

      
              this.ManagePhalanxSpawning(attackID);//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
    },
 
    ManagePhalanxSpawning: function(attackID)
    {
         
    } 

}
module.exports = attackPhalanxController;