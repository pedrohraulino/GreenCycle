import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindowF } from '@react-google-maps/api';
import axios from 'axios';
import './map.scss';
import { LocaisReciclagemModel } from '../../Interfaces/LocaisReciclage';
import { useMapContext } from '../contexto'; // Importando o contexto

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const defaultCenter = {
  lat: -23.220166,
  lng: -45.891506,
};

const GEOCODING_API_KEY = '-';

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
  const { pontosColeta } = useMapContext(); // Usando o contexto de mapa
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

  const updateCoordinates = useCallback(async () => {
    const coords = await Promise.all(
      pontosColeta.map(async (local) => {
        const address = formatAddress(local);
        return await getCoordinates(address);
      })
    );
    setCoordinates(coords.filter((coord): coord is { lat: number; lng: number } => coord !== null));
  }, [pontosColeta]);

  useEffect(() => {
    if (pontosColeta.length > 0) {
      updateCoordinates();
    } else {
      setCoordinates([]);
    }
  }, [pontosColeta, updateCoordinates]);
  

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
          title={pontosColeta[index]?.identificacao || 'Ponto de Coleta'}
          icon={'../src/assets/ponto-coleta.svg'}
          onClick={() => setSelectedMarker(index)}
        >
          {selectedMarker === index && (
            <InfoWindowF
              position={coord}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className='popup'>
                <h2>{pontosColeta[index]?.identificacao}</h2>
                <p>{formatAddress(pontosColeta[index])}</p>
              </div>
            </InfoWindowF>
          )}
        </Marker>
      ))}
    </GoogleMap>
  ) : (
    <div>Carregando...</div>
  );
};

export default Map;
