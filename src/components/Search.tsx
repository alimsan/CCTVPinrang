'use client';

import { useState, useEffect } from 'react';
import { CCTV } from '@/types';  // Import dari types

interface SearchProps {
  cctvData: CCTV[];
  onSearch: (results: CCTV[]) => void;
}

const Search = ({ cctvData, onSearch }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(true);

    if (value.trim() === '') {
      onSearch([]);
      return;
    }

    // Filter CCTV berdasarkan nama
    const results = cctvData.filter(cctv => 
      cctv.nama.toLowerCase().includes(value.toLowerCase())
    );
    
    onSearch(results);
  };

  // Menutup hasil pencarian ketika klik di luar
  useEffect(() => {
    const handleClickOutside = () => setShowResults(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="search-container" onClick={(e) => e.stopPropagation()}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Cari CCTV..."
          className="search-input text-black"
          onFocus={() => setShowResults(true)}
        />
        
        {/* Hasil pencarian */}
        {showResults && searchTerm && (
          <div className="search-results">
            <div className="p-2 text-sm text-gray-600 border-b">
              {cctvData.length} CCTV Online
            </div>
            {cctvData
              .filter(cctv => 
                cctv.nama.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((cctv) => (
                <button
                  key={cctv.id}
                  onClick={() => {
                    onSearch([cctv]);
                    setShowResults(false);
                    setSearchTerm(cctv.nama);
                  }}
                  className="w-full p-3 text-left hover:bg-black-500 border-b last:border-b-0"
                >
                  <div className="font-medium text-black">{cctv.nama}</div>
                  <div className="text-sm text-gray-600">
                    Status: {cctv.aktif === '1' ? 'Aktif' : 'Tidak Aktif'}
                  </div>
                </button>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Search; 