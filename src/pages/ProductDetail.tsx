import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Sparkles } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState("M");

  const products: Record<string, any> = {
    "1": { name: "Premium Cotton Tee", price: "$49", image: product1, description: "Ultra-soft premium cotton t-shirt with perfect fit" },
    "2": { name: "Leather Jacket", price: "$299", image: product2, description: "Genuine leather jacket with modern cut and style" },
    "3": { name: "Classic Denim", price: "$89", image: product3, description: "Timeless denim jeans with comfortable stretch" },
  };

  const product = products[id || "1"] || products["1"];
  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-12">
        <Button variant="ghost" className="mb-8" asChild>
          <Link to="/shop">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden border-border/50">
              <div className="aspect-square bg-muted relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-primary/90">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Try On Available
                </Badge>
              </div>
            </Card>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden border-border/50 cursor-pointer hover:border-primary transition-colors">
                  <div className="aspect-square bg-muted">
                    <img 
                      src={product.image} 
                      alt={`View ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
                {product.price}
              </p>
              <p className="text-lg text-muted-foreground">
                {product.description}
              </p>
            </div>

            {/* Size Selector */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Select Size</h3>
                <Button variant="link" className="text-primary">
                  Size Guide
                </Button>
              </div>
              <div className="flex gap-3">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className="w-16 h-12"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* AI Recommendation */}
            <Card className="bg-gradient-card border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">AI Size Recommendation</h4>
                    <p className="text-sm text-muted-foreground">
                      Based on your profile, we recommend size <strong className="text-foreground">M</strong> for the best fit.
                      This should give you a comfortable regular fit.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full gap-2 shadow-glow" asChild>
                <Link to="/virtual-tryon">
                  <Sparkles className="h-5 w-5" />
                  Try On Virtually
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full gap-2">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            {/* Product Details */}
            <Card className="border-border/50">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Product Details</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Material</span>
                    <span className="text-foreground">100% Premium Cotton</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fit</span>
                    <span className="text-foreground">Regular</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Care</span>
                    <span className="text-foreground">Machine Wash</span>
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

export default ProductDetail;
