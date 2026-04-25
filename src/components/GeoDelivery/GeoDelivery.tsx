'use client';

import React, { useState, useEffect } from 'react';
import styles from './GeoDelivery.module.css';
import { Truck } from 'lucide-react';

export default function GeoDelivery() {
  const [location, setLocation] = useState<string>('your area');

  useEffect(() => {
    // Attempt to get location from a simple public API
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.city) {
          setLocation(data.city);
        }
      })
      .catch(() => {
        // Fallback to generic if API fails or is blocked
        setLocation('your area');
      });
  }, []);

  return (
    <div className={styles.banner}>
      <Truck size={16} className={styles.icon} />
      <p>
        Discreet delivery to <strong>{location}</strong> available. Free shipping on orders over $300!
      </p>
    </div>
  );
}
