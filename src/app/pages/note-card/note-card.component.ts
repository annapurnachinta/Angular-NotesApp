import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit {

  @Input() title: string
  @Input() notebody: string
  @Input() link:string

  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>()

  @ViewChild('truncation', {static:true}) truncation: ElementRef<HTMLElement> 
  @ViewChild('bodyText', {static:true}) bodyText: ElementRef<HTMLElement> 

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    let style = window.getComputedStyle(this.bodyText.nativeElement, null)
    let viewableHeight = parseInt(style.getPropertyValue("height"), 10)

    if(this.bodyText.nativeElement.scrollHeight > viewableHeight){
      this.renderer.setStyle(this.truncation.nativeElement, 'display', 'block')
    }else{
      this.renderer.setStyle(this.truncation.nativeElement, 'display', 'none')
    }
  }

  onDelete(){
    this.deleteEvent.emit()
  }
}
