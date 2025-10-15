import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Ruler, Sparkles } from "lucide-react";

const VirtualTryOn = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold">Virtual Try-On Studio</h1>
            <p className="text-xl text-muted-foreground">
              Create your digital avatar and see how clothes fit your body
            </p>
          </div>

          <Card className="border-primary/20 bg-gradient-card">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-4 p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-colors">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Upload Photo</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a full-body photo to create your 3D avatar
                  </p>
                  <Button variant="outline" className="w-full">
                    Choose File
                  </Button>
                </div>

                <div className="text-center space-y-4 p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-colors">
                  <div className="h-16 w-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto">
                    <Camera className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-lg">Use Camera</h3>
                  <p className="text-sm text-muted-foreground">
                    Take a photo directly with your device camera
                  </p>
                  <Button variant="outline" className="w-full">
                    Open Camera
                  </Button>
                </div>

                <div className="text-center space-y-4 p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-colors">
                  <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
                    <Ruler className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">Manual Input</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your measurements manually
                  </p>
                  <Button variant="outline" className="w-full">
                    Enter Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-border/50">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Sparkles className="h-6 w-6 text-primary mt-1" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Coming Soon: Full AI Try-On</h3>
                  <p className="text-muted-foreground">
                    This feature is currently in development. Once complete, you'll be able to:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                    <li>• Generate a realistic 3D avatar from your photo</li>
                    <li>• See how any item fits your exact body shape</li>
                    <li>• Rotate and view from all angles (360°)</li>
                    <li>• Get AI-powered fit predictions (tight, perfect, loose)</li>
                    <li>• Mix and match outfits virtually</li>
                  </ul>
                  <p className="text-sm text-muted-foreground pt-2">
                    For now, you can still browse products and use our AI size recommendations on product pages!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;
