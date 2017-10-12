var width = 600,
  height = 600

// Config for the Radar chart
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

d3.text("index.tsv")
  .get(onload)

function onload(err, doc) {
  if (err) throw err

  var header = doc.indexOf("indic_is,unit,sizen_r2,")
  doc = doc.slice(header)
  end = doc.indexOf("\n", doc)
  doc = doc.slice(end).trim()
  doc = doc.replace(/,+/g, "").replace(/ 	+/g, ",").replace(/	+/g, ",").replace(/ +/g, "").replace(/ +/g, "").replace(/:/g, "").replace(/u+/g, "")
  start = doc.indexOf("E_")
  end = doc.indexOf("33") - 19
  doc = doc.substring(start, end).trim()
  data = d3.csvParseRows(doc, map)

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
  dataset.push(data)
  RadarChart.draw("#chart", dataset, config)
  console.log(data)
}

var dataset = []

var svg = d3.select("body")
  .selectAll("svg")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

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

    if ("undefined" !== typeof options) {
      for (var i in options) {
        if ("undefined" !== typeof options[i]) {
          cfg[i] = options[i]
        }
      }
    }

    cfg.maxValue = 100

    var allAxis = (d[0].map(function(i, j) {
      return i.country
    }))
    var total = allAxis.length
    var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2)
    var Format = d3.format("%")
    d3.select(id).select("svg").remove()

    var g = d3.select(id)
      .append("svg")
      .attr("width", cfg.w + cfg.ExtraWidthX)
      .attr("height", cfg.h + cfg.ExtraWidthY)
      .append("g")
      .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")")

      var sel = document.getElementById("yearSelect");
      var dropSelect = d3.select("select")
      dropSelect.on("click", selectUpdate)



      function selectUpdate(){
        d.forEach(dataPolygon)
        d.forEach(dataTooltip)


        function dataPolygon(y, x, d) {
          dataValues = []
          var year = function(k) {
            for(var i in k) { if(sel.value == i) {
              return k[i]}}
          };
          g.selectAll(".nodes")
            .data(y, function(j, i) {
              dataValues.push([
                cfg.w / 2 * (1 - (parseFloat(Math.max(year(j), 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                cfg.h / 2 * (1 - (parseFloat(Math.max(year(j), 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
              ])
            })

          g.selectAll(".area")
            .data([dataValues])
            .enter()
            .select("polygon")
            .attr("class", "radar-chart-serie" + series).transition().duration(2000).ease(d3.easeElastic)
            .style("stroke-width", "2px")
            .style("stroke", cfg.color(series))
            .attr("points", function(d) {
              var str = ""
              for (var pti = 0; pti < d.length; pti++) {
                str = str + d[pti][0] + "," + d[pti][1] + " "
              }
              return str
            })
          series++
        }

        function dataTooltip(y, x) {
          var year = function(k) {
            for(var i in k) { if(sel.value == i) {
              return k[i]}}
          };
          var yeard = function(d) {
            for(var i in d) { if(sel.value == i) {
              console.log(i)
              return d[i]}}
          };

          var circles = g.selectAll(".nodes")
            .data(y).enter()
            .selectAll("circle")

            circles.transition().duration(2000).ease(d3.easeElastic).attr("class", "radar-chart-serie" + series)
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
            .style("fill", "#fff")
            .style("stroke-width", "2px")
            .style("stroke", cfg.color(series)).style("fill-opacity", .9)


            circles.on("click", function(d) {
              tooltip
                .style("left", d3.event.pageX - 40 + "px")
                .style("top", d3.event.pageY - 80 + "px")
                .style("display", "inline-block")
                .html((d.country) + "<br><span>" + (yeard(d)) + "</span>")
            })
            .on("mouseout", function(d) {
              tooltip.style("display", "none")
            })

          series++
        }
      }

      var tooltip

    //Circular segments
    for (var j = 0; j < cfg.levels; j++) {
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
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-opacity", "0.75")
        .style("stroke-width", "0.3px")
        .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")")
    }

    //Text indicating at what % each level is
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
        .attr("class", "legend")
        .style("font-family", "Questrial, sans-serif")
        .style("font-size", "12px")
        .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
        .attr("fill", "#737373")
        .text((j + 1) * 100 / cfg.levels)
    }

    series = 0

    var axis = g.selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis")

    axis.append("line")
      .attr("x1", cfg.w / 2)
      .attr("y1", cfg.h / 2)
      .attr("x2", function(d, i) {
        return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total))
      })
      .attr("y2", function(d, i) {
        return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total))
      })
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "1px")

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
      .attr("x", function(d, i) {
        return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total)
      })
      .attr("y", function(d, i) {
        return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total)
      })


    d.forEach(dataPolygon)

    function dataPolygon(y, x, d) {
      dataValues = []
      g.selectAll(".nodes")
        .data(y, function(j, i) {
          dataValues.push([
            cfg.w / 2 * (1 - (parseFloat(Math.max(j.y2009, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
            cfg.h / 2 * (1 - (parseFloat(Math.max(j.y2009, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
          ])
        })

      g.selectAll(".area")
        .data([dataValues])
        .enter()
        .append("polygon")
        .attr("class", "radar-chart-serie" + series)
        .style("stroke-width", "2px")
        .style("stroke", cfg.color(series))
        .attr("points", function(d) {
          var str = ""
          for (var pti = 0; pti < d.length; pti++) {
            str = str + d[pti][0] + "," + d[pti][1] + " "
          }
          return str
        })
        .style("fill", function(j, i) {
          return cfg.color(series)
        })
        .style("fill-opacity", cfg.opacityArea)
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
      series++
    }
    series = 0


    var tooltip = d3.select("body").append("div").attr("class", "toolTip")

    d.forEach(dataTooltip)

    function dataTooltip(y, x) {
      g.selectAll(".nodes")
        .data(y).enter()
        .append("svg:circle")
        .attr("class", "radar-chart-serie" + series)
        .attr("r", cfg.radius)
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
        .style("fill", "#fff")
        .style("stroke-width", "2px")
        .style("stroke", cfg.color(series)).style("fill-opacity", .9)
        .on("click", function(d) {
          tooltip
            .style("left", d3.event.pageX - 40 + "px")
            .style("top", d3.event.pageY - 80 + "px")
            .style("display", "inline-block")
            .html((d.country) + "<br><span>" + (d.y2009) + "</span>")
        })
        .on("mouseout", function(d) {
          tooltip.style("display", "none")
        })

      series++
    }
  }
}
