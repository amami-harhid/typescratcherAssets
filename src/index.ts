import { Gui } from "./gui";
import { loadingSpinner } from "./gui/loadingSpinner";

loadingSpinner();

Gui.createLayout();
Gui.viewFirst();
Gui.lazyLoad();
    