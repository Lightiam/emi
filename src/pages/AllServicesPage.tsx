
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAllWorkers, Worker } from '../services/db';
import { Wrench, User } from 'lucide-react';

const AllServicesPage = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [professions, setProfessions] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        const allWorkers = await getAllWorkers();
        setWorkers(allWorkers);
        
        // Extract unique professions
        const uniqueProfessions = Array.from(new Set(allWorkers.map(worker => worker.profession)));
        setProfessions(uniqueProfessions);
      } catch (error) {
        console.error("Error fetching workers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const getWorkersInProfession = (profession: string) => {
    return workers.filter(worker => worker.profession === profession);
  };

  const handleViewWorker = (workerId: string) => {
    navigate(`/worker/${workerId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">All Service Providers</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 w-full bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {professions.map((profession) => (
              <div key={profession} className="mb-8">
                <h2 className="text-2xl font-semibold flex items-center mb-4">
                  <Wrench className="mr-2 h-5 w-5 text-primary" />
                  {profession}s
                  <Badge variant="outline" className="ml-2">{getWorkersInProfession(profession).length}</Badge>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getWorkersInProfession(profession).map((worker) => (
                    <Card 
                      key={worker.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleViewWorker(worker.id)}
                    >
                      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img 
                            src={worker.imageUrl} 
                            alt={worker.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{worker.name}</CardTitle>
                          <CardDescription>{worker.location}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-yellow-500 font-medium">{worker.rating}</span>
                            <span className="text-gray-500 text-sm ml-1">/5.0</span>
                          </div>
                          <span className="font-bold text-primary">${worker.hourlyRate}/hr</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllServicesPage;
