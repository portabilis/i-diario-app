import { Component, Input, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { SyncProvider } from '../../services/sync';

@Component({
  selector: 'tooltip',
  templateUrl: 'tooltip.html',
  host: {'class': 'tooltip-hide'}
})
export class TooltipComponent implements AfterViewInit, OnInit {
  @Input() private reference;
  private referenceEl: ElementRef;
  private tooltipBodyEl: ElementRef;
  private tooltipArrowEl: ElementRef;
  private tooltipOptions;

  constructor(
    private tooltipEl: ElementRef,
    private sync: SyncProvider,
  ) {}

  ngOnInit() {
    this.referenceEl = this.reference._elementRef;
    this.tooltipBodyEl = this.tooltipEl.nativeElement.children[1];
    this.tooltipArrowEl = this.tooltipEl.nativeElement.children[0];

    this.tooltipOptions = {
      top: 0,
      left: 0,
      arrowTop: 0,
      arrowLeft: 0,
    };
  }

  ngAfterViewInit() {

    this.tooltipOptions = {
      top: this.referenceEl.nativeElement.offsetTop,
      left: this.referenceEl.nativeElement.offsetLeft,
      height: this.referenceEl.nativeElement.offsetHeight,
      width: this.referenceEl.nativeElement.offsetWidth,
      position: getComputedStyle(this.referenceEl.nativeElement)['position'],
    };

    if (this.tooltipOptions.position === 'relative') {
      this.tooltipOptions.top += this.referenceEl.nativeElement.offsetParent.offsetTop;
      this.tooltipOptions.left += this.referenceEl.nativeElement.offsetParent.offsetLeft;
    }

    this.sync.tooltipEvent.subscribe((time) => {
      {
        this.setPosition();
        this.showTooltip();
        this.setTimer(time);
      }
    });
  }

  setTimer(time) {
    setTimeout(() => {
      this.hideTooltip();
    }, time*1000);
  }

  showTooltip() {
    this.tooltipEl.nativeElement.classList.remove('hide');
    this.tooltipEl.nativeElement.classList.remove('tooltip-hide');
    this.tooltipEl.nativeElement.classList.add('tooltip-show');
  }

  hideTooltip() {
    this.tooltipEl.nativeElement.classList.add('tooltip-hide');

    setTimeout(() => {
      this.tooltipEl.nativeElement.classList.remove('tooltip-show');

      setTimeout(() => {
        this.tooltipEl.nativeElement.classList.add('hide');
      }, 300);
    }, 3000);
  }

  setBodyStyle(bodyEl) {
    let tooltipTop: Number;
    let tooltipLeft: Number;

    tooltipTop = this.tooltipOptions.top + this.referenceEl.nativeElement.offsetHeight + 16;
    tooltipLeft = this.tooltipOptions.left  + this.referenceEl.nativeElement.offsetWidth - bodyEl.offsetWidth;
    bodyEl.style.transform = 'translate3d('+ tooltipLeft +'px,'+ tooltipTop +'px,0)';
  }

  setPosition() {
    this.setBodyStyle(this.tooltipBodyEl);
    this.setArrowStyle(this.tooltipArrowEl);
  }

  setArrowStyle(arrowEl) {
    let arrowTop: Number;
    let arrowLeft: Number;

    arrowTop = this.tooltipOptions.top + this.referenceEl.nativeElement.offsetHeight - 5;
    arrowLeft = this.tooltipOptions.left + this.referenceEl.nativeElement.offsetWidth/2 - 20;
    arrowEl.style.transform = 'translate3d('+ arrowLeft +'px,'+ arrowTop +'px,0)';
  }

}
