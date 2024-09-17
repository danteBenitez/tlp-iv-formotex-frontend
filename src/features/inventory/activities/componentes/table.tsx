import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Table, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { CenteredSpinner } from "@/features/common/components/spinner";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronDown,
  ChevronUp,
  FilePlus2,
  Package,
  Truck,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { MOVEMENT_TYPES, MovementType } from "../../consts/movement-types";
import { Movement } from "../../interface/movement";
import { getAllActivities } from "../service/activities";

const hasDetails = (type: MovementType) => {
  return type == MOVEMENT_TYPES.DELIVERY || type == MOVEMENT_TYPES.MAINTENANCE;
};

export default function ActivitiesTable() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["inventory", "activities"],
    queryFn: getAllActivities,
  });
  const [expanded, setExpanded] = useState<number | null>(null);
  if (isLoading) {
    return <CenteredSpinner />;
  }

  return (
    <Table>
      <TableHeader>
        <TableCell>Autor</TableCell>
        <TableCell>Equipamiento</TableCell>
        <TableCell>Unidad</TableCell>
        <TableCell>Tipo</TableCell>
        <TableCell>
          <span className="sr-only">Detalles</span>
        </TableCell>
      </TableHeader>
      {activities &&
        activities.map((act, i) => {
          return (
            <Collapsible asChild open={expanded == i}>
              <>
                <TableRow>
                  <TableCell className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>
                        {act?.author?.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {act?.author?.username}
                  </TableCell>
                  <TableCell>{act.unit?.equipment?.name}</TableCell>
                  <TableCell>{act.unit?.serialNumber}</TableCell>
                  <TableCell className="flex justify-stretch w-[4rem]">
                    <ActivityTypeBadge type={act.type.name} />
                  </TableCell>
                  {hasDetails(act.type.name) && (
                    <TableCell>
                      <Button variant="ghost">
                        {expanded != i ? (
                          <ChevronDown onClick={() => setExpanded(i)} />
                        ) : (
                          <ChevronUp onClick={() => setExpanded(null)} />
                        )}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
                {expanded == i ? (
                  <TableRow className="h-0">
                    <TableCell colSpan={5}>
                      <CollapsibleContent>
                        <DetailsForActivity activity={act} />
                      </CollapsibleContent>
                    </TableCell>
                  </TableRow>
                ) : null}
              </>
            </Collapsible>
          );
        })}
    </Table>
  );
}

const TYPE_TO_DISPLAY = {
  [MOVEMENT_TYPES.ENTRY]: "Ingreso",
  [MOVEMENT_TYPES.DELIVERY]: "Entrega",
  [MOVEMENT_TYPES.MAINTENANCE]: "Mantenimiento",
  [MOVEMENT_TYPES.TRANSPORT]: "Transporte",
};

const TYPE_TO_ICON = {
  [MOVEMENT_TYPES.ENTRY]: <FilePlus2 className="size-4" />,
  [MOVEMENT_TYPES.DELIVERY]: <Package className="size-4" />,
  [MOVEMENT_TYPES.MAINTENANCE]: <Wrench className="size-4" />,
  [MOVEMENT_TYPES.TRANSPORT]: <Truck className="size-4" />,
};

const TYPE_TO_CLASS = {
  [MOVEMENT_TYPES.ENTRY]: "border-green-400",
  [MOVEMENT_TYPES.DELIVERY]: "border-blue-400",
  [MOVEMENT_TYPES.MAINTENANCE]: "border-yellow-400",
  [MOVEMENT_TYPES.TRANSPORT]: "border-orange-400",
};

export function ActivityTypeBadge(props: { type: MovementType }) {
  return (
    <Badge
      variant={"outline"}
      className={cn(
        "border flex gap-2 items-center p-4",
        TYPE_TO_CLASS[props.type]
      )}
    >
      <div>{TYPE_TO_ICON[props.type]}</div>
      <p className="text-nowrap">{TYPE_TO_DISPLAY[props.type]}</p>
    </Badge>
  );
}

export function DetailsForActivity(props: { activity: Movement }) {
  if (props.activity.type.name == MOVEMENT_TYPES.MAINTENANCE) {
    return "startedAt" in props.activity.details ? (
      <Card>
        <CardHeader>
          <CardTitle>Detalles de actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Fecha de inicio de mantenimiento</Label>
              {format(props.activity.details.startedAt, "PPP", { locale: es })}
            </div>
            <div className="grid gap-3">
              <Label>Fecha de finalización</Label>
              {format(props.activity.details.endedAt, "PPP", { locale: es })}
            </div>
          </div>
        </CardContent>
      </Card>
    ) : null;
  }

  if (props.activity.type.name == MOVEMENT_TYPES.DELIVERY) {
    return (
      <div>
        {"organization" in props.activity.details ? (
          <Card>
            <CardHeader>
              <CardTitle>Detalles de actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <CardDescription className="flex flex-col gap-4">
                    <div className="my-2">
                      <Label className="text-xl">
                        Entregado a organización
                      </Label>
                      <div>{props.activity.details.organization.name}</div>
                    </div>
                    <div className="mb-2">
                      <Label className="text-xl">Ubicación</Label>
                      <div>{props.activity.details.organization.location}</div>
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    );
  }

  return <div>No hay detalles</div>;
}
