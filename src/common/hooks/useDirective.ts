import Sortable from "sortablejs";
import { Ref, DirectiveBinding  } from "vue"

type MyDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding): void;
};

export const vDragable: MyDirective  = {
  mounted(el, binding) { 
    const options = binding.value;
    for (let oi = 0; oi < options.length; oi++) {
        const o: any = options[oi]; 
        new Sortable(el.querySelector(o.selector), o.option);
    }
  },
};