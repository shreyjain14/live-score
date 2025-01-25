import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Results = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [collegeResults, setCollegeResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/repos/shreyjain14/inbloomData/contents/results.json',
          {
            headers: {
              'Accept': 'application/vnd.github.v3.raw'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setCollegeResults(data);
      } catch (error) {
        console.error("Detailed error:", error);
        setError("Unable to fetch results. Please check your internet connection.");
      }
    };

    if (collegeResults.length === 0) {
      setIsLoading(true);
      fetchData().finally(() => setIsLoading(false));
    } else {
      fetchData();
    }

    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary-gradient flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary-gradient flex items-center justify-center">
        <div className="text-white text-xl">Error: {error}</div>
      </div>
    );
  }

  const collegeStats = collegeResults.map(college => {
    const pointsMapping = {
      1: 30,
      2: 20,
      3: 10
    };

    const stats = college.results.reduce(
      (acc, result) => {
        const basePoints = pointsMapping[result.position] || 0;
        const points = result.category === "Stage" ? basePoints * 2 : basePoints;
        acc.totalPoints += points;

        if (result.position === 1) acc.first++;
        if (result.position === 2) acc.second++;
        if (result.position === 3) acc.third++;

        return acc;
      },
      { first: 0, second: 0, third: 0, totalPoints: 0 }
    );

    return {
      name: college.collegeName,
      ...stats
    };
  });

  // Sort colleges by total points instead of total prizes
  collegeStats.sort((a, b) => b.totalPoints - a.totalPoints);

  const topColleges = collegeStats.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary-gradient relative overflow-hidden">
      <div className="fixed inset-0 z-0 bg-primary/95">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] lg:bg-[size:5rem_5rem] opacity-20"></div>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 lg:w-[32rem] lg:h-[32rem] xl:w-[40rem] xl:h-[40rem] bg-secondary/10 rounded-full filter blur-3xl mix-blend-normal animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 lg:w-[32rem] lg:h-[32rem] xl:w-[40rem] xl:h-[40rem] bg-primary-light/10 rounded-full filter blur-3xl mix-blend-normal animate-pulse delay-1000"></div>
        </div>
        
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(45deg, transparent 45%, rgba(232,76,164,0.2) 49%, rgba(232,76,164,0.2) 51%, transparent 55%), linear-gradient(-45deg, transparent 45%, rgba(232,76,164,0.2) 49%, rgba(232,76,164,0.2) 51%, transparent 55%)`,
          backgroundSize: window.innerWidth > 1024 ? '80px 80px' : '60px 60px'
        }}></div>
        
        <div className="absolute inset-0 mix-blend-overlay opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: window.innerWidth > 1024 ? '32px 32px' : '24px 24px'
        }}></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 h-screen relative z-10">
        {/* Left Panel - Static Leaderboard */}
        <div className="h-screen p-6 border-r border-white/10">
          <h1 className="text-5xl font-bold text-white mb-8 text-center">INBLOOM RESULTS</h1>
          <div className="space-y-6">
            {topColleges.map((college, index) => (
              <motion.div
                key={college.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-white">{college.name}</h2>
                    <p className="text-gray-300 mt-2 text-xl">Total Points: {college.totalPoints}</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 rounded-full bg-yellow-400"></span>
                      <span className="text-2xl font-bold text-gray-300">{college.first}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 rounded-full bg-gray-300"></span>
                      <span className="text-2xl font-bold text-gray-300">{college.second}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 rounded-full bg-orange-400"></span>
                      <span className="text-2xl font-bold text-gray-300">{college.third}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Panel - Scrolling Results */}
        <div className="h-screen overflow-hidden">
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                y: [-20, -1 * (collegeStats.length * 100)],
                transition: {
                  y: {
                    duration: collegeStats.length * 8,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }
              }}
              className="space-y-4"
            >
              {collegeStats.map((college, index) => (
                <motion.div
                  key={college.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg shadow-black/5"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-white">{college.name}</h2>
                      <p className="text-gray-300 mt-2 text-xl">Total Points: {college.totalPoints}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                        <span className="text-xl font-bold text-gray-300">{college.first}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                        <span className="text-xl font-bold text-gray-300">{college.second}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-orange-400"></span>
                        <span className="text-xl font-bold text-gray-300">{college.third}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;