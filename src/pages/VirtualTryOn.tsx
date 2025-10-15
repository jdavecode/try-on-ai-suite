import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Camera, Ruler, Sparkles, Loader2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const VirtualTryOn = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    chest: "",
    waist: "",
    hips: "",
  });
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to upload photos",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProcessingStatus("Uploading image...");

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError, data } = await supabase.storage
        .from('user-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-photos')
        .getPublicUrl(fileName);

      setProcessingStatus("Processing image...");

      // Save to user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          photo_url: publicUrl,
        });

      if (profileError) throw profileError;

      setProcessingStatus("Avatar generated!");
      setAvatarUrl(publicUrl);

      toast({
        title: "Success!",
        description: "Your photo has been uploaded and processed.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setTimeout(() => setProcessingStatus(""), 3000);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const startCamera = async () => {
    try {
      setCapturing(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 }
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error: any) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use this feature.",
        variant: "destructive",
      });
      setCapturing(false);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !user) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        
        // Stop camera
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        setCapturing(false);
        
        await handleFileUpload(file);
      }
    }, 'image/jpeg', 0.9);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          height: parseFloat(measurements.height),
          weight: parseFloat(measurements.weight),
          chest: parseFloat(measurements.chest),
          waist: parseFloat(measurements.waist),
          hips: parseFloat(measurements.hips),
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your measurements have been saved.",
      });
      
      setShowManualInput(false);
      setMeasurements({
        height: "",
        weight: "",
        chest: "",
        waist: "",
        hips: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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

          {processingStatus && (
            <Card className="border-primary/20 bg-primary/5 mb-6">
              <CardContent className="p-6 flex items-center gap-4">
                {processingStatus.includes("generated") ? (
                  <Check className="h-6 w-6 text-primary" />
                ) : (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                )}
                <p className="font-medium">{processingStatus}</p>
              </CardContent>
            </Card>
          )}

          {avatarUrl && (
            <Card className="border-primary/20 bg-gradient-card mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Your Avatar Preview</h3>
                <img src={avatarUrl} alt="Generated avatar" className="w-full max-w-md mx-auto rounded-xl" />
              </CardContent>
            </Card>
          )}

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
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleUploadClick}
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Choose File"}
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
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={startCamera}
                    disabled={capturing}
                  >
                    {capturing ? "Camera Active" : "Open Camera"}
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
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowManualInput(true)}
                  >
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

      {/* Camera Dialog */}
      <Dialog open={capturing && stream !== null} onOpenChange={(open) => {
        if (!open && stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
          setCapturing(false);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Capture Your Photo</DialogTitle>
            <DialogDescription>
              Position yourself in the frame and click capture when ready
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <Button onClick={capturePhoto} className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Capture Photo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual Input Dialog */}
      <Dialog open={showManualInput} onOpenChange={setShowManualInput}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Your Measurements</DialogTitle>
            <DialogDescription>
              Provide your body measurements for accurate size recommendations
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Height (cm)</label>
              <Input
                type="number"
                step="0.1"
                value={measurements.height}
                onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })}
                placeholder="175"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Weight (kg)</label>
              <Input
                type="number"
                step="0.1"
                value={measurements.weight}
                onChange={(e) => setMeasurements({ ...measurements, weight: e.target.value })}
                placeholder="70"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Chest (cm)</label>
              <Input
                type="number"
                step="0.1"
                value={measurements.chest}
                onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })}
                placeholder="95"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Waist (cm)</label>
              <Input
                type="number"
                step="0.1"
                value={measurements.waist}
                onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                placeholder="80"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hips (cm)</label>
              <Input
                type="number"
                step="0.1"
                value={measurements.hips}
                onChange={(e) => setMeasurements({ ...measurements, hips: e.target.value })}
                placeholder="100"
              />
            </div>
            <Button type="submit" className="w-full">
              Save Measurements
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VirtualTryOn;
