import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Scan, Ruler, Shirt } from "lucide-react";
import Header from "@/components/Header";
import heroImage from "@/assets/hero-tryon.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const Home = () => {
  const features = [
    {
      icon: Scan,
      title: "AI Body Scanning",
      description: "Upload a photo or enter measurements to create your digital avatar"
    },
    {
      icon: Shirt,
      title: "Virtual Try-On",
      description: "See how clothes fit on your body before buying"
    },
    {
      icon: Ruler,
      title: "Smart Sizing",
      description: "Get personalized size recommendations based on your body type"
    },
    {
      icon: Sparkles,
      title: "AI Styling",
      description: "Personal fashion assistant to help you find your perfect look"
    }
  ];

  const featuredProducts = [
    { id: 1, name: "Premium Cotton Tee", price: "$49", image: product1 },
    { id: 2, name: "Leather Jacket", price: "$299", image: product2 },
    { id: 3, name: "Classic Denim", price: "$89", image: product3 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="container relative py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block">
                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                  ✨ Powered by AI
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Try Before You Buy
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Virtually
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Experience the future of online shopping with AI-powered virtual try-ons. 
                See exactly how clothes fit your body before purchasing.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gap-2 shadow-glow" asChild>
                  <Link to="/shop">
                    Start Shopping <Sparkles className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/how-it-works">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-20 animate-glow-pulse"></div>
              <img 
                src={heroImage}
                alt="Virtual Try-On Technology" 
                className="relative rounded-2xl shadow-elegant w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI technology makes online shopping smarter and more personalized
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 bg-gradient-card backdrop-blur hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-24">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold">Featured Collection</h2>
            <p className="text-muted-foreground">Our most popular items</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/shop">View All</Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="overflow-hidden border-border/50 hover:shadow-glow transition-all duration-300 hover:scale-105 group">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {product.price}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <Card className="relative overflow-hidden bg-gradient-card border-primary/20">
          <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
          <CardContent className="relative p-12 text-center space-y-6">
            <h2 className="text-4xl font-bold">Ready to Transform Your Shopping?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create your profile and start experiencing the future of fashion
            </p>
            <Button size="lg" className="gap-2 shadow-glow" asChild>
              <Link to="/auth">
                Get Started Free <Sparkles className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Home;
