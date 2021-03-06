/**
 * @author Ravi
 */

$(document).ready( function() {
    var min=10;
    var max=150;
    var mid=100;

    //d3.selectAll("rect").attr("fill","#EE9A49");

    var students = d3.csv('output.csv', function(csv) {
    tabulate(csv, ["id","Behavior", "Medication", "Sleep", "Bowel Movement","Flag"]);
    // r is the number of rows in the csv (without considering the title row)
    var r = csv.length;

    // loop through each row, 2 to 12, ignoring title row and going through all 11 rows
    for(i = 2 ; i <= r+1; i++){
    // loop though each cell in the row, 1 thorugh 5
    for(j = 1 ; j <= 5; j++){
        //remove svg from the bookmark column (6)
        var rmv = "cell_"+i+"_"+6;
        $("#"+rmv).find("svg").remove();
        $("#"+rmv).find(".divsvg")
                              .attr("width","15px")
                              .attr("height","10px")
                              .attr("class","flags")
                              .append("<img class='image' src='box_light.png'height=8px/>");

        //select svg associated with each cell
        var str = "svg_"+i+"_"+j;
        //append a rectangle to each svg and assign an id
        d3.selectAll("#"+str)
            .append("rect")
                .attr("width","100%")
                .attr("height","100%")
                .attr("id","rect_"+i+"_"+j);
        
        var rectid = "rect_"+i+"_"+j;
        var name=csv[i-2];
                
                //assign colors to each cell in a row. i.e. check the cell index (1 through 6) and use appropriate boundary conditions
                if (rectid == "rect_"+i+"_"+1){
                    var svgParent = $("#"+rectid)
                                        .closest("td")
                                        .attr("id");
                    //console.log(svgParent);
                    d3.select("#"+svgParent)
                        .text(function(d) { return d.value; });
                } else if (rectid == "rect_"+i+"_"+2){
                    d3.select("#"+rectid).attr("data-behavior", name.behavior)
                                         .attr("class","behaviors")
                                         //show tooltips for all the cells
                                         .append("svg:title")
                                            .text(name.behavior);
                } else if (rectid == "rect_"+i+"_"+3){
                    d3.select("#"+rectid).attr("data-meds", name.medication)
                                         .attr("class","medications")
                                         .append("svg:title")
                                            .text(name.medication);
                } else if (rectid == "rect_"+i+"_"+4){
                    d3.select("#"+rectid).attr("data-sleep", name.sleep)
                                         .attr("class","sleeps")
                                         .append("svg:title")
                                            .text(name.sleep);
                } else if (rectid == "rect_"+i+"_"+5) {
                    d3.select("#"+rectid).attr("data-bm", name.bm)
                                         .attr("class","bms")
                                         .append("svg:title")
                                            .text(name.bm);
                } 
            }
    }   

    $(".flags").each(function(idx,elm){
        $(elm).data('flag',false).on('click',function(){
            var flag = $(this).data("flag");
                if (flag){
                    $(this).html("<img class='image' src='box_blue.png' height=8px/>");
                } else {
                    $(this).html("<img class='image' src='box_light.png' height=8px/>");
                }
                $(this).data("flag", !flag);
            });
    });

    //make all the cells in the table resizable. fix 3 levels of resize (50px, 100px, 150px)
    $( ".divsvg" ).resizable({ //make all the cells with class = "divsvg" as resizable
        maxHeight: 200,
        maxWidth: 200,
        minHeight: 10,
        minWidth: 10,
        handles:'s,e',

        stop: function(event, ui) {
            var $this=$(this); //this is the cell being selected

            var dmin=$this.height()-min,
                dmid=$this.height()-mid,
                dmax=$this.height()-max;
            // find the absolute value of min,mid and max
            dmin=Math.abs(dmin);
            dmid=Math.abs(dmid);
            dmax=Math.abs(dmax);
            
            var par = $this.closest('td').parent('tr'),             //find the parent row of the cell 
                chichi = par.children('td').children('div');        //select all the cells' div in the row. hierarchy: tr->td->div
            //resizing logic.           
            if(dmin<dmid)
            {
                if(dmin<dmax)
                {
                    $( chichi ).height(min);      
                }
                else
                {
                     $( chichi ).height(max); 
                }
            }
            else if(dmid<dmax)
            {
                $( chichi ).height(mid); 
            }
            else
            {
                $( chichi ).height(max); 
            }
                  
            var wdmin=$(this).width()-min;
            var wdmid=$(this).width()-mid;
            var wdmax=$(this).width()-max;
            
            wdmin=Math.abs(wdmin);
            wdmid=Math.abs(wdmid);
            wdmax=Math.abs(wdmax);
            
            var childIndex = $this.closest('td').index(); // find the index of the cell being resized
            //console.log(childIndex);
            var targetColumnInAllRows = $('tr td:nth-child(' + (childIndex + 1) + ')');
            //console.log(targetColumnInAllRows.children('div'));
            var aim = targetColumnInAllRows.children('div');
            //find the respective target header 
            var aim_h = $('#th_' + (childIndex + 1));
            
            
            if(wdmin<wdmid)
            {
                if(wdmin<wdmax)
                {
                    $( aim ).width(min);
                    $( aim_h).width(min);
                }
                else
                {
                    $( aim ).width(max);
                    $( aim_h ).width(max); 
                }
            }
            else if(wdmid<wdmax)
            {
                $( aim ).width(mid);
                $( aim_h ).width(mid);
            }
            else
            {
                $( aim ).width(max); 
                $( aim_h ).width(max);
            }


            
              //  $( "#divHeight" ).empty().append("height: " + $(this).height());   
           // alert('resizing stopped');
        }
    });

    $( "#behaviorslider" ).slider({
            range: true,
            orientation:"horizontal",
            min: 0,
            max: 2000,
            step: 10,
            values: [ 150, 700 ],
            create: function( event, ui ) {
                $('.behaviors').each(function(i, obj){
                    var behValue = $(obj).data('behavior'); 
                    if(behValue == 10000){
                        $(obj).attr("fill","#D9D9D9")
                              .attr("data-context", "missing");
                    } else if(behValue > 700){
                        $(obj).attr("fill","#A52A2A")
                              .attr("data-context", "red");
                    } else if (behValue < 150){
                        $(obj).attr("fill","#41AB5D")
                              .attr("data-context", "green");
                    } else {
                        $(obj).attr("fill","#EE9A49")
                            .attr("data-context", "orange");
                    }
                });
            },
            slide: function( event, ui ) {
                $( "#count1" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
                $('.behaviors').each(function(i, obj){
                    var behValue = $(obj).data('behavior');
                    if(behValue == 10000){
                        $(obj).attr("fill","#D9D9D9")
                              .attr("data-context", "missing");
                    } else if(behValue > ui.values[ 1 ]){
                        $(obj).attr("fill","#A52A2A")
                              .attr("data-context", "red");
                    } else if (behValue < ui.values[ 0 ]){
                        $(obj).attr("fill","#41AB5D")
                              .attr("data-context", "green");
                    } else {
                        $(obj).attr("fill","#EE9A49")
                              .attr("data-context", "orange");
                    }
                });
            }
    });
    $( "#count1" ).val( $( "#behaviorslider" )
                    .slider( "values", 0 ) + " - " + $( "#behaviorslider" )
                    .slider( "values", 1 ) );

    $( "#medicationslider" ).slider({
                range: true,
                orientation:"horizontal",
                min: 0,
                max: 25,
                step: 1,
                values: [ 7, 10 ],
                create: function( event, ui ) {
                    $('.medications').each(function(i, obj){
                        var medValue = $(obj).data('meds');
                        if(medValue == 10000){
                            $(obj).attr("fill","#D9D9D9")
                                  .attr("data-context", "missing");
                        } else if(medValue > 10){
                            $(obj).attr("fill","#A52A2A")
                                  .attr("data-context", "red");
                        } else if (medValue < 7){
                            $(obj).attr("fill","#41AB5D")
                                  .attr("data-context", "green");
                        } else {
                            $(obj).attr("fill","#EE9A49")
                                  .attr("data-context", "orange");
                        }
                    });
                },
                slide: function( event, ui ) {
                    $( "#count2" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
                    $('.medications').each(function(i, obj){
                        var medValue = $(obj).data('meds');

                        if(medValue == 10000){
                            $(obj).attr("fill","#D9D9D9")
                                  .attr("data-context", "missing");
                        } else if(medValue > ui.values[ 1 ]){
                            $(obj).attr("fill","#A52A2A")
                                  .attr("data-context", "red");
                        } else if (medValue < ui.values[ 0 ]){
                            $(obj).attr("fill","#41AB5D")
                                  .attr("data-context", "green");
                        } else {
                            $(obj).attr("fill","#EE9A49")
                                  .attr("data-context", "orange");
                        }
                    });
                }
        });
    $( "#count2" ).val( $( "#medicationslider" )
                    .slider( "values", 0 ) + " - " + $( "#medicationslider" )
                    .slider( "values", 1 ) );

    $( "#sleepslider" ).slider({
                range: true,
                orientation:"horizontal",
                min: 0,
                max: 12,
                step: 0.5,
                values: [ 6.5, 8.5 ],
                create: function( event, ui ) {
                    $('.sleeps').each(function(i, obj){
                        var sleepValue = $(obj).data('sleep');
                        if(sleepValue == 10000){
                            $(obj).attr("fill","#D9D9D9")
                                  .attr("data-context", "missing");
                        } else if(sleepValue > 8.5){
                            $(obj).attr("fill","#EE9A49")
                                  .attr("data-context", "orange");
                        } else if (sleepValue < 6.5){
                            $(obj).attr("fill","#A52A2A")
                                  .attr("data-context", "red");
                        } else {
                            $(obj).attr("fill","#41AB5D")
                                  .attr("data-context", "green"); 
                        }
                    });
                },
                slide: function( event, ui ) {
                    $( "#count3" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
                    $('.sleeps').each(function(i, obj){
                        var sleepValue = $(obj).data('sleep');

                        if(sleepValue == 10000){
                            $(obj).attr("fill","#D9D9D9")
                                  .attr("data-context", "missing");
                        } else if(sleepValue > ui.values[ 1 ]){
                            $(obj).attr("fill","#EE9A49")
                                  .attr("data-context", "orange");
                        } else if (sleepValue < ui.values[ 0 ]){
                            $(obj).attr("fill","#A52A2A")
                                  .attr("data-context", "red");
                        } else {
                            $(obj).attr("fill","#41AB5D")
                                  .attr("data-context", "green"); 
                        }
                    });
                }
        });
    $( "#count3" ).val( $( "#sleepslider" )
                    .slider( "values", 0 ) + " - " + $( "#sleepslider" )
                    .slider( "values", 1 ) );

    $( "#bmslider" ).slider({
                range: true,
                orientation:"horizontal",
                min: 0,
                max: 1,
                step: 0.01,
                values: [ 0.6, 0.8 ],
                create: function( event, ui ) {
                    $('.bms').each(function(i, obj){
                        var bmValue = $(obj).data('bm');
                        if(bmValue == 10000){
                            $(obj).attr("fill","#D9D9D9")
                                  .attr("data-context", "missing");
                        } else if(bmValue > 0.8){
                            $(obj).attr("fill","#41AB5D")
                                  .attr("data-context", "green");
                        } else if (bmValue < 0.6){
                            $(obj).attr("fill","#A52A2A")
                                  .attr("data-context", "red");
                        } else {
                            $(obj).attr("fill","#EE9A49")
                                  .attr("data-context", "orange");
                        }
                    });
                },
                slide: function( event, ui ) {
                    $( "#count4" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
                    $('.bms').each(function(i, obj){
                        var bmValue = $(obj).data('bm');

                        if(bmValue == 10000){
                            $(obj).attr("fill","#D9D9D9")
                                  .attr("data-context", "missing");
                        } else if(bmValue > ui.values[ 1 ]){
                            $(obj).attr("fill","#41AB5D")
                                  .attr("data-context", "green");
                        } else if (bmValue < ui.values[ 0 ]){
                            $(obj).attr("fill","#A52A2A")
                                  .attr("data-context", "red");
                        } else {
                            $(obj).attr("fill","#EE9A49")
                                  .attr("data-context", "orange");
                        }
                    });
                }
        });
    $( "#count4" ).val( $( "#bmslider" )
                    .slider( "values", 0 ) + " - " + $( "#bmslider" )
                    .slider( "values", 1 ) );

//remove usename from selection of click event
var forsort = d3.keys(csv[0]).filter(function(key) {
    return key;
});
//do sorting - ascending and descending
var tr = d3.selectAll("tbody tr");  
lastSort = null;
d3.selectAll("thead th").data(forsort).on("click", function(k) { 
    if(lastSort != k){
        tr.sort(function(a,b){  
            return a[k] - b[k]; 
        }); 
        lastSort = k;
    } else {
        tr.sort(function(a,b){  
            return b[k] - a[k]; 
        }); 
        lastSort = null;
    }
}); 


});
    

function tabulate(data, columns){ //, ["behavior", "sleep", "seizures", "medicine", "bm"]   
    var table = d3.select("#right_content").append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

     // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .append("div")
        .attr("class","th_div")
        //.append("style","style:word-break:break-word")
            .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td");


    var synchronizedMouseOver = function() {
        var celldata = $(this).find('title').text();
        var celltype = $(this).find('rect');
        //console.log($(this).find('rect').attr("class"))//.find('rect').attr("id"));
        //console.log(celldata);

    var hovertext = $("#context_box");
        hovertext//.attr("style", "background-color:#D9D9D9")
                //.text(celldata);
                .text(function(){
                   if(celltype.attr("class") == "behaviors"){
                        if(celltype.data("context") == "missing"){
                            var context_text = "Missing data..";
                            celldata = context_text;
                            return celldata;
                        } else if(celltype.data("context") == "red"){
                            var context_text = " - student has high target behavior count.";
                            celldata = celldata + context_text;
                            return celldata;
                        } else if(celltype.data("context") == "green"){
                            var context_text = " - student has quite low target behavior count.";
                            celldata = celldata + context_text;
                            return celldata;
                        } else if(celltype.data("context") == "orange"){
                            var context_text = " - student has moderate/acceptable target behavior count.";
                            celldata = celldata + context_text;
                            return celldata;
                        }
                   } else if(celltype.attr("class") == "medications"){
                        if(celltype.data("context") == "missing"){
                            var context_text = "Missing data.";
                            celldata = context_text;
                            return celldata;
                        } else if(celltype.data("context") == "red"){
                            var context_text = " - high number of medicine.";
                            celldata = celldata + context_text;
                            return celldata;
                        } else if(celltype.data("context") == "green"){
                            var context_text = " - low number of medicine.";
                            celldata = celldata + context_text;
                            return celldata;
                        } else if(celltype.data("context") == "orange"){
                            var context_text = " - moderate number of medicine.";
                            celldata = celldata + context_text;
                            return celldata;
                        }
                   } else if(celltype.attr("class") == "sleeps"){
                        if(celltype.data("context") == "missing"){
                            var context_text = "Missing data.";
                            celldata = context_text;
                            return celldata;
                        } else if(celltype.data("context") == "red"){
                            var context_text = "hours - low sleep.";
                            celldata = celldata + context_text;
                            return celldata;
                        } else if(celltype.data("context") == "green"){
                            var context_text = "hours - good sleep.";
                            celldata = celldata + context_text;
                            return celldata;
                        } else if(celltype.data("context") == "orange"){
                            var context_text = "hours - over sleeping.";
                            celldata = celldata + context_text;
                            return celldata;
                        }
                   } else if(celltype.attr("class") == "bms"){
                        if(celltype.data("context") == "missing"){
                            var context_text = "Missing data.";
                            celldata = context_text;
                            return celldata;
                        } else if(celltype.data("context") == "red"){
                            var context_text = " - very infrequent bowel movement.";
                            celldata = celldata + context_text;
                            return celldata;
                        } else if(celltype.data("context") == "green"){
                            var context_text = " - regular bowel movement.";
                            celldata = celldata + context_text;
                            return celldata;
                        } else if(celltype.data("context") == "orange"){
                            var context_text = " - slightly less bowel movement.";
                            celldata = celldata + context_text;
                            return celldata;
                        }
                   }
               });
     };

    var synchronizedMouseOut = function() {
        var hovertext = $("#context_box");
    };
    
    var divSVG = d3.selectAll("td")
                    .append("div")
                        .attr("class","divsvg")
                    .append("svg:svg")
                        .attr("width", "100%")
                        .attr("height", "100%")
                        .on('mouseover', synchronizedMouseOver)
                        .on("mouseout", synchronizedMouseOut);

    $(".th_div").each(function(index){
        $(this).attr("id","th_"+(index+1));
    });

    //assign unique ID to all cells (including the non-SVG ones
    //iterate through all the rows
    $("tr").each(function(index){
        //console.log('tr'+index+':'+$(this).attr('id'));
            //assign ID to rows. eg: row_1,row_2,etc.
            $(this).attr("id","row_"+(index+1));
            //iterate through the row to find individual cells
            $(this).children("td").each(function(index){
            //console.log('td'+index+':'+$(this).attr('id'));
                var parentIndex = $(this).parent("tr").index();
                $(this).attr("id","cell_"+ (parentIndex+2) +"_" + (index+1) );
                $(this).find("svg").attr("id","svg_"+ (parentIndex+2) +"_" + (index+1) );
        });
    });
    
    return table;
}

});