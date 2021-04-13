import { performAction } from "./js/app";
import "./styles/style.scss";
import img from "./media/background.jpg";
import destination_img from "./media/map_of_the_world.jpg";
import { checkInputData } from "./js/checkData";
//import "./media/icons/c02n.png";

//import icons
function importAll(r) {
  return r.keys().map(r);
}
const icons = importAll(require.context("./media/icons/", false, /\.(png)$/));

//get
document.getElementById("generate").addEventListener("click", performAction);

export { performAction, checkInputData };
