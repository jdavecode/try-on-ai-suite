import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const products = [
    { id: 1, name: "Premium Cotton Tee", price: "$49", category: "Tops", image: product1 },
    { id: 2, name: "Leather Jacket", price: "$299", category: "Outerwear", image: product2 },
    { id: 3, name: "Classic Denim", price: "$89", category: "Bottoms", image: product3 },
    { id: 4, name: "Cashmere Sweater", price: "$159", category: "Tops", image: product1 },
    { id: 5, name: "Bomber Jacket", price: "$199", category: "Outerwear", image: product2 },
    { id: 6, name: "Slim Fit Chinos", price: "$79", category: "Bottoms", image: product3 },
  ];

  const categories = ["All", "Tops", "Bottoms", "Outerwear"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-12">
        <div className="mb-12 space-y-4">
          <h1 className="text-5xl font-bold">Shop Collection</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Browse our curated selection. Try on virtually before you buy.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
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
                  <div className="mb-2 text-sm text-muted-foreground">{product.category}</div>
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {product.price}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
