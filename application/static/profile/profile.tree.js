// tree specific things
angular.module('beautystash.profileTree', [])
.controller('ProfileTreeController', function($scope, Products, Follow, Sites, $stateParams, Auth, ModalService) {
  // *****************  Tree Helpers  **********************
  // ***************** DATA PROCESSING AND TREE GENERATION ******************
  // build hash tables to get access to different properties insta 
  // get inputs in, dynamically build tree based on specified user inputs i.e. BRAND -> CATEGORY -> PRODUCT
  // or STATUS -> BRAND -> PRODUCT , or BRAND -> PRODUCT //product always last by default
  // so status is own tree
  // after tree is built, toggle all children off , except 
  // the default children accessor assumes each input data is an object with a children array
  // console.log('using this controller')
  var Tree = function(obj){
    this.value = obj.value || null;
    this.products = obj.products || []
    this.type = obj.type || null;
    this.children = [];
  }


  //return array of all specified properties and concat them
  var pluck = function(array,property){
    var properties = Array.prototype.slice.call(arguments,1)
    var res = [];
    array.forEach(function(object){
      var temp = [];
      properties.forEach(function(prop){
        res.push(temp.concat([object[prop]]))
      })
    })
    return res;
  }
  //helper for grouping together an array of products based on a property 
  var groupByProperty = function(array,property){
    var store ={};
    array.forEach(function(product){
      var value = product[property]
      if (store[value] === undefined){
        store[value] = [product]
      } else {
        store[value].push(product);
      }
    })
    var resArr = [];
    for (var value in store){
      resArr.push({value:value,type:property,products:store[value]})
    }
    //resArr contain an array of objects, with value i.e. brand_name and children and array of products that have that value
    return resArr;
  }

  var populateTree = function(config,tree,index){
    index = index || 0;
    //base case, done iterating
    if (index > config.length -1) {
      //we are at end, append nodes by product_name
      for (var i = 0; i < tree.products.length; i++) {
        var product = tree.products[i]
        var newTree = new Tree({type:'product_name',value:product.product_name,products:[product]})
        tree.children.push(newTree)
      };
      return;
    }
    var property = config[index];
    //get array of objects grouped by their property value i.e. brand_names, statuses
    var resArr = groupByProperty(tree.products,property);
    //iterate over array and push each object keyed by property to tree children
    for (var i = 0; i < resArr.length; i++) {
      var obj = resArr[i];
      // console.log(obj)
      var newTree = new Tree(obj)
      tree.children.push(newTree)
    };
    for (var i = 0; i < tree.children.length; i++) {
      populateTree(config,tree.children[i],index+1)
    };

  };

  // ***************** TREE SEARCHES ************************
  // helper to get y-coords from tree nodes
  // traverse down and get y-coordnates to achor rects and labels to 
  var returnYDFS = function(node,path){
    path = path || []
    path.push(node.y)
    if (!node.children){
      return path
    } 
    return returnYDFS(node.children[0],path)
  }
  // helper to toggle all nodes bfs
  var toggleToDepthBFS = function(tree,depth){
    // svg.selectAll('.productImage').remove();

    // go n-1 deep
    // root always toggle on
    // start at roots kids
    var curArr = [];
    var nextArr = tree.children;
    for (var i = 0; i < depth-1; i++) {
      curArr = nextArr;
      nextArr = [];
      // console.log(curArr)
      // iterate through children and toggle them
      for (var j = 0; j < curArr.length; j++) {
        node = curArr[j];
        // console.log('collapsing',node.value)
        if (node._children){
          node.children = node._children
          node._children = null
        }
        // update(node)
        // push kids to next arr
        nextArr = nextArr.concat(node.children);
      };
    };
    // now have access to all nodes in the end, want untoggle if toggled
    for (var i = 0; i < nextArr.length; i++) {
      node = nextArr[i];
      if (node.children){
        node._children = node.children;
        node.children = null;
      }
      // update(node)
    };
  }
  // *************** MAKE TREE INTERACTIVE ****************
  // collapse tree initially except for root by toggleing between _.children and children
  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  // *********************** TREE JS ***************************
  var margin = {top: 20, right: 120, bottom: 20, left: 120},
      width = 1000 - margin.right - margin.left,
      height = 1200 - margin.top - margin.bottom;
  var god = {
    width : width,
    height : height
  }
  // moves the particles from a source to an end point
  var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.x, d.y]; });
      
  var svg = d3.select(".graph").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      // this makes a margin
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  function update(source,root) {
    // Compute the new tree layout, don't render root
    var d3tree = d3.layout.tree().size([width+20,height]);
    var nodes = d3tree.nodes(root).slice(1),
        links = d3tree.links(nodes);
    // the d3 tree class dynamically calculates new d.y d.x, so if want to make them
    // constant declare the x and y here
    var maxDepth = returnYDFS(root).length-1

    nodes.forEach(function(d){
      if (d.depth === 0){
        d.y = 0
        d.x = (width + margin.right + margin.left)/2;
      } else if (d.depth === 1){
        d.y = 5*margin.top
      } else {
        d.y = Math.pow(d.depth,2/3) * 200
      }
    })

    var i = 0;
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });
    // Enter any new nodes at the parent's previous position. (so it can pan from there)
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.x0 + "," +  source.y0+ ")"; })
        .on("click", function(d){
          // svg.selectAll('.productImage').remove();
          // if (d.depth === maxDepth){
            // buildImage(d.)
            // buildImage(d)
          // }
          toggleChildren(d,root)
        });

    // for every node append a circle at that place
    var radius = 35,
    side = 2 * radius * Math.cos(Math.PI / 4),
    dx = radius - side / 2;
    nodeEnter.append("circle")
        .attr("r", radius)
        .on('mouseenter',function(d){
          d3.select(this).attr('r',50)
          // console.log(this)
          d3.select(this).select('p').attr('width', 2 * 50 * Math.cos(Math.PI / 4)).attr('height', 2 * 50 * Math.cos(Math.PI / 4))
        })
        .on('mouseleave',function(d){
          d3.select(this).attr('r',35)
        })
        .style("fill", function(d) { return d._children ? "#E7D5AA" : "#707175"; })
        // add tooltip
        .append("svg:title")
        .append("text")
        .text(function(d, i) { return JSON.stringify(d.value) });

    nodeEnter.append("text")
      .attr("dx", function(d){return -22})
        // .5/4*JSON.stringify(d.value).length})
      .text(function(d){return d.value ? d.value.split(' ')[0] :null})
      .attr('style','font-size:15px;text-align:center;padding:2px;margin:2px;color:#707175;')
    // container for wrapped text
    // nodeEnter.append('foreignObject')
    //     .attr('x', -side/2)
    //     .attr('y', -side/2)
    //     .attr('width', side)
    //     .attr('height', side)
    //     .on('mouseenter',function(d){
    //     })
    //     .on('mouseleave',function(d){
    //       d3.select(this).attr('width', side).attr('height', side)
    //     })
    //     // .attr('color', 'light-blue')
    //     .appenbd('xhtml:p')
    //     .text(function(d){return d.value})
    //     .attr('style','text-align:center;padding:2px;margin:2px;color:#707175;')
        // .attr('style',function(d){return d._children ? "color:#707175;":"color:#E8E8E8;";})




    // nodeEnter.append("text")
    //     // .attr("y", function(d) {return d.children || d._children ? -10 : 10; })
    //     .attr("x", function(d) { return -30})
    //     .attr("y", function(d) { return -30})
    //     .attr("dy", ".35em")
    //     // .attr("text-anchor",function(d){return d})
    //       // function(d) { return d.children || d._children ? "end" : "start"; })
    //     // .text(function(d{ return JSON.stringify(pluck(d.products,'product_name')) })
    //     .text(function(d) { return d.value })
    //     // .attr("transform", function(d) { return "rotate(20)"; })
    //     .style("fill-opacity", 1e-5);

    // Transition nodes to their new position.
    var duration = 750;
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y  + ")"; });

    nodeUpdate.select("circle")
        .attr("r", radius)
        .style("fill", function(d) { return d._children ? "#E7D5AA" : "#E7D5AA"; });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.x + "," +  source.y+ ")"; })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);


    // Update the links…
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
          var o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
          var o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        })
        .remove();

    // Stash the old positions for later transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
  // Toggle children on click.
  function toggleChildren(d,root) {
    if (d.children) {  
      // when clicking collapse turn all kids off
      collapse(d)
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d,root);
  }

  // ******************** LABELS *************************

  // ***************** CONFIG TABLE ********************
  var createConfigTable = function(config,size,width){
    var config_table = []
    var height = 50;
    var y = margin.top
    // console.log(god.width,margin.right)
    var offset = god.width - 3/2*margin.right;
    for (var i = 0; i < config.length; i++) {
      offset-=10
      config_table.push({
        value:config[i],
        x: offset-i*width,
        y:y,
        width:width,
        height:height,
        order:null
      })
    }
    return config_table;
  };
  // ************************ LABELS OF ROWS *************************
  // create an array of label objects to which we append rect and text
  var createLabels = function(tree_config,size,length,root){
    var pathY = returnYDFS(root)
    var labels = []
    for (var i = 1; i <pathY.length; i++) {
      var key = tree_config[i-1];
      var height = Math.sqrt(pathY.length-i)*size
      var y = pathY[i] 
      labels.push({
        x:-100 ,
        y:y,
        height:height,
        width:length,
        value:key || 'name',
        name: key ? key.split('_').join(' ') : key,
        depth:labels.length+1
      })
    };
    return labels 
  }
  var beautifyText = function(d){
    res = d.value[0].toUpperCase() + d.value.slice(1); return res.replace('_',' ')
  }

  var buildLabeledRectangles = function(data,classed,fill){
    // build rectangles
    // console.log(data,classed,fill)
    svg.selectAll(classed)
      .data(data)
      .enter()
      .append("rect")
      .classed(classed,true)
      .attr("x", function(d) {return d.x-10})
      .attr("y", function(d) { return d.y-10})
      .attr("width", function(d) { return d.width})
      .attr("height", function(d) { return d.height})
      .attr("fill",fill||"#707175")
    // build text 
    svg.selectAll(classed)
      .data(data)
      .enter()
      .append("text")
      .classed(classed,true)
      .attr("x", function(d) {var size = beautifyText(d).length*6.75;var margin=(150-size)/2 ;return d.x+17})
      .attr("y", function(d) { return d.y})
      .attr("dy", ".8em")
      .attr('style','color:white;text-align:center;')

      .text(function(d) {return beautifyText(d)})
    }

  var addHover = function(classed,opacity){
    opacity = opacity || 0.6
    svg.selectAll(classed)
      .on("mouseenter",function(d){
        d3.select(this).attr("opacity",0.7)
      })
      .on("mouseleave",function(d){
        d3.select(this).attr("opacity",1)
      })
  }

  var updateClassText = function(classed){
    var text = svg.selectAll('text'+classed)
    text.text(function(d){value = beautifyText(d); return d.order !== null && value + ' ' + (d.order + 1) || value})       
  }

  var addFilterOrder = function(classed,config_table,cb){
    var data = svg.selectAll(classed)
    data.on('click',function(d){
      if (d.order !== null){
        //removing from theconfig_table
        config_table.splice(d.order,1)
        // togle order off 
        d.order = null
        //update order of all other data in filerArr
        config_table.forEach(function(datum,index){
          datum.order = index;
        })
      } else {
        // not inconfig_table
        config_table.push(d)
        d.order =config_table.length -1
      }
      cb(config_table)
      updateClassText(classed);
    })
  }

  var buildImage = function(data){
    svg.selectAll('.productImage').remove();
    // console.log('buildImage')
    // console.log(data)
    svg.selectAll('.productImage')
    .data([data])
    .enter()
    .append("svg:image")
    .classed('productImage',true)
    .attr('x',function(d){return d.x})
    .attr('y',function(d){return d.y+10})
    .attr('width', 70)
    .attr('height', 70)
    .attr('xlink:href',"images.jpg")
    // .attr("xmlns","https://cdn.css-tricks.com/wp-content/uploads/2015/05/kiwi.svg")
      // function(d) { return d.personal_notes})
  // <img src="pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;">
    // .attr("dy", ".35em")
    // .text(function(d){
      // return d.products[0].photo;
    // })
  }
  var buildApp = function(data,tree_config,options){
    var root = new Tree({value:'root',products:data});
    //build tree based on tree configuration
    // console.log(tree_config,root)
    populateTree(tree_config,root)
    // console.log(root)
    // where the root starts off at then transitioned w/ diagonal
    root.x0 = (width + margin.right + margin.left)/2;
    root.y0 = 0;
    //render Tree
    update(root,root)

    var labels = createLabels(tree_config,50,150,root);
    // console.log(labels)
    var options_table = createConfigTable(options,50,150)
    // console.log(options_table)
    var buildButton = {x:width, y:margin.top, width:150, height:50, value:'build tree'}
    // render labels and buttons

    buildLabeledRectangles(labels,'label')
    buildLabeledRectangles(options_table,'options_table','#707175')
    buildLabeledRectangles([buildButton],'build','#707175')

    //*********** add events to classes *************
    // change global filter order
    addHover('.options_table')
    addHover('.label')
    addHover('.build')

    // bfs toggle
    selectLabel = svg.selectAll('.label')
    // console.log(selectLabel)
    selectLabel
    .data(labels)
    .on('click',function(d){
      toggleToDepthBFS(root,d.depth)
      update(root,root)
    })
    // toggle building new tree 
    var filter_order = [];
    addFilterOrder('.options_table',filter_order,function(config_table){
      filter_order = config_table.map(function(d){return d.value})
    })
    
    svg.selectAll('.build')
    .on('click',function(){
      // use filthy globals
      rebuild(data,filter_order,options)
      // filter_order = []
    })
  }

  var rebuild = function(data,filter_order,options){
    // console.log('clicked',filter_order)
    if (filter_order.length >0){
      // remove everything
      svg.selectAll('.label').remove()
      svg.selectAll('.options_table').remove()
      svg.selectAll("g.node").remove()
      svg.selectAll("path.link").remove()

      // console.log(data,filter_order,'options',options)
      buildApp(data,filter_order,options);        
    }
  }
  // ********** RENDER TREE AND TABLES **************
  // define globals here
  // get parsed data from helper function

  var options_table =  ['product_category','brand_name','product_status','product_size']
  // this will get changed
  var initial_tree_config = ['brand_name','product_category','product_size','product_status']
  // stores order of configurations

  // ***************** BUILD APP *****************
    Products.getAllProducts(Auth).then(function(data){
    product_data = data['userProducts']
    buildApp(product_data,initial_tree_config,options_table);
  })

})

