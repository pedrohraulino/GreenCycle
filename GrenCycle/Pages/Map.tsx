import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindowF } from '@react-google-maps/api';
import axios from 'axios';
import './map.scss';
import api from '../services/api';
import { LocaisReciclagemModel } from '../Interfaces/LocaisReciclage';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const defaultCenter = {
  lat: -23.220166,
  lng: -45.891506,
};

const GEOCODING_API_KEY = 'AIzaSyD3n3HDKBio6KSJdF5-_YiYKmyOm0gRvSY';

const getCoordinates = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: GEOCODING_API_KEY,
      },
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      console.error(`Geocoding falhou para o endereço: ${address}`);
      return null;
    }
  } catch (error) {
    console.error('Erro ao obter coordenadas:', error);
    return null;
  }
};

const Map: React.FC = () => {
  const [localizacoes, setLocalizacoes] = useState<LocaisReciclagemModel[]>([]);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GEOCODING_API_KEY,
  });

  const formatAddress = (local: LocaisReciclagemModel): string => {
    const { logradouro, numeroEndereco, complemento, bairro, cidade, cep } = local;
    let address = `${logradouro}`;

    if (numeroEndereco) {
      address += `, ${numeroEndereco}`;
    }

    if (complemento) {
      address += `, ${complemento}`;
    }

    if (bairro || cidade) {
      address += ` - ${bairro || ''}${bairro && cidade ? ', ' : ''}${cidade || ''}`;
    }

    if (cep) {
      address += `, ${cep}`;
    }

    return address;
  };

  const fetchPontosColeta = useCallback(async () => {
    try {
      const response = await api.get<{ dados: LocaisReciclagemModel[] }>('/api/LocaisReciclagem/BuscarLocaisReciclagem');
      const dados = response.data.dados || response.data;

      if (Array.isArray(dados)) {
        setLocalizacoes(dados);
      } else {
        console.error("Os dados recebidos não são um array.");
      }
    } catch (error) {
      console.error("Erro ao buscar localizações:", error);
    }
  }, []);

  useEffect(() => {
    fetchPontosColeta();
  }, [fetchPontosColeta]);

  useEffect(() => {
    const updateCoordinates = async () => {
      const coords = await Promise.all(
        localizacoes.map(async (local) => {
          const address = formatAddress(local);
          return await getCoordinates(address);
        })
      );
      setCoordinates(coords.filter((coord): coord is { lat: number; lng: number } => coord !== null));
    };

    if (localizacoes.length > 0) {
      updateCoordinates();
    }
  }, [localizacoes]);

  const getMapCenter = () => {
    if (coordinates.length > 0) {
      const latitudes = coordinates.map(coord => coord.lat);
      const longitudes = coordinates.map(coord => coord.lng);
      return {
        lat: (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
        lng: (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
      };
    }
    return defaultCenter;
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={getMapCenter()}
      zoom={12}
    >
      {coordinates.map((coord, index) => (
        <Marker
          key={index}
          position={coord}
          title={localizacoes[index]?.identificacao || 'Ponto de Coleta'}
          icon={'../src/assets/ponto-coleta.svg'}
          onClick={() => setSelectedMarker(index)}
        >
          {selectedMarker === index && (
            <InfoWindowF
              position={coord}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className='popup'>
                <h2>{localizacoes[index]?.identificacao}</h2>
                <p>{formatAddress(localizacoes[index])}</p>
              </div>
            </InfoWindowF>
          )}
        </Marker>
      ))}
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
};

export default Map;
