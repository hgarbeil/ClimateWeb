const countryNavItem = document.getElementById('navlink_country') ;
let countryFile = 'data/countries_source_oneyear.csv' ;
let countryMixFile = 'data/country_energymix_2023.csv'
let countryString = [] ;
let tableRows= [] ;
let country_chart=null ;
let countries = ['World','China','United States','India','Russia','Japan','Iran','Germany','Brazil','United Kingdom','France'] ;
let ctx_country = null ;
let energymix_chart = null ;


let mainstring = `<section class="maincontent_top">
            <div class="main-left">
                <h2>Top CO2 Emitting Countries</h2>
                <div class="chartdiv">
                    <div class='table' id='tablediv'>Puta table in here</div>
                    <p class="leftinfo">This table shows the 10 CO2 emission producing countries from the year 2022. Note that China, 
                    USA, India, and Russia make up over 50% of the world CO2 emissions of 38 billion MTonnes. United States and Russia far exceed the 
                    world CO2 per capita of approximately of 4.7 Tonnes/person.</p>
                </div>
                <button id="mloa_info" class="furtherinfo" onclick="furtherInfo(4)">Further Info</button>
            </div>
            <div class="main-right">
                <h2 id="plotHeader"></h2>
                <div class="chartdiv">
                    <canvas id="country_chart"></canvas>
                    <p class="rightinfo">Time series plot showing the selected country's total 
                    CO2 emissions and the share produced 
                    from the major fossil fuel sources.</p>
                </div>
                <button id="gtemps_info" class="furtherinfo" onclick="furtherInfo(5)">Further Info</button>
            </div>
        </section>
        <section class="maincontent_bottom">
            <div class="chartdiv">
                    <canvas id="countrymix_chart"></canvas>
                    <p class="rightinfo">Time series plot showing the selected country's total 
                    CO2 emissions and the share produced 
                    from the major fossil fuel sources.</p>
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
        let makeTableStr = '<table><thead><tr><th>Country</th><th>CO2 (MT)</th><th>CO2 Per Capita (T/person)</th><th>CO2 Per GDP (T/$)</th></tr></thead><tbody>'

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

// country,code,year,total,Coal,Oil,Gas,Nuclear,Hydro,Wind,Solar,Other
function loadCountryMix (country) {
    let labels=['Coal','Oil','Gas','Nuclear','Hydro','Wind','Solar'];
    $ajaxUtils.sendGetRequest(countryMixFile, function(responseText){
        let lines = responseText.split('\n') ;
        let COComp  =[] ;
        for (let iline=1; iline<lines.length; iline++){
            if (lines[iline].length < 7) {
                continue ;
            }
            let ColVal = lines[iline].split(',');
            if (ColVal[0] != country) 
                continue ;
            
            COComp.push (ColVal[4]*100.);
            COComp.push (ColVal[5]*100.);
            COComp.push (ColVal[6]*100.);
            COComp.push (ColVal[7]*100.);
            COComp.push (ColVal[8]*100.);
            COComp.push (ColVal[9])*100.;
            COComp.push (ColVal[10]*100.);


        }

        var data = {
            labels: labels,
            // options :
            // {
            //     responsive:True ,
            // },
            datasets: [
                {
                    
                    data: COComp,
                    backgroundColor: [
                        "#AA3322",
                        "#AA33AA",
                        "#AAAA22",
                        "#22AA33",
                    ],
                    
                }]
        };

        let data1 = {

            labels: labels,
            datasets:[
            {
                datasets: COComp,
                backgroundColor :[
                    '#AAAA55',
                    '#AA55AA','#55AAAA','#5555AA','#55AA55','#AA5555','#FFDD22'
                ],
                // backgroundColor: [
                //     "#AA3322",
                //     "#AA33AA",
                //     "#AAAA22",
                //     "#22AA33",

                // ],
                
            }],
        } ;
        let ctx_countrymix = document.getElementById('countrymix_chart').getContext("2d") ;
        if (energymix_chart){
            energymix_chart.destroy () ;
        }
        energymix_chart = new Chart(ctx_countrymix, {
            type: 'bar',
            data:data,
            options: { 
                scales: {
                y: {
                    title: {
                        text: "Percent",
                        display: true,
                        
                    }
                }
                },
                plugins: {
                legend: {
                    display:false ,
                } 
                }   
            }
    
        });
        
        



    }, false);

}

function rowclick (indexVal){
    let country = countries[indexVal-1] ;
    let cfile = 'data/'+country+'_co2.txt' ;
    let titleStr = "CO2 Time Series for "+country ;
    let year = [] ;
    let co2 = [] ;
    let co2_coal=[];
    let co2_gas=[] ;
    let co2_oil=[] ;
    
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
            co2_coal.push(colVal[5]) ;
            co2_gas.push(colVal[6]) ;
            co2_oil.push(colVal[7]) ;
            co2.push (colVal[4]) ;
        }

        let chartData = year.map((x,i)=>{
            return { 
            x: x,
            y: co2[i]
            };
        }) ;
        let chartData_coal = year.map((x,i)=>{
            return { 
            x: x,
            y: co2_coal[i]
            };
        }) ;
        let chartData_gas = year.map((x,i)=>{
            return { 
            x: x,
            y: co2_gas[i]
            };
        }) ;
        let chartData_oil = year.map((x,i)=>{
            return { 
            x: x,
            y: co2_oil[i]
            };
        }) ;

        document.getElementById('plotHeader').innerHTML = titleStr ;
        let config = {type:'scatter',
            data: { 
                datasets: [{ 
                    label:  'CO2',
                    data: chartData, 
                    backgroundColor: 'rgba(75, 0, 192, 0.99)', 
                    showLine: true,
                },
                { 
                    label: 'CO2 from Coal',
                    data: chartData_coal, 
                    backgroundColor: 'rgba(75, 35, 55, 0.99)', 
                    showLine: true,
                },
                { 
                    label: 'CO2 from Gas',
                    data: chartData_gas, 
                    backgroundColor: 'rgba(75, 192, 0, 0.99)', 
                    showLine: true,
                },{ 
                    label: 'CO2 from Oil',
                    data: chartData_oil, 
                    backgroundColor: 'rgba(192, 0, 35, 0.99)', 
                    showLine: true,
                },
            ], 
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
                            text: "MTonnes CO2",
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
        loadCountryMix(country);



    },false) ;

}