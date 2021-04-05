import { performAction } from "./js/app";
import "./styles/style.scss";
import img from "./media/background.jpg";
import destination_img from "./media/map_of_the_world.jpg";

//get
document.getElementById("generate").addEventListener("click", performAction);

export { performAction };
