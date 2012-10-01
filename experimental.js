$(document).ready( function() {
    var min=50;
    var max=150;
    var mid=100;
	
	var students = d3.csv('test.csv', function(csv) {
	tabulate(csv, ["name","behavior", "sleep", "seizures", "medicine", "bm"]);
	
	for(i = 2 ; i < 13; i++){
	for(j = 1 ; j < 7; j++){
		var str = "svg_"+i+"_"+j;
		
	
		
		d3.selectAll("#"+str).append("rect").attr("width","100%").attr("height","100%").attr("id","rect_"+i+"_"+j);
		var rectid = "rect_"+i+"_"+j;
			var name=csv[i-2];
			
				//assign colors to each cell in a row. i.e. check the cell index (1 through 6) and use appropriate boundary conditions
				if (rectid == "rect_"+i+"_"+1){
					var svgParent = $("#"+rectid).closest("td").attr("id");
					console.log(svgParent);
					d3.select("#"+svgParent).text(function(d) { return d.value; });
					console.log(name.name);
				} else if (rectid == "rect_"+i+"_"+2){
					if(name.behavior > 400){
					d3.select("#"+rectid).attr("fill","#E00013"); //red
					} else if ( name.behavior < 300){
					d3.select("#"+rectid).attr("fill","#339900"); // green
					} else {
					d3.select("#"+rectid).attr("fill","#FF9900"); //orange
					}
				} else if (rectid == "rect_"+i+"_"+3){
					if(name.sleep > 8.5){
					d3.select("#"+rectid).attr("fill","#FF9900");
					} else if ( name.sleep < 7){
					d3.select("#"+rectid).attr("fill","#E00013");
					} else {
					d3.select("#"+rectid).attr("fill","#339900"); 
					}
				} else if (rectid == "rect_"+i+"_"+4){
					if(name.seizures > 30){
					d3.select("#"+rectid).attr("fill","#E00013");
					} else if ( name.seizures < 20){
					d3.select("#"+rectid).attr("fill","#339900");
					} else {
					d3.select("#"+rectid).attr("fill","#FF9900"); 
					}
				} else if (rectid == "rect_"+i+"_"+5){
					if(name.medicine > 7){
					d3.select("#"+rectid).attr("fill","#E00013");
					} else if ( name.medicine < 5){
					d3.select("#"+rectid).attr("fill","#339900");
					} else {
					d3.select("#"+rectid).attr("fill","#FF9900"); 
					}
				} else {
					if(name.bm > 1.3){
					d3.select("#"+rectid).attr("fill","#E00013");
					} else if ( name.bm < 0.7){
					d3.select("#"+rectid).attr("fill","#FF9900");
					} else {
					d3.select("#"+rectid).attr("fill","#339900"); 
					}
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
	
	
})
	

	

function tabulate(data, columns){ //, ["behavior", "sleep", "seizures", "medicine", "bm"]	
	var table = d3.select("body").append("table"),
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
        .append("td")
    
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



var context = d3.select("body")
				.append("div")
					.attr("id","context_box")
					
					

	
});