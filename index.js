const m = {
    width: 800,
    height: 600
}

//Defines the map area
const svg = d3.select("main").append('svg')
    .attr('width', m.width)
    .attr('height', m.height)
    .attr('style', 'border: black solid .2rem')

// Defines the div for the tooltip
var div = d3.select("main").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const g = svg.append('g')

d3.json('./neighborhoods.geojson').then(function (data) {

    d3.csv('./seattle_airbnb.csv').then(function (pointData) {

        //Removes AirBnb's with no ratings
        pointData = pointData.filter(function (d) {
            return (+d['overall_satisfaction'] != +" ")
        })
        //console.log(pointData)
        const albersProj = d3.geoAlbers()
            .scale(120000)
            .rotate([122.3184, 0])
            .center([0, 47.6243])
            .translate([m.width / 2, m.height / 2]);

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
            .attr('r', function (d) {
                return 3.6 * d['bedrooms'];
            })
            .attr('fill', '#2ac2e8')
            .attr('stroke', 'black')
            .on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d["name"] + "<br/>" +
                    "Overall Satisfaction: " + d["overall_satisfaction"] + "<br/>" +
                    "Price: $" + d["price"] + "<br/>" +
                    "Number of Bedrooms: " + d["bedrooms"] + "<br/>" +
                    "Number of Bathrooms: " + d["bathrooms"] + "<br/>" +
                    "Accommodates: " + d["accommodates"])
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })


        //Adds options to the scale picker
        var scalePickerValues = ["bedrooms", "bathrooms", "accommodates"]

        d3.select("#scalePicker")
            .selectAll('myOptions')
            .data(scalePickerValues)
            .enter()
            .append('option')
            .text(function (d) { return d; }) // text showed in the menu
            .attr("value", function (d) { return d; });
        let price = pointData.map((row) => parseInt(row["price"]))

        //Adds functionality to the scale picker dropdown menu
        d3.select("#scalePicker").on("change", function (d) {
            var chosenScale = d3.select(this).property("value");
            //console.log(chosenScale);
            circle.transition()
                .duration(5000)
                .attr('r', function () {
                    let thisCircle = d3.select(this);
                    let circleData = thisCircle.data()[0];
                    //console.log(circleData[chosenScale]);
                    if (chosenScale == "accommodates") {
                        return 1.36 * circleData[chosenScale];
                    } else if (chosenScale == "bathrooms") {
                        return 3.83 * circleData[chosenScale];
                    } else {
                        return 3.6 * circleData[chosenScale];
                    }

                })
        })

        // find range of data
        let priceMin = d3.min(price);
        let priceMax = d3.max(price);

        // Range
        var sliderRange = d3
            .sliderBottom()
            .min(priceMin)
            .max(priceMax)
            .width(300)
            .tickValues([16, 200, 400, 600, 800, 1000, 1200, 1400, 1600])
            //.tickFormat(d3.format('$,.5'))
            //.ticks(3)
            //.thresholds([16, 50, 1600])
            .default([priceMin, priceMax])
            .fill('#2196f3')
            .on('onchange', val => {
                d3.select('span#value-range').text(val.map(d3.format('$,.5')).join('-'));
                svg.selectAll("circle")//.attr('r', (val))
                    .transition()
                    .duration(3000)
                    .attr('cx', function (d) {
                        //console.log(val)
                        if (d["price"] >= val[0] && d["price"] <= val[1]) {
                            let scaledPoints = albersProj([d['longitude'], d['latitude']])
                            return scaledPoints[0]
                        }
                        return -500;

                    })
                    .attr('cy', function (d) {
                        if (d["price"] >= val[0] && d["price"] <= val[1]) {
                            let scaledPoints = albersProj([d['longitude'], d['latitude']])
                            return scaledPoints[1]
                        }
                        return -500;
                    })
                    .style('opacity', function (d) {
                        if (d["price"] >= val[0] && d["price"] <= val[1]) {
                            return 1;
                        }
                        return 0;
                    });
            });

        var gRange = d3
            .select('div#slider-range')
            .append('svg')
            .attr('width', 500)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(100,30)');

        gRange.call(sliderRange);

        d3.select('span#value-range').text(
            sliderRange
                .value()
                .map(d3.format('$,.5'))
                .join('-')
        );
    })
})