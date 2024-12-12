import React, { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Funkcja do obliczania odległości pomiędzy dwoma punktami
const calculateDistance = (points) => {
  let distance = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const pointA = points[i];
    const pointB = points[i + 1];
    const lat1 = pointA.lat * Math.PI / 180;
    const lon1 = pointA.lng * Math.PI / 180;
    const lat2 = pointB.lat * Math.PI / 180;
    const lon2 = pointB.lng * Math.PI / 180;
    const R = 6371; // Promień Ziemi w km
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distance += R * c; // w km
  }
  return distance;
};

const MapComponent = () => {
  const [points, setPoints] = useState([]);
  const [distance, setDistance] = useState(0);
  const [drawing, setDrawing] = useState(false); // Zmienna do wykrywania trybu rysowania
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  // Inicjalizowanie Mapbox
  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1Ijoia2xvY3UiLCJhIjoiY200bG56aXd3MDM0ZTJrc2M4aW41d2JrYiJ9.RUYAvZ1UVkTPihL9UlwLlA"; // Twój token Mapbox
    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0], // Centrum mapy
      zoom: 2, // Początkowy poziom zoomu
      pitch: 0, // Wyłącz obrót w poziomie
      bearing: 0, // Wyłącz obrót mapy
      dragRotate: false, // Wyłącz rotację mapy przy przeciąganiu
      scrollZoom: true, // Włącz zoomowanie przy użyciu scrolla
    });

    // Dodaj kontrolki zoomu i navigacji
    mapInstance.current.addControl(new mapboxgl.NavigationControl());

    return () => mapInstance.current.remove();
  }, []);

  // Funkcja rysująca punkty na mapie
  const drawPointsOnMap = () => {
    points.forEach((point, index) => {
      // Dodajemy czerwone kropki na mapie
      new mapboxgl.Marker({ color: "red" })
        .setLngLat([point.lng, point.lat])
        .addTo(mapInstance.current);
      
      // Rysowanie grubej czerwonej linii między punktami
      if (index > 0) {
        const lineCoordinates = [
          [points[index - 1].lng, points[index - 1].lat],
          [point.lng, point.lat],
        ];

        // Dodanie linii do mapy
        mapInstance.current.addLayer({
          id: `line-${index}`,
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: lineCoordinates,
              },
            },
          },
          paint: {
            'line-color': '#ff0000',
            'line-width': 4, // Grubość linii
          },
        });
      }
    });
  };

  // Zdarzenie kliknięcia na mapie
  useEffect(() => {
    if (drawing) {
      mapInstance.current.on("click", (e) => {
        const newPoint = { lat: e.lngLat.lat, lng: e.lngLat.lng };
        console.log("Kliknięty punkt:", newPoint);
        const updatedPoints = [...points, newPoint];
        setPoints(updatedPoints);
        const updatedDistance = calculateDistance(updatedPoints);
        setDistance(updatedDistance);
        drawPointsOnMap();
      });
    }
  }, [drawing, points]);

  // Włączanie i wyłączanie trybu rysowania
  const toggleDrawing = () => {
    setDrawing((prevDrawing) => {
      if (!prevDrawing) {
        // Jeśli zaczynamy rysowanie, rysujemy punkty
        console.log("Rozpoczynanie rysowania...");
      } else {
        console.log("Zatrzymywanie rysowania...");
      }
      return !prevDrawing;
    });
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDrawing}
        className="absolute top-5 left-5 z-10 bg-red-500 text-white p-2 rounded"
      >
        {drawing ? "Stop Drawing" : "Start Drawing"}
      </button>
      <div
        ref={mapContainer}
        style={{ height: "100vh", width: "100%" }}
        className="map-container"
      />
      {/* Wyświetlanie dystansu i punktów na dole */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800 text-white text-lg text-center">
        Distance: {distance.toFixed(2)} km
        <div className="mt-2">
          Route Points: {points.map((point, index) => (
            <span key={index} className="text-sm">
              [{point.lat.toFixed(5)}, {point.lng.toFixed(5)}]{" "}
              {index < points.length - 1 && ", "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
