import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { UseFieldArrayReturn } from "react-hook-form";
import { z } from "zod";
import { equipmentWithUnitsSchema } from "../schema/equipment-with-units";
import { getOrganizations } from "../services/inventory";

export function AddUnitForm(props: {
  units: UseFieldArrayReturn<z.infer<typeof equipmentWithUnitsSchema>>;
}) {
  const { data: organizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });

  return (
    <div>
      <Button
        type="button"
        className=""
        variant="secondary"
        onClick={() => {
          props.units.append({
            acquiredAt: new Date(),
            location: "",
            state: "ok",
            serialNumber: 0,
            organizationId: parseInt(organizations?.[0].organizationId ?? "1"),
          });
        }}
      >
        <PlusIcon />
        <span className="sr-only">Agregar unidad</span>
      </Button>
    </div>
  );
}
