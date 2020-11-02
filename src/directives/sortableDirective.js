import {DirectiveOptions} from 'vue';
import {Vue} from "vue-property-decorator";
import {Draggable, Droppable, Sortable, Swappable} from '@shopify/draggable'; 

const SortableDirective = {
   inserted(el, node, vNode) {
      new Sortable(el, node.value)
   }
}

Vue.directive('sortable', SortableDirective);

export default SortableDirective;