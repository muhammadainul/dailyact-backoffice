jQuery(document).ready(function () {
    var chartStat = $.ajax({
        method: 'POST',
        url: '/bizdev/demography',
        dataType: 'json',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        success: function (results) {
            let label = [];
            let age = [' (10-19)', ' (20-39)',' (40-55)',' (56<)', ' (Unspecified)'];
            let female = [];
            let male = [];
            let others = [];    
            let count = 0;

            for (let i in results.age){
                label.push(i.charAt(0).toUpperCase() + i.slice(1) + age[count]);
                count++;
            }

            female.push(results.age.teens.FEMALE,results.age.adults.FEMALE,results.age.middle.FEMALE,results.age.senior.FEMALE,results.age.others.FEMALE)
            male.push(results.age.teens.MALE,results.age.adults.MALE,results.age.middle.MALE,results.age.senior.MALE,results.age.others.MALE)
            others.push(results.age.teens.others,results.age.adults.others,results.age.middle.others,results.age.senior.others,results.age.others.others)
            
            $(function() {
                var color = Chart.helpers.color;
                var UserVsMyAppsData = {
                    labels: label,
                    datasets: [{
                        label: 'FEMALE',
                        backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                        borderColor: window.chartColors.red,
                        borderWidth: 1,
                        data: female
                    }, {
                        label: 'MALE',
                        backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                        borderColor: window.chartColors.blue,
                        borderWidth: 1,
                        data: male
                    },  {
                        label: 'OTHERS',
                        backgroundColor: color(window.chartColors.grey).alpha(0.5).rgbString(),
                        borderColor: window.chartColors.grey,
                        borderWidth: 1,
                        data: others
                    }]
                };
             
                var UserVsMyAppsCtx = document.getElementById('canvas').getContext('2d');
                var UserVsMyApps = new Chart(UserVsMyAppsCtx, {
                    type: 'bar',
                    data: UserVsMyAppsData,
                    options: {
                        responsive: true,
                        legend: {
                            position: 'bottom',
                            display: true,
             
                        },
                        "hover": {
                          "animationDuration": 0
                        },
                         "animation": {
                            "duration": 1,
                          "onComplete": function() {
                            var chartInstance = this.chart,
                              ctx = chartInstance.ctx;
             
                            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
             
                            this.data.datasets.forEach(function(dataset, i) {
                              var meta = chartInstance.controller.getDatasetMeta(i);
                              meta.data.forEach(function(bar, index) {
                                var data = dataset.data[index];
                                ctx.fillText(data, bar._model.x, bar._model.y - 5);
                              });
                            });
                          }
                        },
                        title: {
                            display: true,
                            text: "User Demography"
                        },
                    }
                });
            });

            $(function() {
                let femaleTeensCount = (results.age.teens.FEMALE / results.dataCount * 100).toFixed(2);
                let maleTeensCount = (results.age.teens.MALE / results.dataCount * 100).toFixed(2);
                let othersTeensCount = (results.age.teens.others / results.dataCount * 100).toFixed(2);

                let femaleAdultsCount = (results.age.adults.FEMALE / results.dataCount * 100).toFixed(2);
                let maleAdultsCount = (results.age.adults.MALE / results.dataCount * 100).toFixed(2);
                let othersAdultsCount = (results.age.adults.others / results.dataCount * 100).toFixed(2);

                let femaleMiddleCount = (results.age.middle.FEMALE / results.dataCount * 100).toFixed(2);
                let maleMiddleCount = (results.age.middle.MALE / results.dataCount * 100).toFixed(2);
                let othersMiddleCount = (results.age.middle.others / results.dataCount * 100).toFixed(2);
                
                let femaleSeniorCount = (results.age.senior.FEMALE / results.dataCount * 100).toFixed(2);
                let maleSeniorCount = (results.age.senior.MALE / results.dataCount * 100).toFixed(2);
                let othersSeniorCount = (results.age.senior.others / results.dataCount * 100).toFixed(2);

                let femaleOthersCount = (results.age.others.FEMALE / results.dataCount * 100).toFixed(2);
                let maleOthersCount = (results.age.others.MALE / results.dataCount * 100).toFixed(2);
                let othersOthersCount = (results.age.others.others / results.dataCount * 100).toFixed(2);
                
                // FEMALE
                $('#colFemale').append("<td>" + femaleTeensCount + " % </td>");
                $('#colFemale').append("<td>" + femaleAdultsCount + " % </td>");
                if (results.age.middle.FEMALE == null || results.age.middle.FEMALE == undefined){
                    $('#colFemale').append("<td>" + 0 + "</td>");
                } else {
                    $('#colFemale').append("<td>" + femaleMiddleCount + " % </td>");
                }

                if (results.age.senior.FEMALE == null || results.age.middle.FEMALE == undefined){
                    $('#colFemale').append("<td>" + 0 + "</td>");
                } else {
                    $('#colFemale').append("<td>" + femaleSeniorCount + " % </td>");
                }
                $('#colFemale').append("<td>" + femaleOthersCount + " % </td>");

                // MALE
                $('#colMale').append("<td>" + maleTeensCount + " % </td>");
                $('#colMale').append("<td>" + maleAdultsCount + " % </td>");
                if (results.age.middle.MALE == null || results.age.middle.MALE == undefined){
                    $('#colMale').append("<td>" + 0 + "</td>");
                } else {
                    $('#colMale').append("<td>" + maleMiddleCount + " % </td>");
                }

                if (results.age.senior.MALE == null || results.age.middle.MALE == undefined){
                    $('#colMale').append("<td>" + 0 + "</td>");
                } else {
                    $('#colMale').append("<td>" + maleSeniorCount + " % </td>");
                }
                $('#colMale').append("<td>" + maleOthersCount + " % </td></tr>");

                // OTHERS
                $('#colOthers').append("<td>" + othersTeensCount + " % </td>");
                $('#colOthers').append("<td>" + othersAdultsCount + " % </td>");
                if (results.age.middle.others == null || results.age.middle.others == undefined){
                    $('#colOthers').append("<td>" + 0 + "</td>");
                } else {
                    $('#colOthers').append("<td>" + othersMiddleCount + " % </td>");
                }

                if (results.age.senior.others == null || results.age.middle.others == undefined){
                    $('#colOthers').append("<td>" + 0 + "</td>");
                } else {
                    $('#colOthers').append("<td>" + othersSeniorCount + " % </td>");
                }
                $('#colOthers').append("<td>" + othersOthersCount + " % </td></tr>");

                let date = new Date(results.updatedAt);
                $("#updatedAt").append("Updated Date : " + date);
            });
        }
    })
});