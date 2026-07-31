import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Sun, Cloud, CloudRain, CloudLightning, CloudFog, CloudSun, MapPin, RefreshCw } from 'lucide-react';

interface WeatherWidgetProps {
  language: Language;
}

interface CityLocation {
  nameBn: string;
  nameEn: string;
  lat: number;
  lon: number;
}

const CITIES: CityLocation[] = [
  { nameBn: 'ঢাকা', nameEn: 'Dhaka', lat: 23.8103, lon: 90.4125 },
  { nameBn: 'চট্টগ্রাম', nameEn: 'Chittagong', lat: 22.3569, lon: 91.7832 },
  { nameBn: 'সিলেট', nameEn: 'Sylhet', lat: 24.8949, lon: 91.8687 },
  { nameBn: 'রাজশাহী', nameEn: 'Rajshahi', lat: 24.3745, lon: 88.6042 },
  { nameBn: 'খুলনা', nameEn: 'Khulna', lat: 22.8456, lon: 89.5403 },
  { nameBn: 'বরিশাল', nameEn: 'Barisal', lat: 22.7010, lon: 90.3535 },
  { nameBn: 'রংপুর', nameEn: 'Rangpur', lat: 25.7439, lon: 89.2752 },
  { nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', lat: 24.7471, lon: 90.4203 },
];

const toBanglaNumeral = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
};

const getWeatherInfo = (code: number, isDay: number) => {
  if (code === 0) {
    return {
      textBn: isDay ? 'রোদ উজ্জ্বল' : 'নির্মল রাত',
      textEn: isDay ? 'Sunny' : 'Clear Night',
      Icon: Sun,
      color: 'text-amber-400'
    };
  }
  if (code === 1 || code === 2) {
    return {
      textBn: 'আংশিক মেঘলা',
      textEn: 'Partly Cloudy',
      Icon: CloudSun,
      color: 'text-amber-200'
    };
  }
  if (code === 3) {
    return {
      textBn: 'মেঘলা',
      textEn: 'Overcast',
      Icon: Cloud,
      color: 'text-gray-300'
    };
  }
  if (code === 45 || code === 48) {
    return {
      textBn: 'কুয়াশাচ্ছন্ন',
      textEn: 'Foggy',
      Icon: CloudFog,
      color: 'text-gray-400'
    };
  }
  if (code >= 51 && code <= 55) {
    return {
      textBn: 'গুঁড়ি গুঁড়ি বৃষ্টি',
      textEn: 'Light Drizzle',
      Icon: CloudRain,
      color: 'text-blue-300'
    };
  }
  if ((code >= 61 && code <= 65) || (code >= 80 && code <= 82)) {
    return {
      textBn: 'বৃষ্টিপাত',
      textEn: 'Rainy',
      Icon: CloudRain,
      color: 'text-blue-400'
    };
  }
  if (code >= 95) {
    return {
      textBn: 'বজ্রবৃষ্টি',
      textEn: 'Thunderstorm',
      Icon: CloudLightning,
      color: 'text-amber-300'
    };
  }
  return {
    textBn: 'মেঘলা',
    textEn: 'Cloudy',
    Icon: Cloud,
    color: 'text-gray-300'
  };
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ language }) => {
  const [selectedCity, setSelectedCity] = useState<CityLocation>(CITIES[0]);
  const [customLocationName, setCustomLocationName] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<{
    temp: number;
    weathercode: number;
    isDay: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      if (!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      if (data && data.current_weather) {
        setWeatherData({
          temp: Math.round(data.current_weather.temperature),
          weathercode: data.current_weather.weathercode,
          isDay: data.current_weather.is_day
        });
      }
    } catch (err) {
      console.error('Error loading weather:', err);
      // Fallback
      setWeatherData({ temp: 30, weathercode: 2, isDay: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedCity.lat, selectedCity.lon);
  }, [selectedCity]);

  const handleUseGeolocation = () => {
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCustomLocationName(language === 'bn' ? 'আমার অবস্থান' : 'My Location');
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.warn('Geolocation denied or failed', err);
          fetchWeather(selectedCity.lat, selectedCity.lon);
        }
      );
    }
  };

  const cityName = customLocationName || (language === 'bn' ? selectedCity.nameBn : selectedCity.nameEn);

  const info = weatherData
    ? getWeatherInfo(weatherData.weathercode, weatherData.isDay)
    : { textBn: 'লোড হচ্ছে...', textEn: 'Loading...', Icon: Cloud, color: 'text-gray-400' };

  const WeatherIcon = info.Icon;
  const formattedTemp = weatherData
    ? (language === 'bn' ? `${toBanglaNumeral(weatherData.temp)}°C` : `${weatherData.temp}°C`)
    : '--°C';

  return (
    <div className="relative inline-flex items-center">
      <div 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-1.5 cursor-pointer hover:text-white transition group py-0.5 px-1.5 rounded bg-gray-800/60 hover:bg-gray-800 border border-gray-700/50"
        title={language === 'bn' ? 'আবহাওয়া অবস্থান পরিবর্তন করুন' : 'Change weather location'}
      >
        <WeatherIcon className={`w-3.5 h-3.5 ${info.color} ${loading ? 'animate-pulse' : ''}`} />
        <span className="text-red-400 font-semibold">{cityName}:</span>
        <span className="font-bold text-white">{formattedTemp}</span>
        <span className="text-gray-300 font-medium">
          ({language === 'bn' ? info.textBn : info.textEn})
        </span>
        {loading && <RefreshCw className="w-2.5 h-2.5 text-gray-400 animate-spin ml-0.5" />}
      </div>

      {/* City selector dropdown */}
      {isDropdownOpen && (
        <>
          <div 
            className="fixed inset-0 z-50" 
            onClick={() => setIsDropdownOpen(false)} 
          />
          <div className="absolute top-full left-0 mt-1 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden py-1 text-xs">
            <div className="px-3 py-1.5 border-b border-gray-800 font-bold text-gray-400 text-[11px] uppercase tracking-wider">
              {language === 'bn' ? 'শহর নির্বাচন করুন' : 'Select City'}
            </div>
            
            <button
              onClick={() => {
                handleUseGeolocation();
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-gray-800 text-red-400 flex items-center space-x-2 font-semibold border-b border-gray-800/80"
            >
              <MapPin className="w-3 h-3" />
              <span>{language === 'bn' ? 'আমার অবস্থান (Auto Detect)' : 'My Location (Auto)'}</span>
            </button>

            <div className="max-h-48 overflow-y-auto">
              {CITIES.map((city) => (
                <button
                  key={city.nameEn}
                  onClick={() => {
                    setSelectedCity(city);
                    setCustomLocationName(null);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-800 transition flex items-center justify-between ${
                    selectedCity.nameEn === city.nameEn && !customLocationName 
                      ? 'text-red-400 font-bold bg-gray-800/50' 
                      : 'text-gray-300'
                  }`}
                >
                  <span>{language === 'bn' ? city.nameBn : city.nameEn}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
