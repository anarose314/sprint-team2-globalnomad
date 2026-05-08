'use client';

import { useState } from 'react';
import { Address, useKakaoPostcodePopup } from 'react-daum-postcode';
import { Input } from '@/shared/components/input';

export function KakaoPostcode() {
  const [address, setAddress] = useState('');
  const open = useKakaoPostcodePopup();

  const handleComplete = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setAddress(fullAddress);
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
      required
      readOnly
    />
  );
}
