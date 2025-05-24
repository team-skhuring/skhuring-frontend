import { useState } from 'react';

const gradeThresholds: Record<string, number> = {
  Bronze: 100,
  Silver: 300,
  Gold: 800,
  Platinum: 1500,
  Diamond: 3000,
};

const gradeOrder = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

const gradeColors: Record<string, string> = {
  Bronze: '#cd7f32',
  Silver: '#c0c0c0',
  Gold: '#ffd700',
  Platinum: '#e5e4e2',
  Diamond: '#b9f2ff',
};

const gradeIcons: Record<string, string> = {
  Bronze: 'military_tech',
  Silver: 'emoji_events',
  Gold: 'star',
  Platinum: 'workspace_premium',
  Diamond: 'diamond',
};

const getGradeInfo = (point: number) => {
  let currentGrade = 'Bronze';
  let currentThreshold = 0;
  let nextThreshold = gradeThresholds[gradeOrder[0]];

  for (let i = gradeOrder.length - 1; i >= 0; i--) {
    const grade = gradeOrder[i];
    const threshold = gradeThresholds[grade];
    if (point >= threshold) {
      currentGrade = grade;
      currentThreshold = threshold;
      nextThreshold = gradeThresholds[gradeOrder[i + 1]] ?? threshold;
      break;
    }
  }

  const progress =
    nextThreshold === currentThreshold
      ? 100
      : ((point - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

  return {
    currentGrade,
    progress: Math.min(100, Math.max(0, progress)),
    color: gradeColors[currentGrade],
    icon: gradeIcons[currentGrade],
  };
};

type GradeProps = {
  point: number;
};

export default function Grade({ point }: GradeProps) {
  const { currentGrade, progress, color, icon } = getGradeInfo(point);

  return (
    <div className="mt-12">
      <div className="flex items-center space-x-2">
        <span className="material-icons text-gray-500">{icon}</span>
        <span className="text-lg font-medium">{currentGrade}</span>
      </div>
      <div className="mt-2 w-full h-2 bg-gray-200 rounded-full">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <div className="text-sm text-gray-500 mt-1">
        {currentGrade} | {point.toLocaleString()}점
      </div>
    </div>
  );
}
