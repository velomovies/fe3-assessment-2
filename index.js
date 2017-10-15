//This code is based on https://bl.ocks.org/alandunning/4c36eb1abdb248de34c64f5672afd857 by Alan Dunning. I created my own version of it and added some code.

//Set a width and height for the whole graph. This is later used to caclulate exact attributes
var width = 600,
  height = 600

// Configuration for the Radar chart
var config = {
  w: width,
  h: height,
  maxValue: 100,
  levels: 2,
  ExtraWidthX: 500
}

//Different countries by name
var countryNames = {
  E_IACCPC_ENT10_C10_18AT: "Austria",
  E_IACCPC_ENT10_C10_18BE: "Belgium",
  E_IACCPC_ENT10_C10_18BG: "Bulgaria",
  E_IACCPC_ENT10_C10_18CY: "Cyprus",
  E_IACCPC_ENT10_C10_18CZ: "Czech Republic",
  E_IACCPC_ENT10_C10_18DE: "Germany",
  E_IACCPC_ENT10_C10_18DK: "Denmark",
  E_IACCPC_ENT10_C10_18EA: "Euro area",
  E_IACCPC_ENT10_C10_18EE: "Estonia",
  E_IACCPC_ENT10_C10_18EL: "Greece	",
  E_IACCPC_ENT10_C10_18ES: "Spain",
  E_IACCPC_ENT10_C10_18EU15: "European Union (15 countries)",
  E_IACCPC_ENT10_C10_18EU25: "European Union (25 countries)",
  E_IACCPC_ENT10_C10_18EU27: "European Union (27 countries)",
  E_IACCPC_ENT10_C10_18EU28: "European Union (28 countries)",
  E_IACCPC_ENT10_C10_18FI: "Finland",
  E_IACCPC_ENT10_C10_18FR: "France",
  E_IACCPC_ENT10_C10_18HR: "Croatia",
  E_IACCPC_ENT10_C10_18HU: "Hungary",
  E_IACCPC_ENT10_C10_18IE: "Ireland",
  E_IACCPC_ENT10_C10_18IS: "Iceland",
  E_IACCPC_ENT10_C10_18IT: "Italy",
  E_IACCPC_ENT10_C10_18LT: "Lithuania",
  E_IACCPC_ENT10_C10_18LU: "Luxembourg",
  E_IACCPC_ENT10_C10_18LV: "Latvia",
  E_IACCPC_ENT10_C10_18MK: "Macedonia",
  E_IACCPC_ENT10_C10_18MT: "Malta",
  E_IACCPC_ENT10_C10_18NL: "Netherlands",
  E_IACCPC_ENT10_C10_18NO: "Norway",
  E_IACCPC_ENT10_C10_18PL: "Poland",
  E_IACCPC_ENT10_C10_18PT: "Portugal",
  E_IACCPC_ENT10_C10_18RO: "Romania",
  E_IACCPC_ENT10_C10_18RS: "Serbia",
  E_IACCPC_ENT10_C10_18SE: "Sweden",
  E_IACCPC_ENT10_C10_18SI: "Slovenia",
  E_IACCPC_ENT10_C10_18SK: "Slovakia",
  E_IACCPC_ENT10_C10_18TR: "Turkey",
  E_IACCPC_ENT10_C10_18UK: "United Kingdom",
}

//Load in the indext.tsv as a text file so it can be used to clean the data. It starts with a really dirty dataset.
d3.text("index.tsv")
  .get(onload)

function onload(err, doc) {
  if (err) throw err

//Start the clean up. This is based on the code from the cleaning example.
  var header = doc.indexOf("indic_is,unit,sizen_r2,")
  doc = doc.slice(header)
  end = doc.indexOf("\n", doc)
  doc = doc.slice(end).trim()
  doc = doc.replace(/,+/g, "").replace(/ 	+/g, ",").replace(/	+/g, ",").replace(/ +/g, "").replace(/ +/g, "").replace(/:/g, "").replace(/u+/g, "")
  start = doc.indexOf("E_")
  end = doc.indexOf("33") - 19
  doc = doc.substring(start, end).trim()
  data = d3.csvParseRows(doc, map)

//After you parse the rows it checks if it has data. When there is no data it will not show anything. Next to that it gives all the data a usefull name.
  function map(d, i) {
    if (d[1] == "" || d[2] == "" || d[3] == "" || d[4] == "" || d[5] == "" || d[6] == "" || d[7] == "" || d[8] == "") {
      return
    }
    return {
      country: countryNames[d[0]],
      y2016: Number(d[1]),
      y2015: Number(d[2]),
      y2014: Number(d[3]),
      y2013: Number(d[4]),
      y2012: Number(d[5]),
      y2011: Number(d[6]),
      y2010: Number(d[7]),
      y2009: Number(d[8])
    }
  }

//When the data is cleaned I push it to a array so it can be used as raw data in the chart.
//Next to that it will draw the Radar-chart with the dataset and configuration done earlier.
  dataset.push(data)
  RadarChart.draw("#chart", dataset, config)
}

//Variable that is used for the cleaned data.
var dataset = []

//SVG is used to append a svg on. This is the base of the chart and will be used in later stages to append more things
var svg = d3.select("body")
  .selectAll("svg")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

//This is a object that holds all information about the chart itself. It sets all kind of factors. It is easy to make a small change to the size for example.
var RadarChart = {
  draw: function(id, d, options) {
    var cfg = {
      radius: 5,
      w: 600,
      h: 600,
      factor: 1,
      factorLegend: .85,
      levels: 3,
      maxValue: 0,
      radians: 2 * Math.PI,
      opacityArea: 0.5,
      ToRight: 5,
      TranslateX: 140,
      TranslateY: 50,
      ExtraWidthX: 100,
      ExtraWidthY: 100,
      color: d3.scaleOrdinal().range(["#6F257F", "#CA0D59"])
    }

//This cleans more code. It sets the % in the chart to a rounded number
    if ("undefined" !== typeof options) {
      for (var i in options) {
        if ("undefined" !== typeof options[i]) {
          cfg[i] = options[i]
        }
      }
    }

//cfg is the configuration of the chart and here you set an maxValue. When you make this bigger it will make the scale of the chart bigger
    cfg.maxValue = 100

//In this block you append the name of the country to the axis around the circle.
    var allAxis = (d[0].map(function(i, j) {
      return i.country
    }))
//Here are some calculations to show the circle in good order. Like making setting a radius and the total amount of axis it had to use. (Based on the amount of countries in this case)
    var total = allAxis.length
    var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2)
    var Format = d3.format("%")
//This will delete any svg's that are already in the document and are not in use
    d3.select(id).select("svg").remove()

//Here you append a svg to the document (A div with id #chart) and get some attribues that will later be used in calculations. And to set up the basic dimmensions of the chart.
    var g = d3.select(id)
      .append("svg")
      .attr("width", cfg.w + cfg.ExtraWidthX)
      .attr("height", cfg.h + cfg.ExtraWidthY)
      .append("g")
      .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")")

//Select the selection box in the HTML and check if there is an update. This is used to see if there is a update to the selection. If there is it will update the chart so it shows the new information.
      var sel = document.getElementById("yearSelect");
      var dropSelect = d3.select("select")
      dropSelect.on("change", selectUpdate)

//This function updates the chart. It will be activated when there is a click on the selection tool.
      function selectUpdate(){

// It starts two forEach loops to update the chart.
        d.forEach(dataPolygonUpdate)
        d.forEach(dataTooltipUpdate)

//The first function that starts will change the polygon that is used to show the data. It is stored in an array: dataValues.
        function dataPolygonUpdate(y, x, d) {
          dataValues = []

//Here is a check what the actual selected value of the selected item.
          var year = function(k) {
            for(var i in k) { if(sel.value == i) {
              return k[i]}}
          };

//The data of the select is used here for a complicated calculation to set a path for the polygon. It is pushed in an array and used to set the actual path
          g.selectAll(".nodes")
            .data(y, function(j, i) {
              dataValues.push([
                cfg.w / 2 * (1 - (parseFloat(Math.max(year(j), 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                cfg.h / 2 * (1 - (parseFloat(Math.max(year(j), 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
              ])
            })

//The data calculated above is used. The actual polygon will be updated and with a little transition it gives life to the chart.
          g.selectAll(".area")
            .data([dataValues])
            .enter()
            .select("polygon")
            .attr("class", "radar-chart-serie" + 0).transition().duration(2000).ease(d3.easeElastic)
            .style("stroke-width", "2px")
            .style("stroke", cfg.color(1))
            .attr("points", function(d) {
              var str = ""
              for (var pti = 0; pti < d.length; pti++) {
                str = str + d[pti][0] + "," + d[pti][1] + " "
              }
              return str
            })
        }

//Here it will update all tooptips for all points in the chart.
        function dataTooltipUpdate(y, x) {

//Here it checks again what the actual selected value of the selected item. This time two different functions because the data that is put true is different.
          var year = function(k) {
            for(var i in k) { if(sel.value == i) {
              return k[i]}}
          };
          var yeard = function(d) {
            for(var i in d) { if(sel.value == i) {
              return d[i]}}
          };

//It updates the data and the circle will get a few attributes (same as above) to calculate the exact position. It also gives a styling to the circles.
          var circles = g.selectAll(".nodes")
            .data(y).enter()
            .selectAll("circle")

//I give a little transition to the circle and set attributes. The attributes are calculated with a difficult calculation to set the position.
            circles.transition().duration(2000).ease(d3.easeElastic).attr("class", "radar-chart-serie" + 0)
            .attr("r", cfg.radius)
            .attr("alt", function(j) {
              return Math.max(year(j), 0)
            })
            .attr("cx", function(j, i) {
              dataValues.push([
                cfg.w / 2 * (1 - (parseFloat(Math.max(year(j), 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                cfg.h / 2 * (1 - (parseFloat(Math.max(year(j), 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
              ])
              return cfg.w / 2 * (1 - (Math.max(year(j), 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total))
            })
            .attr("cy", function(j, i) {
              return cfg.h / 2 * (1 - (Math.max(year(j), 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
            })
            .attr("data-id", function(j) {
              return j.country
            })

//Next to the position you set a style for the different circles
            .style("fill", "#fff")
            .style("stroke-width", "2px")
            .style("stroke", cfg.color(0)).style("fill-opacity", .9)

//The on event checks if the circle is clicked. It shows a tooltip with exact information of that point. With mouseout it removes the tooltip again.
            circles.on("click", function(d) {
              tooltip
                .style("left", d3.event.pageX - 40 + "px")
                .style("top", d3.event.pageY - 80 + "px")
                .style("display", "inline-block")
                .html((d.country) + "<br><span>" + (yeard(d)) + "%</span>")
            })
            .on("mouseout", function(d) {
              tooltip.style("display", "none")
            })
        }
      }
//End of the update of the chart. Below is the setup of the chart that will be used when it is loaded in in the first place.

//Circular segments are calculated and put in the chart. This is the whole circle of the chart and the circles inside of it. Next to setting the circle it gives a style to the elements.
    for (var j = 0; j < cfg.levels; j++) {

//The data from cfg is used to calculate the location and amount of circles
      var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels)
      g.selectAll(".levels")
        .data(allAxis)
        .enter()
        .append("svg:line")
        .attr("x1", function(d, i) {
          return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total))
        })
        .attr("y1", function(d, i) {
          return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total))
        })
        .attr("x2", function(d, i) {
          return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total))
        })
        .attr("y2", function(d, i) {
          return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total))
        })

//When the circles are set they get a style to them
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-opacity", "0.75")
        .style("stroke-width", "0.3px")
        .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")")
    }

    //Text indicating at what % each level is. Again calculated with information out the cfg object.
    for (var j = 0; j < cfg.levels; j++) {
      var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels)
      g.selectAll(".levels")
        .data([1]) //dummy data
        .enter()
        .append("svg:text")
        .attr("x", function(d) {
          return levelFactor * (1 - cfg.factor * Math.sin(0))
        })
        .attr("y", function(d) {
          return levelFactor * (1 - cfg.factor * Math.cos(0))
        })

//After the location is calculated the style is used to show the amount of "%" in the circle
        .attr("class", "legend")
        .style("font-family", "Questrial, sans-serif")
        .style("font-size", "12px")
        .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
        .attr("fill", "#737373")
        .text((j + 1) * 100 / cfg.levels)
    }

//This is the code to set up the axis with information. First it will use the data of allAxis (data with the names of the countries). It creates a "g" and gives it attributes
    var axis = g.selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis")

//It makes the different segments in the circle. This is already calculated but know you append all information to a line elemnt.
    axis.append("line")
      .attr("x1", cfg.w / 2)
      .attr("y1", cfg.h / 2)
      .attr("x2", function(d, i) {
        return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total))
      })
      .attr("y2", function(d, i) {
        return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total))
      }).transition()

//The style of the element is set here. It is easy to change from here.
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "1px")

//After the chart (without data) is shown it sets the text of the different countries in the HTML. The text is the name of country.
    axis.append("text")
      .attr("class", "legend")
      .text(function(d) {
        return d
      })
      .style("font-family", "Questrial, sans-serif")
      .style("font-size", "12px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("transform", function(d, i) {
        return "translate(0, -10)"
      })

//With a complicated calculation is calculated where the text element has to go in the chart
      .attr("x", function(d, i) {
        return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total)
      })
      .attr("y", function(d, i) {
        return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total)
      })

//Same as the update function but know it will be used to initially set the whole chart
    d.forEach(dataPolygon)

//The first function that starts will set the polygon that is used to show the data. It is stored in an array: dataValues.
    function dataPolygon(y, x, d) {
      dataValues = []
      g.selectAll(".nodes")

//The data used is set as hard code. Because the first data you will see is 2009 it only used that part of the data.
        .data(y, function(j, i) {
          dataValues.push([
            cfg.w / 2 * (1 - (parseFloat(Math.max(j.y2009, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
            cfg.h / 2 * (1 - (parseFloat(Math.max(j.y2009, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
          ])
        })

//When the calculations are done the data from the "dataValues" array is used to set an polygon. The difference between the update and this is that you append a polygon to the svg instead of selecting and updating an existing polygon.
      g.selectAll(".area")
        .data([dataValues])
        .enter()
        .append("polygon")
        .attr("class", "radar-chart-serie" + 0)
        .style("stroke-width", "2px")
        .style("stroke", cfg.color(0))
        .attr("points", function(d) {
          var str = ""
          for (var pti = 0; pti < d.length; pti++) {
            str = str + d[pti][0] + "," + d[pti][1] + " "
          }
          return str
        })
        .style("fill", function(j, i) {
          return cfg.color(0)
        })
        .style("fill-opacity", cfg.opacityArea)

//When you hover over the whole polygon it sets a little transition with an change of opacity so it changes color. This gives a bit of a dynamic feeling.
        .on("mouseover", function(d) {
          z = "polygon." + d3.select(this).attr("class")
          g.selectAll("polygon")
            .transition(200)
            .style("fill-opacity", 0.1)
          g.selectAll(z)
            .transition(200)
            .style("fill-opacity", .7)
        })
        .on("mouseout", function() {
          g.selectAll("polygon")
            .transition(200)
            .style("fill-opacity", cfg.opacityArea)
        })
    }

//Here is the tooltip created. From this moment you can use the "tooltip" variable to append, select and set attributes to them.
    var tooltip = d3.select("body").append("div").attr("class", "toolTip")

//As for the update it will run an forEach loop through all data to set information
    d.forEach(dataTooltip)

//It appends circles and sets the data. The circle will get a few attributes (same as above) to calculate the exact position. It also gives a styling to the circles.
    function dataTooltip(y, x) {
      g.selectAll(".nodes")
        .data(y).enter()
        .append("svg:circle")
        .attr("class", "radar-chart-serie" + 0)
        .attr("r", cfg.radius)

//Same as the "dataPolygon" function. Because you see at first instance the data from 2009 it uses only that data first.
        .attr("alt", function(j) {
          return Math.max(j.y2009, 0)
        })
        .attr("cx", function(j, i) {
          dataValues.push([
            cfg.w / 2 * (1 - (parseFloat(Math.max(j.y2009, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
            cfg.h / 2 * (1 - (parseFloat(Math.max(j.y2009, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
          ])
          return cfg.w / 2 * (1 - (Math.max(j.y2009, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total))
        })
        .attr("cy", function(j, i) {
          return cfg.h / 2 * (1 - (Math.max(j.y2009, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
        })
        .attr("data-id", function(j) {
          return j.country
        })

//After the position the style is defined.
        .style("fill", "#fff")
        .style("stroke-width", "2px")
        .style("stroke", cfg.color(0)).style("fill-opacity", .9)

//This on event is the same as the update. It shows the tooltip and exact information when clicked on an circle. It will remove itself when you mouseout
        .on("click", function(d) {
          tooltip
            .style("left", d3.event.pageX - 40 + "px")
            .style("top", d3.event.pageY - 80 + "px")
            .style("display", "inline-block")
            .html((d.country) + "<br><span>" + (d.y2009) + "%</span>")
        })
        .on("mouseout", function(d) {
          tooltip.style("display", "none")
        })
    }
  }
}
