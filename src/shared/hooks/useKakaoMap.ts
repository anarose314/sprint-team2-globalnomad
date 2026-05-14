'use client';

import { useEffect, useRef, useState } from 'react';

interface KakaoAddressResult {
  x: string;
  y: string;
}

interface KakaoMapServices {
  Geocoder: new () => {
    addressSearch: (
      address: string,
      callback: (result: KakaoAddressResult[], status: string) => void
    ) => void;
  };
  Status: {
    OK: string;
  };
}

interface KakaoMapNamespace {
  maps: {
    load: (callback: () => void) => void;
    LatLng: new (lat: number, lng: number) => unknown;
    Map: new (
      container: HTMLElement,
      options: { center: unknown; level: number }
    ) => unknown;
    Marker: new (options: { position: unknown; map: unknown }) => unknown;
    services: KakaoMapServices;
  };
}

interface UseKakaoMapParams {
  address: string;
  appKey: string;
}

const KAKAO_MAP_SCRIPT_ID = 'kakao-map-sdk';
let kakaoMapScriptPromise: Promise<KakaoMapNamespace> | null = null;

const loadKakaoMapSdk = (appKey: string) => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('브라우저 환경에서만 사용할 수 있습니다.'));
  }

  if (kakaoMapScriptPromise) {
    return kakaoMapScriptPromise;
  }

  kakaoMapScriptPromise = new Promise<KakaoMapNamespace>((resolve, reject) => {
    const windowWithKakao = window as Window & { kakao?: KakaoMapNamespace };
    const initializeKakao = () => {
      if (!windowWithKakao.kakao?.maps) {
        reject(new Error('카카오 지도 SDK 로드에 실패했습니다.'));
        return;
      }
      windowWithKakao.kakao.maps.load(() => {
        if (!windowWithKakao.kakao) {
          reject(new Error('카카오 지도 SDK 초기화에 실패했습니다.'));
          return;
        }
        resolve(windowWithKakao.kakao);
      });
    };
    const onScriptError = () => {
      reject(new Error('카카오 지도 SDK 스크립트 로드에 실패했습니다.'));
    };

    if (windowWithKakao.kakao?.maps) {
      initializeKakao();
      return;
    }

    const existingScript = document.getElementById(
      KAKAO_MAP_SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener('load', initializeKakao);
      existingScript.addEventListener('error', onScriptError);
      return;
    }

    const script = document.createElement('script');
    script.id = KAKAO_MAP_SCRIPT_ID;
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    script.onload = initializeKakao;
    script.onerror = onScriptError;

    document.head.appendChild(script);
  }).catch((error) => {
    kakaoMapScriptPromise = null;
    throw error;
  });

  return kakaoMapScriptPromise;
};

/**
 * 주소 문자열 기준으로 카카오 지도, 마커 렌더링
 */
export const useKakaoMap = ({ address, appKey }: UseKakaoMapParams) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [mapErrorMessage, setMapErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const initializeMap = async () => {
      if (!appKey) {
        setMapErrorMessage('지도 정보를 불러올 수 없습니다.');
        return;
      }

      if (!mapContainerRef.current) {
        return;
      }

      try {
        setIsMapLoading(true);
        setMapErrorMessage(null);

        const kakao = await loadKakaoMapSdk(appKey);
        if (isCancelled || !mapContainerRef.current) {
          return;
        }

        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, (result, status) => {
          if (isCancelled || !mapContainerRef.current) {
            return;
          }

          if (status !== kakao.maps.services.Status.OK || result.length === 0) {
            setMapErrorMessage('주소 위치를 찾을 수 없습니다.');
            setIsMapLoading(false);
            return;
          }

          const { x, y } = result[0];
          const center = new kakao.maps.LatLng(Number(y), Number(x));
          const map = new kakao.maps.Map(mapContainerRef.current, {
            center,
            level: 3,
          });

          new kakao.maps.Marker({
            map,
            position: center,
          });

          setMapErrorMessage(null);
          setIsMapLoading(false);
        });
      } catch {
        if (isCancelled) {
          return;
        }
        setMapErrorMessage('지도 정보를 불러올 수 없습니다.');
        setIsMapLoading(false);
      }
    };

    initializeMap();

    return () => {
      isCancelled = true;
    };
  }, [address, appKey]);

  return {
    mapContainerRef,
    isMapLoading,
    mapErrorMessage,
  };
};
