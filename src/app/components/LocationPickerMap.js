// // components/Map.js

// 'use client';
// import { useEffect, useRef } from 'react';

// export default function Map() {
//   const mapRef = useRef(null);
  
//   useEffect(() => {
//     // Load the leaflet map script dynamically
//     const loadLeaflet = async () => {
//       // Load Leaflet CSS
//       const leafletCSS = document.createElement('link');
//       leafletCSS.rel = 'stylesheet';
//       leafletCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/leaflet.css';
//       document.head.appendChild(leafletCSS);
      
//       // Load Leaflet JS
//       const leafletScript = document.createElement('script');
//       leafletScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/leaflet.js';
//       document.body.appendChild(leafletScript);
      
//       leafletScript.onload = () => {
//         initMap();
//       };
//     };
    
//     const initMap = () => {
//       // Initialize the map if Leaflet is available
//       if (window.L && mapRef.current) {
//         // Center on Riyadh coordinates (or your preferred location)
//         const map = window.L.map(mapRef.current).setView([24.7136, 46.6753], 13);
        
//         // Apply a custom theme to the map
//         window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//           className: 'map-tiles'
//         }).addTo(map);
        
//         // Add a custom marker for the office location
//         const officeIcon = window.L.divIcon({
//           html: `<div class="custom-marker office-marker">
//                   <div class="marker-inner" style="background-color: #fa9e1b;"></div>
//                   <div class="pulse" style="border-color: #fa9e1b;"></div>
//                 </div>`,
//           className: '',
//           iconSize: [30, 30],
//         });
        
//         const officeMaker = window.L.marker([24.7136, 46.6753], { icon: officeIcon }).addTo(map);
        
//         // Add a popup to the marker
//         officeMaker.bindPopup("<b>مقر مشروع بادر</b><br>شارع الملك فهد، حي الروضة").openPopup();
        
//         // Add project markers with different colors to represent different status
//         const projectsData = [
//           { lat: 24.7236, lng: 46.6553, title: "تجديد حديقة الأطفال", status: "completed", desc: "تم تجديد وتطوير حديقة الأطفال بالكامل" },
//           { lat: 24.7336, lng: 46.6853, title: "إصلاح طريق الملك عبدالله", status: "in-progress", desc: "جاري العمل على إصلاح وتوسعة الطريق" },
//           { lat: 24.7036, lng: 46.6953, title: "إنارة شارع الأمير سلطان", status: "completed", desc: "تم تركيب أعمدة إنارة جديدة تعمل بالطاقة الشمسية" },
//           { lat: 24.6936, lng: 46.6653, title: "تجديد مركز الحي", status: "planned", desc: "مشروع مستقبلي لتجديد وتطوير مركز الحي" },
//           { lat: 24.7236, lng: 46.7053, title: "صيانة شبكة الصرف الصحي", status: "in-progress", desc: "جاري العمل على صيانة وتحديث شبكة الصرف الصحي" }
//         ];
        
//         // Define different icons for different project statuses
//         const statusIcons = {
//           completed: window.L.divIcon({
//             html: `<div class="custom-marker completed-marker">
//                     <div class="marker-inner" style="background-color: #4CAF50;"></div>
//                   </div>`,
//             className: '',
//             iconSize: [24, 24],
//           }),
//           'in-progress': window.L.divIcon({
//             html: `<div class="custom-marker progress-marker">
//                     <div class="marker-inner" style="background-color: #2196F3;"></div>
//                   </div>`,
//             className: '',
//             iconSize: [24, 24],
//           }),
//           planned: window.L.divIcon({
//             html: `<div class="custom-marker planned-marker">
//                     <div class="marker-inner" style="background-color: #9C27B0;"></div>
//                   </div>`,
//             className: '',
//             iconSize: [24, 24],
//           })
//         };
        
//         // Add markers for each project
//         projectsData.forEach(project => {
//           const marker = window.L.marker([project.lat, project.lng], { 
//             icon: statusIcons[project.status] 
//           }).addTo(map);
          
//           // Add popup with project info
//           marker.bindPopup(`
//             <div style="direction: rtl; text-align: right;">
//               <b>${project.title}</b><br>
//               <span style="color: ${
//                 project.status === 'completed' ? '#4CAF50' : 
//                 project.status === 'in-progress' ? '#2196F3' : '#9C27B0'
//               };">${
//                 project.status === 'completed' ? 'مكتمل' : 
//                 project.status === 'in-progress' ? 'قيد التنفيذ' : 'مخطط له'
//               }</span><br>
//               ${project.desc}
//             </div>
//           `);
//         });
        
//         // Add legend to map
//         const legend = window.L.control({ position: 'bottomright' });
//         legend.onAdd = function() {
//           const div = window.L.DomUtil.create('div', 'map-legend');
//           div.innerHTML = `
//             <div style="background: white; padding: 10px; border-radius: 5px; direction: rtl; text-align: right;">
//               <div style="margin-bottom: 5px; font-weight: bold;">دليل الخريطة</div>
//               <div style="display: flex; align-items: center; margin-bottom: 5px;">
//                 <div style="width: 12px; height: 12px; background-color: #fa9e1b; border-radius: 50%; margin-left: 5px;"></div>
//                 <span>مقر المشروع</span>
//               </div>
//               <div style="display: flex; align-items: center; margin-bottom: 5px;">
//                 <div style="width: 12px; height: 12px; background-color: #4CAF50; border-radius: 50%; margin-left: 5px;"></div>
//                 <span>مشاريع مكتملة</span>
//               </div>
//               <div style="display: flex; align-items: center; margin-bottom: 5px;">
//                 <div style="width: 12px; height: 12px; background-color: #2196F3; border-radius: 50%; margin-left: 5px;"></div>
//                 <span>مشاريع قيد التنفيذ</span>
//               </div>
//               <div style="display: flex; align-items: center;">
//                 <div style="width: 12px; height: 12px; background-color: #9C27B0; border-radius: 50%; margin-left: 5px;"></div>
//                 <span>مشاريع مخطط لها</span>
//               </div>
//             </div>
//           `;
//           return div;
//         };
//         legend.addTo(map);
//       }
//     };
    
//     loadLeaflet();
    
//     return () => {
//       // Cleanup if needed
//     };
//   }, []);
  
//   return (
//     <>
//       <div id="map" ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 1 }}></div>
//       <style jsx global>{`
//         .custom-marker {
//           position: relative;
//         }
        
//         .marker-inner {
//           width: 100%;
//           height: 100%;
//           border-radius: 50%;
//           box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
//         }
        
//         .pulse {
//           position: absolute;
//           top: -5px;
//           left: -5px;
//           right: -5px;
//           bottom: -5px;
//           border: 3px solid;
//           border-radius: 50%;
//           animation: pulse 1.5s infinite;
//         }
        
//         @keyframes pulse {
//           0% {
//             transform: scale(0.5);
//             opacity: 1;
//           }
//           100% {
//             transform: scale(1.5);
//             opacity: 0;
//           }
//         }
        
//         .map-tiles {
//           filter: saturate(0.8) brightness(0.9);
//         }
        
//         .map-legend {
//           font-family: 'Cairo', sans-serif;
//           font-size: 12px;
//         }
//       `}</style>
//     </>
//   );
// }
'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function LocationPickerMap({ onLocationSelect }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapRef.current.dataset.initialized) return;
    mapRef.current.dataset.initialized = true;

    const map = L.map(mapRef.current, {
      center: [31.9632, 35.9304],
      zoom: 9,
      minZoom: 6,
      maxZoom: 16,
      maxBounds: [
        [29.0, 34.0],
        [33.5, 39.0],
      ],
      maxBoundsViscosity: 1.0,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    map.on("click", function (e) {
      const { lat, lng } = e.latlng;

      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
        markerRef.current.on("dragend", (event) => {
          const { lat, lng } = event.target.getLatLng();
          onLocationSelect({ lat, lng });
        });
      } else {
        markerRef.current.setLatLng([lat, lng]);
      }

      onLocationSelect({ lat, lng });
    });
  }, [onLocationSelect]);

  return (
    <div
      ref={mapRef}
      style={{ height: "300px", width: "100%", borderRadius: "8px", zIndex: 1 }}
    />
  );
}
