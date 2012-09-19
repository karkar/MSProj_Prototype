$(document).ready( function() {
    var min=50;
    var max=150;
    var mid=100;
	
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
				$(this).attr("id","cell_"+ (parentIndex + 1) +"_" + (index+1) );
		});
    });
	
	$
	
	//make all the cells in the table resizable. fix 3 levels of resize (50px, 100px, 150px)
    $( ".divTest" ).resizable({ //make all the cells with class = "divTest" as resizable
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
	
	
	//select all divs/cells with class="divTest" and append a SVG to it.
	var divSVG = d3.selectAll(".divTest").append("svg:svg").attr("width", "100%").attr("height", "100%");
	console.log(divSVG);
	
	//experiment to draw in a cell
	/*var data = [4, 8, 15, 16, 23, 42];
	var x = d3.scale.linear()
		.domain([0, d3.max(data)])
		.range([0, 100]);
	
	divSVG.select("#cell_2_5")
			.data(data)
		.enter().append("#cell_2_5")
			.attr("y", function(d, i) { return i * 10; })
			.attr("width", x)
			.attr("height", 10);
	*/
	
	/*
	$("tr").each(function(index){
		//console.log('tr'+index+':'+$(this).attr('id'));
			//assign ID to rows. eg: row_1,row_2,etc.
			$(this).attr("id","row_"+(index+1));
			//iterate through the row to find individual cells
			$(this).children("td").each(function(index){
			//console.log('td'+index+':'+$(this).attr('id'));
				var parentIndex = $(this).parent("tr").index();
				$(this).attr("id","cell_"+ (parentIndex + 1) +"_" + (index+1) );
		});
    });
	*/
	
	
	
});