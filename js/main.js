
const slidebar = document.querySelector(".slidebar");
const mloa_file = 'data/monthly_in_situ_co2_mlo.csv' ;
const global_temp_file = 'data/Global_TAVG_monthly.txt' ;
let decData=[] ;
let co2Val =[] ;
let xval = [] ;
let yval = [] ;
let minYear = 1980 ;
let gtemps_chart = null ;
let mloa_chart = null ;

const ctx_mloa = document.getElementById('mloa_chart').getContext("2d");
const ctx_gtemps = document.getElementById('gtemps_chart').getContext("2d");
const p_left = document.querySelector ('.leftinfo') ;
const p_right = document.querySelector ('.rightinfo') ;
const mainEl = document.querySelector('.main') ;
const navItemsEls = document.querySelectorAll('.topnav-items');




function furtherInfo (num){
    let infile ="" ;
    slidebar.classList.toggle ("active") ;
    switch (num) {
        case 0 :
            infile = 'data/mloa_co2.txt' ;
            break ;
        case 1 :
            infile = 'data/gtemps.txt';
            break ;
        case 2 :
            infile = 'data/ghg.txt' ;
            break ;
        case 3 : 
            infile = 'data/continents_emit.txt';
            break ;
        case 4 :
            infile = 'data/country_furtherinfo.txt' ;
            break ;
    }
    $ajaxUtils.sendGetRequest (infile, function (responseText){
        document.getElementById("topDiv").innerHTML = `${responseText}`}
        ,false ) ;

  


}


function readGlobalTemps () {
    $ajaxUtils.sendGetRequest (global_temp_file, function(responseText ){
        // console.log(responseText) ;
        let lines = responseText.split('\n') ;
        for (let iline=96; iline<lines.length; iline++){
            if (lines[iline].length<30) continue ;
            let colval = lines[iline].split(/\s+/) ;
            xval.push(Number(colval[1])+Number(colval[2])/12.) ;
            yval.push(colval[3]) ;

        }
        let chartData = xval.map((x,i)=>{
            return { 
            x: x,
            y: yval[i]
            };
        }) ;
        let config = {type:'scatter',
            data: { 
                datasets: [{ 
                    label: 'Global Temp Anomaly',
                    data: chartData, 
                    backgroundColor: 'rgba(147, 0, 192, 0.8)', 
                }], 
            },
            options: {
                responsive: true,
                title:{
                    display:true,
                    text:'Chart.js Line Chart'
                },
                scales: {
                    x: {
                        title: {
                            text: "Year",
                            display: true,
                            
                        },
                        min: minYear,
                        ticks: {
                            callback: function (value) {
                                // return value.toLocaleString();
                                return value;
                            }
                        },
                        
                    },
                    y: {
                        title: {
                            text: "Temp Anomaly (C)",
                            display: true
                        }
                        
                    }
                    
                },
            
            }
        } ;
        
        if (gtemps_chart){
            gtemps_chart.destroy();
        }
        gtemps_chart = new  Chart(ctx_gtemps, config) ;
        p_right.innerHTML = "Global temperature anomaly relative to the average global temperature for the 1850-1900 time period."


    }, false ) ;
}


function readMLoa () {
    $ajaxUtils.sendGetRequest (mloa_file, function(responseText ){
        let lines = responseText.split("\n") ;
        for (let iline=68; iline<lines.length; iline++){
            if (lines[iline].length<30) continue ;
            let colval = lines[iline].split(",") ;
            if (colval[5]< 0.) continue ;
            decData.push(colval[3]) ;
            co2Val.push(colval[5]) ;
        }

        let chartData = decData.map((x,i)=>{
            return { 
            x: x,
            y: co2Val[i]
            };
        }) ;
        let config = {type:'scatter',
            data: { 
                datasets: [{ 
                    label: 'Mauna Loa CO2', 
                    data: chartData, 
                    backgroundColor: 'rgba(75, 0, 192, 0.7)', 
                }], 
            },
            options: {
                responsive: true,
                title:{
                    display:true,
                    text:'Chart.js Line Chart'
                },
                scales: {
                    x: {
                        title: {
                            text: "Year",
                            display: true
                        },
                        min: minYear,
                        ticks: {
                            callback: function (value) {
                                // return value.toLocaleString();
                                return value;
                            }
                        },
                        
                    },
                    y: {
                        title: {
                            text: "Atmospheric CO2 (ppm)",
                            display: true
                        }
                        
                    }
                    
                },
            
            }
        } ;
        
        if (mloa_chart){
            mloa_chart.destroy() ;
        }
        mloa_chart = new  Chart(ctx_mloa, config) ;
        p_left.innerHTML = "Seasonally adjusted atmospheric CO2 concentrations measured atop Mauna Loa summit in Hawaii, continuous insitu measurements." ;
        decData = [] ;
        co2Val= [] ;
        
    },false);
}

function modStartYear () {
    minYear = document.getElementById('input_startYear').value ;
    readMLoa() ;
    readGlobalTemps() ;
}


readMLoa () ;
readGlobalTemps() ;
