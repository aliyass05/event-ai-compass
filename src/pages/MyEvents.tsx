
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/context/EventContext";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, Clock, MapPin, Tv, CalendarDays } from "lucide-react";

const MyEvents = () => {
  const navigate = useNavigate();
  const { events, userReservations, cancelReservation, getReservationType } = useEvents();
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState<"grid" | "list">("grid");
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  // Get user's reserved events
  const reservedEvents = events.filter(event => 
    userReservations.some(reservation => reservation.eventId === event.id)
  );
  
  // Split into upcoming and past events
  const today = new Date();
  const upcomingEvents = reservedEvents.filter(event => new Date(event.date) >= today);
  const pastEvents = reservedEvents.filter(event => new Date(event.date) < today);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="upcoming">
                Upcoming Events ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past Events ({pastEvents.length})
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button 
                variant={view === "grid" ? "default" : "outline"} 
                size="sm"
                onClick={() => setView("grid")}
                className="w-24"
              >
                Grid View
              </Button>
              <Button 
                variant={view === "list" ? "default" : "outline"} 
                size="sm"
                onClick={() => setView("list")}
                className="w-24"
              >
                List View
              </Button>
            </div>
          </div>
          
          <TabsContent value="upcoming">
            {upcomingEvents.length > 0 ? (
              view === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isReserved={true}
                      isLivestream={getReservationType(event.id)}
                      onCancel={() => cancelReservation(event.id)}
                    />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingEvents.map(event => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                              <img 
                                src={event.image} 
                                alt={event.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium hover:text-primary cursor-pointer" onClick={() => navigate(`/events/${event.id}`)}>
                                {event.title}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">{event.category}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{event.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{event.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getReservationType(event.id) ? (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Tv className="h-4 w-4" />
                              <span>Livestream</span>
                            </div>
                          ) : (
                            <span>In Person</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/events/${event.id}`)}
                            className="mr-2"
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelReservation(event.id)}
                          >
                            Cancel
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )
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
              view === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isReserved={true}
                      isLivestream={getReservationType(event.id)}
                      showActions={false}
                      className="opacity-80"
                    />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastEvents.map(event => (
                      <TableRow key={event.id} className="opacity-80">
                        <TableCell className="font-medium">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                              <img 
                                src={event.image} 
                                alt={event.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium hover:text-primary cursor-pointer" onClick={() => navigate(`/events/${event.id}`)}>
                                {event.title}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">{event.category}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{event.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{event.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getReservationType(event.id) ? (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Tv className="h-4 w-4" />
                              <span>Livestream</span>
                            </div>
                          ) : (
                            <span>In Person</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )
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
