export interface KakaoPostcodeProps {
  address: string;
  onAddressChange: (value: string) => void;
  errorMessage?: string;
  onBlur?: () => void;
}
