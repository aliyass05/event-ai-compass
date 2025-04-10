import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import TranscriptUploader from "@/components/TranscriptUploader";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAI } from "@/context/AIContext";
import { useEvents } from "@/context/EventContext";
import { useAuth } from "@/context/AuthContext";
import { Lightbulb, Sparkles, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const RecommendedEvents = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { events, reserveEvent, cancelReservation, isEventReserved } = useEvents();
  const { transcript, recommendations, isProcessing, getRecommendations, modifyRecommendations } = useAI();
  const { toast } = useToast();
  
  const [modifyPrompt, setModifyPrompt] = useState("");
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    if (transcript && recommendations.length === 0 && !isProcessing) {
      getRecommendations(events);
    }
  }, [transcript, recommendations.length, isProcessing, getRecommendations, events]);
  
  const handleModifyRecommendations = () => {
    if (modifyPrompt.trim()) {
      modifyRecommendations(modifyPrompt, events);
      setModifyPrompt("");
    }
  };
  
  const handleEventAction = (eventId: string, isLivestream: boolean = false) => {
    if (isEventReserved(eventId)) {
      cancelReservation(eventId);
    } else {
      reserveEvent(eventId, isLivestream);
    }
  };
  
  const recommendedEvents = recommendations
    .map(rec => ({
      event: events.find(e => e.id === rec.eventId),
      score: rec.score,
      reason: rec.reason
    }))
    .filter(item => item.event !== undefined)
    .map(item => ({
      event: item.event!,
      score: item.score,
      reason: item.reason
    }));

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Recommended Events</h1>
          <p className="text-muted-foreground">
            Personalized event suggestions based on your academic interests
          </p>
        </div>
        
        {!transcript && (
          <div className="max-w-2xl mx-auto mb-12">
            <TranscriptUploader />
          </div>
        )}
        
        {transcript && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                  <h3 className="text-lg font-medium">Generating recommendations...</h3>
                  <p className="text-muted-foreground">
                    Our AI is analyzing your academic profile to find the best events for you.
                  </p>
                </div>
              ) : recommendedEvents.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">
                      We found {recommendedEvents.length} events for you
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recommendedEvents.map(({ event, score, reason }) => (
                      <div key={event.id} className="space-y-4 mb-6">
                        <EventCard
                          event={event}
                          isReserved={isEventReserved(event.id)}
                          isLivestream={isEventReserved(event.id) ? useEvents().getReservationType(event.id) : false}
                          onReserve={(isLivestream) => handleEventAction(event.id, isLivestream)}
                          onCancel={() => handleEventAction(event.id)}
                        />
                        <div className="px-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Match Score</span>
                            <span className="text-sm font-medium">{score}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                            <div
                              className="bg-primary h-1.5 rounded-full"
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-muted-foreground">{reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No recommendations yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    We couldn't find events that match your profile. Try adjusting your preferences or browse all events.
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate("/events")}
                  >
                    Browse All Events
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    <span>AI Recommendations</span>
                  </CardTitle>
                  <CardDescription>
                    Use AI to refine your event recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Textarea
                        placeholder="I'm interested in more technical workshops..."
                        className="min-h-[100px]"
                        value={modifyPrompt}
                        onChange={(e) => setModifyPrompt(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handleModifyRecommendations} 
                      disabled={!modifyPrompt.trim() || isProcessing}
                      className="w-full"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        "Update Recommendations"
                      )}
                    </Button>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Example prompts:</p>
                    <div className="space-y-2 text-sm">
                      <div 
                        className="p-2 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => setModifyPrompt("Show me more advanced technical workshops")}
                      >
                        "Show me more advanced technical workshops"
                      </div>
                      <div 
                        className="p-2 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => setModifyPrompt("I prefer events related to business and entrepreneurship")}
                      >
                        "I prefer events related to business and entrepreneurship"
                      </div>
                      <div 
                        className="p-2 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => setModifyPrompt("I'm a beginner looking for introductory events")}
                      >
                        "I'm a beginner looking for introductory events"
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Your Academic Profile</CardTitle>
                  <CardDescription>
                    Based on your uploaded transcript
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {transcript ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Courses ({transcript.courses.length}):</p>
                      <div className="max-h-[300px] overflow-y-auto pr-2">
                        {transcript.courses.map((course, index) => (
                          <div key={index} className="flex justify-between py-1 border-b text-sm">
                            <span className="font-mono">{course.code}</span>
                            <span className={`${
                              course.grade.startsWith('A') ? 'text-green-600' :
                              course.grade.startsWith('B') ? 'text-blue-600' :
                              course.grade.startsWith('C') ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>{course.grade}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-2">
                        Upload your transcript to see your academic profile
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EventAICompass. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default RecommendedEvents;
