// CO2 Production and Sources of CO2

const ctx_continent = document.getElementById("continent_chart").getContext("2d"); ;
// const ctx_co2sources = document.getElementById("co2sources_chart").getContext("2d"); 
const ctx_composition = document.getElementById('composition_chart').getContext("2d") ;
let continent_chart  = null ;
let composition_chart = null ;

ifile = "data/continents_energymix.csv" ;
sfile = "data/continents_source.csv" ;

let myCO2 = [[]] ;
let year = [] ;
let datasets = [] ;
let colors = ['#e81416','#ffa500','#faeb36','#79c314','#487de7','#4b369d','#70369d'] ;
const GHG = ['Carbon Dioxide','Methane','Nitrous Oxide', 'Fluorinated Gases'] ;
const Pctage = [76.,16.,6.,2.] ;


const continents=['Africa','Asia','Europe','North America','South America','Oceania'] ;


// const ctx_gtemps = document.getElementById('gtemps_chart').getContext("2d");
function GHG_Composition(){

    var data = {
        labels: GHG,
        // options :
        // {
        //     responsive:True ,
        // },
        datasets: [
            {
                
                data: Pctage,
                backgroundColor: [
                    "#AA3322",
                    "#AA33AA",
                    "#AAAA22",
                    "#22AA33",
                ],
                
            }]
    };

    let composition_chart = new Chart(ctx_composition, {
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

    }

    ) ;

} 


// How does a country get its energy
function energyMix () {
    let bardata_x = ['Coal','Oil','Gas','Nuclear','Renewable'];
    let bardata_y = [] ;
    $ajaxUtils.sendGetRequest (ifile, function(responseText ){
        // console.log(responseText) ;
        let lines = responseText.split('\n') ;
        
        for (let iline=1; iline<lines.length; iline++){
            if (lines[iline].length <10) continue ;
            let columnVal = lines[iline].split(',');
            let code = columnVal[1] ;
            if (code != 'USA') {
                continue ;
            }
            for (i=4; i<9; i++){
                bardata_y.push(columnVal[4]) ;
            }

        }
    },false) ;
}


//country,year,population,gdp,co2,coal_co2,gas_co2,oil_co2,cement_co2,methane

// Sources of CO2 in the atmosphere by continent
function CO2_source () {
    let myCO2 =[] ;
    let year=[] ;
    let CO2Data = [] ;
    let CO2Sources = [] ;
    let CO2Sources_asia = [] ;
    let CO2Sources_NA = [] ;
    let CO2Cols = ['Coal','Gas','Oil','Cement'] ;
    let bardataWorld, bardataAsia, bardataNA ;

    $ajaxUtils.sendGetRequest (sfile, function(responseText ){
        // console.log(responseText) ;
        let lines = responseText.split('\n') ;

        for (let iline=1; iline < lines.length; iline++){
            if (lines[iline].length<10) continue ;
            columnVal = lines[iline].split(",") ;
            if (columnVal[1] != "2022") continue ;
            if (columnVal[0]=="World") {
                for (let icol=5; icol<9; icol++) {
                    CO2Sources.push(columnVal[icol]) ;
                }
                bardataWorld = {
                    labels : CO2Cols ,
                    datasets : [{
                        label : 'World',
                        data : CO2Sources,

                        backgroundColor: 'rgba(70, 192, 192, 0.6)',

                    }]
                }
            }
            if (columnVal[0]=="Asia") {
                for (let icol=5; icol<9; icol++) {
                    CO2Sources_asia.push(columnVal[icol]) ;
                }
                bardataAsia = {
                    labels : CO2Cols ,
                    datasets : [{
                        label : 'Asia',
                        data : CO2Sources_asia,

                        backgroundColor: 'rgba(70, 192, 40, 0.8)',

                    }]
                }
            }
            if (columnVal[0]=="North America") {
                for (let icol=5; icol<9; icol++) {
                    CO2Sources_NA.push(columnVal[icol]) ;
                }
                bardataNA = {
                    labels : CO2Cols ,
                    datasets : [{
                        label : 'North America',
                        data : CO2Sources_NA,

                        backgroundColor: 'rgba(70, 40, 192, 0.8)',

                    }]
                }
            }

            
        }

        for (icont=0 ; icont < continents.length; icont++) {
            for (let iline=1; iline<lines.length; iline++){
                if (lines[iline].length<10) continue ;
                columnVal = lines[iline].split(",") ;
                if (columnVal[0] != continents[icont]) continue ;
                myCO2.push(columnVal[4]) ;
                year.push(columnVal[1]);
            }
            CO2Data.push( myCO2.map((x,i)=>{
                return { 
                x: year[i],
                y: x
                };
            }) );
            myCO2 = [] ;
            year=[] ;
            datasets.push({
                label: continents[icont],
                data: CO2Data[icont],
                backgroundColor: colors[icont] ,

                showLine : true ,



            });



            
        }

        // myCO2=[] ;
        // year=[] ;
        // for (let iline=1; iline<lines.length; iline++){
        //     if (lines[iline.length]<10) continue ;
        //     columnVal = lines[iline].split(",") ;
        //     if (columnVal[0] != "North America") continue ;
        //     console.log (lines[iline]) ;
        //     myCO2.push(columnVal[4]) ;
        //  
        let config = {type:'scatter',
            data: { 
                datasets : datasets 
                , 
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
                        ticks: {
                            callback: function (value) {
                                // return value.toLocaleString();
                                return value;
                            }
                        },
                        min: minYear,
                        display : true ,

                        
                        
                        
                    },
                    y: {
                        title: {
                            text: "CO2 (Metric tonnes)",
                            display: true
                        }
                        
                    }
                    
                },
            
            }
        };
        if (continent_chart){
            continent_chart.destroy();
        }
        continent_chart = new  Chart(ctx_continent, config) ;

        let data = {
            labels: CO2Cols,
            datasets : [{
                label: 'World',
                data: CO2Sources, 
                backgroundColor: 'rgba(70, 192, 192, 0.6)',
            },{
                label: 'Asia',
                data: CO2Sources_asia,
                backgroundColor: 'rgba(70, 192, 40, 0.8)',
            },{
                label : 'North America',
                data : CO2Sources_NA,

                backgroundColor: 'rgba(70, 40, 192, 0.8)',
            }
        
            ]
        }

        // co2source_chart = new Chart(ctx_co2sources, {
        //     type: 'bar',
        //     labels : CO2Cols,
        //     data : data

                
            
            
            // {
            //     datasets : [
            //         bardataWorld,
            //         bardataAsia,
            //         bardataNA
            //     ]
            // }
            

        //}
        //) ;



    },false) ;

}
        
CO2_source () ;
GHG_Composition() ;