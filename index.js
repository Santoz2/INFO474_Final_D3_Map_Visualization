
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
d3.json('./neighborhoods.geojson').then(function(data) {

    d3.csv('./seattle_airbnb.csv').then(function(pointData) {

        const albersProj = d3.geoAlbers()
            .scale(120000)
            .rotate([122.3184, 0]) 
            .center([0, 47.6243])
            .translate([m.width/2, m.height/2]);

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
        g.selectAll('.circle')
            .data(pointData)
            .enter()
            .append('circle')
                .attr('cx', function(d) { 
                    let scaledPoints = albersProj([d['longitude'], d['latitude']])
                    return scaledPoints[0]
                })
                .attr('cy', function(d) {
                    let scaledPoints = albersProj([d['longitude'], d['latitude']])
                    return scaledPoints[1]
                })
                .attr('r', 5)
                .attr('fill', '#4682b4')
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
  
})
