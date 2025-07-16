import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { PropertyFilters } from "@/components/property-filters";
import { columns } from "@/components/property-columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Download } from "lucide-react";
import { fetchProperties, exportPropertiesToCSV } from "@/services/api";
import { toast } from "sonner";
import type { PropertyFilters as PropertyFiltersType } from "@/types/property";

const Properties = () => {
  const [filters, setFilters] = useState<PropertyFiltersType>({
    limit: 50,
  });
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => fetchProperties(filters),
  });

  const properties = data?.data || [];

  const handleFilterChange = (newFilters: PropertyFiltersType) => {
    setFilters(newFilters);
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // Remove the limit from filters for export to get all properties
      const exportFilters = { ...filters };
      delete exportFilters.limit;

      toast.info("Generating CSV export...");
      const response = await exportPropertiesToCSV(exportFilters);

      // Create download link
      const url = URL.createObjectURL(response);
      const link = document.createElement("a");
      link.href = url;

      // Use default filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `property-listings-${timestamp}.csv`;
      link.download = filename;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("CSV export completed successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export properties. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const stats = {
    total: properties.length,
    ...properties.reduce(
      (acc, property) => {
        acc[property.listing_type]++;
        return acc;
      },
      { sale: 0, rental: 0, lease: 0 }
    ),
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
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Badge variant="outline">Total: {stats.total}</Badge>
            <Badge variant="secondary">Sale: {stats.sale}</Badge>
            <Badge variant="secondary">Rental: {stats.rental}</Badge>
            <Badge variant="secondary">Lease: {stats.lease}</Badge>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleExportCSV}
                  disabled={isExporting}
                  variant="outline"
                  size="sm"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Export ALL listings from database to CSV (ignores pagination,
                  respects filters)
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
