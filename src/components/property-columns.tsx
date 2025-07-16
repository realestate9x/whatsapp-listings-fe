import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MapPin, Bed, Bath, Car, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { Property } from "@/types/property";

export const columns: ColumnDef<Property>[] = [
  {
    accessorKey: "property_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Property
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const property = row.original;
      return (
        <div className="max-w-[200px]">
          <div className="font-medium">
            {property.property_name || "Unnamed Property"}
          </div>
          <div className="text-sm text-muted-foreground">
            {property.property_type && (
              <Badge variant="outline" className="text-xs">
                {property.property_type}
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "listing_type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue("listing_type") as string;
      const variants = {
        sale: "default",
        rental: "secondary",
        lease: "outline",
      } as const;

      return (
        <Badge variant={variants[type as keyof typeof variants] || "outline"}>
          {type?.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.getValue("price") as string;
      const priceNumeric = row.original.price_numeric;

      if (!price && !priceNumeric) {
        return <span className="text-muted-foreground">N/A</span>;
      }

      return (
        <div className="font-medium">
          {price || `₹${priceNumeric?.toLocaleString()}`}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.price_numeric || 0;
      const b = rowB.original.price_numeric || 0;
      return a - b;
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const location = row.getValue("location") as string;
      const areaName = row.original.area_name;
      const city = row.original.city;

      return (
        <div className="max-w-[200px]">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">
              {location || areaName || city || "Not specified"}
            </span>
          </div>
          {areaName && location !== areaName && (
            <div className="text-xs text-muted-foreground">{areaName}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "bedrooms",
    header: "Details",
    cell: ({ row }) => {
      const bedrooms = row.getValue("bedrooms") as number;
      const bathrooms = row.original.bathrooms;
      const areaSqft = row.original.area_sqft;
      const parkingCount = row.original.parking_count;
      const parking = row.original.parking;

      return (
        <div className="flex flex-wrap gap-2">
          {bedrooms && (
            <div className="flex items-center gap-1 text-sm">
              <Bed className="h-3 w-3" />
              <span>{bedrooms}</span>
            </div>
          )}
          {bathrooms && (
            <div className="flex items-center gap-1 text-sm">
              <Bath className="h-3 w-3" />
              <span>{bathrooms}</span>
            </div>
          )}
          {areaSqft && (
            <div className="text-sm">{areaSqft.toLocaleString()} sq ft</div>
          )}
          {(parkingCount || parking) && (
            <div className="flex items-center gap-1 text-sm">
              <Car className="h-3 w-3" />
              <span>{parkingCount || (parking ? "Yes" : "No")}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "furnishing",
    header: "Furnishing",
    cell: ({ row }) => {
      const furnishing = row.getValue("furnishing") as string;

      if (!furnishing) {
        return <span className="text-muted-foreground">N/A</span>;
      }

      const variants = {
        furnished: "default",
        "semi-furnished": "secondary",
        unfurnished: "outline",
      } as const;

      return (
        <Badge
          variant={variants[furnishing as keyof typeof variants] || "outline"}
          className="text-xs"
        >
          {furnishing}
        </Badge>
      );
    },
  },
  {
    accessorKey: "parsing_confidence",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Confidence
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const confidence = row.getValue("parsing_confidence") as number;

      if (!confidence) {
        return <span className="text-muted-foreground">N/A</span>;
      }

      const percentage = Math.round(confidence * 100);
      let variant: "default" | "secondary" | "destructive" = "default";

      if (percentage < 50) {
        variant = "destructive";
      } else if (percentage < 80) {
        variant = "secondary";
      }

      return (
        <Badge variant={variant} className="text-xs">
          {percentage}%
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Added
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;

      return (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span>{format(new Date(date), "MMM d, yyyy")}</span>
        </div>
      );
    },
  },
];
