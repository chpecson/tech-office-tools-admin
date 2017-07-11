import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanize'
})
export class HumanizePipe implements PipeTransform {

  transform(value: string, type?: any): any {
    if (!!value) {
      const FRAGMENTS = value.split('_');
      for (let charIndex = 0; charIndex < FRAGMENTS.length; charIndex++) {
        FRAGMENTS[charIndex] = FRAGMENTS[charIndex].charAt(0).toUpperCase() + FRAGMENTS[charIndex].slice(1);
      }
      return FRAGMENTS.join(' ');
    }
  }

}
