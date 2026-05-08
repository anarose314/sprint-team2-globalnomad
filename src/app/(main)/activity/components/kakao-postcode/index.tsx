'use client';

import type { Address } from 'react-daum-postcode';
import { useKakaoPostcodePopup } from 'react-daum-postcode';
import type { KakaoPostcodeProps } from '@/app/(main)/activity/components/kakao-postcode/kakaoPostcode.types';
import { Input } from '@/shared/components/input';

/**
 * 카카오 우편번호 검색 팝업을 띄우고 결과를 반환하는 제어 컴포넌트
 *
 * * @example
 * ```tsx
 * const [address, setAddress] = useState('');
 *
 * <KakaoPostcode
 * address={address}
 * onAddressChange={setAddress}
 * />
 * ```
 */
export function KakaoPostcode({
  address,
  onAddressChange,
}: KakaoPostcodeProps) {
  const open = useKakaoPostcodePopup();

  const handleComplete = (data: Address) => {
    const { address: selectedAddress, addressType, bname, buildingName } = data;
    let fullAddress = selectedAddress;

    if (addressType === 'R') {
      const extraAddress = [bname, buildingName].filter(Boolean).join(', ');
      fullAddress += extraAddress ? ` (${extraAddress})` : '';
    }

    onAddressChange(fullAddress);
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  return (
    <Input
      label="주소"
      name="address"
      placeholder="주소를 입력해 주세요"
      value={address}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className="cursor-pointer"
      required
      readOnly
      aria-haspopup="dialog"
    />
  );
}
