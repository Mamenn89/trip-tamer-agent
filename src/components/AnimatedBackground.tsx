
import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white"></div>
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-radial from-blue-100/30 to-transparent"></div>
      
      {/* Animated shapes */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-100/20 animate-float" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-indigo-100/20 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full bg-sky-100/20 animate-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NWgtMXYtNXptNCAwaDF2NWgtMXYtNXptLTUgMWg1djFoLTV2LTF6TTM0IDI5aDR2MWgtNHYtMXptMC0yaDF2NWgtMXYtNXptNCAwaDF2NWgtMXYtNXptLTUgMWg1djFoLTV2LTF6TTMyIDI0aDR2MWgtNHYtMXptMC0yaDF2NWgtMXYtNXptNCAwaDF2NWgtMXYtNXptLTUgMWg1djFoLTV2LTF6TTMwIDE5aDR2MWgtNHYtMXptMC0yaDF2NWgtMXYtNXptNCAwaDF2NWgtMXYtNXptLTUgMWg1djFoLTV2LTF6TTI4IDE0aDR2MWgtNHYtMXptMC0yaDF2NWgtMXYtNXptNCAwaDF2NWgtMXYtNXptLTUgMWg1djFoLTV2LTF6TTI2IDloNHYxaC00di0xem0wLTJoMXY1aC0xVjd6bTQgMGgxdjVoLTFWN3ptLTUgMWg1djFoLTV2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
    </div>
  );
};

export default AnimatedBackground;
