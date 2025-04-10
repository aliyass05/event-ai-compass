
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/context/EventContext";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Clock, MapPin, Users, ArrowLeft } from "lucide-react";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEventById, getEventReviews, reserveEvent, cancelReservation, isEventReserved } = useEvents();
  const { isAuthenticated } = useAuth();
  const [refreshReviews, setRefreshReviews] = useState(0);
  
  const event = id ? getEventById(id) : undefined;
  const reviews = id ? getEventReviews(id) : [];
  
  useEffect(() => {
    if (!event) {
      navigate("/events");
    }
  }, [event, navigate]);
  
  if (!event) {
    return null;
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const isReserved = isEventReserved(event.id);
  
  const handleReservation = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (isReserved) {
      cancelReservation(event.id);
    } else {
      reserveEvent(event.id);
    }
  };
  
  const handleReviewSubmitted = () => {
    setRefreshReviews(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        <div className="relative aspect-[3/1] md:aspect-[5/1] overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        
        <div className="container py-8">
          <Button 
            variant="ghost" 
            className="mb-4 flex items-center gap-2"
            onClick={() => navigate("/events")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Events</span>
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge>{event.category}</Badge>
                  {event.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{event.registered} / {event.capacity} registered</span>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="pt-4">
                  <div className="prose max-w-none">
                    <p className="text-lg">{event.description}</p>
                    <h3 className="text-xl font-semibold mt-6 mb-3">About This Event</h3>
                    <p>
                      Join us for this exciting event at {event.location}. 
                      This is a great opportunity to expand your knowledge, network with peers, 
                      and gain valuable insights in the field of {event.category}.
                    </p>
                    <p>
                      Whether you're a beginner or advanced in this subject, 
                      this event will provide valuable content and opportunities for growth.
                    </p>
                    <h3 className="text-xl font-semibold mt-6 mb-3">What to Expect</h3>
                    <ul>
                      <li>Engaging presentations from experts in the field</li>
                      <li>Networking opportunities with peers and professionals</li>
                      <li>Hands-on activities and interactive discussions</li>
                      <li>Certificate of participation</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="pt-4">
                  <div className="space-y-8">
                    <ReviewList eventId={event.id} reviews={reviews} key={refreshReviews} />
                    
                    {isAuthenticated && (
                      <ReviewForm eventId={event.id} onReviewSubmitted={handleReviewSubmitted} />
                    )}
                    
                    {!isAuthenticated && (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground mb-2">
                          You need to be logged in to leave a review
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => navigate("/login")}
                        >
                          Login to Review
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="space-y-6">
              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Registration</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Available Spots</p>
                    <div className="w-full bg-background rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>{event.registered} registered</span>
                      <span>{event.capacity - event.registered} spots left</span>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full"
                    variant={isReserved ? "outline" : "default"}
                    onClick={handleReservation}
                    disabled={!isReserved && event.registered >= event.capacity}
                  >
                    {isReserved 
                      ? "Cancel Reservation" 
                      : event.registered >= event.capacity 
                        ? "Fully Booked" 
                        : "Reserve Your Spot"}
                  </Button>
                  
                  {!isAuthenticated && (
                    <p className="text-xs text-center text-muted-foreground">
                      You need to be logged in to reserve a spot
                    </p>
                  )}
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Location</h3>
                <div className="aspect-video bg-background rounded-md overflow-hidden mb-2">
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <MapPin className="h-8 w-8 text-muted-foreground opacity-50" />
                  </div>
                </div>
                <p className="font-medium">{event.location}</p>
                <p className="text-sm text-muted-foreground">
                  University Campus
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Share This Event</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Copy Link
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EventAICompass. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default EventDetail;
