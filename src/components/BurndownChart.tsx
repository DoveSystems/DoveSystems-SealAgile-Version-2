import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useProject } from '../contexts/ProjectContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type BurndownChartProps = {
  sprintId?: string;
  height?: number;
};

const BurndownChart = ({ sprintId, height = 300 }: BurndownChartProps) => {
  const { project } = useProject();
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (!project) return;

    // Get current sprint if not specified
    const sprint = sprintId 
      ? project.sprints.find(s => s.id === sprintId)
      : project.sprints.find(s => s.status === 'active') || project.sprints[0];

    if (!sprint) {
      // Sample data if no sprint
      const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10'];
      const idealBurndown = [30, 27, 24, 21, 18, 15, 12, 9, 6, 3, 0];
      const actualBurndown = [30, 30, 28, 25, 23, 20, 18, 15, 10, 5];
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Ideal Burndown',
            data: idealBurndown,
            borderColor: 'rgba(20, 184, 166, 1)',
            backgroundColor: 'rgba(20, 184, 166, 0.5)',
            borderDash: [5, 5],
            tension: 0,
            fill: false,
          },
          {
            label: 'Actual Burndown',
            data: actualBurndown,
            borderColor: 'rgba(99, 102, 241, 1)',
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            tension: 0.3,
            fill: {
              target: '+1',
              above: 'rgba(239, 68, 68, 0.1)',
              below: 'rgba(16, 185, 129, 0.1)',
            },
          }
        ]
      });
      return;
    }

    // Calculate real data
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Generate dates for the sprint
    const dates = [];
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    // Get sprint stories
    const sprintStories = sprint.stories
      .map(storyId => project.stories.find(s => s.id === storyId))
      .filter(Boolean) as any;
    
    const totalPoints = sprintStories.reduce((sum: number, story: any) => sum + story.points, 0);
    
    // Ideal burndown
    const idealBurndown = [];
    const pointsPerDay = totalPoints / (totalDays - 1);
    for (let i = 0; i < totalDays; i++) {
      idealBurndown.push(Math.max(0, totalPoints - (pointsPerDay * i)));
    }
    
    // Actual burndown (simulated for demo)
    // In a real app, this would use actual completion dates of stories
    const actualBurndown = [];
    let remainingPoints = totalPoints;
    
    // For completed sprints, generate a realistic burndown
    if (sprint.status === 'completed') {
      for (let i = 0; i < totalDays; i++) {
        if (i === 0) {
          actualBurndown.push(totalPoints);
        } else if (i === totalDays - 1) {
          actualBurndown.push(0);
        } else {
          // Random progress with some variance
          const progress = Math.random() * pointsPerDay * 1.5;
          remainingPoints = Math.max(0, remainingPoints - progress);
          actualBurndown.push(Math.round(remainingPoints));
        }
      }
    } else {
      // For active sprints, use a combination of actual data and projection
      const today = new Date();
      const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      for (let i = 0; i < totalDays; i++) {
        if (i === 0) {
          actualBurndown.push(totalPoints);
        } else if (i <= daysSinceStart) {
          // Past days - simulate actual progress
          const progress = Math.random() * pointsPerDay * 1.2;
          remainingPoints = Math.max(0, remainingPoints - progress);
          actualBurndown.push(Math.round(remainingPoints));
        } else {
          // Future days - don't plot
          actualBurndown.push(null);
        }
      }
    }
    
    setChartData({
      labels: dates,
      datasets: [
        {
          label: 'Ideal Burndown',
          data: idealBurndown,
          borderColor: 'rgba(20, 184, 166, 1)',
          backgroundColor: 'rgba(20, 184, 166, 0.5)',
          borderDash: [5, 5],
          tension: 0,
          fill: false,
        },
        {
          label: 'Actual Burndown',
          data: actualBurndown,
          borderColor: 'rgba(99, 102, 241, 1)',
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          tension: 0.3,
          fill: {
            target: '+1',
            above: 'rgba(239, 68, 68, 0.1)',
            below: 'rgba(16, 185, 129, 0.1)',
          },
        }
      ]
    });
  }, [project, sprintId]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(209, 213, 219)',
          font: {
            family: "'Inter', sans-serif",
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(209, 213, 219)',
        borderColor: 'rgba(75, 85, 99, 0.3)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        bodyFont: {
          family: "'Inter', sans-serif",
        },
        titleFont: {
          family: "'Inter', sans-serif",
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          font: {
            family: "'Inter', sans-serif",
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          font: {
            family: "'Inter', sans-serif",
          }
        },
        beginAtZero: true
      }
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 3,
        hoverRadius: 5
      }
    }
  };

  if (!chartData) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-900/50 rounded-lg"
        style={{ height: `${height}px` }}
      >
        <div className="text-gray-500">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div style={{ height: `${height}px` }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default BurndownChart;
