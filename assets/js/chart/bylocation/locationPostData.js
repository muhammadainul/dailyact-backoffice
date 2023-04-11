'use strict';
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
jQuery(document).ready( function (){
  jQuery.getJSON( "/assets/js/lib/amcharts/tools-country-id.json", function( geo ) {
    var chartStatPost = $.ajax({
        method: 'POST',
        url: '/bizdev/demographyByPostData',
        dataType: 'json',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        success: function (results) {
          // Themes begin
          am4core.useTheme(am4themes_animated);

          // Create map instance
          var chart = am4core.create("chartdiv", am4maps.MapChart);

          // Set map definition
          chart.geodata = am4geodata_indonesiaLow;
          var title = "";
          // add country title
          if ( am4geodata_data_countries2[ geo.country_code ][ "country" ] ) {
            title = am4geodata_data_countries2[ geo.country_code ][ "country" ];
          }

          // Set projection
          chart.projection = new am4maps.projections.Mercator();

          // Create map polygon series
          var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

          //Set min/max fill color for each area
          polygonSeries.heatRules.push({
          property: "fill",
          target: polygonSeries.mapPolygons.template,
          min: chart.colors.getIndex(1).brighten(1),
          max: chart.colors.getIndex(1).brighten(-0.3)
          });

          // Make map load polygon data (state shapes and names) from GeoJSON
          polygonSeries.useGeodata = true;

          // Set heatmap values for each state
          polygonSeries.data = results.provinceGroup;

          // Set up heat legend
          var heatLegend = chart.createChild(am4maps.HeatLegend);
          heatLegend.id = "heatLegend";
          heatLegend.series = polygonSeries;
          heatLegend.align = "right";
          heatLegend.valign = "bottom";
          heatLegend.width = am4core.percent(35);
          heatLegend.marginRight = am4core.percent(4);
          heatLegend.background.fill = am4core.color("#000");
          heatLegend.background.fillOpacity = 0.05;
          heatLegend.padding(5, 5, 5, 5);

          // Set up custom heat map legend labels using axis ranges
          var minRange = heatLegend.valueAxis.axisRanges.create();
          minRange.label.horizontalCenter = "left";

          var maxRange = heatLegend.valueAxis.axisRanges.create();
          maxRange.label.horizontalCenter = "right";

          // Blank out internal heat legend value axis labels
          heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function(labelText) {
          return "";
          });

          // Update heat legend value labels
          polygonSeries.events.on("datavalidated", function(ev) {
          var heatLegend = ev.target.map.getKey("heatLegend");
          var min = heatLegend.series.dataItem.values.value.low;
          var minRange = heatLegend.valueAxis.axisRanges.getIndex(0);
          minRange.value = min;
          minRange.label.text = "" + heatLegend.numberFormatter.format(min);

          var max = heatLegend.series.dataItem.values.value.high;
          var maxRange = heatLegend.valueAxis.axisRanges.getIndex(1);
          maxRange.value = max;
          maxRange.label.text = "" + heatLegend.numberFormatter.format(max);
          });

          // Configure series tooltip
          var polygonTemplate = polygonSeries.mapPolygons.template;
          polygonTemplate.tooltipText = "{name}: {value}";
          polygonTemplate.url = 'javascript:testFunc("{name} : {value}")';
          polygonTemplate.nonScalingStroke = true;
          polygonTemplate.strokeWidth = 0.5;

          // Create hover state and set alternative fill color
          var hs = polygonTemplate.states.create("hover");
          hs.properties.fill = am4core.color("#3c5bdc");

          // Table
          // let locationName = [
          //   "Bali",
          //   "Banten",
          //   "Aceh",
          //   "Bengkulu",
          //   "Kepulauan Bangka Belitung",
          //   "Gorontalo",
          //   "Jambi",
          //   "Jawa Barat",
          //   "Jawa Timur",
          //   "Jakarta Raya",
          //   "Jawa Tengah",
          //   "Kalimantan Selatan",
          //   "Kalimantan Timur",
          //   "Kepulauan Riau",
          //   "Kalimantan Tengah",
          //   "Kalimantan Barat",
          //   "Lampung",
          //   "Kalimantan Utara",
          //   "Maluku Utara",
          //   "Sulawesi Utara",
          //   "Sumatera Barat",
          //   "Sulawesi Tenggara",
          //   "Maluku",
          //   "Papua Barat",
          //   "Sulawesi Selatan",
          //   "Sulawesi Barat",
          //   "Nusa Tenggara Barat",
          //   "Papua",
          //   "Yogyakarta",
          //   "Nusa Tenggara Timur",
          //   "Riau",
          //   "Sumatera Utara",
          //   "Sumatera Selatan",
          //   "Sulawesi Tengah"
          // ];
          let num = 0;
          let count = 0;
          let totalValue = 0;
          for (let i of polygonSeries.data) {
              num++
              totalValue += i.value;
              if (i.id == 'ID-BA') var locationName = 'Bali'
                else if (i.id == 'ID-BT') var locationName = 'Banten'
                else if (i.id == 'ID-AC') var locationName = 'Aceh'
                else if (i.id == 'ID-BE') var locationName = 'Bengkulu'
                else if (i.id == 'ID-BB') var locationName = 'Kepulauan Bangka Belitung'
                else if (i.id == 'ID-GO') var locationName = 'Gorontalo'
                else if (i.id == 'ID-JA') var locationName = 'Jambi'
                else if (i.id == 'ID-JB') var locationName = 'Jawa Barat'
                else if (i.id == 'ID-JI') var locationName = 'Jawa Timur'
                else if (i.id == 'ID-JK') var locationName = 'Jakarta Raya'
                else if (i.id == 'ID-JT') var locationName = 'Jawa Tengah'
                else if (i.id == 'ID-KS') var locationName = 'Kalimantan Selatan'
                else if (i.id == 'ID-KI') var locationName = 'Kalimantan Timur'
                else if (i.id == 'ID-KR') var locationName = 'Kepulauan Riau'
                else if (i.id == 'ID-KT') var locationName = 'Kalimantan Tengah'
                else if (i.id == 'ID-KB') var locationName = 'Kalimantan Barat'
                else if (i.id == 'ID-LA') var locationName = 'Lampung'
                else if (i.id == 'ID-KU') var locationName = 'Kalimantan Utara'
                else if (i.id == 'ID-MU') var locationName = 'Maluku Utara'
                else if (i.id == 'ID-SA') var locationName = 'Sulawesi Utara'
                else if (i.id == 'ID-SB') var locationName = 'Sulawesi Barat'
                else if (i.id == 'ID-SG') var locationName = 'Sulawesi Tenggara'
                else if (i.id == 'ID-MA') var locationName = 'Maluku'
                else if (i.id == 'ID-PB') var locationName = 'Papua Barat'
                else if (i.id == 'ID-SN') var locationName = 'Sulawesi Selatan'
                else if (i.id == 'ID-SR') var locationName = 'Sulawesi Barat'
                else if (i.id == 'ID-NB') var locationName = 'Nusa Tenggara Barat'
                else if (i.id == 'ID-PA') var locationName = 'Papua'
                else if (i.id == 'ID-YO') var locationName = 'Yogyakarta'
                else if (i.id == 'ID-NT') var locationName = 'Nusa Tenggara Timur'
                else if (i.id == 'ID-RI') var locationName = 'Riau'
                else if (i.id == 'ID-SU') var locationName = 'Sumatera Utara'
                else if (i.id == 'ID-SS') var locationName = 'Sumatera Selatan'
                else if (i.id == 'ID-ST') var locationName = 'Sulawesi Tengah'

                jQuery("#tableStatLocPost").append(`<tr>><td style='width: 5%;'>` + num + `</td><td>` + locationName + `</td>
                    <td>` + i.value + `</td></tr>`);
          }
          jQuery("#tableStatLocPost").append("<tr><td>&nbsp</td></td><td><b>TOTAL</b></td><td><b>" + totalValue + "</b></td></tr>");
        }
    });
  });
});

function testFunc(param) {
    // alert(param);
    // var chartStatModal = $.ajax({
    //   method: 'POST',
    //   url: '/bizdev/demographyByPostData',
    //   dataType: 'json',
    //   crossDomain: true,
    //   headers: {
    //       'Content-Type': 'application/json; charset=utf-8'
    //   },
    //   success: function (results) {
    // jQuery(document).on("click", ".openViewContent", function () {
    jQuery("#viewContentPostData").modal("show");
      // var myVal = $(this).attr('data-id');
      jQuery("#postImagePostData").html("<center>" + param + "</center>");
    // });
    //   }
    // });
}         