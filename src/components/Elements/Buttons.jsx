
import "./Button.css"
export default function Buttons(props) {
  return <button className="submitBnt gradient-background" onClick={props.onClick} disabled={props.disabled}>{props.label}</button>;
}
