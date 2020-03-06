
/**
 * This example shows how to plot points on a map
 * and how to work with normal geographical data that
 * is not in GeoJSON form
 * 
 * Outline:
 * 1. show how to load multiple files of data 
 * 2. talk about how geoAlbers() is a scaling function
 * 3. show how to plot points with geoAlbers
 */
const m = {
    width: 800,
    height: 600
}

const svg = d3.select("body").append('svg')
    .attr('width', m.width)
    .attr('height', m.height)
    .attr('style', 'border: black solid .2rem')

const g = svg.append('g')

// neighborhoods.json taken from rat map example
d3.json('./neighborhoods.geojson').then(function (data) {

    d3.csv('./seattle_airbnb.csv').then(function (pointData) {
        /*pointData = pointData.filter(function (d) {
            //console.log(d)
            //console.log(+d['bedrooms'])
            //console.log(+"2")
            return (+"4" == +d['bedrooms'])
        })*/

        pointData = pointData.filter(function (d) {
            //console.log(d['accommodates'])
            //console.log(d['accommodates'])
            //console.log(!isNaN(d['accommodates']))
            return (!isNaN(+d['accommodates']))
        })
        //console.log(pointData)
        const albersProj = d3.geoAlbers()
            .scale(120000)
            .rotate([122.3184, 0])
            .center([0, 47.6243])
            .translate([m.width / 2, m.height / 2]);

        // this code shows what albersProj really does
        // let point = pointData[0]
        // let arr = [ point['long'] , point['lat'] ]
        // let scaled = albersProj(arr)
        // console.log(scaled)

        const geoPath = d3.geoPath()
            .projection(albersProj)

        g.selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('fill', '#808080')
            .attr('stroke', 'black')
            .attr('d', geoPath)


        // plots circles on the Seattle map
        var circle = g.selectAll('.circle')
            .data(pointData)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                let scaledPoints = albersProj([d['longitude'], d['latitude']])
                return scaledPoints[0]
            })
            .attr('cy', function (d) {
                let scaledPoints = albersProj([d['longitude'], d['latitude']])
                return scaledPoints[1]
            })
            .attr('r', function(d) {
                return 3 * d['bedrooms'];
            })
            .attr('fill', '#4682b4')
            .attr('stroke', 'black')



/*        d3.select("#change").on("click", function () {
            //console.log("heck")
            circle.transition()
                .duration(10000)
                .attr("cx", 0)
                .attr("cy", 0)
                .end()

            /*circle.transition()
                .duration(10000)
                .attr("cx", function() {
                    let thisCircle = d3.select(this);
                    let circleData = thisCircle.data()[0];
                    //console.log(circleData['longitude'])
                    let scaledPoints = albersProj([circleData['longitude'], circleData['latitude']])
                    //console.log(scaledPoints[0])
                    return scaledPoints[0]
                })
                .attr("cy", function() {
                    let thisCircle = d3.select(this);
                    let circleData = thisCircle.data()[0];
                    //console.log(circleData['longitude'])
                    let scaledPoints = albersProj([circleData['longitude'], circleData['latitude']])
                    //console.log(scaledPoints[0])
                    return scaledPoints[1]
                })*



        })

        d3.select("#test").on("click", function () {
            //console.log("test")
            circle.transition()
                .duration(5000)
                .attr("cx", function () {
                    let thisCircle = d3.select(this);
                    let circleData = thisCircle.data()[0];
                    //console.log(circleData['longitude'])
                    let scaledPoints = albersProj([circleData['longitude'], circleData['latitude']])
                    //console.log(scaledPoints[0])
                    return scaledPoints[0]
                })
                .attr("cy", function () {
                    let thisCircle = d3.select(this);
                    let circleData = thisCircle.data()[0];
                    //console.log(circleData['longitude'])
                    let scaledPoints = albersProj([circleData['longitude'], circleData['latitude']])
                    //console.log(scaledPoints[0])
                    return scaledPoints[1]
                })
                .attr('r', function () {
                    let thisCircle = d3.select(this);
                    let circleData = thisCircle.data()[0];
                    return 3 * circleData['bathrooms']
                })
        })
*/
        var scalePickerValues = ["bedrooms", "bathrooms", "accommodates"]
        // add the options to the button
        d3.select("#scalePicker")
            .selectAll('myOptions')
            .data(scalePickerValues)
            .enter()
            .append('option')
            .text(function (d) { return d; }) // text showed in the menu
            .attr("value", function (d) { return d; });


        d3.select("#scalePicker").on("change", function (d) {
            var chosenScale = d3.select(this).property("value");
            //console.log(chosenScale);
            circle.transition()
                .duration(5000)
                /*.attr("cx", function () {
                    let thisCircle = d3.select(this);
                    let circleData = thisCircle.data()[0];
                    //console.log(circleData['longitude'])
                    let scaledPoints = albersProj([circleData['longitude'], circleData['latitude']])
                    //console.log(scaledPoints[0])
                    return scaledPoints[0]
                })
                .attr("cy", function () {
                    let thisCircle = d3.select(this);
                    let circleData = thisCircle.data()[0];
                    //console.log(circleData['longitude'])
                    let scaledPoints = albersProj([circleData['longitude'], circleData['latitude']])
                    //console.log(scaledPoints[0])
                    return scaledPoints[1]
                })*/
                .attr('r', function () {
                    let thisCircle = d3.select(this);
                    let circleData = thisCircle.data()[0];
                    //console.log(circleData[chosenScale]);
                    if (chosenScale == "accommodates") {
                        return circleData[chosenScale] / 2;
                    } else {
                        return 2.5 * circleData[chosenScale]
                    }

                })
            /*.transition()
            .duration(10000)
            .on('start', function repeat() {
                // increment year
                /*i++
    
                // stop transition if i > max year
                if (i >= yearLimits[1]) {
                    return
                }*
    
                // this = just one single circle in the selection
    
                // get appropriate circle element and it's corresponding data
                let thisCircle = d3.select(this)
                let location = thisCircle.data()[0]['room_id']
                //console.log(location)
                let datum = pointData.filter(function (d) { 
                    console.log(d['room_id'])
                    console.log(location)
                    location == d['room_id'] })
                //console.log(datum[0])
    
                //console.log(pointData)
                if (datum == []) {
                    datum = thisCircle.data()[0]
                } else {
                    datum = datum[0]
                }
                //console.log(datum);
                //if (typeof datum != 'undefined') {
                    //console.log(datum)
                    // use d3.active to smoothly chain transitions
                    // d3.active(this)
                    //     .attr('cx', 0)
                    //     .attr('cy', 0)
                    //     .attr('r', 20)
                    //     .transition()
                    //     .on('start', repeat)
                //}
    
            })*/
        })
        /*
        .on( "click", function(){
            d3.select(this)
              .attr("opacity",1)
              .transition()
              .duration( 1000 )
              .attr( "cx", m.width * Math.round( Math.random() ) )
              .attr( "cy", m.height * Math.round( Math.random() ) )
              .attr( "opacity", 0 )
              .on("end",function(){
                d3.select(this).remove();
              })
          })
        */



    })


    /*
      // keep a counter for the year (important for transition later)
      let i = yearLimits[0]
      svg.selectAll('circle')
        .data(data.filter(function(d) { return d['time'] == i }))
        .enter()
        .append('circle')
            .attr('cx', function(d) { return xScale(+d['fertility_rate']) })
            .attr('cy', function(d) { return yScale(+d['life_expectancy']) })
            .attr('r', function(d) { return populationScale(+d['pop_mlns']) })
            .attr('fill', 'steelblue')
    
        // smoth transition using d3.active
        .transition()
          .duration(10000)
          .on('start', function repeat() {
            // increment year
            i++
    
            // stop transition if i > max year
            if (i >= yearLimits[1]) {
              return
            }
    
            // this = just one single circle in the selection
    
            // get appropriate circle element and it's corresponding data
            let thisCircle = d3.select(this)
            let location = thisCircle.data()[0]['location']
            let datum = data.filter(function(d) { return d['time'] == i && location == d['location'] })
            if (datum == []) {
              datum = thisCircle.data()[0]
            } else {
              datum = datum[0]
            }
    
            if (typeof datum != 'undefined') {
    
              // use d3.active to smoothly chain transitions
              d3.active(this)
                .attr('cx', xScale(+datum['fertility_rate']))
                .attr('cy', yScale(+datum['life_expectancy']))
                .attr('r', populationScale(+datum['pop_mlns']))
              .transition()
                .on('start', repeat)
            }
    
          })
    
    */





    /*svgContainer.selectAll("circle").style('opacity', 0)
        .attr('cx', xMapDisplaced);
    var legendaryStatus = d3.select("#legendaryDropDown").property("value");
    legendaryHandler(legendaryStatus, genStatus, xMap);
    */
})