
import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/context/EventContext";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon } from "lucide-react";

const MyEvents = () => {
  const navigate = useNavigate();
  const { events, userReservations, cancelReservation } = useEvents();
  const { isAuthenticated } = useAuth();
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  // Get user's reserved events
  const reservedEvents = events.filter(event => userReservations.includes(event.id));
  
  // Split into upcoming and past events
  const today = new Date();
  const upcomingEvents = reservedEvents.filter(event => new Date(event.date) >= today);
  const pastEvents = reservedEvents.filter(event => new Date(event.date) < today);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Events</h1>
          <p className="text-muted-foreground">
            Manage your event reservations and view your event history
          </p>
        </div>
        
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              Upcoming Events ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Events ({pastEvents.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isReserved={true}
                    onCancel={() => cancelReservation(event.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't reserved any upcoming events yet
                </p>
                <Button onClick={() => navigate("/events")}>
                  Browse Events
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    showActions={false}
                    className="opacity-75"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No past events</h3>
                <p className="text-muted-foreground">
                  Your event history will appear here
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EventAICompass. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MyEvents;
