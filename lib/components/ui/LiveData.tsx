'use client';

import { useState, useEffect } from 'react';
import { Cloud, Droplets, Thermometer, Eye, Wind } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  visibility: number;
  windSpeed: number;
  airQuality: string;
}

export function LiveData() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 18,
    humidity: 65,
    description: 'Clear Sky',
    visibility: 10,
    windSpeed: 5.2,
    airQuality: 'Good'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate real-time weather data updates
    const weatherTimer = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: Math.round(prev.temperature + (Math.random() - 0.5) * 2),
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 5)),
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 2)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(weatherTimer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Date & Time */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Time</h3>
          <div className="text-2xl font-mono font-bold text-primary-600">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Weather */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Weather</h3>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Thermometer className="h-5 w-5 text-orange-500" />
            <span className="text-xl font-bold text-gray-800">{weather.temperature}°C</span>
          </div>
          <div className="text-sm text-gray-600">{weather.description}</div>
        </div>

        {/* Humidity */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Humidity</h3>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <span className="text-xl font-bold text-gray-800">{weather.humidity}%</span>
          </div>
          <div className="text-sm text-gray-600">Moisture Level</div>
        </div>

        {/* Air Quality */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Air Quality</h3>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Cloud className="h-5 w-5 text-green-500" />
            <span className="text-xl font-bold text-green-600">{weather.airQuality}</span>
          </div>
          <div className="text-sm text-gray-600">Clean Mountain Air</div>
        </div>

        {/* Visibility */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Visibility</h3>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Eye className="h-5 w-5 text-purple-500" />
            <span className="text-xl font-bold text-gray-800">{weather.visibility} km</span>
          </div>
          <div className="text-sm text-gray-600">Clear View</div>
        </div>

        {/* Wind Speed */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Wind Speed</h3>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Wind className="h-5 w-5 text-cyan-500" />
            <span className="text-xl font-bold text-gray-800">{weather.windSpeed.toFixed(1)} m/s</span>
          </div>
          <div className="text-sm text-gray-600">Fresh Breeze</div>
        </div>
      </div>
    </div>
  );
}