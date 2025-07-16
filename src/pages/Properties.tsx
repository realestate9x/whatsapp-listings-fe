import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { PropertyFilters } from "@/components/property-filters";
import { columns } from "@/components/property-columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { fetchProperties } from "@/services/api";
import type { PropertyFilters as PropertyFiltersType } from "@/types/property";

const Properties = () => {
  const [filters, setFilters] = useState<PropertyFiltersType>({
    limit: 50,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => fetchProperties(filters),
  });

  const properties = data?.data || [];

  const handleFilterChange = (newFilters: PropertyFiltersType) => {
    setFilters(newFilters);
  };

  const stats = {
    total: properties.length,
    sale: properties.filter((p) => p.listing_type === "sale").length,
    rental: properties.filter((p) => p.listing_type === "rental").length,
    lease: properties.filter((p) => p.listing_type === "lease").length,
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading properties:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Property Listings</h1>
        <div className="flex gap-2">
          <Badge variant="outline">Total: {stats.total}</Badge>
          <Badge variant="secondary">Sale: {stats.sale}</Badge>
          <Badge variant="secondary">Rental: {stats.rental}</Badge>
          <Badge variant="secondary">Lease: {stats.lease}</Badge>
        </div>
      </div>

      <PropertyFilters onFilterChange={handleFilterChange} />

      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading properties...</span>
            </div>
          ) : (
            <DataTable columns={columns} data={properties} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Properties;
