import {
  DISPLAY_STATES,
  EquipmentState,
  STATE_TO_ICON,
} from "../consts/equipment-state";

export default function EquipmentStateBadge(props: { state: EquipmentState }) {
  return (
    <div className="flex gap-2 items-center">
      <div>{STATE_TO_ICON[props.state as EquipmentState]}</div>
      <p className="text-nowrap">{DISPLAY_STATES[props.state]}</p>
    </div>
  );
}
