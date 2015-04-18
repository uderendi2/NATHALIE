(function () {

    DERGraphs = {
        version: "1.0.3"
    };
    //------------------------------------------------------------------------------------
    //Author: Urs Derendinger
    //Datum: 18.2.2013
    //
    // var a of the format = d3.select("#test1")

    /* Beispiel Call
   =================================================================
    var data = [{"jahr":2009, "rate":300}]
     var chart = Bar_Chart()
    .x(function(d) { return formatx(d.jahr); })
    .y(function(d) { return +d.rate; })
    .barPadding(5)
    .width(500)
    .yLabel(function (d) { return Math.round(d[1]/1000,3)});
	var formatx = function(d) { return "'"+d.toString().substr(d.toString().length-2,2);};
    d3.json("taxpayers.json", function(data) {
    d3.select("#example2")
      .datum(data)
      .call(chart);
	});
    =================================================================== 
    */

    //------------------------------------------------------------------------------------

   DERGraphs.Bar_Chart = function () {
        var margin = { top: 2, right: 2, bottom: 17, left: 2 },
            width = 760,
            height = 120,
            xRoundBands = .1,
            xValue = function (d) { return d[0]; },
            yValue = function (d) { return d[1]; },
            barPadding = 0,
            maxValue = "",
            xdistance = 5,
            
            
          //xScale = d3.scale.linear(),
            xScale = d3.scale.ordinal(),
            yScale = d3.scale.linear(),

            xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(0, 0),
            //area = d3.svg.area().x(X).y1(Y),
            //line = d3.svg.line().x(X).y(Y);
           // yLabel = function (d) { return Math.round(d[1]/1000,3)};
            yLabel = function (d) { return d[1]; };

        //console.log(maxValue);

        function chart(selection) {
            selection.each(function (data) {

                var barWidth = ((width - margin.left - margin.right) / data.length) - barPadding;
               
                // Convert data to standard representation greedily;
                // this is needed for nondeterministic accessors.
                data = data.map(function (d, i) {
                    return [xValue.call(data, d, i), yValue.call(data, d, i)];
                });

                if (maxValue < d3.max(data, function (d) { return d[1]; })) {
                    maxValue = d3.max(data, function (d) { return d[1]; });
     //               console.log(maxValue)
     //               console.log("empty String")
                };

                // Update the x-scale.
                //================================================================
                // xScale
                // .domain(d3.extent(data, function(d) { return d[0]; }))
                // .range([0, width - margin.left - margin.right]);
                xScale
                   .domain(data.map(function (d) { return d[0]; }))
                   .rangeRoundBands([0, width - margin.left - margin.right], xRoundBands);

                // Update the y-scale.
                //================================================================
                yScale
                    .domain([0, maxValue])
                    .range([height - margin.top - margin.bottom, 0]);

                // Select the svg element, if it exists.
                var svg = d3.select(this).selectAll("svg").data([data]);

                // Otherwise, create the skeletal chart.
                var gEnter = svg.enter().append("svg").append("g");
                gEnter.append("g").attr("class", "bars");
                gEnter.append("g").attr("class", "datalabels");
                gEnter.append("g").attr("class", "x axis");

                // Update the outer dimensions.
                svg.attr("width", width).attr("height", height);

                // Update the inner dimensions.
                var g = svg.select("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // Update the bars.
                var bar = svg.select(".bars").selectAll(".bar").data(data);
                bar.enter().append("rect");
                bar.attr("class", "bar")
                    .attr("x", function (d) { return X(d); })
                    .attr("y", function (d) { return Y(d); })
                    .attr("width", (barWidth))
                    .attr("height", function (d) { return Y0() - Y(d); });


                // Update the x-axis.
                g.select(".x.axis")
                    .attr("transform", "translate(0," + yScale.range()[0] + ")")
                    .call(xAxis).selectAll("text").attr("y", xdistance);


                // Update the yLabels    
                var bar = svg.select(".datalabels").selectAll(".datalabel").data(data);
                bar.enter().append("svg:text");
                bar.attr("class", "datalabel")
                      .attr("x", function (d) { return X(d) + barWidth / 2; })
                      .attr("y", function (d) { return Y(d) + 15; })
                         .text(function (d) { return yLabel(d); })
                         .attr("text-anchor", "middle")
                         .attr("fill", "white");

            });
        };

        // The x-accessor for the path generator; xScale ∘ xValue.
        function X(d) {
            return xScale((d[0]));
        };

        // The x-accessor for the path generator; yScale ∘ yValue.
        function Y(d) {
            return yScale(d[1]);
        };

        function Y0() {
            return yScale(0);
        };

        chart.margin = function (_) {
            if (!arguments.length) return margin;
            margin = _;
            return chart;
        };

        chart.width = function (_) {
            if (!arguments.length) return width;
            width = _;
            return chart;
        };

        chart.height = function (_) {
            if (!arguments.length) return height;
            height = _;
            return chart;
        };

        chart.x = function (_) {
            if (!arguments.length) return xValue;
            xValue = _;
            return chart;
        };

        chart.y = function (_) {
            if (!arguments.length) return yValue;
            yValue = _;
            return chart;
        };

        chart.barPadding = function (_) {
            if (!arguments.length) return barPadding;
            barPadding = _;
            return chart;
        };

        chart.yLabel = function (_) {
            if (!arguments.length) return yLabel;
            yLabel = _;
            return chart;
        };

        chart.maxValue = function (_) {
            if (!arguments.length) return maxValue;
            maxValue = _;
            return chart;
        };

        chart.xdistance = function (_) {
            if (!arguments.length) return xdistance;
            xdistance = _;
            return chart;
        };


        return chart;
   };

    /*------------------------------------------------------------------------------------
    //Author: Urs Derendinger
    //Datum: 23.2.2013
    //
    Beispielaufruf:
    ===============
    queue()
		.defer(d3.json, "Content/topojson/switzerland-simplified.json")
		.await(kanton);

		function kanton(error, data) {

			var sz = DERGraphs.filter_by_Canton(data, 5); //2=Bern, 5=Schwyz

			var topo = DERGraphs.topo_json()
			.width(500)
			.height((2 * (365 * 0.618) + 26))
			.scale(25000)
			//.centre([8.0, 46.70]) //Bern
			.centre([9.9,46.6])
			.onClk(function (d, i) {i;})
			.fclass(function(d) {
				return "q4-9"; //quantize(rateById[d.properties.bfsNo]);
			})//css Klasse zum Einfärben
			.title(function(d) {
				return d.properties.name;
			})//title für hover
			;
			
			var pos = d3.select('#example5_EK');
				xpos=d3.select('#test');	
			    xpos.datum(sz).call(topo);	

		};//Kanton

    //------------------------------------------------------------------------------------*/

 DERGraphs.topo_json = function () {

       //constructor
       var margin = { top: 2, right: 2, bottom: 17, left: 2 }
          , width = 2060
          , height = 520
           //, xValue = function (d) { return d[0]; }
           //, yValue = function (d) { return d[1]; }
          , rotate = [0, 0]
          , centre = [8.8, 46.8]
          , scale = 10000
          , facts = {}
          , onClk = function () { }
          , rateById = {}
          , fclass = function (d) { }
          , title = function (d) { }
       //   , div = d3.select("#ttip").attr("class", "tooltip").style("opacity", 1);
       ;



       function chart(selection) {


           selection.each(function (data) {
           	


               // Convert data to standard representation greedily;
               // this is needed for nondeterministic accessors.
               // data = data.map(function (d, i) {
               // return [xValue.call(data, d, i), yValue.call(data, d, i)];
               // }); 	

               var xy = d3.geo.albers().rotate(rotate).center(centre).scale(scale);
               var path = d3.geo.path().projection(xy);

               // var div = d3.select(this).append("div")
               //.attr("class", "tooltip")
               //.style("opacity", 1e-6);

               var svg = d3.select(this).selectAll("svg").data([data]);
               // Otherwise, create the skeletal chart.
               var gEnter = svg.enter().append("svg").append("g");

               // Update the outer dimensions.
               svg.attr("width", width).attr("height", height);

               // Update the inner dimensions.
               var g = svg.select("g")
                   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

               //Gemeindegrenzen zeichnen
               g.attr("class", "swiss-municipalities")
                 .selectAll("path")
                 
                 //.data(topojson.object(data, data.objects["swiss-municipalities"]).geometries)
                 .data(topojson.feature(data, data.objects["swiss-municipalities"]).features)
                 
                 .enter().append("path")
              //   .attr("tooltip", title)
                 .attr("class", fclass)
                 .attr("d", path)
                 .on("click", onClk)
                 //add Tooltip
                 .call(DERGraphs.tooltip()
                .attr({class: 'tooltip'})
                //.style({color: 'black'})
                .text(title)
            )
            .on('mouseover', function(d, i){ d3.select(this).style({'stroke-width': 3}); })
            .on('mouseout', function(d, i){ d3.select(this).style({'stroke-width': 1}); });
                 // .on("mouseover", mouseover)
                 // .on("mousemove", mousemove)
                 // .on("mouseout", mouseout);

               //Kantonsgrenze zeichnen  
               g.append("g")
                  .attr("class", "swiss-cantons")
                  .selectAll("path")
                  //.data(topojson.object(data, data.objects["swiss-cantons"]).geometries)
                  .data(topojson.feature(data, data.objects["swiss-cantons"]).features)
                  .enter().append("path")
                  .attr("d", path);
           });
       };


       // function mouseover() {
//            
           // div.transition()
               // .duration(500)
               // .style("opacity", 1);
       // }
// 
       // function mousemove() {
//          
           // // div
               // // //.text(d3.event.pageX + ", " + d3.event.pageY)
               // // .text(this.getAttribute("tooltip"))
               // // .style("left", (d3.event.pageX) + "px")
               // // .style("top", (d3.event.pageY) + "px");
//     
       // // div.transition().duration(200).style("opacity", .9); 
    // div.html(this.getAttribute("tooltip"))  
//     
    // //var offsetLeft = this.offsetLeft;
    // console.log(this.parentNode.parentNode.parentNode.parentNode)
    // console.log(document.getElementById("example5_EK").offsetLeft)
//     
      // // .style("left", (parseInt(d3.select(this).attr("cx")) + document.getElementById("svg").offsetLeft) + "px")     
      // // .style("top", (parseInt(d3.select(this).attr("cy")) + document.getElementById("svg").offsetTop) + "px");    
// 
       // }
// 
       // function mouseout() {
           // div.transition()
               // .duration(500)
              // // .style("opacity", 1e-6);
               // .style("opacity", 1e-6);
       // }


       //============================================================
       // Expose Public Variables
       //------------------------------------------------------------

       chart.margin = function (_) {
           if (!arguments.length) return margin;
           margin = _;
           return chart;
       };

       chart.width = function (_) {
           if (!arguments.length) return width;
           width = _;
           return chart;
       };

       chart.height = function (_) {
           if (!arguments.length) return height;
           height = _;
           return chart;
       };

       chart.rotate = function (_) {
           if (!arguments.length) return rotate;
           rotate = _;
           return chart;
       };

       chart.centre = function (_) {
           if (!arguments.length) return centre;
           centre = _;
           return chart;
       };

       chart.scale = function (_) {
           if (!arguments.length) return scale;
           scale = _;
           return chart;
       };

       chart.onClk = function (_) {
           if (!arguments.length) return onClk;
           onClk = _;
           return chart;
       };
        
        chart.fclass = function (_) {
            if (!arguments.length) return fclass;
            fclass = _;
        return chart;
        };

        chart.rateById = function (_) {
            if (!arguments.length) return rateById;
            rateById = _;
            return chart;
        };

        chart.title = function (_) {
            if (!arguments.length) return title;
            title = _;
            return chart;
        };


       return chart;
   };


    /*----------------------------------------------------------------------
    //Filtert aus Topojson der ganzen Schweiz einen einzelnen Kanton heraus
    //	ch: topojson Schweiz
    //	canton: 5 für Kanton Schwyz
    //---------------------------------------------------------------------*/

   DERGraphs.filter_by_Canton = function (ch, canton) {

       var filter_o = {};
       filter_o.type = "Topology";
       filter_o.arcs = ch.arcs;
       filter_o.transform = ch.transform;
       filter_o.arcs = ch.arcs;
       filter_o.objects = {};
       filter_o.objects["swiss-cantons"] = {};
       filter_o.objects["swiss-cantons"].type = "GeometryCollection";
       filter_o.objects["swiss-cantons"].geometries = [];
       filter_o.objects["swiss-municipalities"] = {};
       filter_o.objects["swiss-municipalities"].type = "GeometryCollection";
       filter_o.objects["swiss-municipalities"].geometries = [];

       ch.objects["swiss-municipalities"].geometries.forEach(function (d) {
           if (d.properties.cantonNo == canton) {
               filter_o.objects["swiss-municipalities"].geometries.push(d);
           }
       });
       ch.objects["swiss-cantons"].geometries.forEach(function (d) {
           if (d.properties.no == canton) {
               filter_o.objects["swiss-cantons"].geometries.push(d);
           }
       });
       return filter_o;
   };



  /*  ----------------------------------------------------------------------
    Sezt eine div an vordefinierte Position im 24-er-Grid
    Grid à 6 Spalten x 4 Reihen 
    Beispiel:   
    	mDetail: [{ fact: 20, mtitle: "Kanton Schwyz<br><span class='subh3'>Primär Steuerpflichtige</span>", gridpos: 1 }];
    	msize: { w: 382, dw: 26, h: (2 * (165 * 0.618) + 26), dh: 26 }    
     var ABox = DERGraphs.Box_r2()
             ABox.msize(msize)
                 .mclass("c_l")
                 .onClk(function (d) {
                     dataGeoBox[0].mtitle = "Kanton Schwyz<br><span class='subh3'>" + d.mtitle + "</span>"
                     console.log(d);
                     fact = d.fact;
                     DetailTabelle();
                     fKanton();
                 });
                 ABox.datum(mDetail).call(ABox)
    	
    @return box
    -----------------------------------------------------------------------*/


   DERGraphs.Box_r2 = function () {
       var msize = {}
          , mclass = ""
          , boxclass = "Box"
          , onClk = function () { }

       ;

       //Definition 24-er Grid
       function gridval(d) {
           var w = msize.w, dw = msize.dw, h = msize.h, dh = msize.dh;
           var grid = [
                { top: 0, left: 0, w: w, h: h } //0
              , { top: 0, left: (w + dw), w: w, h: h } //1
              , { top: 0, left: 2 * (w + dw), w: w, h: h } //2
              , { top: 0, left: 3 * (w + dw), w: w, h: h } //3
              , { top: 0, left: 4 * (w + dw), w: w, h: h } //4
              , { top: 0, left: 5 * (w + dw), w: w, h: h } //5

              //2.Reihe
              , { top: (h + dh), left: 0, w: w, h: h } //6
              , { top: (h + dh), left: (w + dw), w: w, h: h } //7
              , { top: (h + dh), left: 2 * (w + dw), w: w, h: h } //8
              , { top: (h + dh), left: 3 * (w + dw), w: w, h: h } //9
              , { top: (h + dh), left: 4 * (w + dw), w: w, h: h } //10
              , { top: (h + dh), left: 5 * (w + dw), w: w, h: h } //11

              //3.Reihe
              , { top: 2 * (h + dh), left: 0, w: w, h: h } //12
              , { top: 2 * (h + dh), left: (w + dw), w: w, h: h } //13
              , { top: 2 * (h + dh), left: 2 * (w + dw), w: w, h: h } //14
              , { top: 2 * (h + dh), left: 3 * (w + dw), w: w, h: h } //15
              , { top: 2 * (h + dh), left: 4 * (w + dw), w: w, h: h } //16
              , { top: 2 * (h + dh), left: 5 * (w + dw), w: w, h: h } //17

              //4.Reihe
              , { top: 3 * (h + dh), left: 0, w: w, h: h } //18
              , { top: 3 * (h + dh), left: (w + dw), w: w, dw: dw, h: h } //19
              , { top: 3 * (h + dh), left: 2 * (w + dw), w: w, h: h } //20
              , { top: 3 * (h + dh), left: 3 * (w + dw), w: w, h: h } //21
              , { top: 3 * (h + dh), left: 4 * (w + dw), w: w, h: h } //22
              , { top: 3 * (h + dh), left: 5 * (w + dw), w: w, h: h } //23

           ];
           return grid[d];
       };

       // function chartDataRoute(d) { dr = "AWD/" + d.fact + "/" + d.gnr };//"AWD/20/1372"

       function box(selection) {
           selection.each(function (data) {
              // var dr = "" //AWD/20/1372";
               //  console.log(msize)
               var div = d3.select(this).selectAll("div");//.data([data]);
               // var gEnter = div.enter()//.append("div");     
               var detail = div
                    .data(data)
                    .enter()
                    .append("div")
                    .attr("class", boxclass)
                    .attr("style", function (d) { return "top:" + (gridval(d.gridpos - 1).top) + "px; left:" + (gridval(d.gridpos - 1).left) + "px; width:" + (gridval(d.gridpos - 1).w) + "px; height:" + gridval(d.gridpos - 1).h + "px"; });
               detail.append("h3")
                   .attr("class",mclass)
                   .on("click", onClk)
                   .html(function (d) { return d.mtitle; });

           });
           return box;
       };


       //============================================================
       // Expose Public Variables
       //------------------------------------------------------------
       box.msize = function (_) {
           if (!arguments.length) return msize;
           msize = _;
           return box;
       };

       box.mclass = function (_) {
           if (!arguments.length) return mclass;
           mclass = _;
           return box;
       };

      box.boxclass = function (_) {
           if (!arguments.length) return boxclass;
           boxclass = _;
           return box;
       };

       box.onClk = function (_) {
           if (!arguments.length) return onClk;
           onClk = _;
           return box;
       };

       return box;
   };



/*----------------------------------------------------------------------
//  Menu 
//	items: Array von Menupunkten (z.B. ['A','B','C']
//	f1: Funktion, die auf onClick ausgeführt werden soll
//	wi: Breite (width), des Menueintrages
//	
// @return: menu
//----------------------------------------------------------------------*/
   DERGraphs.Menu = function (){
       var items = ['A', 'B', 'C']
        ,f1 = function(){}
        ,wi = 55
        ,highlight = 0
       ;

       function menu(selection) {
           var ul = document.createElement("ul");
           var pos_ul = selection.appendChild(ul);
           pos_ul.className = "menu cb_f";
           //führt die Elemente aus Array [items] als Listenpunkte ein
           //class sel für Schrift weiss und cb_g als Hintergrundfarbe
           items.forEach(function (item, index) {
               var li = document.createElement("li");
               var node = document.createTextNode(item);
               pos_ul.appendChild(li).appendChild(node);
               li.onclick = function () { _toggle(this, item); };
               li.className = 'lifloat';
               li.style.width = wi + 'px';
               if (index == highlight) li.className = 'lifloat sel cb_g';
           });

           return menu;
       };

       function _toggle(it, mi) {
           var li = it.parentNode.getElementsByTagName("li");
           //für alle Elemente Class zurücksetzen
           for (var i = 0; i < li.length; i++) { li[i].className = 'lifloat'; }
           //Element selektieren
           it.className = 'lifloat sel cb_g';
           //Funktion ausführen
           f1.apply(this, [items, mi]);
       };


       //Expose public variables
       menu.items = function (_) {
           if (!arguments.length) return items;
           items = _;
           return menu;
       };

       menu.f1 = function (_) {
           if (!arguments.length) return f1;
           f1 = _;
           return menu;
       };

       menu.wi = function (_) {
           if (!arguments.length) return wi;
           wi = _;
           return menu;
       };

      menu.highlight = function (_) {
           if (!arguments.length) return highlight;
           highlight = _;
           return menu;
       };

       return menu;
};

/*----------------------------------------------------------------------
//  Menu neu
//	items: Array von Menupunkten (z.B. [{id:1, bez:'das ist ein Bezeichner'},
    {id:2, bez:'das ist ein Bezeichner'},{id:3, bez:'das ist ein Bezeichner'}]
//	f1: Funktion, die auf onClick ausgeführt werden soll
//	wi: Breite (width), des Menueintrages
//	
// @return: menu

Beispiel:
=========
var divkgd = document.getElementById("kgd");
var menukgd = DERGraphs.MenuNeu();

menukgd.classOn('menuV sel cb_g')
		.classOff('menuV')
		.wi(220)
		.items([
			    {id:99, bez:'Alle Kundengruppen'},
				{id:0, bez:'M: Beteiligung an einer JP    '},
				{id:1, bez:'L: Land-/Forstwirtschaft'},
				{id:2, bez:'S: übrige Selbständigerwerbende'},
				{id:5, bez:'T: NP mit Steuerausscheidung'},
				{id:6, bez:'U: Unselbständigerwerbende'}
				
				])
			.f1(function (items,item) {
				 	mmkgd = item.id;
				 	//console.log(item)
				 	chart();
		 		})	
			;
menukgd(divkgd);

//----------------------------------------------------------------------*/



DERGraphs.MenuNeu = function () {
            var items = [{id:1, bez:'das ist ein Bezeichner'},{id:2, bez:'das ist ein Bezeichner'},{id:3, bez:'das ist ein Bezeichner'}]
             , f1 = function () { }
             , wi = 100
             , highlight = 0
            // , classMenu = 'cb_op005_g'
             , classMenu = 'menu cb_f'
             , classOff = 'lifloat_'
             , classOn = 'lifloat_ sel cb_g'
            ;

            function menu(selection) {
                var ul = document.createElement("ul");
                var pos_ul = selection.appendChild(ul);
                pos_ul.className = classMenu;
                //führt die Elemente aus Array [items] als Listenpunkte ein
                //class sel für Schrift weiss und cb_g als Hintergrundfarbe
                items.forEach(function (item, index) {
                    var li = document.createElement("li");
                    li.innerHTML = item.bez;
                   // var node = document.createTextNode(item.bez);
                   // pos_ul.appendChild(li).appendChild(node);
                    pos_ul.appendChild(li);
                    li.onclick = function () { _toggle(this, item); };
                    li.className = classOff;
                    li.style.width = wi + 'px';
                    if (index == highlight) li.className = classOn;
                });

                return menu;
            };

            function _toggle(it, mi) {
                var li = it.parentNode.getElementsByTagName("li");
                //für alle Elemente Class zurücksetzen
                for (var i = 0; i < li.length; i++) { li[i].className = classOff; }
                //Element selektieren
                it.className = classOn;
                //Funktion ausführen
                f1.apply(this, [items, mi]);
            };

            //Expose public variables
            menu.items = function (_) {
                if (!arguments.length) return items;
                items = _;
                return menu;
            };

            menu.f1 = function (_) {
                if (!arguments.length) return f1;
                f1 = _;
                return menu;
            };

            menu.wi = function (_) {
                if (!arguments.length) return wi;
                wi = _;
                return menu;
            };

            menu.highlight = function (_) {
                if (!arguments.length) return highlight;
                highlight = _;
                return menu;
            };
            
            menu.classOff = function (_) {
                if (!arguments.length) return classOff;
                classOff = _;
                return menu;
            };

            menu.classOn = function (_) {
                if (!arguments.length) return classOn;
                classOn = _;
                return menu;
            };
            
            menu.classMenu = function (_) {
                if (!arguments.length) return classMenu;
                classMenu = _;
                return menu;
            };

            return menu;
        };
  
        
 /* *********************************************
  * Menu analog allen ander D3 Funktionen
  * 
  * Aufruf: var mMenu = DERGraphs.MenuD3();
  *         d3.select("#Menudiv").call(mMenu);
  * **********************************************/       
        
DERGraphs.MenuD3 = function () {
          //  var items = [{id:1, bez:'das ist ein Bezeichner', l:1},{id:2, bez:'das ist ein Bezeichner', l:2},{id:3, bez:'das ist ein Bezeichner', l:1}]
             var f1 = function () { }
             , wi = 100
             , highlight = 0
            // , classMenu = 'cb_op005_g'
             , classMenu = 'menu cb_f'
             , classOff = 'lifloat_'
             , classOn = 'lifloat_ sel cb_g'
            ;

            function menu(selection) {
            	
            	selection.each(function(data){
            		if (data === undefined) data = items; 
            		
            		var ul = selection.append("ul");
            		ul.attr('class',classMenu);
            		data.forEach(function(d,i){
            			
            			var li = ul.append("li");
            			li.html(d.bez)
            			.on('click', function () { _toggle(this, d); })
            			.style('width', wi+'px')
            			.style('margin-left', (d.l-1)*15 + 'px' )
            			;
            			
            			if(i==0) {li.attr('class', classOn);} else {li.attr('class', classOff);};
            			});
            	});
                
                return menu;
            };

            function _toggle(it, mi) {
                var li = it.parentNode.getElementsByTagName("li");
                //für alle Elemente Class zurücksetzen
                for (var i = 0; i < li.length; i++) { li[i].className = classOff; }
                //Element selektieren
                it.className = classOn;
                //Funktion ausführen
                f1.apply(this, [mi]);
               // console.log(it,mi);
            };

            //Expose public variables
            menu.items = function (_) {
                if (!arguments.length) return items;
                items = _;
                return menu;
            };

            menu.f1 = function (_) {
                if (!arguments.length) return f1;
                f1 = _;
                return menu;
            };

            menu.wi = function (_) {
                if (!arguments.length) return wi;
                wi = _;
                return menu;
            };

            menu.highlight = function (_) {
                if (!arguments.length) return highlight;
                highlight = _;
                return menu;
            };
            
            menu.classOff = function (_) {
                if (!arguments.length) return classOff;
                classOff = _;
                return menu;
            };

            menu.classOn = function (_) {
                if (!arguments.length) return classOn;
                classOn = _;
                return menu;
            };
            
            menu.classMenu = function (_) {
                if (!arguments.length) return classMenu;
                classMenu = _;
                return menu;
            };

            return menu;
        }; 

//------------------------------------------------------------------------------
//T E M P L A T E
//------------------------------------------------------------------------------

    //function zeichne_charts() {
    //    //constructor
    //    var maxValue = ""
    //       , chart_data = []
    //       , mDetail = []
    //    ;

    //    function chart(selection) {



    //        return chart;
    //    };

    //    //public accessors
    //    chart.maxValue = function (_) {
    //        if (!arguments.length) return maxValue;
    //        maxValue = _;
    //        return chart;
    //    };

    //    chart.chart_data = function (_) {
    //        if (!arguments.length) return chart_data;
    //        chart_data = _;
    //        return chart;
    //    };

    //    chart.mDetail = function (_) {
    //        if (!arguments.length) return mDetail;
    //        mDetail = _;
    //        return chart;
    //    };

    //    return chart;

    //};


   DERGraphs.tabInput = function () {

       var data = {}
         , cols = {}
         , otable = {}
         , mID = 0
         , ii = 0
         , l = 1
       ;

       function table() {
           otable = {};
           var o = tree();
           trav(o, l);
           return otable;
       };

       function trav(o, l) {
               for (i in o) {
                   if (typeof (o[i]) == "object") {
                       if (i == "children") {
                           //Level um eins erhöhen!
                           l = l + 1;
                       }
                       //Rekursion
                       trav(o[i], l);
                   } else {
                       //Argumente der Funktion zuweisen, die die Tabelle aufbaut
                       f2.apply(this, [i, o[i], l]);
                   }
               };
           };

       function f2(key, value, level) {
            if (key == "id") {
                ii += 1;
                //  mID = value;
                otable[ii] = { level: level };
                otable[ii].id = value;
            }
            otable[ii][key] = value;
        };

       function tree() {
           var childrenById = [];
           // of the form id: [child-ids]
           var nodes = {};
           // of the form id: {name: children: }
           var i, row;

           //Funktion liefert einen NULL-Wert (anstatt 0!!!), wenn beide Werte r1 und r2 NULL sind
           function fdelta(r1, r2) {
               if (!r1 && !r2) {
                   return null;
               } else {
                   return r1 - r2;
               }
           };

           // first pass: build child arrays and initial node array
           for (i = 0; i < data.length; i++) {
               row = data[i];
               nodes[row[cols.id]] = {
                   id: row[cols.id]
                   ,pid: row[cols.pid]
                   ,name: row[cols.colname]
                   ,col1: row[cols.value1]
                   ,sum1: row[cols.value1]
                   ,sum2: row[cols.value2]
                   ,delta: fdelta(row[cols.value1], row[cols.value2])
                   ,children: []
               };

               // assume 0 is used to mark the root's "parent"
               if (row[cols.id] == cols.root) {
                   root = row[cols.id];
               } else if (childrenById[row[cols.pid]] === undefined) {
                   childrenById[row[cols.pid]] = [row[cols.id]];
               } else {
                   childrenById[row[cols.pid]].push(row[cols.id]);
               }
           }

           // second pass: build tree, using the awesome power of recursion!
           function expand(id) {
               if (childrenById[id] !== undefined) {
                   for (var i = 0; i < childrenById[id].length; i++) {
                       var childId = childrenById[id][i];
                       //Recursion
                       var expChildID = expand(childId);
                       nodes[id].children.push(expChildID);
                       //Summenbildung über Hierarchie
                       nodes[id].sum1 += expChildID.sum1;
                       nodes[id].sum2 += expChildID.sum2;
                       nodes[id].delta += expChildID.delta;
                   }
               }

               return nodes[id];
           }

           //var mtest = expand(root)
           return expand(root); //mtest;
       };

       //============================================================
       // Expose Public Variables
       //------------------------------------------------------------
       table.data = function (_) {
           if (!arguments.length) return data;
           data = _;
           return table;
       };

       table.cols = function (_) {
           if (!arguments.length) return cols;
           cols = _;
           return table;
       };

       table.otable = function (_) {
           if (!arguments.length) return otable;
           return table;
       };


       return table;
   }; // End DERGraphs.Table


   DERGraphs.htmlTable = function () {

       var colnames = { a: "Bez" + " ", b: "#", c: "mCHF", d: "TCHF/#" }
       , tables = {}
       , htmlId = "geosz_detail_EK3"
       , width = 500
       , col1 = function () { return DERGraphs.format(table[o].sum1); }
       , col2 = function () { return DERGraphs.format(Math.round(table[o].sum2 / 1000)); }
       , col3 = function () { return DERGraphs.format(Math.round((table[o].sum2 / table[o].sum1))); }
       , collapsed = true
       , zize = false
       ;

      // , title = function () { return colnames.a }
       ;


       function htmlout(selection) {
       //    colnames.a = title;
       
       output = "<table class=\"tree\"><tr>";
       output += "<th style='width:"+width+"px;'><h2 class='c_l' style='top:10px'>" + colnames.a + "</h2></th>";
       output += "<th style='font-weight:600;'>" + colnames.b + "</th>";
       output += "<th style='font-weight:600;'>" + colnames.c + "</th>";
       output += "<th style='font-weight:600;'>" + colnames.d + "</th>";
       output += "</tr>";

       

       for (o in table) {
          // console.log(table);
           if (table[o].id !== 0) {

               if (allcells) {
                   output += "<tr style='font-size:12px' data-level=\"" + table[o].level + "\"" + ">";
                   output += "<td style=\" padding-left: " + (table[o].level - 1) * 20 + "px\" >" + table[o].id + " - " + table[o].name + "</td>";
                   output += "<td>" + col1() + "</td>";
                   output += "<td>" + col2() + "</td>";
                   output += "<td>" + col3() + "</td>";
                   output += "</tr>";
               }

               else
               {

                   if (table[o].delta != undefined) {
                
                       output += "<tr style='font-size:12px' data-level=\"" + table[o].level + "\"" + ">";
                       output += "<td style=\" padding-left: " + (table[o].level - 1) * 20 + "px\" >" + table[o].id + " - " + table[o].name + "</td>";
                       output += "<td>" + col1() + "</td>";
                       output += "<td>" + col2() + "</td>";
                       output += "<td>" + col3() + "</td>";
                       output += "</tr>";
                   };
               };


           };
           i += 1;
       };
       output += "</table>";
       htmlout = output;

       selection.find("table").remove();
       selection.append(htmlout);
       selection.find("table").treeTable({
       ignoreClickOn: "input, a, img",
       collapsedByDefault: collapsed
       });
           //console.log(selection)
       selection.find("table tr[data-level='1']").removeClass("collapsed").addClass("expanded");
       selection.find("table tr[data-level='2']").attr("style", "font-size: 12px; display: table-row;");

       };

       //============================================================
       // Expose Public Variables
       //------------------------------------------------------------
       htmlout.colnames = function (_) {
           if (!arguments.length) return colnames;
           colnames = _;
           return htmlout;
       };

       htmlout.table = function (_) {
           if (!arguments.length) return table;
           table = _;
           return htmlout;
       };

       htmlout.htmlId = function (_) {
           if (!arguments.length) return htmlId;
           htmlId = _;
           return htmlout;
       };

       htmlout.width = function (_) {
           if (!arguments.length) return width;
           width = _;
           return htmlout;
       };

       htmlout.col1 = function (_) {
           if (!arguments.length) return col1;
           col1 = _;
           return htmlout;
       };

       htmlout.col2 = function (_) {
           if (!arguments.length) return col2;
           col2 = _;
           return htmlout;
       };

       htmlout.col3 = function (_) {
           if (!arguments.length) return col3;
           col3 = _;
           return htmlout;
       };

       htmlout.title = function (_) {
           if (!arguments.length) return colnames.a;
           colnames.a = _;
           return htmlout;
       };

       htmlout.collapsed = function (_) {
           if (!arguments.length) return collapsed;
           collapsed = _;
           return htmlout;
       };
       htmlout.allcells = function (_) {
           if (!arguments.length) return allcells;
           allcells = _;
           return htmlout;
       };

       return htmlout;

};


   DERGraphs.format = function addCommas(str) {
       if (!(str === undefined || isNaN(str) || str==0)) {
           //console.log(str);
           var vorzeichen = "";
           if (str < 0) {
               vorzeichen = "-";
               str = Math.abs(str);
           };
           var amount = new String(str);
           amount = amount.split("").reverse();

           var output = "";
           for (var i = 0; i <= amount.length - 1; i++) {
               output = amount[i] + output;
               if ((i + 1) % 3 == 0 && (amount.length - 1) !== i) { //%=Modus
                   output = " " + output;
               };
           }
           return vorzeichen + output;
       } else {
           return '-';
       };
       

   }; //End addCommas

    //-----------------------------------------------------------------------------
   DERGraphs.ObjectByID = function in_array(element, table) {
       for (o in table) {
           if (table[o].id == element) {
               return table[o];
           }
       }
       return false;
   }; //End ObjectByID

   DERGraphs.Logo = function (a, Msst) {
       var fontsize = 60;
       var r = 100;
       var scale = d3.scale.linear().domain([0, 500]).range([0, (Msst * 500)]);
       //a.append("div") //.attr("style", "position:absolute; right:50px; top:50px;")
       //.attr("style", "position:absolute; top:100px; left:200px; width:130px; height:216px; font-size:14px; border:1px solid #BCD5EA;")

       var b = a.append("svg")
             .attr("width", scale(252))
             .attr("height", scale(216))
             .attr("xmlns", "http://www.w3.org/2000/svg")
             .attr("preserveAspectRatio", "xMidYMid meet")

             .append("svg:g")
             .attr("style", "opacity:0.5;");

       b.append("circle")
           .attr("r", scale(r))
           .attr("cy", scale(108))
           .attr("cx", scale(148))
           .attr("stroke-width", scale(6))
           .attr("stroke", "#b2b2b2")
           .attr("fill", "none");

       b.append("ellipse")
           .attr("ry", scale(25))
           .attr("rx", scale(106))
           .attr("cy", scale(133))
           .attr("cx", scale(108))
           .attr("stroke-width", scale(2))
           .attr("stroke", "#b2b2b2")
           .attr("fill", "none");

       b.append("svg:text")
         .text("UBD") //
         .attr("x", scale(148))
         .attr("y", scale(r + fontsize / 2))
         .attr("style", "font-size:" + scale(fontsize) + "px; font-weight:700; font-family: Sans-serif;")
         .attr("text-anchor", "middle")
         .attr("fill", "#b2b2b2");
   }; //End Logo


   DERGraphs.Arrow = function (mpos, mscale, mindex, mhtml) {
       var a = d3.select(mpos);
       var b = a.append("div").append("svg").attr("height", 200).append("svg:g").attr("transform", "scale(" + mscale + ")");
       b.append("path").attr("d", "M 14 14 L 150 14 L 175 67 L 150 120 L 14 120 z");
       b.append("circle")
           .attr("r", 13)
           .attr("cx", 14)
           .attr("cy", 14);
       b.append("text").attr("x", 9).attr("y", 20)
       .text(mindex);
       a.append("div").attr("style", "position:absolute; top:" + 50 + "%; left:30px").html(mhtml);
   };


    //Kommentieren und Dokumentieren!!!!!
    //jetzt als DERSteuern.DrawCharts implementiert
    //-------------------------------------------------------------------------

   DERGraphs.DrawCharts___X = function () {
       //constructor
       var mDetail = []
          , gemeinde = {}
          , AWD = "A"
          , chart_klein = {}
          , chart_summary = {}
          , aBox = {}
       ;

       function chart(selection) {
           draw();
           function draw() {
               var filenames = [];
               mDetail.forEach(function (i) { filenames.push("AWDpg/" + i.fact + "/" + gemeinde.gnr); });
               var q = queue();
               filenames.forEach(function (d) {
                   //add your json call to the queue
                   q.defer(function (callback) {
                       d3.json(d, function (res) { callback(null, res); });
                   });
               });
               q.awaitAll(draw_async);
           };

           function draw_async(err, results) {
              // console.log(results)
               //results is an array of each of filenames json results

               var maxVal = [];
               results.forEach(function (d, i) { if (i > 1) maxVal.push(d3.max(d, function (d) { return d[AWD] })); });

               // zeichne_charts(mDetail, results, maxVal);
               //var eos = d3.select('#' + detailAnker); //Anker-Position Detail-Graphiken
               selection.selectAll("div").remove();
               switch (AWD) {
                   case 'A':
                       chart_klein.y(function (d) { return +d.A; })
                       .yLabel(function (d) { return Math.round(d[1] / 1000); });
                       chart_summary.y(function (d) { return +d.A; })
                       .yLabel(function (d) { return Math.round(d[1] / 1000); });
                       break;
                   case 'W':
                       chart_klein.y(function (d) { return +d.W; })
                       .yLabel(function (d) { return Math.round(d[1] / 1000000); });
                       chart_summary.y(function (d) { return +d.W; })
                       .yLabel(function (d) { return Math.round(d[1] / 1000000); });
                       break;
                   case 'D':
                       chart_klein.y(function (d) { return +d.D; });
                       chart_summary.y(function (d) { return +d.D; });
                       break;
               };

               //den maximalen Wert für die Höhe der Balken setzen, damit alle Charts den gleichen relativen Massstab haben
               chart_klein.maxValue(Math.max.apply(Math, maxVal));
               chart_summary.maxValue("");

               //Boxen zeichnen
               selection
                   .datum(mDetail)
                   .call(aBox)
               ;
               //Charts einfügen
               cpos = selection.selectAll("div").append("div").attr("style", "position:absolute; bottom:0px; left:10px");

               cpos[0].forEach(function (d, i) {
                   if (i == 0) {
                       d3.select(d).datum(results[i])
                           .call(chart_summary);
                   } else {
                       d3.select(d).datum(results[i])
                           .call(chart_klein);
                   };
               });
           };
           return chart;
       };


       //public accessors
       chart.mDetail = function (_) {
           if (!arguments.length) return mDetail;
           mDetail = _;
           return chart;
       };

       chart.gemeinde = function (_) {
           if (!arguments.length) return gemeinde;
           gemeinde = _;
           return chart;
       };

       chart.AWD = function (_) {
           if (!arguments.length) return AWD;
           AWD = _;
           return chart;
       };

       chart.chart_klein = function (_) {
           if (!arguments.length) return chart_klein;
           chart_klein = _;
           return chart;
       };

       chart.chart_summary = function (_) {
           if (!arguments.length) return chart_summary;
           chart_summary = _;
           return chart;
       };

       chart.aBox = function (_) {
           if (!arguments.length) return aBox;
           aBox = _;
           return chart;
       };

       chart.msizeDetail = function (_) {
           if (!arguments.length) return msizeDetail;
           msizeDetail = _;
           return chart;
       };

       return chart;

   };

    //------------------------------------------------------------------------------
    //Gantt Chart
    //------------------------------------------------------------------------------
    // var dataset = [
    // {
    // "process" :"Konzept",
    // "stage" : "stage name 1",
    // "activities": [
    // {
    // "activity_name": "waiting",
    // "start": new Date('2012-10-10T06:45+05:30'),
    // "end": new Date('2013-04-10T08:45+05:30'),
    // "color": "red"
    // },
    // {
    // "activity_name": "processing",
    // "start": new Date('2013-05-11T05:45+05:30'),
    // "end": new Date('2013-06-11T06:45+05:30'),
    // "color": "red"
    // },
    // {
    // "activity_name": "pending",
    // "start": new Date('2013-07-01T11:45+05:30'),
    // "end": new Date('2013-09-01T12:45+05:30'),
    // "color": "red"
    // },
    // {
    // "activity_name": "pending",
    // "start": new Date('2013-09-12T11:45+05:30'),
    // "end": new Date('2013-10-13T12:45+05:30'),
    // "color": "red"
    // }
    // ]
    // }]

    //------------------------------------------------------------------------------

   DERGraphs.gantt_chart = function () {
       //constructor
       var height = 300
       , width = 500
       , lineheight = 20
       , rulerheight = 1 //(data.length) * lineheight * 1.2
       , shift = 200
       , startDate = '2012-10-01'
       , endDate = '2013-12-31'
       , textclass = "ganttText"
       ;
       
       var Tformat = d3.time.format("'%y / %U");
		// Tformat.parse("2011-01-01"); // returns a Date
		// Tformat(new Date(2011, 0, 1)); // returns a string

       function gantt(selection) {

           selection.each(function (data) {
               rulerheight = (data.length) * lineheight * 1 +lineheight;
             
               
               var x = d3.time.scale().domain([startDate, endDate]).range([0, width - shift]);
			 
               var s = d3.select(this).selectAll("svg").data([data]);
               // Otherwise, create the skeletal chart.
               var gEnter = s.enter().append("svg")
                   .attr("width", width)
                   .attr("height", height)
                   .attr("shape-rendering", "crispEdges")
                   .append("g");

               var svg = s.append("g").attr("transform", "translate(0,20)");
               
               
               

               svg.selectAll("line")
                   .data(x.ticks(d3.time.weeks, 1))
                 .enter().append("line")
                 .attr("transform", "translate(" + shift + ",0)")
                   .attr("x1", x)
                   .attr("x2", x)
                   .attr("y1", 0)
                   .attr("y2", rulerheight)
                   .style("stroke", "#ccc")
                   .style("stroke-width",1);

               svg.selectAll(".rule")
                   .data(x.ticks(d3.time.weeks, 1))
                   .enter().append("text")
                   .attr("transform", "translate(" + shift + ",0)")
                   .attr("class", "rule")
                   .attr("x", x)
                   .attr("y", 0)
                   .attr("dy", -5)
                   .attr("text-anchor", "middle")
                  // .attr("style", "font-size:12px")
                   .text(
                   	
                   	function(d){return Tformat(d);}
                   	
                   	// function (d) {
                       // var date = new Date(d); var m = function (a) { if ((a) < 10) { return '0' + (a); } else { return a } };
                       // return date.getFullYear().toString().substring(2) + '/' + (m(date.getMonth()));
                            // }
                   );

               svg.append("line")
                   .attr("transform", "translate(" + shift + ",0)")
                   .attr("y1", 0)
                   .attr("y2", rulerheight)
                   .style("stroke", "#000");

               var activities = svg.selectAll("g")
                   .data(data)// LINE 1
                   .enter()
                   .append("g")
                   
                   .attr("transform", function (d, i) {
                       return 'translate(' + shift + ',' + (10 + i * lineheight) + ')';
                   });

               activities.append('text')
                   .text(function (d) { return d.process; })
                   .attr("dy", lineheight / 2)
                   .attr("dx", -shift)
                   .attr("class", "ganttText");

               var a = activities.selectAll('rect')
                   .data(function (d) {
                       return d.activities;
                       })
                   .enter();

               a.append('rect')
                   .attr('x', function (d) { return x(d.start); })
                   .attr('width', function (d) { return x(d.end) - x(d.start); })
                   .attr('height', lineheight - 5)
                   .attr("fill-opacity", 0.8)
                   .attr("fill", function (d) { return d.color; });
                   
                   
               
           });



           return gantt;
       };

       //public accessors
       gantt.height = function (_) {
           if (!arguments.length) return height;
           height = _;
           return gantt;
       };

       gantt.width = function (_) {
           if (!arguments.length) return width;
           width = _;
           return gantt;
       };

       gantt.lineheight = function (_) {
           if (!arguments.length) return lineheight;
           lineheight = _;
           return gantt;
       };

       gantt.rulerheight = function (_) {
           if (!arguments.length) return rulerheight;
           rulerheight = _;
           return gantt;
       };

       gantt.shift = function (_) {
           if (!arguments.length) return shift;
           shift = _;
           return gantt;
       };


       gantt.startDate = function (_) {
           if (!arguments.length) return startDate;
           startDate = _;
           return gantt;
       };

       gantt.endDate = function (_) {
           if (!arguments.length) return endDate;
           endDate = _;
           return gantt;
       };
      


       return gantt;

   };


    //--------------------------------------------------
    //Arrow up
    //--------------------------------------------------

   DERGraphs.arrow_up = function () {
       var width = 70
       , height = 90
       , arrow = 27;


       function aup(selection) {

           selection.each(function (data) {
               width = (width + 23);
               var a = d3.select(this).selectAll("svg").data([data]);
               // Otherwise, create the skeletal chart.
               var gEnter = a.enter().append("svg").attr("height", (height+2)).attr("width", (width+2));

               gEnter.append("path").attr("d", "M 2 " + arrow + " L 2 " + height + " L " + width + " " + height + " L " + width + " " + arrow + " L " + ((width - 2) / 2) + " 2 z")
               .attr("stroke-width", 1)
               .attr("stroke", "#368DB9")
               .attr("fill", "none");
               d3.select(this).append("div").attr("style","position:absolute; top:" + (arrow+15) +"px; left:20px; width:"+(width-30)+"px;").html(data);

           });

           return aup;
       }


       aup.width = function (_) {
           if (!arguments.length) return width;
           width = _;
           return aup;
       };

       aup.height = function (_) {
           if (!arguments.length) return height;
           height = _;
           return aup;
       };

       aup.arrow = function (_) {
           if (!arguments.length) return arrow;
           arrow = _;
           return aup;
       };

       return aup;
   };

    //--------------------------------------------------
    //Arrow var
    //--------------------------------------------------

   DERGraphs.arrow_div = function () {
       var width = 70
       , height = 90
       , arrow = 27
       , orient = "l"
       , style = ""
       , m = 10
       ;


       function aup(selection) {

           selection.each(function (data) {
               width = (width + 23);
               var a = d3.select(this).selectAll("svg").data([data])
               , innerh = this.innerHTML
               , hpx = this.style.height
               , wpx = this.style.width
               ;
               this.innerHTML = "";

               //  px entfernen
               height = hpx.substr(0, hpx.length - 2);
               width = wpx.substr(0, wpx.length - 2);    
               
               // Otherwise, create the skeletal chart.
               var gEnter = a.enter().append("svg").attr("height", (parseInt(height) + 2)).attr("width", (parseInt(width) + 2));

               switch (orient) {
                   case 'l':
                       var p = gEnter.append("path").attr("d", "M 2 " + (height - 2) / 2 + "L " + arrow + " 2 L " + width + " 2 L " + width + " " + height + "L " + arrow + " " + height + "z");
                       style = "position:absolute; top:" + (m) + "px; left:"+ (arrow)+"px; width:" + (width-2*m-arrow) + "px; height:"+ (height-m)+"px;";
                       break;
                   case 'u':
                       var p = gEnter.append("path").attr("d", "M 2 " + arrow + " L 2 " + height + " L " + width + " " + height + " L " + width + " " + arrow + " L " + ((width - 2) / 2) + " 2 z");
                       style = "position:absolute; top:" + (arrow + m) + "px; left:" + m + "px; width:" + (width - 2 * m) + "px; height:" + (height-m) + "px;";
                       break;
                   case 'r':
                       var p = gEnter.append("path").attr("d", "M 2 2 L"+(width-arrow)+" 2L"+(width)+" "+(height-2)/2+"L"+(width-arrow)+" "+height+"L2 "+height+"z");
                       style = "position:absolute; top:" + (m) + "px; left:" + m + "px; width:" + (width - 2 * m - arrow) + "px; height:" + (height-m) + "px;";
                       break;
                   case 'd':
                       var p = gEnter.append("path").attr("d", "M 2 2 L"+width+" 2L"+width +" "+(height-arrow)+"L"+(width-2)/2+" "+height+"L2 "+(height-arrow)+"z");
                       style = "position:absolute; top:" + (m) + "px; left:" + m + "px; width:" + (width - 2 * m) + "px;height:" + (height-m) + "px;";
                       break;

                   case 't':
                       //console.log("M 18 25 c0,0 0,-7 7,-7 L" + (width - arrow) + " 18 c0,0 7,0 7,3 L" + (width) + " " + ((height)/2+9)  + "  L"  + (width - arrow + 7) + " " + (height - 3)  + " c0,0 0,3 -7,3 L25 " + height + " c0,0 -7,0 -7,-7 z")
                       gEnter.append("path").attr("d", "M 18 25 c0,0 0,-7 7,-7 L" + (width - arrow) + " 18 c0,0 7,0 7,3 L" + (width) + " " + ((height)/2+9)  + "  L"  + (width - arrow + 7) + " " + (height - 3)  + " c0,0 0,3 -7,3 L25 " + height + " c0,0 -7,0 -7,-7 z");
                       style = "position:absolute; top:" + (m + 5) + "px; left:" + (m + 18) + "px; width:" + (width - 2 * m - arrow - 18) + "px; height:" + (height-m-5) + "px;";
                      // style = "position:absolute; top:50%; text-anchor:middle; left:" + (m + 18) + "px; width:" + (width - 2 * m - arrow - 18) + "px;"

                       datatitle = this.getAttribute("data-title");
                      // console.log(datatitle);
                       if (datatitle !== null) {
                           gEnter.append("circle")
                            .attr("r", 16)
                            .attr("cx", 18)
                            .attr("cy", 18);
                           gEnter.append("text").attr("x", 12).attr("y", 26)
                           .text(datatitle);
                       };
                       break;

               };

               var newdiv = d3.select(this).append("div").attr("style", style);
               newdiv[0][0].innerHTML = innerh;
              
           });

           return aup;
       }


       aup.width = function (_) {
           if (!arguments.length) return width;
           width = _;
           return aup;
       };

       aup.height = function (_) {
           if (!arguments.length) return height;
           height = _;
           return aup;
       };

       aup.arrow = function (_) {
           if (!arguments.length) return arrow;
           arrow = _;
           return aup;
       };

       aup.orient = function (_) {
           if (!arguments.length) return orient;
           orient = _;
           return aup;
       };

       return aup;
   };


    //--------------------------------------------------
    //Cube 3D
    //--------------------------------------------------

   DERGraphs.Cube3D = function () {
       var width = 70
       , height = 90
       , arrow = 27
       , orient = "l"
       , style = ""
       , m = 10
       ;


       function cube(selection) {

           selection.each(function (data) {
               width = (width + 23);
               var a = d3.select(this).selectAll("svg").data([data])
               , innerh = this.innerHTML
               , hpx = this.style.height
               , wpx = this.style.width
               ;
               this.innerHTML = "";

               //  px entfernen
               height = hpx.substr(0, hpx.length - 2);
               width = wpx.substr(0, wpx.length - 2);

               // Otherwise, create the skeletal chart.
               var gEnter = a.enter().append("svg").attr("height", (parseInt(height)*2)).attr("width", (parseInt(width)*2));

               var a = height;
               var d11 = "M" + (1.35730148315429 * a) + "," + (0.761799087524412 * a) + "L" + (1 * a) + "," + (0.853676528930662 * a) + "L" + (1 * a) + "," + (1.39394775390625 * a) + "L" + (1.32689270019531 * a) + "," + (1.21792854309082 * a) + "z";
               var d22 = "M" + (0.642698593139647 * a) + "," + (0.761799087524412 * a) + "L" + (1 * a) + "," + (0.853676528930662 * a) + "L" + (1.35730148315429 * a) + "," + (0.761799087524412 * a) + "L" + (1 * a) + "," + (0.698745880126953 * a) + "z";
               var d33 = "M" + (1 * a) + "," + (1.39394775390625 * a) + "L" + (1 * a) + "," + (0.853676528930662 * a) + "L" + (0.642698593139647 * a) + "," + (0.761799087524412 * a) + "L" + (0.67310722351074 * a) + "," + (1.21792854309082 * a) + "z";

               //var svg = d3.select("#cube2").append("svg").attr("width", 800).attr("height", 800)
               svg= gEnter.append("g");//.attr("class", "cube")
               svg.append("path").attr("d", d11);//.attr("id", "s5")
               svg.append("path").attr("d", d22);//.attr("id", "s1")
               svg.append("path").attr("d", d33);//.attr("id", "s2")

               var newdiv = d3.select(this).append("div").attr("style", style);
               newdiv[0][0].innerHTML = innerh;

           });

           return cube;
       }


       cube.width = function (_) {
           if (!arguments.length) return width;
           width = _;
           return cube;
       };

       cube.height = function (_) {
           if (!arguments.length) return height;
           height = _;
           return cube;
       };

       cube.arrow = function (_) {
           if (!arguments.length) return arrow;
           arrow = _;
           return cube;
       };

       cube.orient = function (_) {
           if (!arguments.length) return orient;
           orient = _;
           return cube;
       };

       return cube;
   };



    //--------------------------------------------------
    //Process chain
    //--------------------------------------------------

   DERGraphs.proc = function () {
       var width = 0
       , height = 0
       , arrow = 12
       , orient = "d"
       , style = ""
       , m = 10
       ;


       function proc(selection) {

           selection.each(function (data) {
              // width = (width + 23);
               var a = d3.select(this).selectAll("svg").data([data])
               , innerh = this.innerHTML
               , hpx = this.style.height
               , wpx = this.style.width
               , coll = Array.prototype.slice.call(this.children) //wandelt htmlCollection in Array
               , n = coll.length
               , aWidth = []
               , aHeight = []
               , ihtml = []
               ;

               var desc = [];
               for (i = 0; i < coll.length; i++) { desc.push(coll[i].innerHTML); };
                         
               //  px entfernen
              // console.log(typeof(hpx))
               if (hpx !=="") height = hpx.substr(0, hpx.length - 2);
               if (wpx !== "") width = wpx.substr(0, wpx.length - 2);
               //if (height == 0) height = hpx.substr(0, hpx.length - 2)
               //if (width == 0) width = wpx.substr(0, wpx.length - 2)
               this.innerHTML = "";

               if (n > 0) {
                   widthn = width / n;
                   heightn = height / n;
                   coll.forEach(function (d, i) {
                       aWidth.push(i * width / n);
                       aHeight.push(i * height / n);
                   });

               } else {
                   widthn = width;
                   heightn = height;
                   aWidth.push(0);
                   aHeight.push(0);
                   coll.push("");
               };


               switch (orient) {
                   case 'l':
                       aWidth.reverse();
                       coll.reverse();
                       break;

                   case 'r':
                       break;

                   case 'u':
                       aHeight.sort(function (a, b) { return b - a });
                       //coll.reverse()
                       break;

                   case 'd':
   //                    aHeight.sort(function (a, b) { return b - a })
                       break;

               };


               // Otherwise, create the skeletal chart.
               var gEnter = a.enter().append("svg").attr("height", (height*1+2)*1).attr("width", (width*1+2)*1);
      
               coll.forEach(function (d, i) {                
                   if (i == 0) {
                       switch (orient) {
                           case 'l':
                               var q = gEnter.append("g").attr("transform", "translate(" + (aWidth[i]) + ")");
                               q.append("path").attr("d", "M 2 " + (height - 2) / 2 + "L " + arrow + " 2 L " + widthn + " 2 L " + widthn + " " + height + "L " + arrow + " " + height + "z");
                               style = "position:absolute; top:" + (m) + "px; left:" + (arrow+m) + "px; width:" + (widthn - 2 * m - arrow) + "px; height:" + (height - m) + "px;";
                               break;
                           case 'u':
                               var q = gEnter.append("g").attr("transform", "translate(0," + (aHeight[i]) + ")");
                               q.append("path").attr("d", "M 2 " + arrow + " L 2 " + heightn + " L " + width + " " + heightn + " L " + width + " " + arrow + " L " + ((width - 2) / 2) + " 2 z");
                               style = "position:absolute; top:" + (m+aHeight[i]) + "px; left:" + (m) + "px; width:" + (width - 2 * m) + "px; height:" + (heightn - m) + "px;";
                               break;
                           case 'r':
                               var q = gEnter.append("g").attr("transform", "translate(" + (aWidth[i]) + ")");
                               q.append("path").attr("d", "M 2 2 L" + (widthn - arrow) + " 2L" + (widthn) + " " + (height - 2) / 2 + "L" + (widthn - arrow) + " " + height + "L2 " + height + "z");//.attr("stroke", "blue").attr("stroke-widthn", 5).attr("fill", "none")
                               style = "position:absolute; top:" + (m) + "px; left:" + m + "px; width:" + (widthn - 2 * m - arrow) + "px; height:" + (height - m) + "px;";
                               break;
                           case 'd':
                               var q = gEnter.append("g").attr("transform", "translate(0," + (aHeight[i]) + ")");
                               q.append("path").attr("d", "M 2 2 L" + width + " 2L" + width + " " + (heightn - arrow) + "L" + (width - 2) / 2 + " " + heightn + "L2 " + (heightn - arrow) + "z");
                               style = "position:absolute; top:" + (m + arrow) + "px; left:" + (m) + "px; width:" + (width - 2 * m) + "px; height:" + (heightn - m) + "px;";
                               break;
                           case 'speak_down':
                               var q = gEnter.append("g").attr("transform", "translate(0," + (aHeight[i]) + ")");
                               q.append("path").attr("d", "M 2 2 L" + width + " 2L" + width + " " + (heightn - arrow) + "L" + (15) + " " + (heightn-arrow) + "L2 " + (heightn) + "z");
                               style = "position:absolute; top:" + (m ) + "px; left:" + (m) + "px; width:" + (width - 2 * m) + "px; height:" + (heightn - m - arrow) + "px;";
                               break;

                           case 'speak_up':
                               var q = gEnter.append("g").attr("transform", "translate(0," + (aHeight[i]) + ")");
                               q.append("path").attr("d", "M 2 "+ arrow + "L" + (width-15) + " " +arrow+"L" + width + " 2 L" + width + " " + (heightn) + "L2 " + (heightn) + "z");
                               style = "position:absolute; top:" + (m+arrow) + "px; left:" + (m) + "px; width:" + (width - 2 * m) + "px; height:" + (heightn - m) + "px;";
                               break;


                       };
                       var newdiv = selection.append("div").attr("style", style);
                       if (coll[i] !== "") {
                           newdiv[0][0].innerHTML = desc[i];//coll[i].innerHTML
                       };

                   } else {
                     //  var q = gEnter.append("g").attr("transform", "translate(" + aWidth[i] + ")");
                       switch (orient) {
                           case 'l':
                               var q = gEnter.append("g").attr("transform", "translate(" + aWidth[i] + ")");
                               q.append("path").attr("d", "M " + (arrow) + " 2L" + (widthn) + " 2 L" + (widthn - arrow) + " " + (height - 2) / 2 + "L" + widthn + " " + height + "L " + arrow + " " + height + "L2 " + (height - 2) / 2 + " z");//.attr("stroke", "blue").attr("stroke-width", 5).attr("fill", "none")
                               style = "position:absolute; top:" + (m) + "px; left:" + (m + widthn + (i - 1) * widthn + arrow) + "px; width:" + (widthn - 2 * m - 1.5 * arrow) + "px; height:" + (height - m) + "px;";
                               break;
                           case 'r':
                               var q = gEnter.append("g").attr("transform", "translate(" + aWidth[i] + ")");
                               q.append("path").attr("d", "M 2 2 L" + (widthn - arrow) + " 2L" + (widthn) + " " + (height - 2) / 2 + "L" + (widthn - arrow) + " " + height + "L2 " + height + "L" + arrow + " " + (height - 2) / 2 + " z");//.attr("stroke", "blue").attr("stroke-widthn", 5).attr("fill", "none")
                               style = "position:absolute; top:" + (m) + "px; left:" + (m + widthn + (i - 1) * widthn + arrow) + "px; width:" + (widthn - 2 * m - 1.5 * arrow) + "px; height:" + (height - m) + "px;";
                               break;

                           case 'u':
                               var q = gEnter.append("g").attr("transform", "translate(0," + (aHeight[i]) + ")");
                               q.append("path").attr("d", "M 2 " + arrow + " L 2 " + heightn + " L " + (width-2)/2 + " " + (heightn-arrow) + "L "+ (width) + " " +heightn+ " L " + width + " " + arrow + " L " + ((width - 2) / 2) + " 2 z");
                               style = "position:absolute; top:" + (aHeight[i]+m + arrow) + "px; left:" + (m) + "px; width:" + (width - 2 * m ) + "px; height:" + (heightn - m) + "px;";
                               break;

                           case 'd':
                               var q = gEnter.append("g").attr("transform", "translate(0," + (aHeight[i]) + ")");
                               q.append("path").attr("d", "M 2 2"+"L"+(width - 2) / 2 + " " + arrow + " L" + width + " 2L" + width + " " + (heightn - arrow) + "L" + (width - 2) / 2 + " " + heightn + "L2 " + (heightn - arrow) + "z");
                               style = "position:absolute; top:" + (aHeight[i] + m + arrow) + "px; left:" + (m) + "px; width:" + (width - 2 * m) + "px; height:" + (heightn - m) + "px;";
                               break;

                           case 'speak_down':

                               break;
                       };



                        var newdiv = selection.append("div").attr("style", style);
                        newdiv[0][0].innerHTML = desc[i];//coll[i].innerHTML

                   };

               });
           });

           return proc;
       }


       proc.width = function (_) {
           if (!arguments.length) return width;
           width = _;
           return proc;
       };

       proc.height = function (_) {
           if (!arguments.length) return height;
           height = _;
           return proc;
       };

       proc.arrow = function (_) {
           if (!arguments.length) return arrow;
           arrow = _;
           return proc;
       };

       proc.orient = function (_) {
           if (!arguments.length) return orient;
           orient = _;
           return proc;
       };

       return proc;
   };

    /****************************************************
    * Author: Urs Derendinger
    * Datum: Dezember 2013
    * gleich wie proc aber einzelne Teile über Element <figure width=100 class=benefit></figure>
    * steuerbar
    *
    *****************************************************/

   DERGraphs.proc2 = function () {
       var width = 0
       , height = 0
       , arrow = 12
       , orient = "d"
       , style = ""
       , m = 10
       ;


       function proc(selection) {

           selection.each(function (data) {

               // width = (width + 23);
               var a = d3.select(this).selectAll("svg").data([data])
               , b = d3.select(this).selectAll("div").data([data])
               , innerh = this.innerHTML
               , hpx = this.style.height
               , wpx = this.style.width
               , coll = Array.prototype.slice.call(this.children) //wandelt htmlCollection in Array
               , n = coll.length
               , aWidth = []
               , bWidth = []
               , aHeight = []
               , aclass = []
               , cclass = []
               , ccontent = []
               , ihtml = []
               ;
               //console.log(this.style);
               var desc = []
               , nwidth = [];

               //console.log("a", a[0].parentNode)

               coll.forEach(function (d) {
                   //console.log(d.innerHTML)
                   desc.push(d.innerHTML);
                   nwidth.push(d.getAttribute("width"));
                   aclass.push(d.getAttribute("class"));
                   cclass.push(d.getAttribute("circle-class"));
                   ccontent.push(d.getAttribute("circle-content"));

                   //console.log(cclass, ccontent)
               });
               //console.log(desc)
               //  px entfernen
               // console.log(typeof(hpx))
               if (hpx !== "") height = hpx.substr(0, hpx.length - 2);
               if (wpx !== "") width = wpx.substr(0, wpx.length - 2);
               //if (height == 0) height = hpx.substr(0, hpx.length - 2)
               //if (width == 0) width = wpx.substr(0, wpx.length - 2)
               this.innerHTML = "";

               if (n > 0) {
                   widthn = width / n;
                   heightn = height / n;
                   sum = 0;
                   aWidth.push(0);
                   coll.forEach(function (d, i) {
                       aWidth.push(sum + nwidth[i] * 1);
                       sum += +nwidth[i];
                       bWidth.push(nwidth[i]);

                       //aWidth.push(i * width / n);
                       aHeight.push(i * height / n);
                   });

               } else {
                   widthn = width;
                   heightn = height;
                   aWidth.push(0);
                   aHeight.push(0);
                   coll.push("");
               };


               switch (orient) {
                   case 'l':
                       aWidth.reverse();
                       coll.reverse();
                       break;

                   case 'r':
                       break;

                   case 'u':
                       aHeight.sort(function (a, b) { return b - a });
                       //coll.reverse()
                       break;

                   case 'd':
                       //                    aHeight.sort(function (a, b) { return b - a })
                       break;

               };


               // Otherwise, create the skeletal chart.
               var gEnter = a.enter().append("svg").attr("height", (height * 1 + 2) * 1).attr("width", (width * 1 + 2) * 1);
               var bEnter = b.enter().append("div");

               coll.forEach(function (d, i) {
                   if (i == 0) {
                       switch (orient) {
                           case 'l':
                               var q = gEnter.append("g").attr("transform", "translate(" + (aWidth[i]) + ")");
                               q.append("path").attr("d", "M 2 " + (height - 2) / 2 + "L " + arrow + " 2 L " + widthn + " 2 L " + widthn + " " + height + "L " + arrow + " " + height + "z");
                               style = "position:absolute; top:" + (m) + "px; left:" + (arrow + m) + "px; width:" + (widthn - 2 * m - arrow) + "px; height:" + (height - m) + "px;";
                               break;
                           case 'u':
                               var q = gEnter.append("g").attr("transform", "translate(0," + (aHeight[i]) + ")");
                               q.append("path").attr("d", "M 2 " + arrow + " L 2 " + heightn + " L " + width + " " + heightn + " L " + width + " " + arrow + " L " + ((width - 2) / 2) + " 2 z");
                               style = "position:absolute; top:" + (m + aHeight[i]) + "px; left:" + (m) + "px; width:" + (width - 2 * m) + "px; height:" + (heightn - m) + "px;";
                               break;
                           case 'r':
                               //console.log(aWidth)
                               var q = gEnter.append("g").attr("transform", "translate(" + (aWidth[i]) + ")");
                               q.append("path").attr("d", "M 2 2 L" + (bWidth[i] - arrow) + " 2L" + (bWidth[i]) + " " + (height - 2) / 2 + "L" + (bWidth[i] - arrow) + " " + height + "L2 " + height + "z")//.attr("stroke", "blue").attr("stroke-widthn", 5).attr("fill", "none")
                              .attr("class", aclass[i]);
                               style = "position:absolute; top:" + (m) + "px; left:" + m + "px; width:" + (bWidth[i] - 2 * m - arrow) + "px; height:" + (height - m) + "px;";
                               cstyle = "position:absolute; top:" + (m - 30) + "px; left:" + (m - 30) + "px;";


                               break;

                           case 'd':
                               var q = gEnter.append("g").attr("transform", "translate(0," + (aHeight[i]) + ")");
                               q.append("path").attr("d", "M 2 2 L" + width + " 2L" + width + " " + (heightn - arrow) + "L" + (width - 2) / 2 + " " + heightn + "L2 " + (heightn - arrow) + "z");
                               style = "position:absolute; top:" + (m + arrow) + "px; left:" + (m) + "px; width:" + (width - 2 * m) + "px; height:" + (heightn - m) + "px;";
                               break;
                           case 'speak_down':
                               var q = gEnter.append("g").attr("transform", "translate(0," + (aHeight[i]) + ")");
                               q.append("path").attr("d", "M 2 2 L" + width + " 2L" + width + " " + (heightn - arrow) + "L" + (15) + " " + (heightn - arrow) + "L2 " + (heightn) + "z");
                               style = "position:absolute; top:" + (m) + "px; left:" + (m) + "px; width:" + (width - 2 * m) + "px; height:" + (heightn - m - arrow) + "px;";
                               break;

                           case 'speak_up':
                               var q = gEnter.append("g").attr("transform", "translate(0," + (aHeight[i]) + ")");
                               q.append("path").attr("d", "M 2 " + arrow + "L" + (width - 15) + " " + arrow + "L" + width + " 2 L" + width + " " + (heightn) + "L2 " + (heightn) + "z");
                               style = "position:absolute; top:" + (m + arrow) + "px; left:" + (m) + "px; width:" + (width - 2 * m) + "px; height:" + (heightn - m) + "px;";
                               break;


                       };


                       d3.select(a[0].parentNode).append("div").attr("style", style).html(desc[i]);
                       if (ccontent[i] !== "" && ccontent[i] != null) {
                           d3.select(a[0].parentNode).append("div").attr("style", cstyle).attr("class", "circle " + cclass[i])
                           	                .html(ccontent[i]);
                       };





                   } else {
                       //  var q = gEnter.append("g").attr("transform", "translate(" + aWidth[i] + ")");
                       switch (orient) {
                           case 'l':
                               var q = gEnter.append("g").attr("transform", "translate(" + aWidth[i] + ")");
                               q.append("path").attr("d", "M " + (arrow) + " 2L" + (widthn) + " 2 L" + (widthn - arrow) + " " + (height - 2) / 2 + "L" + widthn + " " + height + "L " + arrow + " " + height + "L2 " + (height - 2) / 2 + " z");//.attr("stroke", "blue").attr("stroke-width", 5).attr("fill", "none")
                               style = "position:absolute; top:" + (m) + "px; left:" + (m + widthn + (i - 1) * widthn + arrow) + "px; width:" + (widthn - 2 * m - 1.5 * arrow) + "px; height:" + (height - m) + "px;";
                               break;
                           case 'r':
                               // console.log(aWidth)
                               var q = gEnter.append("g").attr("transform", "translate(" + aWidth[i] + ")");
                               q.append("path").attr("d", "M 2 2 L" + (bWidth[i] - arrow) + " 2L" + (bWidth[i]) + " " + (height - 2) / 2 + "L" + (bWidth[i] - arrow) + " " + height + "L2 " + height + "L" + arrow + " " + (height - 2) / 2 + " z")//.attr("stroke", "blue").attr("stroke-bWidth[i]", 5).attr("fill", "none");
                               .attr("class", aclass[i]);
                               style = "position:absolute; top:" + (m) + "px; left:" + (m + aWidth[i] * 1 + arrow) + "px; width:" + (bWidth[i] * 1 - 2 * m - 1.5 * arrow) + "px; height:" + (height - m) + "px;";
                               cstyle = "position:absolute; top:" + (m - 30) + "px; left:" + (m - 30 + aWidth[i] * 1 + arrow) + "px;";

                               break;

                           case 'u':
                               var q = gEnter.append("g").attr("transform", "translate(0," + (aHeight[i]) + ")");
                               q.append("path").attr("d", "M 2 " + arrow + " L 2 " + heightn + " L " + (width - 2) / 2 + " " + (heightn - arrow) + "L " + (width) + " " + heightn + " L " + width + " " + arrow + " L " + ((width - 2) / 2) + " 2 z");
                               style = "position:absolute; top:" + (aHeight[i] + m + arrow) + "px; left:" + (m) + "px; width:" + (width - 2 * m) + "px; height:" + (heightn - m) + "px;";
                               break;

                           case 'd':
                               var q = gEnter.append("g").attr("transform", "translate(0," + (aHeight[i]) + ")");
                               q.append("path").attr("d", "M 2 2" + "L" + (width - 2) / 2 + " " + arrow + " L" + width + " 2L" + width + " " + (heightn - arrow) + "L" + (width - 2) / 2 + " " + heightn + "L2 " + (heightn - arrow) + "z");
                               style = "position:absolute; top:" + (aHeight[i] + m + arrow) + "px; left:" + (m) + "px; width:" + (width - 2 * m) + "px; height:" + (heightn - m) + "px;";
                               break;

                           case 'speak_down':

                               break;
                       };



                       d3.select(a[0].parentNode).append("div").attr("style", style).html(desc[i]);
                       if (ccontent[i] !== "" && ccontent[i] != null) {
                           d3.select(a[0].parentNode).append("div").attr("style", cstyle).attr("class", "circle " + cclass[i])
                           	                .html(ccontent[i]);
                       };


                   };

               });
           });

           return proc;
       }


       proc.width = function (_) {
           if (!arguments.length) return width;
           width = _;
           return proc;
       };

       proc.height = function (_) {
           if (!arguments.length) return height;
           height = _;
           return proc;
       };

       proc.arrow = function (_) {
           if (!arguments.length) return arrow;
           arrow = _;
           return proc;
       };

       proc.orient = function (_) {
           if (!arguments.length) return orient;
           orient = _;
           return proc;
       };

       return proc;
   };


    //--------------------------------------------------------------------------------
    //DB zeichnet eine Datenbank (2-Ellipsen und Mantel)
    //--------------------------------------------------------------------------------

   DERGraphs.database = function () {
       var width = 200
       , height = 100
       , style = ""
       , m = 10
       ;


       function db(selection) {

           selection.each(function (data) {
               width = (width + 23);
               var a = d3.select(this).selectAll("svg").data([data])
               , innerh = this.innerHTML
               , hpx = this.style.height
               , wpx = this.style.width
               , m = 5
               ;
               this.innerHTML = "";

               //  px entfernen
               height = hpx.substr(0, hpx.length - 2);
               width = wpx.substr(0, wpx.length - 2);

               // Otherwise, create the skeletal chart.
               var gEnter = a.enter().append("svg").attr("height", (height * 1 + 2)).attr("width", (width * 1 + 2)).append("g");

               var  rx = width/2*1-2
                , ry = (3 / 4 * height) / 4 * 1
                , cx = width/2
                , cy = height - ry
                , ry2 = ry*0.5
                , h = height - (ry2 + ry) - 2
                , md = "";

                
               //md =  md + " M" + (cx - rx) + " " + cy + "C" + (cx - rx) + "," + (cy) + " " + (cx - rx) + "," + (cy - ry) + " " + cx + "," + (cy - ry)
               //md = md + " M " + cx + "," + (cy - ry) + " C " + cx + "," + (cy - ry) +  " " + (cx + rx) + "," + (cy - ry) + " " + (cx+rx) + "," + (cy)
                md = md + " M" + (cx + rx) + "," + cy + "C" + (cx + rx) + "," + (cy) + " " + (cx + rx) + "," + (cy + ry) + " " + cx + "," + (cy + ry);
                md = md + " C " + cx + "," + (cy + ry) + " " + (cx - rx) + "," + (cy + ry) + " " + (cx - rx) + "," + (cy);
                md = md + "L" + (cx - rx) + " " + (cy - h);
                md =md + "C" + (cx - rx) + "," + (cy - h) + " " + (cx-rx) + "," + (cy + ry2 - h) + " " + cx + "," + (cy + ry2 - h);
                md = md + " C " + (cx) + "," + (cy +ry2 - h) + " " + (cx + rx) + "," + (cy + ry2 - h) + " " + (cx + rx) + "," + (cy - h);
                md = md + " L" + (cx + rx) + " " + (cy - h) + " z"
               ;
              a.append("path").attr("d", md);
              a.append("ellipse").attr("rx", rx).attr("ry", ry2).attr("cx", cx).attr("cy", (cy - h));

               //Beschriftung
              style = "position:absolute; top:" + ((ry) + 5) + "px; left:" + (m + 18) + "px; width:" + (width - 22) + "px; height:" + (h- 5) + "px;";
              var newdiv = d3.select(this).append("div").attr("style", style);
              newdiv[0][0].innerHTML = innerh;


           });

           return db;
       }


       db.width = function (_) {
           if (!arguments.length) return width;
           width = _;
           return db;
       };

       db.height = function (_) {
           if (!arguments.length) return height;
           height = _;
           return db;
       };

   

       return db;
   };



    //--------------------------------------------------------------------------------
    //Pie-Chart
    //--------------------------------------------------------------------------------


   DERGraphs.Pie_Chart = function () {
       var width = 180
       , height = 180
       , initialAngle = -90   
       , color = d3.scale.category20()
       , donut = d3.layout.pie()
       ;


       function pie(selection) {
           var r = Math.min(width * 0.5, height * 0.5) / 2
               , labelr = r + 0.1 * r // radius for label anchor
               , arc = d3.svg.arc().innerRadius(r * .55).outerRadius(r)
               ; 
           selection.each(function (data) {

              
              donut.sort(null).startAngle(-initialAngle / 180 * Math.PI)
                   .endAngle((Math.PI * 2 - initialAngle / 180 * Math.PI));

               var s = d3.select(this).selectAll("svg").data([data]);
               // Otherwise, create the skeletal chart.
               var gEnter = s.enter().append("svg")
                   .attr("width", width)
                   .attr("height", height)
                   .append("g");

              // console.log(data)
               var arcs = gEnter.selectAll("g.arc")
                   .data(donut.value(function (d) { return d.mval; }))
                   .enter()
                   .append("svg:g")
                   .attr("class", "arc")
                   .attr("transform", "translate(" + (r + (0.2 * width)) + "," + (r + 0.1 * height) + ")"); //rotate(90) scale(-1, -1)"
              // console.log(arc);
               arcs.append("svg:path")
                   .attr("fill", function (d, i) {  return color(i); })
                   .attr("d", arc)
                   .attr("style","stroke:white");

               arcs.append("svg:text")
                .attr("transform", function (d) {
                    var c = arc.centroid(d),
                        x = c[0],
                        y = c[1],
                        // pythagorean theorem for hypotenuse
                        h = Math.sqrt(x * x + y * y);
                    return "translate(" + (x / h * labelr) + ',' +
                       (y / h * labelr) + ")";
                })
                   .attr("dy", ".30em")
               .attr("text-anchor", function (d) {
                   // are we past the center?
                  // console.log(d.data.Bez);
                   var a = (d.endAngle + d.startAngle) / 2;
                   var end = (d.endAngle);
                   var start = (d.startAngle);
                   var c = a > Math.PI ?
                       "end" : "start";

                   if (a>2*Math.PI) a = a-2*Math.PI;
                   
                   // console.log(start);
                   // console.log(end);
                   // console.log(a);
                   // console.log(c);
                   
                   return a > Math.PI ?
                       "end" : "start";
               })
               .text(function (d, i) { return d.data.Bez + " " + Math.round(d.value.toFixed(3)*1000)/10 + "%"; });
           });
           return pie;
       };


       pie.width = function (_) {
           if (!arguments.length) return width;
           width = _;
           return pie;
       };

       pie.height = function (_) {
           if (!arguments.length) return height;
           height = _;
           return pie;
       };

    return pie;

   };

//Tooltip M. Bostock
//--------------------

DERGraphs.tooltip = function(){
        var tooltipDiv;
        var bodyNode = d3.select('body').node();
        var attrs = {};
        var text = '';
        var styles = {};

        function tooltip(selection){

            selection.on('mouseover.tooltip', function(pD, pI){
                var name, value;
                // Clean up lost tooltips
                d3.select('body').selectAll('div.tooltip').remove();
                // Append tooltip
                tooltipDiv = d3.select('body').append('div');
                tooltipDiv.attr(attrs);
                tooltipDiv.style(styles);
                var absoluteMousePos = d3.mouse(bodyNode);
                tooltipDiv.style({
                    left: (absoluteMousePos[0] +$(bodyNode).offset().left)+'px', //+10
                    top: (absoluteMousePos[1]+$(bodyNode).offset().left)+'px', //-15
                    //position: 'absolute',
                    'z-index': 1001
                });
                // Add text using the accessor function, Crop text arbitrarily
                tooltipDiv.style('width', function(d, i){ return (text(pD, pI).length > 80) ? '300px' : null; })
                    .html(function(d, i){return text(pD, pI);});
            })
            .on('mousemove.tooltip', function(pD, pI){
                // Move tooltip
                var absoluteMousePos = d3.mouse(bodyNode);
                // console.log(bodyNode.offsetLeft, bodyNode.offsetTop)
                // console.log($(bodyNode).offset().left)
                // console.log($(bodyNode).offset().top)
                tooltipDiv.style({
                    left: (absoluteMousePos[0] +$(bodyNode).offset().left)+'px',
                    top: (absoluteMousePos[1] + $(bodyNode).offset().top)+'px'
                });
                // Keep updating the text, it could change according to position
                tooltipDiv.html(function(d, i){ return text(pD, pI); });
            })
            .on('mouseout.tooltip', function(pD, pI){
                // Remove tooltip
                tooltipDiv.remove();
            });

        }

        tooltip.attr = function(_x){
            if (!arguments.length) return attrs;
            attrs = _x;
            return this;
        };

        tooltip.style = function(_x){
            if (!arguments.length) return styles;
            styles = _x;
            return this;
        };

        tooltip.text = function(_x){
            if (!arguments.length) return text;
            text = d3.functor(_x);
            return this;
        };

        return tooltip;
    };


DERGraphs.table = function () {
    var mclass = "mclass";
    function table(selection) {
       
        selection.each(function (data) {

            d3.select(this).append("table").attr("class", mclass)
                .selectAll("tr")
                .data(data)
                .enter().append("tr")

                .selectAll("td")
                .data(function (d) { return d3.values(d); })
                .enter().append("td")
                //.on("mouseover", function () { d3.select(this).style("background-color", "aliceblue") })
                //.on("mouseout", function () { d3.select(this).style("background-color", "white") })
                .html(function (d) { return d; });

           
           
        });
        return table;
    };


    table.mclass = function (_) {
        if (!arguments.length) return mclass;
        mclass = _;
        return table;
    };

    table.height = function (_) {
        if (!arguments.length) return height;
        height = _;
        return table;
    };

    return table;



};

DERGraphs.arrowpath = function  () {

       function aup(selection) {

           selection.each(function (data) {
               var a = d3.select(this).selectAll("svg").data([data])
               , hpx = this.style.height
               , wpx = this.style.width
               , d = this.getAttribute("Path")
               , start = this.getAttribute("start")
               , end = this.getAttribute("end")
               ;
               //console.log(d)

               //  px entfernen
               height = hpx.substr(0, hpx.length - 2);
               width = wpx.substr(0, wpx.length - 2);    
               
               // Otherwise, create the skeletal chart.
               var gEnter = a.enter().append("svg").attr("height", (parseInt(height) + 2)).attr("width", (parseInt(width) + 2));
                   
                   var markers = [
                   {id:"end", path:"M 0 0 L 10 5 L 0 10 z", refX:0, refY:5},
                   {id:"start", path:"M 0 5 L 10 10 L 10 0 z", refX:10, refY:5}
                   ];
                   
                   markers[0].id = "end" + Math.floor(Math.random() * 10001);
                   markers[1].id = "start" + Math.floor(Math.random() * 10001);

      				var m = gEnter.append("svg:defs")
      				        .selectAll("marker")
						    .data(markers)
						    .enter().append("svg:marker")
						    .attr("id", function(d){return d.id})
						    .attr("class", "arrow")
						    .attr("viewBox", "-10 -10 25 25")
						    .attr("refX", function(d){return d.refX})
						    .attr("refY", function(d){return d.refY})
						    .attr("markerUnits","stroke-width")
						    .attr("markerWidth", 6)
						    .attr("markerHeight", 6)
						    .attr("orient", "auto");
						    
						    m.append("svg:path")
						    .attr("d", function(d){return d.path;})
						    .attr("stroke-width",1)					    
						    ;

					 var p = gEnter.append("path").attr("d", d)	
					        .attr("fill", "none");     
					         if (end == 1) p.attr("marker-end", 'url(#' + markers[0].id + ')');
					         if (start == 1) p.attr("marker-start", 'url(#' + markers[1].id + ')');
							      
           });

           return aup;
       }
       
       return aup;
   };	

/**
 * Author: Urs Derendinger
 * Date: December 2014
 * Remarks: returns all children of parent in parent/child list (including parent!)
 *          getAllChildren(data,80)
 *          id	pid	    Bezeichner	
 *          --------------------------------------
 *          0	3000	Steuerpflichtige
 *			7	0		Erwerbsart
 *			8	7		Unselbstständigerwerbende
 *			9	7		Selbstständigerwerbende
 * **********************************************************************************
 * 
 * @param {?} data
 * @param {?} pid
 * @return {?}
 */

DERGraphs.getAllChildren = function(pid) {
  /**
   * @param {(Array|string)} obj
   * @param {number} p
   * @return {Array}
   */
  function getNestedChildren2(obj, p) {
    /** @type {Array} */
    var out = [];
    obj.forEach(function(d) {
      if (d.pid == p) {
        var children = getNestedChildren2(obj, d.id);
        if (children.length) {
          d.children = children;
        }
        allChildren.push(d.id);
        out.push(d);
      }
    });
    return out;
  }
  /**
   * @return {?}
   */
  function Elements(pid) {
  	allChildren = [];
    getNestedChildren2(data, pid);
    allChildren.push(pid);
    return allChildren;
  }
  /**
   * @param {Array} _
   * @return {?}
   */
  Elements.data = function(_) {
    if (!arguments.length) {
      return data;
    }
    /** @type {Array} */
    data = _;
    return Elements;
  };
  /**
   * @param {number} _
   * @return {?}
   */
  Elements.pid = function(_) {
    if (!arguments.length) {
      return pid;
    }
    /** @type {number} */
    pid = _;
    console.log(pid);
    return Elements;
  };
  
 /*
  Elements.contains = function(pid, d){
  	allChildren = [];
    getNestedChildren2(data, pid);
    allChildren.push(pid);
    
	function contains(a, obj) {
		    for (var i = 0; i < a.length; i++) {
		        if (a[i] === obj) {
		            return true;
		        }
		    }
		    return false;
	 }
	 console.log("allchildren", allChildren);
    return contains(allChildren, d);	
  };
*/ 
  
  /** @type {Array} */
  data = [];
  /** @type {number} */
  pid = 0;
  /** @type {Array} */
  var allChildren = [];
  return Elements;
};


//Hilfsfunktion addiert Tage zu bestimmten Datum
DERGraphs.addDays = function(date, days) {
				return new Date(date.getTime() + 864e5 * days);
		};


DERGraphs.spinner = function() {
	
	var r_inner = .8
	, r_outer = 1
	, width = 300
	, height = 300
	, duration = 2500
	;
	
  function spinning(selection) {
    var radius = Math.min(width, height) / 2;
    var tau = 2 * Math.PI;

    var arc = d3.svg.arc()
            .innerRadius(radius*r_inner)
            .outerRadius(radius*r_outer)
            .startAngle(0);

    var arc2 = d3.svg.arc()
            .innerRadius(radius*r_inner*0.7)
            .outerRadius(radius*r_outer*0.7)
            .startAngle(1);


    var svg = selection.append("svg")
      //  .attr("id", config.id)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

    var background = svg.append("path")
            .datum({endAngle: 0.33*tau})
            .style("fill", "#4D4D4D")
            .attr("d", arc)
            .call(spin, duration);
            
     var background2 = svg.append("path")
            .datum({endAngle: 0.63*tau})
            .style("fill", "#4D4D4D")
            .attr("d", arc2)
            .call(spin, duration/3);
                   

    function spin(selection, duration) {
        selection.transition()
            .ease("linear")
            .duration(duration)
            .attrTween("transform", function() {
                return d3.interpolateString("rotate(0)", "rotate(360)");
            });
        setTimeout(function() { spin(selection, duration); }, duration);   
    };

		return spinning;
  };
  
  spinning.width = function(_) {
			if (!arguments.length)
				return width;
			width = _;
			return spinning;
		};		
  
  
  spinning.height = function(_) {
			if (!arguments.length)
				return height;
			height = _;
			return spinning;
		};	
  
  spinning.duration = function(_) {
			if (!arguments.length)
				return duration;
			duration = _;
			return spinning;
		};	
  
  return spinning;
};


})();




