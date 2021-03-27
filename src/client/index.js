import { performAction } from "./js/app";
import "./styles/style.scss";
import img from "./media/background.jpg";

//get
document.getElementById("generate").addEventListener("click", performAction);

export { performAction };
