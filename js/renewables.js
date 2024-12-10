// Renewable energy page

const renewNavItem = document.getElementById('navlink_renewable') ;

let renewFile = 'data/country/top_renewable.csv' ;
let renewGWHFile = 'data/country/top_renewable_gwh.csv' ;

let mainstringRenew = `<section class="maincontent_top">
            <div class="main-left">
                 <h2>What is renewable energy?</h2>
                <div class="textdiv">
                   
                    <p class="leftinfo">From the <a href="https://www.un.org/en/climatechange/what-is-renewable-energy" target="_blank">
                    United Nations Climate Action</a> website ...</p><em><p>Renewable energy is energy derived from natural sources that are replenished at a higher rate than they are consumed. Sunlight and wind, for example, are such sources that are constantly being replenished. Renewable energy sources are plentiful and all around us.
                </p><p>
                Fossil fuels - coal, oil and gas - on the other hand, are non-renewable resources that take hundreds of millions of years to form. Fossil fuels, when burned to produce energy, cause harmful greenhouse gas emissions, such as carbon dioxide.
                </p><p>
                Generating renewable energy creates far lower emissions than burning fossil fuels. Transitioning from fossil fuels, which currently account for the lion’s share of emissions, to renewable energy is key to addressing the climate crisis.
                </p><p>
                Renewables are now cheaper in most countries, and generate three times more jobs than fossil fuels.</p></em>

                </div>
                <button class="furtherinfo" onclick="furtherInfo(7)">Further Info</button>
            </div>
            <div class="main-right">
                <h2 >Renewable Energy Sources</h2>
                <div class="listdiv">
                    <ul>
                    <li><b>Solar Energy</b> - Globally, the most abundant source of renewable energy. Numerous existing technologies exist and are being developed for harnessing solar energy.</li>
                    <li><b>Wind Energy</b> - Onshore and offshore turbines harness wind energy with continually improving technology to maximize energy production.</li>
                    <li>Geothermal Energy - Tapping in to geothermal subsurface reervoirs, heat from hot fluids is used for heating and conversion to electricity.</li>
                    <li>Hydropower Energy</li>
                    <li>Ocean Energy - Includes wave and tidal energy sources.</li>
                    <li>Bioenergy</li>
                    </ul>
                    
                </div>
                <button id="gtemps_info" class="furtherinfo" onclick="furtherInfo(7)">Further Info</button>
            </div>
        </section>
        <section class="maincontent_bottom">
            <div class="main-full">
                <div class="split-div">
                    <div class="split-div-half">
                        <h2>Top Countries by Percent Renewable</h2>
                        <div id="table_renewables" class="split-div-left"> </div>
                    </div>

                    <div class="split-div-half">
                        <h2>Top Countries by Quantity Renewable</h2>
                        <div id="table_renewablesGWH" class="split-div-right"></div>
                    </div>
                    
                        
                    
                   
                </div>
            </div>
        </section>` ;





// this function called when "Renewable Energy" navbar button clicked
function loadRenewables () {
    for (let navitem of navItemsEls) {
        navitem.classList.remove("active") ;
    }
    renewNavItem.classList.add('active') ;
    mainEl.innerHTML = mainstringRenew ;
    top_renewables() ;

}

function top_renewables(){

    let tableEl ;
    console.log("in renewables") ;
    let makeTableStr = '<table id="myRenewTable" class="renewTable" ><thead><tr><th>Country</th><th>% Renewable</th><th>Renewable GWH</th><th>Hydro</th><th>Wind</th><th>Solar</th></tr></thead><tbody>'

    $ajaxUtils.sendGetRequest(renewFile, function(responseText){
        let lines=responseText.split('\n') ;
        for (let iline=1; iline<25; iline++){
            if (lines[iline].length <7) continue ;
            let colVal = lines[iline].split(',') ;
            if (iline==0) {

            }
            let rowstr = '' ;
            rowstr = `<tr class="countryRow"" ><td>${colVal[0]}</td><td>${colVal[1]}</td><td>${colVal[2]}</td><td>${colVal[3]}</td>
                <td>${colVal[4]}</td><td>${colVal[5]}</td></tr>` ;
            makeTableStr = makeTableStr + rowstr ;

        }
        makeTableStr = makeTableStr + '</tbody></table>' ;
        tableEl =document.getElementById('table_renewables') ;
        
        tableEl.innerHTML = makeTableStr ;
        top_renewable_gwh () ;
        // $(function() {
        //     $("#myRenewTable").tablesorter();
        //   });

    }, false) ;

    
    
}

function top_renewable_gwh(){

    let makeTableStr ='';
    makeTableStr = '<table id="myRenewGWHTable" class="renewTable" ><thead><tr><th>Country</th><th>% Renewable</th><th>Renewable GWH</th><th>Hydro</th><th>Wind</th><th>Solar</th></tr></thead><tbody>';


    $ajaxUtils.sendGetRequest(renewGWHFile, function(responseText){
        let lines=responseText.split('\n') ;
        for (let iline=1; iline<25; iline++){
            if (lines[iline].length <7) continue ;
            let colVal = lines[iline].split(',') ;
            if (iline==0) {

            }
            let rowstr = '' ;
            rowstr = `<tr class="countryRow" ><td>${colVal[0]}</td><td>${colVal[1]}</td><td>${colVal[2]}</td><td>${colVal[3]}</td>
                <td>${colVal[4]}</td><td>${colVal[5]}</td></tr>` ;
            makeTableStr = makeTableStr + rowstr ;

        }
        makeTableStr = makeTableStr + '</tbody></table>' ;
        tableEl =document.getElementById('table_renewablesGWH') ;
        
        tableEl.innerHTML = makeTableStr ;
        // $(function() {
        //     $("#myRenewTable").tablesorter();
        //   });

    }, false) ;


}