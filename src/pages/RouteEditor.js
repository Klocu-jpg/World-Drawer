import React, { useState } from "react";
import Map from "../components/Map";

const RouteEditor = () => {
  const [routeData, setRouteData] = useState([]);

  const handleRouteChange = (newRoute) => {
    setRouteData(newRoute);
  };

  return (
    <div>
      <h2 className="p-4">Draw Your Route</h2>
      <Map onRouteChange={handleRouteChange} />
    </div>
  );
};

export default RouteEditor;
