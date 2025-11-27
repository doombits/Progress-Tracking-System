
import React from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell,
  ComposedChart, RadialBarChart, RadialBar
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Custom Tooltip for better graphics
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 text-white p-4 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-md">
          <p className="font-bold mb-2 text-sm text-slate-300">{label}</p>
          {payload.map((entry: any, index: number) => (
             <p key={index} className="text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}: <span className="font-bold text-white">{entry.value}</span>
             </p>
          ))}
        </div>
      );
    }
    return null;
};

// --- NEW: STREAK AREA CHART ---
export const StreakAreaChart = () => {
  const data = [
    { day: 'Mon', minutes: 120 },
    { day: 'Tue', minutes: 180 },
    { day: 'Wed', minutes: 150 },
    { day: 'Thu', minutes: 240 },
    { day: 'Fri', minutes: 300 },
    { day: 'Sat', minutes: 180 },
    { day: 'Sun', minutes: 320 }, // Today
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorStreak" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} opacity={0.5} />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
        <Tooltip content={<CustomTooltip />} />
        <Area 
            type="monotone" 
            dataKey="minutes" 
            stroke="#3b82f6" 
            strokeWidth={4} 
            fillOpacity={1} 
            fill="url(#colorStreak)" 
            name="Study Minutes"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// --- NEW: RANK RADIAL CHART ---
export const RankRadialChart = ({ rank, total }: { rank: number, total: number }) => {
    // Calculate percentile (inverted because rank 1 is best)
    const percentile = ((total - rank + 1) / total) * 100;
    
    const data = [
      { name: 'Others', value: 100, fill: '#e2e8f0' },
      { name: 'You', value: percentile, fill: '#f59e0b' },
    ];
  
    return (
      <ResponsiveContainer width="100%" height={250}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={15} data={data} startAngle={90} endAngle={-270}>
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
          />
          <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-black fill-slate-800 dark:fill-white">
            #{rank}
          </text>
          <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="text-sm font-medium fill-slate-500">
            Top {Math.max(1, 100 - Math.round(percentile))}%
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    );
  };

export const StudyTrendChart = () => {
  const data = [
    { name: 'Mon', hours: 2.5 },
    { name: 'Tue', hours: 4.0 },
    { name: 'Wed', hours: 3.0 },
    { name: 'Thu', hours: 5.5 },
    { name: 'Fri', hours: 6.0 },
    { name: 'Sat', hours: 7.5 },
    { name: 'Sun', hours: 8.2 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const WeeklyProgressChart = () => {
  const data = [
    { name: 'Week 1', progress: 45, average: 30 },
    { name: 'Week 2', progress: 52, average: 35 },
    { name: 'Week 3', progress: 68, average: 50 },
    { name: 'Week 4', progress: 85, average: 60 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="name" scale="point" padding={{ left: 20, right: 20 }} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10}/>
        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{paddingTop: '20px'}}/>
        <Bar dataKey="progress" barSize={20} fill="#8b5cf6" radius={[10, 10, 0, 0]} name="My Progress" />
        <Line type="monotone" dataKey="average" stroke="#f59e0b" strokeWidth={3} dot={{r: 4}} name="Class Avg" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export const TimeSpentChart = () => {
    const data = [
        { time: '8 AM', users: 120 },
        { time: '10 AM', users: 200 },
        { time: '12 PM', users: 150 },
        { time: '2 PM', users: 300 },
        { time: '4 PM', users: 250 },
        { time: '6 PM', users: 180 },
        { time: '8 PM', users: 100 },
    ];
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}}/>
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} />
            </LineChart>
        </ResponsiveContainer>
    )
}

export const PerformanceRadar = () => {
  const data = [
    { subject: 'Math', A: 120, fullMark: 150 },
    { subject: 'Logic', A: 98, fullMark: 150 },
    { subject: 'Coding', A: 140, fullMark: 150 },
    { subject: 'Physics', A: 99, fullMark: 150 },
    { subject: 'History', A: 85, fullMark: 150 },
    { subject: 'English', A: 75, fullMark: 150 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} tick={false} axisLine={false} />
        <Radar name="Skills" dataKey="A" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.4} />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export const ActivityHeatmap = () => {
    const data = Array.from({length: 24}, (_, i) => ({
        hour: `${i}`,
        activity: Math.floor(Math.random() * 100)
    }));

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                <XAxis dataKey="hour" fontSize={10} interval={2} axisLine={false} tickLine={false} dy={5}/>
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                <Bar dataKey="activity" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`rgba(245, 158, 11, ${0.3 + (entry.activity / 150)})`} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}

export const LearningMasteryChart = () => {
    const data = [
        { name: 'Python', value: 85 },
        { name: 'DSA', value: 65 },
        { name: 'React', value: 90 },
        { name: 'SQL', value: 75 },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0"/>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={60} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                <Bar dataKey="value" barSize={15} radius={[0, 10, 10, 0]} background={{ fill: '#f1f5f9', radius: 10 }}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}

export const DifficultyScatter = () => {
    const data = [
        { name: 'Easy', value: 400 },
        { name: 'Medium', value: 300 },
        { name: 'Hard', value: 300 },
        { name: 'Expert', value: 200 },
    ];
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie 
                    data={data} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60}
                    outerRadius={80} 
                    fill="#8884d8" 
                    paddingAngle={5}
                    dataKey="value" 
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-slate-700 dark:fill-white">
                    1200
                </text>
                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="text-xs fill-slate-500">
                    Questions
                </text>
            </PieChart>
        </ResponsiveContainer>
    )
}
