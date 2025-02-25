'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Hls from 'hls.js';
import L from 'leaflet';
import Search from './Search';
import { CCTV } from '@/types';  // Import dari types

// Pindahkan semua interface dan komponen yang ada ke sini
interface IconDefault extends L.Icon.Default {
  _getIconUrl?: string;
}

// Data statis CCTV
const staticCCTVData = {
  data: [
    {
      id: 1,
      nama: "CCTV Gedung Golkar",
      hls_video: "http://103.113.26.95:8888/gedunggolkar/index.m3u8",
      lat: "-3.7909821638210297",
      long: "119.65223146771226",
      aktif: "1",
      created_at: null,
      updated_at: "2024-11-08T17:38:31.000000Z"
    },
    {
      id: 2,
      nama: "CCTV Jalan Wahidin",
      hls_video: "http://103.113.26.95:8888/jlwahidin/index.m3u8",
      lat: "-3.7918868032606445",
      long: "119.64970931334966",
      aktif: "1",
      created_at: null,
      updated_at: "2024-11-08T17:38:31.000000Z"
    },
    {
      id: 3,
      nama: "Mall Selatan Golkar",
      hls_video: "http://103.113.26.95:8888/selgedunggolkar/index.m3u8",
      lat: "-3.791216190122012",
      long: "119.65195723562368",
      aktif: "1",
      created_at: null,
      updated_at: "2024-11-08T17:38:31.000000Z"
    },
    {
      id: 4,
      nama: "Mall DPN Golkar",
      hls_video: "http://103.113.26.95:8888/malldpngolkar/index.m3u8",
      lat: "-3.7911482917039527",
      long: "119.65183756619382",
      aktif: "1",
      created_at: null,
      updated_at: "2024-11-08T17:38:31.000000Z"
    },
    {
      id: 5,
      nama: "Sudut Lagi",
      hls_video: "http://103.113.26.95:8888/sudutlagi/index.m3u8",
      lat: "-3.802593473182116",
      long: "119.64946895403801",
      aktif: "1",
      created_at: null,
      updated_at: "2024-11-08T17:38:31.000000Z"
    },
    {
      id: 6,
      nama: "Simpang 5 polmas",
      hls_video: "http://103.113.26.95:8888/simpanglimapolmas/index.m3u8",
      lat: "-3.786845460105196",
      long: "119.6524968983068",
      aktif: "1",
      created_at: null,
      updated_at: "2024-11-08T17:38:31.000000Z"
    },
    {
      id: 7,
      nama: "Simpang 5 pare",
      hls_video: "http://103.113.26.95:8888/simpanglimapare/index.m3u8",
      lat: "-3.787383064092084",
      long: "119.65257237962545",
      aktif: "1",
      created_at: null,
      updated_at: "2024-11-08T17:38:31.000000Z"
    },
    {
      id: 8,
      nama: "Pasar Sore utara",
      hls_video: "http://103.113.26.95:8888/pasarsoreutara/index.m3u8",
      lat: "-3.7951014414879207",
      long: "119.65177009730992",
      aktif: "1",
      created_at: null,
      updated_at: "2024-11-08T17:38:31.000000Z"
    },
    {
      id: 9,
      nama: "Pasar Sore selatan",
      hls_video: "http://103.113.26.95:8888/pasarsoreselatan/index.m3u8",
      lat: "-3.7954831745306934",
      long: "119.65174379548331",
      aktif: "1",
      created_at: null,
      updated_at: "2024-11-08T17:38:31.000000Z"
    },
    {
      id: 10,
      nama: "Sultan Hasanuddin",
      hls_video: "http://103.113.26.95:8888/sultanhasanuddin/index.m3u8",
      lat: "-3.7954831745306934",
      long: "119.65174379548331",
      aktif: "1",
      created_at: null,
      updated_at: "2024-11-08T17:38:31.000000Z"
    },
    {
      id: 11,
      nama: "kesma",
      hls_video: "http://103.113.26.95:8888/kesma1/index.m3u8",
      lat: "-3.8031759787558475",
      long: "119.65168021878448",
      aktif: "1",
      created_at: null,
      updated_at: "2024-11-08T17:38:31.000000Z"
    },
    {
      id: 12,
      nama: "Sultan hasanudding bulog",
      hls_video: "http://103.113.26.95:8888/sulhasbulog/index.m3u8",
      lat: "-3.8029870314718908",
      long: "119.65186292911933",
      aktif: "1",
      created_at: null,
      updated_at: "2024-11-08T17:38:31.000000Z"
    }
  ]
};

// Komponen VideoPlayer dengan styling yang lebih baik
const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current);
      
      return () => {
        hls.destroy();
      };
    }
  }, [videoUrl]);

  return (
    <video 
      ref={videoRef}
      controls
      style={{ width: '400px', height: '300px' }}
      className="rounded-lg shadow-lg"
    />
  );
};

// Komponen MarkerWithVideo dengan popup yang lebih besar
const MarkerWithVideo = ({ cctv }: { cctv: CCTV }) => {
  const position: [number, number] = [parseFloat(cctv.lat), parseFloat(cctv.long)];
  
  return (
    <Marker position={position}>
      <Popup minWidth={420}>
        <div className="popup-content" style={{ width: '400px' }}>
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">CCTV : {cctv.nama}</h3>
            <p className="mb-2">Status: {cctv.aktif === '1' ? 'Aktif' : 'Tidak Aktif'}</p>
            {cctv.aktif === '1' && (
              <div className="video-container w-full">
                <VideoPlayer videoUrl={cctv.hls_video} />
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// Komponen untuk mengontrol peta
const MapController = ({ cctv }: { cctv: CCTV[] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (cctv.length === 1) {
      map.setView(
        [parseFloat(cctv[0].lat), parseFloat(cctv[0].long)],
        18
      );
    }
  }, [cctv, map]);
  
  return null;
};

const Map = () => {
  const [cctvData, setCctvData] = useState<CCTV[]>(staticCCTVData.data);
  const [filteredCctv, setFilteredCctv] = useState<CCTV[]>([]);

  useEffect(() => {
    // Menambahkan fixLeafletIcon di sini
    fixLeafletIcon();
    
    // Menggunakan data statis
    setCctvData(staticCCTVData.data);

    // Kode fetch yang dikomentari untuk referensi di masa depan
    /*
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.9.7/test-laravel/public/map.json');
        const json = await response.json();
        setCctvData(json.data);
      } catch (error) {
        console.error('Error fetching CCTV data:', error);
      }
    };

    fetchData();
    */
  }, []);

  const handleSearch = (results: CCTV[]) => {
    setFilteredCctv(results);
  };

  return (
    <div className="absolute inset-0">
      <Search cctvData={cctvData} onSearch={handleSearch} />
      <MapContainer
        center={[-3.809436836265215, 119.6495090576475]}
        zoom={13}
        className="w-full h-full"
        style={{ 
          height: '100vh',
          margin: 0,
          padding: 0,
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {(filteredCctv.length > 0 ? filteredCctv : cctvData).map((cctv) => (
          <MarkerWithVideo key={cctv.id} cctv={cctv} />
        ))}
        <MapController cctv={filteredCctv} />
      </MapContainer>
    </div>
  );
};

// Fungsi fixLeafletIcon
const fixLeafletIcon = () => {
  delete ((L.Icon.Default.prototype as IconDefault)._getIconUrl);
  L.Icon.Default.mergeOptions({
    iconUrl: '/cctv-pin.png',
    iconRetinaUrl: '/cctv-pin.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export default Map; 