import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useProject } from '../contexts/ProjectContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type VelocityChartProps = {
  type?: 'line' | 'bar';
  height?: number;
  timeRange?: 'all' | 'last6' | 'last3';
};

const VelocityChart = ({ type = 'line', height = 300, timeRange = 'all' }: VelocityChartProps) => {
  const { project, getSprintVelocity } = useProject();
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (!project) return;

    // Get completed sprints
    const completedSprints = project.sprints
      .filter(sprint => sprint.status === 'completed')
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    // Add current sprint if it's active
    const activeSprint = project.sprints.find(sprint => sprint.status === 'active');
    if (activeSprint) {
      completedSprints.push(activeSprint);
    }

    let sprints = completedSprints;
    if (timeRange === 'last6') {
      sprints = completedSprints.slice(-6);
    } else if (timeRange === 'last3') {
      sprints = completedSprints.slice(-3);
    }

    // If no sprints, use sample data
    if (sprints.length === 0) {
      const labels = ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5'];
      const velocityData = [18, 21, 19, 25, 22];
      const commitmentData = [20, 20, 22, 24, 24];
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Velocity',
            data: velocityData,
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            tension: 0.3,
            fill: type === 'line' ? {
              target: 'origin',
              above: 'rgba(99, 102, 241, 0.1)',
            } : undefined,
          },
          {
            label: 'Commitment',
            data: commitmentData,
            borderColor: 'rgb(20, 184, 166)',
            backgroundColor: 'rgba(20, 184, 166, 0.5)',
            borderDash: [5, 5],
            tension: 0.3,
            fill: false,
          }
        ]
      });
      return;
    }

    // Prepare real data
    const labels = sprints.map(sprint => sprint.name);
    const velocityData = sprints.map(sprint => getSprintVelocity(sprint.id));
    const commitmentData = sprints.map(sprint => {
      const sprintStories = sprint.stories
        .map(storyId => project.stories.find(s => s.id === storyId))
        .filter(Boolean) as any;
      
      return sprintStories.reduce((sum: number, story: any) => sum + story.points, 0);
    });

    setChartData({
      labels,
      datasets: [
        {
          label: 'Velocity',
          data: velocityData,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          tension: 0.3,
          fill: type === 'line' ? {
            target: 'origin',
            above: 'rgba(99, 102, 241, 0.1)',
          } : undefined,
        },
        {
          label: 'Commitment',
          data: commitmentData,
          borderColor: 'rgb(20, 184, 166)',
          backgroundColor: 'rgba(20, 184, 166, 0.5)',
          borderDash: [5, 5],
          tension: 0.3,
          fill: false,
        }
      ]
    });
  }, [project, getSprintVelocity, type, timeRange]);

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
          }
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
        radius: 4,
        hoverRadius: 6
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
      {type === 'line' ? (
        <Line data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default VelocityChart;
