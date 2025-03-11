
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  loading: boolean;
  disabled: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, disabled }) => {
  return (
    <div className="flex justify-center">
      <Button
        type="submit"
        className="w-full sm:w-auto px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-lg transition-colors shadow-sm disabled:opacity-70"
        disabled={loading || disabled}
      >
        <Heart className="w-5 h-5 mr-2" />
        <span>Generate My Travel Plan</span>
      </Button>
    </div>
  );
};

export default SubmitButton;
