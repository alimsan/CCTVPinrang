'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Hls from 'hls.js';
import L from 'leaflet';

// Interface untuk Icon Default
interface IconDefault extends L.Icon.Default {
  _getIconUrl?: string;
}

// Tipe data untuk CCTV
interface CCTV {
  id: number;
  hls_video: string;
  lat: string;
  long: string;
  aktif: string;
}

// Komponen Video Player yang diperbarui
const VideoPlayer = ({ videoUrl, isPopupOpen }: { videoUrl: string; isPopupOpen: boolean }) => {
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = document.getElementById(`video-${videoUrl}`) as HTMLVideoElement;
    
    if (Hls.isSupported() && video && isPopupOpen) {
      hlsRef.current = new Hls({
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 3,
      });
      
      hlsRef.current.loadSource(videoUrl);
      hlsRef.current.attachMedia(video);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.pause();
        video.src = "";
        video.load();
      }
    };
  }, [videoUrl, isPopupOpen]);

  if (!isPopupOpen) return null;

  return (
    <div style={{ width: '300px', height: '200px' }}>
      <video
        id={`video-${videoUrl}`}
        controls
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

// Komponen Marker dengan Video
const MarkerWithVideo = ({ cctv }: { cctv: CCTV }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <Marker
      key={cctv.id}
      position={[parseFloat(cctv.lat), parseFloat(cctv.long)]}
    >
      <Popup
        eventHandlers={{
          add: () => setIsPopupOpen(true),
          remove: () => setIsPopupOpen(false)
        }}
      >
        <VideoPlayer 
          videoUrl={cctv.hls_video} 
          isPopupOpen={isPopupOpen}
        />
      </Popup>
    </Marker>
  );
};

export default function Home() {
  const [cctvData, setCctvData] = useState<CCTV[]>([]);

  useEffect(() => {
    // Fix Leaflet icon
    fixLeafletIcon();

    // Fetch data CCTV
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.9.7/test-laravel/public/map.json');//http://test-laravel.test/map.json
        const json = await response.json();
        setCctvData(json.data);
      } catch (error) {
        console.error('Error fetching CCTV data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={[-3.809436836265215, 119.6495090576475]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {cctvData.map((cctv) => (
          <MarkerWithVideo key={cctv.id} cctv={cctv} />
        ))}
      </MapContainer>
    </div>
  );
}

// Fix untuk icon Leaflet di Next.js
const fixLeafletIcon = () => {
  delete ((L.Icon.Default.prototype as IconDefault)._getIconUrl);
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};
