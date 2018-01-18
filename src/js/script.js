(function(){

  var margin = {top: 0, right: 30, bottom: 20, left: 50},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

  // set misc vars
  var i = 0,
    duration = 1500,
    root;

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left)
    .attr("height", height + margin.top)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .append("g")
    .call(d3.behavior.zoom().on("zoom", function () {
        svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
      }));

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x];
     });


  d3.json("paypal-data/data/", function(error, treeData) {
      root = treeData[0];
      root.x0 = height/3;
      root.y0 = 200;
    console.log('ROOT IS: ', root);

      function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
      }
      root.children.forEach(collapse);
      update(root);
    });

  d3.select(self.frameElement).style("height", "1000px");

  function update(source) {
    console.log('source is: ', source);

      var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

      nodes.forEach(function(d) {
        d.y = d.depth * 250;
      });

      var node = svg.selectAll("g.node")
        .data(nodes, function(d) {
          return d.id || (d.id = ++i); // ??
        });

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
          .on("click", handleClick)
      .on('mouseover', function(d) {
        if (d.Data){
          div.transition()
             .duration(200)
             .style("opacity", .9);
          div .html(
            "Data: " + "<br/>" + d.Data + "<br/>" + "<br/>" +
            "Purpose: " + "<br/>" + d.Purpose + "<br/>"
            )
             .style("left", (d3.event.pageX + 20) + "px")
             .style("top", (d3.event.pageY + 10) + "px");
          }
        })
        .on("mouseout", function(d) {
          if (d.Data) {
            div.transition()
               .duration(500)
               .style("opacity", 0);
          }
        });

      nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#4286f4"; }); // fill circle blue if has kids

      nodeEnter.append("text")
        .attr("x", function(d) {
          return d.children || d._children ? -10 : 10;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        nodeUpdate.select("circle")
          .attr("r", 4.5)
          .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#4286f4"; });

      nodeUpdate.select("text")
          .style("fill-opacity", 1);

        var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .remove();

      nodeExit.select("circle")
          .attr("r", 1e-6);

      nodeExit.select("text")
          .style("fill-opacity", 1e-6);

        var link = svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });


    link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
        });

      link.transition()
          .duration(duration)
          .attr("d", diagonal);

      link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          })
        .remove();

    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
  }

  function handleClick(d) {
    console.log('inside click fxn');
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
  }

})();
