import React, { useState, useCallback } from 'react'
import MapGL, { Marker, FlyToInterpolator } from '@goongmaps/goong-map-react';

import { useDispatch, useSelector } from 'react-redux';

const Map = () => {
    const accessToken = '5ksDM491xzsTQWA5cnftSALx6MwweUh0xCBUkFsN';
    const mapEx = [{ latitude: 10.876327156372929, longitude: 106.80124231053884 },
    { latitude: 10.876432517466004, longitude: 106.80320568755168 }]

    const [viewport, setViewport] = useState({
        latitude: 10.88102,
        longitude: 106.80536,
        zoom: 15,
        bearing: 0,
        pitch: 0
    })

    const handleSelect = (longitude, latitude) => {
        setViewport({
            ...viewport, zoom: 15,
            latitude, longitude,
            transitionInterpolator: new FlyToInterpolator({ speed: 1.2 })
        })
        //     transitionDuration: 'auto'})
        // setViewport({
        //     ...viewport, 
        //     , transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
        //     transitionDuration: 'auto'
        // })
    };

    return (<>
        <h1> Map </h1>
        <MapGL
            {...viewport}
            width="80%"
            height="80%"
            mapStyle='https://tiles.goong.io/assets/goong_map_web.json'
            onViewportChange={setViewport}
            showCompass="true"
            goongApiAccessToken={accessToken}
        >
        <h3>Camera Transition</h3>
        {mapEx.map(mcp => <Marker latitude={mcp.latitude} longitude={ mcp.longitude}>
            <input
                type="radio"
                onClick={() => handleSelect(mcp.longitude, mcp.latitude)}
            /></Marker>)}
    </MapGL>


    </>)
}

export default Map