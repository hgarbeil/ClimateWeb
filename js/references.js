const referenceNavItem = document.getElementById('navlink_reference') ;



let mainrefstring = `<section class="maincontent_top">
    <div class="ref-container">
    <h2>References and Resources</h2>
    
            <ul>
                <li>Hannah Ritchie and Pablo Rosado (2020) - <a href="https://ourworldindata.org/energy-mix" 
                    target="_blank">“Energy Mix”</a> , Published online at OurWorldinData.org , accessed Oct 2024
                </li>
                <li>NASA, <a href="https://science.nasa.gov/climate-change/" target="_blank">NASA Climate Change.</a> Published Online, accessed Jan 2025.
                </li>
                <li>NOAA Education, <a href="https://www.noaa.gov/education/resource-collections/climate/climate-change-impacts" target="_blank">NOAA Climate Change Impacts. </a> Published online at "https://www.noaa.gov/education/resource-collections/climate/climate-change-impacts", accessed October 2024
                </li>
                <li>Robert Rhode, Berkley Earth (2023), <a href="https://berkeleyearth.org/global-temperature-report-for-2023/" target="_blank"> 
                 Global Temperature Report for 2023"</a> , published online at "https://berkeleyearth.org/global-temperature-report-for-2023/" , accessed Oct 2024
                 </li>
                 <li>Berkley Earth(2025),<a href="https://berkeleyearth.org/whats-new/?cat=temperature-updates" target="_blank">Berkley Earth Temperature Updates. </a>Published online at "https://berkeleyearth.org/whats-new/?cat=temperature-updates"
                 </li>
                <li>Scripps Institute of Oceanography, UC San Diego , <a href="https://scrippsco2.ucsd.edu/" target="_blank">Scripps CO2 Program, </a> Published online at "https://scrippsco2.ucsd.edu/", accessed October 2024
                </li>
                <li>Scripps Institute of Oceanography, UC San Diego , <a href="https://scrippsco2.ucsd.edu/data/atmospheric_co2/primary_mlo_co2_record.html" target="_blank">Mauna Loa CO2 Data | Scripps CO2 Program | Scripps Institute of Oceanography</a> , Published online at "https://scrippsco2.ucsd.edu/data/atmospheric_co2/primary_mlo_co2_record.html" , accessed October 2024
                </li>
                
                <li>United Nations, <a href="https://www.un.org/en/climatechange/what-is-climate-change" 
                target="_blank">What is Climate Change? </a> Published online at "https://www.un.org/en/climatechange/what-is-climate-change" , accessed October 2024
                </li>
                <li>Wikipedia, <a href="https://en.wikipedia.org/wiki/List_of_countries_by_renewable_electricity_production" target="_blank"> "List Of Countries By Renewable Electricity Production"</a> 
                    , Published online at "https://en.wikipedia.org/wiki/List_of_countries_by_renewable_electricity_production", accessed October 2024
                </li>
            </ul>
    </div>
    
    </section>` ;
            
function loadReferences() {
    for (let navitem of navItemsEls) {
        navitem.classList.remove("active") ;
    }
    referenceNavItem.classList.add('active') ;
    mainEl.innerHTML=mainrefstring;
}
