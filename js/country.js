const countryNavItem = document.getElementById('navlink_country') ;
let countryFile = 'data/countries_source_oneyear.csv' ;
let countryString = [] ;
let tableRows= [] ;
let country_chart=null ;
let countries = ['China','United States','India','Russia','Japan','Iran','Germany','Brazil','United Kingdom','France'] ;
let ctx_country = null ;


let mainstring = `<section class="maincontent_top">
            <div class="main-left">
                <h2>Top CO2 Emitting Countries</h2>
                <div class="chartdiv">
                    <div class='table' id='tablediv'>Puta table in here</div>
                    <p class="leftinfo"></p>
                </div>
                <button id="mloa_info" class="furtherinfo" onclick="furtherInfo(4)">Further Info</button>
            </div>
            <div class="main-right">
                <h2>Global Temperature Anomaly Time Series</h2>
                <div class="chartdiv">
                    <canvas id="country_chart"></canvas>
                    <p class="rightinfo">Hello</p>
                </div>
                <button id="gtemps_info" class="furtherinfo" onclick="furtherInfo(5)">Further Info</button>
            </div>
        </section>` ;

function loadCountry () {

    for (let navitem of navItemsEls) {
        navitem.classList.remove("active") ;
    }
    countryNavItem.classList.add('active') ;
    mainEl.innerHTML=mainstring;

    let outstring= '' ;
    // read in the top emitter text file
    $ajaxUtils.sendGetRequest (countryFile, function (responseText){
        let lines = responseText.split('\n');
        countryString = lines ;
        let makeTableStr = '<table><thead><tr><th>Country</th><th>CO2 (MTonnes)</th><th>CO2 Per Capita</th><th>CO2 Per GDP</th></tr></thead><tbody>'

        for (let iline=1; iline<lines.length; iline++) {
            if (lines[iline].length<7) continue ;
            outstring = outstring + lines[iline] + '\n' ;
            let colVal = lines[iline].split(',') ;
            let year = Number(colVal[1]) ;
            let co2Val = Number(colVal[4]).toPrecision(4);
            let co2percapita = Number(1000000. * co2Val / Number (colVal[2])).toPrecision(4);
            let co2gdp = Number(1000000. * co2Val / Number (colVal[3])).toPrecision(4) ;
            let rowstr = `<tr class="countryRow" onclick="rowclick(${iline})" ><td>${colVal[0]}</td><td>${co2Val}</td><td>${co2percapita}</td><td>${co2gdp}</td></tr>` ;
            makeTableStr = makeTableStr + rowstr ;


        } ;
        makeTableStr = makeTableStr + '</tbody></table>' ;
        let tableEl =document.getElementById('tablediv') ;
        
        tableEl.innerHTML = makeTableStr ;
        tableRows = document.querySelectorAll('.countryRow');
        tableRows[0].classList.add('active');
        rowclick(1) ;




    }, false) ;


}

function rowclick (indexVal){
    let country = countries[indexVal-1] ;
    let cfile = 'data/'+country+'_co2.txt' ;
    let year = [] ;
    let co2 = [] ;
    
    console.log(countryString[indexVal]) ;
    for (tr of tableRows) {
        tr.classList.remove ('active');

    }
    console.log(cfile);
    tableRows[indexVal-1].classList.add('active');
    $ajaxUtils.sendGetRequest(cfile, function(responseText){
        lines = responseText.split('\n') ;
        for (let iline =1 ; iline< lines.length; iline++) {     
            if (lines[iline].length<7) continue ;
            console.log(lines[iline]);
            let colVal = lines[iline].split(',') ;
            year.push(colVal[1]) ;

            co2.push (colVal[4]) ;
        }

        let chartData = year.map((x,i)=>{
            return { 
            x: x,
            y: co2[i]
            };
        }) ;
        let config = {type:'scatter',
            data: { 
                datasets: [{ 
                    label: 'CO2 for '+country,
                    data: chartData, 
                    backgroundColor: 'rgba(75, 0, 192, 0.2)', 
                    showLine: true,
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
        
        if (country_chart){
            country_chart.destroy();
        }

        let ctx_country = document.getElementById('country_chart').getContext("2d") ;
        country_chart = new  Chart(ctx_country, config) ;
        p_right.innerHTML = 
         "Country CO2";



    },false) ;

}