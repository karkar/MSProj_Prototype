/**
 * @author Ravi
 */


$(document).ready( function() {
    var min=50;
    var max=150;
    var mid=100;
	
	var students = d3.csv('output.csv', function(csv) {
	tabulate(csv, ["username","behavior", "medication", "sleep", "bm"]);
	// r is the number of rows in the csv (without considering the title row)
	var r = csv.length;
	/*var ages = d3.keys(csv[0]).filter(function(key) {
    	return key != "username" && key != "Total";
  	});

  	d3.selectAll("thead td").data(ages).on("click", function(k) {
			   	tr.sort(function(a, b) { return (b[k] / b.Total) - (a[k] / a.Total); });
	});*/

	// loop through each row, 2 to 12, ignoring title row and going through all 11 rows
	for(i = 2 ; i <= r+1; i++){
	// loop though each cell in the row, 1 thorugh 5
	for(j = 1 ; j <= 5; j++){
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
					d3.select("#"+rectid).attr("data-behavior", name.behavior);
				    d3.select("#"+rectid).attr("class","behaviors");
				} else if (rectid == "rect_"+i+"_"+3){
				    d3.select("#"+rectid).attr("data-meds", name.medication);
				    d3.select("#"+rectid).attr("class","medications");
				} else if (rectid == "rect_"+i+"_"+4){
					d3.select("#"+rectid).attr("data-sleep", name.sleep);
				    d3.select("#"+rectid).attr("class","sleeps");
				} /*else if (rectid == "rect_"+i+"_"+4){
					if(name.seizures > 30){
					d3.select("#"+rectid).attr("fill","#A52A2A");
					} else if ( name.seizures < 20){
					d3.select("#"+rectid).attr("fill","#41AB5D");
					} else {
					d3.select("#"+rectid).attr("fill","#EE9A49"); 
					}
				} */ else if (rectid == "rect_"+i+"_"+5) {
					d3.select("#"+rectid).attr("data-bm", name.bm);
				    d3.select("#"+rectid).attr("class","bms");
				} 
			
			//show tooltips for all the cells
			d3.selectAll("#"+rectid).append("svg:title")
				.text(function(d) { return d.value; });

		}
		
	}
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
			
			var par = $this.closest('td').parent('tr'),           	//find the parent row of the cell 
				chichi = par.children('td').children('div');		//select all the cells' div in the row. hierarchy: tr->td->div
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
			
			
			
			if(wdmin<wdmid)
            {
                if(wdmin<wdmax)
                {
                    $( aim ).width(min);      
                }
                else
                {
                     $( aim ).width(max); 
                }
            }
            else if(wdmid<wdmax)
            {
                $( aim ).width(mid); 
            }
            else
            {
                $( aim ).width(max); 
            }
			
              //  $( "#divHeight" ).empty().append("height: " + $(this).height());   
           // alert('resizing stopped');
        }
    });
	
	
});
	

function tabulate(data, columns){ //, ["behavior", "sleep", "seizures", "medicine", "bm"]	
	var table = d3.select("#left_content").append("table"),
		thead = table.append("thead"),
		tbody = table.append("tbody");

	 // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
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
    
	var divSVG = d3.selectAll("td")
					.append("div")
						.attr("class","divsvg")
					.append("svg:svg")
						.attr("width", "100%")
						.attr("height", "100%");
	
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
	

$( "#behaviorslider" ).slider({
            range: true,
            orientation:"vertical",
            min: 0,
            max: 1000,
            step: 10,
            values: [ 300, 400 ],
            slide: function( event, ui ) {
                $( "#count1" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
                $('.behaviors').each(function(i, obj){
                    var behValue = $(obj).data('behavior');

                    if(behValue == -1){
                    	$(obj).attr("fill","#BDBDBD");
                    } else if(behValue > ui.values[ 1 ]){
						$(obj).attr("fill","#A52A2A");
					} else if (behValue < ui.values[ 0 ]){
						$(obj).attr("fill","#41AB5D");
					} else {
						$(obj).attr("fill","#EE9A49"); 
					}
                });
            }
    });
$( "#count1" ).val( $( "#behaviorslider" )
				.slider( "values", 0 ) + " - " + $( "#behaviorslider" )
				.slider( "values", 1 ) );
/*var valor0 = $("#behaviorslider").slider( "values", 0); 
var valor1 = $("#behaviorslider").slider( "values", 1); 
console.log(valor0);       
console.log(valor1); */

$( "#medicationslider" ).slider({
            range: true,
            orientation:"vertical",
            min: 0,
            max: 20,
            step: 1,
            values: [ 7, 10 ],
            slide: function( event, ui ) {
                $( "#count2" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
                $('.medications').each(function(i, obj){
                    var medValue = $(obj).data('meds');

                    if(medValue == -1){
                    	$(obj).attr("fill","#BDBDBD");
                    } else if(medValue > ui.values[ 1 ]){
						$(obj).attr("fill","#A52A2A");
					} else if (medValue < ui.values[ 0 ]){
						$(obj).attr("fill","#41AB5D");
					} else {
						$(obj).attr("fill","#EE9A49"); 
					}
                });
            }
    });
$( "#count2" ).val( $( "#medicationslider" )
				.slider( "values", 0 ) + " - " + $( "#medicationslider" )
				.slider( "values", 1 ) );

$( "#sleepslider" ).slider({
            range: true,
            orientation:"vertical",
            min: 0,
            max: 12,
            step: 0.5,
            values: [ 7, 8.5 ],
            slide: function( event, ui ) {
                $( "#count3" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
                $('.sleeps').each(function(i, obj){
                    var sleepValue = $(obj).data('sleep');

                    if(sleepValue == -1){
                    	$(obj).attr("fill","#BDBDBD");
                    } else if(sleepValue > ui.values[ 1 ]){
						$(obj).attr("fill","#A52A2A");
					} else if (sleepValue < ui.values[ 0 ]){
						$(obj).attr("fill","#EE9A49");
					} else {
						$(obj).attr("fill","#41AB5D"); 
					}
                });
            }
    });
$( "#count3" ).val( $( "#sleepslider" )
				.slider( "values", 0 ) + " - " + $( "#sleepslider" )
				.slider( "values", 1 ) );

$( "#bmslider" ).slider({
            range: true,
            orientation:"vertical",
            min: 0,
            max: 1,
            step: 0.01,
            values: [ 0.7, 1 ],
            slide: function( event, ui ) {
                $( "#count4" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
                $('.bms').each(function(i, obj){
                    var bmValue = $(obj).data('bm');

                    if(bmValue == -1){
                    	$(obj).attr("fill","#BDBDBD");
                    } else if(bmValue > ui.values[ 1 ]){
						$(obj).attr("fill","#A52A2A");
					} else if (bmValue < ui.values[ 0 ]){
						$(obj).attr("fill","#41AB5D");
					} else {
						$(obj).attr("fill","#EE9A49"); 
					}
                });
            }
    });
$( "#count4" ).val( $( "#bmslider" )
				.slider( "values", 0 ) + " - " + $( "#bmslider" )
				.slider( "values", 1 ) );

var context = d3.select("#right_content")
				.append("div")
					.attr("id","context_box")
				.append("p")
					.text(function(d) {
					
									
						var myMouseOverFunction = function() {
							var selection = d3.select(this);
							return d.value;
						}		
					});
});