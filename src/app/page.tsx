'use client';

import Map from '@/components/Map';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Map />
      </main>
    </div>
  );
}
