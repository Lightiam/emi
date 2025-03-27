
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkerById, Worker } from '../services/db';
import { toast } from "sonner";
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, ArrowLeft, Calendar } from 'lucide-react';

const WorkerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [eta, setEta] = useState<string>('');

  useEffect(() => {
    const fetchWorkerDetails = async () => {
      if (!id) {
        toast.error("Worker ID is missing");
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const workerData = await getWorkerById(id);
        
        if (!workerData) {
          toast.error("Worker not found");
          navigate('/');
          return;
        }

        setWorker(workerData);
        
        // Generate a random ETA between 30 minutes and 2 hours
        const etaMinutes = Math.floor(Math.random() * (120 - 30 + 1) + 30);
        setEta(`${etaMinutes} minutes`);
      } catch (error) {
        console.error("Error fetching worker details:", error);
        toast.error("Failed to load worker details");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerDetails();
  }, [id, navigate]);

  const goBack = () => {
    navigate(-1);
  };

  const handleBookNow = () => {
    toast.success("Booking request sent!", {
      description: `Your request has been sent to ${worker?.name}. They will contact you shortly.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Worker Not Found</h1>
            <Button onClick={goBack}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2" 
          onClick={goBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <img 
                    src={worker.imageUrl} 
                    alt={worker.name}
                    className="h-40 w-40 rounded-full object-cover mx-auto border-4 border-primary/10"
                  />
                </div>
                <CardTitle>{worker.name}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  {worker.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-1" />
                    <span className="font-medium">{worker.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">/5.0</span>
                  </div>
                  <Badge variant="outline" className="text-primary">
                    {worker.profession}
                  </Badge>
                </div>
                
                <div className="flex items-center mb-4">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <span>ETA: <span className="font-medium">{eta}</span></span>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-lg font-bold flex items-center justify-between">
                    <span>Hourly Rate</span>
                    <span className="text-primary">${worker.hourlyRate}/hr</span>
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleBookNow}>
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Details Section */}
          <div className="col-span-1 md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {worker.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
                
                <h3 className="font-medium mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {worker.languages.map((language, index) => (
                    <Badge key={index} variant="outline">{language}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Level Agreement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="font-medium flex items-center mb-2">
                      <Clock className="h-4 w-4 mr-2" />
                      Response Time
                    </h3>
                    <p className="text-sm text-gray-600">
                      Initial response within 30 minutes of booking.
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="font-medium flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Availability
                    </h3>
                    <p className="text-sm text-gray-600">
                      Available 7 days a week, from 8am to 8pm.
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="font-medium flex items-center mb-2">
                      <Star className="h-4 w-4 mr-2" />
                      Quality Guarantee
                    </h3>
                    <p className="text-sm text-gray-600">
                      All work comes with a 30-day satisfaction guarantee.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetails;
