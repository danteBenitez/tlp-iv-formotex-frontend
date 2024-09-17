import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EquipmentUnit } from "../interface/equipment-unit";
import EquipmentStateBadge from "./equipment-state-badge";

export default function EquipmentUnitRow(
  props: EquipmentUnit & {
    selected: boolean;
    onChange: (b: number | null) => void;
  }
) {
  return (
    <TableRow className={cn(props.selected && "bg-blue-800 hover:bg-blue-900")}>
      <Input type="hidden" value={props.equipmentUnitId} />
      <TableCell>
        <Checkbox
          checked={props.selected}
          onCheckedChange={(checked) => {
            if (checked) {
              props.onChange(props.equipmentUnitId);
            } else {
              props.onChange(null);
            }
          }}
        />
      </TableCell>
      <TableCell>{props.equipment?.name}</TableCell>
      <TableCell>{props.serialNumber}</TableCell>
      <TableCell>{props.location}</TableCell>
      <TableCell>
        <EquipmentStateBadge state={props.state} />
      </TableCell>
      <TableCell>{format(props.acquiredAt, "PPP", { locale: es })}</TableCell>
      <TableCell>{props.organization?.name}</TableCell>
    </TableRow>
  );
}
