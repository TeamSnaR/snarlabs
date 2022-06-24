import { Component, OnInit, ViewEncapsulation } from '@angular/core';

/* eslint-disable */

@Component({
  selector: 'snarlabs-nx-welcome',
  template: `
    <div class="space-y-4">
      <div class="w-96 bg-white shadow rounded">w-96</div>
      <div class="w-80 bg-white shadow rounded">w-80</div>
      <div class="w-72 bg-white shadow rounded">w-72</div>
      <div class="w-64 bg-white shadow rounded">w-64</div>
      <div class="w-60 bg-white shadow rounded">w-60</div>
      <div class="w-56 bg-white shadow rounded">w-56</div>
      <div class="w-52 bg-white shadow rounded">w-52</div>
      <div class="w-48 bg-white shadow rounded">w-48</div>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class NxWelcomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
