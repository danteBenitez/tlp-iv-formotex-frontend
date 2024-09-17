import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { UseFieldArrayReturn } from "react-hook-form";
import toast from "react-hot-toast";
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
          if (organizations && organizations.length === 0) {
            toast.error(
              "No se pudieron encontrar organizaciones. Por favor, cree una antes de insertar una unidad"
            );
            return;
          }
          props.units.append({
            acquiredAt: new Date(),
            location: "",
            state: "ok",
            serialNumber: 0,
            organizationId: parseInt(organizations?.[0]?.organizationId ?? ""),
          });
        }}
      >
        <PlusIcon />
        <span>Agregar unidad</span>
      </Button>
    </div>
  );
}
