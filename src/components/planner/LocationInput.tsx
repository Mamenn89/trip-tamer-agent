
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface LocationInputProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  icon: LucideIcon;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({
  label,
  name,
  value,
  placeholder,
  icon: Icon,
  onChange,
  required = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <Input
          required={required}
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="pl-10 bg-white focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default LocationInput;
