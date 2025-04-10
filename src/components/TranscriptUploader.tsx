
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAI } from "@/context/AIContext";
import { FileUp, Check } from "lucide-react";

const TranscriptUploader: React.FC = () => {
  const { uploadTranscript, transcript } = useAI();
  const [jsonInput, setJsonInput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedTranscript = JSON.parse(jsonInput);
      if (!parsedTranscript.courses || !Array.isArray(parsedTranscript.courses)) {
        throw new Error("Invalid transcript format. Must include courses array.");
      }
      uploadTranscript(parsedTranscript);
      setError("");
    } catch (err) {
      setError("Invalid JSON format. Please check your input.");
    }
  };

  const handleSampleData = () => {
    const sampleTranscript = {
      courses: [
        { code: "CS101", name: "Introduction to Computer Science", grade: "A" },
        { code: "MATH202", name: "Advanced Calculus", grade: "B+" },
        { code: "PSY110", name: "Introduction to Psychology", grade: "A-" },
        { code: "BUS201", name: "Business Ethics", grade: "B" },
        { code: "ENG240", name: "Modern Literature", grade: "A-" },
        { code: "ENV150", name: "Environmental Science", grade: "B+" }
      ]
    };
    setJsonInput(JSON.stringify(sampleTranscript, null, 2));
    setError("");
  };

  if (transcript) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            Transcript Uploaded
          </CardTitle>
          <CardDescription>
            Your transcript has been uploaded and will be used for recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md max-h-60 overflow-auto">
            <h3 className="font-medium mb-2">Courses:</h3>
            <ul className="space-y-1">
              {transcript.courses.map((course, index) => (
                <li key={index} className="text-sm flex justify-between">
                  <span>
                    <span className="font-mono">{course.code}</span> - {course.name}
                  </span>
                  <span className={`font-medium ${
                    course.grade.startsWith('A') ? 'text-green-600' :
                    course.grade.startsWith('B') ? 'text-blue-600' :
                    course.grade.startsWith('C') ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {course.grade}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="h-5 w-5" />
          Upload Your Transcript
        </CardTitle>
        <CardDescription>
          Paste your transcript in JSON format to get personalized event recommendations
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="transcript">Transcript (JSON format)</Label>
            <Textarea
              id="transcript"
              placeholder='{"courses": [{"code": "CS101", "name": "Introduction to Computer Science", "grade": "A"}]}'
              className="font-mono h-40"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleSampleData}>
            Use Sample Data
          </Button>
          <Button type="submit">Upload Transcript</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TranscriptUploader;
