'use client';

import { useState, useEffect, useCallback } from 'react';

export function useCompass() {
  const [heading, setHeading] = useState(null); // degrees 0-360 (device direction)
  const [permission, setPermission] = useState('unknown'); // unknown | granted | denied | not-supported
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(false);

  // iOS 13+ requires explicit permission
  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined') return;

    // Check if DeviceOrientationEvent exists
    if (!window.DeviceOrientationEvent) {
      setPermission('not-supported');
      setError('আপনার device compass support করে না');
      return false;
    }

    // iOS 13+ permission
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const result = await DeviceOrientationEvent.requestPermission();
        if (result === 'granted') {
          setPermission('granted');
          return true;
        } else {
          setPermission('denied');
          setError('Compass permission denied');
          return false;
        }
      } catch (err) {
        setPermission('denied');
        setError('Permission request failed');
        return false;
      }
    } else {
      // Android / Desktop — no permission needed
      setPermission('granted');
      return true;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setSupported(!!window.DeviceOrientationEvent);

    // Android Chrome uses deviceorientationabsolute
    // iOS uses deviceorientation with webkitCompassHeading
    const handleOrientation = (event) => {
      let compassHeading = null;

      // iOS: webkitCompassHeading
      if (event.webkitCompassHeading !== undefined) {
        compassHeading = event.webkitCompassHeading;
      }
      // Android: alpha (0=North, but need adjustment)
      else if (event.alpha !== null && event.alpha !== undefined) {
        // alpha: 0 = North, increases counter-clockwise
        compassHeading = 360 - event.alpha;
      }

      if (compassHeading !== null) {
        setHeading(compassHeading);
      }
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  return {
    heading,
    permission,
    supported,
    error,
    requestPermission,
  };
}

/**
 * Get user's location
 */
export function useGeolocation() {
  const [location, setLocation] = useState(null); // { lat, lng }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setError('আপনার device location support করে না');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
      },
      (err) => {
        setError('Location permission প্রয়োজন');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  }, []);

  return { location, loading, error, getLocation };
}
