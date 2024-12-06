import pandas as pd
import numpy as np
import panel as pn
import plotly.express as px
import math
import requests 
from bs4  import  BeautifulSoup


renew_file = 'https://en.wikipedia.org/wiki/List_of_countries_by_renewable_electricity_production'

renew_page = requests.get(renew_file).text
soup = BeautifulSoup(renew_page, 'html.parser')
table = soup.find('table', class_="wikitable sortable")
df = pd.read_html(renew_file)[0]
# df = df.iloc[0:20]
df.columns=['Country','Pct_Renewable','Renewable GWh','Hydro','Wind','Solar','Biofuel','Geoth']
df = df.replace('%','',regex=True)
df1 = df.sort_values(by=['Renewable GWh'],ascending=False)
# df = pd.read_html(str(table))
# df = pd.concat(df)
df.to_csv('../data/country/top_renewable.csv',index=False) 
df1.to_csv('../data/country/top_renewable_gwh.csv',index=False) 


countries = ['World','China','United States','India','Germany','France','United Kingdom','Russia','Japan','Brazil','Iran']
# countries=['United States','Russia','China','Australia','Japan','Germany','India','United Kingdom', 'France','Indonesia','Iceland']
continents=['Africa','Asia','Europe','North America','South America','Oceania','World']
sources=['co2_coal','co2_oil','co2_gas','co2_cement']
components=['co2','share_global_co2','co2_per_gdp','co2_per_capita','methane']
comp_labels=['CO2 (Million Tonnes)','Fraction Share Global','CO2 per GDP','Tonnes per Person','Methane (Million Tonnes)']
comp_max=[10000, 50, 1.2, 20, 1200]



def round_to_sigfigs(x, sigfigs):
    """Round a number to a specified number of significant figures."""
    if x == 0:
        return 0
    if pd.isna(x):
        return x
    return round(x, -int(np.floor(np.log10(abs(x)))) + sigfigs - 1)


# get dataframe from wikipedia renewable table



lastyears = list(map(str,[*range(2020,1950,-1)]))

# mloa_file='https://scrippsco2.ucsd.edu/assets/data/atmospheric/stations/in_situ_co2/daily/daily_in_situ_co2_mlo.csv'
mloa_file='https://scrippsco2.ucsd.edu/assets/data/atmospheric/stations/in_situ_co2/monthly/monthly_in_situ_co2_mlo.csv'
mloa_df = pd.read_csv(mloa_file,skiprows=65)
mloa_df = mloa_df.iloc[:,0:6]
mloa_df.columns=['Yr','Mn','Dy','DecYear','CO2','CO2Adj']

# convert co2 to float
mloa_df.dropna(inplace=True)
#mloa_df['Date']=pd.to_datetime(dict(year=mloa_df.Yr,month=mloa_df.Mn,day=mloa_df.Dy))
mloa_df.to_csv('../data/mloa_co2.csv', index=False) ; 


# energy mix --- needs pre-processing
# https://ourworldindata.org/grapher/per-capita-energy-stacked ## source is downloaded from this page
dfmix = pd.read_csv('../data/per-capita-energy-stacked.csv')
dfcont = dfmix[dfmix.Entity.isin(continents)]
print(dfcont.head(10))
dfcont.columns=['Continent','code','year','coal','oil','gas','nuclear','hydro','wind','solar','other']
# get component fractions ie normalize
dfcont['total']=dfcont.iloc[:,3:11].sum(axis=1)
# dfcont['windhydrocoal']=dfcont[:,7:10].sum(axis=1)
dfcont['Coal']=dfcont['coal']/dfcont['total']
dfcont['Oil']=dfcont['oil']/dfcont['total']
dfcont['Gas']=dfcont['gas']/dfcont['total']
dfcont['Nuclear']=dfcont['nuclear']/dfcont['total']
dfcont['Hydro']=dfcont['hydro']/dfcont['total']
dfcont['Wind']=dfcont['wind']/dfcont['total']
dfcont['Solar']=dfcont['solar']/dfcont['total']
dfcont['Other']=dfcont['other']/dfcont['total']
dfcont.drop(columns=['coal','oil','gas','nuclear','hydro','solar','wind'],inplace=True)

dfcont['Coal']= dfcont['Coal'].apply(lambda x: round_to_sigfigs(x, 4))
dfcont['Oil']= dfcont['Oil'].apply(lambda x: round_to_sigfigs(x, 4))
dfcont['Gas']= dfcont['Gas'].apply(lambda x: round_to_sigfigs(x, 4))
dfcont['Nuclear']= dfcont['Nuclear'].apply(lambda x: round_to_sigfigs(x, 4))
dfcont['Hydro']= dfcont['Hydro'].apply(lambda x: round_to_sigfigs(x, 4))
dfcont['Wind']= dfcont['Wind'].apply(lambda x: round_to_sigfigs(x, 4))
dfcont['Solar']= dfcont['Solar'].apply(lambda x: round_to_sigfigs(x, 4))
dfcont['Other']= dfcont['Other'].apply(lambda x: round_to_sigfigs(x, 4))

dfworld = dfcont[dfcont['Continent']=="World"]
dfworld.to_csv ('../data/world_energymix.csv', index=False)

# dfcont = dfcont.dropna() 
dfcont.to_csv ('../data/continents_energymix.csv', index=False)
dfmix = dfmix[dfmix.Entity.isin(countries)]
dfmix.columns=['country','code','year','coal','oil','gas','nuclear','hydro','wind','solar','other']
dfmix = dfmix[dfmix['year']==2023]
# dfmix=dfmix.dropna()

#dfmix['total']=dfmix['coal','oil','gas','nuclear','hydro','wind','solar','other'].sum(axis=1)

# get component fractions ie normalize
dfmix['total']=dfmix.iloc[:,3:11].sum(axis=1)
dfmix['Coal']=(dfmix['coal']/dfmix['total']).apply(lambda x: round_to_sigfigs(x, 4))
dfmix['Oil']=(dfmix['oil']/dfmix['total']).apply(lambda x: round_to_sigfigs(x, 4))
dfmix['Gas']=(dfmix['gas']/dfmix['total']).apply(lambda x: round_to_sigfigs(x, 4))
dfmix['Nuclear']=(dfmix['nuclear']/dfmix['total']).apply(lambda x: round_to_sigfigs(x, 4))
dfmix['Hydro']=(dfmix['hydro']/dfmix['total']).apply(lambda x: round_to_sigfigs(x, 4))
dfmix['Wind']=(dfmix['wind']/dfmix['total']).apply(lambda x: round_to_sigfigs(x, 4))
dfmix['Solar']=(dfmix['solar']/dfmix['total']).apply(lambda x: round_to_sigfigs(x, 4))
dfmix['Other']=(dfmix['other']/dfmix['total']).apply(lambda x: round_to_sigfigs(x, 4))
dfmix = dfmix.drop(['coal','oil','gas','nuclear','hydro','wind','solar','other'],axis=1)
dfmix = dfmix.sort_values(by=['total'],ascending=False)
# dfmix.to_csv('../data/country_energymix_2023.csv',index=False) 

count = 0
for cntry in countries :
    dfmix1 = dfmix[dfmix['country']==cntry]
    if count == 0 :
        tmp = dfmix1.copy()
    else :
        tmp = pd.concat([tmp,dfmix1])
    count=count+1
tmp.to_csv('../data/country_energymix_2023.csv',index=False) 
print (tmp)


# print (dfmix.sample(5))



df = pd.read_csv('https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv')
# cache data to improve dashboard performance
if 'data' not in pn.state.cache.keys():

    df = pd.read_csv('https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv')

    pn.state.cache['data'] = df.copy()

else: 

    df = pn.state.cache['data']



# data cleanup
df=df.fillna(0)
print(df.columns)
df=df[['country','year','population','gdp','co2','coal_co2','gas_co2','oil_co2','cement_co2','methane']]
df_major=df[(df['country'].isin(countries)) & (df['year']>1940)]
# countries_1 = df['country'].unique()
# print(countries_1)
#df_countries_full=df[df.iso_code!='0']
df_continents_full = df[(df['country'].isin(continents)) & (df['year']>1940) ]
df_major.to_csv ("../data/country_source.csv", index=False)
df_continents_full.to_csv("../data/continents_source.csv", index=False)
# df_countries=df_countries_full[df_countries_full.year==2018]
#print(df_major.sample(30))

for country in countries :
    outfile = '../data/country/'+country+'_co2.txt'
    df_major[(df['country']==country)].to_csv('../data/'+outfile,index=False)
df_major_year=df_major[df_major.year==2022]
df_major_year=df_major_year.sort_values(by=['co2'],ascending=False)
df_major_year.to_csv('../data/countries_source_oneyear.csv', index=False)




yearmks = [*range(1950,2020,10)]

# fig_mloa=px.line(mloa_df, x='Date',y='co2',title='Mauna Loa CO2 Measurements').update_layout(yaxis_title='CO2 PPM')
# fig_choro=px.choropleth(df_countries,locations='iso_code',color='co2_per_capita',
#     color_continuous_scale=px.colors.sequential.Plasma, range_color=(0,10000))
# fig_choro.data[0].colorbar.len=.3;
# fig_choro.data[0].colorbar.lenmode='fraction';
