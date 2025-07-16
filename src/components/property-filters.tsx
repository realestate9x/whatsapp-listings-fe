import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Search } from "lucide-react";
import type { PropertyFilters } from "@/types/property";

interface PropertyFiltersProps {
  onFilterChange: (filters: PropertyFilters) => void;
}

export function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<PropertyFilters>({
    limit: 50,
  });
  const [isDebouncing, setIsDebouncing] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounce the filter changes
  const debouncedOnFilterChange = useCallback(
    (newFilters: PropertyFilters) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      setIsDebouncing(true);
      debounceRef.current = setTimeout(() => {
        onFilterChange(newFilters);
        setIsDebouncing(false);
      }, 300);
    },
    [onFilterChange]
  );

  // Apply debounced filter changes
  useEffect(() => {
    debouncedOnFilterChange(filters);

    // Cleanup on unmount
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [filters, debouncedOnFilterChange]);

  const handleFilterChange = (
    key: keyof PropertyFilters,
    value: PropertyFilters[keyof PropertyFilters]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      limit: 50,
      listing_type: undefined,
      property_type: undefined,
      location: undefined,
      min_price: undefined,
      max_price: undefined,
      bedrooms: undefined,
      min_parking_count: undefined,
      min_confidence: undefined,
    };
    setFilters(clearedFilters);

    // Clear any pending debounce and immediately apply cleared filters
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    setIsDebouncing(false);
    onFilterChange(clearedFilters);
  };

  const activeFiltersCount = Object.keys(filters).filter(
    (key) => key !== "limit" && filters[key as keyof PropertyFilters]
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
          {isDebouncing && (
            <Badge variant="outline" className="text-xs">
              Applying...
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Listing Type */}
          <div className="space-y-2">
            <Label htmlFor="listing-type">Listing Type</Label>
            <Select
              value={filters.listing_type || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "listing_type",
                  value === "all" ? undefined : value
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="rental">Rental</SelectItem>
                <SelectItem value="lease">Lease</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <Label htmlFor="property-type">Property Type</Label>
            <Select
              value={filters.property_type || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "property_type",
                  value === "all" ? undefined : value
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All properties</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="shop">Shop</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Search location..."
                value={filters.location || ""}
                onChange={(e) =>
                  handleFilterChange("location", e.target.value || undefined)
                }
                className="pl-8"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Select
              value={filters.bedrooms?.toString() || "any"}
              onValueChange={(value) =>
                handleFilterChange(
                  "bedrooms",
                  value === "any" ? undefined : parseInt(value)
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1 BHK</SelectItem>
                <SelectItem value="2">2 BHK</SelectItem>
                <SelectItem value="3">3 BHK</SelectItem>
                <SelectItem value="4">4 BHK</SelectItem>
                <SelectItem value="5">5+ BHK</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Min Price */}
          <div className="space-y-2">
            <Label htmlFor="min-price">Min Price (₹)</Label>
            <Input
              id="min-price"
              type="number"
              placeholder="Min price"
              value={filters.min_price || ""}
              onChange={(e) =>
                handleFilterChange(
                  "min_price",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            />
          </div>

          {/* Max Price */}
          <div className="space-y-2">
            <Label htmlFor="max-price">Max Price (₹)</Label>
            <Input
              id="max-price"
              type="number"
              placeholder="Max price"
              value={filters.max_price || ""}
              onChange={(e) =>
                handleFilterChange(
                  "max_price",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            />
          </div>

          {/* Min Parking */}
          <div className="space-y-2">
            <Label htmlFor="min-parking">Min Parking</Label>
            <Select
              value={filters.min_parking_count?.toString() || "any"}
              onValueChange={(value) =>
                handleFilterChange(
                  "min_parking_count",
                  value === "any" ? undefined : parseInt(value)
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1+ Space</SelectItem>
                <SelectItem value="2">2+ Spaces</SelectItem>
                <SelectItem value="3">3+ Spaces</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Min Confidence */}
          <div className="space-y-2">
            <Label htmlFor="min-confidence">Min Confidence</Label>
            <Select
              value={filters.min_confidence?.toString() || "any"}
              onValueChange={(value) =>
                handleFilterChange(
                  "min_confidence",
                  value === "any" ? undefined : parseFloat(value)
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="0.5">50%+</SelectItem>
                <SelectItem value="0.7">70%+</SelectItem>
                <SelectItem value="0.8">80%+</SelectItem>
                <SelectItem value="0.9">90%+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={activeFiltersCount === 0}
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
