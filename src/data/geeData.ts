export const dataTemperature = {
    api: 'ECMWF/ERA5_LAND/MONTHLY_AGGR',
    parametres: [
        "soil_temperature_level_1",
        "soil_temperature_level_2",
        "soil_temperature_level_3",
        "soil_temperature_level_4"
    ],
    defaultStartDate: "2014-06-01",
    defaultEndDate: "2015-01-01"
}

export const dataPrecipitation = {
    api: 'ECMWF/ERA5_LAND/MONTHLY_AGGR',
    parametres: [
        "total_precipitation_sum"
    ],
    defaultStartDate: "2014-06-01",
    defaultEndDate: "2015-01-01"
}

export const dataEvapotranspiration = {
    api: 'ECMWF/ERA5_LAND/MONTHLY_AGGR',
    parametres: [
        "evaporation_from_vegetation_transpiration_sum",
        "total_evaporation_sum"
    ],
    defaultStartDate: "2014-06-01",
    defaultEndDate: "2015-01-01"
}

export const dataRadiationSolaire = {
    api: 'ECMWF/ERA5_LAND/MONTHLY_AGGR',
    parametres: [
        "surface_solar_radiation_downwards_sum"
    ],
    defaultStartDate: "2014-06-01",
    defaultEndDate: "2015-01-01"
}