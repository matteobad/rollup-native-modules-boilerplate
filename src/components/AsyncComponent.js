import { debounce } from 'lodash-es';
import { Observable } from 'rxjs';

export default function AsyncComponent() {
  // In a real app you'd actually use these dependencies...
  this.debounce = debounce;
  this.Observable = Observable;
}
