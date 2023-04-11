/**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 * 
 * For more information visit:
 * https://www.amcharts.com/
 * 
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create map instance
var chart = am4core.create("chartdiv", am4maps.MapChart);

// Set map definition
chart.geodata = am4geodata_worldLow;
//chart.geodataSource.url = "./indonesia-prov.json";

// Set projection
chart.projection = new am4maps.projections.Miller();

chart.events.on("ready", function(ev) {
    chart.zoomToMapObject(polygonSeries.getPolygonById("ID"));

});

chart.maxZoomLevel = 32;
chart.seriesContainer.draggable = false;
chart.seriesContainer.resizable = false;
chart.seriesContainer.events.disableType("doublehit");
chart.chartContainer.background.events.disableType("doublehit");   

// Create map polygon series
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

// Exclude Antartica
polygonSeries.exclude = ["AF","AL","DZ","AS","AD","AO","AI","AQ","AG","AR","AM","AW","AT","AZ","BS","BH","BD","BB","BY","BE","BZ","BJ","BM","BT","BO","BQ","BA","BW","BV","BR","IO","BN","BG","BF","BI","CV","CM","CA","KY","CF","TD","CL","CN","CX","CC","CO","KM","CD","CG","CK","CR","HR","CU","CW","CY","CZ","CI","DK","DJ","DM","DO","EC","EG","SV","GQ","ER","EE","SZ","ET","FK","FO","FJ","FI","FR","GF","PF","TF","GA","GM","GE","DE","GH","GI","GR","GL","GD","GP","GU","GT","GG","GN","GW","GY","HT","HM","VA","HN","HK","HU","IS","IN","IR","IQ","IE","IM","IL","IT","JM","JP","JE","JO","KZ","KE","KI","KP","KR","KW","KG","LV","LB","LS","LR","LY","LI","LT","LU","MO","MG","MW","MV","ML","MT","MH","MQ","MR","MU","YT","MX","FM","MD","MC","MN","ME","MS","MA","MZ","NA","NR","NP","NL","NC","NZ","NI","NE","NG","NU","NF","MP","NO","OM","PK","PW","PS","PA","PY","PE","PN","PL","PT","PR","QA","MK","RO","RU","RW","RE","BL","SH","KN","LC","MF","PM","VC","WS","SM","ST","SA","SN","RS","SC","SL","SX","SK","SI","SB","SO","ZA","GS","SS","ES","LK","SD","SR","SJ","SE","CH","SY","TW","TJ","TZ","TL","TG","TK","TO","TT","TN","TR","TM","TC","TV","UG","UA","AE","GB","UM","US","UY","UZ","VU","VE","VG","VI","WF","EH","YE","ZM","ZW","AX"];

// Make map load polygon (like country names) data from GeoJSON
polygonSeries.useGeodata = true;

// Configure series
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}";
polygonTemplate.polygon.fillOpacity = 0.6;


// Create hover state and set alternative fill color
var hs = polygonTemplate.states.create("hover");
hs.properties.fill = chart.colors.getIndex(0);

// Add image series
var imageSeries = chart.series.push(new am4maps.MapImageSeries());
imageSeries.mapImages.template.propertyFields.longitude = "longitude";
imageSeries.mapImages.template.propertyFields.latitude = "latitude";
imageSeries.mapImages.template.tooltipText = "{title}: [bold]{value}[/]";
imageSeries.mapImages.template.propertyFields.url = "url";


var colorSet = new am4core.ColorSet();

imageSeries.data = [ {
"title": "Jakarta",
"value" : 14000,
"latitude": -6.200000,
"longitude": 106.816666,
"color": colorSet.next()
}, {
"title": "Surabaya",
"value" : 3000,
"latitude": -7.250445,
"longitude": 112.768845,
"color": colorSet.next()
}, {
"title": "Makassar",
"value" : 2000,
"latitude": -5.135399,
"longitude": 119.423790,
"color": colorSet.next()
} ];



var imageTemplate = imageSeries.mapImages.template;
imageTemplate.nonScaling = true

imageTemplate.adapter.add("latitude", function(latitude, target) {
var polygon = polygonSeries.getPolygonById(target.dataItem.dataContext.id);
if(polygon){
    return polygon.visualLatitude;
}
return latitude;
})

imageTemplate.adapter.add("longitude", function(longitude, target) {
var polygon = polygonSeries.getPolygonById(target.dataItem.dataContext.id);
if(polygon){
    return polygon.visualLongitude;
}
return longitude;
})

var circle = imageTemplate.createChild(am4core.Circle);
circle.fillOpacity = 0.7;
circle.propertyFields.fill = "color";
circle.tooltipText = "{title}: [bold]{value}[/]";

imageSeries.heatRules.push({
"target": circle,
"property": "radius",
"min": 5,
"max": 50,
"dataField": "value"
})

var label = imageTemplate.createChild(am4core.Label);
label.text = "{title}"
label.horizontalCenter = "middle";
label.padding(0,0,0,0);
label.adapter.add("dy", function(dy, target){
var circle = target.parent.children.getIndex(0);
return circle.pixelRadius;
})

var circle2 = imageTemplate.createChild(am4core.Circle);
circle2.radius = 1;
circle2.propertyFields.fill = "color";

circle2.events.on("inited", function(event){
    animateBullet(event.target);
})


function animateBullet(circle) {
    var animation = circle.animate([{ property: "scale", from: 5, to: 80 }, { property: "opacity", from: 0.75, to: 0 }], 1500, am4core.ease.circleOut);
    animation.events.on("animationended", function(event){
    animateBullet(event.target.object);
    })
}