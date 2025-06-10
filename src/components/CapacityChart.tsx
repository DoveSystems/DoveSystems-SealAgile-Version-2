import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useProject } from '../contexts/ProjectContext';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

type CapacityChartProps = {
  type?: 'doughnut' | 'bar';
  height?: number;
  sprintId?: string;
};

const CapacityChart = ({ type = 'doughnut', height = 300, sprintId }: CapacityChartProps) => {
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
      if (type === 'doughnut') {
        setChartData({
          labels: ['Allocated', 'Available'],
          datasets: [
            {
              data: [65, 35],
              backgroundColor: [
                'rgba(99, 102, 241, 0.8)',
                'rgba(209, 213, 219, 0.2)',
              ],
              borderColor: [
                'rgba(99, 102, 241, 1)',
                'rgba(209, 213, 219, 0.3)',
              ],
              borderWidth: 1,
            },
          ],
        });
      } else {
        setChartData({
          labels: ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey'],
          datasets: [
            {
              label: 'Allocated',
              data: [6, 4, 8, 5, 7],
              backgroundColor: 'rgba(99, 102, 241, 0.8)',
            },
            {
              label: 'Capacity',
              data: [8, 6, 10, 8, 8],
              backgroundColor: 'rgba(20, 184, 166, 0.8)',
            },
          ],
        });
      }
      return;
    }

    // Calculate real data
    const sprintStories = sprint.stories
      .map(storyId => project.stories.find(s => s.id === storyId))
      .filter(Boolean) as any;

    if (type === 'doughnut') {
      const totalPoints = sprintStories.reduce((sum: number, story: any) => sum + story.points, 0);
      const remainingCapacity = Math.max(0, sprint.capacity - totalPoints);
      
      setChartData({
        labels: ['Allocated', 'Available'],
        datasets: [
          {
            data: [totalPoints, remainingCapacity],
            backgroundColor: [
              'rgba(99, 102, 241, 0.8)',
              'rgba(209, 213, 219, 0.2)',
            ],
            borderColor: [
              'rgba(99, 102, 241, 1)',
              'rgba(209, 213, 219, 0.3)',
            ],
            borderWidth: 1,
          },
        ],
      });
    } else {
      // For bar chart, show team member allocation
      const teamMembers = project.team;
      const labels = teamMembers.map(member => member.name);
      
      // Calculate allocated points per member (simplified)
      const allocatedPoints = teamMembers.map(member => {
        const memberStories = sprintStories.filter((story: any) => story.assignee === member.id);
        return memberStories.reduce((sum: number, story: any) => sum + story.points, 0);
      });
      
      // Member capacity in points (simplified conversion)
      const capacityPoints = teamMembers.map(member => 
        Math.round(member.capacity * member.velocityFactor)
      );
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Allocated',
            data: allocatedPoints,
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
          },
          {
            label: 'Capacity',
            data: capacityPoints,
            backgroundColor: 'rgba(20, 184, 166, 0.8)',
          },
        ],
      });
    }
  }, [project, type, sprintId]);

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
    ...(type === 'bar' && {
      scales: {
        x: {
          grid: {
            color: 'rgba(75, 85, 99, 0.2)',
          },
          ticks: {
            color: 'rgb(156, 163, 175)',
          }
        },
        y: {
          grid: {
            color: 'rgba(75, 85, 99, 0.2)',
          },
          ticks: {
            color: 'rgb(156, 163, 175)',
          },
          beginAtZero: true
        }
      }
    }),
    ...(type === 'doughnut' && {
      cutout: '70%',
    })
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
      {type === 'doughnut' ? (
        <Doughnut data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default CapacityChart;
