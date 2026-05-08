'use client';

import { Address, useKakaoPostcodePopup } from 'react-daum-postcode';
import { KakaoPostcodeProps } from '@/app/(main)/activity/components/kakao-postcode/kakaoPostcode.types';
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
    const { address, addressType, bname, buildingName } = data;
    let fullAddress = address;

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
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className="cursor-pointer"
      required
      readOnly
    />
  );
}
